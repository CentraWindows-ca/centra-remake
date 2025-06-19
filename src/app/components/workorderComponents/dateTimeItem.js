"use client";
import React, { useMemo } from "react";
import moment from "moment";

export default function DateTimeItem(props) {
  const {
    value,
    id,
    name,
    onChange,
    label,
    changeItems,
    style,
    disabled,
    minDate = null,
    showLabel = true,
  } = props;

  let edited = useMemo(
    () => changeItems?.find((x) => x.key === name),
    [name, changeItems]
  );

  return (
    <>
      {showLabel && (
        <div style={{ minWidth: "10rem" }}>
          <span>{label}</span>
          {edited && <span className="pl-1 text-amber-500">*</span>}
        </div>
      )}

      <div className="flex space-x-4" style={{ ...style }}>
        {/* <input
                    type="datetime-local"
                    id={id}
                    name={name}
                    value={moment(value).format("YYYY-MM-DDTHH:mm")}
                    onChange={onChange}
                    required={true}
                    disabled={disabled}
                    min={minDate ? moment(minDate).format("YYYY-MM-DDTHH:mm") : ''}
                /> */}

        <input
          type="date"
          id={id}
          name={name}
          value={moment(value).format("YYYY-MM-DD")}
          onChange={(e) => onChange(e, "date", id)}
          required={true}
          disabled={disabled}
          min={minDate ? moment(minDate).format("YYYY-MM-DD") : ""}
        />
        <input
          type="time"
          id={id}
          name={name}
          value={moment(value).format("HH:mm")}
          onChange={(e) => onChange(e, "time", id)}
          required={true}
          disabled={disabled}
        />
      </div>
    </>
  );
}
