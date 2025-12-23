"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import TableWithFilters from "app/components/TableWithFilters/TableWithFilters";
import NewRemakeForm from "app/features/remake/NewRemakeForm";
import { useQuery } from "react-query";

import { Select, Button, Modal } from "antd";

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
    setSelectedWONumber(val);
  }, []);

  const columns = [
    {
      title: `Item`,
      dataIndex: "Item",
      key: "Item",
      width: 120
    },
    {
      title: `SubQty`,
      dataIndex: "SubQty",
      key: "SubQty",
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
    //{
    //  title: `Product`,
    //  dataIndex: "product",
    //  key: "product",
    //  width: 150,
    //},
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
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

  const selectedRows = woItems?.filter(row => selectedSet.has(row.Id));

  console.log("selectedRows ", selectedRows);

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
          options={woSelectList?.map((wo) => {
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
        rowKey="Id"
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
        width={1500}
        centered
      >
        <NewRemakeForm selectedRows={selectedRows} />
      </Modal>
    </div>
  );
}
