"use client";
import React from "react";

import DownloadIcon from '@mui/icons-material/Download';
import PageviewIcon from '@mui/icons-material/Pageview';
import { textEllipsis } from "app/utils/utils";
import Tooltip from "app/components/atoms/tooltip/tooltip";
export default function Document(props) {
    const { onPreview, file, onCheck, onDownload, readOnly = false} = props;
     
    return (
        <div className="flex flex-row justify-between">
            <div
            className="flex"
                style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "noWrap",
                    paddingRight: "0.5rem",
                    paddingBottom: "5px",                    
                }}>

                {!readOnly && (
                    <input
                        type="checkbox"
                        className="mr-2 align-middle"
                        checked={file.checked}
                        onChange={(e) => { onCheck(file.id, e.target.checked) } }
                    />
                )}
    
                <span>                    
                    <Tooltip title={`Preview ${file.name}`}>
                        <div
                            className=" hover:cursor-pointer flex justify-between space-x-2"
                            onClick={() => onPreview(file.id)}
                        >
                            <div className="hover:underline hover:text-blue-700">
                                {textEllipsis(file.fileNotes ? file.fileNotes : file.name, 45)}
                            </div>
                            <div className="text-blue-600">
                                {` (${file.size} KB)`}
                            </div>
                        </div>
                    </Tooltip>
                </span>
            </div>
            <div className="flex flex-row justify-end">
                {false &&
                    <Tooltip title={`Preview ${file.name}`}>
                        <PageviewIcon className="text-blue-500 cursor-pointer hover:text-blue-400" style={{ fontSize: "1.3rem" }} onClick={() => onPreview(file.id)} />
                    </Tooltip>
                }
                <Tooltip title={`Download ${file.name}`}>
                    <DownloadIcon className="text-blue-500 cursor-pointer hover:text-blue-400" style={{ fontSize: "1.3rem" }} onClick={() => onDownload(file.id)} />
                </Tooltip>
            </div>
        </div>
    )
}