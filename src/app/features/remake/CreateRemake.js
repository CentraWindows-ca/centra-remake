"use client";
import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";

import {
  fetchRemakeWorkOrderById,
} from "app/api/remakeApis";

import { useQuery } from "react-query";

import { Form, Select, DatePicker, Space, Input, Calendar } from "antd";
const { TextArea } = Input;

import { ProductionRemakeOptions } from "app/utils/constants";

import Attachments from "app/features/remake/Attachments";

export default function CreateRemake(props) {
  const [sss, setSSS] = useState(null);
  const [received, setReceived] = useState(null);


  useEffect(() => {
    const handleMessage = (event) => {
      // Optionally check origin: if (event.origin !== 'http://localhost:3005') return;
      if (event.data?.type === "WO_SELECTED") {
        console.log("Work order received:", event.data.workOrder);
        // Do something with the data
        setReceived(event.data.workOrder);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="h-[80vh] w-[80vw]">

      <div className="w-[20rem] border-r pr-6">
        <div>                    
          <div>Input + Lookup</div>
          <div>or</div>
          <div>Search</div>
        </div>
        {false &&
        <Calendar
          fullscreen={false}
          onSelect={(x) => {
            setSSS(x);
          }} />
          }
        WO Item List
        <div className="mt-4 h-[10rem]" key={"VKTEST11"}>
          <iframe
            key={`iframe-${sss}`}
            src={`http://localhost:3005/event-list?wo=${sss}`}
            style={{
              width: '100%',
              height: '300px',
              border: 'none',
            }}
            title="Example Iframe"
          />
        </div>
      </div>

    </div>
  );
}
