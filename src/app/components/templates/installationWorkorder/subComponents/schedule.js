"use client";
import styles from '../installationWorkorder.module.css';
import React from "react";
import Group from "app/components/atoms/workorderComponents/group";
import DateStartEndItem from 'app/components/atoms/workorderComponents/dateStartEndItem';
import { YMDDateFormat } from 'app/utils/utils';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import moment from "moment";

const { RangePicker } = DatePicker;

export default function Schedule({ inputData, onChange, style }) {
  
  const startDate = moment(inputData?.scheduledDate);
  const endDate = moment(inputData?.endTime);

  const installationInDays = endDate.hour(23).minute(0).second(0).diff(startDate, "days") + 1; // Make start and end dates inclusive

  return (
    <Group
      title={`Schedule (${installationInDays} days)`}
      contentStyle={{
        padding: "0.5rem",
        rowGap: "0.3rem"
      }}
      className={styles.groupInfo}
      style={{ ...style }}
    >
      <div className="flex justify-center">
        <RangePicker
          value={[
            dayjs(YMDDateFormat(inputData?.scheduledDate), 'YYYY-MM-DD'),
            dayjs(YMDDateFormat(inputData?.endTime || inputData?.scheduledDate), 'YYYY-MM-DD')
          ]}
          onChange={onChange}
          style={{ width: "100%" }}
        />
      </div>
    </Group>
  )
}