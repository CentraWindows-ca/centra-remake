"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import LockButton from "app/components/atoms/lockButton/lockButton";
import Title from "app/components/atoms/title/title";

import { Button, Popover, Space, Input } from "antd";
const { TextArea } = Input;

export default function EditableLabel(props) {
  const {
    inputKey,
    style,
    className,
    value,
    title,
    onSave,
    iconClass,
    onClick,
    hasNoEditButton,
    okLabel,
    multiline,
  } = props;

  const { isReadOnly } = useSelector((state) => state.app);

  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onChange = (e) => {
    if (e) {
      setInputValue(e.target?.value);
    }
  };

  const handleSave = useCallback(
    (e) => {
      if (e) {
        onSave({ [`${inputKey}`]: inputValue });
        setOpen(false);
      }
    },
    [inputValue, onSave, inputKey]
  );

  const content = (
    <div>
      <Title
        label={title}
        className="inline-block mr-4 pt-1 pb-1 mb-3 pr-2"
        Icon={() => {
          return <i className="fa-solid fa-pen pr-2" />;
        }}
      ></Title>
      {!multiline && (
        <Input className="mb-3" value={inputValue} onChange={onChange} />
      )}
      {multiline && (
        <TextArea
          className="mb-3"
          rows={4}
          value={inputValue}
          onChange={onChange}
        />
      )}
      <div className="flex w-100 justify-end">
        <Space>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <LockButton
            onClick={handleSave}
            disabled={isReadOnly || value === inputValue}
            showLockIcon={isReadOnly}
            label={okLabel || "Save"}
          />
        </Space>
      </div>
    </div>
  );

  return (
    <div className={`${className} flex flex-row`} style={{ ...style }}>
      <span
        className={`pr-1 ${
          hasNoEditButton ? "hover:text-blue-500 hover:cursor-pointer" : ""
        }`}
        onClick={hasNoEditButton ? () => setOpen(true) : onClick}
      >
        <Tooltip title={hasNoEditButton ? title : ""}>{props.children}</Tooltip>
      </span>
      <Tooltip title={title}>
        <Popover content={content} trigger="click" open={open}>
          <div
            className={`${iconClass} ${
              hasNoEditButton ? "opacity-0" : "opacity-100"
            }`}
          >
            <i
              className={`fa-solid fa-pen hover:text-blue-600 hover:cursor-pointer`}
              style={{ fontSize: "0.6rem" }}
              onClick={() => setOpen(true)}
            ></i>
          </div>
        </Popover>
      </Tooltip>
    </div>
  );
}
