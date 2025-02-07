"use client"
import React from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export default function MuiModal(props) {
  const { open, style, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: "3px",
        ...style
      }}>
        {props.children}
      </Box>
    </Modal>
  )
}
