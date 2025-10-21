"use client";
import React, { useState, useEffect } from "react";
import { Modal, message, Upload, Typography, Input } from "antd";
const { Dragger } = Upload;
const { Text } = Typography;
import { getBase64 } from "app/utils/utils";

export default function AntUploadModalWithNotes({
  showUpload,
  setShowUpload,
  setUploadFileList,
  onSave,
  allowedFileTypes,
  title,
  canUpload
}) {
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [draggerFileList, setDraggerFileList] = useState([]);

  const beforeUpload = (file) => {
    let isAccepted = true;

    if (allowedFileTypes?.length > 0) {
      isAccepted = allowedFileTypes.includes(file.type);
      if (!isAccepted) {
        message.error("File type not supported.");
      }
    }

    return isAccepted || Upload.LIST_IGNORE;
  };

  const uploadProps = {
    onChange(info) {
      setDraggerFileList(info.fileList); // Update visible Dragger file list

      if (info.file && info.file.status !== "removed") {
        getBase64(info?.file?.originFileObj).then((data) => {
          if (data) {
            setUploadFileList((prev) => {
              let _prev = [...prev];
              let exists = _prev.find((x) => x.name === info.file.name);
              if (!exists) {
                _prev.push({
                  uid: info.file.uid,
                  name: info?.file?.name,
                  base64: data,
                  contentType: info?.file?.type,
                  size: (info?.file?.size / 1024).toFixed(2) + " KB",
                  notes: ""
                });
              }
              return _prev;
            });

            setIsSaveDisabled(info?.fileList?.length === 0 || !canUpload);
          }
        });
      } else if (info.file.status === "removed") {
        // When a file is removed
        setUploadFileList((prev) =>
          prev.filter((f) => f.uid !== info.file.uid)
        );

        setIsSaveDisabled(info?.fileList?.length === 0 || !canUpload);
      }
    }
  };

  useEffect(() => {
    if (!showUpload) {
      setUploadFileList([]);
      setDraggerFileList([]);
    }
  }, [showUpload]);

  return (
    <Modal
      title={title}
      open={showUpload}
      onOk={onSave}
      okButtonProps={{ disabled: isSaveDisabled }}
      onCancel={() => {
        setShowUpload(false);
        setUploadFileList([]);
        setDraggerFileList([]); // Clear Dragger
      }}
      centered
      okText="Upload"
    >
      <div className="mt-3 mb-4">
        <Dragger
          beforeUpload={beforeUpload}
          {...uploadProps}
          fileList={draggerFileList}
          action="/upload"
          itemRender={(originNode, file, fileList, actions) => {
            const index = fileList.findIndex((f) => f.uid === file.uid);
            return (
              <div
                className={`pb-[8px] pt-1 ${index % 2 ? "bg-gray-50" : "bg-white"
                  } rounded`}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="pl-1 pr-1 flex flex-row justify-between w-full gap-2 mb-1">
                  <Text className="flex-1 basis-0 text-blue-700 max-w-[25rem] truncate">
                    {file.name}
                  </Text>
                  <Text>{(file.size / 1024)?.toFixed(2) + "KB"}</Text>
                </div>
                <div
                  className="pl-1 pr-1 flex flex-row justify-between w-full gap-2"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Input
                    size="small"
                    placeholder={"Notes"}
                    className="max-w-[24rem]"
                    onChange={(e) => {
                      const notes = e.target.value;
                      setUploadFileList((prev) => {
                        const newList = [...prev];
                        const fileIndex = newList.findIndex(
                          (f) => f.uid === file.uid
                        );
                        if (fileIndex !== -1) {
                          newList[fileIndex].notes = notes;
                        }
                        return newList;
                      });
                    }}
                  />
                  <i
                    className="fa-solid fa-trash-can text-red-600 hover:text-red-400 mt-[5px]"
                    onClick={actions.remove}
                  />
                </div>
              </div>
            );
          }}
        >
          <p className="ant-upload-drag-icon">
            <i className="fa-solid fa-cloud-arrow-up text-blue-500 text-4xl"></i>
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </div>
    </Modal>
  );
}