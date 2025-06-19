import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingUser,
  faCalendar,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faComment,
  faEnvelope,
  faExclamationTriangle,
  faFilter,
  faGears,
  faListUl,
  faLocationDot,
  faMagnifyingGlass,
  faSquare,
  faSquarePlus,
  faStar,
  faScrewdriverWrench,
  faTruckFast,
  faListCheck,
  faRotateRight,
  faClipboard
} from "@fortawesome/free-solid-svg-icons";

import SensorWindowIcon from '@mui/icons-material/SensorWindow';

import FontAwesomeEventIcon from "app/components/events/fontAwesomeEventIcon";
import Tooltip from "app/components/tooltip/tooltip";

import Image from "next/image";

export const RushIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-4px", ...style }}>
      <img
        src="/flag.png"
        alt="Rush Order Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "16px", height: "auto" }}
      />
    </div>
  );
};

export const WarningIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faExclamationTriangle}
      className={`text-red-700 ${className}`}
      style={{ ...style }}
    />
  );
};

export const ShapesIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-2px", ...style }}>
      <img
        src="/shapes.png"
        alt="Shapes Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "14px", height: "auto" }}
      />
    </div>
  );
};

export const PaintIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/palette.png"
        alt="Paint Icon Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority
        style={{ width: style?.width || "16px", height: "auto" }}
      />
    </div>
  );
};

export const GridIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-2px", ...style }}>
      <img
        src="/pixels.png"
        alt="Paint Icon Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority
        style={{ width: style?.width || "12px", height: "auto" }}
      />
    </div>
  );
};

export const CardinalIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style, borderRadius: "5px" }}>
      <img
        src="/cardinal-glass.png"
        alt="Cardinal Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const CentraIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style, borderRadius: "5px" }}>
      <img
        src="/centra-logo.jpg"
        alt="Centra Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const PFGIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-6px", ...style }}>
      <img
        src="/pfg-glass.png"
        alt="PFG Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "16px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const HomeDepotIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-4px", ...style }}>
      <img
        src="/the-home-depot-logo.png"
        alt="Home Depot Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "16px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const VinylDoorIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/vinyl-door.png"
        alt="Vinyl Door Icon"
        width={300} // Properties for resolution, not size
        height={250}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const CapStockIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-2px", ...style }}>
      <img
        src="/layers.png"
        alt="Capstock Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority
        style={{ width: style?.width || "13px", height: "auto" }}
      />
    </div>
  );
};

export const EngineeredIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/engineering.png"
        alt="Engineered Icon"
        width={300} // Properties for resolution, not size
        height={250}
        priority={true}
        style={{ width: style?.width || "14px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const GlassOrderedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/window.png"
        alt="Window Icon"
        width={300} // Properties for resolution, not size
        height={250}
        priority={true}
        style={{ width: style?.width || "14px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const PatioDoorIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/patio-door.png"
        alt="Patio Door Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "-12px" }}
      />
    </div>
  );
};

export const PatioDoorShippedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/patio-door-shipped.png"
        alt="Patio Door Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "-12px" }}
      />
    </div>
  );
};

export const PatioDoorNotShippedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/patio-door-notshipped.png"
        alt="Patio Door Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "-12px" }}
      />
    </div>
  );
};

export const WindowNotShippedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/window-notshipped.png"
        alt="Patio Door Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "-12px" }}
      />
    </div>
  );
};

export const WindowShippedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/window-shipped.png"
        alt="Patio Door Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "-12px" }}
      />
    </div>
  );
};

export const WaterResistanceIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/water-testing.png"
        alt="Patio Door Logo"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "-12px" }}
      />
    </div>
  );
};

export const CustomerPickupIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/customer-pickup.png"
        alt="Package Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "-12px" }}
      />
    </div>
  );
};

export const EmailIcon = (props) => {
  const { style, className } = props;
  return (
    <Tooltip title={"Email Sent"}>
      <FontAwesomeIcon
        icon={faEnvelope}
        className={`text-emerald-600 ${className}`}
        style={{ ...style }}
      />
    </Tooltip>
  );
};

export const SmsIcon = (props) => {
  const { style, className } = props;
  return (
    <Tooltip title={"SMS Sent"}>
      <FontAwesomeIcon
        icon={faComment}
        className={`text-emerald-600 ${className}`}
        style={{ ...style }}
      />
    </Tooltip>
  );
};

export const StarIcon = (props) => {
  const { style, className } = props;
  return (
    <Tooltip title={""}>
      <FontAwesomeIcon
        icon={faStar}
        className={`text-red-600 ${className}`}
        style={{ ...style }}
      />
    </Tooltip>
  );
};

export const MiniBlindIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-2px", ...style }}>
      <img
        src="/miniblind.png"
        alt="miniblind Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority
        style={{ width: style?.width || "12px", height: "auto" }}
      />
    </div>
  );
};

export const DepartmentIcon = (props) => {
  const { style, className } = props;
  return (
    <Tooltip title={""}>
      <FontAwesomeIcon
        icon={faBuildingUser}
        style={{ ...style }}
        className={className}
      />
    </Tooltip>
  );
};

export const SearchIcon = (props) => {
  const { style, className } = props;
  return (
    <Tooltip title={""}>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        style={{ ...style }}
        className={className}
      />
    </Tooltip>
  );
};

export const FilterIcon = (props) => {
  const { style, className } = props;
  return (
    <Tooltip title={""}>
      <FontAwesomeIcon
        icon={faFilter}
        style={{ ...style }}
        className={className}
      />
    </Tooltip>
  );
};

export const OptionsIcon = (props) => {
  const { style, className } = props;
  return (
    <Tooltip title={""}>
      <FontAwesomeIcon
        icon={faGears}
        style={{ ...style }}
        className={className}
      />
    </Tooltip>
  );
};

export const IconsIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faListUl}
      style={{ ...style }}
      className={className}
    />
  );
};

export const ArrowLeftIcon = (props) => {
  const { style, className, onClick } = props;
  return (
    <FontAwesomeIcon
      icon={faChevronLeft}
      style={{ ...style }}
      className={className}
      onClick={onClick}
    />
  );
};

export const ArrowRightIcon = (props) => {
  const { style, className, onClick } = props;
  return (
    <FontAwesomeIcon
      icon={faChevronRight}
      style={{ ...style }}
      className={className}
      onClick={onClick}
    />
  );
};

export const CalendarIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faCalendar}
      style={{ ...style }}
      className={className}
    />
  );
};

export const StatusIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faCircleCheck}
      style={{ ...style }}
      className={className}
    />
  );
};

export const LocationIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faLocationDot}
      style={{ ...style }}
      className={className}
    />
  );
};

export const CalendarActionIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faSquarePlus}
      style={{ ...style }}
      className={className}
    />
  );
};

export const SquareIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faSquare}
      style={{ ...style }}
      className={className}
    />
  );
};

export const ExteriorDoorsIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/exterior-door.png"
        alt="Engineered Icon"
        width={300} // Properties for resolution, not size
        height={250}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const ExteriorDoorsShippedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/exterior-door-shipped.png"
        alt="Exterior Door Shipped Icon"
        width={300} // Properties for resolution, not size
        height={250}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const ExteriorDoorsNotShippedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/exterior-door-notshipped.png"
        alt="Exterior Door Not Shipped Icon"
        width={300} // Properties for resolution, not size
        height={250}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto", marginTop: "1px" }}
      />
    </div>
  );
};

export const ToolsIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faScrewdriverWrench}
      style={{ ...style }}
      className={className}
    />
  );
};

export const TruckFastIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faTruckFast}
      style={{ ...style }}
      className={className}
    />
  );
};

export const ListCheckIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faListCheck}
      style={{ ...style }}
      className={className}
    />
  );
};

export const RotateRightIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faRotateRight}
      style={{ ...style }}
      className={className}
    />
  );
};

export const ClipboardIcon = (props) => {
  const { style, className } = props;
  return (
    <FontAwesomeIcon
      icon={faClipboard}
      style={{ ...style }}
      className={className}
    />
  );
};

export const FinancingIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/financing.png"
        alt="Cash Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const WoodDropOffIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/wood-dropoff.png"
        alt="Gas Mask Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const AsbestosIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/asbestos.png"
        alt="Gas Mask Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const LeadPaintIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/lead-paint.png"
        alt="Gas Mask Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const HighRiskIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/high-risk.png"
        alt="Warning Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const AbatementIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/abatement.png"
        alt="Abatement Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const ReturnJobIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/returnjob.png"
        alt="Return Job Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};

export const PowerDisconnectedIcon = (props) => {
  const { style, className } = props;
  return (
    <div className={`inline-block ${className}`} style={{ marginBottom: "-3px", ...style }}>
      <img
        src="/nopower.png"
        alt="No Power Icon"
        width={300} // Properties for resolution, not size
        height={300}
        priority={true}
        style={{ width: style?.width || "15px", height: "auto" }}
      />
    </div>
  );
};