"use client";
import React, { useEffect, useCallback } from "react";
//import dayjs from "dayjs";

//import {
//  fetchRemakeWorkOrderById,
//} from "app/api/remakeApis";

//import { useQuery } from "react-query";

import { Form, Select, DatePicker, Space, Input } from "antd";
const { TextArea } = Input;

import { ProductionRemakeOptions } from "app/utils/constants";

import Attachments from "app/features/remake/Attachments";

export default function RemakeItem({ orderId, remakeItem, field, isEdit = false }) {
  // TODO: There should only be 1 source of truth - inputData has to be removed

  // IF Edit, fetch then set values
  //// api calls
  //const fetchOrderDetailsAsync = async () => {
  //  if (orderId) {
  //    const result = await fetchRemakeWorkOrderById(orderId, false);
  //    return result.data;
  //  } else {
  //    return null;
  //  }
  //};

  //// useQuery call to fetch remake details
  //const {
  //  isLoading: isLoadingDetails,
  //  data: data,
  //  refetch: refetchOrder,
  //  isFetching: isFetchingDetails,
  //} = useQuery([`${moduleName}OrderDetails`, orderId], fetchOrderDetailsAsync, {
  //  refetchOnWindowFocus: false,
  //});

  const reasonCategory = Form.useWatch(["items", field.name, "reasonCategory"]);
  const reason = Form.useWatch(["items", field.name, "reason"]);
  const departmentResponsible = Form.useWatch(["items", field.name, "departmentResponsible"]);

  const remakeProductOptions = ProductionRemakeOptions.find(
    (x) => x.key === "product"
  )?.options?.map((group) => ({
    key: group.key,
    value: group.value,
    label: group.value,
  }));

  const remakeBranchOptions = ProductionRemakeOptions.find(
    (x) => x.key === "branch"
  )?.options;

  const departmentResponsibleOptions = ProductionRemakeOptions.find(
    (x) => x.key === "departmentResponsible"
  )?.options?.map((group) => ({
    key: group.key,
    value: group.value,
    label: group.value,
  }));

  const reasonCategoryOptions = ProductionRemakeOptions.find(
    (x) => x.key === "reasonCategory"
  )?.options?.map((group) => ({
    key: group.key,
    value: group.value,
    label: group.value,
  }));

  const remakeDepartmentResponsibleSectionOptions =
    ProductionRemakeOptions.find(x => x.key === "departmentResponsible")
      ?.options?.find(x => x.value === departmentResponsible)
      ?.options;

  const remakeReasonOptions =
    ProductionRemakeOptions.find(x => x.key === "reasonCategory")
      ?.options?.find(x => x.value === reasonCategory)
      ?.options?.map(o => ({ key: o.key, value: o.value, label: o.value }));


  const remakeReasonDetailOptions =
    ProductionRemakeOptions.find(x => x.key === "reasonCategory")
      ?.options?.find(x => x.value === reasonCategory)
      ?.options?.find(y => y.value === reason)
      ?.options?.map(o => ({ key: o.key, value: o.value, label: o.value }));
  
  //useEffect(() => {
  //  form.setFieldsValue(data)
  //}, [data, form]);

  //useEffect(() => {
  //  if (JSON.stringify(inputData) !== JSON.stringify(data)) {
  //    setIsModified(true);
  //  } else {
  //    setIsModified(false);
  //  }
  //}, [inputData, data, form, setIsModified])

  console.log("remakeItem", remakeItem);

  return (
    <div className="flex flex-row gap-2">
      <section className="w-1/5">
        <div className="border rounded-sm h-full">
          <div className="bg-neutral-200 pl-2 pt-1 pb-1 font-semibold">
            Item for Remake
          </div>
          <div className="p-2">
            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '100px', textAlign: 'left' }}>
                Original WO:
              </label>
              <div className="flex-1">
                {remakeItem?.workOrderNo}                
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '100px', textAlign: 'left' }}>
                Item:
              </label>
              <div className="flex-1">
                {remakeItem?.item}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '100px', textAlign: 'left' }}>
                Sub Qty:
              </label>
              <div className="flex-1">
                {remakeItem?.subQty}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '100px', textAlign: 'left' }}>
                Description:
              </label>
              <div className="flex-1">
                {remakeItem?.description}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '100px', textAlign: 'left' }}>
                System:
              </label>
              <div className="flex-1">
                {remakeItem?.system}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '100px', textAlign: 'left' }}>
                Size:
              </label>
              <div className="flex-1">
                {remakeItem?.size}
              </div>
            </div>
          </div>          
        </div>
      </section>

      <section className="border rounded-sm w-3/5">
        <div className="bg-[#ebeff3] pl-2 pt-1 pb-1 font-semibold">
          Remake Info
        </div>
        <div className="p-2">
          <div className="flex flex-row justify-between">
            <Form.Item
              labelCol={{ flex: '100px' }}
              labelAlign="left"
              label="Product"
              name={[field.name, "product"]}
              className="mb-0"
              rules={[{ required: true }]}
            >
              <Select
                size="small"
                options={remakeProductOptions}
                label="Product"
                name={[field.name, "product"]}
                style={{ width: '11rem' }}
                placeholder="Select Product"
                rules={[{ required: true }]}
              />
            </Form.Item>

            <Form.Item
              labelCol={{ flex: '120px' }}
              labelAlign="left"
              label="Scheduled Date"
              name={[field.name, "scheduleDate"]}
              className="mb-0"
            >              
              <DatePicker
                size="small"
                format="YYYY-MM-DD"
                style={{ width: '11rem' }}
              />              
            </Form.Item>
          </div>

          <div className="flex flex-row justify-between">
            <Form.Item
              labelCol={{ flex: '100px' }}
              className="mb-0"
              labelAlign="left"
              label="Department"
              name={[field.name, "departmentResponsible"]}
              rules={[{ required: true }]}
            >
              <Select
                size="small"
                options={departmentResponsibleOptions}
                style={{ width: '11rem' }}
                placeholder="Dept. Responsible"
              />
            </Form.Item>

            {remakeDepartmentResponsibleSectionOptions?.length > 0 && 
              <Form.Item
                labelCol={{ flex: '120px' }}
                name={[field.name, "departmentResponsibleSection"]}
                className="mb-0"
                labelAlign="left"
                label="Section"
              >
                <Select
                  disabled={!remakeDepartmentResponsibleSectionOptions?.length > 0}
                  size="small"
                  options={remakeDepartmentResponsibleSectionOptions}
                  style={{ width: '11rem' }}
                  placeholder="Section Responsible"
                />
              </Form.Item>
            }
          </div>

          <Space.Compact style={{ width: '100%', display: 'flex', marginTop: "0.5rem" }}>
            <div className="flex-[3] w-full">
              <Form.Item
                labelAlign="left"
                label="Reason"   
                name={[field.name, "reasonCategory"]}
                className="mb-0"
                labelCol={{ flex: '100px' }}
                rules={[{ required: true }]}
              >
                <Select
                  size="small"
                  options={reasonCategoryOptions}
                  placeholder="Category"
                />
              </Form.Item>
            </div>
            <div className="flex-[2]">
              <Form.Item
                labelAlign="left"
                label=""
                name={[field.name, "reason"]}
                className="mb-0"
              >
                <Select
                  size="small"
                  options={remakeReasonOptions}
                  placeholder="Subcategory"
                />
              </Form.Item>
            </div>
            {remakeReasonDetailOptions?.length > 0 &&
              <div className="flex-[2]">
                <Form.Item
                  labelAlign="left"
                  label=""
                  name={[field.name, "reasonDetail"]}
                  className="mb-0"
                >
                  <Select
                    size="small"
                    options={remakeReasonDetailOptions}
                    placeholder="Detail"
                  />
                </Form.Item>
              </div>
            }
          </Space.Compact>
          <div className="mt-[0.5rem]">
            <Form.Item
              labelAlign="left"
              label="Notes"
              name={[field.name, "notes"]}
              className="mb-0"
              labelCol={{ flex: '100px' }}
            >
              <TextArea
                name={"notes"}
                value={"test"}
                rows={2}
              />
            </Form.Item>
          </div>
        </div>
      </section>
     
      <section className="border rounded-sm w-1/5">
        <Attachments
          key={orderId}
          //orderId={inputData.id}
        />
      </section>                  
    </div>
  );
}
