"use client";
import styles from "./createServiceOrder.module.css";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { Button, Form } from "antd";
import Tooltip from "app/components/atoms/tooltip/tooltip";

import { ServiceStates, WorkOrderSelectOptions } from "app/utils/constants";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";

import ServiceDocuments from "app/components/templates/serviceWorkorder/subComponents/serviceDocuments";
import ActionModal from "app/components/atoms/actionModal/actionModal";
import ServiceInfo from "app/components/templates/serviceWorkorder/subComponents/serviceInfo";
import ServiceSchedule from "app/components/templates/serviceWorkorder/subComponents/serviceSchedule";
import ServicePhotos from "app/components/templates/serviceWorkorder/subComponents/servicePhotos";

import { addServiceWorkOrder } from "app/api/serviceApis";
import DocumentUploadNew from "app/components/organisms/documentUpload/documentUploadNew";

import ServiceCustomerInfo from "app/components/templates/serviceWorkorder/subComponents/serviceCustomerInfo";
import OrderHeaderCard from "app/components/atoms/orderHeaderCard";
import CloseButton from "app/components/atoms/closeButton";
import TextField from "app/components/atoms/formFields/textField";
import OrderStatus from "app/(work-order-management)/shared/orderStatus";
import { customRequiredMark } from "app/components/atoms/formFields/customRequiredMark";

export default function CreateServiceOrder(props) {
  const router = useRouter();

  const { onClose } = props;

  let statusOptions = Object.entries(ServiceStates).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color };
  });

  const moduleName = "service";
  const [form] = Form.useForm();

  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [tempPhotos, setTempPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showDeletePhotos, setShowDeletePhotos] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [containsNewUnsavedFiles, setContainsNewUnsavedFiles] = useState(false);
  const [containsNewUnsavedImages, setContainsNewUnsavedImages] =
    useState(false);

  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [fileData, setFileData] = useState([]);

  const updateFieldValue = (field, val) => {
    form.setFieldValue(field, val);
  };

  const handleConfirmSaveClick = useCallback(async () => {
    try {
      setIsSaving(true);
      setShowCreateConfirmation(false);

      let data = JSON.parse(JSON.stringify(form.getFieldsValue(true)));

      data.id = uuidv4();
      data.status = ServiceStates.newDraft.label;

      let attachments = [];

      if (photos.length > 0) {
        photos.forEach((photo) => {
          attachments.push(photo);
        });
      }

      if (documents.length > 0) {
        documents.forEach((document) => {
          attachments.push(document);
        });
      }

      if (attachments.length > 0) data.serviceFiles = attachments;

      await addServiceWorkOrder(data);

      onClose(true);
      form.resetFields();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }, [form, onClose, photos, documents]);

  const handleSaveClick = (e) => {
    if (e) {
      form
        .validateFields()
        .then((values) => {
          setShowCreateConfirmation(true);
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    }
  };

  const handleCancelSave = () => {
    setShowCreateConfirmation(false);
  };

  const handlePhotosOk = useCallback(async () => {
    if (tempPhotos) {
      const newPhotos = tempPhotos.map((d) => {
        if (d?.base64?.length > 0) {
          return {
            id: uuidv4(),
            name: d.name,
            base64: d.base64.split(",")[1],
            mimeType: d.type,
            size: d.size,
            note: d.fileNotes,
            fileType: "img",
            fileNotes: d.fileNotes,
          };
        }
      });

      setPhotos(newPhotos);

      setShowPhotoUpload(false);
      setTempPhotos([]);
    }
  }, [tempPhotos]);

  const handlePhotosDelete = useCallback(async () => {
    if (selectedPhotos?.length > 0) {
      let idsToDelete = selectedPhotos.map((p) => {
        return p.id;
      });

      setShowDeletePhotos(false);
      setSelectedPhotos([]);
    }
  }, [selectedPhotos]);

  const deleteCheckedFiles = useCallback(async () => {
    let checkedDocs = documents.filter((d) => d.checked);

    if (checkedDocs?.length > 0) {
      let idsToDelete = checkedDocs.map((d) => {
        return d.id;
      });

      setDocuments((prevDocs) => {
        let _filteredDocs = prevDocs.filter((p) => !idsToDelete.includes(p.id));

        _filteredDocs.forEach((d) => {
          d.checked = false;
        });

        return _filteredDocs;
      });

      setShowDeleteFiles(false);
    }
  }, [documents]);

  const handleDocumentsOk = useCallback(async () => {
    if (fileData) {
      const newDocs = fileData.map((d) => {
        if (d?.base64?.length > 0) {
          return {
            id: uuidv4(),
            name: d.name,
            base64: d.base64.split(",")[1],
            mimeType: d.type,
            size: d.size,
            note: d.fileNotes,
            fileType: "file",
            fileNotes: d.fileNotes,
          };
        }
      });
      setDocuments(newDocs);
      setShowDocumentUpload(false);
    }
  }, [fileData]);

  return (
    <>
      <Form
        form={form}
        name="CreateServiceForm"
        colon={false}
        labelWrap
        requiredMark={customRequiredMark}
      >
        <div className={styles.workOrderOuterContainer}>
          <div className={styles.workOrderInnerContainer}>
            <OrderHeaderCard label="Create Service" />
            <OrderStatus
              statusKey={statusOptions[0].key}
              style={{ margin: "0 0.5rem 0 0.5rem" }}
              statusList={ServiceStates}
              viewMode={true}
            />
          </div>

          <CloseButton
            onClose={() => onClose()}
            title="Cancel Create Service"
          />
        </div>
        <div
          className="flex w-full pb-2 space-x-3 sticky"
          style={{ zIndex: 0, borderBottom: "1px dotted lightgrey" }}
        >
          <div className="flex w-full space-x-2">
            <TextField
              id="summary"
              fieldName="summary"
              label="Summary"
              labelSpan={"auto"}
              inputSpan={"auto"}
              required
              borderless
              size="middle"
            />
            <Tooltip title={"Create Service"}>
              <Button
                type={"primary"}
                onClick={handleSaveClick}
                disabled={isSaving}
                loading={isSaving}
              >
                <span>Save</span>
              </Button>
            </Tooltip>
          </div>
        </div>
        <div
          className={styles.container}
          style={{ ...props.style }}
          id={"title-main"}
        >
          <div className={styles.grid}>
            <ServiceInfo
              setFieldsValue={updateFieldValue}
              WorkOrderSelectOptions={WorkOrderSelectOptions}
              isNew
            />

            <div className="grid space-y-4">
              <ServiceCustomerInfo module={moduleName} />
              <ServiceSchedule disabled />
            </div>
            <div
              className="grid space-y-4"
              style={{ gridAutoRows: "minmax(0, 1fr)" }}
            >
              <ServiceDocuments
                module={moduleName}
                documents={documents}
                setDocuments={setDocuments}
                setShowAttachments={setShowDocumentUpload}
                setShowDeleteFiles={setShowDeleteFiles}
              />
              <ServicePhotos
                photos={photos}
                tempPhotos={tempPhotos}
                setTempPhotos={setTempPhotos}
                handlePhotosOk={handlePhotosOk}
                containsNewUnsavedImages={containsNewUnsavedImages}
                setContainsNewUnsavedImages={setContainsNewUnsavedImages}
                showPhotoUpload={showPhotoUpload}
                setShowPhotoUpload={setShowPhotoUpload}
                handlePhotosDelete={handlePhotosDelete}
                showDeletePhotos={showDeletePhotos}
                setShowDeletePhotos={setShowDeletePhotos}
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
              />
            </div>
          </div>
        </div>
        {/* <div className="flex items-start justify-end space-x-2 pt-3 sticky">
          <Button onClick={() => onClose()}>
            <span>Cancel</span>
          </Button>

          <Tooltip title={"Create Service"}>
            <Button
              type={"primary"}
              onClick={handleSaveClick}
              disabled={isSaving}
              loading={isSaving}
            >
              <span>Save</span>
            </Button>
          </Tooltip>
        </div> */}

        <ActionModal
          title={"Add / Update Documents"}
          open={showDocumentUpload}
          showCancel={false}
          onCancel={() => {
            setShowDocumentUpload(false);
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
            documents={documents}
            setContainsNewUnsavedFiles={setContainsNewUnsavedFiles}
            fileData={fileData}
            setFileData={setFileData}
            isNew={false}
          />
        </ActionModal>

        <ConfirmationModal
          title={`Create Confirmation`}
          open={showCreateConfirmation}
          onOk={handleConfirmSaveClick}
          onCancel={handleCancelSave}
          cancelLabel={"No"}
          okLabel={"Yes"}
        >
          <div className="pt-2">
            <div>Are you sure you want to create this work order?</div>
          </div>
        </ConfirmationModal>
      </Form>
    </>
  );
}
