"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import {
  fetchRemakeWorkOrderById,
  updateRemakeWorkOrder,
} from "app/api/remakeApis";
import { useQuery } from "react-query";

import { Button, Popconfirm, Spin } from "antd";
import { ProductionRemakeOptions, RemakeRowStates } from "app/utils/constants";

import LockButton from "app/components/atoms/lockButton/lockButton";
import { mapRemakeRowStateToKey, openBlob, openWOLink } from "app/utils/utils";
import OrderModalHeader from "app/components/remake/orderModalHeader";
import Group from "app/components/atoms/workorderComponents/group";
import SelectItem from "app/components/atoms/workorderComponents/selectItem";
import DateItem from "app/components/atoms/workorderComponents/dateItem";
import TextAreaItem from "app/components/atoms/workorderComponents/textareaItem";
import Document from "app/components/atoms/document/document";
import LabelItem from "app/components/atoms/workorderComponents/labelItem";

import Divider from "app/components/remake/divider";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { LoadingOutlined } from "@ant-design/icons";
import {
  deleteAttachments,
  fetchAttachments,
  saveAttachment,
} from "app/api/genericApis/attachmentsApi";
import ActionModal from "app/components/atoms/actionModal/actionModal";
import DocumentUploadNew from "app/components/organisms/documentUpload/documentUploadNew";
import { saveAs } from "file-saver";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";

export default function EditRemakeOrder(props) {
  const { orderId, onClose, onShareLinkClick } = props;
  const moduleName = "remake";
  const { isMobile } = useSelector((state) => state.app);
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
    data: remake,
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
    if (remake) setInputData(remake);
  }, [remake]);

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

  const remakeDepartmentResponsibleOptions = ProductionRemakeOptions.find(
    (x) => x.key === "departmentResponsible"
  )?.options;

  const remakeReasonCategoryOptions = ProductionRemakeOptions.find(
    (x) => x.key === "reasonCategory"
  )?.options;

  const remakeDepartmentResponsibleSectionOptions =
    ProductionRemakeOptions.find(
      (x) => x.key === "departmentResponsible"
    )?.options?.find(
      (x) => x.value === inputData?.departmentResponsible
    )?.options;

  const remakeReasonOptions = ProductionRemakeOptions?.find(
    (x) => x.key === "reasonCategory"
  )?.options?.find((x) => x.value === inputData?.reasonCategory)?.options;

  const remakeReasonDetailOptions = ProductionRemakeOptions?.find(
    (x) => x.key === "reasonCategory"
  )
    ?.options?.find((x) => x.value === inputData?.reasonCategory)
    ?.options?.find((x) => x.value === inputData?.reason)?.options;

  // onClick events

  const handleInputChange = useCallback(
    (e, type = null) => {
      if (!e?.target) return;

      const name = e.target.name;

      setInputData((d) => {
        let _d = { ...d };
        let changeItem = {};

        let originalData = remake;

        if (originalData[name] !== e.target.value) {
          changeItem = {
            key: name,
            value: e.target.value,
          };
          addRemakeChangeItem(changeItem);
        } else {
          removeRemakeChangeItem({ key: name });
        }

        _d[name] = e.target.value;

        return _d;
      });
    },
    [remake]
  );

  const handleSelectChange = (val, key, id) => {
    if (val && key && id) {
      setInputData((i) => {
        let _i = { ...i };
        _i[id] = id !== "branch" ? val : key;
        return _i;
      });

      let changeItem = {
        key: id,
        value: val,
      };

      let originalData = remake;

      if (originalData[id] !== val) {
        addRemakeChangeItem(changeItem); // Only add if value is different
      } else {
        removeRemakeChangeItem(changeItem); // Remove if value went back to the original one
      }
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
    if (remake) {
      setIsSaving(true);
      let data = [];

      let remakeUpdates = JSON.parse(JSON.stringify(remake));

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
  }, [remake, remakeChangeItems, refetchOrder]);

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
    <div style={{ minWidth: "50vw" }}>
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

      <Divider />

      <div
        className="pt-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          columnGap: "0.75rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr 1fr",
          }}
        >
          <Group
            title={"Production Item"}
            style={{ minWidth: "21rem" }}
            contentStyle={{
              padding: "0.5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: "0.3rem",
            }}
          >
            <LabelItem
              label={"WO No."}
              value={inputData?.workOrderNo}
              leftAlign={true}
              isValueBold={true}
              style={{ color: "var(--centrablue)" }}
              onClick={openWOLinkCallback}
            />

            <LabelItem
              label={"Item No."}
              value={inputData?.itemNo}
              emphasizeValue={true}
              leftAlign={true}
              isValueBold={true}
            />
            <LabelItem
              label={"Branch"}
              value={inputData?.branch}
              leftAlign={true}
            />
            <LabelItem
              label={"System"}
              value={inputData?.systemValue}
              leftAlign={true}
            />
            <LabelItem
              label={"Size"}
              value={inputData?.size}
              leftAlign={true}
            />
            <LabelItem
              label={"Sub Quantity"}
              value={inputData?.subQty}
              leftAlign={true}
            />
            <LabelItem
              label={"Description"}
              value={inputData?.description}
              leftAlign={true}
            />
          </Group>
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
                  ? () => {}
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
                    <Document
                      file={d}
                      module={moduleName}
                      key={`attachment-${index}`}
                      onPreview={handlePreviewFile}
                      onDownload={handleDownloadFile}
                      onCheck={handleCheckFile}
                    />
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
        </div>

        <Group
          title="Remake Info"
          style={{ minWidth: "21rem" }}
          contentStyle={{
            padding: "0.5rem",
            display: "grid",
            gridTemplateColumns: "0.75fr 1fr",
            rowGap: "0.3rem",
            columnGap: "0.5rem",
          }}
        >
          <SelectItem
            label="Product"
            name="product"
            selected={remakeProductOptions.find(
              (x) => x.value === inputData?.product
            )}
            options={remakeProductOptions}
            onChange={handleSelectChange}
            changeItems={remakeChangeItems}
          />
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

          <DateItem
            label="Schedule Date"
            name="scheduleDate"
            value={inputData?.scheduleDate}
            onChange={handleInputChange}
            changeItems={remakeChangeItems}
            style={{ color: "var(--centrablue)" }}
            leftAlign={true}
          />
          <SelectItem
            label="Department Responsible"
            name="departmentResponsible"
            selected={remakeDepartmentResponsibleOptions.find(
              (x) => x.value === inputData?.departmentResponsible
            )}
            options={remakeDepartmentResponsibleOptions}
            onChange={handleSelectChange}
            changeItems={remakeChangeItems}
          />
          <SelectItem
            label="Department Responsible Section"
            name="departmentResponsibleSection"
            disabled={
              !(
                inputData?.departmentResponsible &&
                remakeDepartmentResponsibleSectionOptions
              )
            }
            selected={remakeDepartmentResponsibleSectionOptions?.find(
              (x) => x.value === inputData?.departmentResponsibleSection
            )}
            options={remakeDepartmentResponsibleSectionOptions}
            onChange={handleSelectChange}
            changeItems={remakeChangeItems}
          />

          <SelectItem
            label="Reason Category"
            name="reasonCategory"
            selected={remakeReasonCategoryOptions.find(
              (x) => x.value === inputData?.reasonCategory
            )}
            options={remakeReasonCategoryOptions}
            onChange={handleSelectChange}
            changeItems={remakeChangeItems}
          />
          <SelectItem
            label="Reason"
            name="reason"
            disabled={!(inputData?.reasonCategory && remakeReasonOptions)}
            selected={remakeReasonOptions?.find(
              (x) => x.value === inputData?.reason
            )}
            options={remakeReasonOptions}
            onChange={handleSelectChange}
            changeItems={remakeChangeItems}
          />
          <SelectItem
            label="Reason Detail"
            name="reasonDetail"
            disabled={!(inputData?.reason && remakeReasonDetailOptions)}
            selected={remakeReasonDetailOptions?.find(
              (x) => x.value === inputData?.reasonDetail
            )}
            options={remakeReasonDetailOptions}
            onChange={handleSelectChange}
            changeItems={remakeChangeItems}
          />
          <TextAreaItem
            id={"Notes"}
            label={<span style={{ fontWeight: 400 }}>Notes</span>}
            name={"notes"}
            value={inputData?.notes}
            rows={6}
            onChange={handleInputChange}
            changeItems={remakeChangeItems}
          />
        </Group>
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
        <DocumentUploadNew
          documents={attachments}
          setContainsNewUnsavedFiles={setContainsNewUnsavedFiles}
          fileData={fileData}
          setFileData={setFileData}
          isNew={false}
        />
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
    </div>
  );
}
