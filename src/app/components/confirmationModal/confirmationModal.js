"use client"
import React from "react";
import { useSelector } from "react-redux";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { Button, Space } from 'antd';

import LockButton from "app/components/lockButton/lockButton";

export default function ConfirmationModal (props) {
    const {
        key,
        title,
        open,
        style,        
        onCancel,
        onOk,
        okDisabled,
        cancelLabel,
        okLabel,
        showIcon
    } = props;

    const { isReadOnly } = useSelector(state => state.app);

    return (
        <Modal
            open={open}
            onClose={onCancel}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"            
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: "5px"
            }}>
                <div
                    style={{ ...style, fontFamily: "inherit" }}                    
                    key={key}
                >
                    <div style={{ borderRadius: "3px"}} className="flex flex-row justify-between pt-4 pl-2">
                        <div style={{ fontFamily: "inherit", fontWeight: 500, fontSize: "1rem", marginTop: "-7px" }}>
                            {showIcon && <i className="fa fa-circle-exclamation" style={{ color: "orange", fontSize: "1rem" }}></i>}<span className="pl-2">{title}</span>
                        </div>                      
                    </div>
                    <div className="pl-4 pr-2 pt-2">
                        {props.children}
                    </div>
                    <div className="pt-3 pb-3 relative">
                        <div className="flex flex-row justify-end pr-4 pt-2">   
                            <Space wrap>
                                <Button
                                    onClick={onCancel}
                                >
                                    {cancelLabel}
                                </Button>
                                <LockButton
                                    tooltip={""}
                                    onClick={onOk}
                                    disabled={okDisabled}
                                    showLockIcon={isReadOnly}
                                    label={okLabel}
                                />
                            </Space>
                        </div>
                    </div>
                </div>                
            </Box>            
        </Modal>
    )
}
