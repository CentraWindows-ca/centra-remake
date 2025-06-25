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
import RemakeItem from "app/features/remake/RemakeItem";

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

      <RemakeItem
        orderId={orderId}
        form={form}
      />   
    </Form>
  );
}
