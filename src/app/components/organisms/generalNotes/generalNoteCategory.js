"use client";
import React, { useCallback } from "react";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Tag } from 'antd';

export default function GeneralNoteCategory(props) {
    const {
        id,
        table,
        catKey,
        onChange,
        isEditing = false,
        noteCategories
    } = props;


    let categoryOptions = Object.entries(noteCategories).map((e) => {
        return { key: e[0], value: e[1].label, color: e[1].color }
    });

    const handleDropdownItemClick = useCallback((e) => {
        if (e) {
            let _newCategory = categoryOptions.find(x => x.value === e.target.innerText);
            onChange({
                detailRecordId: id,
                category: _newCategory,
                table: table
            });
        }
    }, [id, table, categoryOptions, onChange]);

    return (

        <>
        {isEditing ? (   <Tooltip title="Click to update note category">
                <DropdownButton
                    className="custom-dropdown"
                    style={{
                        backgroundColor: noteCategories[catKey]?.color,
                        textAlign: "center",
                        width: "9rem",
                        height: "2rem",                    
                        marginRight: 0,
                        border: '0px !important',
                        padding: '2px'
                    }}
                    variant={ noteCategories[catKey]?.color}
                    size={"small"}
                    title={
                        <span style={{
                            // //color: NoteCategories[catKey]?.color,
                            width: "9rem",
                            height: "2rem",
                            fontSize: "0.78rem",
                        
                        }}>
                            {/* <Tag bordered={false} color={NoteCategories[catKey]?.color}> */}
                                {noteCategories[catKey]?.label}
                            {/* </Tag> */}
                            
                        </span>
                    }
                >
                    {categoryOptions.map((s) => 
                        <Dropdown.Item
                            key={s.key}
                            onClick={handleDropdownItemClick}
                            style={{ fontSize: "0.8rem" }}
                        >                
                                    
                            {s.value}                                     
                        </Dropdown.Item>
                    )}
                </DropdownButton>
            </Tooltip>) 
            : (
                <Tag color="orange"> 
                    
                    {/* // <Tag color={noteCategories[catKey]?.color}> */}
                    {noteCategories[catKey]?.label}
                </Tag>
            )}
         
        </>
        
    )
}