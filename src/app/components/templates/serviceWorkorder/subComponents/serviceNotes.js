"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-query";

import Collapse from "@mui/material/Collapse";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import CollapsibleGroup from "app/components/atoms/workorderComponents/collapsibleGroup";
import GeneralNotes from "app/components/organisms/generalNotes/generalNotes";
import { fetchNotes, saveNote, deleteNote } from "app/api/genericApis/noteApi";
import { ServiceNoteCategories } from "app/utils/constants";

export default function ServiceNotes(props) {
  const { moduleId, showNotes, onExpandCollapse } = props;

  const moduleName = "service";

  const fetchNotesAsync = async () => {
    if (moduleId) {
      const result = await fetchNotes(moduleName, moduleId);
      return result.data;
    }
  };

  const {
    isLoading: isLoadingNotes,
    isFetching: isFetchingNotes,
    data: notes,
    refetch: refetchNotes,
  } = useQuery([`${moduleName}Notes`, moduleId], fetchNotesAsync, {
    refetchOnWindowFocus: false,
  });

  const handleNoteSave = useCallback(
    async (note) => {
      if (note.id === "") {
        if (note.notesDate instanceof Date) {
          //special case for new notes
          note.notesDate = moment(note.notesDate).format();
        }
      }
      await saveNote(moduleName, note);
      refetchNotes();
    },
    [refetchNotes]
  );

  const handleNoteDelete = useCallback(
    async (id) => {
      await deleteNote(moduleName, id);
      refetchNotes();
    },
    [refetchNotes]
  );

  const isLoading = isLoadingNotes || isFetchingNotes;

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <>
      <CollapsibleGroup
        id={"title-notes"}
        title={"Notes"}
        value={showNotes}
        expandCollapseCallback={() => onExpandCollapse("notes")}
        headerStyle={{ backgroundColor: "#FCF8E3" }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full py-4">
            <span>
              <Spin className="pr-2" indicator={antIcon} /> Loading...
            </span>
          </div>
        ) : (
          <>
            <Collapse in={!showNotes}>
              <div
                className={`${
                  notes && notes.length > 0 ? "h-28 overflow-auto flex" : ""
                }`}
              >
                <GeneralNotes
                  moduleId={moduleId}
                  mode="compact"
                  notes={notes}
                  noteCategories={ServiceNoteCategories}
                />
              </div>
            </Collapse>
            <Collapse in={showNotes}>
              <div
                style={{ minHeight: "112px" }}
                className={`${
                  notes && notes.length > 0
                    ? "h-80 overflow-auto"
                    : "max-h-64 overflow-auto"
                }`}
              >
                <GeneralNotes
                  moduleId={moduleId}
                  notes={notes}
                  noteCategories={ServiceNoteCategories}
                  handleNoteSave={handleNoteSave}
                  handleNoteDelete={handleNoteDelete}
                  triggerFetchNotes={refetchNotes}
                />
              </div>
            </Collapse>
          </>
        )}
      </CollapsibleGroup>
    </>
  );
}
