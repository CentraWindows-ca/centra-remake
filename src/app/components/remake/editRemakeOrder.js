"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import {
  fetchRemakeWorkOrderById,
  updateRemakeWorkOrder,
} from "app/api/remakeApis";
import { useQuery } from "react-query";

import { Button, Popconfirm, Spin, Form, Select, DatePicker, Space, Typography, Input, Empty } from "antd";
const { Text } = Typography;
const { TextArea } = Input;

import { ProductionRemakeOptions, RemakeRowStates } from "app/utils/constants";

import LockButton from "app/components/lockButton/lockButton";
import { mapRemakeRowStateToKey, openBlob, openWOLink, YMDDateFormat } from "app/utils/utils";

import OrderStatus from "app/components/remake/orderStatus";

import {
  deleteAttachments,
  fetchAttachments,
  saveAttachment,
} from "app/api/genericApis/attachmentsApi";

import { saveAs } from "file-saver";

export default function EditRemakeOrder(props) {
  const {
    orderId,
    onClose,
    onShareLinkClick,
    form,
    onFinish,
    onFinishFailed
  } = props;

  const moduleName = "remake";
  const [inputData, setInputData] = useState([]);
  const [remakeChangeItems, setRemakeChangeItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [fileData, setFileData] = useState([]);

  // api calls
  const fetchOrderDetailsAsync = async () => {
    if (orderId) {
      const result = await fetchRemakeWorkOrderById(orderId, false);
      return result.data;
    } else {
      return null;
    }
  };

  const fetchAttachmentsAsync = async () => {
    if (orderId) {
      const result = await fetchAttachments(moduleName, orderId);
      return result.data;
    }
    return [];
  };

  // useQuery call to fetch remake details
  const {
    isLoading: isLoadingDetails,
    data: remakeOrderData,
    refetch: refetchOrder,
    isFetching: isFetchingDetails,
  } = useQuery([`${moduleName}OrderDetails`, orderId], fetchOrderDetailsAsync, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingAttachments,
    data: attachments,
    refetch: refetchAttachments,
    isFetching: isFetchingAttachments,
  } = useQuery(`${moduleName}OrderAttachments`, fetchAttachmentsAsync, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (remakeOrderData) setInputData(remakeOrderData);
  }, [remakeOrderData]);

  useEffect(() => {
    if (attachments) {
      setDocuments(
        attachments // attachments.filter((f) => f.fileType === FileTypes.file) ?? []
      );
    }
  }, [attachments]);

  // for rendering dynamic options
  const remakeProductOptions = ProductionRemakeOptions.find(
    (x) => x.key === "product"
  )?.options?.map((group) => ({
    key: group.key,
    value: group.value,
    label: group.value,
  }));

  const remakeBranchOptions = ProductionRemakeOptions.find(
    (x) => x.key === "branch"
  )?.options;

  const departmentResponsibleOptions = ProductionRemakeOptions.find(
    (x) => x.key === "departmentResponsible"
  )?.options?.map((group) => ({
    key: group.key,
    value: group.value,
    label: group.value,
  }));

  const reasonCategoryOptions = ProductionRemakeOptions.find(
    (x) => x.key === "reasonCategory"
  )?.options?.map((group) => ({
    key: group.key,
    value: group.value,
    label: group.value,
  }));

  const remakeDepartmentResponsibleSectionOptions =
    ProductionRemakeOptions.find(
      (x) => x.key === "departmentResponsible"
    )?.options?.find(
      (x) => x.value === inputData?.departmentResponsible
    )?.options;

  const remakeReasonOptions = ProductionRemakeOptions?.find(
    (x) => x.key === "reasonCategory"
  )?.options?.find((x) => x.value === inputData?.reasonCategory)?.options?.map((reasonCategory) => {
    return {
      key: reasonCategory.key,
      value: reasonCategory.value,
      label: reasonCategory.value,
    }
  });

  const remakeReasonDetailOptions = ProductionRemakeOptions?.find(
    (x) => x.key === "reasonCategory"
  )?.options?.find((x) => x.value === inputData?.reasonCategory)
    ?.options?.find((y) => y.value === inputData?.reason)?.options?.map((reasonDetail) => {
      return {
        key: reasonDetail.key,
        value: reasonDetail.value,
        label: reasonDetail.value,
      };
    });

  // onClick events
  const handleInputChange = useCallback(
    (e, type = null) => {
      if (!e?.target) return;

      const name = e.target.name;

      setInputData((d) => {
        let _d = { ...d };

        _d[name] = e.target.value;

        return _d;
      });
    },
    []
  );

  const handleDateChange = useCallback((date, dateString) => {
    setInputData((d) => ({
      ...d,
      scheduleDate: date ? date.toISOString() : null,  // store as ISO string
    }));
  }, []);

  const handleSelectChange = (val, key) => {
    if (val && key) {
      setInputData((data) => {
        let _data = { ...data };
        _data[key] = val;
        return _data;
      });
    }
  };

  const handleSave = useCallback(async () => {
    if (remakeOrderData) {
      setIsSaving(true);
      let data = [];

      let remakeUpdates = JSON.parse(JSON.stringify(remakeOrderData));

      if (remakeChangeItems.length > 0) {
        remakeChangeItems.map((ci) => {
          var newVal = {};
          newVal = ci.value;
          remakeUpdates[ci.key] = newVal;
        });
      }

      // if (dateChangeItems.length > 0) {
      //   dateChangeItems.map((dc) => {
      //     data[dc.key] = dc.value;
      //   });
      // }

      data.push(remakeUpdates);

      await updateRemakeWorkOrder(data);

      refetchOrder();

      setRemakeChangeItems([]);
      setIsSaving(false);
    }
  }, [remakeOrderData, remakeChangeItems, refetchOrder]);

  const deleteDocumentsButtonDisabled = useCallback(() => {
    let result = true;

    if (documents?.length > 0) {
      documents.forEach((d) => {
        if (d.checked) {
          result = false;
        }
      });
    }

    return result;
  }, [documents]);

  const handleDocumentsOk = useCallback(async () => {
    if (fileData) {
      const updatedDocuments = fileData.map((d) => {
        if (d?.base64?.length > 0) {
          return {
            id: d.id,
            fileName: d.name,
            base64Content: d.base64.split(",")[1],
            contentType: d.type,
            size: d.size,
            note: d.fileNotes,
          };
        }
      });
      await saveAttachment(moduleName, orderId, updatedDocuments);
      refetchAttachments();

      setShowAttachments(false);
    }
  }, [fileData, orderId, refetchAttachments]);

  const handleDownloadFile = useCallback(
    (fileId) => {
      if (documents) {
        let document = documents.find((x) => x.id === fileId);
        if (document) {
          const binaryData = atob(document.base64);
          const byteArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: document.mimeType });
          saveAs(blob, document.name);
        }
      }
    },
    [documents]
  );

  const handlePreviewFile = useCallback(
    (fileId) => {
      if (documents) {
        let document = documents.find((x) => x.id === fileId);
        if (document) {
          let base64 = document.base64;
          if (base64) {
            openBlob(base64, document.mimeType);
          }
        }
      }
    },
    [documents]
  );

  const handleCheckFile = (fileId, value) => {
    setDocuments((d) => {
      let _d = JSON.parse(JSON.stringify(d));
      let index = documents.findIndex((x) => x.id === fileId);
      _d[index].checked = value;
      return _d;
    });
  };

  const handleDeleteFiles = () => {
    setShowDeleteFiles(true);
  };

  const deleteCheckedFiles = useCallback(async () => {
    let checkedDocs = documents.filter((d) => d.checked);

    if (checkedDocs?.length > 0) {
      let idsToDelete = checkedDocs.map((d) => {
        return d.id;
      });

      await deleteAttachments(moduleName, idsToDelete);
      refetchAttachments();

      setShowDeleteFiles(false);
    }
  }, [documents, refetchAttachments]);

  const openWOLinkCallback = () => {
    openWOLink(inputData?.workOrderNo);
  };

  useEffect(() => {
    form.setFieldsValue(remakeOrderData)
  }, [remakeOrderData])
    
  return (
    <Form      
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}      
    >
      <div className="flex flex-row">
        <div className="bg-[#E2E8F0] text-[#1868B1] pl-2 pt-[1px] pr-2 rounded-sm w-[7.9rem]">
          <i className="fa-solid fa-rotate-left pr-1" />
          {`Remake# ${inputData?.remakeId}`}
        </div>
        <div className="ml-2">
          <OrderStatus
            statusKey={mapRemakeRowStateToKey(inputData?.workOrderNo) ?? "newOrder"}
            statusList={RemakeRowStates}
            //updateStatusCallback={updateStatus}          
            updateStatusCallback={() => { }}
            orderId={inputData?.remakeId}
            handleStatusCancelCallback={() => { }}
            style={{ width: "100%" }}
            className="rounded-sm m-0"
          />
        </div>
      </div>

      {false &&
        <div className="flex justify-between mb-3">
          <Button onClick={() => onShareLinkClick(orderId)}>
            <i className="fas fa-link"></i>
            <span className="pl-2">Copy Link</span>
          </Button>
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
              tooltip={"Save Changes"}
              disabled={remakeChangeItems.length === 0}
              label={"Save"}
            />
          </Popconfirm>
        </div>
      }

      <div className="border-t border-b mt-4 mb-[0.7rem]">
        <div className="flex flex-row justify-between bg-[#F5F5F5] mt-[2px] mb-[2px] pl-2 pr-2">
          <Space>
            <div title="Parent Work Order" className="font-semibold text-blue-500 hover:underline hover:cursor-pointer">{inputData?.workOrderNo?.toUpperCase()}</div>
            <div title="Reported By" className="border-l"><i className="fa-solid fa-user pr-1 pl-2 text-indigo-500" />{inputData?.createdBy}</div>
          </Space>
          <div title="Date Created"><i className="fa-solid fa-calendar-day text-blue-500 pr-2" />{YMDDateFormat(inputData?.createdAt)}</div>
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <section className="w-1/5">
          <div className="border rounded-sm h-full">
            <div className="bg-rose-50 pl-2 pt-1 pb-1 font-semibold">
              Item for Remake
            </div>
            <div className="p-2">
              <div className="flex items-center mb-2">
                <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                  Item No.:
                </label>
                <div className="flex-1">
                  {inputData?.itemNo}
                </div>
              </div>

              <div className="flex items-center mb-2">
                <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                  Sub Qty:
                </label>
                <div className="flex-1">
                  {inputData?.subQty}
                </div>
              </div>

              <div className="flex items-center mb-2">
                <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                  Description:
                </label>
                <div className="flex-1">
                  {inputData?.description}
                </div>
              </div>

              <div className="flex items-center mb-2">
                <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                  System:
                </label>
                <div className="flex-1">
                  {inputData?.systemValue}
                </div>
              </div>

              <div className="flex items-center mb-2">
                <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                  Size:
                </label>
                <div className="flex-1">
                  {inputData?.size}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border rounded-sm w-3/5">
          <div className="bg-[#ebeff3] pl-2 pt-1 pb-1 font-semibold">
            Remake Info
          </div>
          <div className="p-2">
            <div className="flex flex-row justify-between">
              <Form.Item
                labelCol={{ flex: '100px' }}
                labelAlign="left"
                label="Product"
                name="product"
                className="mb-0"
                rules={[{ required: true }]}
              >
                <Select
                  size="small"
                  options={remakeProductOptions}
                  onChange={handleSelectChange}
                  style={{ width: '11rem' }}
                  placeholder="Select Product"
                  value={inputData?.product}
                />
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '120px' }}
                labelAlign="left"
                label="Scheduled Date"
                name="scheduleDate"
                className="mb-0"
              >
                <span className="">
                  <DatePicker
                    size="small"
                    onChange={handleDateChange}
                    value={inputData?.scheduleDate ? dayjs(inputData.scheduleDate) : null}
                    format="YYYY-MM-DD"
                    style={{ width: '11rem' }}
                  />
                </span>
              </Form.Item>
            </div>

            <div className="flex flex-row justify-between">
              <Form.Item
                labelCol={{ flex: '100px' }}
                name="departmentResponsible"
                className="mb-0"
                labelAlign="left"
                label="Department"
                rules={[{ required: true }]}
              >
                <Select
                  size="small"
                  value={inputData?.departmentResponsible}
                  options={departmentResponsibleOptions}
                  onChange={(val) => handleSelectChange(val, "departmentResponsible")}
                  style={{ width: '11rem' }}
                  placeholder="Dept. Responsible"
                />
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '120px' }}
                name="departmentResponsibleSection"
                className="mb-0"
                labelAlign="left"
                label="Section"
              >
                <Select
                  disabled={!remakeDepartmentResponsibleSectionOptions?.length > 0}
                  size="small"
                  value={inputData?.departmentResponsibleSection}
                  options={remakeDepartmentResponsibleSectionOptions}
                  onChange={(val) => handleSelectChange(val, "departmentResponsibleSection")}
                  style={{ width: '11rem' }}
                  placeholder="Section Responsible"
                />
              </Form.Item>
            </div>

            <Space.Compact style={{ width: '100%', display: 'flex', marginTop: "0.5rem" }}>
              <div className="flex-[3] w-full">
                <Form.Item
                  labelAlign="left"
                  label="Reason"
                  name="reasonCategory"
                  className="mb-0"
                  labelCol={{ flex: '100px' }}
                  rules={[{ required: true }]}
                >
                  <Select
                    size="small"
                    options={reasonCategoryOptions}
                    value={inputData?.reasonCategory}
                    onChange={(val) => handleSelectChange(val, "reasonCategory")}
                    placeholder="Category"
                  />
                </Form.Item>
              </div>
              <div className="flex-[2]">
                <Form.Item
                  labelAlign="left"
                  label=""
                  name="reason"
                  className="mb-0"
                >
                  <Select
                    size="small"
                    options={remakeReasonOptions}
                    value={inputData?.reason}
                    onChange={(val) => handleSelectChange(val, "reason")}
                    placeholder="Subcategory"
                  />
                </Form.Item>
              </div>
              {remakeReasonDetailOptions?.length > 0 &&
                <div className="flex-[2]">
                  <Form.Item
                    labelAlign="left"
                    label=""
                    name="reasonDetail"
                    className="mb-0"
                  >
                    <Select
                      size="small"
                      options={remakeReasonDetailOptions}
                      value={inputData?.reasonDetail}
                      onChange={(val) => handleSelectChange(val, "reasonDetail")}
                      placeholder="Detail"
                    />
                  </Form.Item>
                </div>
              }
            </Space.Compact>
            <div className="mt-[0.5rem]">
              <Form.Item
                labelAlign="left"
                label="Notes"
                name="notes"
                className="mb-0"
                labelCol={{ flex: '100px' }}
              >
                <TextArea
                  name={"notes"}
                  value={inputData?.notes}
                  rows={2}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </div>
          </div>
        </section>

        <section className="border rounded-sm w-1/5">
          <div className="bg-[#ebeff3] pl-2 pt-1 pb-1 font-semibold flex flex-row justify-between">
            <div>
              <i className="fa fa-cloud-arrow-up text-blue-500" /> Attachments
            </div>
            <div className="pr-2">
              <i className="fa fa-trash-can text-red-500" />
            </div>
          </div>
          <div className="p-2 flex justify-center items-center h-full w-full">
            <div className="translate-y-[-15px]">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Attachments"} />
            </div>
          </div>
        </section>
      </div>
    </Form>
  );
}
