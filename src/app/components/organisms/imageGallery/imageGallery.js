"use client"
import React, { useState } from "react";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import Modal from "app/components/atoms/modal/modal";
import { openBlob } from "app/utils/utils";

import { default as ImageCarousel } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { Popconfirm } from "antd";
export default function ImageGallery(props) {
    const {
        files,
        onUpload,
        imageHeight,
        cols,
        onDiscard,
        style,
        isReadOnly
    } = props;

    const [showImageCarousel, setShowImageCarousel] = useState(false);
    const [indexSelected, setIndexSelected] = useState(0);

    return (
        <div style={{ height: "100%", ...style }}>
            {files?.length > 0 &&
                <div>
                    {!isReadOnly &&
                        <div
                            className="absolute hover:cursor-pointer text-blue-500"
                            style={{
                                top: "4px",
                                paddingLeft: "0.2rem",
                                paddingRight: "0.2rem",
                                borderRadius: "2px",
                                backgroundColor: "#F5F5F5",
                                border: "1px dotted lightgrey",
                                zIndex: 2
                            }}
                            onClick={() => {
                                onUpload();
                            }}
                        >
                            <Tooltip title={"Add more attachments"}>
                                <div className="flex flex-row justify-center items-center">
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                    <Tooltip title="Number of attachments">
                                        <div
                                            className="pl-1"
                                            style={{ paddingTop: "1px", fontSize: "9px" }}>{`(${files.length})`}
                                        </div>
                                    </Tooltip>
                                </div>
                            </Tooltip>
                        </div>
                    }
                    {isReadOnly &&
                        <div
                            className="absolute text-blue-500"
                            style={{
                                paddingRight: "0.2rem",
                                borderRadius: "2px",
                                backgroundColor: "#F5F5F5",
                                border: "1px dotted lightgrey",
                                zIndex: 2
                            }}                           
                        >                           
                            <Tooltip title="Number of attachments">
                                <div
                                    className="pl-1"
                                    style={{ paddingTop: "1px", fontSize: "9px" }}>{`(${files.length})`}
                                </div>
                            </Tooltip>                                
                        </div>
                    }
                    <ul style={{
                        width: "100%",
                        height: imageHeight,
                        paddingLeft: "0.7rem",
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gap: "4px",
                        display: "grid",
                        overflowY: "auto",
                        marginBottom: 0
                    }}>
                        {files.map((file, index) => {
                            return (
                                <li
                                    key={index}       // TODO: Make properties uniform
                                    onClick={(e) => { // Dtos from createRemake and remakeItems are different hence the ||
                                        (file?.type?.includes("image") || file?.mimeType?.includes("image")) ?
                                            setShowImageCarousel(true) :
                                            openBlob(file?.base64?.split(',')[1], file.mimeType || file.type);                                                                                                                                                                    
                                        setIndexSelected(index);
                                    }}
                                    style={{
                                        gridColumnEnd: "span 1",
                                        gridRowEnd: "span 1",
                                        height: imageHeight,
                                        position: "relative"
                                    }}>
                                    <Tooltip title={file.fileNotes || file.name}>
                                        <div style={{ height: "100%" }}
                                            className="hover:cursor-pointer flex hover:opacity-75 p-2">
                                            {(file?.type?.includes("image") || file?.mimeType?.includes("image")) && // Dtos from createRemake and remakeItems are different hence the ||
                                                <img
                                                    src={file.base64}
                                                    height={imageHeight}
                                                    alt={file.title}
                                                    loading="lazy"
                                                    style={{ objectFit: "contain" }}
                                                />
                                            }
                                            {(!file?.type?.includes("image") && !file?.mimeType?.includes("image")) && // Dtos from createRemake and remakeItems are different hence the ||
                                                <div
                                                    style={{ width: "100%", height: "100%" }}
                                                    className="flex items-center justify-center"
                                                >                                                    
                                                    <div className="text-center text-gray-500"><i className="fa-solid fa-file pr-2"></i>{file.fileNotes || file.name}</div>                                                 
                                                </div>
                                            }
                                        </div>
                                    </Tooltip>
                                    {!isReadOnly &&
                                        <div
                                            className="absolute z-10" style={{ right: 5, bottom: 5 }}>
                                            <Tooltip title={"Discard photo"}>
                                                <Popconfirm
                                                    placement="left"
                                                    title={"Discard Photo"}
                                                    description={<div className="pb-2"><div>{`Do you wish to proceed?`}</div></div>}
                                                    onConfirm={(e) => { e.stopPropagation(); onDiscard(file); }}

                                                    okText="Yes"
                                                    cancelText="No"
                                                    onClick={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                    onCancel={(e) => { e.stopPropagation(); e.preventDefault() }}
                                                >
                                                    <i
                                                        className="fa-solid fa-trash-can text-red-500 hover:cursor-pointer"
                                                    />
                                                </Popconfirm>
                                            </Tooltip>
                                        </div>
                                    }
                                </li>)
                        })}
                    </ul>
                </div>
            }
            {!files?.length > 0 && !isReadOnly &&
                <div style={{ height: "100%", width: "100%" }} className="flex justify-center items-center text-blue-500">
                    <div
                        className="hover:cursor-pointer hover:text-blue-500"
                        onClick={() => {
                            onUpload();
                        }}>
                        <i className="fa-solid fa-cloud-arrow-up pr-2"></i>
                        <span className="text-sm">Add Attachments</span></div>
                </div>
            }
            <Modal
                open={showImageCarousel}
                onClose={() => setShowImageCarousel(false)}
            >
                <ImageCarousel
                    items={files?.map(x => {
                        return {
                            original: x.base64,
                            thumbnail: x.base64,
                            description: x.fileNotes || x.name,
                        }
                    })}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    showThumbnails={false}
                    showIndex={true}
                    startIndex={indexSelected}
                    onErrorImageURL="/no-preview.jpg"
                />
            </Modal>
        </div>
    )
}
