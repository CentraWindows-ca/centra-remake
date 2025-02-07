"use client";
import styles from "../serviceWorkorder.module.css";
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import SelectItem from "app/components/atoms/workorderComponents/selectItem";
import InputItem from "app/components/atoms/workorderComponents/inputItem";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";
import DateItem from "app/components/atoms/workorderComponents/dateItem";
import TextField from "app/components/atoms/formFields/textField";

export default function ServiceCustomerInfo(props) {
  const { inputData, handleInputChange, serviceChangeItems } = props;

  return (
    <Group
      title={"Customer Information"}
      style={{ minWidth: "21rem" }}
      contentStyle={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
      }}
      className={styles.groupSchedule}
    >
      <TextField
        id="firstName"
        label="First Name"
        fieldName="firstName"
        required
      />
      <TextField
        id="lastName"
        label="Last Name"
        fieldName="lastName"
        required
      />
      <TextField
        id="streetAddress"
        label="Street Address"
        fieldName="streetAddress"
        required
      />
      <TextField id="city" label="City" fieldName="city" required />
      <TextField
        id="postalCode"
        label="Postal Code"
        fieldName="postalCode"
        required
      />
      <TextField id="email" label="Email Address" fieldName="email" required />
      <TextField
        id="homePhone"
        label="Home Phone"
        fieldName="homePhone"
        required
      />

      <TextField
        id="cellPhone"
        label="Cell Phone"
        fieldName="cellPhone"
        required
      />
    </Group>
  );
}
