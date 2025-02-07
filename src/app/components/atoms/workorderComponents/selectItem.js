"use client"
import React, { useMemo } from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';

import Select from "app/components/atoms/select/select";

export default function SelectItem(props) {
  const {
    changeItems,
    disabled,
    label,
    name,
    onChange,
    options,
    selected,
    value
  } = props;

  let edited = useMemo(() => changeItems?.find(x => x.key === name), [name, changeItems]);

  return (
    <>
      <div className="truncate">
        <span>{label}</span>
        {edited && <span className="pl-1 text-amber-500">*</span>}
      </div>
      <Select
        disabled={disabled}
        selected={selected}
        style={{ padding: 0, paddingLeft: "0.5rem", fontSize: "0.9rem", borderRadius: "2px" }}
        onChange={(label, key) => onChange(label, key, name, options)}
        options={options}
        value={value}
      />
    </>
  )
}