"use client";
import React from "react";
import styles from "./fields.module.css";
import { DatePicker, Form } from "antd";

export default function DateTimeSelectField(props) {
  const {
    id,
    fieldName,
    label,
    disabled,
    required,
    labelPos = "left",
    labelSpan = 9,
    inputSpan = 15,
  } = props;

  return (
    <Form.Item
      style={{ marginBottom: "0px", width: "100%" }}
      id={id}
      label={<span className={styles.customLabel}>{label}</span>}
      name={fieldName}
      disabled={disabled}
      required={required}
      labelAlign="left"
      labelCol={labelPos === "left" ? { span: labelSpan } : { span: 24 }}
      wrapperCol={labelPos === "left" ? { span: inputSpan } : { span: 24 }}
      rules={[
        {
          required: required,
          message: `${label} is required`,
        },
      ]}
    >
      <DatePicker
        size="small"
        style={{ width: "100%" }}
        disabled={disabled}
        showTime
        placeholder="Select date & time"
        use12Hours
        format="YYYY-MM-DD h:mm A"
      />
    </Form.Item>
  );
}
