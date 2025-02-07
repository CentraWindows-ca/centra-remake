"use client"
import React from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';
import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function Group(props) {
  const {
    id,
    key,
    title,
    style,
    contentStyle,
    iconButtonsLeft,
    iconButtonsRight,
    className,
    titleStyle
  } = props;

  return (
    <div
      id={id ?? key}
      style={{ ...style }}
      className={`${styles.group} ${className}`}
      key={key}
    >
      <div
        style={{
          backgroundColor: '#EBEFF3',
          fontWeight: 500,
          padding: "0.2rem 0 0.2rem 0.5rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          ...titleStyle,          
        }}
      >
        <span>          
          {iconButtonsLeft?.length > 0 &&
            <span style={{ marginRight: "0.3rem" }}>
              {iconButtonsLeft.map((iconButton, index) => {
                let { Icon } = iconButton;
                return (
                  <Tooltip key={`icon-button-${index}`} title={iconButton.tooltip}>
                    <Icon
                      className={`${styles.icon} ${iconButton.className}`}
                    />
                  </Tooltip>
                )
              })}
            </span>
          }
          {title}
        </span>
        <span>
          {iconButtonsRight?.length > 0 &&
            <span style={{ marginRight: "0.2rem", marginTop: "-2px" }}>
              {iconButtonsRight.map((iconButton, index) => {
                let { Icon } = iconButton;
                return (
                  <Tooltip key={`icon-button-${index}`} title={iconButton.tooltip} style={{ paddingLeft: "0.5rem" }}>
                    <Icon className={`bi bi-${iconButton.icon} ${styles.icon} ${iconButton.className}`} onClick={iconButton.callback} style={{ height: "1.3rem" }} />
                  </Tooltip>
                )
              })}
            </span>
          }
        </span>
      </div>
      <div style={{
        ...contentStyle
      }}>
        {props.children}
      </div>
    </div>
  )
}

