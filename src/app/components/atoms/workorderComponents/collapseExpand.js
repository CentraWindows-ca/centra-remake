"use client"
import React from "react";
import styles from 'app/components/atoms/workorderComponents/workorderComponents.module.css';

import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function CollapseExpand (props) {
    const { title, value, setValue, style } = props;

    return (
        <Tooltip title={title}>
            {value ?
                <KeyboardArrowUpIcon className={styles.icon} style={{ ...style }} onClick={() => { setValue(s => !s) }} />
                :
                <KeyboardArrowDownIcon className={styles.icon} style={{ ...style }} onClick={() => { setValue(s => !s) }} />
            }
        </Tooltip>
    )
}