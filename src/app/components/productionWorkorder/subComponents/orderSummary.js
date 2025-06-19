"use client";
import styles from '../productionWorkorder.module.css';
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";

export default function OrderSummary (props) {
    const { inputData, style } = props;

    return (
        <Group
            title={"Summary"}
            style={{ minWidth: "21rem", ...style }}
            contentStyle={{
                padding: "0.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateColumns: "3fr 3fr"
            }}
            className={styles.groupSchedule}
        >
            <LabelItem label={"Total Windows"} value={inputData?.totalWindows} isValueBold={true} style={{ color: "var(--centrablue)" }} />
            <LabelItem label={"Total Patio Doors"} value={inputData?.totalPatioDoors} isValueBold={true} style={{color: "var(--centrablue)"}} />
            <LabelItem label={"Total Doors"} value={inputData?.totalDoors} isValueBold={true} style={{ color: "var(--centrablue)" }} />
            <LabelItem label={"Total Sales Amount"} value={inputData?.totalPrice} type={"Currency"} isValueBold={true} style={{ color: "var(--centrablue)" }} />
        </Group>
    )
}