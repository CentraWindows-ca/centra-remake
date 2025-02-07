"use client";
import React from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";

// -- Constants
import { CalendarViews } from "app/utils/constants";

export default function Calendar({
  calendarRef,
  calendarHeight,
  cookies,
  _filteredEvents,
  handleClickEvent,
  dropEvent,
  setShowRescheduleConfirmation,
  getEventComponent,
  handleMoreLinkClick,
}) {
  return (
    <>
      <FullCalendar
        allDaySlot={true}
        //key={calendarKey}
        ref={calendarRef}
        initialView={CalendarViews.month}
        height={calendarHeight - 35}
        editable={true}
        eventDisplay={"block"}
        dayMaxEvents={cookies?.options?.dayMaxEvents || 1000}
        headerToolbar={false}
        selectable={true}
        weekends={!cookies?.options?.hideWeekends || false}
        weekNumbers={true}
        events={_filteredEvents}
        eventClick={handleClickEvent}
        eventDrop={(e) => {
          dropEvent(e);
          setShowRescheduleConfirmation(true);
        }}
        eventResize={(e) => {
          dropEvent(e);
          setShowRescheduleConfirmation(true);
        }}
        //eventsSet={() => { console.log("SET") }}
        //eventDidMount={(x) => {
        //  if (isLoading) {
        //    dispatch(updateIsLoading(false));
        //  }
        //}}
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
          multiMonthPlugin,
          listPlugin,
        ]}
        navLinks={true}
        //navLinkWeekClick={(ws) => console.log(ws)}
        //navLinkDayClick={(ds) => console.log(ds)}
        showNonCurrentDates={true}
        //eventContent={renderCount.current > 4 ? (e) => getEventComponent(e) : null}
        eventContent={(e) => getEventComponent(e)}
        moreLinkClick={handleMoreLinkClick}
        // eventOrder={"jobDifficulty"} - For Installation Events
        // eventOrderStrict={false}
        progressiveEventRendering={true}
      />
    </>
  );
}
