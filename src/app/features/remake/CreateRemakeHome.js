"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import TableWithFilters from "app/components/TableWithFilters/TableWithFilters";
import NewRemakeForm from "app/features/remake/NewRemakeForm";
import { useQuery } from "react-query";

import { Select, Button, Modal } from "antd";

import { camelize } from "app/utils/utils";

import {
  fetchProductionWindowsByWOFilter,
  fetchProductionWindowByWO,
  fetchWindowItems
} from "app/api/productionApis";

import {
  fetchProductionWindowAvailableForRemake
} from "app/api/remakeApis";

export default function CreateRemakeHome(props) {
  //const [sss, setSSS] = useState(null);
  //const [received, setReceived] = useState(null);
  const searchParams = useSearchParams();
  const woParam = searchParams.get("workorder-no");

  const [searchQuery, setSearchQuery] = useState(woParam);
  const [woSelectList, setWOSelectList] = useState([]);
  const [selectedWONumber, setSelectedWONumber] = useState(null);
  const [wo, setWO] = useState('');
  const [woItems, setWOItems] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showNewRemakeForm, setShowNewRemakeForm] = useState(false);
  
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
      if (result?.list?.length > 0) {
        setWOSelectList(result.list);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedWONumber?.length > 1) {
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
          setWOItems(camelize(result?.data))
        }
      };

      fetchData();
    }
  }, [wo]);

  const onSearch = useCallback((val) => {
    setSearchQuery(val);
  }, []);

  const onChange = useCallback((val) => {
    setSelectedWONumber(val);
  }, []);

  const columns = [
    {
      title: `Item`,
      dataIndex: "item",
      key: "item",
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
      dataIndex: "system",
      key: "system",
      width: 120,
    },
    {
      title: `Size`,
      dataIndex: "size",
      key: "size",
      width: 200,
    },
    {
      title: `Description`,
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    //{
    //  title: `Product`,
    //  dataIndex: "product",
    //  key: "product",
    //  width: 150,
    //},
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({      
      disabled: record.key === "filter-row",
    }),
  };

  const selectedSet = new Set(selectedRowKeys);

  const selectedRows = woItems?.filter(row => selectedSet.has(row.id));

  console.log("selectedRows ", selectedRows);
  console.log("woSelectList ", woSelectList);

  return (
    <div className="max-h-[80vh]">
      <div className="mb-3 flex flex-row justify-between">
        <Select
          size="small"
          key={woParam}
          showSearch
          placeholder="Find Work order..."
          optionFilterProp="label"
          //onSearch={onSearch}
          onChange={onChange}
          onSearch={onSearch}
          options={woSelectList?.sort((a, b) => a.m_WorkOrderNo > b.m_WorkOrderNo ? 1 : -1).map((wo) => {
            return {
              value: wo.m_WorkOrderNo,
              label: wo.m_WorkOrderNo
            }
          })}
          style={{ width: 250 }}
          value={selectedWONumber}
        />
        <Button
          size="small"
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={()=>setShowNewRemakeForm(true)}
        >
          Remake
        </Button>
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
        rowKey="id"
        columns={columns}
        data={woItems ?? []}
        pagination={false}
        rowSelection={rowSelection}
        scrollY={"calc(100vh - 280px)"}
        //loading={isLoading}
        //onChange={onTableChange}
      />
      <Modal
        open={showNewRemakeForm}
        onCancel={() => setShowNewRemakeForm(false)}
        onOk={() => console.log("xxx")}
        width={1500}
        centered
        okText={"Submit"}
      >
        <NewRemakeForm selectedRows={selectedRows} />
      </Modal>
    </div>
  );
}
