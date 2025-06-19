"use client"
import React from "react";
import Tooltip from "app/components/tooltip/tooltip";

export default function CollapsibleGroup(props) {
  const {
    id,
    title,
    style,
    value,
    contentStyle,            
    subTitle,
    headerStyle,
    //isLoadingDone,
    className,
    ActionButton,
    iconButtonsLeft,
    iconButtonsRight,
    //withPopout,
    expandCollapseCallback,
    popOutStateCallback
  } = props;

  //const [isLoading, setIsloading] = useState(false);

  //useEffect(() => {
  //  if (isLoadingDone) {
  //    setIsloading(false);
  //  }
  //}, [isLoadingDone]);

  return (
    <div
      id={id}
      className={`w-full rounded-sm text-sm ${className}`}
      style={{ border: "1px solid lightgrey", ...style }}
    >
      <div
        className="flex flex-row justify-between pt-1 pb-1 pl-2 pr-0 cursor-pointer"
        style={{ backgroundColor: '#EFEDEA', ...headerStyle }}
        onClick={() => expandCollapseCallback(!value)}
      >
        <div>
          {ActionButton &&
            <ActionButton />
          }
          <span>
            {iconButtonsLeft?.length > 0 &&
              <span style={{ marginRight: "0.3rem" }}>
                {iconButtonsLeft.map((iconButton, index) => {
                  let { Icon } = iconButton;
                  return (
                    <Tooltip key={`icon-button-${index}`} title={iconButton.tooltip}>
                      <Icon />
                    </Tooltip>
                  )
                })}
              </span>
            }
          </span>
          {title} <span className="text-blue-500">{subTitle}</span>
        </div>
        <div className="flex flex-row">
          <span>
            {iconButtonsRight?.length > 0 &&
              <span style={{ marginRight: "0.3rem" }}>
                {iconButtonsRight.map((iconButton, index) => {
                  let { Icon } = iconButton;
                  return (
                    <Tooltip key={`icon-button-${index}`} title={iconButton.tooltip}>
                      <Icon />
                    </Tooltip>
                  )
                })}
              </span>
            }
            {popOutStateCallback &&
              <span>
                <Tooltip title={"Pop-out management view"}>
                  <i
                    className="fa-solid fa-expand hover:cursor-pointer hover:text-blue-400 text-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      popOutStateCallback(true)
                    }}
                  />
                  <span className="pr-[11px] pl-[10px] text-gray-400"> | </span>
                </Tooltip>
              </span>
            }
          </span>
          <div className="mr-3 flex items-center">
            {value ?
              <i className="fa-solid fa-chevron-up"></i>
              :
              <i className="fa-solid fa-chevron-down"></i>
            }
          </div>
        </div>
      </div>
      <div style={{
        ...contentStyle
      }}>
        {props.children}
      </div>
    </div>
  )
}