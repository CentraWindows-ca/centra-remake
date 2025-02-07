"use client";
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import CheckboxItem from "app/components/atoms/workorderComponents/checkboxItem";
import Tooltip from "app/components/atoms/tooltip/tooltip";

import { DatePicker } from "antd";
import dayjs from 'dayjs';

import {
  HomeDepotIcon,
  FinancingIcon,
  WoodDropOffIcon,
  AsbestosIcon,
  LeadPaintIcon,
  HighRiskIcon,
  AbatementIcon
} from "app/utils/icons";

export default function Parameters(props) {
  const {
    inputData,
    style,
    hndleInputChange,
    className
  } = props;

  return (
    <Group
      title={"Parameters"}
      contentStyle={{
        padding: "0.5rem",
      }}
      className={className}
      style={{ ...style }}
    >
      <CheckboxItem
        label={"Asbestos"}
        value={inputData?.totalAsbestos > 0}
        name={"totalAsbestos"}
        onChange={() => { }}
        changeItems={[]}
      >
        <AsbestosIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>
      <CheckboxItem
        label={"Lead Paint"}
        value={inputData?.leadPaint === "Yes"}
        name={"leadPaint"}
        onChange={() => { }}
        changeItems={[]}
      >
        <LeadPaintIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Abatement"}
        value={inputData?.abatement === "Yes"}
        name={"abatement"}
        onChange={() => { }}
        changeItems={[]}
      >
        <AbatementIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Wood Dropoff"}
        value={inputData?.totalWoodDropOff > 0}
        name={"totalWoodDropOff"}
        onChange={() => { }}
        changeItems={[]}
      >
        <WoodDropOffIcon
          style={{ marginLeft: "-3px", width: "20px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"High Risk"}
        value={inputData?.totalHighRisk > 0}
        name={"totalHighRisk"}
        onChange={() => { }}
        changeItems={[]}
      >
        <HighRiskIcon
          style={{ marginLeft: "-2px", width: "18px" }}
        />
      </CheckboxItem>

      <CheckboxItem
        label={"Home Depot Job"}
        value={inputData?.homeDepotJob === "Yes"}
        name={"homeDepotJob"}
        onChange={() => { }}
        changeItems={[]}
      >
        <HomeDepotIcon
          style={{ marginLeft: "-2px", width: "18px" }}
        />
      </CheckboxItem>

      <div>
        <CheckboxItem
          label={"Financing"}
          value={inputData?.financing === "Yes"}
          name={"financing"}
          onChange={() => { }}
          changeItems={[]}
        >
          <FinancingIcon
            style={{ marginLeft: "-3px", width: "20px" }}
          />
        </CheckboxItem>
        {inputData?.financing === "Yes" &&
          <div className="pl-16">
            <Tooltip title="Financing Start Date">
              <DatePicker
                value={dayjs(inputData?.financeStartDate)}
                placeholder={"Financing Start"}
              />
            </Tooltip>
          </div>
        }
      </div>



    </Group>
  )
}