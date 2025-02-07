import { Popconfirm } from "antd";
import Tooltip from "../tooltip/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CloseButton(props) {
  const { onClose, title, hasChanges } = props;
  return (
    <div style={{ paddingBottom: "6px" }} className="flex flex-row">
      <Tooltip title={"Close"}>
        {hasChanges && (
          <Popconfirm
            placement="left"
            title={title}
            description={
              <div className="pt-2">
                <div>Unsaved changes will be lost. </div>
                <div>Proceed anyway?</div>
              </div>
            }
            onConfirm={(e) => {
              onClose();
            }}
            okText="Ok"
            cancelText="Cancel"
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="xl"
              className="text-slate-500 cursor-pointer"
            />
          </Popconfirm>
        )}
        {!hasChanges && (
          <FontAwesomeIcon
            icon={faXmark}
            size="xl"
            className="text-slate-500 cursor-pointer"
            onClick={(e) => {
              onClose();
            }}
          />
        )}
      </Tooltip>
    </div>
  );
}
