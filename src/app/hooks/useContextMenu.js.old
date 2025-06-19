import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  Production,
  Service,
  Installation,
  ManufacturingFacilities,
} from "app/utils/constants";
import { YMDDateFormat } from "app/utils/utils";

import moment from "moment";

const useContextMenu = ({ anchorEl, workOrders, calendarApi, setAnchorEl }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { events, selectedEvent } = useSelector((state) => state.calendar);

  const placeholder = useCallback(() => {
    console.log("placeholder");
  }, []);

  /* Context menu */
  useEffect(() => {
    const handleEventRightClick = (e) => {
      e.preventDefault();

      if (e.target) {
        let _selectedWON =
          e.target?.firstChild?.firstChild?.getAttribute("won");
        let _event = calendarApi.getEventById(_selectedWON);

        if (_event) {
          // dispatch(updateSelectedEvent(_event));
          // let _workOrderData = workOrders?.data.find(
          //   (x) =>
          //     x.workOrderNumber === _selectedWON ||
          //     x.serviceOrderNumber === _selectedWON
          // );
          // dispatch(updateWorkOrderData(_workOrderData));
        }

        if (e.target?.getAttribute("class")?.includes("fc-event")) {
          setAnchorEl(e.target);
        } else {
          setAnchorEl(null);
        }
      }
    };

    const handleLeftClick = (e) => {
      if (e) {
        const parentElement = document.getElementById("event-context-menu");
        if (!parentElement?.contains(e.target)) {
          setAnchorEl(null);
        }
      }
    };

    const handleScroll = (e) => {
      if (e) {
        setAnchorEl(null);
        if (selectedEvent) {
          //dispatch(updateSelectedEvent(null));
        }
      }
    };

    document.addEventListener("contextmenu", handleEventRightClick);
    document.addEventListener("click", handleLeftClick);
    document.addEventListener("wheel", handleScroll);

    return () => {
      document.removeEventListener("click", handleLeftClick);
      document.removeEventListener("contextmenu", handleEventRightClick);
      document.removeEventListener("wheel", handleScroll);
    };
  }, [dispatch, events, selectedEvent, workOrders, calendarApi, setAnchorEl]);

  /* Context menu positioning */
  useEffect(() => {
    if (anchorEl) {
      const calendarEventRect = anchorEl.getBoundingClientRect();
      const contextMenu = document.getElementById("event-context-menu");
      const contextMenuRect = contextMenu?.getBoundingClientRect();

      if (calendarEventRect && contextMenuRect) {
        contextMenu.style.top =
          calendarEventRect.top - contextMenuRect.height + 10 + "px";
        contextMenu.style.left =
          calendarEventRect.left + contextMenuRect.width - 150 + "px";
        contextMenu.style.display = "block";
      }
    }
  }, [anchorEl]);

  return {
    placeholder,
  };
};

export default useContextMenu;
