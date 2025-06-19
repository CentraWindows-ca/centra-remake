"use client";
import React from "react";

import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function LabelItem(props) {
  const { emphasizeValue, label, labelWidth, value, className } = props;

  return (
    <div className={`flex flex-row justify-start ${className}`}>
      <div className={`pr-2`} style={{ minWidth: labelWidth ?? "7rem" }}>
        {label}
      </div>
      <div
        className={`text-left ${
          emphasizeValue ? "font-semibold" : "font-normal"
        } ${emphasizeValue ? "text-blue-500" : ""} truncate`}
      >
        <Tooltip title={value}>{value}</Tooltip>
      </div>
    </div>
  );
}
