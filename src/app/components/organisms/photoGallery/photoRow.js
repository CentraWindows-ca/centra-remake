"use client";
import React from "react";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import { downloadFile } from "app/utils/utils";

export default function PhotoRow(props) {
    const {
        filename,
        base64,
        type,
        index,
        allowRemove,
        removeFile,
        isNew,
        size
    } = props;

    const openFile = (data, mimeType) => {
        var byteCharacters = atob(data);
        var byteNumbers = new Array(byteCharacters.length);

        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        var file = new Blob([byteArray], { type: mimeType + ';base64' });
        var fileURL = URL.createObjectURL(file);

        downloadFile(fileURL, filename);
    }

    return (
        <tr>
            <td
                className="truncate max-w-0 cursor-pointer"
                onClick={() => openFile(base64.split(',')[1] ?? base64, type)}
            >
                <Tooltip
                    title={`Preview ${filename}`}
                >
                    {isNew && <span className="pr-1 text-amber-500">*</span>}
                    <span className="hover:text-blue-600 hover:underline">{filename}</span>                    
                </Tooltip>
            </td>
            <td>
                {`${size}KB`}
            </td>
        </tr>
    ) 
}
