import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  Production,
  Service,
  Installation,
  ManufacturingFacilities,
  Pages,
  ServiceStates,
  ProductionStates,
  WorkOrderSelectOptions,
  MissingData,
} from "app/utils/constants";
import {
  YMDDateFormat,
  generateDaySummaryData,
  mapServiceEventStateToKey,
  mapProductionStateToKey,
  isValueValid,
} from "app/utils/utils";

import moment from "moment";

// -- Production API
import { updateState, updateEventDates } from "app/api/productionApis";

// -- Service API
//import {
//  updateServiceWorkOrderState,
//  updateServiceWorkOrderSchedule,
//} from "app/api/serviceApis";

import {
  updateFilters,
  updateShowMessage,
  updateSelectedEvent,
  updateMarkedWorkOrderId,
  updateWorkOrderData,
  updateResult,
  updateDayWorkOrders,
  updateWeekWorkOrders,
  createProductionEvents,
  createInstallationEvents,
  createServiceEvents,
  updateIsLoading,
  updateProductionEvents,
  clearEvents,
} from "app/redux/orders";

const useCalendarEvents = ({ date, workOrders, departmentParam }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [dayTotals, setDayTotals] = useState({});
  const [weekTotals, setWeekTotals] = useState({});
  const [changeEvent, setChangeEvent] = useState(null);
  const [daySummaryWorkOrders, setDaySummaryWorkOrders] = useState([]);
  const [weekSummaryWorkOrders, setWeekSummaryWorkOrders] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState(null);

  const {
    department,
    filters,
    branch,
    showMessage,
    workOrderData,
    events,
    appliedFilteredWorkOrders,
    page,
  } = useSelector((state) => state.orders);

  // Build Events
  useEffect(() => {
    if (workOrders?.data && departmentParam) {
      if (workOrders?.config?.url?.toLowerCase().includes(departmentParam)) {
        switch (departmentParam) {
          case Production:
            let events = buildProductionEvents(workOrders.data);
            dispatch(updateProductionEvents(events));
            break;
          case Installation:
            dispatch(
              createInstallationEvents({
                workOrders: workOrders.data,
              })
            );
            break;
          case Service:
            dispatch(
              createServiceEvents({
                workOrders: workOrders.data,
              })
            );
            break;
          default:
            // Clear workorders
            dispatch(clearEvents());
            break;
        }
      } else {
        dispatch(clearEvents());
      }
    }
  }, [dispatch, workOrders, departmentParam]);

  useEffect(() => {
    let result = [];
    let flattenedFilters = [];
    let filteredOutValues = [];

    if (events?.length > 0 && filters) {
      filters.forEach((f) => {
        // Flatten
        let _f = JSON.parse(JSON.stringify(f));
        _f.fields.forEach((ff) => {
          ff.groupKey = f.key;
        });
        flattenedFilters.push(..._f.fields);
      });

      filteredOutValues = flattenedFilters.filter((f) => f.value === false);

      events.forEach((e) => {
        let hidden = false;

        filteredOutValues.forEach((h) => {
          if (h.eventValue !== "boolean") {
            // Event value is text
            if (
              h.key?.toLowerCase() === e[h.groupKey]?.toLowerCase() ||
              h.label?.toLowerCase() === e[h.groupKey]?.toLowerCase()
            ) {
              hidden = true;
            }
          } else {
            // If event property is a boolean value (e.g. Rush and Engineered)
            if (!h.value && e[h.key]) {
              hidden = true;
            }
          }
        });

        if (!hidden) {
          if (appliedFilteredWorkOrders?.length > 0) {
            let found = appliedFilteredWorkOrders.find(
              (x) => x.workOrderNumber === e.title
            );
            if (found) {
              result.push(e);
            }
          } else {
            result.push(e);
          }
        }
      });
    }

    if (result?.length > 0) {
      setFilteredEvents(result);
    }
  }, [events, filters, appliedFilteredWorkOrders, setFilteredEvents]);

  // Update filters based on ManufacturingFacility
  useEffect(() => {
    if (department) {
      if (department.key === Production || department.key === Service) {
        if (branch && filters) {
          const manufacturingFacilityIndex = filters.findIndex(
            (x) => x.key === "manufacturingFacility"
          );
          const langleyIndex = 0;
          const calgaryIndex = 1;

          let _filters = JSON.parse(JSON.stringify(filters));

          switch (branch) {
            case ManufacturingFacilities.langley:
              _filters[manufacturingFacilityIndex].fields[
                langleyIndex
              ].value = true;
              _filters[manufacturingFacilityIndex].fields[
                calgaryIndex
              ].value = false;
              break;
            case ManufacturingFacilities.calgary:
              _filters[manufacturingFacilityIndex].fields[
                langleyIndex
              ].value = false;
              _filters[manufacturingFacilityIndex].fields[
                calgaryIndex
              ].value = true;
              break;
            default:
              _filters[manufacturingFacilityIndex].fields[
                langleyIndex
              ].value = true;
              _filters[manufacturingFacilityIndex].fields[
                calgaryIndex
              ].value = true;
              break;
          }

          if (JSON.stringify(filters) !== JSON.stringify(_filters)) {
            // For Branch Selection to update first before the events
            if (showMessage) {
              setTimeout(() => {
                dispatch(updateFilters(_filters));
                dispatch(updateShowMessage({ value: false }));
              }, 1000);
            } else {
              dispatch(updateFilters(_filters));
            }
          }
        }
      }
    }
  }, [dispatch, department, branch, filters, showMessage]);

  // -------- Summary Data --------
  useEffect(() => {
    if (workOrders?.data && (page === Pages.day || page === Pages.week)) {
      // -------- Day Summary Data --------
      let _filteredDayWorkOrders = [];

      // Get all workorders for that day
      let dayWorkOrders = workOrders?.data?.filter(
        (x) => YMDDateFormat(x.startDateTime) === YMDDateFormat(date)
      );

      dispatch(updateDayWorkOrders([...dayWorkOrders]));

      if (dayWorkOrders) {
        dayWorkOrders.forEach((dwo) => {
          if (filteredEvents?.find((fe) => fe.title === dwo.workOrderNumber)) {
            _filteredDayWorkOrders.push(dwo);
          }
        });

        setDaySummaryWorkOrders([..._filteredDayWorkOrders]);

        //  -------- Week Summary Data --------
        let weekSelectionWorkOrders = [];
        let _filteredWeekWorkOrders = [];
        _filteredDayWorkOrders = [];
        let _startDate = moment(date).startOf("week");

        for (let i = 0; i < 7; i++) {
          _filteredDayWorkOrders = [];

          // Get all workorders for that day
          let dayWorkOrders = workOrders?.data?.filter(
            (x) =>
              YMDDateFormat(x.startDateTime) ===
              YMDDateFormat(moment(_startDate)?.add(i, "days"))
          );

          weekSelectionWorkOrders.push(...dayWorkOrders); // For calendar filter selection

          // If workorder is present in the filtered events list, add work order to summary list data
          dayWorkOrders.forEach((dwo) => {
            if (
              filteredEvents?.find((fe) => fe.title === dwo.workOrderNumber)
            ) {
              _filteredDayWorkOrders.push(dwo);
            }
          });

          _filteredWeekWorkOrders.push({
            date: moment(_startDate).add(i, "days"),
            workOrders: [..._filteredDayWorkOrders],
          });

          setWeekSummaryWorkOrders(_filteredWeekWorkOrders);
        }

        dispatch(updateWeekWorkOrders(weekSelectionWorkOrders));
      }
    }
  }, [
    dispatch,
    workOrders,
    date,
    filteredEvents,
    setDaySummaryWorkOrders,
    setWeekSummaryWorkOrders,
    page,
  ]);

  useEffect(() => {
    let result = {
      windows: 0,
      vinylDoors: 0,
      patioDoors: 0,
      exteriorDoors: 0,
    };

    if (daySummaryWorkOrders) {
      let _daySummaryData = generateDaySummaryData(daySummaryWorkOrders);

      if (_daySummaryData) {
        result = {
          windows: _daySummaryData.windows,
          vinylDoors: _daySummaryData.vinylDoors,
          patioDoors: _daySummaryData.f52PD,
          exteriorDoors: _daySummaryData.exteriorDoors,
        };
      }
    }

    setDayTotals(result);
  }, [daySummaryWorkOrders, setDayTotals]);

  useEffect(() => {
    if (filteredEvents) {
      dispatch(updateIsLoading(false));
    }
  }, [dispatch, filteredEvents]);

  const rescheduleOk = useCallback(() => {
    if (changeEvent && workOrderData) {
      let startTime = "00:00:00";
      let endTime = "23:00:00";

      let eventDates = [];

      let startDate = {
        recordId: workOrderData.actionItemId,
        startDate: changeEvent.event.startStr,
        startTime: startTime,
        endTime: endTime,
      };

      eventDates.push(startDate);

      // Multi-day event, subtract 1 day from endStr
      let _endStr = moment(changeEvent.event.endStr)
        ?.subtract(1, "days")
        .format("YYYY-MM-DD");

      if (
        changeEvent.event.endStr &&
        changeEvent.event
          .startStr /* && _endStr !== changeEvent.event.startStr */
      ) {
        let endDate = {
          recordId: workOrderData.actionItemId,
          startDate: moment(changeEvent.event.endStr)
            .subtract(1, "day")
            .format("YYYY-MM-DD"), // Resize
          startTime: startTime,
          endTime: endTime,
        };

        if (changeEvent.title === "Reschedule") {
          endDate.startDate = moment(changeEvent.event.endStr); // If reschedule menu
        }

        eventDates.push(endDate);
      }

      updateEventDates(eventDates);
    }
  }, [changeEvent, workOrderData]);

  const clickEvent = useCallback(
    (e) => {
      if (e && dispatch && router) {
        let _workOrderNumber = e?.event?._def?.publicId;

        dispatch(updateSelectedEvent(e?.event?._def));
        dispatch(updateMarkedWorkOrderId(null));

        let _workOrderData = workOrders?.data.find(
          (x) =>
            x.workOrderNumber === _workOrderNumber ||
            x.workOrderNo === _workOrderNumber ||
            x.serviceOrderNumber === _workOrderNumber
        );

        if (_workOrderData) {
          dispatch(updateWorkOrderData(_workOrderData));
        }

        if (updateResult) {
          dispatch(updateResult(null));
        }

        router.push(
          `?page=workorder&work-order-number=${_workOrderNumber}&department=${department.key}`,
          undefined,
          { shallow: true }
        );
      }
    },
    [dispatch, router, department, workOrders]
  );

  const dropEvent = useCallback(
    (e) => {
      let _workOrderData = {};

      switch (department.key) {
        case Service:
          _workOrderData = workOrders?.data.find(
            (x) => x.serviceOrderNumber === e.event.id
          );
          break;
        default:
          _workOrderData = workOrders?.data.find(
            (x) => x.workOrderNumber === e.event.id
          );
          break;
      }

      dispatch(updateWorkOrderData(_workOrderData));
      setChangeEvent(e);
    },
    [workOrders, dispatch, department, setChangeEvent]
  );

  const genericRescheduleOk = useCallback(async () => {
    if (changeEvent && workOrderData && department) {
      let rescheduleRequest = {
        moduleName: department.key,
        id: workOrderData.id,
        startDate: changeEvent.event.startStr,
        endDate: changeEvent.event.endStr,
      };

      await updateServiceWorkOrderSchedule(rescheduleRequest);
    }
  }, [changeEvent, workOrderData, department]);

  const moveCancel = useCallback(() => {
    if (changeEvent) {
      if (changeEvent.revert) {
        changeEvent.revert();
      }
    }
  }, [changeEvent]);

  const changeStatusCancel = useCallback(() => {
    setShowChangeStatusConfirmation(false);
  }, []);

  const stateChangeOk = useCallback(() => {
    if (
      changeEvent &&
      workOrderData.actionItemId &&
      ProductionStates[changeEvent?.newState]?.transitionKey
    ) {
      let data = {
        ffModuleName: "PlantProduction",
        transitionCode: ProductionStates[changeEvent?.newState]?.transitionKey,
        recordID: workOrderData.actionItemId,
      };
      updateState(data);
      setShowChangeStatusConfirmation(false);
    }
  }, [changeEvent, workOrderData]);

  const serviceStateChangeOk = useCallback(() => {
    if (changeEvent) {
      updateServiceWorkOrderState(
        ServiceStates[mapServiceEventStateToKey(changeEvent?.newState)]?.label,
        workOrderData.id
      );
      setShowChangeStatusConfirmation(false);
    }
  }, [changeEvent, workOrderData]);

  const getFilteredEvents = useCallback(() => {
    return filteredEvents;
  }, [filteredEvents]);

  const getDayTotals = useCallback(() => {
    return dayTotals;
  }, [dayTotals]);

  const updateDayTotals = useCallback((data) => {
    if (data) {
      setDayTotals(data);
    }
  }, []);

  const getWeekTotals = useCallback(() => {
    return weekTotals;
  }, [weekTotals]);

  const updateWeekTotals = useCallback((data) => {
    if (data) {
      setWeekTotals(data);
    }
  }, []);

  const getDaySummaryWorkOrders = useCallback(() => {
    return daySummaryWorkOrders;
  }, [daySummaryWorkOrders]);

  const getWeekSummaryWorkOrders = useCallback(() => {
    return weekSummaryWorkOrders;
  }, [weekSummaryWorkOrders]);

  const getChangeEvent = useCallback(() => {
    return changeEvent;
  }, [changeEvent]);

  const updateChangeEvent = useCallback((data) => {
    setChangeEvent(data);
  }, []);

  const buildProductionEvents = useCallback((workOrders) => {
    let result = [];

    if (workOrders?.length > 0 && ProductionStates) {
      workOrders.forEach((wo, index) => {
        const showGlassOrderedIcon =
          parseInt(wo.f26CAMin) +
            parseInt(wo.f29CA) +
            parseInt(wo.f29CM) +
            parseInt(wo.f68CA) +
            parseInt(wo.f68SL) +
            parseInt(wo.f68VS) >
          0;
        const showVinylDoorsIcon = parseInt(wo.f61DR) + parseInt(wo.f27DS) > 0;
        let _wo = {
          id: wo.workOrderNumber,
          actionItemId: wo.actionItemId,
          start: wo.startDateTime,
          end: wo.endDateTime,
          title: wo.workOrderNumber,
          allDay: true,
          state: mapProductionStateToKey(wo.currentStateName),
          backgroundColor: (() => {
            let s = mapProductionStateToKey(wo.currentStateName);
            let state = ProductionStates[s];
            let color =
              wo.cardinalOrderedDate?.trim()?.length > 0 &&
              state?.secondaryColor !== null &&
              s === "scheduled"
                ? state?.secondaryColor
                : state?.color;
            return color;
          })(),

          borderColor:
            ProductionStates[mapProductionStateToKey(wo.currentStateName)]
              ?.color,
          textColor: "#000",
          type: Production,
          branch: WorkOrderSelectOptions.branches?.find(
            (x) => x.key === wo.branchId
          )?.label,
          jobType: isValueValid(wo.jobType, "jobType", Production)
            ? wo.jobType
            : MissingData, // If value is not found in CalendarFilters, replace it with "missingData" to allow filtering
          shippingType: isValueValid(
            wo.shippingType,
            "shippingType",
            Production
          )
            ? wo.shippingType
            : MissingData, // Same as above
          glassSupplier: wo.glassSupplier,
          manufacturingFacility:
            wo.manufacturingFacility === ManufacturingFacilities.calgary
              ? ManufacturingFacilities.calgary
              : ManufacturingFacilities.langley, // Empty defaults to Langley
          engineered: wo.m2000Icon === "Yes" ? true : false,
          notEngineered: wo.m2000Icon === "Yes" ? false : true,
          rush: wo.flagOrder,
          notRush: !wo.flagOrder,
          bundle: wo.batchNo,
          lbrMin:
            parseInt(wo.f26CAMin, 10) +
            parseInt(wo.f27DSMin, 10) +
            parseInt(wo.f29CAMin, 10) +
            parseInt(wo.f29CMMin, 10) +
            parseInt(wo.f52PDMin, 10) +
            parseInt(wo.f61DRMin, 10) +
            parseInt(wo.f68SLMin, 10) +
            parseInt(wo.f68VSMin, 10),
          blockNo: wo.blockNo,
          extendedProps: {
            branch: WorkOrderSelectOptions.branches?.find(
              (x) => x.key === wo.branchId
            )?.label,
            doors: wo.doors,
            doubleDoors: wo.doubleDoor,
            index: index,
            windows: wo.windows,
            jobType: wo.jobType,
            f52PD: parseInt(wo.f52PD, 10) || 0,
            f26CA: parseInt(wo.f6CA, 10) || 0,
            f29CA: parseInt(wo.f29CA, 10) || 0,
            f29CM: parseInt(wo.f29CM, 10) || 0,
            f68CA: parseInt(wo.f68CA, 10) || 0,
            f68SL: parseInt(wo.f68SL, 10) || 0,
            f68VS: parseInt(wo.f68VS, 10) || 0,
            f61DR: parseInt(wo.f61DR, 10) || 0,
            f27DS: parseInt(wo.f27DS, 10) || 0,
            f26HY: parseInt(wo.f26HY, 10) || 0,
            icons: {
              capStockIcon: wo.capstockIcon?.toLowerCase() === "yes",
              cardinalIcon: wo.glassSupplier?.toLowerCase() === "cardinal",
              centraIcon:
                wo.glassSupplier?.toLowerCase() === "glassfab" ||
                wo.glassSupplier?.toLowerCase() === "centra calgary",
              emailIcon: Boolean(wo.emailSent),
              exteriorDoorsIcon: Boolean(wo.doors),
              flagOrder: Boolean(wo.flagOrder),
              gridIcon: wo.gridsRequired?.toLowerCase() === "yes",
              glassOrderedIcon: showGlassOrderedIcon,
              g52pdIcon: Boolean(wo.f52PD),
              m2000Icon: wo.m2000Icon?.toLowerCase() === "yes",
              miniblindIcon: wo.miniblindIcon?.toLowerCase() === "yes",
              paintIcon: wo.paintIcon?.toLowerCase() === "yes",
              pfgIcon: wo.glassSupplier?.toLowerCase() === "pfg",
              shapesIcon: wo.shapesRequires?.toLowerCase() === "yes",
              smsIcon: Boolean(wo.smsSent),
              starIcon: false,
              vinylDoorIcon: showVinylDoorsIcon,
              warningIcon: Boolean(wo.highRiskflag),
              waterTestingRequired:
                wo.waterTestingRequired?.toLowerCase() === "yes",
            },
            manufacturingFacility: wo.manufacturingFacility,
            glassOrderedDate: wo.cardinalOrderedDate,
            completionDate: wo.completeDate,
            totalGlassQty: wo.totalGlassQty,
          },
        };

        // Multi-day event workaround
        let existingWOIndex = result.findIndex(
          (x) => x.id === wo.workOrderNumber
        );

        if (existingWOIndex > -1) {
          result[existingWOIndex].end = moment(wo.endDateTime)
            .add(1, "days")
            .format("YYYY-MM-DD");
          //_events[existingWOIndex].end = wo.endDateTime;
        }

        if (existingWOIndex < 0) {
          result.push(_wo);
        }
      });
    }
    return result;
  }, []);

  //console.log("dayTotals", dayTotals)
  //console.log("weekTotals", weekTotals)
  //console.log("changeEvent", changeEvent)
  //console.log("daySummaryWorkOrders", daySummaryWorkOrders)
  //console.log("weekSummaryWorkOrders", weekSummaryWorkOrders)
  //console.log("filteredEvents", filteredEvents)

  return {
    clickEvent,
    dropEvent,
    rescheduleOk,
    getFilteredEvents,
    getDayTotals,
    updateDayTotals,
    getWeekTotals,
    updateWeekTotals,
    getDaySummaryWorkOrders,
    getWeekSummaryWorkOrders,
    genericRescheduleOk,
    moveCancel,
    changeStatusCancel,
    stateChangeOk,
    serviceStateChangeOk,
    getChangeEvent,
    updateChangeEvent,
    buildProductionEvents,
  };
};

export default useCalendarEvents;
