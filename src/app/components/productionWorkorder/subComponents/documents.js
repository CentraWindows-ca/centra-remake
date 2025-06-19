"use client";
import styles from '../productionWorkorder.module.css';
import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import saveAs from "file-saver";

import Attachment from "app/components/attachment/attachment";
import LoadingIndicator from "app/components/loadingIndicator/loadingIndicator";
import Group from "app/components/workorderComponents/group";
import { openBlob, convertBase64ToFile } from "app/utils/utils";

import { fetchProductionDocuments } from 'app/api/productionApis';

import { useQuery } from "react-query";

export default function Documents(props) {
  const {
    documents,
    setDocuments,
    setShowAttachments,
    setShowDeleteFiles,
    workOrderNumber
  } = props;

  const { result } = useSelector(state => state.calendar);

  const { isFetching,
    data: documentList,
    refetch } = useQuery("productionDocuments", () => {
      if (workOrderNumber) {
        return fetchProductionDocuments(workOrderNumber)
      }
    }, { enabled: true });

  const handleDownloadFile = (base64, fileName) => {
    if (base64 && fileName) {
      const file = convertBase64ToFile(base64, fileName);
      if (file) {
        saveAs(file, fileName)
      }
    }
  }

  const handlePreviewFile = useCallback((fileName) => {
    if (documents && fileName) {
      let document = documents.find(x => x.name === fileName);
      if (document) {
        let base64 = document.base64?.split(',')[1];
        if (base64) {
          openBlob(base64, document.type);
        }
      }
    }
  }, [documents]);

  const handleCheckFile = (fileName, value) => {
    setDocuments((d) => {
      let _d = JSON.parse(JSON.stringify(d));
      let index = documents.findIndex(x => x.name === fileName);
      _d[index].checked = value;
      return _d;
    })
  }

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
  }

  // Documents
  useEffect(() => {
    let _documents = [];

    if (documentList?.data?.length > 0) {
      documentList.data.forEach((x) => {
        let fileDetails = x.fileNameSource?.split(";");
        if (fileDetails?.length > 0) {
          let fileName = fileDetails[0]?.split("=");
          let mimeType = fileDetails[1]?.split("=");
          let type = mimeType[1]?.substring(1, mimeType[1]?.length - 1);
          let size = fileDetails[2]?.split("=");

          let _document = {
            fileNotes: x.fileNotes,
            name: fileName[1]?.substring(1, fileName[1]?.length - 1), // Remove quotes
            type: type,
            base64: `data:${type};base64,${x.fileSource}`,
            size: (size[1].substring(1, size[1].length - 1) / 1024).toFixed(2)
          }

          _documents.push(_document);
        }
      });
    }

    setDocuments(_documents);
  }, [documentList, setDocuments]);

  useEffect(() => {
    if (result) {
      refetch();
    }
  }, [result, refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Group
      title={"Attachments"}
      style={{ minWidth: "12rem" }}
      contentStyle={{
        padding: "0.5rem",
        overflow: "hidden",
        height: "292px",
        overflowY: "auto"
      }}
      iconButtonsLeft={[
        {
          Icon: () => <i
            className="fa-solid fa-cloud-arrow-up text-blue-500 hover:cursor-pointer pr-1 hover:text-blue-400"
            onClick={() => setShowAttachments(true)}
          />,          
          tooltip: "Upload Attachments",
          className: "text-blue-500 hover:text-blue-400"
        }
      ]}
      iconButtonsRight={[
        {
          Icon: DeleteForeverIcon,
          callback: deleteDocumentsButtonDisabled() ? () => { } : handleDeleteFiles,
          tooltip: "Delete Attachment(s)",
          className: deleteDocumentsButtonDisabled() ? "text-gray-400" : "text-red-600 hover:text-red-400 cursor-pointer"
        }
      ]}
      className={styles.groupOptions}
    >
      {documents?.length > 0 && !isFetching &&
        <div>
          {documents?.map((d, index) => {
            return (<Attachment
              file={d}
              key={`attachment-${index}`}
              onPreview={handlePreviewFile}
              onDownload={handleDownloadFile}
              onCheck={handleCheckFile}
            />)
          })}
        </div>
      }

      {documents?.length === 0 && !isFetching &&
        <div style={{ display: "flex", height: "90%", alignItems: "center", justifyContent: "center" }}>
          <div className="table-cell align-middle text-center">
            <div
              className="cursor-pointer hover:text-blue-400 text-gray-400"
              onClick={() => setShowAttachments(true)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <i className="fa-solid fa-cloud-arrow-up pr-1"></i> Add Attachment(s)
            </div>
          </div>
        </div>
      }

      {isFetching &&
        <div className="flex justify-center items-center" style={{ height: "100%" }}>
          <LoadingIndicator />
        </div>
      }
    </Group>
  )
}