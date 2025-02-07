"use client";
import React, { useState, useEffect } from "react";
import PhotoGallery from "app/components/organisms/photoGallery/photoGallery";
import Group from "app/components/atoms/workorderComponents/group";
import styles from "../serviceWorkorder.module.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import UploadIcon from "app/components/atoms/uploadIcon/uploadIcon";

export default function ServicePhotos(props) {
  const {
    photos,
    tempPhotos,
    setTempPhotos,
    handlePhotosOk,
    handlePhotosDelete,
    containsNewUnsavedImages,
    setContainsNewUnsavedImages,
    showPhotoUpload,
    setShowPhotoUpload,
    showDeletePhotos,
    setShowDeletePhotos,
    selectedPhotos,
    setSelectedPhotos,
    isLoading,
  } = props;

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <>
      <Group
        id={"title-photos"}
        title={"Photo Gallery"}
        style={{ minWidth: "12rem" }}
        contentStyle={{
          padding: "0.5rem",
          height: "calc(100% - 29px)",
          overflow: "auto",
        }}
        iconButtonsLeft={[
          {
            Icon: () => (
              <UploadIcon
                color="text-blue-500"
                onClick={() => setShowPhotoUpload(true)}
              />
            ),
            tooltip: "Upload Photos",
            className: "text-blue-500 hover:text-blue-400",
          },
        ]}
        className={styles.groupOptions}
      >
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full py-4">
            <span>
              <Spin className="pr-2" indicator={antIcon} /> Loading...
            </span>
          </div>
        ) : (
          <>
            <PhotoGallery
              photos={photos}
              uploadPhotos={handlePhotosOk}
              deletePhotos={handlePhotosDelete}
              tempPhotos={tempPhotos}
              setTempPhotos={setTempPhotos}
              containsNewUnsavedImages={containsNewUnsavedImages}
              setContainsNewUnsavedImages={setContainsNewUnsavedImages}
              showPhotoUpload={showPhotoUpload}
              setShowPhotoUpload={setShowPhotoUpload}
              showDeletePhotos={showDeletePhotos}
              setShowDeletePhotos={setShowDeletePhotos}
              selectedPhotos={selectedPhotos}
              setSelectedPhotos={setSelectedPhotos}
            />
          </>
        )}
      </Group>
    </>
  );
}
