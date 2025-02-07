"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery } from "react-query";

import Title from "app/components/atoms/title/title";
import MuiModal from "app/components/atoms/modal/modal";
import EditableLabel from "app/components/atoms/editableLabel/editableLabel";
import AntUploadModal from "app/components/organisms/antUploadModal/antUploadModal";
import LoadingIndicator from "app/components/atoms/loadingIndicator/loadingIndicator";
import CollapsibleGroup from 'app/components/atoms/workorderComponents/collapsibleGroup';
import Tooltip from "app/components/atoms/tooltip/tooltip";

import Collapse from '@mui/material/Collapse';

import { Button, Popconfirm, Table, Typography } from "antd";
const { Text } = Typography;

import { fetchDocumentsById } from 'app/api/installationApis';
import { openBlob } from "app/utils/utils";

import { convertBase64ToFile } from "app/utils/utils";
import saveAs from "file-saver";

export default function Documents(props) {
  const {
    inputData,
    style,
    className,
    showAttachments,
    handleExpandCollapseCallback,
    viewConfig,
    workOrderNumber = ""
  } = props;

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [showPopOut, setShowPopOut] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);

  //const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedFileTypes = [];

  const { isFetching,
    data: documentsRaw,
    refetch } = useQuery("installationDocuments", () => {
      if (workOrderNumber) {
        return fetchDocumentsById(workOrderNumber)
      }
    }, {
      enabled: true,
      refetchOnWindowFocus: false
    });

  // Mutate raw data
  useEffect(() => {
    let _documents = [];
    if (documentsRaw?.data?.length > 0) {
      documentsRaw.data.forEach((x, index) => {
        let fileDetails = x.fileNameSource?.split(";");
        if (fileDetails?.length > 0) {
          let fileName = fileDetails[0]?.split("=");
          let mimeType = fileDetails[1]?.split("=");
          let type = mimeType[1]?.substring(1, mimeType[1].length - 1);
          let size = fileDetails[2]?.split("=");

          let _document = {
            key: `document-${index}`,
            index: index,
            fileNotes: x.fileNotes,
            name: fileName[1].substring(1, fileName[1].length - 1), // Remove quotes
            type: type,
            base64: `data:${type};base64,${x.fileSource}`,
            size: (size[1].substring(1, size[1].length - 1) / 1024).toFixed(2)
          }

          _documents.push(_document);
        }
      });
    }

    setDocuments(_documents);
  }, [documentsRaw?.data]);

  const handleEditSave = useCallback((payload, originalData) => {
    const key = Object.keys(payload)[0];
    if (key && originalData?.index > -1) {
      setDocuments(prev => {
        let _prev = [...prev];
        _prev[originalData.index][key] = payload[key];
        return _prev;
      })
    }
  }, []);

  const columns = [
    {
      title: "Filename",
      dataIndex: "name",
      key: "name",
      render: (name) =>
      (
        <div onClick={
          () => {
            const file = documents.find(x => x.name === name);
            setSelectedDocument(file);
            setShowDocument(true);
          }}
          className="hover:cursor-pointer hover:text-blue-500 hover:underline"
        >
          {name}
        </div>
      )
    },
    {
      title: "Alias / Note",
      dataIndex: "fileNotes",
      key: "fileNotes",
      render: (fileNotes, index) =>
      (
        <div>
          <EditableLabel
            inputKey={"fileNotes"}
            title={"Edit Notes"}
            value={fileNotes}
            onSave={(data) => handleEditSave(data, index)}
            iconClass="mt-[-2px] text-blue-500"
            hasNoEditButton={true}
          >
            {fileNotes || "<Click to add>"}
          </EditableLabel>
        </div>
      )
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size) =>
      (
        <div>
          {`${size} KB`}
        </div>
      )
    }
  ];

  const rowSelection = useMemo(() => {
    return {
      onChange: (_selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(_selectedRowKeys);
      },
      getCheckboxProps: (record) => ({
        // Disable checkbox for a particular row based on the record
        //disabled: record.name === 'Jane Doe',
      })
    }
  }, []);

  const handleDeleteDocuments = useCallback(() => {
    if (documents?.length > 0) {
      setDocuments(prev => {
        let newList = [];
        prev.forEach((doc) => {
          let isSelected = selectedRowKeys.find(k => k === doc.key);
          if (!isSelected) {
            newList.push(doc);
          }
        });
        setSelectedRowKeys([]);
        return newList;
      });
    }
  }, [documents, selectedRowKeys]);

  const openOnNewTab = useCallback(() => {
    if (selectedDocument) {
      let base64 = selectedDocument.file?.base64?.split(',')[1] || selectedDocument.base64?.split(',')[1];
      if (base64) {
        openBlob(base64, selectedDocument.file?.type || selectedDocument.type);
      }
    }
  }, [selectedDocument]);

  const handleUpload = () => {
    setShowUpload(true);
  }

  const handleSave = useCallback(() => {
    if (uploadFileList?.length > 0) {
      let _documents = [...documents];

      uploadFileList.forEach((file, index) => {
        const prefixMatch = file.base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        const type = prefixMatch && prefixMatch[1];
        const base64WithoutPrefix = file.base64?.split(',')[1];
        const binaryData = atob(base64WithoutPrefix);
        const fileSize = (binaryData.length / 1024).toFixed(2);

        _documents.push({
          base64: file.base64,
          name: file.filename,
          fileNotes: "",
          size: fileSize,
          type: type
        });

        setShowUpload(false);
      });

      setDocuments(_documents);
      setUploadFileList([]);
    }
  }, [documents, uploadFileList]);

  const Icon = useCallback((props) => {
    const { type } = props;

    if (type?.includes("pdf")) {
      return (<i className="fa-regular fa-file-pdf text-red-700" />)
    } else if (type.includes("msword") || type.includes("document")) {
      return (<i className="fa-solid fa-file-word text-blue-500" />)
    } else {
      return (<i className="fa-regular fa-file text-gray-500"></i>)
    }
  }, []);

  const downloadFile = useCallback((base64, fileName) => {
    if (base64 && fileName) {
      const file = convertBase64ToFile(base64, fileName);
      if (file) {
        saveAs(file, fileName)
      }
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (selectedRowKeys?.length > 0 && documents?.length > 0) {
      selectedRowKeys.forEach((key) => {
        let file = documents.find(x => x.key === key);
        downloadFile(file.base64, file.name);
      })
    }
  }, [selectedRowKeys, documents, downloadFile]);

  return (
    <>
      <CollapsibleGroup
        id={"title-documents"}
        title={"Documents"}
        subTitle={`(${documents?.length})`}
        expandCollapseCallback={() => handleExpandCollapseCallback("attachments")}
        popOutStateCallback={(val) => setShowPopOut(val)}
        value={viewConfig?.expanded ? true : showAttachments}
        style={{ marginTop: "0.5rem", backgroundColor: "#FFF" }}
        headerStyle={{ backgroundColor: "#EBEFF3" }}
        className="col-span-5"
        iconButtonsLeft={[
          {
            Icon: () => <i
              className="fa-solid fa-cloud-arrow-up text-blue-500 hover:cursor-pointer pr-1 hover:text-blue-400"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUpload(); }}
            />,
            tooltip: "Upload Document(s)",
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
            <div className="p-2 flex flex-wrap">
              {documents.map((d, index) => {
                return (
                  <Tooltip title={d.name} key={`document-${index}`}>
                    <div
                      className="hover:cursor-pointer hover:text-blue-500 hover:underline w-[20rem] whitespace-nowrap overflow-hidden overflow-ellipsis mr-2"                      
                      onClick={() => {
                        setSelectedDocument(d);
                        setShowDocument(true);
                      }}>
                      {<Icon type={d.type} />}<span className="ml-2">{d.fileNotes || d.name}</span>
                    </div>
                  </Tooltip>
                )
              })}
            </div>}
        </Collapse>
      </CollapsibleGroup>
      <AntUploadModal
        key={showUpload} // Force re-render to clear the old list after saving
        {...{
          showUpload,
          setShowUpload,
          title: "Upload Document(s)",
          setUploadFileList,
          allowedFileTypes
        }}
        onSave={handleSave}
      />
      <MuiModal
        title=""
        open={showDocument}
        onClose={() => { setShowDocument(false) }}
        centered
        okText="Save"
        style={{ width: "80vw", padding: "1rem", height: "90vh" }}
      >
        <div className="flex flex-row justify-between pb-3 text-gray-500 hover:cursor-pointer">
          <Button type="primary" onClick={() => openOnNewTab()}><i className="fa-solid fa-square-up-right"></i><span className="ml-3">Open in a separate tab</span></Button>
          <i className="fa-solid fa-xmark text-xl" onClick={() => setShowDocument(false)}></i>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <iframe
            id="documentIframe"
            title="Document Viewer"
            src={selectedDocument?.file?.base64 || selectedDocument?.base64}
            width="100%"
            height="92%"
            allowfullscreen
            className="z-10 pointer-events-auto overflow-hidden mt-[-2.5rem]"
          />
          <div className="absolute text-center bg-opacity-75 p-4 z-0">
            <Text className="text-gray-500">If the document fails to display, you can open it in a new tab by clicking the button on the upper left corner.</Text>
          </div>
        </div>
      </MuiModal>
      <MuiModal
        title=""
        open={showPopOut}
        onClose={() => { setShowPopOut(false); }}
        onCancel={() => { setShowPopOut(false); }}
        centered
        okText="Save"
        style={{ width: "80vw", padding: "1rem" }}
      >
        <div className="flex flex-row justify-between">
          <Title
            label={"Document Management"}
            className="inline-block mr-4 pt-1 pb-1 mb-3 pr-2"
            Icon={() => { return <i className="fa-solid fa-folder-open pr-2" /> }}>
          </Title>
          <div className="pl-8 pt-1">
            <i className="fa-solid fa-xmark text-xl text-gray-500 hover:cursor-pointer" onClick={() => { setShowPopOut(false); }} />
          </div>
        </div>
        <div className="flex flex-row justify-between pb-3 pt-3">
          <div className="flex flex-row">
            <Button
              type="primary"
              onClick={() => setShowUpload(true)}
              className="mr-3"
            >
              <i className="fa-solid fa-cloud-arrow-up pr-2" />
              Upload
            </Button>
            <Button
              type="primary"
              onClick={handleDownload}
              disabled={selectedRowKeys.length == 0}
            >
              <i className="fa-solid fa-download pr-2" />
              Download
            </Button>
          </div>
          <Popconfirm
            placement="left"
            title={"Delete File(s)"}
            description={
              <div className="pt-2">
                <div className="pb-2">Are you sure you want to delete the selected file(s)?</div>
              </div>
            }
            onConfirm={() => handleDeleteDocuments()}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length == 0}
            >
              <i className="fa-solid fa-trash-can pr-2" />
              Delete
            </Button>
          </Popconfirm>
        </div>
        <div style={{ borderTop: "1px dotted lightgrey" }} className="mb-3"></div>
        <Table
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={documents}
          pagination={false}
        />
      </MuiModal>
    </>
  )
}