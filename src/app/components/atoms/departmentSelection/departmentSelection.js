"use client"
import React from "react";
import { SearchCategories, Production, Service } from "app/utils/constants";
import { Select } from 'antd';

export default function DepartmentSelection(props) {
  const { onChange, value, style } = props;

  let options = SearchCategories.map(d => {
    const enableOption = (d.key === Production);

    return {
      value: d.key,
      label: d.value,
      disabled: !enableOption
    }
  });

  return (
    <Select
      value={value}
      //defaultValue={options[0]}
      options={options}
      onChange={onChange}
      style={{ ...style }}
    />
  )
}
