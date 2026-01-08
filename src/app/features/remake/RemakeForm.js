"use client";
import React, { useEffect, useCallback, useState } from "react";
import RemakeItem from "app/features/remake/RemakeItem";

import {
  createRemake
} from "app/api/remakeApis";

import { Form, Button, Alert } from "antd";

export default function RemakeForm(props) {
  const { selectedRows, originalWO, setShowNewRemakeForm } = props;
  const [ hasError, setHasError ] = useState(false);

  const [newRemakeForm] = Form.useForm();
  // TODO: Extract form outside

  console.log("selectedRows ", selectedRows)

  //useEffect(() => {
  //  newRemakeForm.setFieldsValue({
  //    items: selectedRows.map(r => ({
  //      //installationId: r.installationId,
  //      qty: r.quantity,
  //      //reason: null
  //      subQty: r.subQty,
  //      system: r.system,
  //      size: r.size,
  //      item: r.item
  //    }))
  //  });
  //}, [selectedRows]);

  const populateForm = useCallback((data) => {
    if (data?.length > 0) {
      const masterInfo = { ...originalWO?.value?.m }

      newRemakeForm.setFieldsValue({
        items: data.map(r => ({
          //installationId: r.installationId,
          quantity: r.quantity,
          //reason: null
          subQty: r.subQty,
          system: r.system,
          size: r.size,
          item: r.item,
          moduleSource: "Remake Portal",
          branchName: masterInfo.m_Branch,
          customerName: masterInfo.m_CustomerName,
          jobType: masterInfo.m_JobType,
          windowProduct: "string",
          doorProduct: "string",
          reasonDetail: "string",
          requestedBy: "string",
          assignedTo: "string",
          originalWorkOrderNo: masterInfo.m_WorkOrderNo,
          requestedBy: "requestedBy",
          description: r.description
          // TODO: Checked who's logged-in
        }))
      });
    }
  }, [originalWO]);

  useEffect(() => {
    populateForm(selectedRows);
  }, [selectedRows]);

  const handleOnSubmit = async (values) => {
    console.log("values: ", values);
    console.log("date ", values.items[0].scheduleDate?.format("YYYY-MM-DD"));
    console.log("originalWO ", originalWO);

    const payload = {
      ...values?.items?.[0],
      scheduleDate: values.items[0].scheduleDate?.format("YYYY-MM-DD"),
      windowProduct: values.items[0].product // TODO: This is only temporary
    };

    console.log("payload ", payload)

    // Currently only tracking item 1

    const res = await createRemake(payload);
    
    if (res?.success) {
      setShowNewRemakeForm(false);
    }    
  }

  const handleFailed = (err) => {
    console.log("Error: ", err)
    setHasError(true);
  }

  return (
    <Form
      form={newRemakeForm}
      onFinish={handleOnSubmit}
      onFinishFailed={handleFailed}
    >

      <div className="mb-2">
        {false && <i className="fa-solid fa-circle-plus text-gray-400"></i>}
        <span className="text-blue-700 font-semibold">{`Create Remake`}</span>
        {hasError &&
          <Alert
            message="One or more required fields are empty. Please review the highlighted fields."
            type="error"
            size="small"
            className="p-1 mt-2"
          />
        }
        {false && <span className="font-semibold text-blue-500 text-base">{`${selectedRows?.[0].workOrderNo}`}</span>}
      </div>
      <div className="max-h-[75vh] overflow-y-auto">
        <Form.List name="items">
          {(fields) => (
            <>
              {fields?.map((field, index) =>
                <div className="pt-2" key={`${field.key}-${index}`}>
                  <RemakeItem
                    key={field.key}
                    field={field}
                    index={index}
                    form={newRemakeForm}
                    remakeItem={selectedRows[index]}
                  />
                </div>
              )}
            </>
          )}
        </Form.List>
      </div>
      <div className="text-right pt-3">
        <Button
          size="small"
          onClick={() => newRemakeForm.submit()}
          type="primary"
        >
          Submit
        </Button>
      </div>
    </Form>
  )
}