"use client";
import React from "react";
import styles from "app/components/atoms/workorderComponents/workorderComponents.module.css";
import moment from "moment";
export default function LabelItem(props) {
  const {
    value,
    label,
    type,
    style,
    leftAlign,
    isValueBold,
    className,
    onClick,
    labelWidth,
  } = props;

  const GetValue = (type, value) => {
    let result = value;
    if (value) {
      switch (type) {
        case "Date":
          result = moment(value).format("YYYY-MM-DD");
          break;
        case "Currency":
          result = value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
          break;
        case "DateTime":
          result = moment(value).format("YYYY-MM-DD hh:mm A");
        default:
          break;
      }
    }
    return result;
  };

  return (
    <>
      <div
        className={styles.labelItem}
        style={{ minWidth: labelWidth ?? "7rem" }}
      >
        {label}
      </div>
      <div
        className={`${styles.labelItem} ${leftAlign ? "" : "text-end"} ${
          isValueBold ? "font-semibold" : "font-normal"
        } ${className} ${type === "Date" ? "pr-[1.5rem]" : ""} ${
          onClick ? "hover:underline hover:cursor-pointer" : ""
        }`}
        style={{ ...style }}
        onClick={onClick ?? null}
      >
        {GetValue(type, value)}
      </div>
    </>
  );
}
