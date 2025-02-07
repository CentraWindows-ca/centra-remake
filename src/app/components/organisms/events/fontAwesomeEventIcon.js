"use client";
import React from "react";
import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function FontAwesomeEventIcon({ title, iconName, color }) {
                                    
    return (
      <Tooltip title={title} >
        <i className={`ml-[2px] pl-[2px] pr-[2px] fa-solid ${iconName} ${color}`}/>
      </Tooltip>
    )
}