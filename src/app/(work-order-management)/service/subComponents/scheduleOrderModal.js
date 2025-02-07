"use client";
import React from "react";

import moment from "moment";
import UserSelectField from "app/components/organisms/users/userSelect";
import DateTimeSelectField from "app/components/atoms/formFields/dateTimeSelectField";
import { Form, Popconfirm } from "antd";
import PopConfirmationModal from "app/components/atoms/popConfirmationModal.js/popConfirmationModal";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";

export default function ScheduleOrderModal(props) {
  const { showAssignModal, onConfirm, onCancel, id = "" } = props;
  const [form] = Form.useForm();

  const handleUserSelect = (fieldName, val) => {
    console.log(val);
  };

  const handleOkClick = (e) => {
    if (e) {
      form
        .validateFields()
        .then((values) => {
          //setShowSaveConfirmation(true);
          onConfirm(values);
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    }
    // onConfirm();
  };

  const handleCancelClick = (e) => {
    if (e) {
      form.resetFields();

      onCancel();
    }
  };

  return (
    <ConfirmationModal
      title={`Schedule Service Order # ${id}`}
      open={showAssignModal}
      onOk={handleOkClick}
      onCancel={handleCancelClick}
      cancelLabel="Cancel"
      okLabel="Ok"
      showIcon={true}
      popConfirmMessage="Are you sure you want to schedule this service?"
    >
      <div
        style={{
          width: "550px",
          maxHeight: "500px",
          overflow: "auto",
          paddingTop: "20px",
        }}
      >
        <Form form={form} name="ScheduleServiceForm" colon={false}>
          <UserSelectField
            id="assignedTechnicians"
            label="Assigned Technician(s)"
            fieldName="assignedTechniciansSS"
            size="medium"
            isMultiSelect
            onChange={handleUserSelect}
            required
          />

          <DateTimeSelectField
            id="scheduleDate"
            label="Scheduled Start"
            fieldName="scheduleDateSS"
            required
          />

          <DateTimeSelectField
            id="scheduleEndDate"
            label="Scheduled End"
            fieldName="scheduleEndDateSS"
            required
          />
        </Form>
      </div>
    </ConfirmationModal>
  );
}
