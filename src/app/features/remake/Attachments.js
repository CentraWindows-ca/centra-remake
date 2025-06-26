"use client";
import React, { useState, useCallback } from "react";

import {
  uploadAttachments,
} from "app/api/genericApis/attachmentsApi";

import { useQuery } from "react-query";

import { Empty, message, Image } from "antd";

import {
  fetchAttachments,
} from "app/api/genericApis/attachmentsApi";
import AntUploadModalWithNotes from "app/components/antUploadModalWithNotes/antUploadModalWithNotes";

import { saveAs } from "file-saver";

export default function Attachments(props) {
  const {
    orderId
  } = props;

  const moduleName = "remake";
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState([]);

  const fetchAttachmentsAsync = async () => {
    if (orderId) {
      const result = await fetchAttachments(moduleName, orderId);
      return result.data;
    }
    return [];
  };

  const {
    isLoading: isLoadingAttachments,
    data: attachments,
    refetch: refetchAttachments,
    isFetching: isFetchingAttachments,
  } = useQuery(
    [`${moduleName}OrderAttachments`, orderId],        // query key
    () => fetchAttachmentsAsync(orderId),              // query function
    {
      enabled: !!orderId,                              // only runs when orderId exists
      refetchOnWindowFocus: false,
    }
  );

  const mapToUploadPayload = (fileList) => {
    return fileList.map(file => ({
      id: null,
      fileName: file.name,
      base64Content: file.base64,
      contentType: file.contentType || "",
      size: file.size || "",
      note: file.notes || ""
    }));
  };

  const handleUpload = useCallback(async () => {
    if (uploadFileList?.length > 0 && orderId) {
      const payload = mapToUploadPayload(uploadFileList);

      if (payload?.length > 0) {
        const result = await uploadAttachments("remake", orderId, payload);
        console.log("upload result ", result);
        if (result) {
          message.success("Attachments uploaded successfully.");
          refetchAttachments();
          setShowUpload(false);
          setUploadFileList([]);
        } else {
          message.error("Failed to upload attachments.");
        }
      }
    }
  }, [uploadFileList, orderId]);

  const getFileIcon = (fileType) => {
    if (fileType?.includes("pdf")) {
      return <i className="fa-regular fa-file-pdf text-red-600 pt-1" />;
    }
    if (fileType?.includes("word")) {
      return <i className="fa-regular fa-file-word text-blue-600 pt-1" />;
    }
    if (fileType?.includes("image")) {
      return <i className="fa-regular fa-file-image text-teal-600 pt-1" />;
    }
    if (fileType?.includes("text")) {
      return <i className="fa-regular fa-file-lines text-gray-600 pt-1" />;
    }
    return <i className="fa-regular fa-file text-gray-400 pt-1" />;
  };

  return (
    <>
      <div className="bg-[#ebeff3] pl-2 pt-1 pb-1 font-semibold flex flex-row justify-between">
        <div>
          <i
            className="fa fa-cloud-arrow-up text-blue-500 hover:text-blue-400 hover:cursor-pointer pr-1"
            onClick={() => setShowUpload(true)}
          />
          Attachments
        </div>
        <div className="">
        </div>
      </div>
      <div className="h-[185px] overflow-y-auto">
        {attachments?.length > 0 &&
          <div className="p-2">
            {[...attachments].map((attachment) => {
              const isImage = attachment.mimeType?.startsWith('image/');
              return (
                <>
                  {isImage && false && (
                    <div style={{ display: 'none' }}>
                      <Image
                        style={{ height: 0 }}
                        preview={{
                          visible: previewVisible,
                          src: attachment.base64.startsWith('data:')
                            ? attachment.base64
                            : `data:${attachment.mimeType};base64,${attachment.base64}`,
                          onVisibleChange: (visible) => setPreviewVisible(visible),
                        }}
                      />
                    </div>
                  )}
                  <div className="flex flex-row justify-between group">
                    <div
                      className="group-hover:underline group-hover:cursor-pointer"
                      onClick={() => {
                        //if (isImage) {
                        // setPreviewVisible(true);
                        //} else {
                        const dataUri = attachment.base64.startsWith('data:')
                          ? attachment.base64
                          : `data:${attachment.mimeType};base64,${attachment.base64}`;

                        // Open file in a new tab using iframe
                        const newTab = window.open();
                        if (newTab) {
                          newTab.document.write(`
                              <html>
                                <head><title>Preview: ${attachment.name}</title></head>
                                <body style="margin:0">
                                  <iframe src="${dataUri}" style="border:0;width:100vw;height:100vh;"></iframe>
                                </body>
                              </html>
                            `);
                        }
                        //}
                      }}
                    >
                      <div className="flex flex-row">
                        <div className="pr-1">{getFileIcon(attachment?.mimeType)}</div>
                        <div className="w-[9.5rem]">{attachment.fileNotes || attachment.name}</div>
                      </div>                      
                      {false && <span className="pl-1 text-blue-500">({attachment.size})</span>}
                    </div>
                    <i class="mt-[5px] fa-solid fa-gear text-gray-400 group-hover:cursor-pointer hover:text-blue-500" />
                  </div>
                </>)
            })}
          </div>
        }

        {attachments?.length === 0 &&
          <div className="p-2 flex justify-center items-center h-full w-full">
            <div className="translate-y-[-15px]">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Attachments"} />
            </div>
          </div>
        }
      </div>

      <AntUploadModalWithNotes
        showUpload={showUpload}
        setShowUpload={setShowUpload}
        setUploadFileList={setUploadFileList}
        onSave={handleUpload}
        allowedFileTypes={[
          // Images
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/heic',
          'image/svg+xml',

          // PDFs
          'application/pdf',

          // Word documents
          'application/msword',                     // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

          // Excel files
          'application/vnd.ms-excel',               // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

          // PowerPoint
          'application/vnd.ms-powerpoint',          // .ppt
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx

          // Text files
          'text/plain',

          // CSV, JSON
          'text/csv',
          'application/json',

          // Archives
          'application/zip',
          'application/x-7z-compressed',
          'application/x-rar-compressed',
          'application/x-tar',

          // Rich Text Format
          'application/rtf'
        ]}
        title={"Upload Attachments"}
        canUpload={true}
      />
    </>
  );
}
