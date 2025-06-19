"use client";
import React, { useState, useCallback } from "react";
import Tooltip from "app/components/tooltip/tooltip";
import { Image, Space, Popconfirm, Checkbox } from 'antd';

import EditableLabel from "app/components/editableLabel/editableLabel";

import { downloadFile } from "app/utils/utils";

import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DeleteOutlined
} from '@ant-design/icons';

export default function PhotoGrid({ photos, setPhotos, className, showTitle, showCheckbox, size, selectedIndexes, setSelectedIndexes }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(-1);
  
  const handleDownload = useCallback(() => {
    if (activePhotoIndex > -1) {
      downloadFile(photos[activePhotoIndex]?.base64, photos[activePhotoIndex]?.name)
    }
  }, [photos, activePhotoIndex]);

  const handleDelete = useCallback(() => {
    if (activePhotoIndex > -1) {
      setPhotos(prev => {
        let _prev = [...prev];
        if (_prev?.length > 0) {
          _prev.splice(activePhotoIndex, 1);
          return _prev;
        }
      })
    }
  }, [activePhotoIndex, setPhotos]);

  const handleEditNote = useCallback((val, index) => {    
    if (photos?.length > 0) {
      setPhotos(prev => {
        let _prev = [...prev];
        _prev[index].fileNotes = val;
        return _prev;
      });
    }        
  }, [photos, setPhotos]);

  const handleCheckboxChange = (e, index) => {
    if (index > -1) {
      let exists = selectedIndexes.findIndex(x => x === index) > -1;

      if (!exists) { // Add
        setSelectedIndexes(prev => {
          let _prev = [...prev];
          _prev.push(index);
          return _prev;
        });
      } else { // Remove
        setSelectedIndexes(prev => {
          let _prev = [...prev];
          let indexInSelectedIndexes = _prev.findIndex(x => x === index);
          _prev.splice(indexInSelectedIndexes, 1);
          return _prev;
        });
      }
    }
  }

  return (
    <Image.PreviewGroup
      preview={{
        toolbarRender: (
          _,
          {
            transform: { scale },
            actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
          },
        ) => (
          <Space size={12} className="toolbar-wrapper">
            <Tooltip title="Download Photo">
              <DownloadOutlined className="text-2xl" onClick={handleDownload} />
            </Tooltip>
            <ZoomOutOutlined className="text-2xl" disabled={scale === 1} onClick={onZoomOut} />
            <ZoomInOutlined className="text-2xl" disabled={scale === 50} onClick={onZoomIn} />
            <SwapOutlined className="text-2xl" rotate={90} onClick={onFlipY} />
            <SwapOutlined className="text-2xl" onClick={onFlipX} />
            <RotateLeftOutlined className="text-2xl" onClick={onRotateLeft} />
            <RotateRightOutlined className="text-2xl" onClick={onRotateRight} />
            <Tooltip title="Delete Photo">
              <Popconfirm
                placement="top"
                title={"Delete Photo"}
                description={<div className="pt-2">
                  <div>Are you sure you want to delete this photo?</div>
                </div>}
                onConfirm={() => { handleDelete(); }}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="text-2xl" />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
        imageRender: (originalNode => {
          const _src = originalNode?.props.src;
          let index = photos.findIndex(x => x.base64 === _src);
          let _photo = photos[index];
          return (
            <>
              <div style={{ position: "absolute", color: "#FFF", top: 100 }}>
                <EditableLabel
                  title={"Edit Note"}
                  value={_photo?.fileNotes}
                  iconClass="text-slate-200 pl-1"
                  onSave={(val) => { handleEditNote(val.note, index); }}
                  inputKey={"note"}
                >
                  {_photo?.fileNotes}
                </EditableLabel>
              </div>
              {React.cloneElement(originalNode)}
            </>
          )
        }),
        onChange: (index) => { setActivePhotoIndex(index); }
      }}
    >
      <div className={`p-1 flex flex-row flex-wrap flex-start w-100 gap-1 overflow-y-auto ${className} justify-start`}>
        {photos?.map((p, index) => {
          return (
            <div key={`installation-photo-${index}`}>
              {showTitle &&
                <figure >
                  <Image
                    alt={p?.fileNotes || p?.name}
                    src={p.base64}                    
                    style={{ width: size || "50px", height: size || "50px", objectFit: "cover" }}
                    preview={{ movable: true, mask: () => <div></div> }}
                    onClick={() => { setActivePhotoIndex(index) }} // Mark active photo in case needed when downloading or deleting
                  />
                  <figcaption
                    className="pr-1 pt-2 max-w-[9rem] text-xs"
                  >
                    <div className="flex flex-row">                      
                      <Checkbox
                        onChange={(e) => handleCheckboxChange(e, index)}
                        className="mt-[-3px]"
                        checked={selectedIndexes?.findIndex(x => x === index) > -1}
                      />
                      <span className="pl-2">
                        <EditableLabel
                          title={"Edit Note"}
                          value={p?.fileNotes}
                          iconClass="text-slate-200 pl-1"
                          className={`min-w-[11rem] hover:cursor-pointer hover:text-blue-400`}
                          onSave={(val) => { handleEditNote(val.note, index); }}
                          inputKey={"note"}
                          onClick={(e) => handleCheckboxChange(e, index)}
                        >
                          {p?.fileNotes}
                        </EditableLabel>
                      </span>
                    </div>
                  </figcaption>
                </figure>
              }
              {!showTitle &&
                <Image
                  alt={p?.fileNotes || p?.name}
                  src={p.base64}                  
                  style={{ width: size || "50px", height: size || "50px", objectFit: "cover" }}
                  preview={{ movable: true, mask: () => <div></div> }}
                  onClick={() => { setActivePhotoIndex(index) }} // Mark active photo in case needed when downloading or deleting
                />
              }
            </div>
          )
        })}
      </div>
    </Image.PreviewGroup>
  )
}