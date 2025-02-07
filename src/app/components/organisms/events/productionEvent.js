"use client";
import React from "react";
import { Popover } from "antd";

import {
  WarningIcon,
  ShapesIcon,
  PaintIcon,
  RushIcon,
  GridIcon,
  CardinalIcon,
  CentraIcon,
  PFGIcon,
  ExteriorDoorsIcon,
  VinylDoorIcon,
  CapStockIcon,
  GlassOrderedIcon,
  PatioDoorIcon,
  EngineeredIcon,
  EmailIcon,
  SmsIcon,
  StarIcon,
  MiniBlindIcon,
  WaterResistanceIcon
} from "app/utils/icons";

import { Pages, ProductionStates, ManufacturingFacilities } from "app/utils/constants";

import { YMDDateFormat } from "app/utils/utils";

import Tooltip from "app/components/atoms/tooltip/tooltip";

export default function ProductionEvent(props, cookies, markedWorkOrderId, page) {
  const {
    event,
    style,
    textStyle,
    className,
    isWONFirst
  } = props;

  let _event = event?._def || event; // event?._def - FullCalendar, event - transferlist props;
  let ep = { ..._event?.extendedProps };

  //const tooltip = `${event.title} W:${ep.windows} PD:${ep.f52PD} ED:${ep.doors} VD:${ep.f61DR + ep.f27DS} ${ep.branch}-${ep.jobType}`;

  //const glassOrderedText = `Glass Ordered\n26CA: ${ep.f26CA}\n29CA: ${ep.f29CA}\n29CM: ${ep.f29CM}\n68CA: ${ep.f68CA}\n68SL: ${ep.f68SL}\n68VS: ${ep.f68VS}`;
  //const vinylDoorsText = `Vinyl Doors: 61DR(${ep.f61DR}), 27DS(${ep.f27DS})`;
  //const exteriorDoorsText = `Exterior Doors: ${ep.doors}`;
 
  const windowsCount = ep?.manufacturingFacility === ManufacturingFacilities.calgary ? ep.windows : ep.f26CA + ep.f29CA + ep.f29CM + ep.f68CA + ep.f68SL + ep.f68VS + ep.f26HY;
  const vinylDoorCount = parseInt(ep.f61DR, 10) + parseInt(ep.f27DS, 10);

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

  const LabelValue = (props) => {
    const { label, value, className } = props;
    return (<> <span className={`text-xs ${className}`}>{label}</span>: <span className="text-blue-500 font-bold text-xs">{value}</span></>)
  }

  const VinylDoorsContent = () => {
    return (
      <span>
        <LabelValue label={"Vinyl Doors"} value={`(${parseInt(ep.f61DR, 10) + parseInt(ep.f27DS, 10)})`}/>        
        <div className="pl-8">
          {parseInt(ep?.f61DR, 10) > 0 &&
            <div>
              <LabelValue label={"- 61DR"} value={ep.f61DR} />
            </div>
          }
          {parseInt(ep?.f27DS, 10) > 0 &&
            <div>
              <LabelValue label={"- 27DS"} value={ep.f27DS} />
            </div>
          }
        </div>
      </span>
    )
  }

  const WindowsContent = () => {
    return (
      <span>
        <LabelValue label={"Windows"} value={`(${windowsCount})`}/>        
        <div className="pl-8">
          {parseInt(ep?.f26CA, 10) > 0 &&
            <div>
              <LabelValue label={"- 26CA"} value={ep.f26CA} />
            </div>
          }
          {parseInt(ep?.f29CA, 10) > 0 &&
            <div>
              <LabelValue label={"- 29CA"} value={ep.f29CA} />
            </div>
          }
          {parseInt(ep?.f29CM, 10) > 0 &&
            <div>
              <LabelValue label={"- 29CM"} value={ep.f29CM} />
            </div>
          }
          {parseInt(ep?.f68SL, 10) > 0 &&
            <div>
              <LabelValue label={"- 68SL"} value={ep.f68SL} />
            </div>
          }
          {parseInt(ep?.f68VS, 10) > 0 &&
            <div>
              <LabelValue label={"- 68VS"} value={ep.f68VS} />
            </div>
          }
          {parseInt(ep?.f26HY, 10) > 0 &&
            <div>
              <LabelValue label={"- 26HY"} value={ep.f26HY} />
            </div>
          }
        </div>
      </span>
    )
  }

  const eventPopoverContent =
    (
      <div>
        <div className="text-md flex flex-row justify-between min-w-[12rem] text-xs">
          <span className="font-bold pt-1">{`${event.title}`}
            <div className="inline-block ml-1">
              <Tooltip title="Copy to Clipboard">
                <i
                  className="fa-solid fa-copy text-gray-400 hover:text-blue-400 hover:cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(event.title)}
                />
              </Tooltip>
            </div>
          </span>
          <div style={{ backgroundColor: event.backgroundColor }} className="p-1 rounded-sm mb-1">{ProductionStates[ep.state]?.label}
          </div>
        </div>
        {false && ep.completionDate && <div><LabelValue label={"Production Completed"} value={YMDDateFormat(ep.completionDate)} /></div>} {/* TODO: Verify what this value is for */}
        <div style={{borderTop: "1px dotted lightgrey"}} className="pt-1 mt-1">
          {ep?.icons.flagOrder && <div><RushIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Rush Order</span></div>}
          {ep?.icons.cardinalIcon && <div><CardinalIcon className="pl-1" style={{ width: "20px" }} /><LabelValue className="pl-1" label={"Glass Supplier"} value={"Cardinal Glass"} /></div>}
          {ep?.icons.pfgIcon && <div className="pl-1"><PFGIcon style={{ width: "20px" }} /><LabelValue label={"Glass Supplier"} value={"PFG Glass"} /></div>}
          {ep?.icons.centraIcon && <div className="pl-1"><CentraIcon style={{ width: "20px" }} /><LabelValue label={"Glass Supplier"} value={"Centra"} /></div>}
          {(ep?.glassOrderedDate) && <div className="pl-7"><LabelValue label={"Glass Ordered"} value={YMDDateFormat(ep.glassOrderedDate)} /></div>}
          {ep?.icons.m2000Icon && <div><EngineeredIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Engineered</span></div>}
          {ep?.icons.capStockIcon && <div><CapStockIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Capstock</span></div>}
          {ep?.icons.paintIcon && <div><PaintIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Paint</span></div>}
          {ep?.icons.gridIcon && <div><GridIcon style={{ width: "18px" }} /><span className="pl-2 text-xs">Grid</span></div>}
          {ep?.icons.shapesIcon && <div><ShapesIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Shapes</span></div>}
          {ep?.icons.miniblindIcon && <div><MiniBlindIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Miniblind</span></div>}
          {ep?.icons.waterTestingRequired && <div><WaterResistanceIcon style={{ width: "20px" }} /><span className="pl-2 text-xs">Water Testing Required</span></div>}
          {ep?.windows > 0 && <div><GlassOrderedIcon style={{ width: "20px" }} /><span className="pl-2 text-xs"><WindowsContent /></span></div>}
          {ep?.icons.g52pdIcon && <div><PatioDoorIcon style={{ width: "20px" }} /><span className="pl-2 text-xs"><LabelValue label={"Patio Doors"} value={ep?.f52PD} /></span></div>}
          {ep?.icons.vinylDoorIcon && <div><VinylDoorIcon style={{ width: "20px" }} /><span className="pl-2 text-xs"><VinylDoorsContent /></span></div>}
          {ep?.icons.exteriorDoorsIcon && <div><ExteriorDoorsIcon style={{ width: "20px" }} /><span className="pl-1 text-xs"><LabelValue label={"Exterior Doors"} value={ep?.doors} /></span></div>}
          
          {ep?.icons.warningIcon && <WarningIcon className="pl-1" />}

          {ep?.icons.emailIcon && <EmailIcon className="pl-1" />}
          {ep?.icons.smsIcon && <SmsIcon className="pl-1" />}
          {ep?.icons.starIcon && <StarIcon className="pl-1" />}

          <div className="pl-7"><LabelValue label={"Branch"} value={ep.branch} /></div>
          <div className="pl-7"><LabelValue label={"Job Type"} value={ep.jobType} /></div>
        </div>
      </div>
    )

  const IconContainer = (props) => {
    const { icons } = props;

    return (
      <span>
        {/* Rush Orders */}
        {icons.flagOrder && <span><RushIcon /></span>}
        {/* Cardinal */}
        {icons.cardinalIcon && <span><CardinalIcon className="pl-1" /></span>}
        {/* PFG */}
        {icons.pfgIcon && <span><PFGIcon className="pl-1" /></span>}

        {icons.centraIcon && <span><CentraIcon className="pl-1" /></span>}
        {/* Engineered */}
        {icons.m2000Icon && <span><EngineeredIcon className="pl-1" /></span>}
        {/* Capstock */}
        {icons.capStockIcon && <CapStockIcon className="pl-1" />}
        {/* Paint */}
        {icons.paintIcon && <span><PaintIcon className="pl-1" /></span>}
        {/* Grid */}
        {icons.gridIcon && <GridIcon className="pl-1" />}
        {/* Shapes */}
        {icons.shapesIcon && <ShapesIcon className="pl-1" />}
        {/* Miniblinds */}
        {icons.miniblindIcon && <MiniBlindIcon className="pl-1" />}
        {/* Water Testing */}
        {icons.waterTestingRequired && <WaterResistanceIcon className="pl-1" />}
        {/* Window/glass */}
        {ep?.windows > 0 && <GlassOrderedIcon className="pl-1" />}
        {/* Patio Doors */}
        {icons.g52pdIcon && <PatioDoorIcon className="pl-1" />}
        {/* Vinyl Doors */}
        {icons.vinylDoorIcon && <VinylDoorIcon className="pl-1" />}
        {/* Exterior Doors */}
        {icons.exteriorDoorsIcon && <ExteriorDoorsIcon className="text-blue-700 pl-1" />}

        {icons.warningIcon && <WarningIcon className="pl-1" />}

        {icons.emailIcon && <EmailIcon className="pl-1" />}
        {icons.smsIcon && <SmsIcon className="pl-1" />}
        {icons.starIcon && <StarIcon className="pl-1" />}
      </span>
    );
  }

  return (
    <div className={`${className} hover:cursor-pointer w-100`} won={event.title || _event.title}>
      <div className="trucate" style={{ ...style, ...getOptionsStyle(cookies) }}>
        {ep.icons && !isWONFirst &&
          <span>
            {markedWorkOrderId && markedWorkOrderId === event?.title && <i className="fa-solid fa-circle-arrow-right pl-1 pr-1 text-red-600 fa-beat" style={{ "--fa-beat-scale": "2.0" }}></i>}
            <IconContainer icons={ep.icons} />
          </span>
        }
        <span>
          <Popover
            content={eventPopoverContent}
            title=""
            className={`${className} hover:cursor-pointer hover:text-blue-500`}
            placement="top"
          >
            <span className="pl-1 font-semibold">{event.title || _event.title}</span>
          </Popover>
          <span>
            {ep.windows > 0 &&
              <><span className="pl-1 text-blue-800 font-semibold">W:<span className="text-black font-normal">{windowsCount}</span></span></>
            }

            {ep.doors > 0 &&
              <><span className="pl-1 text-blue-800 font-semibold">ED:</span><span className="text-black font-normal">{ep?.doors}</span></>
            }

            {vinylDoorCount > 0 &&
              <><span className="pl-1 text-blue-800 font-semibold">VD:<span className="text-black font-normal">{vinylDoorCount}</span></span></>
            }

            {ep.f52PD > 0 &&
              <><span className="pl-1 text-blue-800 font-semibold">PD:<span className="text-black font-normal">{ep.f52PD}</span></span></>
            }
            {ep?.branch && <><span className="pl-1 font-bold text-blue-700">{ep.branch?.substring(0, 3)}<span className="text-black font-normal">-{ep.jobType}</span></span></>}

            {page === Pages.day &&
              <>
                <span className="pl-1 text-blue-800 font-semibold">LBR Min:</span><span>{` ${ep.lbrMin}`}</span>
                <span className="pl-1 text-blue-800 font-semibold">Bundle:</span><span>{` ${ep.bundle}`}</span>
                <span className="pl-1 text-blue-800 font-semibold">Block#:</span><span>{` ${ep.blockNo}`}</span>
              </>
            }
          </span>
        </span>

        {ep.icons && isWONFirst &&
          <span>
            <IconContainer icons={ep.icons} />
          </span>
        }
      </div>
    </div>
  )
}