"use client";
import React from "react";
import { mapNoteCategoryToKey } from "app/utils/utils";
import { Modal, Box } from "@mui/material";
import moment from "moment";
import styles from "./generalNotes.module.css";
import UserAvatar from "../users/userAvatar";

export default function GeneralNoteViewModal(props) {
  const { show, onClose, noteCategoryOptions, note } = props;
  return (
    <Modal open={show} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: "3px",
        }}
        className="sm:w-full md:w-1/2"
      >
        <div className="flex flex-col">
          <div className="flex w-full justify-between items-start text-sm pb-2">
            <div>
              <div className="flex items-center">
                <i
                  className={
                    noteCategoryOptions.find(
                      (c) => c.key === mapNoteCategoryToKey(note.category)
                    ).icon
                  }
                ></i>
                <div>
                  {
                    noteCategoryOptions.find(
                      (c) => c.key === mapNoteCategoryToKey(note.category)
                    ).value
                  }
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div>{`${moment(note.notesDate).format("LLLL")}`}</div>
              <div className="flex justify-end items-center space-x-1 text-xs">
                <UserAvatar username={note.calledBy} />
                <div>{note.calledBy}</div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <textarea
              className={`${styles.textArea} ${styles.taNoBorder}`}
              disabled={true}
              rows={15}
              value={note.notes}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
}
