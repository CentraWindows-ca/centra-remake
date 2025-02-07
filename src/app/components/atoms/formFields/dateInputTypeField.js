"use client";
import React, { useState } from "react";
import styles from "./fields.module.css";
import { DatePicker, Form, Input, InputNumber, Select, Space } from "antd";
import { generateOptions } from "app/utils/utils";

export default function DateInputField(props) {
  const {
    id,
    value,
    fieldName,
    label,
    onChange,
    disabled,
    required,
    labelPos = "left",
    labelSpan = 9,
    inputSpan = 15,
  } = props;

  return (
    <Form.Item
      style={{ marginBottom: "0px" }}
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
        // {
        //   validator: validateDate,
        // },
      ]}
    >
      <div className="flex space-x-2">
        <DatePicker
          size="small"
          style={{ width: "100%" }}
          picker="year"
          placeholder="Year"
        />

        <DatePicker
          size="small"
          style={{ width: "100%" }}
          picker="month"
          placeholder="Year"
        />
        {/* <Select
          size="small"
          style={{ width: "100%" }}
          placeholder="Month"
          picker="month"
          options={monthOptions}
        /> */}
        <Select
          size="small"
          style={{ width: "100%" }}
          placeholder="Day"
          options={dayOptions}
        />
      </div>
    </Form.Item>
  );
}
