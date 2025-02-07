"use client";
import React from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';
import Tooltip from "app/components/atoms/tooltip/tooltip";

import { Radio, ConfigProvider } from 'antd';

export default function RadioItem(props) {
  const {
    options,
    label,
    value,
    style,
    labelClassName,
    valueClassName,
    onChange
  } = props;

  return (
    <>
      <div className={labelClassName}>
        {label}
      </div>
      <div className={`${styles.labelItem} ${valueClassName}`} style={{ ...style }}>
        <Tooltip title={label}>
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  buttonSolidCheckedBg: "#404040",
                  buttonSolidCheckedHoverBg: "#404040",
                  buttonColor: "#404040",
                  buttonSolidCheckedHoverBg: "#404040",
                  algorithm: true                  
                },
              },
            }}
          >
            <Radio.Group
              options={options}
              onChange={onChange}
              value={value}
              optionType="button"
              buttonStyle="solid"
              size="small"
            />
          </ConfigProvider>
        </Tooltip>
      </div>
    </>
  )
}