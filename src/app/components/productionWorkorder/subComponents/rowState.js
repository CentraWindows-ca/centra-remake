"use client";
import React, { useCallback } from "react";

import Tooltip from "app/components/tooltip/tooltip";

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export default function RowStatus(props) {
  const {
    id,
    table,
    statusKey,
    onChange,
    rowStates,
    isEditable
  } = props;

  let statusOptions = Object.entries(rowStates).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color }
  });

  const handleDropdownItemClick = useCallback((e) => {
    if (e) {
      let _newStatus = statusOptions.find(x => x.value === e.target.innerText);
      onChange({
        detailRecordId: id,
        status: _newStatus,
        table: table
      });
    }
  }, [id, table, statusOptions, onChange]);

  return (
    <Tooltip title="Click to update status">
      <DropdownButton
        className="custom-dropdown"
        style={{
          backgroundColor: rowStates[statusKey]?.color,
          textAlign: "center",
          width: "9rem",
          marginRight: 0,
          borderRadius: "3px"
        }}
        size={"sm"}
        variant={"Primary"}
        title={
          <span style={{
            color: statusKey === "readyToShip" ? "var(--darkgrey)" : "#FFF",
            width: "9rem",
            fontSize: "0.9rem",
            marginTop: "-5px",
            fontWeight: 500
          }}>
            {rowStates[statusKey]?.label}
          </span>
        }
      >
        {statusOptions.map((s) =>
          <Tooltip title={!isEditable ? "You currently have read-only access" : ""} key={s.key}>
            <Dropdown.Item
              disabled={!isEditable}
              onClick={handleDropdownItemClick}
              style={{ fontSize: "0.9rem" }}
            >
              {s.value}
            </Dropdown.Item>
          </Tooltip>
        )}
      </DropdownButton>
    </Tooltip>
  )
}