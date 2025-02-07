"use client";
import styles from "../serviceWorkorder.module.css";
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import UserSelectField from "app/components/organisms/users/userSelect";
import DateTimeSelectField from "app/components/atoms/formFields/dateTimeSelectField";

export default function ServiceSchedule(props) {
  const {
    assignedTechnicians,
    disabled = false,
    setFieldsValue = null,
  } = props;

  const onSelectTechnicians = (fieldName, val, append = false) => {
    if (setFieldsValue) {
      setFieldsValue(fieldName, val, append);
    }
  };

  return (
    <Group
      title={"Schedule"}
      style={{ minWidth: "25rem" }}
      contentStyle={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
      }}
      className={styles.groupSchedule}
    >
      <UserSelectField
        id="assignedTechnicians"
        label="Assigned Technician(s)"
        fieldName="assignedTechnicians"
        value={assignedTechnicians}
        size="middle"
        isMultiSelect
        showAssignToMe
        disabled={disabled}
        onChange={onSelectTechnicians}
        required={!disabled}
      />

      <DateTimeSelectField
        id="scheduleDate"
        label="Scheduled Start"
        fieldName="scheduleDate"
        disabled={disabled}
        required={!disabled}
      />

      <DateTimeSelectField
        id="scheduleEndDate"
        label="Scheduled End"
        fieldName="scheduleEndDate"
        disabled={disabled}
        required={!disabled}
      />
    </Group>
  );
}
