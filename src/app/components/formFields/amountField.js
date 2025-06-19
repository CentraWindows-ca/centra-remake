"use client";
import React, { useMemo } from "react";
import styles from "./fields.module.css";
import { Form, InputNumber } from "antd";

export default function AmountField(props) {
  const {
    id,
    value,
    fieldName,
    label,
    onChange,
    changeItems,
    disabled,
    required,
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
      style={{ marginBottom: "0px" }}
    >
      <InputNumber
        size="small"
        formatter={(value) =>
          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
}
