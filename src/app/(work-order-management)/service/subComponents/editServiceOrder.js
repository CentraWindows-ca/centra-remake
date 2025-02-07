"use client";
import styles from "./createServiceOrder.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "react-query";
import { useInView, InView } from "react-intersection-observer";
import _ from "lodash";
import dayjs from "dayjs";

import { Button, Form } from "antd";
import Tooltip from "app/components/atoms/tooltip/tooltip";

import {
  ServiceStates,
  WorkOrderSelectOptions,
  FileTypes,
} from "app/utils/constants";

import {
  updateServiceWorkOrder,
  scheduleService,
  updateServiceWorkOrderState,
  fetchServiceWorkOrderByServiceId,
} from "app/api/serviceApis";
import { fetchNotes } from "app/api/genericApis/noteApi";
import { fetchCallLogs } from "app/api/genericApis/callLogApi";
import {
  fetchAttachments,
  saveAttachment,
  deleteAttachments,
} from "app/api/genericApis/attachmentsApi";
import { saveImages } from "app/api/genericApis/imagesApi";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import OrderHeaderCard from "app/components/atoms/orderHeaderCard";
import OrderStatus from "app/(work-order-management)/shared/orderStatus";

import TextAreaField from "app/components/atoms/formFields/textAreaField";
import ServiceCustomerInfo from "app/components/templates/serviceWorkorder/subComponents/serviceCustomerInfo";
import ServiceDocuments from "app/components/templates/serviceWorkorder/subComponents/serviceDocuments";
import ServiceInfo from "app/components/templates/serviceWorkorder/subComponents/serviceInfo";
import ServiceSchedule from "app/components/templates/serviceWorkorder/subComponents/serviceSchedule";
import ServiceNotes from "app/components/templates/serviceWorkorder/subComponents/serviceNotes";
import ServiceCallLogs from "app/components/templates/serviceWorkorder/subComponents/serviceCallLogs";
import ServicePhotos from "app/components/templates/serviceWorkorder/subComponents/servicePhotos";
import DocumentUploadNew from "app/components/organisms/documentUpload/documentUploadNew";

import ActionModal from "app/components/atoms/actionModal/actionModal";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";

import CloseButton from "app/components/atoms/closeButton";

import { mapServiceEventStateToKey, sortByColumnName } from "app/utils/utils";
import { convertToLocaleDateTime } from "app/utils/date";
import { customRequiredMark } from "app/components/atoms/formFields/customRequiredMark";

export default function EditServiceOrder(props) {
  const { onClose, orderId } = props;

  let statusOptions = Object.entries(ServiceStates).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color };
  });

  const moduleName = "service";
  const [form] = Form.useForm();
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [inputData, setInputData] = useState({});
  const [tempNotes, setTempNotes] = useState([]);
  const [tempCallLogs, setTempCallLogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [tempPhotos, setTempPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showDeletePhotos, setShowDeletePhotos] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sortNotesByDescending, setSortNotesByDescending] = useState(true);
  const [sortCallLogByDescending, setSortCallLogByDescending] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [containsNewUnsavedFiles, setContainsNewUnsavedFiles] = useState(false);
  const [containsNewUnsavedImages, setContainsNewUnsavedImages] =
    useState(false);

  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [fileData, setFileData] = useState([]);

  const [latitude, setLatitude] = useState(49.18103828678011); // Map defaults to Centra Langley
  const [longitude, setLongitude] = useState(-122.6618332736532);

  const [showNotes, setShowNotes] = useState(false);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [showPhotos, setShowPhotos] = useState(true);

  const [showMap, setShowMap] = useState(false);

  const [assignedTechnicians, setAssignedTechnicians] = useState([]);

  const [hasChanges, setHasChanges] = useState(false);

  const [initialValues, setInitialValues] = useState([]);

  const handleExpandCollapseCallback = useCallback((type) => {
    if (type) {
      switch (type) {
        case "notes":
          setShowNotes((x) => !x);
          break;
        case "callLogs":
          setShowCallLogs((x) => !x);
        case "photos":
          setShowPhotos((x) => !x);
        default:
          break;
      }
    }
  }, []);

  const handleScrollToView = (elName) => {
    if (elName) {
      switch (elName) {
        case "notes":
          setShowNotes(true);
          break;
        case "callLogs":
          setShowCallLogs(true);
          break;
        case "photos":
          setShowNotes(false);
          setShowCallLogs(false);
          //setShowPhotos(true);
          break;
      }

      let header = document.getElementById(`title-${elName}`);
      setTimeout(
        () => header.scrollIntoView({ top: 0, behavior: "smooth" }),
        400
      );
    }
  };

  const MapWithAMarker = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{ lat: latitude, lng: longitude }}
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    ))
  );

  const fetchOrderAsync = async () => {
    if (orderId) {
      const result = await fetchServiceWorkOrderByServiceId(orderId, false);
      return result.data;
    }
    return {};
  };

  const fetchNotesAsync = async () => {
    if (order) {
      const result = await fetchNotes(moduleName, order.id);
      return result.data;
    }
    return [];
  };

  const fetchCallLogsAsync = async () => {
    if (order) {
      const result = await fetchCallLogs(moduleName, order.id);
      return result.data;
    }
    return [];
  };

  const fetchFilesAsync = async () => {
    if (order) {
      const result = await fetchAttachments(moduleName, order.id);
      return result.data;
    }
    return [];
  };

  const {
    isLoading: isLoadingDetails,
    data: order,
    refetch: refetchOrder,
    isFetching: isFetchingDetails,
  } = useQuery([`${moduleName}OrderDetails`, orderId], fetchOrderAsync, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingNotes,
    data: notes,
    refetch: refetchNotes,
    isFetching: isFetchingNotes,
  } = useQuery([`${moduleName}Notes`, order], fetchNotesAsync, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingCallLogs,
    data: callLogs,
    refetch: refetchCallLogs,
    isFetching: isFetchingCallLogs,
  } = useQuery([`${moduleName}CallLogs`, order], fetchCallLogsAsync, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingFiles,
    data: files,
    refetch: refetchFiles,
    isFetching: isFetchingFiles,
  } = useQuery([`${moduleName}Documents`, order], fetchFilesAsync, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (form && order) {
      setInputData(order);
      setAssignedTechnicians(order.assignedTechnicians ?? []);

      let _d = _.cloneDeep(order);

      // handle some custom fields
      if (_d.serviceRequestDate) {
        _d.serviceRequestDate = dayjs(
          convertToLocaleDateTime(_d.serviceRequestDate)
        );
      }

      if (_d.createdAt) {
        _d.createdAt = dayjs(convertToLocaleDateTime(_d.createdAt));
      }

      if (_d.scheduleDate) {
        _d.scheduleDate = dayjs(convertToLocaleDateTime(_d.scheduleDate));
      }
      if (_d.scheduleEndDate) {
        _d.scheduleEndDate = dayjs(convertToLocaleDateTime(_d.scheduleEndDate));
      }

      if (order.originalWorkOrderDateType) {
        _d.originalWorkOrderDateType = order.originalWorkOrderDateType;
        _d.originalWorkOrderDate = dayjs(
          convertToLocaleDateTime(order.originalWorkOrderDate)
        );
      }

      form.setFieldsValue(_d);

      setInitialValues((prev) => {
        let _iVal = _.cloneDeep(_d);
        _iVal.assignedTechnicians = order.assignedTechnicians ?? [];
        return _iVal;
      });
    }
  }, [order, form]);

  useEffect(() => {
    if (notes)
      setTempNotes(sortByColumnName(notes, "notesDate", sortNotesByDescending));
  }, [notes, sortNotesByDescending]);

  useEffect(() => {
    if (callLogs)
      setTempCallLogs(
        sortByColumnName(callLogs, "calledDate", sortCallLogByDescending)
      );
  }, [callLogs, sortCallLogByDescending]);

  useEffect(() => {
    if (files) {
      setDocuments(files.filter((f) => f.fileType === FileTypes.file) ?? []);
      setPhotos(files.filter((f) => f.fileType === FileTypes.image) ?? []);
    }
  }, [files]);

  const setFieldsValue = (fieldName, value, append = false) => {
    const updateValue = (newValue) => {
      form.setFieldValue(fieldName, newValue);
      if (fieldName === "assignedTechnicians") {
        // Workaround to antd multiselect issue not getting set by form
        setAssignedTechnicians(newValue);

        // Trigger onValuesChange explicitly after updating form values
        const allValues = form.getFieldsValue();
        checkIfInitialValuesChanged({ [fieldName]: value }, allValues);
      }
    };

    if (append) {
      const currentValue = form.getFieldValue(fieldName);
      if (!currentValue.includes(value)) {
        const updatedValue = [...currentValue, value];
        updateValue(updatedValue);
      }
    } else {
      updateValue(value);
    }
  };

  const handleConfirmSave = useCallback(async () => {
    try {
      setIsSaving(true);
      setShowSaveConfirmation(false);

      if (!order) console.log("Data invalid.");

      let data = _.cloneDeep(form.getFieldsValue(true));
      console.log(data);

      data.id = order.id;

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

      await updateServiceWorkOrder(data);

      refetchOrder();
      setHasChanges(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }, [form, photos, documents, order, refetchOrder]);

  const handleSave = (e) => {
    if (e) {
      form
        .validateFields()
        .then((values) => {
          setShowSaveConfirmation(true);
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmation(false);
  };
  const handlePhotosOk = useCallback(async () => {
    if (tempPhotos) {
      const newPhotos = tempPhotos.map((d) => {
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
      await saveImages(moduleName, order.id, newPhotos);
      refetchFiles();

      setShowPhotoUpload(false);
      setTempPhotos([]);
    }
  }, [tempPhotos, order, refetchFiles]);

  const handlePhotosDelete = useCallback(async () => {
    if (selectedPhotos?.length > 0) {
      let idsToDelete = selectedPhotos.map((p) => {
        return p.id;
      });

      await deleteAttachments(moduleName, idsToDelete);
      refetchFiles();

      setShowDeletePhotos(false);
      setSelectedPhotos([]);
    }
  }, [selectedPhotos, refetchFiles]);

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
      await saveAttachment(moduleName, order.id, updatedDocuments);
      setFileData([]);
      refetchFiles();

      setShowDocumentUpload(false);
    }
  }, [fileData, order, refetchFiles]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  const updateStatus = async (statusKey, id, val) => {
    if (statusKey && id && statusOptions) {
      let _statusVal = statusOptions.find((x) => x.key === statusKey).value;

      if (_statusVal == ServiceStates.scheduled.label) {
        let data = {
          id: id,
          status: _statusVal,
          scheduleDate: val.scheduleDateSS,
          scheduleEndDate: val.scheduleEndDateSS,
          serviceAssignees: val.assignedTechniciansSS,
        };
        await scheduleService(_statusVal, id, data);
      } else {
        await updateServiceWorkOrderState(_statusVal, id);
      }
      refetchOrder();
    }
  };

  const checkIfInitialValuesChanged = (changedValues, allValues) => {
    const changedFields = Object.keys(changedValues);

    const _hasChanges = changedFields.some((field) => {
      if (field === "assignedTechnicians") {
        return !_.isEqual(
          changedValues.assignedTechnicians,
          initialValues.assignedTechnicians
        );
      } else {
        return allValues[field] !== initialValues[field];
      }
    });

    setHasChanges(_hasChanges);
  };

  return (
    <>
      <Form
        form={form}
        name="EditServiceForm"
        colon={false}
        labelWrap
        requiredMark={customRequiredMark}
        onValuesChange={checkIfInitialValuesChanged}
      >
        <div className={styles.workOrderOuterContainer}>
          <div className={styles.workOrderInnerContainer} ref={ref}>
            <OrderHeaderCard
              label={order ? `Service Order # ${order?.serviceId}` : ""}
            />
            <OrderStatus
              statusKey={mapServiceEventStateToKey(order?.status)}
              style={{ margin: "0 0.5rem 0 0.5rem" }}
              updateStatusCallback={updateStatus}
              handleStatusCancelCallback={() => {}}
              statusList={ServiceStates}
              orderId={order?.id}
              id={order?.serviceId}
            />
          </div>

          <CloseButton
            onClose={() => onClose()}
            title="Close Service"
            hasChanges={hasChanges}
          />
        </div>
        <div
          className={`${styles.infoBar} flex flex-col`}
          style={{ zIndex: 0 }}
        >
          <hr style={{ margin: "0 0 3px 0" }} />

          <div className={styles.customerInfoOuterContainer}>
            <div className={`${styles.tableButtonsOuterContainer} py-1`}>
              <div>
                <div
                  onClick={() => handleScrollToView("notes")}
                  className={`${styles.tableButton}`}
                >
                  Notes
                </div>
              </div>

              <div className="pl-3 pr-3">|</div>
              <div>
                <div
                  onClick={() => handleScrollToView("callLogs")}
                  className={`${styles.tableButton}`}
                >
                  Call Logs
                </div>
              </div>

              <div className="pl-3 pr-3">|</div>

              <div>
                <div
                  onClick={() => handleScrollToView("photos")}
                  className={`${styles.tableButton}`}
                >
                  Photo Gallery
                </div>
              </div>
            </div>
          </div>
          <hr style={{ margin: "3px 0 3px 0" }} />
        </div>
        <div
          className="flex w-full py-2 space-x-3 sticky"
          style={{ zIndex: 0, borderBottom: "1px dotted lightgrey" }}
        >
          <div className="flex w-full space-x-2 items-start">
            <TextAreaField
              id="summary"
              fieldName="summary"
              label="Summary"
              labelSpan={"auto"}
              inputSpan={"auto"}
              required
              borderless
              size="middle"
            />
            <Tooltip title={"Save Service"}>
              <Button
                type={"primary"}
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                loading={isSaving}
                size="middle"
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
            <InView
              as="div"
              onChange={(inView, entry) => setShowGoToTop(!inView)}
              className="flex"
            >
              <ServiceInfo
                setFieldsValue={setFieldsValue}
                WorkOrderSelectOptions={WorkOrderSelectOptions}
                inputData={inputData}
              />
            </InView>

            <div className="grid space-y-4">
              <ServiceCustomerInfo module={moduleName} inputData={inputData} />
              <ServiceSchedule
                setFieldsValue={setFieldsValue}
                assignedTechnicians={assignedTechnicians}
                disabled={
                  inputData?.status == ServiceStates.newDraft.label ||
                  inputData?.status == ServiceStates.confirmed.label ||
                  inputData?.status == ServiceStates.complete.label ||
                  inputData?.status == ServiceStates.cancelled.label ||
                  inputData?.status == ServiceStates.rejectedService.label
                }
              />
            </div>
            <div
              className="grid space-y-4"
              style={{ gridAutoRows: "minmax(0, 1fr)" }}
            >
              <ServiceDocuments
                module={moduleName}
                moduleId={inputData?.id}
                documents={documents}
                setDocuments={setDocuments}
                setShowAttachments={setShowDocumentUpload}
                setShowDeleteFiles={setShowDeleteFiles}
                isLoading={isFetchingFiles || isLoadingFiles}
              />
              <ServicePhotos
                inputData={inputData}
                photos={photos}
                tempPhotos={tempPhotos}
                setTempPhotos={setTempPhotos}
                showPhotos={showPhotos}
                handlePhotosOk={handlePhotosOk}
                handleExpandCollapseCallback={handleExpandCollapseCallback}
                containsNewUnsavedImages={containsNewUnsavedImages}
                setContainsNewUnsavedImages={setContainsNewUnsavedImages}
                showPhotoUpload={showPhotoUpload}
                setShowPhotoUpload={setShowPhotoUpload}
                handlePhotosDelete={handlePhotosDelete}
                showDeletePhotos={showDeletePhotos}
                setShowDeletePhotos={setShowDeletePhotos}
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
                isLoading={isFetchingFiles || isLoadingFiles}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="col-span-1">
              <ServiceNotes
                moduleId={order?.id}
                showNotes={showNotes}
                onExpandCollapse={handleExpandCollapseCallback}
              />
            </div>
            <div className="col-span-1">
              <ServiceCallLogs
                moduleId={order?.id}
                showCallLogs={showCallLogs}
                onExpandCollapse={handleExpandCollapseCallback}
              />
            </div>
          </div>

          {showGoToTop && (
            <div style={{ position: "absolute", bottom: 10, right: 10 }}>
              <i
                className={`bi bi-arrow-up-circle-fill ${styles.goToTopIcon}`}
                onClick={() => handleScrollToView("topmost")}
              ></i>
            </div>
          )}
        </div>
        {/* <div className="flex items-start justify-end space-x-2 pt-3 sticky">
          <Button onClick={() => onClose()}>
            <span>Cancel</span>
          </Button>

          <Tooltip title={"Save Service"}>
            <Button
              type={"primary"}
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
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
          title={`Update Confirmation`}
          open={showSaveConfirmation}
          onOk={handleConfirmSave}
          onCancel={handleCancelSave}
          cancelLabel={"No"}
          okLabel={"Yes"}
        >
          <div className="pt-2">
            <div>Are you sure you want to update this service?</div>
          </div>
        </ConfirmationModal>
      </Form>
    </>
  );
}
