import React, { useCallback } from "react";
import { Popconfirm } from "antd";
import OrderStatus from "./orderStatus";
import { useSelector } from "react-redux";
import { updateRemakeWorkOrderState } from "app/api/remakeApis";

import { getStatusOptions } from "app/utils/utils";

export default function OrderModalHeader(props) {
  const {
    moduleName,
    orderId,
    orderIID,
    orderStatus,
    onClose,
    states,
    mapStatesFunc,
    reloadCallback,
    hasChanges,
  } = props;
  const { isMobile } = useSelector((state) => state.app);

  const updateStatus = useCallback(
    async (orderStatus, orderId) => {
      if (orderStatus && orderId) {
        let statusOptions = [];

        switch (moduleName) {
          case "remake":
            statusOptions = getStatusOptions("Remake");

            await updateRemakeWorkOrderState(
              statusOptions.find((x) => x.key === orderStatus).value,
              orderId
            );
            break;
          case "service":
            statusOptions = getStatusOptions("Service");

            await updateServiceWorkOrderState(
              statusOptions.find((x) => x.key === orderStatus).value,
              orderId
            );
            break;
          default:
            return;
        }

        if (reloadCallback) reloadCallback();
      }
    },
    [moduleName, reloadCallback]
  );

  return (
    <div className="sticky bg-white z-10">
      <div className={`flex flex-row justify-between mb-2`}>
        <div
          className={`flex flex-row items-center`}
          style={{ minWidth: "18rem" }}
        >
          {!isMobile && (
            <div
              className="bg-slate-200 pb-1 px-1 rounded"
              style={{ color: "var(--centrablue)" }}
            >
              <i className="fa-regular fa-rectangle-list pr-2 pl-1 align-sub"></i>
              <span className="pr-2 align-sub">{orderIID}</span>
            </div>
          )}

          <OrderStatus
            style={{ margin: "0 0.5rem 0 0.5rem" }}
            orderId={orderId}
            statusKey={mapStatesFunc(orderStatus)}
            statusList={states}
            updateStatusCallback={updateStatus}
            handleStatusCancelCallback={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
