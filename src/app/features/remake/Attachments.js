"use client";
import React, { useState, useCallback } from "react";

import {
  fetchAttachments,
  uploadAttachments,
  deleteAttachments
} from "app/api/genericApis/attachmentsApi";

import { useQuery } from "react-query";

import { Empty, message, Image, Popover, Popconfirm } from "antd";

import AntUploadModalWithNotes from "app/components/antUploadModalWithNotes/antUploadModalWithNotes";

export default function Attachments(props) {
  const { orderId } = props;

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


  const handleView = (attachment) => {
    const base64 = attachment.base64;
    const mimeType = attachment.mimeType;

    // Remove "data:*/*;base64," prefix if it exists
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  const handleDelete = async (id) => {
    const result = await deleteAttachments("remake", [id])
    if (result) {
      message.success("Attachment deleted successfully.");
      refetchAttachments();     
    } else {
      message.error("Failed to delete attachment.");
    }
  }

  const handleDownload = (attachment) => {
    const link = document.createElement("a");
    link.href = attachment.base64.startsWith("data:")
      ? attachment.base64
      : `data:application/octet-stream;base64,${attachment.base64}`;
    link.download = attachment.name;
    link.click();
  }

  const AttachmentContent = (attachment) => {
    return (
      <div>
        <div className="border-b pb-1 mb-1 max-w-[12rem] font-semibold">{`${attachment?.name} (${attachment?.size})`}</div>
        <div onClick={() => handleDownload(attachment)}><i className="fa-solid fa-download pr-2 text-blue-500" /><span className="hover:underline hover:text-blue-500 hover:cursor-pointer">Download</span></div>
        <div onClick={() => handleView(attachment)}><i className="fa-solid fa-eye pr-2 text-green-500" /><span className="hover:underline hover:text-blue-500 hover:cursor-pointer">View</span></div>        
        <div><i className="fa-solid fa-pen pr-2 text-blue-500" /><span className="hover:underline hover:text-blue-500 hover:cursor-pointer">Edit</span></div>
        <Popconfirm
          title="Delete Attachment"
          description="Are you sure to delete this file?"
          onConfirm={() => handleDelete(attachment.id)}
          onCancel={() => { }}
          okText="Yes"
          cancelText="No"
        >
          <div><i className="fa-solid fa-trash-can pr-2 text-red-500" /><span className="hover:underline hover:text-blue-500 hover:cursor-pointer">Delete</span></div>
        </Popconfirm>
      </div>
    )
  }

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
                      onClick={() => handleView(attachment)}
                    >
                      <div className="flex flex-row">
                        <div className="pr-1">{getFileIcon(attachment?.mimeType)}</div>
                        <div className="w-[9.5rem] hover:text-blue-500">{attachment.fileNotes || attachment.name}</div>
                      </div>                      
                      {false && <span className="pl-1 text-blue-500">({attachment.size})</span>}
                    </div>
                    <Popover
                      trigger="hover"
                      content={AttachmentContent(attachment)}
                      placement={"right"}
                    >
                      <i className="mt-[5px] fa-solid fa-gear text-gray-400 group-hover:cursor-pointer hover:text-blue-500"/>
                    </Popover>
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
        ]}
        title={"Upload Attachments"}
        canUpload={true}
      />
    </>
  );
}
