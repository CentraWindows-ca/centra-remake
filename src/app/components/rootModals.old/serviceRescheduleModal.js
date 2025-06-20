"use client"
import React from "react";
import { useSelector } from "react-redux";

import ConfirmationModal from "app/components/confirmationModal/confirmationModal";
import ProductionEvent from "app/components/events/productionEvent";

import moment from "moment";
import ServiceEvent from "app/components/events/serviceEvent";

export default function ServiceRescheduleModal (props) {
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
            <div className="pt-2 text-sm text-semibold pr-2" style={{ width: "25rem" }}>
                <ServiceEvent
                    event={changeEvent?.event}
                    style={{
                        backgroundColor: changeEvent?.event.backgroundColor || changeEvent?.event?._def?.ui?.backgroundColor,
                        borderRadius: "3px",
                        padding: "0.2rem 0.5rem",
                    }}
                    textStyle={{
                        fontWeight: "500"
                    }}
                    showSchedule={false}
                    title={changeEvent?.event.serviceWorkOrderNumber}
                />
                    <div className="pt-2" style={{ width: "20rem" }}>                    
                        <table>
                            <tr>
                                <td style={{ width: "6rem" }}></td>
                                <td  className="font-semibold text-blue-600">Old Date</td>
                                <td  className="font-semibold text-blue-600">New Date</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Start</td>
                                <td>{moment(changeEvent?.oldEvent?.startStr).format("YYYY-MM-DD h:mm A")}</td>
                                <td>{moment(changeEvent?.event?.startStr).format("YYYY-MM-DD h:mm A")}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">End</td>
                                <td>{moment(changeEvent?.oldEvent?.endStr)?.isValid() ? moment(changeEvent?.oldEvent?.endStr)?.format("YYYY-MM-DD h:mm A"): changeEvent?.oldEvent?.startStr}</td>
                                <td>{moment(changeEvent?.event?.endStr)?.isValid() ? moment(changeEvent?.event?.endStr)?.format("YYYY-MM-DD h:mm A") : changeEvent?.event?.startStr}</td>
                            </tr>
                        </table>                                        
                    <div className="pt-3">Do you want to proceed with the update?</div>
                </div>
            </div>
        </ConfirmationModal>
    )
}
