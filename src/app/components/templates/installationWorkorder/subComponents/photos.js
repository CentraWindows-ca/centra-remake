"use client";
import React, { useEffect, useState, useCallback } from "react";

import { useQuery } from "react-query";

import Collapse from '@mui/material/Collapse';

import CollapsibleGroup from 'app/components/atoms/workorderComponents/collapsibleGroup';
import LoadingIndicator from "app/components/atoms/loadingIndicator/loadingIndicator";
import PhotoGrid from "app/components/organisms/photoGrid/photoGrid";
import AntUploadModal from "app/components/organisms/antUploadModal/antUploadModal";
import Title from "app/components/atoms/title/title";

import { fetchPhotosById } from 'app/api/installationApis';

import { Button, Popconfirm } from 'antd';
import MuiModal from "app/components/atoms/modal/modal";

export default function Photos({
  showAttachments,
  handleExpandCollapseCallback,
  viewConfig,
  workOrderNumber = "" }) {
  const { isFetching,
    data: photosRaw,
    refetch } = useQuery("installationPhotos", () => {
      if (workOrderNumber) {
        return fetchPhotosById(workOrderNumber)
      }
    }, {
      enabled: true,
      refetchOnWindowFocus: false
    });

  const [photos, setPhotos] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showPopOut, setIsShowPopOut] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

  // Mutate raw photo data
  useEffect(() => {
    let _photos = [];

    if (photosRaw?.data?.length > 0) {
      photosRaw.data.forEach((x) => {
        let fileDetails = x.fileData?.split(";");
        if (fileDetails?.length > 0) {
          let fileName = fileDetails[0]?.split("=");
          let mimeType = fileDetails[1]?.split("=");
          let type = mimeType[1]?.substring(1, mimeType[1].length - 1);
          let size = fileDetails[2]?.split("=");

          let _photo = {
            fileNotes: x.fileNotes,
            name: fileName[1]?.substring(1, fileName[1].length - 1), // Remove quotes
            type: type,
            base64: `data:${type};base64,${x.base64}`,
            size: (size[1].substring(1, size[1].length - 1) / 1024).toFixed(2)
          }

          _photos.push(_photo);
        }
      });
    }

    setPhotos(_photos);
  }, [photosRaw?.data]);

  const handleUpload = () => {
    setIsUploadOpen(true);
  }

  const handleDelete = useCallback(() => {
    if (photos?.length > 0 && selectedIndexes?.length > 0) {
      setPhotos(prev => {
        let newList = [];
        prev?.forEach((x, index) => {
          let exists = selectedIndexes.findIndex(y => y === index) > -1;
          if (!exists) {
            newList.push(x);
          }
        });
        return newList;
      });

      setSelectedIndexes([]);
    }
  }, [photos, selectedIndexes]);

  const handleSave = useCallback(() => {
    if (uploadFileList?.length > 0) {
      let _photos = [...photos];

      uploadFileList.forEach((file) => {
        const prefixMatch = file.base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        const type = prefixMatch && prefixMatch[1];
        const base64WithoutPrefix = file.base64?.split(',')[1];
        const binaryData = atob(base64WithoutPrefix);
        const fileSize = binaryData.length;

        _photos.push({
          base64: file.base64,
          name: file.fileName,
          fileNotes: "",
          size: fileSize,
          type: type
        });

        setPhotos(_photos);
        setIsUploadOpen(false);
      });
    }
  }, [photos, uploadFileList]);

  return (
    <>
      <CollapsibleGroup
        id={"title-photos"}
        title={"Photos"}
        subTitle={`(${photos?.length})`}
        expandCollapseCallback={() => handleExpandCollapseCallback("attachments")}
        popOutStateCallback={(val) => setIsShowPopOut(val)}
        value={showAttachments}
        style={{ marginTop: "0.5rem", backgroundColor: "#FFF" }}
        headerStyle={{ backgroundColor: "#EBEFF3" }}
        className="col-span-7"
        iconButtonsLeft={[
          {
            Icon: () => <i
              className="fa-solid fa-cloud-arrow-up text-blue-500 hover:cursor-pointer pr-1 hover:text-blue-400"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUpload(); }}
            />,
            tooltip: "Upload Photo(s)",
            className: "text-blue-500 hover:text-blue-400"
          }
        ]}
      >
        <Collapse in={viewConfig?.expanded ? true : showAttachments}>
          {isFetching &&
            <div className="flex justify-center items-center pt-4 pb-4">
              <LoadingIndicator />
            </div>
          }

          {!isFetching &&
            <PhotoGrid {
              ...{ photos, setPhotos }}
              size={80}
              className="justify-evenly"
            />
          }
        </Collapse>
      </CollapsibleGroup>

      <AntUploadModal
        key={isUploadOpen} // Force re-render to clear the old list after saving
        {...{
          isUploadOpen,
          setIsUploadOpen,
          setUploadFileList,
          allowedFileTypes,
          title: "Upload Photo(s)"
        }}
        onSave={handleSave}
      />

      <MuiModal
        title=""
        open={showPopOut}
        onClose={() => { setIsShowPopOut(false); }}
        onCancel={() => { setIsShowPopOut(false); }}
        centered
        okText="Save"
        style={{ width: "80vw", padding: "1rem" }}
      >
        <div className="flex flex-row justify-between">
          <Title
            label={"Photo Management"}
            className="inline-block mr-4 pt-1 pb-1 mb-3 pr-2"
            Icon={() => { return <i className="fa-solid fa-images pr-2" /> }}>
          </Title>
          <div className="pl-8 pt-1">
            <i className="fa-solid fa-xmark text-xl text-gray-500 hover:cursor-pointer" onClick={() => { setIsShowPopOut(false); }} />
          </div>
        </div>
        <div className="flex flex-row justify-between pb-3 pt-3">
          <Button
            type="primary"
            onClick={() => setIsUploadOpen(true)}>
            <i className="fa-solid fa-cloud-arrow-up pr-2" />
            Upload
          </Button>
          <Popconfirm
            placement="left"
            title={"Delete File(s)"}
            description={
              <div className="pt-2">
                <div className="pb-2">Are you sure you want to delete the selected file(s)?</div>
              </div>
            }
            onConfirm={() => handleDelete()}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              disabled={selectedIndexes.length == 0}
            >
              <i className="fa-solid fa-trash-can pr-2" />
              Delete
            </Button>
          </Popconfirm>
        </div>
        <div style={{ borderTop: "1px dotted lightgrey" }} className="mb-3"></div>
        <PhotoGrid {
          ...{ photos, setPhotos, selectedIndexes, setSelectedIndexes }}
          size={200}
          className="h-[78vh] justify-evenly"
          showTitle={true}
          showCheckbox={true}
        />
      </MuiModal>
    </>
  )
}