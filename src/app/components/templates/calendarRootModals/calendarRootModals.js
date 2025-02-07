import React, { lazy, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const ProductionRescheduleModal = lazy(() => import("app/components/atoms/rootModals/productionRescheduleModal"));
const ProductionChangeStatusModal = lazy(() => import("app/components/atoms/rootModals/productionChangeStatusModal"));
const ServiceChangeStatusModal = lazy(() => import("app/components/atoms/rootModals/serviceChangeStatusModal"));
const ServiceRescheduleModal = lazy(() => import("app/components/atoms/rootModals/serviceRescheduleModal"));
const ProductionWorkorder = lazy(() => import("app/components/templates/productionWorkorder/productionWorkorder"));
const InstallationWorkorder = lazy(() => import("app/components/templates/installationWorkorder/installationWorkorder"));
const ServiceWorkOrder = lazy(() => import("app/components/templates/serviceWorkorder/serviceWorkorder"));

import Help from "app/components/templates/help/help";

import { Production, Service, Installation } from "app/utils/constants";

export default function CalendarRootModals({
  showRescheduleConfirmation,
  rescheduleOk,
  handleMoveCancel,
  changeEvent,
  showChangeStatusConfirmation,
  handleChangeStatusCancel,
  handleStateChangeOk,
  handleGenericRescheduleOk,
  contextMenuChangeCallback,
  handleServiceStateChangeOk,
  modalsRef
}) {

  const { department } = useSelector((state) => state.calendar);

  const router = useRouter()

  const [showProductionWorkorder, setShowProductionWorkorder] = useState(false);
  const [showInstallationWorkorder, setShowInstallationWorkorder] = useState(false);
  const [showServiceOrder, setShowServiceOrder] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  if (modalsRef?.current) {
    modalsRef.current.setState = (type, val) => {
      switch (type) {
        case "productionWorkorder":
          setShowProductionWorkorder(val);
          break;
        case "installationWorkorder":
          setShowInstallationWorkorder(val);
          break;
        case "serviceOrder":
          setShowServiceOrder(val);
          break;
        case "help":
          setShowHelp(val);
          break;
        default:
          break;
      }
    };
  }

  const handleCloseWorkorder = useCallback(() => {
    router.push(`?department=${department.key}&page=returnUrl`, undefined, {
      shallow: true,
    });

    switch (department.key) {
      case Production:
        setShowProductionWorkorder(false);
        break;
      case Service:
        setShowServiceOrder(false);
        break;
      case Installation:        
        setShowInstallationWorkorder(false);
        break;
      default:
        break;
    }

  }, [router, department]);

  return (
    <div>
      <ProductionRescheduleModal
        showRescheduleConfirmation={
          showRescheduleConfirmation && department.key === Production
        }
        handleMoveOk={rescheduleOk}
        handleMoveCancel={handleMoveCancel}
        changeEvent={changeEvent}
      />

      <ProductionChangeStatusModal
        showChangeStatusConfirmation={
          showChangeStatusConfirmation && department.key === Production
        }
        handleChangeStatusCancel={handleChangeStatusCancel}
        changeEvent={changeEvent}
        handleStateChangeOk={handleStateChangeOk}
      />

      <ServiceRescheduleModal
        showRescheduleConfirmation={
          showRescheduleConfirmation && department.key === Service
        }
        handleMoveOk={handleGenericRescheduleOk}
        handleMoveCancel={handleMoveCancel}
        changeEvent={changeEvent}
      />

      <ServiceChangeStatusModal
        showChangeStatusConfirmation={
          showChangeStatusConfirmation && department.key === Service
        }
        handleChangeStatusCancel={handleChangeStatusCancel}
        changeEvent={changeEvent}
        handleStateChangeOk={handleServiceStateChangeOk}
      />

      <Modal
        open={showHelp}
        onClose={() => { setShowHelp(false) }}
      >
        <Box
          sx={{
            position: "absolute", // TODO: Check if can be migrated to tailwind
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "3px"
          }}
        >
          <Help className="p-2" />
        </Box>
      </Modal>

      <Modal open={showProductionWorkorder || showInstallationWorkorder || showServiceOrder}>
        <Box
          sx={{
            position: "absolute", // TODO: Check if can be migrated to tailwind
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "3px"
          }}
        >
          {showProductionWorkorder &&
            <ProductionWorkorder
              style={{
                height: "75vh",
                width: "90vw",
                overflow: "auto",
                marginTop: "-1px"
              }}
              setShowProductionWorkorder={setShowProductionWorkorder}
              onChange={contextMenuChangeCallback}
              onCloseCallback={handleCloseWorkorder}
              viewConfig={{
                stickyHeader: true,
              }}
              type={Production}
            />
          }
          {showInstallationWorkorder &&
            <InstallationWorkorder
              style={{
                height: "75vh",
                width: "90vw",
                overflow: "auto",
                marginTop: "-1px"
              }}
              setShowInstallationWorkorder={setShowInstallationWorkorder}
              onChange={contextMenuChangeCallback}
              onCloseCallback={handleCloseWorkorder}
              viewConfig={{
                stickyHeader: true,
              }}
              type={Installation}
            />
          }
          {showServiceOrder &&
            <ServiceWorkOrder
              style={{
                height: "75vh",
                width: "90vw",
                overflow: "auto",
                marginTop: "-1px",
                paddingRight: "1rem",
              }}
              setShowServiceWorkorder={(val) => setShowServiceOrder(val)}
              onChange={contextMenuChangeCallback}
              onCloseCallback={handleCloseWorkorder}
            />
          }
        </Box>
      </Modal>
    </div>
  );
}
