"use client";
import React from "react";
export default function Tooltip(props) {
  const { style, title, className } = props;

  return (
    <div data-toggle="tooltip" data-placement="right" title={title} data-html="true" className={`inline ${className}`} style={{ ...style }}>
      {props.children}
    </div>
  )
}
