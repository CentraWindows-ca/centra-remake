"use client";
import styles from "./serviceWorkorder.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useInView, InView } from "react-intersection-observer";
import {
  ServiceStates,
  WorkOrderSelectOptions,
  Pages,
  FileTypes,
} from "app/utils/constants";
import { scrollToElement, mapServiceEventStateToKey } from "app/utils/utils";
import moment from "moment";
import {
  fetchServiceWorkOrderById,
  updateServiceWorkOrder,
  updateServiceWorkOrderState,
} from "app/api/serviceApis";

import {
  fetchAttachments,
  saveAttachment,
  deleteAttachments,
} from "app/api/genericApis/attachmentsApi";
import { saveImages } from "app/api/genericApis/imagesApi";
import DocumentUpload from "app/components/organisms/documentUpload/documentUpload";
import { useQuery } from "react-query";
import LockButton from "app/components/atoms/lockButton/lockButton";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Geocode from "react-geocode";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { LocationIcon } from "app/utils/icons";

import ServiceInfo from "./subComponents/serviceInfo";
import ServiceSchedule from "./subComponents/serviceSchedule";
import ServiceSummary from "./subComponents/serviceSummary";
import ServiceNotes from "./subComponents/serviceNotes";
import ServiceCallLogs from "./subComponents/serviceCallLogs";
import ServicePhotos from "./subComponents/servicePhotos";
import ServiceDocuments from "./subComponents/serviceDocuments";
import WOStatus from "app/components/organisms/woStatus/woStatus";

import ActionModal from "app/components/atoms/actionModal/actionModal";
import { Popconfirm } from "antd";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

export default function ServiceWorkOrder(props) {
  const router = useRouter();

  const { onChange, onCloseCallback } = props;

  const {
    department,
    tempFiles,
    workOrderData: workOrderDataFromParent,
  } = useSelector((state) => state.calendar);

  const { isReadOnly } = useSelector((state) => state.app);

  let statusOptions = Object.entries(ServiceStates).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color };
  });

  const moduleName = "service";
  const [fetchWorkOrder, setFetchWorkOrder] = useState(false);

  const [getFiles, setGetFiles] = useState(true);
  const [statusKey, setStatusKey] = useState(null);
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [latitude, setLatitude] = useState(49.18103828678011); // Map defaults to Centra Langley
  const [longitude, setLongitude] = useState(-122.6618332736532);
  const [inputData, setInputData] = useState({});
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [showPhotos, setShowPhotos] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tempPhotos, setTempPhotos] = useState([]);
  const [showDeletePhotos, setShowDeletePhotos] = useState(false);
  const [serviceChangeItems, setServiceChangeItems] = useState([]);
  const [dateChangeItems, setDateChangeItems] = useState([]);
  const [containsNewUnsavedFiles, setContainsNewUnsavedFiles] = useState(false);
  const [containsNewUnsavedImages, setContainsNewUnsavedImages] =
    useState(false);

  const [showMap, setShowMap] = useState(false);

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const {
    isFetching,
    data: workOrder,
    refetch,
  } = useQuery(
    "workorder",
    () => {
      if (workOrderDataFromParent?.id) {
        setFetchWorkOrder(false);
        return fetchServiceWorkOrderById(workOrderDataFromParent.id, false);
      }
    },
    { enabled: fetchWorkOrder }
  );

  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  useEffect(() => {
    triggerFetchWorkOrder();
  }, [workOrderDataFromParent]);

  const fetchAttachmentsAsync = async () => {
    if (workOrderDataFromParent?.id) {
      setGetFiles(false);

      const result = await fetchAttachments(
        moduleName,
        workOrderDataFromParent.id
      );
      return result.data;
    }
  };

  const {
    isLoading: isLoadingFiles,
    data: files,
    isFetching: isFetchingFiles,
    refetch: refetchFiles,
  } = useQuery("serviceFiles", fetchAttachmentsAsync, {
    refetchOnWindowFocus: false,
  });

  const hasChanges = [...serviceChangeItems, ...dateChangeItems]?.length > 0;

  useEffect(() => {
    if (files) {
      setDocuments(files.filter((f) => f.fileType === FileTypes.file) ?? []);
      setPhotos(files.filter((f) => f.fileType === FileTypes.image) ?? []);
    }
  }, [files]);

  useEffect(() => {
    if (workOrder?.data) {
      setInputData({ ...workOrder.data });
    }
  }, [workOrder]);

  useEffect(() => {
    if (showNotes) {
      scrollToElement(`title-notes`);
    }
  }, [showNotes]);

  useEffect(() => {
    if (showCallLogs) {
      scrollToElement(`title-callLogs`);
    }
  }, [showCallLogs]);

  const triggerFetchWorkOrder = () => {
    setFetchWorkOrder(true);
  };

  const isLoading = isFetching || isLoadingFiles || isFetchingFiles;

  const resetWorkOrderState = () => {
    setDocuments([]);
    setPhotos([]);
    setInputData({});
  };

  const handleCloseWorkOrder = useCallback(() => {
    if (!saveDisabled) {
      setShowExitConfirmation(true);
    } else {
      console.log("Closing...");
      resetWorkOrderState();
      onCloseCallback();
    }
  }, [saveDisabled, onCloseCallback]);

  const addServiceChangeItem = (changeItem) => {
    if (changeItem) {
      setServiceChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) _ci[index].value = changeItem.value;
        else _ci.push(changeItem);

        return _ci;
      });
    }
  };

  const removeServiceChangeItem = (changeItem) => {
    if (changeItem) {
      setServiceChangeItems((ci) => {
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

  const addDateChangeItem = (changeItem) => {
    if (changeItem) {
      setDateChangeItems((ci) => {
        let _ci = [...ci];
        let index = _ci.findIndex((x) => x.key === changeItem.key);

        if (index > -1) _ci[index].value = changeItem.value;
        else _ci.push(changeItem); // Add to update list

        return _ci;
      });
    }
  };

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

      let originalData = workOrder?.data;

      if (originalData[id] !== val) {
        addServiceChangeItem(changeItem);
      } else {
        removeServiceChangeItem(changeItem);
      }
    }
  };

  const handleInputChange = useCallback(
    (e, type = null) => {
      if (!e?.target) return;

      const startDateName = "scheduleDate";
      const endDateName = "scheduleEndDate";
      const name = e.target.name;

      setInputData((d) => {
        let _d = { ...d };
        let changeItem = {};

        if (name === startDateName || name === endDateName) {
          let dateKey = name === startDateName ? startDateName : endDateName;

          let newDateStr = {};
          let newDate = moment(_d[dateKey]);

          switch (type) {
            case "date":
              const newDateValue = moment(e.target.value);
              newDate.set({
                year: newDateValue.year(),
                month: newDateValue.month(),
                date: newDateValue.date(),
              });
              break;
            case "time":
              const newTime = moment(e.target.value, "HH:mm");
              newDate.set({
                hour: newTime.hour(),
                minute: newTime.minute(),
                second: newTime.second(),
              });
              break;
          }

          newDateStr = newDate.format();
          _d[dateKey] = newDateStr;

          changeItem = {
            key: dateKey,
            value: newDateStr,
          };

          // If the updated date is the start date, update the end date if necessary
          if (dateKey === startDateName) {
            const endDate = moment(_d[endDateName]);
            if (endDate.isBefore(newDate)) {
              endDate.set({
                year: newDate.year(),
                month: newDate.month(),
                date: newDate.date(),
                hour: newDate.hour(),
                minute: newDate.minute(),
              });

              const newEndDateStr = endDate.format();
              _d[endDateName] = newEndDateStr;

              let changeEndSchedItem = {
                key: endDateName,
                value: newEndDateStr,
              };

              addDateChangeItem(changeEndSchedItem);
            }
          }
        } else {
          // Handle other input changes
          let originalData = workOrder?.data;

          if (originalData[name] !== e.target.value) {
            changeItem = {
              key: name,
              value: e.target.value,
            };
            addOrderChangeItem(changeItem); // Only add if value is different
          } else {
            // If the value went back to the original one, remove the change item
            removeOrderChangeItem({ key: name });
          }
        }

        addDateChangeItem(changeItem); // For start and end date changes

        return _d;
      });
    },
    [workOrder]
  );

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

  const handleDocumentsOk = useCallback(async () => {
    setShowDocumentUpload(false);

    if (tempFiles) {
      const updatedDocuments = tempFiles.map((d) => {
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
      await saveAttachment(
        moduleName,
        workOrderDataFromParent?.id,
        updatedDocuments
      );
      refetchFiles();
    }
  }, [tempFiles, workOrderDataFromParent, refetchFiles]);

  const deleteCheckedFiles = useCallback(async () => {
    let checkedDocs = documents.filter((d) => d.checked);

    if (checkedDocs?.length > 0) {
      let idsToDelete = checkedDocs.map((d) => {
        return d.id;
      });

      await deleteAttachments(moduleName, idsToDelete);
      refetchFiles();
      setShowDeleteFiles(false);
    }
  }, [documents, refetchFiles]);

  const handlePhotosOk = useCallback(async () => {
    setShowPhotoUpload(false);

    if (tempPhotos) {
      const uploadImages = tempPhotos.map((d) => {
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
      await saveImages(moduleName, workOrderDataFromParent?.id, uploadImages);
      refetchFiles();
    }

    setTempPhotos([]);
  }, [tempPhotos, workOrderDataFromParent, refetchFiles]);

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

  useEffect(() => {
    if (inputData.address && Geocode && showMap) {
      Geocode.setLocationType("ROOFTOP");
      Geocode.setLanguage("en");
      Geocode.setApiKey("AIzaSyAhsQnBPh07vYae9Oakwczkyv8gTDY9j-U");

      Geocode.fromAddress(inputData?.address).then(
        (response) => {
          const { lat, lng } = response?.results[0]?.geometry?.location;
          setLatitude(lat);
          setLongitude(lng);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [inputData.address, showMap]);

  const handleSave = (e) => {
    if (e) {
      setShowSaveConfirmation(true);
    }
  };

  const handleSaveYes = useCallback(async () => {
    if (workOrder?.data) {
      let data = JSON.parse(JSON.stringify(workOrder?.data));

      if (serviceChangeItems.length > 0) {
        serviceChangeItems.map((ci) => {
          var newVal = {};
          if (ci.key === "branch") {
            newVal = {
              title: WorkOrderSelectOptions.branches.find(
                (x) => x.key === ci.value
              )?.value,
              value: ci.value,
            };
          } else {
            newVal = ci.value;
          }
          data[ci.key] = newVal;
        });
      }

      if (dateChangeItems.length > 0) {
        dateChangeItems.map((dc) => {
          data[dc.key] = dc.value;
        });
      }

      await updateServiceWorkOrder(data);
      setShowSaveConfirmation(false);
      triggerFetchWorkOrder();
      setDateChangeItems([]);
      setServiceChangeItems([]);
    }
  }, [workOrder, serviceChangeItems, dateChangeItems]);

  const handleSaveNo = () => {
    setShowSaveConfirmation(false);
  };

  const updateStatus = useCallback(
    async (statusKey) => {
      if (statusKey && workOrder) {
        await updateServiceWorkOrderState(
          statusOptions.find((x) => x.key === statusKey).value,
          workOrder?.data?.id
        );
        triggerFetchWorkOrder();
      }
    },
    [workOrder, statusOptions]
  );

  return (
    <>
      <Backdrop
        open={isFetching}
        style={{ zIndex: "2", position: "absolute", color: "#FFF" }}
      >
        <div>
          <div style={{ textAlign: "center" }}>
            <CircularProgress color="inherit" />
          </div>
        </div>
      </Backdrop>
      <div className={styles.workOrderOuterContainer} style={{ zIndex: 0 }}>
        <div className={styles.workOrderInnerContainer} ref={ref}>
          <div className={styles.workOrderText}>
            <span>{department?.value} Work Order #</span>
            <span className={styles.workOrderValue}>
              {workOrder?.data?.serviceOrderNumber}
            </span>
            <WOStatus
              statusKey={mapServiceEventStateToKey(workOrder?.data?.status)}
              setStatusKeyCallback={setStatusKey}
              style={{ margin: "0 0.5rem 0 0.5rem" }}
              updateStatusCallback={updateStatus}
              handleStatusCancelCallback={() => {}}
              statusList={ServiceStates}
            />
          </div>
          {workOrder?.data?.siteContact && (
            <div
              className={styles.siteContactContainer}
              style={{ paddingLeft: "1rem", paddingTop: "3px" }}
            >
              <div
                className={styles.customerInfoIcon}
                style={{ paddingTop: "3px" }}
              >
                <i className="bi bi-telephone-outbound"></i>
              </div>
              <div className={`${styles.siteContactText} pr-2`}>
                {workOrder?.data?.siteContact}
              </div>
            </div>
          )}
          {/* <div className="pl-2 pt-1 cursor-pointer text-blue-800 hover:text-blue-500">
                        <Tooltip title="Communication History">
                            <i className="bi bi-chat-left-text mr-2"></i>
                        </Tooltip>
                    </div> */}
        </div>

        <div style={{ paddingBottom: "6px" }} className="flex flex-row">
          <Tooltip title={"Close"}>
            {hasChanges && (
              <Popconfirm
                placement="left"
                title={"Close Work Order"}
                description={
                  <div className="pt-2">
                    <div>
                      Once you close this workorder all your pending changes
                      will be lost.{" "}
                    </div>
                    <div>Proceed anyway?</div>
                  </div>
                }
                onConfirm={(e) => {
                  handleCloseWorkOrder(e, router, Pages.month);
                }}
                okText="Ok"
                cancelText="Cancel"
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size="xl"
                  className="text-slate-500 cursor-pointer"
                />
              </Popconfirm>
            )}
            {!hasChanges && (
              <FontAwesomeIcon
                icon={faXmark}
                size="xl"
                className="text-slate-500 cursor-pointer"
                onClick={(e) => {
                  handleCloseWorkOrder(e, router, Pages.month);
                }}
              />
            )}
          </Tooltip>
        </div>
      </div>
      <div className={styles.infoBar} style={{ zIndex: 0 }}>
        <hr style={{ margin: "0 0 3px 0" }} />
        <div style={{ backgroundColor: "#F5F5F5", paddingLeft: "6px" }}>
          <div style={{ display: "inline", fontWeight: 600 }}>
            {workOrder?.data?.custName.toUpperCase()}
          </div>
          {workOrder?.data?.projectName && (
            <div
              style={{
                padding: "0 0.5rem",
                color: "#0062A8",
                display: "inline",
              }}
            >
              |
            </div>
          )}
        </div>
        <div className={styles.customerInfoOuterContainer}>
          {workOrder?.data && (
            <div className={styles.customerInfoInnerContainer}>
              {workOrder?.data?.address && (
                <div>
                  <div
                    className={styles.customerInfoIcon}
                    style={{ display: "inline" }}
                  >
                    <i className="bi bi-house" />
                  </div>
                  <div className={styles.address}>
                    {workOrder.data.address}
                    <span
                      className={`${styles.mapIcon}`}
                      onClick={() => {
                        setShowMap(true);
                      }}
                    >
                      <Tooltip title="Show Map">
                        <LocationIcon />
                      </Tooltip>
                    </span>
                  </div>
                </div>
              )}
              {workOrder?.data?.homePhone && (
                <div style={{ paddingRight: "0.7rem" }}>
                  <div
                    className={styles.customerInfoIcon}
                    style={{ display: "inline" }}
                  >
                    <i className="bi bi-telephone"></i>
                  </div>
                  <a href={`tel:${workOrder.data.homePhone}`}>
                    {workOrder.data.homePhone}
                  </a>
                </div>
              )}
              {workOrder?.data?.cellPhone && (
                <div style={{ paddingRight: "0.7rem" }}>
                  <div
                    className={styles.customerInfoIcon}
                    style={{ display: "inline" }}
                  >
                    <i className="bi bi-phone"></i>
                  </div>
                  <a href={`tel:${workOrder.data.cellPhone}`}>
                    {workOrder.data.cellPhone}
                  </a>
                </div>
              )}
              {workOrder?.data?.email && (
                <div>
                  <div
                    className={styles.customerInfoIcon}
                    style={{ display: "inline" }}
                  >
                    <i className="bi bi-envelope"></i>
                  </div>
                  <a
                    href={`mailto:${workOrder.data.email}`}
                    style={{ display: "inline" }}
                  >
                    {workOrder.data.email}
                  </a>
                </div>
              )}
            </div>
          )}
          <div className={styles.tableButtonsOuterContainer}>
            <div className={styles.tableButtonsOuterContainer}>
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
        </div>
        <hr style={{ margin: "3px 0 3px 0" }} />
      </div>
      <div
        className={styles.container}
        style={{ ...props.style }}
        id={"title-main"}
      >
        <div id="title-topmost"></div>
        <div>
          <div
            style={{ border: "1px dotted lightgrey" }}
            className="pl-2 pr-2 pb-2 rounded-sm mt-2 mb-4"
          >
            <div className={styles.grid}>
              <InView
                as="div"
                onChange={(inView, entry) => setShowGoToTop(!inView)}
              >
                <ServiceInfo
                  WorkOrderSelectOptions={WorkOrderSelectOptions}
                  inputData={inputData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  serviceChangeItems={serviceChangeItems}
                />
              </InView>
              <ServiceDocuments
                module={moduleName}
                moduleId={inputData?.id}
                documents={documents}
                setDocuments={setDocuments}
                setShowAttachments={setShowDocumentUpload}
                setShowDeleteFiles={setShowDeleteFiles}
                isLoading={isFetchingFiles || isLoadingFiles}
              />
              <div className="grid space-y-4">
                <ServiceSchedule
                  inputData={inputData}
                  handleInputChange={handleInputChange}
                  dateChangeItems={dateChangeItems}
                />
                <ServiceSummary
                  inputData={inputData}
                  handleInputChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-row justify-end pt-3">
              <LockButton
                tooltip={"Save Service Info"}
                onClick={handleSave}
                disabled={
                  (serviceChangeItems?.length === 0 &&
                    dateChangeItems?.length === 0) ||
                  isReadOnly
                }
                showLockIcon={isReadOnly}
                label={"Save"}
              />
            </div>
          </div>
          <div className="flex lg:flex-row md:flex-col sm:flex-col lg:space-x-4 md:space-y-0 sm:space-y-6">
            <div className="lg:w-7/12 md:w-full sm:full">
              <ServiceNotes
                moduleId={workOrderDataFromParent?.id}
                showNotes={showNotes}
                onExpandCollapse={handleExpandCollapseCallback}
              />
            </div>
            <div className="lg:w-5/12 md:w-full sm:full">
              <ServiceCallLogs
                moduleId={workOrderDataFromParent?.id}
                showCallLogs={showCallLogs}
                onExpandCollapse={handleExpandCollapseCallback}
              />
            </div>
          </div>

          <div className="pt-3">
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

        <Modal
          open={showMap}
          onClose={() => {
            setShowMap(false);
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: "3px",
            }}
            className={styles.mapModal}
          >
            <div style={{ height: "400px", width: "100%" }}>
              <MapWithAMarker
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhsQnBPh07vYae9Oakwczkyv8gTDY9j-U&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </div>
          </Box>
        </Modal>

        <ActionModal
          title={"Add / Update Documents"}
          open={showDocumentUpload}
          showCancel={false}
          onCancel={() => {
            setShowDocumentUpload(false);
            setContainsNewUnsavedFiles(false);
          }}
          onOk={handleDocumentsOk}
          okDisabled={!containsNewUnsavedFiles}
          cancelLabel={"Cancel"}
          popConfirmOkTitle={"Save Documents Confirmation"}
          popConfirmOkDescription={"Do you want to proceed with the update?"}
          popConfirmCancelTitle={"Close Documents"}
          popConfirnCancelDescription={
            <div>
              <div>
                Once you close this window, all your pending changes will be
                lost.
              </div>
              <div>Proceed anyway?</div>
            </div>
          }
        >
          <DocumentUpload
            documents={documents}
            setContainsNewUnsavedFiles={setContainsNewUnsavedFiles}
          />
        </ActionModal>

        <ConfirmationModal
          title={`Save Confirmation`}
          open={showSaveConfirmation}
          onOk={handleSaveYes}
          onCancel={handleSaveNo}
          cancelLabel={"No"}
          okLabel={"Yes"}
        >
          <div className="pt-2">
            <div>Are you sure you want to save your changes?</div>
          </div>
        </ConfirmationModal>

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

        {showGoToTop && (
          <div style={{ position: "absolute", bottom: 10, right: 10 }}>
            <i
              className={`bi bi-arrow-up-circle-fill ${styles.goToTopIcon}`}
              onClick={() => handleScrollToView("topmost")}
            ></i>
          </div>
        )}
      </div>
    </>
  );
}
