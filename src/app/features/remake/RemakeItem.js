"use client";
import React, { useCallback } from "react";
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
  //  form?.setFieldsValue(remakeItem)
  //}, [remakeItem, form]);

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
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Item No.:
              </label>
              <div className="flex-1">
                {remakeItem?.item}
                <Form.Item name={[field.name, "item"]} hidden initialValue={remakeItem?.item}>
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Sub Qty:
              </label>
              <div className="flex-1">
                {remakeItem?.subQty}
                <Form.Item name={[field.name, "subQty"]} hidden initialValue={remakeItem?.subQty}>
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Description:
              </label>
              <div className="flex-1">
                {remakeItem?.description}
                <Form.Item name={[field.name, "description"]} hidden initialValue={remakeItem?.description}>
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                System:
              </label>
              <div className="flex-1">
                {remakeItem?.system}
                <Form.Item name={[field.name, "system"]} hidden initialValue={remakeItem?.system}>
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Size:
              </label>
              <div className="flex-1">
                {remakeItem?.size}
                <Form.Item name={[field.name, "size"]} hidden initialValue={remakeItem?.size}>
                  <Input />
                </Form.Item>
                <Form.Item name={[field.name, "originalWorkOrderNo"]} hidden initialValue={remakeItem?.workOrderNo}>
                  <Input />
                </Form.Item>
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
                //value={inputData?.departmentResponsible}
                options={departmentResponsibleOptions}
                //onChange={(val) => handleSelectChange(val, "departmentResponsible")}
                style={{ width: '11rem' }}
                placeholder="Dept. Responsible"
              />
            </Form.Item>

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
                //value={inputData?.departmentResponsibleSection}
                options={remakeDepartmentResponsibleSectionOptions}
                //onChange={(val) => handleSelectChange(val, "departmentResponsibleSection")}
                style={{ width: '11rem' }}
                placeholder="Section Responsible"
              />
            </Form.Item>
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
                  //value={inputData?.reasonCategory}
                  //onChange={(val) => handleSelectChange(val, "reasonCategory")}
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
                  //value={inputData?.reason}
                  //onChange={(val) => handleSelectChange(val, "reason")}
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
                    //value={inputData?.reasonDetail}
                    //onChange={(val) => handleSelectChange(val, "reasonDetail")}
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
                //value={inputData?.notes}
                value={"test"}
                rows={2}
                //onChange={handleInputChange}
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
