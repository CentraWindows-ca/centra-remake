"use client";
import React, { useEffect } from "react";
import RemakeItem from "app/features/remake/RemakeItem";

import { Form, Button } from "antd";

export default function NewRemakeForm(props) {
  const { selectedRows } = props;

  const [newRemakeForm] = Form.useForm();
  // TODO: Extract form outside

  useEffect(() => {
    newRemakeForm.setFieldsValue({
      items: selectedRows.map(r => ({
        installationId: r.installationId,
        qty: r.qty,
        reason: null
      }))
    });
  }, [selectedRows]);

  const handleOnSubmit = (values) => {
    console.log("values: ", values);
    console.log("date ", values.items[0].scheduleDate?.format("YYYY-MM-DD"));
  }

  return (
    <Form
      form={newRemakeForm}
      onFinish={handleOnSubmit}
    >
      <div className="mb-2 font-semibold text-blue-600">{`New Remake`}</div>
      <div className="mb-2">{`Original WO#: ${selectedRows?.[0].workOrderNo}`}</div>
      <div className="max-h-[75vh] overflow-y-auto">
        <Form.List name="items">
          {(fields) => (
            <>
              {fields?.map((field, index) =>
                <div className="pt-2">
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