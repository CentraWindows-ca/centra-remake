"use client"
import React from "react";
import { useSelector } from "react-redux";

import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import ProductionEvent from "app/components/organisms/events/productionEvent";

import { ProductionStates } from "app/utils/constants";

export default function ProductionChangeStatusModal (props) {
    const {
        showChangeStatusConfirmation,
        handleChangeStatusCancel,
        changeEvent,
        handleStateChangeOk
    } = props;

    const { isReadOnly } = useSelector(state => state.app);

    return (
        <ConfirmationModal
            title={"Change Status Confirmation"}
            open={showChangeStatusConfirmation}
            onOk={handleStateChangeOk}
            onCancel={handleChangeStatusCancel}
            cancelLabel={"Cancel"}
            okLabel={"Ok"}
            showIcon={false}
            okDisabled={isReadOnly}
        >
            <div className="pt-3 pr-2 text-sm">
                <div>
                    <div className="pb-1 text-sm"><span className="font-semibold">Old Status:</span><span className="pl-2 font-semibold text-gray-500">{ProductionStates[changeEvent?.oldState]?.label}</span></div>
                    <ProductionEvent
                        event={changeEvent?.event}
                        style={{
                            backgroundColor: changeEvent?.event.backgroundColor || changeEvent?.event?._def?.ui?.backgroundColor,
                            borderRadius: "3px",
                            padding: "0.2rem 0.5rem",
                        }}
                        textStyle={{
                            fontWeight: "500",
                            fontSize: "0.9rem"
                        }}
                    />
                </div>
                
                <div className="pt-4">
                    <div className="pb-1"><span className="font-semibold">New Status:</span><span className="pl-2 font-semibold text-blue-600">{ProductionStates[changeEvent?.newState]?.label}</span></div>
                    <ProductionEvent
                        event={changeEvent?.event}
                        style={{
                            backgroundColor: ProductionStates[changeEvent?.newState]?.color,
                            borderRadius: "3px",
                            padding: "0.2rem 0.5rem",
                        }}
                        textStyle={{
                            fontWeight: "500",
                            fontSize: "0.9rem"
                        }}
                    />   
                </div>                
            </div>
            <div className="pt-4 pr-2 text-sm">Do you want to proceed with the update?</div>                
        </ConfirmationModal>
    )
}
