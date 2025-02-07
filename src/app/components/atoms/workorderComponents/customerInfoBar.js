"use client";
import styles from "./workorderComponents.module.css";

import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { LocationIcon } from "app/utils/icons";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import EditableLabel from "app/components/atoms/editableLabel/editableLabel";
import AddressMap from "app/components/atoms/workorderComponents/addressMap";
import { Installation, Production } from "app/utils/constants";

import {
  updateProdOrder,
} from 'app/api/productionApis';

export default function CustomerInfoBar(props) {
  const {
    viewConfig,
    data,
    sections,
    handleScrollToView,
    type,
    sectionsStyle
  } = props;

  const { isMobile } = useSelector(state => state.app);

  const [showMap, setShowMap] = useState(false);

  const handleSaveAddress = useCallback((keyVal) => {
    if (data && keyVal) {
      let updateData = { actionItemId: data.actionItemId, ...keyVal };
      updateProdOrder(updateData)
    }
  }, [data]);

  return (
    <div>
      {!viewConfig?.hideCustomerInfo &&
        <div className="z-1 bg-white text-sm" style={!viewConfig?.stickyHeader ? { position: "relative" } : { position: "sticky", top: "44px" }}>
          <hr style={{ margin: "0 0 3px 0" }} />
          <div className={`flex ${isMobile ? "flex-column" : "flex-row"} justify-between bg-[#F5F5F5]`}>
            <div>
              <div className="pl-[6px]">
                <div className="inline font-semibold">{data?.customerName}</div>
                {data?.projectName &&
                  <div className={`text-[#0062A8] inline`} style={{ padding: "0 0.5rem" }}>
                    |
                  </div>
                }
                <div className="inline">{data?.projectName}</div>
              </div>
              <div className={`${styles.customerInfoOuterContainer}`} style={{ minWidth: "35rem" }}>
                {data &&
                  <div className={styles.customerInfoInnerContainer}>
                    <div className="flex flex-row">
                      <div className={`${styles.customerInfoIcon} inline`}>
                        <Tooltip title="Address">
                          <i className="fa-solid fa-house"></i>
                        </Tooltip>
                      </div>
                      <div className={`flex flex-row pr-[0.7rem]`}>
                        {type === Installation &&
                          <span>{`${data.address}${data.city && ", "}${data.city}${data?.postCode && ", "}${data.postCode}`}</span>
                        }
                        {type === Production &&
                          <EditableLabel
                            key={data?.actionItemId}
                            inputKey={"address"}
                            title={"Edit Address"}
                            value={data?.address}
                            onSave={handleSaveAddress}
                            iconClass="mt-[-2px] text-blue-500"
                          >
                            {data.address}
                          </EditableLabel>
                        }
                        <div className={`${styles.mapIcon} pl-2 text-red-600 hover:cursor-pointer`} onClick={() => { setShowMap(true) }}>
                          <Tooltip title="Show Map"><LocationIcon /></Tooltip>
                        </div>
                      </div>
                    </div>
                    {data?.phoneNumber &&
                      <div style={{ paddingRight: "0.7rem" }}>
                        <div className={`${styles.customerInfoIcon} inline`}>
                          <Tooltip title="Phone Number">
                            <i className="fa-solid fa-phone" />
                          </Tooltip>
                        </div>
                        <a href={`tel:${data.phoneNumber}`}>{data.phoneNumber}</a>
                      </div>
                    }
                    {data?.workPhoneNumber &&
                      <div style={{ paddingRight: "0.7rem" }}>
                        <div className={`${styles.customerInfoIcon} inline`}>
                          <Tooltip title="Address">
                            <i className="fa-solid fa-house-user" />
                          </Tooltip>
                        </div>
                        <a href={`tel:${data.workPhoneNumber}`}>{data.workPhoneNumber}</a>
                      </div>
                    }
                    {data?.cellPhone &&
                      <div style={{ paddingRight: "0.7rem" }}>
                        <div className={`${styles.customerInfoIcon} inline`}>
                          <i className="fa-solid fa-mobile-screen-button" /></div>
                        <a href={`tel:${data.cellPhone}`}>{data.cellPhone}</a>
                      </div>
                    }
                    {data?.email &&
                      <div>
                        <div className={`${styles.customerInfoIcon} inline`}>
                          <Tooltip title="Email">
                            <i className="fa-solid fa-envelope" />
                          </Tooltip>
                        </div>
                        <a href={`mailto:${data.email}`} className="inline">{data.email}</a>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
            <div className={`${styles.tableButtonsOuterContainer}`}>
              {!viewConfig.hideNavigation &&
                <div className={styles.tableButtonsOuterContainer} style={{ ...sectionsStyle }}>
                  {sections?.map((s, index) => {
                    return (
                      <span key={`section-${index}`} className="flex flex-row">
                        <div className="flex items-center">
                          <div onClick={() => handleScrollToView(s.key)} className={`${styles.tableButton}`}>{s.label}</div>
                        </div>
                        {(index < sections.length - 1) && <div className="flex items-center justify-center"><div className="pl-3 pr-3">|</div></div>}
                      </span>
                    )
                  })}
                </div>
              }
            </div>
          </div>
          <hr style={{ margin: "3px 0 3px 0" }} />
        </div>
      }
      <AddressMap
        show={showMap}
        setShow={setShowMap}
        data={data}
      />
    </div>
  )
}