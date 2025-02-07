"use client";
import styles from "../serviceWorkorder.module.css";
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import UserSelectField from "app/components/organisms/users/userSelect";
import TextField from "app/components/atoms/formFields/textField";
import SelectField from "app/components/atoms/formFields/selectField";
import AmountField from "app/components/atoms/formFields/amountField";
import DateSelectField from "app/components/atoms/formFields/dateSelectField";
import DateInputField from "app/components/atoms/formFields/dateInputField";

export default function ServiceInfo(props) {
  const {
    WorkOrderSelectOptions,
    inputData,
    isNew = false,
    setFieldsValue,
  } = props;

  return (
    <Group
      title={"Order Information"}
      style={{ minWidth: "18rem" }}
      contentStyle={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
      }}
      className={styles.groupInfo}
    >
      <TextField
        id="originalWorkOrderNo"
        label="Original WO #"
        fieldName="originalWorkOrderNo"
      />

      <DateInputField
        id="originalWorkOrderDate"
        label="Original WO Date"
        fieldName="originalWorkOrderDate"
        onChange={setFieldsValue}
        value={inputData?.originalWorkOrderDate}
        typeValue={inputData?.originalWorkOrderDateType}
      />

      <SelectField
        id="branch"
        label="Branch"
        fieldName="branch"
        required
        options={WorkOrderSelectOptions.serviceBranches}
      />

      <SelectField
        id="typeOfWork"
        label="Type of Work"
        fieldName="typeOfWork"
        required
        options={WorkOrderSelectOptions.serviceType}
      />

      <SelectField
        id="serviceReason"
        label="Service Reason"
        fieldName="serviceReason"
        required
        options={WorkOrderSelectOptions.serviceReason}
      />

      <SelectField
        id="createdBy"
        label="Requested Thru"
        fieldName="createdBy"
        required
        options={WorkOrderSelectOptions.serviceRequestedBy}
      />

      <SelectField
        id="submittedBy"
        label="Submitted By"
        fieldName="submittedBy"
        required
        options={WorkOrderSelectOptions.serviceSubmittedBy}
      />

      <DateSelectField
        id="serviceRequestDate"
        label="Request Date"
        fieldName="serviceRequestDate"
      />
      <SelectField
        id="residentialType"
        label="Residential Type"
        fieldName="residentialType"
        options={WorkOrderSelectOptions.residentialTypes}
      />

      <SelectField
        id="highRisk"
        label="High Risk"
        fieldName="highRisk"
        options={WorkOrderSelectOptions.serviceHighRisk}
      />

      {!isNew ? (
        <DateSelectField
          id="createdAt"
          label="Submitted Date"
          fieldName="createdAt"
          disabled
        />
      ) : null}

      <TextField
        id="siteName"
        label="Site Name"
        fieldName="siteName"
        //required={true}
      />
      <TextField
        id="siteContact"
        label="Site Contact"
        fieldName="siteContact"
        //required={true}
      />

      <UserSelectField
        id="assignedAdmin"
        label="Assigned Admin"
        fieldName="assignedAdmin"
        size="small"
        onChange={setFieldsValue}
      />

      <SelectField
        id="remainingBalanceOwing"
        label="Remaining Balance Owing"
        fieldName="remainingBalanceOwing"
        options={WorkOrderSelectOptions.serviceRemainingBalanceOwing}
      />

      <AmountField
        id="amountOwing"
        fieldName="amountOwing"
        label="Amount Owing"
      />

      <AmountField
        id="salesPrice"
        fieldName="salesPrice"
        label="Total Sales Amount"
      />
    </Group>
  );
}
