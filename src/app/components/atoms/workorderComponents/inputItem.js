"use client";
import React, { useMemo } from "react";
import styles from "app/components/atoms/workorderComponents/workorderComponents.module.css";

export default function InputItem(props) {
  const { id, value, name, label, onChange, changeItems, disabled } = props;

  let edited = useMemo(
    () => changeItems?.find((x) => x.key === name),
    [name, changeItems]
  );

  return (
    <>
      <div className="truncate">
        <span>{label}</span>
        {edited && <span className="pl-1 text-amber-500">*</span>}
      </div>
      <input
        id={id}
        className={styles.inputItem}
        disabled={disabled}
        name={name}
        onChange={onChange}
        type="text"
        value={value}
      />
    </>
  );
}
