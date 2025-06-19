"use client";
import styles from "./productionWorkorder.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import moment from "moment";

import {
  ProductionStates,
  WorkOrderSelectOptions,
  ProductionStartDate,
  ProductionEndDate,
  Production,
} from "app/utils/constants";

import { scrollToElement } from "app/utils/utils";

import {
  fetchProductionWorkOrder,
  updateProdOrder,
  updateState,
  updateEventDates,
  updateProductionDocuments,
  updateProjectManagementAndReturnedJobNotes,
  updateNotes,
  updateProductionItems,
} from "app/api/productionApis";

import CollapsibleGroup from "app/components/workorderComponents/collapsibleGroup";
import ActionModal from "app/components/actionModal/actionModal";
import ConfirmationModal from "app/components/confirmationModal/confirmationModal";
import DocumentUpload from "app/components/documentUpload/documentUpload";
import ProductionItems from "./subComponents/productionItems";
import RemakeItems from "./subComponents/remakeItems";
import BackorderItems from "./subComponents/backorderItems";
import GlassItems from "./subComponents/glassItems";
import Notes from "./subComponents/notes";
import OrderInfo from "./subComponents/orderInfo";
/*import OrderOptions from "./subComponents/orderOptions";*/
import OrderSummary from "./subComponents/orderSummary";
import OrderSchedule from "./subComponents/orderSchedule";
import Documents from "./subComponents/documents";
import LockButton from "app/components/lockButton/lockButton";
import WOInfoBar from "app/components/workorderComponents/woInfoBar";
import CustomerInfoBar from "app/components/workorderComponents/customerInfoBar";
import WORoot from "app/components/workorderComponents/woRoot";

import Collapse from "@mui/material/Collapse";

import { useInView, InView } from "react-intersection-observer";

import { useQuery } from "react-query";

import { updateResult } from "app/redux/orders";

export default function ProductionWorkOrder(props) {
  const dispatch = useDispatch();

  const {
    onChange,
    onCloseCallback,
    setShowProductionWorkorder,
    viewConfig,
    action,
    className,
    type,
  } = props;

  const {
    tempFiles,
    workOrderData: workOrderDataFromParent,
    stateChangeResult,
    result,
  } = useSelector((state) => state.calendar);

  const { isReadOnly } = useSelector((state) => state.app);

  const [documents, setDocuments] = useState([]);
  const [inputData, setInputData] = useState(null);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showBackorderItems, setShowBackorderItems] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [showGlassItems, setShowGlassItems] = useState(false);
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showProductionItems, setShowProductionItems] = useState(false);
  const [showRemakeItems, setShowRemakeItems] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSaveNotesConfirmation, setShowSaveNotesConfirmation] =
    useState(false);
  const [statusKey, setStatusKey] = useState(null);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [fetchWorkOrder, setFetchWorkOrder] = useState(true);
  const [orderChangeItems, setOrderChangeItems] = useState([]);
  const [notesChangeItems, setNotesChangeItems] = useState([]);
  const [dateChangeItems, setDatesChangeItems] = useState([]);
  const [mgmtChangeItems, setMgmtChangeItems] = useState([]);
  const [containsNewUnsavedFiles, setContainsNewUnsavedFiles] = useState(false);

  // Prod
  const [windows, setWindows] = useState([]);
  const [doors, setDoors] = useState([]);
  const [vinylDoors, setVinylDoors] = useState([]);
  const [patioDoors, setPatioDoors] = useState([]);
  const [exteriorDoors, setExteriorDoors] = useState([]);

  // Remake
  const [remakeWindows, setRemakeWindows] = useState([]);
  const [remakePatioDoors, setRemakePatioDoors] = useState([]);
  const [remakeVinylDoors, setRemakeVinylDoors] = useState([]);

  // Backorder
  const [backorderWindows, setBackorderWindows] = useState([]);
  const [backorderDoors, setBackorderDoors] = useState([]);

  // Glass
  const [glassItems, setGlassItems] = useState([]);

  const {
    isFetching,
    data: workOrderDataRaw,
    refetch,
    remove,
  } = useQuery(
    "workorder",
    () => {
      if (workOrderDataFromParent?.workOrderNumber) {
        setFetchWorkOrder(false);
        return fetchProductionWorkOrder(
          workOrderDataFromParent.workOrderNumber
        );
      }
    },
    { enabled: fetchWorkOrder }
  );

  // Trigger a refetch
  useEffect(() => {
    if (fetchWorkOrder) {
      setFetchWorkOrder(false);
    }
  }, [fetchWorkOrder]);

  // Fix for search results not reloading.
  useEffect(() => {
    refetch();
  }, [workOrderDataFromParent, refetch]);

  useEffect(() => {
    if (workOrderDataRaw?.data && workOrderDataFromParent) {
      setInputData({
        ...workOrderDataRaw.data,
        officeNotes: workOrderDataFromParent.officeNotes,
        branch: workOrderDataRaw?.data.branch_display,
      });
    }
  }, [workOrderDataRaw, workOrderDataFromParent]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  // Fetch when user navigates directly to work order from URL
  //useEffect(() => {
  //    if (data?.id && !workOrderData?.workOrderNumber) {
  //        GetProductionWorkOrder(data.id);
  //    }
  //}, [data, workOrderData]);

  useEffect(() => {
    if (showNotes) {
      scrollToElement(`title-notes`);
    }
  }, [showNotes]);

  useEffect(() => {
    if (showProductionItems) {
      scrollToElement(`title-windows`);
    }
  }, [showProductionItems]);

  useEffect(() => {
    if (showRemakeItems) {
      scrollToElement(`title-remake`);
    }
  }, [showRemakeItems]);

  useEffect(() => {
    if (showBackorderItems) {
      scrollToElement(`title-backorder`);
    }
  }, [showBackorderItems]);

  useEffect(() => {
    if (showGlassItems) {
      scrollToElement(`title-glass`);
    }
  }, [showGlassItems]);

  useEffect(() => {
    if (
      result?.type === "success" &&
      result?.source === "Production Work Order"
    ) {
      refetch();
    }
  }, [result, refetch]);

  const addOrderChangeItem = (changeItem) => {
    if (changeItem) {
      setOrderChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) {
          // Already existing - just update the value
          _ci[index].value = changeItem.value;
        } else {
          _ci.push(changeItem); // Add to update list
        }

        return _ci;
      });
    }
  };

  const removeOrderChangeItem = (changeItem) => {
    if (changeItem) {
      setOrderChangeItems((ci) => {
        let result = [];
        if (ci.length > 0) {
          let _ci = [...ci];
          const index = _ci.findIndex((x) => x.key === changeItem.key);
          if (index > -1) {
            _ci.splice(index, 1);
          }
          result = [..._ci];
        }
        return result;
      });
    }
  };

  const addNotesChangeItem = (changeItem) => {
    if (changeItem) {
      setNotesChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) {
          // Already existing - just update the value
          _ci[index].value = changeItem.value;
        } else {
          _ci.push(changeItem); // Add to update list
        }

        return _ci;
      });
    }
  };

  const removeNotesChangeItem = (changeItem) => {
    if (changeItem) {
      setNotesChangeItems((ci) => {
        let result = [];
        if (ci.length > 0) {
          let _ci = [...ci];
          const index = _ci.findIndex((x) => x.key === changeItem.key);
          if (index > -1) {
            _ci.splice(index, 1);
          }
          result = [..._ci];
        }
        return result;
      });
    }
  };

  const addMgmtChangeItem = (changeItem) => {
    if (changeItem) {
      setMgmtChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) {
          // Already existing - just update the value
          _ci[index].value = changeItem.value;
        } else {
          _ci.push(changeItem); // Add to update list
        }

        return _ci;
      });
    }
  };

  const removeMgmtChangeItem = (changeItem) => {
    if (changeItem) {
      setMgmtChangeItems((ci) => {
        let result = [];
        if (ci.length > 0) {
          let _ci = [...ci];
          const index = _ci.findIndex((x) => x.key === changeItem.key);
          if (index > -1) {
            _ci.splice(index, 1);
          }
          result = [..._ci];
        }
        return result;
      });
    }
  };

  const addDateChangeItem = (changeItem) => {
    if (changeItem) {
      setDatesChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) {
          // Already existing - just update the value
          _ci[index].value = changeItem.value;
        } else {
          _ci.push(changeItem); // Add to update list
        }

        return _ci;
      });
    }
  };

  const handleInputChange = useCallback(
    (e) => {
      if (e?.target) {
        // Update UI
        setInputData((d) => {
          let _d = { ...d };
          _d[e.target.name] = e.target?.value;

          if (e.target?.name === ProductionStartDate) {
            // When modifying start date, also use the same date for end date, this will prevent
            _d[ProductionEndDate] = e.target?.value; // start dates that are later than end dates
          }

          return _d;
        });

        let changeItem = {
          key: e.target.name, // HTML elements use name as id
          value: e.target.value,
        };

        // Build change object (need to create multiple change objects since we need to call different apis)
        if (e.target.name === ProductionStartDate) {
          addDateChangeItem(changeItem);
        } else if (e.target.name === ProductionEndDate) {
          // When modiying end date, make sure to also add start date
          let startChangeItem = dateChangeItems.find(
            (x) => x.key === ProductionStartDate
          );

          if (startChangeItem) {
            // If start date has already been modified, just add the end date
            addDateChangeItem(changeItem); // End Date
          } else {
            // If start date has not been modified, grab it from original data (Both start and end dates need to be passed for api to work)
            const startDateChangeItem = {
              key: ProductionStartDate,
              value: moment(
                workOrderDataRaw?.data?.productionStartDate
              )?.format("YYYY-MM-DD"),
            }; // We don't want to get value from inputData to prevent re-render
            addDateChangeItem(startDateChangeItem); // Start Date
            addDateChangeItem(changeItem); // End Date
          }
        } else if (e.target.name === "returnTripStartDate") {
          addMgmtChangeItem(changeItem); // dbo.PlantProduction.ReturnTrip
        } else {
          // All other properties
          let originalData = workOrderDataRaw?.data;

          if (originalData[e.target.name] !== e.target.value) {
            addOrderChangeItem(changeItem); // Only add if value is different from original
          } else {
            removeOrderChangeItem(changeItem); // Remove if value was changed and then changed back to original value
          }
        }
      }
    },
    [workOrderDataRaw, dateChangeItems]
  );

  // leave label alone as placeholder
  const handleSelectChange = (label, key, propertyName, options) => {
    if (key && propertyName) {
      // Find the value that needs to be saved to FF
      const value = options?.find((x) => x.key === key)?.value;

      setInputData((i) => {
        let _i = { ...i };
        _i[propertyName] = value;
        return _i;
      });

      let changeItem = {
        key: propertyName,
        value: value,
      };
      let originalData = workOrderDataRaw?.data;

      if (originalData[propertyName] !== value) {
        addOrderChangeItem(changeItem); // Only add if value is different
      } else {
        removeOrderChangeItem(changeItem); // Remove if value went back to the original one
      }
    }
  };

  const handleMultilineInputChange = useCallback(
    (e) => {
      if (e) {
        setInputData((d) => {
          let _d = { ...d };
          _d[e.target?.name] = e.target?.value;
          return _d;
        });

        let _key = e.target?.name;

        if (_key === "projectManagementNotes") {
          _key = "windowPlantNotes"; // Different names pointing to the same value in flowfinity
        }

        let isPartOfMgmtNotes =
          _key === "returnTripNotes" || _key === "windowPlantNotes";

        let changeItem = {
          key: _key,
          value: e.target?.value,
        };

        let originalData = workOrderDataRaw?.data;

        if (originalData[e.target.name] !== e.target.value) {
          if (isPartOfMgmtNotes) {
            // Only add if value is different
            addMgmtChangeItem(changeItem);
          } else {
            addNotesChangeItem(changeItem);
          }
        } else {
          if (isPartOfMgmtNotes) {
            // Remove if value went back to the original one
            removeMgmtChangeItem(changeItem);
          } else {
            removeNotesChangeItem(changeItem);
          }
        }
      }
    },
    [workOrderDataRaw]
  );

  const handleCloseWorkOrder = useCallback(() => {
    if (!saveDisabled) {
      setShowExitConfirmation(true);
    } else {
      resetWorkOrderState();
      remove();
      onCloseCallback();
    }
  }, [saveDisabled, onCloseCallback, remove]);

  const handleScrollToView = (elName) => {
    if (elName) {
      setShowProductionItems(false);
      setShowRemakeItems(false);
      setShowBackorderItems(false);
      setShowGlassItems(false);

      switch (elName) {
        case "windows":
          setShowProductionItems(true);
          break;
        case "doors":
          setShowProductionItems(true);
          break;
        case "remake":
          setShowRemakeItems(true);
          break;
        case "backorder":
          setShowBackorderItems(true);
          break;
        case "glass":
          setShowGlassItems(true);
          break;
        default:
          break;
      }

      let header = document.getElementById(`title-${elName}`);
      if (header) {
        setTimeout(
          () => header.scrollIntoView({ top: 0, behavior: "smooth" }),
          400
        );
      }
    }
  };

  const handleCheckboxChange = (name, val) => {
    if (name) {
      let newVal = val ? "Yes" : "No";

      // Note: flagOrder property corresponds to Rush Order
      // value received from api is 0/1 but when saving values need to be Yes/No

      setInputData((d) => {
        let _d = { ...d };
        _d[name] = newVal;
        return _d;
      });

      let changeItem = {
        key: name,
        value: newVal,
      };

      let originalData = workOrderDataRaw?.data;

      if (originalData[name] !== newVal) {
        addOrderChangeItem(changeItem); // Only add if value is different
      } else {
        removeOrderChangeItem(changeItem); // Remove if value went back to the original one
      }
    }
  };

  const handleExpandCollapseCallback = useCallback((type) => {
    if (type) {
      switch (type) {
        case "productionItems":
          setShowProductionItems((x) => !x);
          break;
        case "productionWindows":
          setShowProductionWindows((x) => !x);
          break;
        case "productionDoors":
          setShowProductionDoors((x) => !x);
          break;
        case "remakeItems":
          setShowRemakeItems((x) => !x);
          break;
        case "remakeWindows":
          setShowRemakeWindows((x) => !x);
          break;
        case "remakeDoors":
          setShowRemakeDoors((x) => !x);
          break;
        case "backorder":
          setShowBackorderItems((x) => !x);
          break;
        case "glass":
          setShowGlassItems((x) => !x);
          break;
        case "notes":
          setShowNotes((x) => !x);
          break;
        default:
          break;
      }
    }
  }, []);

  const handleDocumentsOk = useCallback(() => {
    setShowDocumentUpload(false);

    let updatedDocuments = tempFiles.map((d) => {
      let base64 = d.base64.split(",");
      return {
        file: {
          fileName: d.name,
          mimeType: d.type,
          value: base64?.length > 0 ? base64[1] : null,
        },
        notes1: d?.fileNotes || "",
      };
    });

    updateProductionDocuments(
      workOrderDataFromParent.actionItemId,
      updatedDocuments
    );
  }, [tempFiles, workOrderDataFromParent]);

  const deleteCheckedFiles = useCallback(() => {
    let unCheckedDocs = documents.filter((d) => !d.checked);

    if (Array.isArray(unCheckedDocs)) {
      let updatedDocuments = unCheckedDocs.map((d) => {
        let base64 = d.base64.split(",");
        return {
          file: {
            fileName: d.name,
            mimeType: d.type,
            value: base64?.length > 0 ? base64[1] : null,
          },
          notes1: d?.fileNotes || "",
        };
      });
      setShowDeleteFiles(false);
      updateProductionDocuments(
        workOrderDataFromParent.actionItemId,
        updatedDocuments
      );
    }
  }, [documents, workOrderDataFromParent]);

  let statusOptions = Object.entries(ProductionStates).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color };
  });

  const handleStatusOk = useCallback(() => {
    if (statusKey && workOrderDataFromParent) {
      let _status = statusOptions.find((x) => x.key === statusKey);
      if (_status) {
        onChange(
          workOrderDataFromParent.workOrderNumber,
          "select",
          "status",
          _status.key
        );
      }
    }
  }, [statusKey, statusOptions, onChange, workOrderDataFromParent]);

  const handleSave = (e) => {
    if (e) {
      setShowSaveConfirmation(true);
    }
  };

  const resetWorkOrderState = () => {
    setDocuments([]);
    setInputData({});
  };

  const handleSaveYes = useCallback(() => {
    if (workOrderDataFromParent) {
      if (orderChangeItems.length > 0) {
        let orderChangeItemsObj = {};

        // Array to object conversion
        orderChangeItems.map((ci) => {
          if (ci.key === "branch") {
            let option = WorkOrderSelectOptions.branches.find(
              (x) => x.key === ci.value
            );
            return (orderChangeItemsObj[ci.key] = {
              title:
                option?.value === "Select One" ? "Select One" : option?.label,
              value: option?.value,
            });
          }
          return (orderChangeItemsObj[ci.key] = ci.value);
        });

        if (workOrderDataFromParent.actionItemId && orderChangeItemsObj) {
          let data = {
            actionItemId: workOrderDataFromParent.actionItemId,
            ...orderChangeItemsObj,
          };

          updateProdOrder(data);
          setOrderChangeItems([]);
        }
      }

      if (dateChangeItems.length > 0) {
        let startDateChangeItem = dateChangeItems.find(
          (x) => x.key === ProductionStartDate
        );
        let endDateChangeItem = dateChangeItems.find(
          (x) => x.key === ProductionEndDate
        );

        if (workOrderDataFromParent.actionItemId && startDateChangeItem) {
          let eventDates = [];
          let startTime = "00:00:00";
          let endTime = "01:00:00";

          let startDate = {
            recordId: workOrderDataFromParent.actionItemId,
            startDate: startDateChangeItem?.value,
            startTime: startTime,
            endTime: endTime,
          };

          eventDates.push(startDate);

          if (endDateChangeItem) {
            let endDate = {
              recordId: workOrderDataFromParent.actionItemId,
              startDate: endDateChangeItem?.value,
              startTime: startTime,
              endTime: endTime,
            };

            eventDates.push(endDate);
          }

          updateEventDates(eventDates); // Inside workorder you can't modify time so keeping time static
          setDatesChangeItems([]);
        }
      }

      setShowSaveConfirmation(false);
      if (setShowProductionWorkorder) {
        setShowProductionWorkorder(false);
      }

      remove(); // Clear workorder cache from useQuery
    }
  }, [
    workOrderDataFromParent,
    orderChangeItems,
    setShowProductionWorkorder,
    dateChangeItems,
    remove,
  ]);

  const handleSaveNotesYes = useCallback(() => {
    if (
      workOrderDataFromParent &&
      (notesChangeItems.length > 0 || mgmtChangeItems.length > 0)
    ) {
      if (
        workOrderDataFromParent.actionItemId &&
        notesChangeItems?.length > 0
      ) {
        let notesData = {
          actionItemId: workOrderDataFromParent.actionItemId,
          doorShopNotes: notesChangeItems?.find(
            (x) => x.key === "doorShopNotes"
          )?.value,
          shippingNotes: notesChangeItems?.find(
            (x) => x.key === "shippingNotes"
          )?.value,
          plantNotes: notesChangeItems?.find((x) => x.key === "plantNotes")
            ?.value,
          officeNotes: notesChangeItems?.find((x) => x.key === "officeNotes")
            ?.value,
        };
        updateNotes(notesData);
      }

      if (workOrderDataFromParent.actionItemId && mgmtChangeItems?.length > 0) {
        let mgmtData = {
          actionItemId: workOrderDataFromParent.actionItemId,
          windowPlantNotes: mgmtChangeItems?.find(
            (x) => x.key === "windowPlantNotes"
          )?.value, // NOTE: Project Management Notes in UI maps to windowPlantNotes in flowfinity
          returnTripNotes: mgmtChangeItems?.find(
            (x) => x.key === "returnTripNotes"
          )?.value,
          returnTripStartDate: mgmtChangeItems?.find(
            (x) => x.key === "returnTripStartDate"
          )?.value,
        };
        updateProjectManagementAndReturnedJobNotes(mgmtData);
      }

      setNotesChangeItems([]);
      setMgmtChangeItems([]);
      setShowSaveNotesConfirmation(false);
      setShowNotes(false);
    }
  }, [
    workOrderDataFromParent,
    notesChangeItems,
    setShowNotes,
    mgmtChangeItems,
  ]);

  const handleSaveNo = () => {
    setShowSaveConfirmation(false);
  };

  const handleSaveNotesNo = () => {
    setShowSaveNotesConfirmation(false);
  };

  /* Already being handled in the backend
  const updateAllItemsToShipped = useCallback(() => {
    if (workOrderDataFromParent) { // If main status changes to shipped, trigger this

      let windowChangeItems = [];
      let patioDoorChangeItems = [];
      let vinylDoorChangeItems = [];
      let exteriorDoorChangeItems = [];

      if (windows?.length > 0) {
        windowChangeItems = windows.map((x) => {
          return { ...x, status: "Shipped" };
        });
      }

      if (patioDoors?.length > 0) {
        patioDoorChangeItems = patioDoors.map((x) => {
          return { ...x, status: "Shipped" };
        });
      }

      if (vinylDoors?.length > 0) {
        vinylDoorChangeItems = vinylDoors.map((x) => {
          return { ...x, status: "Shipped" };
        });
      }

      if (exteriorDoors?.length > 0) {
        exteriorDoorChangeItems = exteriorDoors.map((x) => {
          return { ...x, status: "Shipped" };
        });
      }

      windowChangeItems = [...windowChangeItems, ...patioDoorChangeItems];
      let doorChangeItems = [
        ...vinylDoorChangeItems,
        ...exteriorDoorChangeItems,
      ];

      let data = {
        workOrderNumber: workOrderDataFromParent.workOrderNumber,
        actionItemId: workOrderDataFromParent.actionItemId,
        winItems: windowChangeItems,
        doorItems: doorChangeItems,
      };

      updateProductionItems(data);
    }
  }, [windows, vinylDoors, patioDoors, exteriorDoors, workOrderDataFromParent])
  */

  const updateStatus = useCallback(
    (statusKey) => {
      if (statusKey && workOrderDataFromParent) {
        if (
          workOrderDataFromParent.actionItemId &&
          ProductionStates[statusKey]?.transitionKey
        ) {
          let data = {
            ffModuleName: "PlantProduction",
            transitionCode: ProductionStates[statusKey]?.transitionKey,
            recordID: workOrderDataFromParent.actionItemId,
            workOrderNumber: workOrderDataFromParent.workOrderNumber,
            actionItemId: workOrderDataFromParent.actionItemId,
            manufacturingFacility:
              workOrderDataFromParent.manufacturingFacility,
          };
          updateState(data);
        }
      }
    },
    [workOrderDataFromParent]
  );

  useEffect(() => {
    refetch();
    dispatch(updateResult(null));
  }, [dispatch, stateChangeResult, refetch]);

  const showClosePopup =
    [...orderChangeItems, ...notesChangeItems, ...dateChangeItems]?.length > 0;
  const windowItemCount = windows?.filter((x) => x.system !== "GL01"); // Used for the heading, separating window items and glass items
  const windowGlassCount = windows?.filter((x) => x.system === "GL01");

  return (
    <WORoot
      className={className}
      styles={styles}
      readOnlyData={workOrderDataFromParent}
      inputData={inputData}
      viewConfig={viewConfig}
      showClosePopup={showClosePopup}
      onClose={handleCloseWorkOrder}
    >
      {inputData && !workOrderDataFromParent?.error && (
        <div
          className={`${styles.workOrderOuterContainer} flex flex-col`}
          style={{
            zIndex: 0,
            position: viewConfig?.stickyHeader ? "sticky" : "relative",
          }}
        >
          <WOInfoBar
            statusKey={statusKey}
            setStatusKey={setStatusKey}
            viewConfig={viewConfig}
            data={workOrderDataRaw?.data}
            handleStatusOk={handleStatusOk}
            updateStatus={updateStatus}
            ref={ref}
            type={type}
          />

          <CustomerInfoBar
            viewConfig={viewConfig}
            data={workOrderDataRaw?.data}
            sections={[
              { key: "windows", label: "Items" },
              { key: "remake", label: "Remake" },
              { key: "backorder", label: "Backorder" },
              { key: "glass", label: "Glass" },
              { key: "Notes", label: "Notes" },
            ]}
            handleScrollToView={handleScrollToView}
            type={Production}
          />

          <div
            className={styles.container}
            style={{ ...props.style }}
            id={"title-main"}
          >
            <div id="title-topmost"></div>
            <div>
              {!viewConfig?.hideOrder && (
                <div className="pr-2 pb-2 rounded-sm mt-2 lg:pl-2 lg:border-dotted lg:border">
                  <div className={styles.grid}>
                    <InView
                      as="div"
                      onChange={(inView, entry) => setShowGoToTop(!inView)}
                    >
                      <OrderInfo
                        WorkOrderSelectOptions={WorkOrderSelectOptions}
                        inputData={inputData}
                        handleInputChange={handleInputChange}
                        handleSelectChange={handleSelectChange}
                        orderChangeItems={orderChangeItems}
                        isSearchView={!viewConfig.stickyHeader}
                      />
                    </InView>
                    {/*
                    <OrderOptions
                      inputData={inputData}
                      handleCheckboxChange={handleCheckboxChange}
                      handleInputChange={handleInputChange}
                      orderChangeItems={orderChangeItems}
                      isSearchView={!viewConfig.stickyHeader}
                    />
                    */}
                    <Documents
                      documents={documents}
                      setDocuments={setDocuments}
                      setShowAttachments={setShowDocumentUpload}
                      setShowDeleteFiles={setShowDeleteFiles}
                      workOrderNumber={
                        workOrderDataFromParent?.workOrderNumber || null
                      }
                      isSearchView={!viewConfig.stickyHeader}
                    />

                    <div className="flex flex-col justify-between">
                      <OrderSchedule
                        inputData={inputData}
                        handleInputChange={handleInputChange}
                        dateChangeItems={dateChangeItems}
                        isSearchView={!viewConfig.stickyHeader}
                      />

                      <OrderSummary
                        inputData={inputData}
                        handleInputChange={handleInputChange}
                        dateChangeItems={dateChangeItems}
                        isSearchView={!viewConfig.stickyHeader}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-end pt-4">
                    <LockButton
                      tooltip={"Save Order Info and Order Options"}
                      onClick={handleSave}
                      disabled={
                        (orderChangeItems?.length === 0 &&
                          dateChangeItems?.length === 0) ||
                        isReadOnly
                      }
                      showLockIcon={isReadOnly}
                      label={"Save"}
                    />
                  </div>
                </div>
              )}
              {!viewConfig?.hideNotes && (
                <Notes
                  showNotes={showNotes}
                  handleExpandCollapseCallback={handleExpandCollapseCallback}
                  inputData={inputData}
                  handleInputChange={handleInputChange}
                  handleMultilineInputChange={handleMultilineInputChange}
                  notesChangeItems={notesChangeItems}
                  setNotesChangeItems={setNotesChangeItems}
                  mgmtChangeItems={mgmtChangeItems}
                  setShowSaveNotesConfirmation={setShowSaveNotesConfirmation}
                />
              )}
            </div>
            <div
              className={styles.tablesContainer}
              key={workOrderDataFromParent?.workOrderNumber}
            >
              <CollapsibleGroup
                id={"title-windows"}
                title={"Production Items"}
                subTitle={`W: ${windowItemCount.length} | PD: ${patioDoors.length} | VD: ${vinylDoors.length} | ED: ${exteriorDoors.length} | GL: ${windowGlassCount.length}`}
                expandCollapseCallback={() =>
                  handleExpandCollapseCallback("productionItems")
                }
                value={viewConfig?.expanded ? true : showProductionItems}
                style={{ marginTop: "1rem" }}
              >
                <Collapse
                  in={viewConfig?.expanded ? true : showProductionItems}
                >
                  <ProductionItems
                    workOrderNumber={
                      workOrderDataFromParent?.workOrderNumber || null
                    }
                    workOrderBranch={
                      workOrderDataFromParent?.branch ||
                      inputData?.branch_display
                    }
                    customerName={workOrderDataFromParent?.customerName}
                    actionItemId={workOrderDataFromParent?.actionItemId || null}
                    parentState={{
                      windows,
                      setWindows,
                      doors,
                      setDoors,
                      vinylDoors,
                      setVinylDoors,
                      patioDoors,
                      setPatioDoors,
                      exteriorDoors,
                      setExteriorDoors,
                    }}
                    stickyHeader={viewConfig?.stickyHeader}
                    action={action}
                  />
                </Collapse>
              </CollapsibleGroup>
              {!viewConfig?.hideRemake && (
                <CollapsibleGroup
                  id={"title-remake"}
                  title={"Remake Items"}
                  subTitle={`W: ${remakeWindows.length}`}
                  expandCollapseCallback={() =>
                    handleExpandCollapseCallback("remakeItems")
                  }
                  value={showRemakeItems}
                  style={{ marginTop: "1rem" }}
                >
                  <Collapse in={showRemakeItems}>
                    <RemakeItems
                      workOrderNumber={workOrderDataFromParent?.workOrderNumber}
                      parentState={{
                        remakeWindows,
                        setRemakeWindows,
                        remakePatioDoors,
                        setRemakePatioDoors,
                        remakeVinylDoors,
                        setRemakeVinylDoors,
                      }}
                    />
                  </Collapse>
                </CollapsibleGroup>
              )}
              {!viewConfig?.hideBackorder && (
                <CollapsibleGroup
                  id={"title-backorder"}
                  title={"Back Order Items"}
                  subTitle={`W: ${backorderWindows.length} | D: ${backorderDoors.length}`}
                  expandCollapseCallback={() =>
                    handleExpandCollapseCallback("backorder")
                  }
                  value={showBackorderItems}
                  style={{ marginTop: "1rem" }}
                >
                  <Collapse in={showBackorderItems}>
                    <BackorderItems
                      workOrderNumber={workOrderDataFromParent?.workOrderNumber}
                      parentState={{
                        backorderWindows,
                        setBackorderWindows,
                        backorderDoors,
                        setBackorderDoors,
                      }}
                    />
                  </Collapse>
                </CollapsibleGroup>
              )}
              {!viewConfig?.hideGlass && (
                <CollapsibleGroup
                  id={"title-glass"}
                  title={"Glass Items"}
                  subTitle={glassItems.length}
                  expandCollapseCallback={() =>
                    handleExpandCollapseCallback("glass")
                  }
                  value={showGlassItems}
                  style={{ marginTop: "1rem" }}
                >
                  <Collapse in={showGlassItems}>
                    <GlassItems
                      workOrderNumber={workOrderDataFromParent?.workOrderNumber}
                      parentState={{
                        glassItems,
                        setGlassItems,
                      }}
                    />
                  </Collapse>
                </CollapsibleGroup>
              )}
            </div>

            {showGoToTop && viewConfig?.stickyHeader && (
              <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                <i
                  className={`bi bi-arrow-up-circle-fill ${styles.goToTopIcon}`}
                  onClick={() => handleScrollToView("topmost")}
                ></i>
              </div>
            )}
          </div>

          <ActionModal
            title={"Add / Update Attachments"}
            open={showDocumentUpload}
            showCancel={false}
            onCancel={() => {
              //if (containsNewUnsavedFiles) {
              //    setShowUploadCancelConfirmation(true);
              //} else {
              //    setShowDocumentUpload(false);
              //}
              setShowDocumentUpload(false);
              setContainsNewUnsavedFiles(false);
            }}
            onOk={handleDocumentsOk}
            okDisabled={!containsNewUnsavedFiles}
            cancelLabel={"Cancel"}
            popConfirmOkTitle={"Save Documents Confirmation"}
            popConfirmOkDescription={"Do you want to proceed with the update?"}
            popConfirmCancelTitle={"Close Documents"}
            popConfirnCancelDescription={
              <div>
                <div>
                  Once you close this window, all your pending changes will be
                  lost.
                </div>
                <div>Proceed anyway?</div>
              </div>
            }
          >
            <DocumentUpload
              documents={documents}
              setContainsNewUnsavedFiles={setContainsNewUnsavedFiles}
            />
          </ActionModal>

          <ConfirmationModal
            title={`Delete Confirmation`}
            open={showDeleteFiles}
            onOk={() => deleteCheckedFiles()}
            onCancel={() => setShowDeleteFiles(false)}
            okDisabled={!documents.find((x) => x.checked) || isReadOnly}
            cancelLabel={"Cancel"}
            okLabel={"Ok"}
          >
            <div className="pt-2">
              <div>The following documents will be permanently deleted:</div>
              <div className="pt-2 pl-4">
                {documents?.map((td) =>
                  td.checked ? <div key={td.name}>- {td.name}</div> : null
                )}
              </div>
            </div>
          </ConfirmationModal>

          <ConfirmationModal
            title={`Save Confirmation`}
            open={showSaveConfirmation}
            onOk={handleSaveYes}
            onCancel={handleSaveNo}
            cancelLabel={"No"}
            okLabel={"Yes"}
          >
            <div className="pt-2">
              <div>Are you sure you want to save your changes?</div>
            </div>
          </ConfirmationModal>

          <ConfirmationModal
            title={`Save Confirmation`}
            open={showSaveNotesConfirmation}
            onOk={handleSaveNotesYes}
            onCancel={handleSaveNotesNo}
            cancelLabel={"No"}
            okLabel={"Yes"}
          >
            <div className="pt-2">
              <div>Are you sure you want to save your changes?</div>
            </div>
          </ConfirmationModal>
        </div>
      )}
    </WORoot>
  );
}
