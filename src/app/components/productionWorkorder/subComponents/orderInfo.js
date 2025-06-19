"use client";
import styles from '../productionWorkorder.module.css';
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import SelectItem from "app/components/atoms/workorderComponents/selectItem";
import InputItem from "app/components/atoms/workorderComponents/inputItem";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";

export default function OrderInfo(props) {
  const {
    WorkOrderSelectOptions,
    inputData,
    handleInputChange,
    handleSelectChange,
    orderChangeItems,
    isSearchView
  } = props;

  // const jobType = WorkOrderSelectOptions.jobTypes.find(x => x.key === inputData?.residentialTypes?.toLowerCase());

  return (
    <Group
      title={"Order Information"}
      contentStyle={{
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateColumns: "2fr 3fr",
        rowGap: "0.3rem"
      }}
      className={styles.groupInfo}
    >
      <SelectItem
        label={"Branch"}
        name={"branch"}
        selected={WorkOrderSelectOptions.branches.find(x => (x.label === inputData?.branch || x.value === inputData?.branch))}
        options={WorkOrderSelectOptions.branches}
        onChange={handleSelectChange}
        changeItems={orderChangeItems}
      />
      <InputItem
        label={"Block No."}
        name={"blockNo"}
        value={inputData?.blockNo || ""}
        id={"blockNo"}
        onChange={handleInputChange}
        changeItems={orderChangeItems}
      />
      <InputItem
        label={"Batch No."}
        name={"batchNo"}
        value={inputData?.batchNo || ""}
        id={"batchNo"}
        onChange={handleInputChange}
        changeItems={orderChangeItems}
      />
      <SelectItem
        label={"Shipping Type"}
        name={"shippingType"}
        selected={WorkOrderSelectOptions.shippingTypes.find(x => x.value === inputData?.shippingType)}
        options={WorkOrderSelectOptions.shippingTypes}
        onChange={handleSelectChange}
        changeItems={orderChangeItems}
      />
      <SelectItem
        label={"Glass Supplier"}
        name={"glassSupplier"}
        selected={WorkOrderSelectOptions.glassSuppliers.find(x => (x.label === inputData?.glassSupplier || x.value === inputData?.glassSupplier))}
        options={WorkOrderSelectOptions.glassSuppliers}
        onChange={handleSelectChange}
        changeItems={orderChangeItems}
      />
      <SelectItem
        label={"Glass Options"}
        name={"glassOptions"}
        selected={WorkOrderSelectOptions.glassOptions.find(x => x.label === inputData?.glassOptions)}
        options={WorkOrderSelectOptions.glassOptions}
        onChange={handleSelectChange}
        changeItems={orderChangeItems}
      />
      <SelectItem
        label={"Residential Type"}
        name={"residentialType"}
        selected={WorkOrderSelectOptions.residentialTypes.find(x => x.value === inputData?.residentialType)}
        options={WorkOrderSelectOptions.residentialTypes}
        onChange={handleSelectChange}
        changeItems={orderChangeItems}
      />
      <SelectItem
        label={"Job Type"}
        name={"jobType"}
        options={WorkOrderSelectOptions.jobTypes}
        onChange={handleSelectChange}
        selected={WorkOrderSelectOptions.jobTypes.find(x => x.value === inputData?.jobType)}
        changeItems={orderChangeItems}
      />
      <SelectItem
        label={"Customer Type"}
        name={"customerType"}
        options={WorkOrderSelectOptions.customerTypes}
        onChange={handleSelectChange}
        selected={WorkOrderSelectOptions.customerTypes.find(x => x.label === inputData?.customerType)}
        changeItems={orderChangeItems}
      />
      <LabelItem
        label={"City"}
        value={inputData.city}
        style={{ paddingLeft: "8px" }}
        leftAlign={true}
      />
    </Group>
  )
}