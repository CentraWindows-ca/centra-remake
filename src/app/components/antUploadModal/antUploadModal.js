"use client";
import React, { useState } from "react";

import { Modal, message, Upload } from 'antd';
const { Dragger } = Upload;

import { getBase64 } from "app/utils/utils";

export default function AntUploadModal({ 
  showUpload,
  setShowUpload,
  setUploadFileList,
  onSave,
  allowedFileTypes,
  title
})
{

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const beforeUpload = (file) => {
    let isAccepted = true;

    if (allowedFileTypes?.length > 0) {
      isAccepted = allowedFileTypes.includes(file.type);
      // TODO: Check if duplicate

      if (!isAccepted) {
        message.error('File type not supported.');
      }
    }
    
    return isAccepted || Upload.LIST_IGNORE;
  };

  const uploadProps = {
    onChange(info) {
      if (info.file) {
        setIsSaveDisabled(info?.fileList?.length === 0);
        setUploadFileList(prev => {
          let _prev = [...prev];
          // Extract type
          getBase64(info?.file?.originFileObj).then(data => {
            if (data) {
              let exists = _prev.find(x => x.filename === info.file.name);

              if (!exists) {
                _prev.push({ filename: info?.file?.name, base64: data });
              }
            }
          })

          return _prev;
        });
      }
    }
  };

  return (
    <Modal
      title={title}
      open={showUpload}
      onOk={onSave}
      okButtonProps={{ disabled: isSaveDisabled }}
      onCancel={() => { setShowUpload(false); }}
      centered
      okText="Upload"
    >
      <div className="mt-3 mb-4">
        <Dragger beforeUpload={beforeUpload} {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <i className="fa-solid fa-cloud-arrow-up text-blue-500 text-4xl"></i>
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </div>
    </Modal>
  )
}