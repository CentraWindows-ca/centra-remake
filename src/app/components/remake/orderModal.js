import { Modal, Box } from "@mui/material";

export default function OrderModal(props) {
  const { open, onClose } = props;

  return (
    <Modal open={open} onClose={() => onClose()}>
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
          //minWidth: "50vw",
        }}
      >
        {props.children}
      </Box>
    </Modal>
  );
}
