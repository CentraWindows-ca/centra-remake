"use client";
import styles from '../serviceWorkorder.module.css';
import React, { useState } from "react";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import Select from "app/components/atoms/select/select";
import ConfirmationModal from '../../app/components/atoms/confirmationModal/confirmationModal';

import { ServiceStates } from "app/utils/constants";

import { Popover } from 'antd';

export default function ServiceEventState(props) {
    const {
        style,
        className,
        statusKey,
        setStatusKeyCallback,
        handleStatusOkCallback,
        handleStatusCancelCallback        
    } = props;

    const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);

    let statusOptions = Object.entries(ServiceStates).map((e) => {
        return { key: e[0], value: e[1].label, color: e[1].color }
    });

    const popoverContent = (
        <div>
            <hr className="mt-0 mb-3" />
            <Select
                options={statusOptions}
                style={{ fontSize: "0.8rem", padding: "3px 0 3px 9px", color: "rgb(75 85 99 / var(--tw-text-opacity))" }}
                onChange={(newStatus) => {
                    let _newStatus = statusOptions.find(x => x.value === newStatus);
                    setStatusKeyCallback(_newStatus.key);
                    setShowStatusConfirmation(true);
                }}
            />
        </div>
    );

    const handleStatusOk = () => {
        handleStatusOkCallback();
        setShowStatusConfirmation(false);
    }

    const handleStatusCancel = () => {        
        setShowStatusConfirmation(false);
        handleStatusCancelCallback();
    }

    return (
        <>
            <Tooltip title="Click to update status">
                <Popover placement="bottomLeft" content={popoverContent} title="Update Status" trigger="click">
                    <span
                        className={`${styles.workOrderStatus} ${className} hover:brightness-95`}
                        style={{
                            backgroundColor: ServiceStates[statusKey]?.color,
                            color: statusKey === "closed" ? "var(--darkgrey)" : "#FFF",
                            display: "inline-block",
                            minWidth: "7rem",
                            textAlign: "center",
                            ...style
                        }}
                    >
                        {ServiceStates[statusKey]?.label}
                    </span>
                </Popover>
            </Tooltip>
            <ConfirmationModal
                title={"Confirmation"}
                open={showStatusConfirmation}
                onOk={handleStatusOk}
                onCancel={handleStatusCancel}
                cancelLabel={"Cancel"}
                okLabel={"Ok"}
            >
                <div className="pt-2">
                    <div>This will automatically save the new status.</div>
                    <div>Proceed with the update?</div>
                </div>
            </ConfirmationModal>
        </>
    )
}