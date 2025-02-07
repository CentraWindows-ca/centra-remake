"use client";
import React from "react";
import styles from './select.module.css';

export default function Select(props) {
    const {
        style,
        ariaLabel,
        options,
        selected,
        onChange,
        className,
        disabled
    } = props;

    const handleOnChange = (event) => {
        const selectedIndex = event.target.options.selectedIndex;
        const key = event.target.options[selectedIndex].getAttribute('data-key');
        onChange(event.target.value, key)
    }

    return (
        <select
            disabled={disabled}
            className={`form-select ${styles.root} ${className}`}
            style={{ ...style }}
            aria-label={ariaLabel}
            value={selected?.label || selected?.value}
            onChange={handleOnChange}
        >                      
            {options?.map((option) => {
                return (
                    <option
                        className={styles.option}
                        key={`option-key-${option.key}`}
                        data-key={option.key}
                    >
                        {option?.label || option?.value}
                    </option>
                )
            })}      
        </select>
    )
}
