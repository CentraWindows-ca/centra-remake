"use client";
import React from "react";
export default function Title(props){
    const { style, labelStyle, label, Icon, className, labelClassName } = props;

    return (
      <div style={{ ...style, color: "var(--centrablue)" }} className={`${className} bg-slate-200 rounded pl-2`}>
        {Icon && <Icon />}
        <span style={{ ...labelStyle }} className={labelClassName}>
          {label}{props.children}
        </span>
      </div>
    )
}
