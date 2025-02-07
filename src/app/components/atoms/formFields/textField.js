"use client";
import React from "react";
import styles from "./fields.module.css";
import { Form, Input } from "antd";

export default function TextField(props) {
  const {
    id,
    fieldName,
    label,
    disabled,
    required,
    labelPos = "left",
    labelSpan = 9,
    inputSpan = 15,
    size = "small",
  } = props;

  return (
    <Form.Item
      id={id}
      label={label ? <span className={styles.customLabel}>{label}</span> : null}
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
      style={{ marginBottom: "0px", width: "100%" }}
    >
      <Input placeholder={`Enter ${label}`} size={size} required={required} />
    </Form.Item>
  );
}
