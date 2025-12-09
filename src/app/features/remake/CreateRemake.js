"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import TableWithFilters from "app/components/TableWithFilters/TableWithFilters";
import { useQuery } from "react-query";

import { Select } from "antd";

import {
  fetchProductionWindowsByWOFilter,
  fetchProductionWindowByWO,
  fetchWindowItems
} from "app/api/productionApis";

import {
  fetchProductionWindowAvailableForRemake
} from "app/api/remakeApis";

export default function CreateRemake(props) {
  //const [sss, setSSS] = useState(null);
  //const [received, setReceived] = useState(null);
  const searchParams = useSearchParams();
  const woParam = searchParams.get("workorder-no");

  const [searchQuery, setSearchQuery] = useState(woParam);
  const [woSelectList, setWOSelectList] = useState([]);
  const [selectedWONumber, setSelectedWONumber] = useState(null);
  const [wo, setWO] = useState('');
  const [woItems, setWOItems] = useState(null);
    
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
    const fetchData = async () => {
      const result = await fetchProductionWindowAvailableForRemake();
      if (result) {
        setWOSelectList(result);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("aaa1", selectedWONumber)
    if (selectedWONumber?.length > 1) {
      console.log("aaa2", selectedWONumber)
      const fetchData = async () => {
        const result = await fetchProductionWindowByWO(selectedWONumber);
        if (result) {
          setWO(result?.data?.[0]);
        }
      };

      fetchData();           
    }
  }, [selectedWONumber]);

  useEffect(() => {
    if (wo) {
      const fetchData = async () => {
        const result = await fetchWindowItems(wo?.value?.w?.w_Id);
        console.log("result1 ", result)
        if (result) {
          setWOItems(result?.data)
        }
      };

      fetchData();
    }
  }, [wo]);

  const onSearch = useCallback((val) => {
    setSearchQuery(val);
  }, []);

  const onChange = useCallback((val) => {
    console.log("val ", val)
    setSelectedWONumber(val);
  }, []);

  useEffect(() => {
    console.log("woItems ", woItems)
  }, [woItems])

  const columns = [
    {
      title: `Item`,
      dataIndex: "itemNo",
      key: "ItemNo",
      width: 120
    },
    {
      title: `SubQty`,
      dataIndex: "subQty",
      key: "subQty",
      width: 70
    },
    {
      title: `System`,
      dataIndex: "System",
      key: "System",
      width: 120,
    },
    {
      title: `Size`,
      dataIndex: "Size",
      key: "Size",
      width: 200,
    },
    {
      title: `Description`,
      dataIndex: "Description",
      key: "Description",
      ellipsis: true,
    },
    {
      title: `Product`,
      dataIndex: "product",
      key: "product",
      width: 150,
    },  
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      fixed: 'right',
      //render: (status, order, index) => {
      //  if (index === 0) {
      //    // Just show the raw status text (from data)
      //    return status;
      //  }
      //  return (
      //    <div className="text-center">
      //      <OrderStatus
      //        statusKey={mapRemakeRowStateToKey(status)}
      //        statusList={RemakeRowStates}
      //        updateStatusCallback={updateStatus}
      //        orderId={order?.id}
      //        handleStatusCancelCallback={() => { }}
      //        style={{ width: "100%" }}
      //      />
      //    </div>
      //  );
      //},
    },
  ];

  console.log("columns ", columns)
  console.log("woItems ", woItems)
  console.log("woSelectList ", woSelectList)

  return (
    <div className="h-[80vh]">
      <div className="">
        <Select
          key={woParam}
          showSearch
          placeholder="Find Work order..."
          optionFilterProp="label"
          //onSearch={onSearch}
          onChange={onChange}
          onSearch={onSearch}
          options={woSelectList?.data?.map((wo) => {
            return {
              value: wo.value.m.m_WorkOrderNo,
              label: wo.value.m.m_WorkOrderNo
            }
          })}
          style={{ width: 250 }}
          value={selectedWONumber}
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
      <TableWithFilters
        columns={columns}
        data={woItems ?? []}
        pagination={false}
        //loading={isLoading}
        //onChange={onTableChange}
      />
    </div>
  );
}
