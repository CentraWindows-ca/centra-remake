"use client";
import styles from "./orderStatus.module.css";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";

import { Popover } from "antd";

export default function OrderStatus(props) {
  const {
    style,
    className,
    statusKey,
    handleStatusCancelCallback,
    updateStatusCallback,
    statusList,
    orderId,
    id,
    viewMode = false,
  } = props;

  const dispatch = useDispatch();

  const { isReadOnly, moduleName } = useSelector((state) => state.orders);

  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [showScheduleConfirmation, setShowScheduleConfirmation] =
    useState(false);
  const [newStatus, setNewStatus] = useState(null);

  let statusOptions = statusList[statusKey].transitionTo.map((key) => {
    return {
      key: key,
      value: statusList[key]?.label,
      color: statusList[key]?.color,
    };
  });

  const handleStatusClick = (so) => {
    let _newStatus = statusOptions.find((x) => x.value === so?.value);
    setNewStatus(_newStatus.key);

    if (_newStatus.key === "scheduled") {
      setShowScheduleConfirmation(true);
    } else {
      setShowStatusConfirmation(true);
    }
  };

  const popoverContent = (
    <div>
      <hr className="mt-0 mb-3" />
      <div className="flex flex-col space-y-2">
        {statusOptions?.map((so, index) => {
          return (
            <div
              className={`flex items-center text-white hover:brightness-95 cursor-pointer justify-center ${styles.workOrderStatus}`}
              style={{ backgroundColor: so?.color }}
              key={`so_${index}`}
              onClick={() => handleStatusClick(so)}
            >
              {so?.value}
            </div>
          );
        })}
      </div>
      <hr className="mt-0 mb-3" />
      <div className="border-t-2 border-t-gray-200 hover:bg-blue-100 hover:text-centraBlue p-2 cursor-pointer font-semibold text-xs">
        View Workflow
      </div>
    </div>
  );

  const handleStatusOk = useCallback(() => {
    if (newStatus) {
      updateStatusCallback(newStatus, orderId);
      setNewStatus(newStatus);
      setShowStatusConfirmation(false);
    }
  }, [newStatus, updateStatusCallback, orderId]);

  const handleStatusCancel = () => {
    setShowStatusConfirmation(false);
    handleStatusCancelCallback();
  };

  const handleScheduleOk = useCallback(
    async (val) => {
      if (newStatus && val) {
        await updateStatusCallback(newStatus, orderId, val);
        setNewStatus(newStatus);
        setShowScheduleConfirmation(false);
      } else {
        console.log("Invalid schedule details.");
      }
    },
    [newStatus, updateStatusCallback, orderId]
  );

  const handleScheduleCancel = () => {
    setShowScheduleConfirmation(false);
  };

  return (
    <>
      <Tooltip title="Click to update status">
        <Popover
          placement="bottomLeft"
          content={popoverContent}
          title="Change status to: "
          trigger={isReadOnly || viewMode ? "" : "click"}
        >
          <span
            className={`${styles.workOrderStatus} ${className} hover:brightness-95 space-x-4 px-2`}
            style={{
              backgroundColor: statusList[statusKey]?.color,
              color: statusKey === "readyToShip" ? "var(--darkgrey)" : "#FFF",
              display: "inline-block",
              minWidth: "7rem",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ...style,
            }}
          >
            <div>{statusList[statusKey]?.label}</div>
            {!viewMode ? <i className="fa-solid fa-caret-down" /> : <></>}
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
  );
}
