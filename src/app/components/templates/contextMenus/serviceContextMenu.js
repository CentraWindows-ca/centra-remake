"use client";
import styles from './productionContextMenu.module.css';
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';

import Fade from '@mui/material/Fade';

import moment from 'moment';

import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import Select from "app/components/atoms/select/select";

import { ServiceStates } from "app/utils/constants";
import { mapServiceEventStateToKey } from "app/utils/utils";

import LockButton from "app/components/atoms/lockButton/lockButton";

import {
    ArrowRightIcon,
    StatusIcon,
    CalendarIcon
} from "app/utils/icons";
import DateTimeItem from 'app/components/atoms/workorderComponents/dateTimeItem';

const MenuItem = (props) => {
    const { label, value, Icon, toggleMenu, showExpand, mouseEnter, onClick } = props;

    return (
        <div
            className={`flex flex-row justify-between pt-1 pb-1 ${styles.contextMenuItem} `}
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

export default function ServiceContextMenu(props) {
    const {
        style,
        //onChange,
        setDates,
        setShowServiceWorkOrder,
        setShowRescheduleConfirmation,
        setShowChangeStatusConfirmation,        
        setChangeEvent
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
    const [newStartDate, setNewStartDate] = useState(moment(selectedEvent?.start).format("YYYY-MM-DDTHH:mm"));
    const [newEndDate, setNewEndDate] = useState(moment(selectedEvent?.end).format("YYYY-MM-DDTHH:mm"));
    const [saveNewDateEnabled, setSaveNewDateEnabled] = useState(false);
    const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
    const [showDateConfirmation, setShowDateConfirmation] = useState(false);
    const [newStatus, setNewStatus] = useState( {
        key: mapServiceEventStateToKey(selectedEvent?.extendedProps?.state),
        value: ServiceStates[mapServiceEventStateToKey(selectedEvent?.extendedProps?.state)]?.label
    });
    
    const dispatch = useDispatch();
    const router = useRouter();

    const handleResetState = () => {
        setShowIcons(false);
        setShowReschedule(false);
        setShowUpdateStatus(false)
    }

    const toggleMenu = (label, value) => {
        
        switch (label) {
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

    let statusOptions = [
        {
          key: mapServiceEventStateToKey(selectedEvent?.extendedProps?.state),
          value: ServiceStates[mapServiceEventStateToKey(selectedEvent?.extendedProps?.state)]?.label
        },
        ...ServiceStates[mapServiceEventStateToKey(selectedEvent?.extendedProps?.state)]?.transitionTo.map((key) => {
          return {
            key: key,
            value: ServiceStates[key]?.label
          };
        })
      ];

    useEffect(() => {

        if (selectedEvent) {
            setNewStartDate(moment(selectedEvent?.start).format("YYYY-MM-DDTHH:mm"));
            setNewEndDate(moment(selectedEvent?.end).format("YYYY-MM-DDTHH:mm"));
            setNewStatus( {
                key: mapServiceEventStateToKey(selectedEvent?.extendedProps?.state),
                value: ServiceStates[mapServiceEventStateToKey(selectedEvent?.extendedProps?.state)]?.label
              });
        }
    }, [selectedEvent]);

    const handleDateChange = (e, type, id) => {
        if (!id || !e.target.value) return;
        
        switch (id) {
            case "start":
                setNewStartDate((prev) => {
                    let newDate = moment(prev);
            
                    switch (type) {
                    case "date":
                        const newDateValue = moment(e.target.value);
                        newDate.set({
                        year: newDateValue.year(),
                        month: newDateValue.month(),
                        date: newDateValue.date(),
                        });
                        break;
                    case "time":
                        const newTime = moment(e.target.value, "HH:mm");
                        newDate.set({
                        hour: newTime.hour(),
                        minute: newTime.minute(),
                        second: newTime.second(),
                        });
                        break;
                    }
            
                    return newDate.format(); 
                });

                // setNewEndDate((prevEndDate) => {
                //     // Check if NewStartDate is greater than the current NewEndDate
                //     let newStartDate = moment(newStartDate); // Assuming NewStartDate is a variable accessible in the scope
                //     let newEndDate = moment(prevEndDate);
    
                //     if (newStartDate.isAfter(newEndDate)) {
                //         // Update NewEndDate to match NewStartDate
                //         newEndDate.set({
                //             year: newStartDate.year(),
                //             month: newStartDate.month(),
                //             date: newStartDate.date(),
                //             hour: newStartDate.hour(),
                //             minute: newStartDate.minute(),
                //         });
                //     }
    
                //     return newEndDate.format();
                // });
                break;
        
            case "end":
                setNewEndDate((prev) => {
                    let newDate = moment(prev);
            
                    switch (type) {
                    case "date":
                        const newDateValue = moment(e.target.value);
                        newDate.set({
                            year: newDateValue.year(),
                            month: newDateValue.month(),
                            date: newDateValue.date(),
                        });
                        break;
                    case "time":
                        const newTime = moment(e.target.value, "HH:mm");
                        newDate.set({
                            hour: newTime.hour(),
                            minute: newTime.minute(),
                            second: newTime.second(),
                        });
                        break;
                    }
            
                    return newDate.format();
                });
                break;
            default:
                break;
        }
        
        setSaveNewDateEnabled(true);
    };
   
      
    const MenuItemLabels = {
        open: "Open",
        reschedule: "Reschedule",
        updateStatus: "Update Status"
    }

    const handleMenuItemMouseEnter = (label) => {
        const reset = () => {
            setShowReschedule(false);
            setShowUpdateStatus(false);
        }

        switch (label) {            
            case MenuItemLabels.reschedule:
                reset();
                setShowReschedule(true);                
                break;
            case MenuItemLabels.updateStatus:
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
                case "service":
                    router.push(`?view=workorder&work-order-number=${selectedEvent.id}&department=${department.key}`, undefined, { shallow: true });
                    setShowServiceWorkOrder(true);
                    break;
                default:
                    break;
            }
        }
    }, [dispatch, router, department.key, selectedEvent?.id, setShowServiceWorkOrder]);
   
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
                        Icon={CalendarIcon}
                        label={MenuItemLabels.reschedule}
                        value={showReschedule}
                        toggleMenu={toggleMenu}
                        showExpand={true}
                        mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.reschedule)}
                    />
                    <MenuItem
                        Icon={StatusIcon}
                        label={"Update Status"}
                        value={showUpdateStatus}
                        toggleMenu={toggleMenu}
                        showExpand={true}
                        mouseEnter={() => handleMenuItemMouseEnter(MenuItemLabels.updateStatus)}
                    />
                </div>

                {/* ---- Reschedule ---- */}
                <Fade
                    in={showReschedule}
                    orientation="horizontal"
                    className="bg-white rounded p-2 border-1 absolute shadow-sm"
                    style={{ right: -255, top: 0 }}
                >
                    <div className="text-gray-600">
                        <div>Reschedule to:</div>
                        <hr className="mt-1 mb-1"/>
                        <div className='flex flex-col space-y-3'>
                            <div  className='flex flex-col'>
                                <span className="inline-block" style={{ width: "5.5rem" }}>Start Date:</span>
                                {/* <input type="datetime-local" name="start"
                                    value={newStartDate}
                                    onChange={(e) => handleDateChange("start", e.target.value)}
                                /> */}
                                <DateTimeItem
                                  id="start"
                                  name={"scheduleDate"} 
                                  value={newStartDate} 
                                  onChange={handleDateChange} 
                                  showLabel={false}
                                  //style={{ color: "var(--centrablue)" }} 
                                />
                            </div>
                            <div className='flex flex-col'>
                                <span className="inline-block" style={{ width: "5.5rem" }}>End Date:</span>
                                {/* <input type="datetime-local" name="end"
                                    value={newEndDate} 
                                    onChange={(e) => handleDateChange("end", e.target.value)}
                                    min={newStartDate ? moment(newStartDate).format("YYYY-MM-DDTHH:mm") : ''}
                                /> */}
                                <DateTimeItem
                                  id="end"
                                  name={"scheduleEndDate"} 
                                  value={newEndDate} 
                                  onChange={handleDateChange} 
                                  showLabel={false}
                                  //style={{ color: "var(--centrablue)" }} 
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
                                            startStr: moment(selectedEvent.startStr).format("YYYY-MM-DD h:MM A"),
                                            endStr: moment(selectedEvent?.endStr).format("YYYY-MM-DD h:MM A")
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
                    style={{ right: -195, top: 100, minWidth: "12rem" }}
                >
                    <div>
                        Change status to:
                        <hr className="mt-1 mb-2" />
                        <Select
                            options={statusOptions}
                            selected={newStatus}
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
                                        newState: newStatus                                        
                                    });

                                    setNewStatus(newStatus);
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