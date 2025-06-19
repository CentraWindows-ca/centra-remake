"use client";
import React, {useCallback, useEffect, useState} from "react";
import MultilineInputItem from  "app/components/workorderComponents/multilineInputItem";
import Tooltip from "app/components/tooltip/tooltip";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { mapCallMessageTypeToKey } from 'app/utils/utils';
import { Modal, Box } from "@mui/material";
import DateTimeItem from 'app/components/workorderComponents/dateTimeItem';
import { useAuthData } from "context/authContext";

export default function CallLogEditModal(props) {
    const { parentId, show, onClose, calledMsgTypes, callLog, onSave } = props;
    
    const [callLogInfo, setCallLogInfo] = useState({});
    const [saveDisabled, setSaveDisabled] = useState(true);
    const { loggedInUser } = useAuthData();
    
    const handleSelectType = useCallback((type) => {
        setCallLogInfo(ct => {
             let _ct = {...ct};
             _ct.calledMessage = type.value;
             return _ct;
        })
    },[])

    const handleCalledNoteChange = useCallback((e) => {
        if (e) {
            setCallLogInfo(ni => {
                let _ni = {...ni};
                _ni.calledNotes = e.target.value;
                return _ni;
           })
        }
    },[])

    const handleDateTimeChange = useCallback((e) => {
        if (e && e.target.value !== '') {
            setCallLogInfo(ni => {
                let _ni = {...ni};
                _ni.calledDate = e.target.value;
                return _ni;
           })
        }
    },[])

    useEffect(()=>{
        if (callLog) {
            setCallLogInfo(ni => {
                let _ni = {...callLog}

                if (_ni.id === null || _ni.id === undefined) {
                    _ni = {
                        parentId: parentId,
                        calledNotes: '',
                        calledDate: new Date(),
                        calledMessage: calledMsgTypes[0].value,
                        calledBy: loggedInUser ? loggedInUser.name : "Test User"
                    }
                }
           
                return _ni;
            });
        }
    },[callLog])

    useEffect(()=> {
        if (callLogInfo.notes !== '')
            setSaveDisabled(false);
        else
            setSaveDisabled(true);
        
    },[callLogInfo])

    return (
        <Modal
            open={show}
            onClose={onClose}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                borderRadius: "3px"
            }}
                className="w-1/2"
            >
                <div className="flex flex-col space-y-2">
                    <span className="font-bold">Add / Edit Call Log</span>
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <label> Message Type</label>
                            <Tooltip title="Choose Called Message Type">
                                <DropdownButton id="dropdown-basic-button" color="red" 
                                    title={
                                        <span>
                                            <span>{callLogInfo.calledMessage ? calledMsgTypes.find(option=>option.key === mapCallMessageTypeToKey(callLogInfo.calledMessage)).value : calledMsgTypes[0].value}</span>
                                        </span>
                                    }
                                >
                                    {
                                        calledMsgTypes.map((c, index) => {
                                            return (
                                                <Dropdown.Item onClick={() => handleSelectType(c)} key={`dropdown-msgtype-${index}`}>
                                                    <span className="pl-2">
                                                        {c.value}
                                                    </span>
                                                </Dropdown.Item>
                                            )
                                        })
                                    }
                                </DropdownButton>
                            </Tooltip>
                        </div>
                        <div className="flex items-center space-x-4">
                            <DateTimeItem
                                id={`noteDateTime_${callLogInfo.id}`} 
                                value={callLogInfo.calledDate} 
                                name="noteDateTime" 
                                onChange={handleDateTimeChange} 
                                label=""
                            />
                        </div>
                    </div>
                   
                        <MultilineInputItem rows={10} value={callLogInfo.calledNotes} onChange={handleCalledNoteChange}/>
                   
                    <div className="flex justify-end space-x-2">
                        <button
                            className="btn"
                            style={{ fontSize: "0.9rem" }}
                            onClick={onClose}
                            >
                            <i className="bi bi-x-circle mr-2"></i>
                            Cancel
                        </button>
                        <Tooltip title="Save Note">
                            <button
                                className="btn btn-primary"
                                style={{ fontSize: "0.9rem" }}
                                disabled={saveDisabled}
                                onClick={(e)=>onSave(e, callLogInfo)}>
                                <i className="bi bi-save mr-2"></i>
                                Save
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}