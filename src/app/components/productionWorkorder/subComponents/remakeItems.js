"use client";
import styles from '../productionWorkorder.module.css';
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "react-query";
import { Table } from "antd";

import { generateEmptyTableMessage, YMDDateFormat } from "app/utils/utils";
import { getTableColumns } from '../utils/productionUtils';

import { fetchRemakeItems } from 'app/api/productionApis';

export default function RemakeItems(props) {
  const { workOrderNumber, parentState } = props;

  const { isMobile, userToken } = useSelector(state => state.app);

    const {
        remakeWindows,
        setRemakeWindows,
        remakePatioDoors,
        remakeVinylDoors,
    } = parentState;

    const { isFetching,
        data: remakeItems,
        refetch } = useQuery("remakeItems", () => {
            if (workOrderNumber) {
                return fetchRemakeItems(userToken, workOrderNumber)
            }
        });
    
    useEffect(() => {
        if (remakeItems?.data) {
            setRemakeWindows(rw => {
                let _remakeWindows = remakeItems?.data?.filter(x => x.system !== "52PD");

                _remakeWindows.forEach((r, index) => {
                    r.scheduleDate = YMDDateFormat(r.scheduleDate);
                    r.key = index;
                });

                return _remakeWindows;
            });
            //setRemakeDoors(remakeItems?.data?.filter(x => x.system === "52PD"));
        }
        
    }, [remakeItems, setRemakeWindows]);
  
    return (
        <>
            <div className={`${styles.tableTitle} pt-4`} id="title-remake">
                Windows
            </div>

            {remakeWindows?.length > 0 ?
                <Table
                    columns={getTableColumns(isMobile ? "remakeVertical" : "remakeWindows", remakeWindows)}
                    dataSource={remakeWindows}
                    pagination={false}
                    bordered={false}
                    className="pt-4"
                />
                :
                <div className="pl-6 pt-4 pb-4 text-red-800">{generateEmptyTableMessage("Windows")}</div>                
            }

            <div className={`${styles.tableTitle} pt-4`}>
                Patio Doors
            </div>

            {remakePatioDoors?.length > 0 ?
                <Table
                    columns={getTableColumns(isMobile ? "remakeVertical" : "remakePatioDoors", remakePatioDoors)}
                    dataSource={remakePatioDoors}
                    pagination={false}
                    bordered={false}
                    className="pt-4"
                />
                :
                <div className="pl-6 pt-4 pb-4 text-red-800">{generateEmptyTableMessage("Patio Doors")}</div>
            }

            <div className={`${styles.tableTitle} pt-4`}>
                Vinyl Doors
            </div>

            {remakeVinylDoors?.length > 0 ?
                <Table
                    columns={getTableColumns(isMobile ? "remakeVertical" : "remakeVinylDoors", remakeVinylWindows)}
                    dataSource={remakeVinylWindows}
                    pagination={false}
                    bordered={false}
                    className="pt-4"
                />
                :
                <div className="pl-6 pt-4 pb-4 text-red-800">{generateEmptyTableMessage("Vinyl Doors")}</div>
            }           
        </>
    )
}