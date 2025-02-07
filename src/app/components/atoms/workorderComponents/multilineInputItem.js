"use client"
import React, { useMemo } from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';
import { Tag } from "antd";

export default function MultilineInputItem(props) {
  const {
    name,
    value,
    id,
    style,
    onChange,
    label,
    icon,
    rows = 3,
    disabled = false,
    isEdited,
    color
  } = props;

  return (
    <div style={{ ...style }}>
      <Tag icon={icon} color={color} className="mb-1 mt-1">
        {label}
      </Tag>
      {isEdited && <span className="pl-1 text-amber-500">*</span>}
      <textarea
        id={id}
        className={styles.textArea}
        disabled={disabled}
        onChange={onChange}
        name={name}
        rows={rows}
        value={value || ""}
      />
    </div>
  )
}