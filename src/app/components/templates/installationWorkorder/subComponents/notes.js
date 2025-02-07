"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "react-query";
import moment from "moment";

import Title from "app/components/atoms/title/title";
import MuiModal from "app/components/atoms/modal/modal";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import AntDatePicker from "app/components/atoms/datePicker/datePicker";
import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import EditableLabel from "app/components/atoms/editableLabel/editableLabel";

import Collapse from "@mui/material/Collapse";
import { Tag, Dropdown, Menu, Modal, Input, Popconfirm, Button, Table } from "antd";
const { TextArea } = Input;

import { fetchNotesByParentId, updateNotes } from 'app/api/installationApis';
import { InstallationNoteCategories } from "app/utils/constants";
import { YMDDateFormat, TimeFormat } from "app/utils/utils";

export default function Notes({
  style,
  viewConfig,
  showNotes,
  className,
  handleExpandCollapseCallback,
  recordId,
  actionItemId
}) {
  const { isFetching,
    data: notesRaw,
    refetch } = useQuery("installationNotes", () => {
      if (recordId) {
        return fetchNotesByParentId(recordId)
      }
    }, { enabled: true });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showNewNote, setShowNewNote] = useState(false);
  const [showPopOut, setShowPopOut] = useState(false);
  const [date, setDate] = useState(moment());
  const [notes, setNotes] = useState(null);        
  const [text, setText] = useState(null);
  
  const { result } = useSelector(state => state.calendar);
  const { userData, isMobile } = useSelector(state => state.app);

  useEffect(() => {
    if (notesRaw?.data) {
      setNotes(notesRaw.data?.map((note, index) => {
        return { ...note, key: `note-${index}` }
      }));
    }
  }, [notesRaw]);

  const MenuItems = useCallback(({ onItemClick }) => {
    return (
      <Menu>
        {InstallationNoteCategories.map((x, index) => {
          return (
            <Menu.Item
              key={index}
              className="p-0 m-0 pb-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Tag
                color={x.color}
                className="m-0 w-[6rem] hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onItemClick(x);
                }}
              >
                <i className="fa-solid fa-angles-right pr-1" />
                {x.label}
              </Tag>
            </Menu.Item>)
        })}
      </Menu>
    )
  }, []);

  const handleDateChange = (val) => {
    if (val) {
      setDate(val);
    }
  }

  const handleTextChange = (e) => {
    if (e) {
      setText(e.target.value);
    }
  }

  const handleSaveNewNote = useCallback((e) => {
    setShowNewNote(false);
    setText(null);
    let originalData = notes?.map(n => { // Grab all original notes
      return {
        GerneralNotesDate: n.date, // FF table column name is misspelled
        Category: n.category,
        GeneralNotes: n.note,
        CalledBy1: ["centrarest"] // Api endpoint requires FF user be passed for each notes being added
      }
    });

    originalData.push({ // Attach the new note
      GerneralNotesDate: moment(date).format("YYYY-MM-DDTHH:mm:ss"),
      Category: selectedCategory,
      GeneralNotes: text,
      CalledBy1: ["centrarest"],
      LoggedBy1: userData?.name
    })

    let data = { GeneralNotesList: [...originalData] };

    updateNotes({ // Pass everything to update endpoint
      module: "HomeInstallations",
      actionItemId: actionItemId,
      jsonGeneralNotes: JSON.stringify(data)
    });
  }, [notes, date, text, selectedCategory, actionItemId, userData?.name]);

  const handleSaveAllNotes = useCallback((e) => {
    if (e) {
      let data = notes?.map(n => { // Grab all original notes
        return {
          GerneralNotesDate: n.date, // FF table column name is misspelled
          Category: n.category,
          GeneralNotes: n.note,
          CalledBy1: ["centrarest"] // Api endpoint requires FF user be passed for each notes being added
        }
      });

      updateNotes({ // Pass everything to update endpoint
        module: "HomeInstallations",
        actionItemId: actionItemId,
        jsonGeneralNotes: JSON.stringify({ GeneralNotesList: [...data] })
      });

      setShowPopOut(false);
      setIsFormModified(false);
    }    
  }, [notes, actionItemId]);

  const handleEditOk = useCallback((payload, originalData, index) => {
    const key = Object.keys(payload)[0];
    if (key && index > -1) {
      setNotes(prev => {
        let _prev = [...prev];
        _prev[index][key] = payload[key];
        return _prev;
      })
    }
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sertDirections: ["descend"],
      render: (date) =>
      (
        <div>
          {YMDDateFormat(date)}
        </div>
      )
    },
    {
      title: "Time",
      dataIndex: "date",
      key: "date",
      width: 100,
      render: (date) =>
      (
        <div>
          {TimeFormat(date)}
        </div>
      )
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note, originalData, x) =>
      (
        <div onClick={() => {

        }}>
          <EditableLabel
            inputKey={"note"}
            title={"Edit Notes"}
            value={note}
            onSave={(data) => { handleEditOk(data, originalData, x); setIsFormModified(true); }}
            iconClass="mt-[-2px] text-blue-500"
            okLabel={"Ok"}
          >
            {note || "<Click to add>"}
          </EditableLabel>
        </div>
      )
    },
    {
      title: "Logged By",
      dataIndex: "loggedBy",
      key: "loggedBy",
      width: 150,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category?.toLowerCase().localeCompare(b.category?.toLowerCase()),
      width: 120,
      render: (category, row, index) =>
      (
        <Dropdown
          overlay={<MenuItems onItemClick={(val) => {
            setNotes(prev => { let _prev = [...prev]; _prev[index].category = val.value; return _prev; });
            setIsFormModified(true);
          }} />}
          placement="topLeft"
          arrow trigger={['click']}
        >
          <Tag color={InstallationNoteCategories.find(x => x.value === category)?.color} className="text-[0.8rem] hover:cursor-pointer">
            {category}
          </Tag>
        </Dropdown>
      )
    }
  ];

  const rowSelection = useMemo(() => {
    return {
      onChange: (_selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(_selectedRowKeys);
      },
      getCheckboxProps: (record) => ({})
    }
  }, []);

  const handleDeleteNotes = useCallback(() => {
    if (notes?.length > 0) {
      setNotes(prev => {
        let newList = [];
        prev.forEach((n) => {
          let isSelected = selectedRowKeys.find(k => k === n.key);
          if (!isSelected) {
            newList.push(n);
          }
        });
        setSelectedRowKeys([]);
        return newList;
      });
      setIsFormModified(true);
    }
  }, [notes, selectedRowKeys]);

  useEffect(() => {    
    if (result?.type === "success" && result?.source === "Installation Notes") {
      refetch();
    }
  }, [result, refetch]);

  return (
    <CollapsibleGroup
      id={"title-notes"}
      title={"Notes"}
      subTitle={`(${notes?.length})`}
      expandCollapseCallback={() => handleExpandCollapseCallback("notes")}
      popOutStateCallback={(val) => setShowPopOut(val)}
      value={viewConfig?.expanded ? true : showNotes}
      style={{ marginTop: "1rem", backgroundColor: "#FFF" }}
      headerStyle={{ backgroundColor: "#FCF8E3" }}
      ActionButton={() => (
        <Tooltip title="Add a note">
          <Dropdown
            overlay={<MenuItems onItemClick={(val) => { setSelectedCategory(val.value); setShowNewNote(true); }} />}
            placement="topLeft"
            arrow trigger={['click']}
          >
            <Tag
              className="text-xs bg-[#3B82F6] hover:bg-blue-400 text-white"
              onClick={
                (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
              <i className="fa-solid fa-plus" />
            </Tag>
          </Dropdown>
        </Tooltip>
      )}
    >
      <Collapse in={viewConfig?.expanded ? true : showNotes}>
        {notes?.length > 0 &&
          <div className={`${className} p-2 flex flex-wrap justify-between mt-1`}>
            {notes?.map((n, index) => {
              const color = InstallationNoteCategories.find(x => x.value === n.category)?.color;
              return (
                <div key={`note-${index}`} style={{ width: isMobile ? "100%" : "49.5%", borderBottom: "1px dotted lightgrey" }} className="pb-1 mb-2"> {/* 49 to Leave space in between notes */}
                  <div>
                    <div className="flex flex-row justify-between">
                      <span>
                        <Tag color={color}>{n.category}</Tag>
                        <Tag>{n.loggedBy}</Tag>
                      </span>
                      <div>
                        <Tag>
                          <span className="font-semibold">{YMDDateFormat(n.date)}</span>
                          <span className="pl-2 text-blue-700">{TimeFormat(n.date)}</span>
                        </Tag>
                      </div>
                    </div>
                    <div className="mt-2">
                      {n.note}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </Collapse>
      <Modal
        centered
        cancelButtonProps={{
          size: "small"
        }}
        title={
          <Tag color={InstallationNoteCategories.find(x => x.value === selectedCategory)?.color} className="text-[0.8rem]">
            {`New Note - ${selectedCategory}`}
          </Tag>
        }
        open={showNewNote} onOk={() => { }}
        onCancel={() => { setShowNewNote(false) }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Popconfirm
              placement="left"
              title={"Add Note"}
              description={
                <div className="pt-2">
                  <div className="pb-2">Are you sure you want to save?</div>
                </div>
              }
              onConfirm={handleSaveNewNote}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" disabled={(!date || !text)}>
                Save
              </Button>
            </Popconfirm>
          </>
        )}
      >
        <div className="mt-[14px]">
          <div className="flex flex-row justify-between mb-2">
            <AntDatePicker
              format="YYYY-MM-DD hh:mm a"
              size="small"
              defaultValue={date}
              value={date}
              onChange={handleDateChange}
              showTime
            />
          </div>
          <TextArea
            rows={4}
            placeholder=""
            value={text}
            onChange={handleTextChange}
          />
        </div>
      </Modal>
      <MuiModal
        title=""
        open={showPopOut}
        onCancel={() => { setShowPopOut(false); }}
        centered
        okText="Save"
        style={{ width: "80vw", padding: "1rem" }}
      >
        <div className="flex flex-row justify-between">
          <Title
            label={"Notes Management"}
            className="inline-block mr-4 pt-1 pb-1 mb-3 pr-2"
            Icon={() => { return <i className="fa-solid fa-folder-open pr-2" /> }}>
          </Title>
          <div className="pl-8 pt-1">
            {isFormModified &&
              <Popconfirm
                placement="left"
                title={"Close"}
                description={
                  <div className="pt-2">
                    <div className="pb-2">You have unsaved changes, are you sure?</div>
                  </div>
                }
                onConfirm={() => { setIsFormModified(false); refetch(); setShowPopOut(false); }}
                okText="Yes"
                cancelText="No"
              >
                <i className="fa-solid fa-xmark text-xl text-gray-500 hover:cursor-pointer" />
              </Popconfirm>
            }
            {!isFormModified &&
              <i className="fa-solid fa-xmark text-xl text-gray-500 hover:cursor-pointer" onClick={() => { setShowPopOut(false); }} />
            }
          </div>
        </div>
        <div className="flex flex-row justify-between pb-3 pt-3">
          <Popconfirm
            placement="left"
            title={"Delete Notes(s)"}
            description={
              <div className="pt-2">
                <div className="pb-2">Are you sure you want to delete the selected note(s)?</div>
              </div>
            }
            onConfirm={handleDeleteNotes}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length === 0}
            >
              <i className="fa-solid fa-trash-can pr-2" />
              Delete
            </Button>
          </Popconfirm>
          <div className="flex flex-row">            
            {isFormModified &&
              <Tooltip title="Changes not saved.">
                <i className="fa-solid fa-asterisk text-xs text-orange-300 mt-1 mr-2"></i>
              </Tooltip>
            }
            <Popconfirm
              placement="left"
              title={"Save Updates"}
              description={
                <div className="pt-2">
                  <div className="pb-2">Are you sure you want to save all your updates?</div>
                </div>
              }
              onConfirm={handleSaveAllNotes}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"                
                disabled={!isFormModified}
              >
                Save
              </Button>
            </Popconfirm>            
          </div>          
        </div>
        <div style={{ borderTop: "1px dotted lightgrey" }} className="mb-3"></div>
        <Table
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={notes}
        />
      </MuiModal>
    </CollapsibleGroup>
  );
}
