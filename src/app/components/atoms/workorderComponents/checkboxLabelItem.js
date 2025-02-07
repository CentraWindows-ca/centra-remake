"use client"
import React from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';
export default function CheckboxLabelItem(props) {
  const {
    name,
    value,
    label,    
    style,
    leftAlign,
    className    
  } = props;

  return (
    <>
      <div className={styles.labelItem}>
        {props.children} <span className="pl-1">{label}</span>
      </div>
      <div className={`${styles.labelItem} ${leftAlign ? "" : "text-end"} ${className}`} style={{ ...style }}>
        <input          
          checked={value}          
          name={name}
          onChange={() => { } }
          type="checkbox"
        />
      </div>
    </>
  )
}