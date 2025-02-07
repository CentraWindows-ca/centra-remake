"use client";
import React from "react";

import DownloadIcon from '@mui/icons-material/Download';
import PageviewIcon from '@mui/icons-material/Pageview';

import Tooltip from "app/components/atoms/tooltip/tooltip";
import { read } from "fs";
export default function Attachment(props) {
    const { onPreview, file, onCheck, onDownload } = props;

    return (
        <div className="flex flex-row justify-between">
            <div
                style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "noWrap",
                    paddingRight: "0.5rem",
                    paddingBottom: "5px",                    
                }}>                
                <input
                    type="checkbox"
                    className="mr-2 align-middle"
                    checked={file.checked}
                    onChange={(e) => { onCheck(file.name, e.target.checked) } }
                />                    
                <span>                    
                    <Tooltip title={`Preview ${file.name}`}>
                        <span
                            className="hover:underline hover:text-blue-600 hover:cursor-pointer"
                            onClick={() => onPreview(file.name)}
                        >
                            {file.fileNotes || file.name}
                        </span>
                        <span className="pl-1 text-blue-700">{`(${file.size} KB)`}</span>
                    </Tooltip>
                </span>
            </div>
            <div className="flex flex-row justify-end">
                {false &&
                    <Tooltip title={`Preview ${file.name}`}>
                        <PageviewIcon className="text-blue-500 cursor-pointer hover:text-blue-400" style={{ fontSize: "1.3rem" }} onClick={() => onPreview(file.name)} />
                    </Tooltip>
                }
               
                <Tooltip title={`Download ${file.name}`}>
                    <DownloadIcon className="text-blue-500 cursor-pointer hover:text-blue-400" style={{ fontSize: "1.3rem" }} onClick={() =>  onDownload(file.base64, file.name)} />
                </Tooltip>
                
            </div>
        </div>
    )
}