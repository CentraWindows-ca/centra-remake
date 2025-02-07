"use client";
import React from "react";
import styles from '../serviceWorkorder.module.css';
import Group from "app/components/atoms/workorderComponents/group";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";


export default function ServiceSummary (props) {
    const { inputData, handleInputChange } = props;

    return (
        <Group
            title={"Summary"}
            style={{ minWidth: "21rem" }}
            contentStyle={{
                padding: "0.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateColumns: "3.5fr 1.5fr",
                rowGap: "0.3rem"
            }}
            className={styles.groupSchedule}
        >
            <LabelItem label={"Remaining Balance Owing"} value={inputData?.remainingBalanceOwing} style={{ color: "var(--centrablue)" }} />
            <LabelItem label={"Amount Owing"} value={inputData?.amountOwing} type={"Currency"}  style={{ color: "var(--centrablue)" }} />
            <LabelItem label={"Total Sales Amount"} value={inputData?.salesprice} type={"Currency"} isValueBold={true}  style={{ color: "var(--centrablue)" }} />
        </Group>
    )
}