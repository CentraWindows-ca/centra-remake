"use client"
import React, { useMemo } from "react";
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';

export default function DateStartEndItem(props) {
  const {
    values,
    id,
    name,
    onChange,
    label,
    changeItems,
    style,
    labelClassName,
    valueClassName,    
  } = props;

  let edited = useMemo(() => changeItems?.find(x => x.key === name), [name, changeItems]);

  return (
    <>
      <div style={{ minWidth: "8rem" }} className={labelClassName}>
        <div className="pt-1">{label}</div>
        {edited && <span className="pl-1 text-amber-500">*</span>}
      </div>
      <div className={`${valueClassName}`} style={{ ...style }}>
        <RangePicker
          value={[
            dayjs(values[0], 'YYYY-MM-DD'), dayjs(values[1], 'YYYY-MM-DD')
          ]}
        />
      </div>
    </>
  )
}
