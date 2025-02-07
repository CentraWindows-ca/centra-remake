"use client";
import styles from '../installationWorkorder.module.css';
import React from "react";
import Group from "app/components/atoms/workorderComponents/group";
import DateItem from "app/components/atoms/workorderComponents/dateItem";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";

export default function Summary(props) {
  const {
    inputData,
    style,
    className
  } = props;

  return (
    <Group
      title={"Summary"}
      contentStyle={{
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateColumns: "2fr 2fr",
        rowGap: "0.3rem"
      }}
      className={`${styles.groupInfo} ${className}`}
      style={{...style}}
    >   
      <LabelItem
        label={"Total Windows"}
        value={inputData?.totalWindows}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
      />
      <LabelItem
        label={"FFI"}
        value={inputData?.ffiCount}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
      />
      <LabelItem
        label={"FFR"}
        value={inputData?.ffrCount}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
      />
      <LabelItem
        label={"Total Patio Doors"}
        value={inputData?.totalDoors}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
      />
      <LabelItem
        label={"Total Codel Doors"}
        value={inputData?.totalExtDoors}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
      />
      <LabelItem
        label={"Total Sales Amount"}
        value={inputData?.totalSalesAmount}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
      />
      <LabelItem
        label={"Daily Sales Amount"}
        value={inputData?.salesAmmount}
        isValueBold={true}
        style={{ color: "var(--centrablue)" }}
      />
    </Group>
  )
}