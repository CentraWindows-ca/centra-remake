"use client";
import styles from '../installationWorkorder.module.css';
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";
import RadioItem from 'app/components/atoms/workorderComponents/radioItem';

import { YMDDateFormat } from "app/utils/utils";

import moment from "moment";

export default function Overview(props) {
  const {
    inputData,
    className,
    radioChange
  } = props;

  const startDate = moment(inputData?.scheduledDate);
  const endDate = moment(inputData?.endTime);

  const installationInDays = endDate.hour(23).minute(0).second(0).diff(startDate, "days") + 1; // Make start and end dates inclusive

  return (
    <Group
      title={"Installation Overview"}
      contentStyle={{
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateColumns: "2fr 3fr",
        rowGap: "0.3rem"
      }}
      className={`${className} ${styles.groupInfo}`}
    >
      <LabelItem
        label={"Sales Rep"}
        value={inputData.salesRep}
        style={{ paddingLeft: "8px" }}
        leftAlign={true}
      />

      <LabelItem
        label={"Home Built In"}
        value={inputData.ageOfHome || "-"}
        style={{ paddingLeft: "8px" }}
        leftAlign={true}
      />            

      <LabelItem
        label={"Production Date"}
        //value={"YYYY-MM-DD"} // TODO: Call production items api        
        value=""
        style={{ paddingLeft: "8px" }}
        leftAlign={true}
        labelWidth={"10rem"}
      />

      <LabelItem
        label={"Shipping Date"}
        value={YMDDateFormat(inputData.scheduledDate)}
        style={{ paddingLeft: "8px" }}
        leftAlign={true}
        labelWidth={"10rem"}
      />

      {false &&
        <LabelItem
          label={"Installation Duration"}
          value={installationInDays}
          style={{ paddingLeft: "8px" }}
          leftAlign={true}
          labelWidth={"10rem"}
        />
      }

      <RadioItem
        label={"Difficulty"}
        name={"diifficulty"}
        //changeItems={orderChangeItems}
        valueClassName={"pl-[8px] pt-[3px] pb-[3px]"}
        value={inputData?.jobDifficulty?.toLowerCase()}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
          { label: 'D', value: 'd' }
        ]}
        onChange={radioChange}
      />
    </Group>
  )
}