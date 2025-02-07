"use client";
import React, { useMemo } from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';

export default function TextAreaItem(props) {
  const {
    id,
    value,
    name,
    label,
    onChange,
    changeItems,
    disabled,
    rows = 1,
    required = false,
  } = props;

  let edited = useMemo(
    () => changeItems?.find((x) => x.key === name),
    [name, changeItems]
  );

  const showRequiredAsterisk =
    required && (value === undefined || value?.trim() === "");

  return (
    <>
      <div className="truncate">
        <span>{label}</span>
        {showRequiredAsterisk && <span className="pl-1 text-red-500">*</span>}
        {!required && edited && <span className="pl-1 text-amber-500">*</span>}
      </div>
      <textarea
        id={id}
        className={`${styles.textAreaSmall} text-sm`}
        disabled={disabled}
        onChange={onChange}
        name={name}
        rows={rows}
        value={value}
      />
    </>
  );
}
