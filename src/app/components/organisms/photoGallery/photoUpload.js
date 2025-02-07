"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { createStyles, makeStyles } from "@mui/styles";

import { DropzoneArea } from "material-ui-dropzone";

import PhotoRow from "./photoRow";

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

const acceptedFileFormats = [".png", ".jpg"];

export default function PhotoUpload(props) {
  const { key, style, tempPhotos, setTempPhotos, setContainsNewUnsavedImages } =
    props;

  const [fileData, setFileData] = useState([]);

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
    if (fileData && fileData.length > 0) {
      setTempPhotos(fileData);
      setContainsNewUnsavedImages(true);
    }
  }, [fileData, setContainsNewUnsavedImages, setTempPhotos]);

  // useEffect(() => {
  //     if (tempPhotos) {
  //         setTempPhotos(photoData => {
  //             let _photoData = [...photoData];
  //             tempPhotos.forEach((d) => {
  //                 if (!_photoData.find(x => x.name === d.name)) {
  //                     _photoData.push(d);
  //                 }
  //             });

  //             return _photoData;
  //         });
  //     }
  // }, [tempPhotos]);

  // useEffect(() => {
  //     setContainsNewUnsavedImages(false);
  // }, [setContainsNewUnsavedImages]);

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
            acceptedFiles={acceptedFileFormats}
            classes={{
              root: classes.root,
              text: classes.text,
              icon: classes.icon,
              textContainer: classes.textContainer,
            }}
            dropzoneText={"Drag and drop or click to add files."}
          />
        </div>
      </div>
      <div
        className={`mt-3 pl-1 pr-1 ml-4 mr-4 table-fixed`}
        style={{ overflow: "auto", width: "30rem", maxHeight: "30rem" }}
      >
        <table className="text-sm w-100">
          <tr>
            <td style={{ width: "60%" }} className="font-semibold">
              Filename
            </td>
            <td style={{ width: "40%" }} className="font-semibold">
              Size
            </td>
          </tr>
          {tempPhotos.map((photo, index) => {
            return (
              <PhotoRow
                key={index}
                filename={photo.name}
                index={index}
                allowRemove={true}
                //removeFile={removeFile}
                type={photo.type}
                base64={photo.base64}
                isNew={true}
                size={photo.size}
              />
            );
          })}
        </table>
      </div>
    </div>
  );
}
