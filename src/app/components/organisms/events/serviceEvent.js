"use client";
import React from "react";
import moment from 'moment';

import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function ServiceEvent(props, cookies) {
    const { event, style, textStyle, className, showSchedule = true } = props;
    let _event = event?._def;
    let ep = { ..._event?.extendedProps };

    //const tooltip = `${event.title} W:${ep.windows} D:${ep.doors} VD:${ep.f61DR + ep.f27DS} PD:${ep.f52PD} ${ep.branch}-${ep.jobType}`;

    const getOptionsStyle = (cookies) => {
        let optionsStyle = {
            overflow: "hidden",
            textOverflow: "ellipsis",
        }        
        
        if (cookies?.options?.expandEvents) {
            optionsStyle = {
                overflowWrap: "anywhere",
                whiteSpace: "break-spaces",
            }
        }
            
        return optionsStyle;
    }
                                    
    return (
        <div 
            data-toggle="tooltip"
            data-placement="right"
            //title={tooltip}
            data-html="true"
            style={{ ...style, ...getOptionsStyle(cookies) }}
            won={event.title}
            className={className}
        >    
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <span className="pl-1 font-semibold" style={{...textStyle}}>{event.title}</span>     
                    <span>
                        {ep.city &&
                            <span className="pl-1 text-blue-800 font-semibold">{ep.city.toUpperCase()}</span>
                        }
                        {ep.customerName &&
                            <span className="pl-1 uppercase">{ep.customerName.toUpperCase()}</span>
                        }
                    </span>
                </div>

                { showSchedule && (
                    <div className="flex flex-row">
                        <span className="pl-1" style={{...textStyle}}>
                            {`${moment(event.start).format("hh:mm A")} - ${moment(event.end).format("hh:mm A")}`}
                        </span>     
                    </div>
                )}
              
            </div>
        </div>
    )
}