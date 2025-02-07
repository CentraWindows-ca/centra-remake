"use client";
import styles from '../installationWorkorder.module.css';
import React from "react";
import Group from "app/components/atoms/workorderComponents/group";

export default function Remeasure(props) {
  const {
    inputData,
    style,
    className
  } = props;

  return (
    <Group
      title={"Remeasure"}
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
      Remeasure / Return
    </Group>
  )
}