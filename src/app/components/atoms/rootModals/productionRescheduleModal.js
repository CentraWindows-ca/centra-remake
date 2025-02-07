"use client"
import React from "react";
import { useSelector } from "react-redux";

import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import ProductionEvent from "app/components/organisms/events/productionEvent";

import moment from "moment";

import { YMDDateFormat } from "app/utils/utils";

export default function ProductionRescheduleModal(props) {
  const {
    showRescheduleConfirmation,
    handleMoveOk,
    handleMoveCancel,
    changeEvent,
  } = props;

  const { isReadOnly } = useSelector(state => state.app);

  return (
    <ConfirmationModal
      title={"Reschedule Confirmation"}
      open={showRescheduleConfirmation}
      onOk={handleMoveOk}
      onCancel={handleMoveCancel}
      cancelLabel={"Cancel"}
      okLabel={"Ok"}
      showIcon={false}
      okDisabled={isReadOnly}
    >
      <div className="pt-2 text-sm text-semibold pr-2" style={{ width: "19rem" }}>
        <ProductionEvent
          event={changeEvent?.event}
          style={{
            backgroundColor: changeEvent?.event.backgroundColor || changeEvent?.event?._def?.ui?.backgroundColor,
            borderRadius: "3px",
            padding: "0.2rem 0.5rem",
          }}
          textStyle={{
            fontWeight: "500"
          }}
        />
        <div className="pt-2" style={{ width: "20rem" }}>
          <table style={{ width: "20rem" }}>
            <tr>
              <td style={{ width: "6rem" }}></td>
              <td className="font-semibold text-gray-500">Old Date</td>
              <td className="font-semibold text-blue-600">New Date</td>
            </tr>
            <tr>
              <td className="font-semibold">Start</td>
              <td>{YMDDateFormat(changeEvent?.oldEvent?.startStr)}</td>
              <td>{YMDDateFormat(changeEvent?.event?.startStr)}</td>
            </tr>
            <tr>
              <td className="font-semibold">End</td>
              <td>{moment(changeEvent?.oldEvent?.endStr)?.isValid() ? moment(changeEvent?.oldEvent?.endStr)?.subtract(1, "days")?.format("YYYY-MM-DD") : changeEvent?.oldEvent?.startStr}</td>

              {changeEvent?.title !== "Reschedule" &&
                <td>{moment(changeEvent?.event?.endStr)?.isValid() ? moment(changeEvent?.event?.endStr)?.subtract(1, "days")?.format("YYYY-MM-DD") : changeEvent?.event?.startStr}</td>
              }

              {changeEvent?.title === "Reschedule" &&
                <td>{changeEvent?.event?.endStr || changeEvent?.event?.startStr}</td>
              }
            </tr>
          </table>
          <div className="pt-3">Do you want to proceed with the update?</div>
        </div>
      </div>
    </ConfirmationModal>
  )
}
