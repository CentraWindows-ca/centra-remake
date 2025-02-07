"use client";
import styles from './productionContextMenu.module.css';
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { Popconfirm } from 'antd';
import Fade from '@mui/material/Fade';
import moment, { invalid } from 'moment';
import CheckboxItem from "app/components/atoms/workorderComponents/checkboxItem";
import Select from "app/components/atoms/select/select";
import LockButton from "app/components/atoms/lockButton/lockButton";
import { ProductionStates, Pages } from "app/utils/constants";
import { mapProductionStateToKey } from "app/utils/utils";
import { updateProdOrder } from "app/api/productionApis";

import {
  ArrowRightIcon,
  CapStockIcon,
  EngineeredIcon,
  GridIcon,
  IconsIcon,
  MiniBlindIcon,
  PaintIcon,
  RushIcon,
  ShapesIcon,
  StatusIcon,
  CalendarIcon,
  WaterResistanceIcon
} from "app/utils/icons";

const MenuItem = (props) => {
  const { label, value, Icon, toggleMenu, showExpand, mouseEnter, onClick } = props;

  return (
    <div
      className={`flex flex-row justify-between pt-1 pb-1 ${styles.contextMenuItem} hover:cursor-pointer`}
      onClick={() => toggleMenu ? toggleMenu(label, !value) : onClick()}
      onMouseEnter={mouseEnter}
    >
      <div style={{ paddingLeft: "3px" }} >
        {Icon && <span><Icon style={{ paddingRight: "0.5rem" }} /></span>}
        <span>{label}</span>
      </div>
      {showExpand &&
        <ArrowRightIcon style={{ color: value ? "var(--centrablue)" : "var(--darkgrey)", marginTop: "3px", marginRight: "5px" }} />
      }
    </div>
  )
}

export default function ProductionContextMenu(props) {
  const {
    style,
    setShowProductionWorkorder,
    setShowRescheduleConfirmation,
    setShowChangeStatusConfirmation,
    setChangeEvent,
    isHideWeekends
  } = props;

  const {
    department,
    selectedEvent,
    workOrderData
  } = useSelector(state => state.calendar);

  const { isReadOnly } = useSelector(state => state.app);

  const [showIcons, setShowIcons] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [newStartDate, setNewStartDate] = useState(moment(selectedEvent?.start).format("YYYY-MM-DD"));
  const [newEndDate, setNewEndDate] = useState(moment(selectedEvent?.end)?.subtract(1, "days")?.format("YYYY-MM-DD") || moment(selectedEvent?.start).format("YYYY-MM-DD"));
  const [saveNewDateEnabled, setSaveNewDateEnabled] = useState(false);
  const [checkboxItems, setCheckboxItems] = useState([]);
  const [checkboxChangeItems, setCheckboxChangeItems] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleResetState = () => {
    setShowIcons(false);
    setShowReschedule(false);
    setShowUpdateStatus(false)
  }

  const toggleMenu = (label, value) => {

    switch (label) {
      case "Icons":
        handleResetState();
        setShowIcons(value);
        break;
      case "Reschedule":
        handleResetState();
        setShowReschedule(value);
        break;
      case "Update Status":
        handleResetState();
        setShowUpdateStatus(value);
        break;
      default:
        break;
    }
  }

  let statusOptions = ProductionStates[selectedEvent?.extendedProps?.state]?.transitionTo.map((key) => {
    return {
      key: key,
      value: ProductionStates[key]?.label
    }
  });

  const addCheckboxChangeItem = (changeItem) => {
    if (changeItem) {
      setCheckboxChangeItems(ci => {
        let _ci = [...ci];
        let index = _ci.findIndex(x => x.key === changeItem.key);

        if (index > -1) { // Already existing - just update the value
          _ci[index].value = changeItem.value;
        } else {
          _ci.push(changeItem); // Add to update list
        }

        return _ci;
      });
    }
  }

  const handleCheckboxChange = useCallback((name, val) => {
    setCheckboxItems(ci => {
      let _ci = { ...ci };
      _ci[name] = val;
      return _ci;
    });

    let stringVal = val ? "Yes" : "No";

    let _name = name;

    if (name === "gridIcon") {
      _name = "gridsRequired";
    }

    if (name === "shapesIcon") {
      _name = "shapesRequires";
    }

    let changeItem = {
      key: _name,
      value: stringVal
    }

    addCheckboxChangeItem(changeItem); // Only add if value is different                         
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setNewStartDate(moment(selectedEvent.start).format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedEvent?.end)?.subtract(1, "days")?.format("YYYY-MM-DD") || moment(selectedEvent.start).format("YYYY-MM-DD"));
    }
  }, [selectedEvent]);

  const handleDateChange = (name, val) => {
    if (name && val) {
      switch (name) {
        case "start":
          setNewStartDate(val);
          setNewEndDate(val);
          break;
        case "end":
          setNewEndDate(val);
          break;
        default:
          break;
      }

      setSaveNewDateEnabled(true);
    }
  }

  const MenuItemLabels = {
    icons: "Icons",
    open: "Open",
    reschedule: "Reschedule",
    updateStatus: "Change Status",
    createRemake: "Creat Remake",
    createBackorder: "Create Back Order"
  }

  const handleMenuItemMouseEnter = (label) => {
    const reset = () => {
      setShowReschedule(false);
      setShowIcons(false);
      setShowUpdateStatus(false);
    }

    switch (label) {      
      case MenuItemLabels?.icons:
        reset();
        setShowIcons(true);
        break;
      case MenuItemLabels?.reschedule:
        reset();
        setShowReschedule(true);
        break;
      case MenuItemLabels?.updateStatus:
        reset();
        setShowUpdateStatus(true);
        break;
      default:
        reset();
        break;
    }
  }

  const handleOpenEvent = useCallback(() => {
    if (dispatch && router) {
      switch (department.key) {
        case "production":
          // GetProductionWorkOrder(selectedEvent.id); - Missing?
          router.push(`?view=workorder&work-order-number=${selectedEvent.id}&department=${department.key}`, undefined, { shallow: true });
          setShowProductionWorkorder(true);
          break;
        case "remake":
          // Fetch
          router.push(`?view=workorder&work-order-number=${selectedEvent.id}&department=${department.key}`, undefined, { shallow: true });
          setShowRemakeWorkorder(true);
          break;
        default:
          break;
      }
    }
  }, [dispatch, router, department.key, selectedEvent?.id, setShowProductionWorkorder]);

  useEffect(() => {
    if (selectedEvent) {
      setCheckboxItems({ ...selectedEvent?.extendedProps?.icons });
    }
  }, [selectedEvent]);

  const handleSaveIcons = useCallback(() => {
    if (checkboxChangeItems && workOrderData) {

      let data = {
        actionItemId: workOrderData.actionItemId
      }

      checkboxChangeItems.forEach((ci) => {
        data[ci.key] = ci.value;
      });
      
      updateProdOrder(data);
    }
  }, [checkboxChangeItems, workOrderData]);

  const handleCreateRemakeClick = useCallback(() => {    
    if (workOrderData?.workOrderNumber) {
      router.push(`${Pages.remakeBackorder}?department=${department?.key}&action=remake&workOrderNumber=${workOrderData?.workOrderNumber}`);
    }    
  }, [router, workOrderData, department]);

  const handleCreateBackorderClick = useCallback(() => {
    if (workOrderData?.workOrderNumber) {
      router.push(`${Pages.remakeBackorder}?department=${department?.key}&action=backorder&workOrderNumber=${workOrderData?.workOrderNumber}`);
    }
  }, [router, workOrderData, department]);


  const IsLastCalenderWeekDay = useCallback(() => {
    let start = moment(selectedEvent.start);
    let end = moment(selectedEvent?.end)?.subtract(1, "days") || moment(selectedEvent.start);
    let checkDay = isHideWeekends? 5:6;//5 is Friday, 6 is Saturday
    if (!start.isValid() && !end.isValid()) {
      return false;
    }
    if (!end.isValid()){
      return start.day() === checkDay;
    }
    
    // Loop over each day between start and end
    for (let d = start; d <= end; d.add(1, 'days')) {
        if (d.day() === checkDay) { 
            return true;
        }
    }

    return false;
  }, [selectedEvent, isHideWeekends]);
  

  return (
    <div className={styles.root} style={{ ...style }}>
      <div className="flex flex-row relative text-gray-600">
        <div className={`bg-white z-10 border-1 p-2 rounded shadow-sm ${styles.contextMenuItemsContainer}`}>
          <MenuItem
            label={MenuItemLabels.open}
            value={showIcons}
            onClick={handleOpenEvent}
            mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.open)}
          />
          <hr className="mt-1 mb-1" />
          <MenuItem
            Icon={IconsIcon}
            label={MenuItemLabels.icons}
            value={showIcons}
            toggleMenu={toggleMenu}
            showExpand={true}
            mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.icons)}
          />
          <MenuItem
            Icon={CalendarIcon}
            label={MenuItemLabels.reschedule}
            value={showReschedule}
            toggleMenu={toggleMenu}
            showExpand={true}
            mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.reschedule)}
          />
          <MenuItem
            Icon={StatusIcon}
            label={"Change Status"}
            value={showUpdateStatus}
            toggleMenu={toggleMenu}
            showExpand={true}
            mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.updateStatus)}
          />
          <hr className="mt-1 mb-1" />
          <MenuItem
            Icon={() => <i className="fa-solid fa-rotate-right pr-2"></i>}
            label={"Create Remake"}            
            onClick={handleCreateRemakeClick}
            mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.createRemake)}
          />
          <MenuItem
            Icon={() => <i className="fa-solid fa-angles-left pr-2"></i>}
            label={"Create Backorder"}
            onClick={handleCreateBackorderClick}
            mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.createBackorder)}
          />
        </div>

        {/* ---- Icons ---- */}
        <Fade
          in={showIcons}
          orientation="horizontal"
          className="bg-white rounded p-2 border-1 absolute shadow-sm"
          style={{ right: IsLastCalenderWeekDay() ? 200 : -310, bottom: 0 }}
          // style={{ right: -310, bottom: 0 }}
        >
          <div className="rounded ml-1" style={{ width: "19rem" }}>
            <div className="flex flex-row">
              <div style={{ width: "9rem" }}>

                <CheckboxItem
                  label={"Rush Order"}
                  value={checkboxItems?.flagOrder}
                  name={"flagOrder"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{padding: 0}}
                >
                  <RushIcon />
                </CheckboxItem>

                <CheckboxItem
                  label={"Engineered"}
                  value={checkboxItems?.m2000Icon}
                  name={"m2000Icon"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{ padding: 0 }}
                >
                  <EngineeredIcon />
                </CheckboxItem>

                <CheckboxItem
                  label={"Capstock"}
                  value={checkboxItems?.capStockIcon}
                  name={"capStockIcon"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{ padding: 0 }}
                >
                  <CapStockIcon style={{ marginLeft: "-4px" }} />
                </CheckboxItem>

                <CheckboxItem
                  label={"Paint"}
                  value={checkboxItems?.paintIcon}
                  name={"paintIcon"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{ padding: 0 }}
                >
                  <PaintIcon />
                </CheckboxItem>

              </div>
              <div style={{ width: "10rem" }}>
                
                
              <CheckboxItem
                  label={"Grids"}
                  value={checkboxItems?.gridIcon}
                  name={"gridIcon"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{ padding: 0 }}
                >
                  <GridIcon />
                </CheckboxItem>

                <CheckboxItem
                  label={"Shapes"}
                  value={checkboxItems?.shapesIcon}
                  name={"shapesIcon"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{ padding: 0 }}
                >
                  <ShapesIcon />
                </CheckboxItem>

                <CheckboxItem
                  label={"Miniblind"}
                  value={checkboxItems?.miniblindIcon}
                  name={"miniblindIcon"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{ padding: 0 }}
                >
                  <MiniBlindIcon style={{ marginLeft: "-4px" }} />
                </CheckboxItem>

                <CheckboxItem
                  label={"Water Testing"}
                  value={checkboxItems?.waterTestingRequired}
                  name={"waterTestingRequired"}
                  onChange={handleCheckboxChange}
                  className={"text-gray-600"}
                  style={{ padding: 0 }}
                >
                  <WaterResistanceIcon />
                </CheckboxItem>

              </div>
            </div>
            <div className="float-right pt-1">
              <Popconfirm
                placement="left"
                title={"Update Confirmation"}
                description={<div className="pt-2">
                  <div>Do you want to proceed with saving your changes to icons?</div>
                </div>}
                onConfirm={handleSaveIcons}
                okText="Ok"
                cancelText="Cancel"
              >
                <LockButton
                  tooltip={""}
                  onClick={() => { }}
                  disabled={checkboxChangeItems?.length === 0 || isReadOnly}
                  showLockIcon={isReadOnly}
                  label={"Save"}
                />
              </Popconfirm>
            </div>
          </div>
        </Fade>

        {/* ---- Reschedule ---- */}
        <Fade
          in={showReschedule }
          orientation="horizontal"
          className="bg-white rounded p-2 border-1 absolute shadow-sm"
          style={{ right: IsLastCalenderWeekDay()? 200:-235, bottom: 0 }}
          // style={{ right: -235, bottom: 0 }}
        >
          <div className="text-gray-600">
            <div>Reschedule to:</div>
            <hr className="mt-1 mb-1" />
            <div>
              <div>
                <span className="inline-block" style={{ width: "5.5rem" }}>Start Date:</span>
                <input type="date" name="start"
                  value={newStartDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                />
              </div>
              <div>
                <span className="inline-block" style={{ width: "5.5rem" }}>End Date:</span>
                <input type="date" name="end"
                  value={newEndDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                />
              </div>
            </div>
            <div className="float-right mt-3">
              <LockButton
                tooltip={""}
                onClick={() => {
                  let _selectedEvent = { ...selectedEvent }
                  _selectedEvent.startStr = newStartDate;
                  _selectedEvent.endStr = newEndDate;

                  setChangeEvent({
                    event: _selectedEvent,
                    title: "Reschedule",
                    oldEvent: {
                      startStr: selectedEvent.startStr,
                      //endStr: moment(selectedEvent?.endStr)?.add(1, "days")?.format("YYYY-MM-DD") || ""
                      endStr: moment(selectedEvent?.endStr)?.format("YYYY-MM-DD") || ""
                    }
                  });

                  setShowRescheduleConfirmation(true);
                }}
                disabled={!saveNewDateEnabled || isReadOnly}
                showLockIcon={isReadOnly}
                label={"Save"}
              />
            </div>
          </div>
        </Fade>

        {/* ---- Update Status ---- */}
        <Fade
          in={showUpdateStatus}
          orientation="horizontal"
          className="bg-white rounded p-2 border-1 absolute shadow-sm"
          style={{ right: IsLastCalenderWeekDay()? 200:-195, bottom: 20, minWidth: "12rem" }}
          // style={{ right: -195, bottom: 20, minWidth: "12rem" }}
        >
          <div>
            Change status to:
            <hr className="mt-1 mb-2" />
            <Select
              options={[{ key: selectedEvent?.extendedProps?.state, value: ProductionStates[selectedEvent?.extendedProps?.state]?.label }, ...(statusOptions || [])]}
              style={{ fontSize: "0.8rem", padding: "3px 0 3px 9px", color: "rgb(75 85 99 / var(--tw-text-opacity))" }}
              onChange={
                (newStatus) => {
                  let _selectedEvent = { ...selectedEvent }
                  _selectedEvent.startStr = newStartDate;
                  _selectedEvent.endStr = newEndDate;

                  setChangeEvent({
                    event: _selectedEvent,
                    title: "Status Change",
                    type: "state",
                    oldState: selectedEvent?._def?.extendedProps?.state,
                    newState: mapProductionStateToKey(newStatus)
                  });

                  setShowChangeStatusConfirmation(true);
                }
              }
            />
          </div>
        </Fade>
      </div>
    </div>
  )
}