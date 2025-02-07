"use client"
import React, { useMemo } from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';
import moment from 'moment';

import { Tag } from "antd";

export default function MultilineDateInputItem(props) {
  const {
    name,
    value,
    id,
    style,
    onChange,
    onDateChange,
    label,
    icon,
    date,
    isEdited,
    color
  } = props;

  return (
    <div style={{ ...style }}>
      <div className="flex flex-row justify-between">
        <span>
          <Tag icon={icon} color={color} className="mt-1 mb-1">
            {label}
          </Tag>
          {isEdited && <span className="pl-1 text-amber-500">*</span>}
        </span>
        <input type="date" name={"returnTripStartDate"} value={moment(date).format("YYYY-MM-DD")} onChange={onDateChange} />
      </div>
      <textarea
        id={id}
        name={name}
        rows="3"
        className={styles.textArea}
        value={value || ""}
        onChange={onChange}
      />
    </div>
  )
}