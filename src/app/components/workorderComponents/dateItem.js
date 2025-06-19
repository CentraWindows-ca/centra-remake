"use client"
import React, { useMemo } from "react";
import moment from 'moment';

export default function DateItem(props) {
  const { value, id, name, onChange, label, changeItems, style, leftAlign = false } = props;

  let edited = useMemo(() => changeItems?.find(x => x.key === name), [name, changeItems]);

  return (
    <>
      <div style={{ minWidth: "10rem" }}>
        <span>{label}</span>
        {edited && <span className="pl-1 text-amber-500">*</span>}
      </div>
      <div className={`${leftAlign ? '' : 'text-end'} `} style={{ ...style }}>
        <input type="date" id={id} name={name} value={moment(value).format("YYYY-MM-DD")} onChange={onChange} className="w-[6.5rem]" />
      </div>
    </>
  )
}
