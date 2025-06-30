"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { useQuery } from "react-query";

import { Form, Select, DatePicker, Space, Input, Calendar } from "antd";

import {
  fetchProductionWindowsByWOFilter
} from "app/api/productionApis";

export default function CreateRemake(props) {
  //const [sss, setSSS] = useState(null);
  //const [received, setReceived] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [woList, setWOList] = useState([]);
  const searchParams = useSearchParams();
  const woParam = searchParams.get("workorder-no");

  //useEffect(() => {
  //  //const handleMessage = (event) => {
  //  //  // Optionally check origin: if (event.origin !== 'http://localhost:3005') return;
  //  //  if (event.data?.type === "WO_SELECTED") {
  //  //    console.log("Work order received:", event.data.workOrder);
  //  //    // Do something with the data
  //  //    setReceived(event.data.workOrder);
  //  //  }
  //  //};

  //  window.addEventListener("message", handleMessage);
  //  return () => {
  //    window.removeEventListener("message", handleMessage);
  //  };
  //}, []);

  useEffect(() => {
    console.log("searchQuery: ", searchQuery);
    if (searchQuery && searchQuery?.length > 1) {
      const delayDebounce = setTimeout(() => {
        const fetchData = async () => {
          const result = await fetchProductionWindowsByWOFilter(searchQuery);
          if (result) {
            setWOList(result);
          }
        };

        fetchData();
      }, 500); // debounce delay in ms

      return () => clearTimeout(delayDebounce); // cleanup on re-run
    }
  }, [searchQuery]);

  const onSearch = useCallback((val) => {
    setSearchQuery(val);
  }, []);

  const onChange = useCallback((val) => {
    setSearchQuery(val);
  }, []);

  return (
    <div className="h-[80vh]">
      <div className="">
        <Select
          key={woParam}
          disabled={true }
          showSearch
          placeholder="Find Work order..."
          optionFilterProp="label"
          //onSearch={onSearch}
          onChange={onChange}
          onSearch={onSearch}
          options={woList?.data?.map((wo) => {
            return {
              value: wo.value.m.m_WorkOrderNo,
              label: wo.value.m.m_WorkOrderNo
            }
          })}
          style={{ width: 250 }}
        />
        {/*
        {false &&
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
        }
        */}
      </div>
    </div>
  );
}
