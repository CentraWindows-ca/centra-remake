"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import {
  fetchRemakeWorkOrderById,
  updateRemakeWorkOrder,
} from "app/api/remakeApis";
import { useQuery } from "react-query";

import { Button, Popconfirm, Spin, Form, Select, DatePicker, Space } from "antd";
import { ProductionRemakeOptions, RemakeRowStates } from "app/utils/constants";

import LockButton from "app/components/lockButton/lockButton";
import { mapRemakeRowStateToKey, openBlob, openWOLink, YMDDateFormat } from "app/utils/utils";
import OrderModalHeader from "app/components/remake/orderModalHeader";
import Group from "app/components/workorderComponents/group";
import SelectItem from "app/components/workorderComponents/selectItem";
import DateItem from "app/components/workorderComponents/dateItem";
import TextAreaItem from "app/components/workorderComponents/textareaItem";

import LabelItem from "app/components/workorderComponents/labelItem";

import Divider from "app/components/remake/divider";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { LoadingOutlined } from "@ant-design/icons";
import {
  deleteAttachments,
  fetchAttachments,
  saveAttachment,
} from "app/api/genericApis/attachmentsApi";
import ActionModal from "app/components/actionModal/actionModal";

import { saveAs } from "file-saver";
import ConfirmationModal from "app/components/confirmationModal/confirmationModal";

export default function EditRemakeOrder(props) {
  const {
    orderId,
    onClose,
    onShareLinkClick,
    form
  } = props;

  const moduleName = "remake";
  const [inputData, setInputData] = useState([]);
  const [remakeChangeItems, setRemakeChangeItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [containsNewUnsavedFiles, setContainsNewUnsavedFiles] = useState(false);

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

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  // for rendering dynamic options
  const remakeProductOptions = ProductionRemakeOptions.find(
    (x) => x.key === "product"
  )?.options;

  const remakeBranchOptions = ProductionRemakeOptions.find(
    (x) => x.key === "branch"
  )?.options;

  const departmentResponsibleOptions = ProductionRemakeOptions.find(
    (x) => x.key === "departmentResponsible"
  )?.options?.map((group) => ({
    value: group.value,
    label: group.value,
  }));

  const reasonCategoryOptions = ProductionRemakeOptions.find(
    (x) => x.key === "reasonCategory"
  )?.options?.map((group) => ({
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
      value: reasonCategory.value,
      label: reasonCategory.value,
    }
  });

  const remakeReasonDetailOptions = ProductionRemakeOptions?.find(
    (x) => x.key === "reasonCategory"
  )?.options?.find((x) => x.value === inputData?.reasonCategory)
    ?.options?.find((y) => y.value === inputData?.reason)?.options?.map((reasonDetail) => {
      return {
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

  const addRemakeChangeItem = (changeItem) => {
    if (changeItem) {
      setRemakeChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) _ci[index].value = changeItem.value;
        else _ci.push(changeItem);

        return _ci;
      });
    }
  };

  const removeRemakeChangeItem = (changeItem) => {
    if (changeItem) {
      setRemakeChangeItems((ci) => {
        let result = [];
        if (ci.length > 0) {
          let _ci = [...ci];
          const index = _ci.findIndex((x) => x.key === changeItem.key);
          if (index > -1) {
            _ci.splice(index, 1);
          }
          result = [..._ci];
        }
        return result;
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

  return (
    <Form form={form}>
      <OrderModalHeader
        moduleName={moduleName}
        orderId={orderId}
        orderIID={`Remake # ${inputData?.remakeId}`}
        originalWONumber={inputData?.workOrderNo}
        orderStatus={inputData?.status}
        states={RemakeRowStates}
        mapStatesFunc={mapRemakeRowStateToKey}
        onClose={onClose}
        reloadCallback={refetchOrder}
      />

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

      <div className="border-t border-b mt-4 mb-2">
        <div className="flex flex-row justify-between bg-[#F5F5F5] mt-[2px] mb-[2px] pl-2 pr-2">
          <div><i className="fa-solid fa-user pr-2 text-blue-500" />{inputData?.createdBy}</div>
          <div><i className="fa-solid fa-calendar-day text-blue-500 pr-2" />{YMDDateFormat(inputData?.createdAt)}</div>
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <section className="w-1/3">
          <div className="border rounded-sm">
            <div className="bg-[#F5F5F5] pl-2 pt-1 pb-1 font-semibold">
              Item for Remake
            </div>
            <div className="p-2">
              <Form.Item
                labelCol={{ flex: '150px' }}
                labelAlign="left"
                label="Work Order No."
                name="workOrderNo"
                className="mb-0"
                onClick={openWOLinkCallback}
              >
                <span className="text-[var(--centrablue)] hover:cursor-pointer hover:underline">
                  {inputData?.workOrderNo}
                </span>
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '150px' }}
                labelAlign="left"
                label="Item No."
                name="itemNo"
                className="mb-0"
              >
                <span className="">
                  {inputData?.itemNo}
                </span>
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '150px' }}
                labelAlign="left"
                label="Sub Quantity"
                name="subQty"
                className="mb-0"
              >
                <span className="">
                  {inputData?.subQty}
                </span>
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '150px' }}
                labelAlign="left"
                label="Description"
                name="subQty"
                className="mb-0"
              >
                <span className="">
                  {inputData?.description}
                </span>
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '150px' }}
                labelAlign="left"
                label="System"
                name="system"
                className="mb-0"
              >
                <span className="">
                  {inputData?.systemValue}
                </span>
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '150px' }}
                labelAlign="left"
                label="Size"
                name="size"
                className="mb-0"
              >
                <span className="">
                  {inputData?.size}
                </span>
              </Form.Item>

              <Form.Item
                labelCol={{ flex: '150px' }}
                labelAlign="left"
                label="Description"
                name="description"
                className="mb-0"
              >
                <span className="">
                  {inputData?.description}
                </span>
              </Form.Item>


              {false &&
                <LabelItem
                  label={"Branch"}
                  value={inputData?.branch}
                  leftAlign={true}
                />
              }
            </div>
          </div>
          <Group
            title="Attachments"
            contentStyle={{
              padding: "0.5rem",
              height: "100%",
              overflow: "auto",
            }}
            iconButtonsLeft={[
              {
                Icon: CloudUploadIcon,
                callback: () => setShowAttachments(true),
                tooltip: "Upload Documents",
                className: "text-blue-500 hover:text-blue-400",
              },
            ]}
            iconButtonsRight={[
              {
                Icon: DeleteForeverIcon,
                callback: deleteDocumentsButtonDisabled()
                  ? () => { }
                  : handleDeleteFiles,
                tooltip: "Delete Document(s)",
                className: deleteDocumentsButtonDisabled()
                  ? "text-gray-400"
                  : "text-red-600 hover:text-red-400 cursor-pointer",
              },
            ]}
          >
            {isLoadingAttachments || isFetchingAttachments ? (
              <div className="flex justify-center items-center w-full h-full py-4">
                <span>
                  <Spin className="pr-2" indicator={antIcon} /> Loading...
                </span>
              </div>
            ) : (
              <>
                {attachments?.map((d, index) => {
                  return (
                    <div key={index}>Document</div>
                  );
                })}

                {attachments?.length === 0 && (
                  <div
                    style={{ display: "table", height: "80%" }}
                    className="w-full"
                  >
                    <div className="table-cell align-middle text-center">
                      <div
                        className="cursor-pointer hover:text-blue-400 text-gray-400"
                        onClick={() => setShowAttachments(true)}
                      >
                        <CloudUploadIcon style={{ marginRight: "3px" }} /> Add a
                        document
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Group>
        </section>

        <section className="flex-1 border rounded-sm">
          <div className="bg-[#ebeff3] pl-2 pt-1 pb-1 font-semibold">
            Remake Info
          </div>
          <div className="p-2">
            <Form.Item
              labelCol={{ flex: '200px' }}
              labelAlign="left"
              label="Product"
              name="product"
              className="mb-0"
            >
              <span className="">
                <Select
                  size="small"
                  options={remakeProductOptions}
                  onChange={handleSelectChange}
                  selected={remakeProductOptions.find(
                    (x) => x.value === inputData?.product
                  )}
                />
              </span>
            </Form.Item>
            {false &&
              <>
                <LabelItem
                  label="Requested By"
                  value={inputData?.createdBy}
                  leftAlign={true}
                />
                <LabelItem
                  label="Requested Date"
                  value={inputData?.createdAt}
                  type="Date"
                  leftAlign={true}
                />
              </>
            }

            <Form.Item
              labelCol={{ flex: '200px' }}
              labelAlign="left"
              label="Scheduled Date"
              name="scheduleDate"
              className="mb-0"
            >
              <span className="">
                <DatePicker
                  size="small"
                  onChange={handleDateChange}
                  value={dayjs(inputData?.scheduleDate)}
                  format="YYYY-MM-DD"
                />
              </span>
            </Form.Item>

            <Form.Item
              labelCol={{ flex: '200px' }}
              labelAlign="left"
              label="Department Responsible"
              name="departmentResponsible"
              className="mb-0"
            >
              <span className="">
                <Select
                  size="small"
                  value={inputData?.departmentResponsible}
                  options={departmentResponsibleOptions}
                  onChange={(val) => handleSelectChange(val, "departmentResponsible")}
                />
              </span>
            </Form.Item>

            {remakeDepartmentResponsibleSectionOptions?.length > 0 &&
              <Form.Item
                labelCol={{ flex: '200px' }}
                labelAlign="left"
                label="Section Responsible"
                name="departmentResponsibleSection"
                className="mb-0"
              >
                <span className="">
                  <Select
                    size="small"
                    value={inputData?.departmentResponsibleSection}
                    options={remakeDepartmentResponsibleSectionOptions}
                    onChange={(val) => handleSelectChange(val, "departmentResponsibleSection")}
                  />
                </span>
              </Form.Item>
            }
            <div className="mt-2">Reason:</div>
            <Space.Compact style={{ width: '100%' }} className="flex">
              <div className="flex-1">
                <Form.Item
                  labelAlign="left"
                  label=""
                  name="reasonCategory"
                  className="mb-0"
                >
                  <Select
                    size="small"
                    options={reasonCategoryOptions}
                    value={inputData?.reasonCategory}
                    style={{ flex: 1 }}
                    onChange={(val) => handleSelectChange(val, "reasonCategory")}
                  />
                </Form.Item>
              </div>
              <div className="flex-1">
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
                    style={{ flex: 1 }}
                    onChange={(val) => handleSelectChange(val, "reason")}
                  />
                </Form.Item>
              </div>
              <div className="flex-1">
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
                    style={{ flex: 1 }}
                    onChange={(val) => handleSelectChange(val, "reasonDetail")}
                  />
                </Form.Item>
              </div>
            </Space.Compact>
            <TextAreaItem
              id={"Notes"}
              label={<span style={{ fontWeight: 400 }}>Notes</span>}
              name={"notes"}
              value={inputData?.notes}
              rows={6}
              onChange={handleInputChange}
              changeItems={remakeChangeItems}
            />
          </div>
        </section>
      </div>

      <ActionModal
        title={"Add / Update Documents"}
        open={showAttachments}
        showCancel={false}
        onCancel={() => {
          setShowAttachments(false);
          setContainsNewUnsavedFiles(false);
          setFileData([]);
        }}
        onOk={handleDocumentsOk}
        okDisabled={!containsNewUnsavedFiles}
        cancelLabel={"Cancel"}
        popConfirmOkTitle={"Save Documents Confirmation"}
        popConfirmOkDescription={"Do you want to proceed with the update?"}
        popConfirmCancelTitle={"Close Documents"}
        popConfirnCancelDescription={
          <div>
            <div>Unsaved changes will be lost.</div>
            <div>Proceed anyway?</div>
          </div>
        }
      >
        {/*
          Document Upload
          documents={attachments}
          setContainsNewUnsavedFiles={setContainsNewUnsavedFiles}
          fileData={fileData}
          setFileData={setFileData}
          isNew={false}
        */}
      </ActionModal>

      <ConfirmationModal
        title={`Delete Confirmation`}
        open={showDeleteFiles}
        onOk={() => deleteCheckedFiles()}
        onCancel={() => setShowDeleteFiles(false)}
        okDisabled={!documents.find((x) => x.checked)}
        cancelLabel={"Cancel"}
        okLabel={"Ok"}
      >
        <div className="pt-2">
          <div>The following documents will be permanently deleted:</div>
          <div className="pt-2 pl-4">
            {documents?.map((td) =>
              td.checked ? <div key={td.name}>- {td.name}</div> : null
            )}
          </div>
        </div>
      </ConfirmationModal>
    </Form>
  );
}
