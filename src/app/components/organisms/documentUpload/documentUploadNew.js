"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { createStyles, makeStyles } from "@mui/styles";

import { DropzoneArea } from "material-ui-dropzone";

import DocumentRow from "app/components/atoms/documentRow/documentRow";

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
      color: "darkgrey !important",
      width: "35px !important",
      height: "40px !important",
    },
    previewContainer: {},
  })
);

export default function DocumentUploadNew(props) {
  const {
    key,
    style,
    documents,
    setContainsNewUnsavedFiles,
    hideAlias,
    fileData,
    setFileData,
    isNew = false,
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

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
              };
              setFileData((d) => {
                let _d = [...d];
                let exists = _d.find((x) => x.name === item.name);
                if (!exists) {
                  _d.push(item);
                }
                return _d;
              });
            }
          };
        });
      });
    }
  };

  useEffect(() => {
    if (documents) {
      if (isNew) {
        setFileData(documents);
      } else {
        setFileData((fileData) => {
          let _fileData = [...fileData];
          documents.forEach((d) => {
            if (!_fileData.find((x) => x.id === d.id)) {
              _fileData.push(d);
            }
          });

          return _fileData;
        });
      }
    }
  }, [documents, isNew, setFileData]);

  const handleNotesChange = (e, name) => {
    if (e && name) {
      setFileData((fd) => {
        let _fd = JSON.parse(JSON.stringify(fd));
        const index = _fd.findIndex((x) => x.name === name);
        _fd[index].fileNotes = e.target.value;
        return _fd;
      });
      setContainsNewUnsavedFiles(true);
    }
  };

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
            dropzoneText={"Drag and drop or click to add files"}
          />
        </div>
        <div
          className={`mt-3 pl-1 pr-1 ml-4 mr-4 table-fixed`}
          style={{ overflow: "auto", width: "30rem", maxHeight: "20rem" }}
        >
          <table className="text-sm w-100">
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
                if (_isNew) {
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
