"use client"
import React, { useMemo } from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';
export default function CheckboxItem(props) {
  const {
    value,
    id,
    name,
    label,
    onChange,
    style,
    className,
    labelClassName,
    changeItems,
    disabled
  } = props;

  let edited = useMemo(() => changeItems?.find(x => x.key === name), [name, changeItems]);

  return (
    <div
      style={{ padding: "0 0.5rem 0.3rem 0.5rem", ...style }}
      className={`cursor-pointer ${styles.checkboxItemRoot} ${className}`}
      onClick={() => { onChange(name, !value) }}
    >
      <input
        id={id}
        checked={value}
        disabled={disabled}
        name={name}
        onChange={(e) => onChange(name, e.target.checked)}
        type="checkbox"
      />
      <span style={{ paddingLeft: "1rem" }}>
        <span>{props.children}</span>
        <span className={`${labelClassName} pl-1`}> { label }</span>
      {edited && <span className="pl-1 text-amber-500">*</span>}
    </span>
        </div >
    )
}