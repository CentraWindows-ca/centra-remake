"use client";
import React, { useMemo } from "react";
import styles from "./fields.module.css";
import { DatePicker, Form, Input, Select } from "antd";

export default function DateSelectField(props) {
  const {
    id,
    value,
    fieldName,
    label,
    onChange,
    changeItems,
    disabled,
    required,
    options,
    labelPos = "left",
    labelSpan = 9,
    inputSpan = 15,
  } = props;

  let edited = useMemo(
    () => changeItems?.find((x) => x.key === fieldName),
    [fieldName, changeItems]
  );

  return (
    <Form.Item
      style={{ marginBottom: "0.5px" }}
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
      <DatePicker size="small" style={{ width: "100%" }} disabled={disabled} />
    </Form.Item>
  );
}
