"use client";
import styles from "../serviceWorkorder.module.css";
import React, { useEffect, useCallback } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import saveAs from "file-saver";
import Group from "app/components/atoms/workorderComponents/group";
import { openBlob } from "app/utils/utils";
import Document from "app/components/atoms/document/document";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import UploadIcon from "app/components/atoms/uploadIcon/uploadIcon";

export default function ServiceDocuments(props) {
  const {
    module,
    documents,
    setDocuments,
    setShowAttachments,
    setShowDeleteFiles,
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

  const handleDownloadFile = useCallback(
    (fileId) => {
      if (documents) {
        let document = documents.find((x) => x.id === fileId);
        if (document) {
          const binaryData = atob(document.base64);
          const byteArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: document.mimeType });
          saveAs(blob, document.name);
        }
      }
    },
    [documents]
  );

  const handlePreviewFile = useCallback(
    (fileId) => {
      if (documents) {
        let document = documents.find((x) => x.id === fileId);
        if (document) {
          let base64 = document.base64;
          if (base64) {
            openBlob(base64, document.mimeType);
          }
        }
      }
    },
    [documents]
  );

  const handleCheckFile = (fileId, value) => {
    setDocuments((d) => {
      let _d = JSON.parse(JSON.stringify(d));
      let index = documents.findIndex((x) => x.id === fileId);
      _d[index].checked = value;
      return _d;
    });
  };

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

  const handleDeleteFiles = () => {
    setShowDeleteFiles(true);
  };

  return (
    <Group
      title={"Documents"}
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
              onClick={() => setShowAttachments(true)}
              color="text-blue-400"
            />
          ),
          callback: () => setShowAttachments(true),
          tooltip: "Upload Documents",
          className: "text-blue-500 hover:text-blue-400",
        },
      ]}
      iconButtonsRight={[
        {
          Icon: DeleteForeverIcon,
          callback: deleteDocumentsButtonDisabled()
            ? () => {}
            : handleDeleteFiles,
          tooltip: "Delete Document(s)",
          className: deleteDocumentsButtonDisabled()
            ? "text-gray-400"
            : "text-red-600 hover:text-red-400 cursor-pointer",
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
          {documents?.map((d, index) => {
            return (
              <Document
                file={d}
                module={module}
                key={`attachment-${index}`}
                onPreview={handlePreviewFile}
                onDownload={handleDownloadFile}
                onCheck={handleCheckFile}
              />
            );
          })}

          {documents?.length === 0 && (
            <div
              style={{ display: "table", height: "100%" }}
              className="w-full"
            >
              <div className="table-cell align-middle text-center">
                <div
                  className="cursor-pointer hover:text-blue-400 text-gray-400"
                  onClick={() => setShowAttachments(true)}
                >
                  <UploadIcon onClick={() => setShowAttachments(true)} />
                  Add Document(s)
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Group>
  );
}
