"use client";
import React, { useState, useRef, useEffect } from "react";
import { DatePicker, Form } from "antd";
import SelectField from "./selectField";
import { WorkOrderSelectOptions } from "app/utils/constants";
import dayjs from "dayjs";

export default function DateInputField(props) {
  const {
    id,
    value,
    fieldName,
    label,
    onChange,
    disabled,
    labelPos = "left",
    labelSpan = 9,
    inputSpan = 15,
    typeValue = "",
  } = props;
  const datePickerRef = useRef(null);
  const [dateValue, setDateValue] = useState(null);
  const [type, setType] = useState(typeValue);
  const handleTypeChange = (selectedOption) => {
    setType(selectedOption);
    setDateValue(null);

    onChange(fieldName, undefined);
  };

  const handleValueChange = (date, dateString) => {
    onChange(fieldName, dateString);
    setDateValue(date);
  };

  useEffect(() => {
    setType(typeValue);
  }, [typeValue]);

  useEffect(() => {
    if (value) {
      setDateValue(dayjs(value));
    }
  }, [value]);

  return (
    <>
      <Form.Item name={`${fieldName}type`} style={{ marginBottom: "0px" }}>
        <SelectField
          id={`${id}Type`}
          label={`${label}`}
          fieldName={`${fieldName}Type`}
          options={WorkOrderSelectOptions.originalWODateTypes}
          onChange={handleTypeChange}
        />
      </Form.Item>

      {type ? (
        <Form.Item
          style={{ marginBottom: "0px" }}
          id={id}
          label={`    `}
          name={fieldName}
          disabled={disabled}
          labelCol={labelPos === "left" ? { span: labelSpan } : { span: 24 }}
          wrapperCol={labelPos === "left" ? { span: inputSpan } : { span: 24 }}
          rules={[
            {
              required: type,
              message: `${label} is required`,
            },
          ]}
        >
          <div className="flex space-x-2">
            <DatePicker
              ref={datePickerRef}
              size="small"
              style={{ width: "100%" }}
              picker={type.toLowerCase()}
              placeholder={`Select ${type}`}
              onChange={handleValueChange}
              value={dateValue}
            />
          </div>
        </Form.Item>
      ) : null}
    </>
  );
}
