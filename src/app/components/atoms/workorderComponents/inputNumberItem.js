"use client"
import React, { useMemo } from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';
import { InputNumber } from 'antd';

export default function InputNumberItem(props) {
  const {
    id,
    value,
    name,
    label,
    changeItems,
    disabled,
    className,
    handleInputChange
  } = props;

  let edited = useMemo(() => changeItems?.find(x => x.key === name), [name, changeItems]);

  const onChange = (val) => {
    handleInputChange("estInstallerCnt", val);
  }

  return (
    <>
      <div className="truncate">
        <span>{label}</span>
        {edited && <span className="pl-1 text-amber-500">*</span>}
      </div>
      <InputNumber
        min={0}
        max={20}
        defaultValue={1}
        onChange={onChange}
        disabled={disabled}
        className={`${className} w-[50px]`}
        value={parseInt(value, 10)}
      />
    </>
  )
}
