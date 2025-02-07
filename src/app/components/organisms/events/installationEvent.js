"use client";
import React from "react";

import Tooltip from "app/components/atoms/tooltip/tooltip";
import FontAwesomeEventIcon from "./fontAwesomeEventIcon";

import {
  HomeDepotIcon,
  FinancingIcon,
  WoodDropOffIcon,
  AsbestosIcon,
  LeadPaintIcon,
  HighRiskIcon,
  ExteriorDoorsShippedIcon,
  ExteriorDoorsNotShippedIcon,
  PatioDoorShippedIcon,
  PatioDoorNotShippedIcon,
  WindowShippedIcon,
  WindowNotShippedIcon,
  ReturnJobIcon,
  PowerDisconnectedIcon,
  AbatementIcon
} from "app/utils/icons";

import EmailIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import SmsIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import QueueIcon from '@mui/icons-material/MoveDownOutlined';

export default function InstallationEvent(props, cookies, markedWorkOrderId) {
  const {
    event,
    style,
    textStyle,
    className,
    isWONFirst
  } = props;

  let _event = event?._def || event; // event?._def - FullCalendar, event - transferlist props;
  let ep = { ..._event?.extendedProps };

  const tooltip = `${event?.title}, ${ep?.lastName}, ${ep?.city}, Difficulty: ${ep.jobDifficulty}, Installers: ${ep.installerCount}, Days: ${Math.round(ep?.days === 0 ? 1 : (ep.days + 1))}, W:${0} PD:${0} ED:${0}`;

  const getOptionsStyle = (cookies) => {
    let optionsStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
    }

    if (cookies?.options?.expandEvents) {
      optionsStyle = {
        overflowWrap: "anywhere",
        whiteSpace: "break-spaces",
      }
    }

    return optionsStyle;
  }

  const IconContainer = (props) => {
    
    return (
      <span>
        {ep.isInQueue &&          
          <Tooltip title="Messages in Queue">
            <QueueIcon className="text-gray-600 ml-[2px]" style={{fontSize: "0.8rem"}} />
          </Tooltip>
        }

        {ep.isTextSent &&
          <Tooltip title="SMS Sent">
            <SmsIcon className="text-gray-600 ml-[2px] mr-[2px]" style={{ fontSize: "0.8rem" }} />
          </Tooltip>
        }

        {ep.isEmailSent &&
          <Tooltip title="Email Sent">
            <EmailIcon className="text-gray-600 ml-[2px] mr-[2px]" style={{ fontSize: "0.8rem" }} />
          </Tooltip>
        }

        <Tooltip title="Job Difficulty">
          <span className="ml-[3px] pl-[3px] pr-[3px] align-middle rounded-full bg-[#000]">
            <i className={`fa-solid fa-${ep.jobDifficulty?.toLowerCase()} text-[#FFF] fa-sm`} />
          </span>
        </Tooltip>

        <Tooltip title={`Number of installers: ${ep?.installerCount}`} className="mr-[4px]">
          {ep?.installerCount && ep?.installerCount > -1 &&
            <span className="ml-[3px] pl-[3px] align-middle rounded-full bg-[#6b7280]">
              <i className={`fa-solid fa-${ep.installerCount} text-[#FFF] fa-sm mr-[3px]`} />
            </span>
          }
        </Tooltip>

        {false && 
          <Tooltip title={`Days scheduled: ${Math.round(ep?.days === 0 ? 1 : (ep.days + 1))}`}>
            <span className="ml-[3px] pl-[3px] pr-[3px] pt-[1px] pb-[1px] align-middle bg-[#1e3a8a] text-white font-bold text-[x-small]">
              {Math.round(ep?.days === 0 ? 1 : (ep.days + 1))}
            </span>
          </Tooltip>
        }

        {ep.windows > 0 && !ep.areAllWindowsShipped && // Window Not Shipped
          <Tooltip title={`Windows: ${ep.windows} (Not yet shipped)`}>
            <WindowNotShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.windows > 0 && ep.areAllWindowsShipped && // Window Shipped
          <Tooltip title={`Windows: ${ep.windows} (Shipped)`}>
            <WindowShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.doors > 0 && !ep.areAllPatioDoorsShipped &&// Patio Door Not Shipped
          <Tooltip title={`Patio Doors: ${ep.doors} (Not yet shipped)`}>
            <PatioDoorShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.doors > 0 && ep.areAllPatioDoorsShipped && // Patio Door Shipped
          <Tooltip title={`Patio Doors: ${ep.doors} (Shipped)`}>
            <PatioDoorNotShippedIcon className="mr-[4px]" />
          </Tooltip>
        }

        {ep.extDoors > 0 && !ep.areAllExteriorDoorsShipped &&// Exterior Door Not Shipped
          <Tooltip title={`Exterior Doors: ${ep.extDoors} (Not yet shipped)`}>
            <ExteriorDoorsNotShippedIcon className="mt-[-1px] mr-[2px]" />
          </Tooltip>
        }

        {ep.extDoors > 0 && ep.areAllExteriorDoorsShipped && // Exterior Door Shipped
          <Tooltip title={`Exterior Doors: ${ep.extDoors} (Shipped)`}>
            <ExteriorDoorsShippedIcon className="mt-[-1px] mr-[2px]"/>
          </Tooltip>
        }

        {ep.highRisk > 0 &&
          <HighRiskIcon className="mt-[-1px] mr-[4px]"/>
        }

        {ep.powerDisconnect === "Yes" &&
          <PowerDisconnectedIcon className="mr-[4px]" />
        }

        {ep.returnedJob > 0 &&
          <ReturnJobIcon className="mr-[4px]" />
        }

        {ep.homeDepotJob === "Yes" &&
          <Tooltip title="Home Depot">
            <span className="ml-[3px] mr-[2px] bg-white"><HomeDepotIcon /></span>
          </Tooltip>
        }

        {ep.asbestos > 0 &&
          <AsbestosIcon className="mr-[4px]"/>
        }

        {ep.leadPaint === "Yes" &&
          <LeadPaintIcon className="mr-[4px]" />
        }

        {ep.financing === "Yes" &&
          <FinancingIcon className="mr-[4px]" />
        }

        {ep.abatement === "Yes" && ep.asbestos > 0 &&
          <AbatementIcon className="mr-[4px]" />
        }

        {ep.woodDropOff > 0 &&
          <WoodDropOffIcon className="mr-[4px]" />
        }
      </span>
    );
  }

  const capitalizeEachWord = (str) => {
    let words = str?.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return words.join(' ');
  }

  return (
    <div
      data-toggle="tooltip"
      data-placement="right"
      title={tooltip}
      data-html="true"
      style={{ ...style, ...getOptionsStyle(cookies) }}
      won={event.title || _event.title}
      className={`${className} hover:cursor-pointer`}
    >
      {ep.icons && !isWONFirst &&
        <span>
          {markedWorkOrderId && markedWorkOrderId === event?.title && <i className="fa-solid fa-circle pl-1 pr-1" style={{ color: "greenyellow", animation: "animation: blink 1s infinite;" }}></i>}
          <IconContainer icons={ep.icons} />
        </span>
      }

      {ep.icons && isWONFirst &&
        <span>
          <IconContainer icons={ep.icons} />
        </span>
      }

      <span>
        <span className="pl-[3px] pr-[3px] font-semibold align-middle" style={{ ...textStyle }}>
          {event.title || _event.title}
        </span>

        {ep?.lastName && <span className="align-middle">{`${ep.lastName}`}</span>}

        {ep?.city && <span className="align-middle" style={{ ...textStyle }}>{` (${capitalizeEachWord(ep.city)})`}</span>}
      </span>
    </div>
  )
}