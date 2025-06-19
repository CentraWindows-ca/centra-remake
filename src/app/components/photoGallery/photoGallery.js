"use client";
import React, { useCallback, useState, useEffect } from "react";
import Tooltip from "app/components/tooltip/tooltip";
import moment from "moment";
import Carousel from "react-material-ui-carousel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Modal, Box } from "@mui/material";
import styles from "./photoGallery.module.css";
import ActionModal from "app/components/actionModal/actionModal";
import PhotoUpload from "./photoUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Tag } from "antd";
import ConfirmationModal from "app/components/confirmationModal/confirmationModal";
import { textEllipsis } from "app/utils/utils";
import Image from "next/image";
import UploadIcon from "app/components/uploadIcon/uploadIcon";
export default function PhotoGallery(props) {
  const {
    photos,
    tempPhotos,
    setTempPhotos,
    uploadPhotos,
    deletePhotos,
    containsNewUnsavedImages,
    setContainsNewUnsavedImages,
    showPhotoUpload,
    setShowPhotoUpload,
    showDeletePhotos,
    setShowDeletePhotos,
    selectedPhotos,
    setSelectedPhotos,
    readOnly = false,
    showUploadBtn = false,
  } = props;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deletePhotosButtonDisabled, setDeletePhotosButtonDisabled] =
    useState(true);

  useEffect(() => {
    if (selectedPhotos.length > 0) setDeletePhotosButtonDisabled(false);
    else setDeletePhotosButtonDisabled(true);
  }, [selectedPhotos]);

  const handleEnlargeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleAddPhotosClick = () => {
    setShowPhotoUpload(true);
  };

  const toggleImageSelect = (imageId, value) => {
    if (value === true) {
      setSelectedPhotos((p) => {
        let _t = JSON.parse(JSON.stringify(p));

        if (_t.find((x) => x.id === imageId) === undefined) {
          _t.push(photos.find((x) => x.id === imageId));
        }

        return _t;
      });
    } else {
      setSelectedPhotos((p) => {
        let _t = JSON.parse(JSON.stringify(p));

        return _t.filter((x) => x.id !== imageId);
      });
    }
  };

  const toggleSelectAll = (value) => {
    if (value) {
      setSelectedPhotos((p) => {
        let _t = JSON.parse(JSON.stringify(photos));

        return _t;
      });
    } else {
      setSelectedPhotos([]);
    }
  };

  const handleDeleteFiles = () => {
    setShowDeletePhotos(true);
  };

  const iconButtonsRight = [
    {
      Icon: DeleteForeverIcon,
      callback: deletePhotosButtonDisabled ? () => {} : handleDeleteFiles,
      tooltip: "Delete Photo(s)",
      className: deletePhotosButtonDisabled
        ? "text-gray-400"
        : "text-red-600 hover:text-red-400 cursor-pointer",
    },
  ];

  return (
    <>
      {photos.length === 0 ? (
        <div className="grid h-full w-full flex-row justify-center items-center">
          <Tooltip title="Upload Photo">
            <div
              className="cursor-pointer hover:text-blue-400 text-gray-400"
              onClick={handleAddPhotosClick}
            >
              <UploadIcon onClick={() => setShowAttachments(true)} />
              Add Photo(s)
            </div>
          </Tooltip>
        </div>
      ) : (
        <div className={`flex space-x-4 ${styles.galleryContainer}`}>
          <div className="w-full flex flex-col space-y-4">
            {!readOnly && (
              <>
                <div className="flex justify-between">
                  <span className="flex items-center space-x-2">
                    {showUploadBtn && (
                      <Tooltip title="Upload Photo">
                        <div
                          className="cursor-pointer hover:text-blue-400 text-blue-500"
                          onClick={handleAddPhotosClick}
                        >
                          <i
                            className="fa-solid fa-cloud-arrow-up text-blue-500 hover:cursor-pointer pr-1 hover:text-blue-400"
                            onClick={() => setShowAttachments(true)}
                          />
                        </div>
                      </Tooltip>
                    )}
                    <input
                      type="checkbox"
                      checked={selectedPhotos.length === photos.length}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                    <div className="">Select all</div>
                  </span>
                  <div className="flex space-x-2">
                    {selectedPhotos.length > 0 && (
                      <div>
                        <Tag>{`Selected (${selectedPhotos.length}) `}</Tag>
                      </div>
                    )}
                    <span style={{ marginRight: "0.2rem", marginTop: "-2px" }}>
                      {iconButtonsRight.map((iconButton, index) => {
                        let { Icon } = iconButton;
                        return (
                          <Tooltip
                            key={`icon-button-${index}`}
                            title={iconButton.tooltip}
                            style={{ paddingLeft: "0.5rem" }}
                          >
                            <Icon
                              className={`bi bi-${iconButton.icon} ${styles.icon} ${iconButton.className}`}
                              onClick={iconButton.callback}
                              style={{ height: "1.3rem" }}
                            />
                          </Tooltip>
                        );
                      })}
                    </span>
                  </div>
                </div>
              </>
            )}
            <div className={`overflow-y-auto pr-5`}>
              {photos?.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((img, index) => (
                    <div key={index} className={`relative aspect-square`}>
                      {!readOnly && (
                        <input
                          type="checkbox"
                          className="absolute top-0 left-0 m-2 cursor-pointer z-50"
                          checked={
                            selectedPhotos.filter((x) => x.id === img.id)
                              .length > 0
                          }
                          onChange={(e) =>
                            toggleImageSelect(img.id, e.target.checked)
                          }
                        />
                      )}
                      <Tooltip title="Double-click to enlarge">
                        <Image
                          src={`data:${img.mimeType};base64,${img.base64}`}
                          fill
                          className={`cursor-pointer w-full h-full object-contain hover:opacity-95 hover:shadow-md bg-gray-100 ${
                            index === selectedImageIndex
                              ? "border-blue-500 border-3"
                              : ""
                          }`}
                          alt={`Image ${index}`}
                          onClick={() => handleImageSelect(index)}
                          onDoubleClick={handleEnlargeClick}
                        />
                      </Tooltip>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
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
            width: "80%",
            background: "black",
          }}
        >
          <Carousel
            animation="slide"
            autoPlay={false}
            swipe={true}
            navButtonsAlwaysVisible={true}
            cycleNavigation={true}
            index={selectedImageIndex}
            indicators={false}
            height="85vh"
            onChange={(index) => handleImageSelect(index)}
          >
            {photos.length > 0 &&
              photos.map((index) => (
                <div
                  key={index}
                  className="flex justify-center items-center text-center w-full h-full "
                >
                  <Image
                    src={`data:${photos[selectedImageIndex].mimeType};base64,${photos[selectedImageIndex].base64}`}
                    alt={`Image ${selectedImageIndex} `}
                    className="cursor-pointer h-full mx-auto object-contain"
                    fill
                  />
                  <div className="absolute bottom-2 left-2 text-white text-2xl pl-4 pb-3">
                    {" "}
                    {photos[selectedImageIndex].name}
                  </div>
                </div>
              ))}
          </Carousel>
        </Box>
      </Modal>

      <ActionModal
        title={"Upload Photos"}
        open={showPhotoUpload}
        showCancel={false}
        onCancel={() => {
          setShowPhotoUpload(false);
          setContainsNewUnsavedImages(false);
          setTempPhotos([]);
        }}
        onOk={uploadPhotos}
        okDisabled={!containsNewUnsavedImages}
        cancelLabel={"Cancel"}
        popConfirmOkTitle={"Save Photo Confirmation"}
        popConfirmOkDescription={"Do you want to proceed with the upload?"}
        popConfirmCancelTitle={"Close Photo Upload"}
        popConfirnCancelDescription={
          <div>
            <div>
              Once you close this window, all your pending changes will be lost.
            </div>
            <div>Proceed anyway?</div>
          </div>
        }
      >
        <PhotoUpload
          tempPhotos={tempPhotos}
          setTempPhotos={setTempPhotos}
          setContainsNewUnsavedImages={setContainsNewUnsavedImages}
        />
      </ActionModal>

      <ConfirmationModal
        title={`Delete Confirmation`}
        open={showDeletePhotos}
        onOk={deletePhotos}
        onCancel={() => setShowDeletePhotos(false)}
        // okDisabled={!documents.find(x => x.checked)}
        cancelLabel={"Cancel"}
        okLabel={"Ok"}
      >
        <div className="pt-2">
          <div>The following photo(s) will be permanently deleted:</div>
          <div className="pt-2 pl-4">
            {selectedPhotos?.map((i) => (
              <div key={i.name}>- {textEllipsis(i.name, 50)}</div>
            ))}
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
}
