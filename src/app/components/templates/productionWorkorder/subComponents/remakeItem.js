"use client";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { Input, Select, DatePicker } from "antd";

import dayjs from "dayjs";

import { ProductionRemakeOptions } from "app/utils/constants";
import LabelItem from "../subComponents/labelItem";
import ImageGallery from "app/components/organisms/imageGallery/imageGallery";

const { TextArea } = Input;

export default function RemakeItem(props) {
  const {
    data,
    index,
    inputData,
    setInputData,
    setShowPhotoUpload,
    setCurrentItemIndex,
    isSingle,
  } = props;

  const { isMobile } = useSelector((state) => state.app);

  const remakeProductOptions = ProductionRemakeOptions.find(
    (x) => x.key === "product"
  )?.options?.map((o) => {
    return { value: o.key, label: o.value };
  });
  const remakeBranchOptions = ProductionRemakeOptions.find(
    (x) => x.key === "branch"
  )?.options?.map((o) => {
    return { value: o.key, label: o.value };
  });
  const remakeDepartmentResponsibleOptions = ProductionRemakeOptions.find(
    (x) => x.key === "departmentResponsible"
  )?.options?.map((o) => {
    return { value: o.key, label: o.value };
  });
  const remakeReasonCategoryOptions = ProductionRemakeOptions.find(
    (x) => x.key === "reasonCategory"
  )?.options?.map((o) => {
    return { value: o.key, label: o.value };
  });

  const remakeDepartmentResponsibleSectionOptions =
    ProductionRemakeOptions.find((x) => x.key === "departmentResponsible")
      ?.options?.find(
        (x) => x.key === inputData?.items[index]?.departmentResponsible?.key
      )
      ?.options?.map((o) => {
        return { value: o.key, label: o.value };
      });

  const remakeReasonOptions = ProductionRemakeOptions?.find(
    (x) => x.key === "reasonCategory"
  )
    ?.options?.find(
      (x) => x.key === inputData?.items[index]?.reasonCategory?.key
    )
    ?.options?.map((o) => {
      return { value: o.key, label: o.value };
    });

  const remakeReasonDetailOptions = ProductionRemakeOptions?.find(
    (x) => x.key === "reasonCategory"
  )
    ?.options?.find(
      (x) => x.key === inputData?.items[index]?.reasonCategory?.key
    )
    ?.options?.find((x) => x.key === inputData?.items[index]?.reason?.key)
    ?.options?.map((o) => {
      return { value: o.key, label: o.value };
    });

  const handleSelectChange = useCallback(
    (property, item) => {
      if (index > -1 && property && item && inputData) {
        setInputData((x) => {
          let _x = { ...x };
          _x.items[index][property] = item;

          if (property === "reasonCategory") {
            _x.items[index].reason = "";
            _x.items[index].reasonDetail = null;
          }

          if (property === "reason") {
            _x.items[index].reasonDetail = null;
          }

          if (property === "departmentResponsible") {
            _x.items[index].departmentResponsibleSection = null;
          }

          return _x;
        });
      }
    },
    [index, inputData, setInputData]
  );

  const handleDateChange = (date) => {
    if (date) {
      setInputData((x) => {
        let _x = { ...x };
        _x.items[index]["schedule"] = date;
        return _x;
      });
    }
  };

  const handleInputChange = (property, e) => {
    if (property) {
      setInputData((x) => {
        let _x = { ...x };
        _x.items[index][property] = e.target.value;
        return _x;
      });
    }
  };

  const handleDiscardPhotoClick = useCallback(
    (file) => {
      setInputData((data) => {
        let _data = { ...data };
        let _files = [..._data.items[index].files];
        _files = _files.filter((x) => x.name !== file.name);
        _data.items[index].files = [..._files];

        return _data;
      });
    },
    [index, setInputData]
  );

  return (
    <div
      className="flex py-3 w-100"
      style={{ borderTop: index > 0 ? "1px dotted lightgrey" : "none" }}
    >
      <div className={`flex ${isSingle ? "flex-col" : "flex-row"} w-100`}>
        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } justify-start basis-auto`}
        >
          <div className={`flex flex-col justify-around pr-4 gap-2`}>
            <LabelItem
              label={"Item No."}
              value={data?.item}
              emphasizeValue={true}
              className="max-w-[15rem] min-w-[15rem] w-100"
            />
            <LabelItem
              label={"System"}
              value={data?.system}
              className="max-w-[15rem] min-w-[15rem] w-100"
            />
            <LabelItem
              label={"Size"}
              value={data.size}
              className="max-w-[15rem] min-w-[15rem] w-100"
            />
            <LabelItem
              label={"Sub Quantity"}
              value={data.subQty}
              className="max-w-[15rem] min-w-[15rem] w-100"
            />
            <LabelItem
              label={"Description"}
              value={data.description}
              className="max-w-[15rem] min-w-[15rem] w-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Select
              className="w-100 min-w-[13rem] max-w-[13rem]"
              onChange={(key, value) =>
                handleSelectChange("product", {
                  key: key,
                  value: value?.label,
                })
              }
              size={"middle"}
              options={[{ label: "Product *", options: remakeProductOptions }]}
              placeholder={"Product *"}
              value={inputData?.items[index]?.product?.value}
            />

            <Select
              className="w-100 min-w-[13rem] max-w-[13rem]"
              onChange={(key, value) =>
                handleSelectChange("departmentResponsible", {
                  key: key,
                  value: value?.label,
                })
              }
              size={"middle"}
              options={[
                {
                  label: "Department Responsible *",
                  options: remakeDepartmentResponsibleOptions,
                },
              ]}
              value={inputData?.items[index]?.departmentResponsible?.value}
              placeholder={"Department Responsible *"}
            />

            {inputData?.items[index]?.departmentResponsible &&
              remakeDepartmentResponsibleSectionOptions && (
                <Select
                  className="w-100 min-w-[13rem] max-w-[13rem]"
                  onChange={(key, value) =>
                    handleSelectChange("departmentResponsibleSection", {
                      key: key,
                      value: value?.label,
                    })
                  }
                  size={"middle"}
                  options={[
                    {
                      label: "Department Responsible Section",
                      options: remakeDepartmentResponsibleSectionOptions || [],
                    },
                  ]}
                  value={
                    inputData?.items[index]?.departmentResponsibleSection?.value
                  }
                  placeholder={"Department Responsible Section"}
                />
              )}
          </div>

          <div className={`${isMobile ? "pt-2" : "pl-4 flex flex-col gap-2"}`}>
            <DatePicker
              className="w-100"
              onChange={handleDateChange}
              value={
                inputData?.items[index]?.schedule
                  ? dayjs(inputData?.items[index]?.schedule)
                  : null
              }
              placeholder={"Schedule"}
            />

            <Select
              className="w-100 min-w-[15rem] max-w-[15rem]"
              onChange={(key, value) =>
                handleSelectChange("reasonCategory", {
                  key: key,
                  value: value?.label,
                })
              }
              size={"middle"}
              options={[
                {
                  label: "Reason Category *",
                  options: remakeReasonCategoryOptions,
                },
              ]}
              placeholder={"Reason Category *"}
              value={inputData?.items[index]?.reasonCategory?.value}
            />

            {inputData?.items[index]?.reasonCategory && remakeReasonOptions && (
              <Select
                className="w-100 min-w-[15rem] max-w-[15rem]"
                onChange={(key, value) =>
                  handleSelectChange("reason", {
                    key: key,
                    value: value?.label,
                  })
                }
                size={"middle"}
                options={[
                  { label: "Reason", options: remakeReasonOptions || [] },
                ]}
                value={inputData?.items[index]?.reason?.value}
                placeholder={"Reason"}
              />
            )}

            {inputData?.items[index]?.reason && remakeReasonDetailOptions && (
              <Select
                onChange={(key, value) =>
                  handleSelectChange("reasonDetail", {
                    key: key,
                    value: value?.label,
                  })
                }
                size={"middle"}
                options={[
                  {
                    label: "Reason Detail",
                    options: remakeReasonDetailOptions || [],
                  },
                ]}
                value={inputData?.items[index]?.reasonDetail?.value}
                placeholder={"Reason Detail"}
                className="w-100 min-w-[15rem] max-w-[15rem]"
              />
            )}
          </div>
        </div>

        <div
          className={`flex ${isMobile ? "flex-col" : "flex-row"} ${
            isSingle ? "pt-3" : "pl-3"
          }`}
        >
          <div className="flex-1 w-100">
            <TextArea
              rows={4}
              placeholder="Notes *"
              style={{
                minWidth: "15rem",
                minHeight: "9.5rem",
                width: "100%",
                height: "9.5rem",
                textAlign: "left",
              }}
              onChange={(val) => handleInputChange("notes", val)}
              value={inputData?.items[index]?.notes}
            />
          </div>
          <div
            className={`${
              isMobile ? "mt-4" : "ml-4"
            } pl-2 flex-2 relative min-w-[15rem] max-w-[31.5rem] w-100 h-[151px] overflow-hidden rounded border-solid border-[#D3D3D3] border-1`}
          >
            <ImageGallery
              files={inputData?.items[index]?.files}
              imageHeight={150}
              cols={2}
              onDiscard={handleDiscardPhotoClick}
              onUpload={() => {
                setShowPhotoUpload(true);
                setCurrentItemIndex(index);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
