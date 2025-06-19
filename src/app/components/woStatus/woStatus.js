"use client";
import styles from './woStatus.module.css';
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";

import Tooltip from "app/components/tooltip/tooltip";
import Select from "app/components/select/select";
import ConfirmationModal from 'app/components/confirmationModal/confirmationModal';

import { Popover } from 'antd';

export default function WOStatus(props) {
  const {
    style,
    className,
    statusKey,
    setStatusKeyCallback,
    handleStatusCancelCallback,
    updateStatusCallback,
    statusList
  } = props;

  const { isReadOnly } = useSelector(state => state.app);

  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  let statusOptions = statusList[statusKey].transitionTo.map((key) => {
    return {
      key: key,
      value: statusList[key]?.label,
      color: statusList[key]?.color
    }
  });

  const popoverContent = (
    <div>
      <hr className="mt-0 mb-3" />
      <Select
        disabled={isReadOnly}
        options={[{ key: statusKey, value: statusList[statusKey]?.label }, ...statusOptions]}
        style={{ fontSize: "0.8rem", padding: "3px 0 3px 9px", color: "rgb(75 85 99 / var(--tw-text-opacity))" }}
        onChange={(newStatus) => {          
          let _newStatus = statusOptions.find(x => x.value === newStatus);
          setNewStatus(_newStatus?.key);
          setShowStatusConfirmation(true);
        }}
      />
    </div>
  );

  const handleStatusOk = useCallback(() => {
    if (newStatus) {
      updateStatusCallback(newStatus);
      setNewStatus(newStatus);
      setShowStatusConfirmation(false);
    }
  }, [newStatus, updateStatusCallback]);

  const handleStatusCancel = () => {
    setShowStatusConfirmation(false);
    handleStatusCancelCallback();
  }

  return (
    <>
      <Tooltip title="Click to update status">
        <Popover placement="bottomLeft" content={popoverContent} title="Change status to: " trigger={"click"}>
          <span
            className={`${styles.workOrderStatus} ${className} hover:brightness-95`}
            style={{
              backgroundColor: statusList[statusKey]?.color,
              color: statusKey === "readyToShip" ? "var(--darkgrey)" : "#FFF",
              display: "inline-block",
              minWidth: "7rem",
              textAlign: "center",

              ...style
            }}
          >
            {statusList[statusKey]?.label}
          </span>
        </Popover>
      </Tooltip>
      <ConfirmationModal
        title={"Status Change Confirmation"}
        open={showStatusConfirmation}
        onOk={handleStatusOk}
        onCancel={handleStatusCancel}
        cancelLabel={"Cancel"}
        okLabel={"Ok"}
        showIcon={true}
      >
        <div className="pt-2">
          <div>This will automatically save the new status.</div>
          <div>Do you want to proceed with the update?</div>
        </div>
      </ConfirmationModal>
    </>
  )
}