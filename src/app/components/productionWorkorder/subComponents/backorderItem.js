"use client";
import React from "react";
import { useSelector } from "react-redux";

import {
  Input,
  Select,
  DatePicker
} from 'antd';

import dayjs from 'dayjs';

const { TextArea } = Input;

import LabelItem from "../subComponents/labelItem";

import { YMDDateFormat } from "app/utils/utils";

export default function BackorderItem(props) {

  const {
    data,
    index,
    inputData,
    setInputData,
    isSingle
  } = props;

  const { isMobile } = useSelector((state) => state.app);

  const handleDateChange = (date) => {
    if (date) {
      setInputData(x => {
        let _x = { ...x };
        _x.items[index]["estimatedShippingDate"] = date;
        return _x;
      });
    }
  }

  const handleInputChange = (property, e) => {
    if (property) {
      setInputData(x => {
        let _x = { ...x };
        _x.items[index][property] = e.target.value;
        return _x;
      });
    }
  }

  return (
    <div>
      <div className="flex pt-3 pb-2" style={{ borderTop: index > 0 ? "1px dotted lightgrey" : "none" }}>
        <div className="flex-1">
          <div className="flex flex-row flex-start">
            <div className={`flex ${isSingle ? "flex-col" : "flex-row"}`}>
              <div className={`flex ${isMobile ? "flex-col" : "flex-row"}`}>
                <div className="pr-4 flex flex-col justify-around pb-2" style={{ height: isMobile ? "7rem" : "100%" }}>
                  <LabelItem
                    label={"Item No."}
                    value={data?.item}
                    emphasizeValue={true}
                    labelWidth={"11rem"}
                  />
                  <LabelItem
                    label={"Sub Quantity"}
                    value={data.subQty}
                    labelWidth={"11rem"}
                  />
                  <LabelItem
                    label={"Original Shipping Date"}
                    value={YMDDateFormat(data.shippingDate)}
                    labelWidth={"11rem"}
                  />
                </div>
                <div className="flex flex-row justify-start">
                  <div className={`${isMobile ? "" : "pl-6"}`}>
                    <div className="pb-2 flex flex-row items-center">
                      <div style={{ width: 170 }}>Requested By</div>
                      <Input
                        style={{ width: 180 }}
                        onChange={(val) => handleInputChange("requestedBy", val)}
                        value={inputData?.items[index]?.requestedBy}
                      />
                    </div>

                    <div className="pb-2 flex flex-row items-center">
                      <div style={{ width: 170 }}>Estimated shipping date</div>
                      <DatePicker
                        style={{ width: 180 }}
                        onChange={handleDateChange}
                        value={dayjs(inputData?.items[index]?.estimatedShippingDate)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {inputData?.items[index]?.departmentResponsible && remakeDepartmentResponsibleSectionOptions &&
                    <div className="pb-2">
                      <Select
                        style={{ width: 210 }}
                        onChange={(key, value) => handleSelectChange("departmentResponsibleSection", { key: key, value: value?.label })}
                        size={"middle"}
                        options={[{ label: "Department Responsible Section", options: remakeDepartmentResponsibleSectionOptions }]}
                        value={inputData?.items[index]?.departmentResponsibleSection?.value}
                        placeholder={"Department Responsible Section"}
                      />
                    </div>
                  }

                </div>
              </div>
              <div className={`${isSingle ? "pt-2" : "pl-4"}`}>
                <TextArea rows={2}
                  placeholder="Notes *"
                  style={{ width: "100%", minWidth: isSingle ? "15rem" : "20rem", minHeight: 80, textAlign: "left" }}
                  onChange={(val) => handleInputChange("notes", val)}
                  value={inputData?.items[index]?.notes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}