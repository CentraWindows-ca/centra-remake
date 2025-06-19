"use client";
import React, { useMemo } from "react";
import styles from "./fields.module.css";
import { Form, Select } from "antd";

export default function SelectField(props) {
  const {
    id,
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
    defaultValue,
  } = props;

  let edited = useMemo(
    () => changeItems?.find((x) => x.key === fieldName),
    [fieldName, changeItems]
  );

  return (
    <Form.Item
      id={id}
      label={<span className={styles.customLabel}>{label}</span>}
      name={fieldName}
      disabled={disabled}
      labelAlign="left"
      labelCol={labelPos === "left" ? { span: labelSpan } : { span: 24 }}
      wrapperCol={labelPos === "left" ? { span: inputSpan } : { span: 24 }}
      required={required}
      rules={[
        {
          required: required,
          message: `${label} is required`,
        },
      ]}
      style={{ marginBottom: "0px" }}
    >
      <Select
        placeholder={`Select ${label}`}
        options={options}
        size="small"
        defaultValue={defaultValue}
        onChange={onChange ? onChange : null}
      />
    </Form.Item>
  );
}
