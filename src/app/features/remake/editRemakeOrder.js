"use client";
import React, { useState, useEffect, useCallback } from "react";

import {
  fetchRemakeWorkOrderById,
  updateRemakeWorkOrder,
} from "app/api/remakeApis";
import { useQuery } from "react-query";

import { Button, Popconfirm, Form, Space } from "antd";

import { RemakeRowStates } from "app/utils/constants";

import LockButton from "app/components/lockButton/lockButton";
import { mapRemakeRowStateToKey, YMDDateFormat } from "app/utils/utils";

import OrderStatus from "app/components/remake/orderStatus";
import RemakeItem from "app/features/remake/RemakeItem";

export default function EditRemakeOrder(props) {
  const {
    orderId,
    onClose,
    onShareLinkClick,
    form,
    onFinish,
    onFinishFailed,
    setIsEditFormModified
  } = props;

  const moduleName = "remake";
  const [inputData, setInputData] = useState([]);
  const [remakeChangeItems, setRemakeChangeItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // api calls
  const fetchOrderDetailsAsync = async () => {
    if (orderId) {
      const result = await fetchRemakeWorkOrderById(orderId, false);
      return result.data;
    } else {
      return null;
    }
  };

  // useQuery call to fetch remake details
  const {
    isLoading: isLoadingDetails,
    data: remakeOrderData,
    refetch: refetchOrder,
    isFetching: isFetchingDetails,
  } = useQuery([`${moduleName}OrderDetails`, orderId], fetchOrderDetailsAsync, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (remakeOrderData) setInputData(remakeOrderData);
  }, [remakeOrderData]);
 
  const handleSave = useCallback(async () => {
    if (remakeOrderData) {
      setIsSaving(true);
      let data = [];

      let remakeUpdates = JSON.parse(JSON.stringify(remakeOrderData));

      if (remakeChangeItems.length > 0) {
        remakeChangeItems.map((ci) => {
          var newVal = {};
          newVal = ci.value;
          remakeUpdates[ci.key] = newVal;
        });
      }

      data.push(remakeUpdates);
      await updateRemakeWorkOrder(data);
      refetchOrder();
      setRemakeChangeItems([]);
      setIsSaving(false);
    }
  }, [remakeOrderData, remakeChangeItems, refetchOrder]);

  useEffect(() => {
    form.setFieldsValue(remakeOrderData)
  }, [remakeOrderData])
  
  return (
    <Form      
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}      
    >
      <div className="flex flex-row">
        <div className="bg-[#E2E8F0] text-[#1868B1] pl-2 pt-[1px] pr-2 rounded-sm w-[7.9rem]">
          <i className="fa-solid fa-rotate-left pr-1" />
          {`Remake# ${inputData?.remakeId}`}
        </div>
        <div className="ml-2">
          <OrderStatus
            statusKey={mapRemakeRowStateToKey(inputData?.workOrderNo) ?? "newOrder"}
            statusList={RemakeRowStates}
            //updateStatusCallback={updateStatus}          
            updateStatusCallback={() => { }}
            orderId={inputData?.remakeId}
            handleStatusCancelCallback={() => { }}
            style={{ width: "100%" }}
            className="rounded-sm m-0"
          />
        </div>
      </div>

      {false &&
        <div className="flex justify-between mb-3">
          <Button onClick={() => onShareLinkClick(orderId)}>
            <i className="fas fa-link"></i>
            <span className="pl-2">Copy Link</span>
          </Button>
          <Popconfirm
            placement="left"
            title={"Save Confirmation"}
            description={
              <div className="pb-2">
                <div>{`Do you wish to proceed?`}</div>
              </div>
            }
            onConfirm={handleSave}
            okText="Yes"
            cancelText="No"
          >
            <LockButton
              tooltip={"Save Changes"}
              disabled={remakeChangeItems.length === 0}
              label={"Save"}
            />
          </Popconfirm>
        </div>
      }

      <div className="border-t border-b mt-4 mb-[0.7rem]">
        <div className="flex flex-row justify-between bg-[#F5F5F5] mt-[2px] mb-[2px] pl-2 pr-2">
          <Space>
            <div title="Parent Work Order" className="font-semibold text-blue-500 hover:underline hover:cursor-pointer">{inputData?.workOrderNo?.toUpperCase()}</div>
            <div title="Reported By" className="border-l"><i className="fa-solid fa-user pr-1 pl-2 text-indigo-500" />{inputData?.createdBy}</div>
          </Space>
          <div title="Date Created"><i className="fa-solid fa-calendar-day text-blue-500 pr-2" />{YMDDateFormat(inputData?.createdAt)}</div>
        </div>
      </div>

      <RemakeItem
        orderId={orderId}
        form={form}
        setIsModified={setIsEditFormModified}
      />   
    </Form>
  );
}
