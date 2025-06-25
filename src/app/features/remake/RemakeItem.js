"use client";
import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";

import {
  fetchRemakeWorkOrderById,
} from "app/api/remakeApis";

import {
  uploadAttachments,
} from "app/api/genericApis/attachmentsApi";

import { useQuery } from "react-query";

import { Form, Select, DatePicker, Space, Empty, Input, Modal, Button, message, Image } from "antd";
const { TextArea } = Input;

import { ProductionRemakeOptions } from "app/utils/constants";

import {
  fetchAttachments,
} from "app/api/genericApis/attachmentsApi";
import AntUploadModalWithNotes from "app/components/antUploadModalWithNotes/antUploadModalWithNotes";

import { saveAs } from "file-saver";

export default function RemakeItem(props) {
  const {
    orderId,
    form,
  } = props;

  const moduleName = "remake";
  const [inputData, setInputData] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState([]);

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
    data: data,
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
    if (data) setInputData(data);
  }, [data]);

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

  const mapToUploadPayload = (fileList) => {
    return fileList.map(file => ({
      id: null,
      fileName: file.name,
      base64Content: file.base64,
      contentType: file.contentType || "",
      size: file.size || "",
      note: file.notes || ""
    }));
  };


  const handleUpload = useCallback(async () => {
    if (uploadFileList?.length > 0 && data) {
      const payload = mapToUploadPayload(uploadFileList);

      if (payload?.length > 0) {
        const result = await uploadAttachments("remake", data.id, payload);
        console.log("upload result ", result);
        if (result) {
          message.success("Attachments uploaded successfully.");
          refetchAttachments();
          setShowUpload(false);
          setUploadFileList([]);
        } else {
          message.error("Failed to upload attachments.");
        }
      }


    }
  }, [uploadFileList, data]);

  useEffect(() => {
    form.setFieldsValue(data)
  }, [data]);

  useEffect(() => {
    console.log("attachments ", attachments)
  }, [attachments])

  useEffect(() => {
    console.log("orderId ", orderId)
  }, [orderId])

  useEffect(() => {
    console.log("uploadFileList ", uploadFileList)
  }, [uploadFileList]);

  const getFileIcon = (fileType) => {
    if (fileType?.includes("pdf")) {
      return <i className="fa-regular fa-file-pdf text-red-600 pt-1" />;
    }
    if (fileType?.includes("word")) {
      return <i className="fa-regular fa-file-word text-blue-600 pt-1" />;
    }
    if (fileType?.includes("image")) {
      return <i className="fa-regular fa-file-image text-teal-600 pt-1" />;
    }
    if (fileType?.includes("text")) {
      return <i className="fa-regular fa-file-lines text-gray-600 pt-1" />;
    }
    return <i className="fa-regular fa-file text-gray-400 pt-1" />;
  };

  return (
    <div className="flex flex-row gap-2">
      <section className="w-1/5">
        <div className="border rounded-sm h-full">
          <div className="bg-neutral-200 pl-2 pt-1 pb-1 font-semibold">
            Item for Remake
          </div>
          <div className="p-2">
            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Item No.:
              </label>
              <div className="flex-1">
                {data?.itemNo}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Sub Qty:
              </label>
              <div className="flex-1">
                {data?.subQty}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Description:
              </label>
              <div className="flex-1">
                {data?.description}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                System:
              </label>
              <div className="flex-1">
                {data?.systemValue}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="flex-none" style={{ width: '90px', textAlign: 'left' }}>
                Size:
              </label>
              <div className="flex-1">
                {data?.size}
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
            <i
              className="fa fa-cloud-arrow-up text-blue-500 hover:text-blue-400 hover:cursor-pointer pr-1"
              onClick={() => setShowUpload(true)}
            />
            Attachments
          </div>
          <div className="">
          </div>
        </div>
        <div className="h-[185px] overflow-y-auto">
          {attachments?.length > 0 &&
            <div className="p-2">
              {[...attachments].map((attachment) => {
                const isImage = attachment.mimeType?.startsWith('image/');
                return (
                  <>
                    {isImage && false && (
                      <div style={{ display: 'none' }}>
                        <Image
                          style={{ height: 0 }}
                          preview={{
                            visible: previewVisible,
                            src: attachment.base64.startsWith('data:')
                              ? attachment.base64
                              : `data:${attachment.mimeType};base64,${attachment.base64}`,
                            onVisibleChange: (visible) => setPreviewVisible(visible),
                          }}
                        />
                      </div>
                    )}
                    <div className="flex flex-row justify-between group">
                      <div
                        className="group-hover:underline group-hover:cursor-pointer"
                        onClick={() => {
                          //if (isImage) {
                           // setPreviewVisible(true);
                          //} else {
                            const dataUri = attachment.base64.startsWith('data:')
                              ? attachment.base64
                              : `data:${attachment.mimeType};base64,${attachment.base64}`;

                            // Open file in a new tab using iframe
                            const newTab = window.open();
                            if (newTab) {
                              newTab.document.write(`
                              <html>
                                <head><title>Preview: ${attachment.name}</title></head>
                                <body style="margin:0">
                                  <iframe src="${dataUri}" style="border:0;width:100vw;height:100vh;"></iframe>
                                </body>
                              </html>
                            `);
                            }
                          //}
                        }}
                      >
                        <span className="pr-1">{getFileIcon(attachment?.mimeType)}</span>
                        <span>{attachment.name}</span>
                        <span className="pl-1 text-blue-500">({attachment.size})</span>
                      </div>
                      <i class="mt-[5px] fa-solid fa-gear text-gray-400 group-hover:cursor-pointer hover:text-blue-500" />
                    </div>
                  </>)
              })}
            </div>
          }

          {attachments?.length === 0 &&
            <div className="p-2 flex justify-center items-center h-full w-full">
              <div className="translate-y-[-15px]">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Attachments"} />
              </div>
            </div>
          }
        </div>
      </section>
      <AntUploadModalWithNotes
        showUpload={showUpload}
        setShowUpload={setShowUpload}
        setUploadFileList={setUploadFileList}
        onSave={handleUpload}
        allowedFileTypes={[
          // Images
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/heic',
          'image/svg+xml',

          // PDFs
          'application/pdf',

          // Word documents
          'application/msword',                     // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

          // Excel files
          'application/vnd.ms-excel',               // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

          // PowerPoint
          'application/vnd.ms-powerpoint',          // .ppt
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx

          // Text files
          'text/plain',

          // CSV, JSON
          'text/csv',
          'application/json',

          // Archives
          'application/zip',
          'application/x-7z-compressed',
          'application/x-rar-compressed',
          'application/x-tar',

          // Rich Text Format
          'application/rtf'
        ]}
        title={"Upload Attachments"}
        canUpload={true}
      />
    </div>
  );
}
