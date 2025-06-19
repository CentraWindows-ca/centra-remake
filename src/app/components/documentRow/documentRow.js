"use client";
import React, { useState, useEffect } from "react";

import Tooltip from "app/components/tooltip/tooltip";
import { openFile } from "app/utils/utils";

export default function DocumentRow(props) {
  const {
    filename,
    base64,
    type,
    index,
    allowRemove,
    removeFile,
    notes,
    isNew,
    size,
    handleNotesChange,
    hideAlias,
  } = props;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true when component mounts
    return () => {
      setIsMounted(false); // Set isMounted to false when component unmounts
    };
  }, []);

  // Return null if component is rendered on the server
  if (!isMounted) {
    return null;
  }

  return (
    <tr>
      <td
        className="truncate max-w-0 cursor-pointer"
        onClick={() =>
          openFile(base64?.split(",")[1] ?? base64, type, filename)
        }
      >
        <Tooltip title={`Preview ${filename}`}>
          {isNew && <span className="pr-1 text-amber-500">*</span>}
          <span className="hover:text-blue-600 hover:underline">
            {filename}
          </span>
        </Tooltip>
      </td>
      <td>{`${size}KB`}</td>
      {!hideAlias && (
        <td>
          <input
            type="text"
            value={notes}
            className="border rounded w-100 p-1"
            onChange={handleNotesChange}
          />
        </td>
      )}
    </tr>
  );
}
