"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import moment from "moment";

import { Popconfirm, Button, Popover, Checkbox, Space, Modal } from "antd";

import DocumentUpload from "app/components/documentUpload/documentUpload";

import RemakeItem from "./remakeItem";
import LockButton from "app/components/lockButton/lockButton";

import { useAuthData } from "context/authContext";

import dayjs from "dayjs";

import { addRemakes, addRemakePhotos } from "app/api/productionApis";

import { v4 as uuidv4 } from "uuid";
import { YMDDateFormat } from "app/utils/utils";

const CustomModal = styled(Modal)`
  .ant-modal {
    @apply transition-all duration-300 ease-in-out opacity-0 translate-y-5;
  }

  .ant-modal-open .ant-modal {
    @apply opacity-100 translate-y-0;
  }
`;

export default function CreateRemake(props) {
  const { selected, setShowCreateRemakes, customerName, style, branch } = props;

  const { loggedInUser } = useAuthData();

  const { tempFiles, result } = useSelector((state) => state.calendar);

  const { isMobile, userToken, isReadOnly } = useSelector((state) => state.app);

  const [inputData, setInputData] = useState(null);
  const [showCopyFields, setShowCopyFields] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [checkboxFields, setCheckboxFields] = useState([
    { key: "product", value: "Product", checked: false, disabled: false },
    {
      key: "reasonCategory",
      value: "Reason Category",
      checked: false,
      disabled: false,
    },
    { key: "reason", value: "Reason", checked: false, disabled: false },
    {
      key: "reasonDetail",
      value: "Reason Detail",
      checked: false,
      disabled: false,
    },
    { key: "schedule", value: "Schedule", checked: false, disabled: false },
    {
      key: "departmentResponsible",
      value: "Department Responsible",
      checked: false,
      disabled: false,
    },
    {
      key: "departmentResponsibleSection",
      value: "Department Responsible Section",
      checked: false,
      disabled: false,
    },
    { key: "notes", value: "Notes", checked: false, disabled: false },
  ]);
  const [changeItems, setChangeItems] = useState([]);

  useEffect(() => {
    if (selected?.length > 0) {
      let _inputData = {
        items: [],
      };

      _inputData.workOrderNumber = selected[0]?.workOrderNumber;
      _inputData.jobType = selected[0]?.jobType;

      selected.forEach((x) => {
        let _x = { ...x };
        _inputData.items.push(_x);
      });

      setInputData(_inputData);
    }
  }, [selected]);

  const formatDate = (date) => {
    let result = "";

    if (date) {
      result = dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");
    }

    return result;
  };

  const handleSave = useCallback(() => {
    if (inputData?.items?.length > 0) {
      let _workOrderNumber = inputData.items[0].workOrderNumber;
      let data = [];

      inputData?.items.forEach((d) => {
        let item = {
          id: uuidv4(),
          remakeWorkOrderNo:
            `${d?.workOrderNumber}-R-${d?.item}-${d?.system}.${d?.subQty}`?.replace(
              /\s+/g,
              ""
            ),
          workOrderNo: _workOrderNumber,
          actionItemId: d.detailRecordId,
          customerName: customerName || "",
          subQty: d.subQty || "",
          requestedBy: "",
          itemNo: d.item || "",
          product: d.product?.value || "",
          jobType: d.jobType || "",
          departmentResponsible: d.departmentResponsible?.value || "",
          departmentResponsibleSection:
            d.departmentResponsibleSection?.value || "",
          reasonCategory: d.reasonCategory?.value || "",
          reason: d.reason?.value || "",
          reasonDetail: d.reasonDetail?.value || "",
          notes: d.notes || "",
          scheduleDate: YMDDateFormat(d.schedule) || YMDDateFormat(moment()),
          dateCompleted: YMDDateFormat(d.schedule) || YMDDateFormat(moment()),
          status: "New Order",
          createdBy: loggedInUser.email ?? "Test User",
          createdAt: YMDDateFormat(moment()),
          lastModifiedBy: "",
          lastModifiedAt: YMDDateFormat(moment()),
          branch: branch || "",
          files: d.files,
          description: d.description,
          systemValue: d.system,
          size: d.size,
        };

        data.push(item);
      });

      if (data) {
        setChangeItems(data);
        addRemakes(userToken, data);
      }
    }
  }, [inputData, customerName, loggedInUser, userToken, branch]);

  useEffect(() => {
    if (
      result?.type === "success" &&
      result?.source === "Create Remake" &&
      changeItems?.length > 0
    ) {
      for (let i = 0; i < changeItems?.length; i++) {
        addRemakePhotos({
          id: changeItems[i].id,
          files: changeItems[i].files?.map((x) => {
            return {
              id: "",
              fileName: x.name,
              base64Content: x.base64?.split(",")[1],
              contentType: x.type,
              size: x.size,
              note: x.fileNotes,
            };
          }),
        });
      }
      setChangeItems([]);
    }
  }, [result, changeItems, userToken]);

  const validateForm = useCallback(() => {
    let result = true;

    let requiredFields = [
      "product",
      "reasonCategory",
      "departmentResponsible",
      "notes",
    ];

    if (inputData?.items?.length > 0) {
      inputData.items.forEach((item) => {
        requiredFields.forEach((property) => {
          if (!item[property]) {
            result = false;
          }
        });
      });
    }

    return result;
  }, [inputData]);

  const handleCheckboxClick = (e, key) => {
    if (e && key) {
      setCheckboxFields((cf) => {
        let _cf = [...cf];
        _cf.forEach((x) => {
          if (x.key === key) {
            x.checked = e.target.checked;
          }
        });
        return _cf;
      });
    }
  };

  const handleCheckboxClickAll = (e) => {
    if (e) {
      setCheckboxFields((cf) => {
        let _cf = [...cf];

        _cf.forEach((x) => {
          x.checked = e.target.checked && !x.disabled;
        });

        return _cf;
      });
    }
  };

  const unCheckAll = (e) => {
    if (e) {
      setCheckboxFields((cf) => {
        let _cf = [...cf];

        _cf.forEach((x) => {
          x.checked = false;
        });

        return _cf;
      });
    }
  };

  useEffect(() => {
    if (inputData?.items?.length > 0) {
      let sourceRow = { ...inputData.items[0] };

      setCheckboxFields((cf) => {
        let _cf = [...cf];

        _cf.forEach((x) => {
          x.disabled = !sourceRow[x.key];
        });

        return _cf;
      });
    }
  }, [inputData]);

  const cloneFirstRow = useCallback(() => {
    if (inputData?.items?.length > 1) {
      let sourceRow = { ...inputData.items[0] };
      let _inputData = { ...inputData };
      checkboxFields.forEach((field) => {
        let sourceVal = sourceRow[field.key];
        for (let i = 1; i < _inputData.items.length; i++) {
          if (field.checked && !field.disabled) {
            _inputData.items[i][field.key] = sourceVal;
          }
        }
      });

      setInputData({ ..._inputData });
      setShowCopyFields(false);
    }
  }, [inputData, checkboxFields]);

  const copyFieldsContent = useCallback(() => {
    if (inputData?.items?.length > 1) {
      //Only show selection if there is a destination row

      return (
        <div>
          <div
            className="pb-1 mt-2 mb-2"
            style={{
              borderTop: "1px dotted lightgrey",
              borderBottom: "1px dotted lightgrey",
            }}
          >
            <div className="pt-2 pb-2 flex flex-col">
              <Checkbox
                onChange={(e) => handleCheckboxClickAll(e)}
                className="pb-2"
                checked={checkboxFields
                  .filter((x) => !x.disabled)
                  ?.every((x) => x.checked)}
                indeterminate={
                  checkboxFields
                    .filter((x) => !x.disabled)
                    ?.some((x) => x.checked) &&
                  checkboxFields
                    .filter((x) => !x.disabled)
                    ?.some((x) => !x.checked)
                }
              >
                Select All
              </Checkbox>
              {checkboxFields.map((cf, index) => {
                return (
                  <Checkbox
                    key={`checkbox-${index}`}
                    disabled={cf.disabled}
                    onChange={(e) => handleCheckboxClick(e, cf.key)}
                    checked={cf.checked}
                  >
                    {cf.value}
                  </Checkbox>
                );
              })}
            </div>
          </div>
          <div className="flex flex-row justify-end pt-1">
            <Space>
              <Button
                onClick={(e) => {
                  setShowCopyFields(false);
                  unCheckAll(e);
                }}
                type="primary"
              >
                Cancel
              </Button>
              <Popconfirm
                placement="left"
                title={"Copy fields"}
                description={
                  <div>
                    <div>
                      This action will overwrite the 2nd row and all the rows
                      onwards.
                    </div>
                    <div>Do you wish to proceed?</div>
                  </div>
                }
                onConfirm={() => {
                  cloneFirstRow();
                  unCheckAll();
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  disabled={checkboxFields.every((x) => !x.checked)}
                  type="primary"
                >
                  Ok
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </div>
      );
    }
  }, [inputData, cloneFirstRow, checkboxFields]);

  const handleFilesOk = useCallback(() => {
    setShowPhotoUpload(false);

    setInputData((x) => {
      let _x = { ...x };
      let existingFiles = _x.items[currentItemIndex]?.files
        ? [..._x.items[currentItemIndex]?.files]
        : [];
      _x.items[currentItemIndex].files = [...existingFiles, ...tempFiles];

      return _x;
    });
  }, [tempFiles, currentItemIndex]);

  const sortBySystemItemSubQty = (a, b) => {
    if (a.system < b.system) return -1;
    if (a.system > b.system) return 1;

    if (a.item < b.item) return -1;
    if (a.item > b.item) return 1;

    if (a.subQty < b.subQty) return -1;
    if (a.subQty > b.subQty) return 1;

    return 0;
  };

  return (
    <div className="text-sm px-3 pb-3" style={{ ...style }}>
      <div className="sticky bg-white z-10 pt-3 mt-0" style={{ top: 0 }}>
        <div
          className={`flex flex-row justify-between ${
            selected?.length === 1 ? "mb-2" : "mb-8"
          }`}
        >
          <div className={`flex flex-row`} style={{ minWidth: "18rem" }}>
            {!isMobile && (
              <div
                className="bg-slate-200 p-2 rounded"
                style={{ color: "var(--centrablue)" }}
              >
                <i className="fa-regular fa-rectangle-list pr-2 pl-1 align-sub"></i>
                <span className="pr-1 align-sub">{`Create Remake`}</span>
              </div>
            )}
            <div
              className="ml-2 p-2 rounded text-blue-500"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <span className="text-gray-500 align-sub">WO#</span>{" "}
              <span className="align-sub">{inputData?.workOrderNumber}</span>
            </div>
            <div
              className="ml-2 p-2 rounded"
              // style={{ backgroundColor: "#F5F5F5" }}
            >
              <span className="text-gray-500 align-sub">{branch}</span>
            </div>
          </div>
          {!isReadOnly && (
            <Popconfirm
              placement="left"
              title={"Close window"}
              description={
                <div className="pb-2">
                  Closing this window will discard all your changes. Do you wish
                  to proceed?
                </div>
              }
              onConfirm={() => setShowCreateRemakes(false)}
              okText="Yes"
              cancelText="No"
            >
              <i
                className="bi bi-x hover:cursor-pointer pr-1"
                style={{
                  fontSize: "2rem",
                  marginTop: "-0.5rem",
                  marginRight: "-0.5rem",
                  color: "darkgrey",
                }}
              />
            </Popconfirm>
          )}

          {isReadOnly && (
            <i
              className="bi bi-x hover:cursor-pointer pr-1"
              style={{
                fontSize: "2rem",
                marginTop: "-0.5rem",
                marginRight: "-0.5rem",
                color: "darkgrey",
              }}
              onClick={() => setShowCreateRemakes(false)}
            />
          )}
        </div>

        {false && (
          <div className="pt-2">
            Job Type:{" "}
            <span className="text-blue-500">{inputData?.jobType}</span>
          </div>
        )}

        <div
          className="flex flex-row justify-between"
          style={{ borderBottom: "1px dotted lightgrey" }}
        >
          <div className="flex flex-row justify-between w-100 pb-3">
            <Popover
              placement="left"
              open={showCopyFields}
              title={
                <div className="text-sm font-normal">
                  <div>Select fields from the top row that</div>{" "}
                  <div>you wish to copy to all the rows beneath it.</div>
                </div>
              }
              content={copyFieldsContent}
              trigger="click"
            >
              {selected?.length > 1 && (
                <Button onClick={() => setShowCopyFields(true)}>
                  <i className="fa-solid fa-arrow-down-wide-short pr-2"></i>
                  <span>Copy</span>
                </Button>
              )}
            </Popover>
            <Popconfirm
              placement="left"
              title={"Save Confirmation"}
              description={
                <div className="pb-2">
                  <div>{`Do you wish to proceed?`}</div>
                </div>
              }
              onConfirm={handleSave}
              okText="Yes"
              cancelText="No"
            >
              <LockButton
                tooltip={"Save new remake work orders"}
                disabled={!validateForm() || isReadOnly}
                showLockIcon={isReadOnly}
                label={"Save"}
              />
            </Popconfirm>
          </div>
        </div>
      </div>
      <div style={{ overflow: "hidden", overflowY: "auto" }}>
        {selected.sort(sortBySystemItemSubQty).map((s, index) => {
          return (
            <RemakeItem
              key={`remake-item-${index}`}
              data={s}
              index={index}
              inputData={inputData}
              setInputData={setInputData}
              setShowPhotoUpload={setShowPhotoUpload}
              setCurrentItemIndex={setCurrentItemIndex}
              isSingle={selected?.length === 1}
            />
          );
        })}
      </div>
      <Modal
        title={`Add attachments to item ${inputData?.items[currentItemIndex]?.item}`}
        open={showPhotoUpload}
        showCancel={false}
        onCancel={() => {
          setShowPhotoUpload(false);
        }}
        onOk={handleFilesOk}
        disableOkPopConfirm={true}
        okLabel={"Ok"}
        okDisabled={!tempFiles?.length > 0}
        cancelLabel={"Cancel"}
        popConfirmCancelTitle={"Close Window"}
        popConfirnCancelDescription={
          <div>
            <div>
              Once you close this window, all your pending changes will be lost.
            </div>
            <div>Proceed anyway?</div>
          </div>
        }
      >
        <DocumentUpload documents={[]} skipRedux={true} />
      </Modal>
    </div>
  );
}
