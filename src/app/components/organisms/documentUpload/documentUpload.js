"use client";
import styles from "./documentUpload.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createStyles, makeStyles } from "@mui/styles";

import { DropzoneArea } from "material-ui-dropzone";

import DocumentRow from "app/components/atoms/documentRow/documentRow";

import { updateTempFiles } from "app/redux/orders";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: "150px !important",
    },
    text: {
      color: "#6C757D !important",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important',
      fontSize: "1.1rem !important",
      padding: "0 1rem 0 1rem",
    },
    textContainer: {},
    icon: {
      color: "rgb(59 130 246) !important",
      width: "35px !important",
      height: "40px !important",
    },
    previewContainer: {},
  })
);

export default function DocumentUpload(props) {
  const { key, style, documents, setContainsNewUnsavedFiles, hideAlias } =
    props;

  const [fileData, setFileData] = useState([]);

  const classes = useStyles();
  const dispatch = useDispatch();

  const { isMobile } = useSelector((state) => state.app);

  const handleChange = (files) => {
    if (files && files.length > 0) {
      files.forEach((file) => {
        let item = {};

        file.arrayBuffer().then((arrayBuffer) => {
          const reader = new FileReader();
          const blob = new Blob([new Uint8Array(arrayBuffer)], {
            type: file.type,
          });
          reader.readAsDataURL(blob);

          reader.onloadend = () => {
            let base64 = reader.result;
            if (base64) {
              item = {
                name: file.name,
                base64: base64,
                type: file.type,
                size: (file.size / 1024).toFixed(2),
                fileNotes: "",
              };
              setFileData((d) => {
                let _d = [...d];
                let exists = _d.find((x) => x.name === item.name);
                if (!exists) {
                  _d.push(item);
                }

                dispatch(updateTempFiles(_d));

                return _d;
              });
            }
          };
        });
      });
    }
  };

  //const openBase64InNewTab = (data, mimeType) => {
  //    var byteCharacters = atob(data);
  //    var byteNumbers = new Array(byteCharacters.length);
  //    for (var i = 0; i < byteCharacters.length; i++) {
  //        byteNumbers[i] = byteCharacters.charCodeAt(i);
  //    }
  //    var byteArray = new Uint8Array(byteNumbers);
  //    var file = new Blob([byteArray], { type: mimeType + ';base64' });
  //    var fileURL = URL.createObjectURL(file);
  //    window.open(fileURL);
  //    console.log("fileURL", fileURL)
  //}

  //const removeFile = useCallback((index) => {
  //    if (setFileData) {
  //        setFileData(d => {
  //            let _d = [...d];
  //            _d.splice(index, 1);
  //            return _d;
  //        });
  //    }
  //}, [setFileData]);

  // Merge documents from db and documents from dropzone
  useEffect(() => {
    if (documents) {
      setFileData((fileData) => {
        let _fileData = [...fileData];
        documents.forEach((d) => {
          if (!_fileData.find((x) => x.name === d.name)) {
            _fileData.push(d);
          }
        });

        return _fileData;
      });
    }
  }, [documents]);

  useEffect(() => {
    if (setContainsNewUnsavedFiles) {
      setContainsNewUnsavedFiles(false);
    }
  }, [setContainsNewUnsavedFiles]);

  const handleNotesChange = useCallback(
    (e, name) => {
      if (e && name) {
        setFileData((fd) => {
          let _fd = JSON.parse(JSON.stringify(fd));
          const index = _fd.findIndex((x) => x.name === name);
          _fd[index].fileNotes = e.target.value;
          dispatch(updateTempFiles(_fd));
          return _fd;
        });

        if (setContainsNewUnsavedFiles) {
          setContainsNewUnsavedFiles(true);
        }
      }
    },
    [dispatch, setFileData, setContainsNewUnsavedFiles]
  );

  return (
    <div
      style={{ ...style, fontFamily: "inherit" }}
      className={classes.root}
      key={key}
    >
      <div className="flex flex-column pt-2">
        <div className="pl-5 pr-5 pt-2">
          <DropzoneArea
            dropzoneClass={classes.root}
            onChange={handleChange}
            filesLimit={99}
            showPreviewsInDropzone={false}
            useChipsForPreview={false}
            showFileNames={false}
            showPreviews={false}
            showAlerts={false}
            showFileNamesInPreview={false}
            dropzoneParagraphClass={classes.dropZoneText}
            maxFileSize={3000000}
            classes={{
              root: classes.root,
              text: classes.text,
              icon: classes.icon,
              textContainer: classes.textContainer,
            }}
            dropzoneText={"Drag and drop or click to add files."}
          />
        </div>
        <div
          className={`mt-3 pl-1 pr-1 ml-4 mr-4 table-fixed`}
          style={{ overflow: "auto", maxHeight: "30rem" }}
        >
          <table className="text-sm">
            <tbody>
              <tr>
                <td style={{ width: "40%" }} className="font-semibold">
                  Filename
                </td>
                <td style={{ width: "15%" }} className="font-semibold">
                  Size
                </td>
                {!hideAlias && (
                  <td style={{ width: "45%" }} className="font-semibold">
                    Notes / Alias
                  </td>
                )}
              </tr>
              {fileData.map((file, index) => {
                let _isNew = !documents.find((x) => x.name === file.name);
                if (_isNew && setContainsNewUnsavedFiles) {
                  setContainsNewUnsavedFiles(true);
                }
                return (
                  <DocumentRow
                    key={index}
                    filename={file.name}
                    index={index}
                    allowRemove={true}
                    //removeFile={removeFile}
                    type={file.type}
                    base64={file.base64}
                    notes={file.fileNotes}
                    isNew={_isNew}
                    size={file.size}
                    handleNotesChange={(e) => handleNotesChange(e, file.name)}
                    hideAlias={hideAlias}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
