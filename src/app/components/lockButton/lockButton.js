"use client";
import React from "react";
import Tooltip from "app/components/tooltip/tooltip";

import { Button } from "antd";
export default function LockButton(props) {
    const { label, onClick, tooltip, disabled, showLockIcon, size = "default"} = props;

    return (
        <Tooltip title={tooltip}>
            <Button
                type={"primary"}
                onClick={onClick}
                disabled={disabled}
                size={size}
            >
                {showLockIcon && <i className="fa-solid fa-lock pr-2" />}
                <span>{label}</span>
            </Button>
        </Tooltip>
    )
}