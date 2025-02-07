"use client";
import styles from '../productionWorkorder.module.css';
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "react-query";

import { Table } from "antd";

import { fetchBackorderItems } from 'app/api/productionApis';

import { generateEmptyTableMessage, YMDDateFormat } from "app/utils/utils";
import { getTableColumns } from "../utils/productionUtils";

export default function BackorderItems(props) {
    const { workOrderNumber, parentState } = props;

    const {
        backorderWindows,
        setBackorderWindows,
        backorderPatioDoors,
        backorderVinylDoors,
        backorderExteriorDoors
    } = parentState;
   
    const { isFetching,
        data: backorderItems,
        refetch } = useQuery("backorderItems", () => {
            if (workOrderNumber) {
                return fetchBackorderItems(workOrderNumber)
            }            
        });

    const { isMobile } = useSelector(state => state.app);

    useEffect(() => {
        if (backorderItems?.data) {
            setBackorderWindows(rw => {
                let _backorderWindows = backorderItems?.data?.filter(x => x.system !== "52PD");

                _backorderWindows.forEach((r, index) => {
                    r.scheduleDate = YMDDateFormat(r.scheduleDate);
                    r.estimatedShipmentDate = YMDDateFormat(r.estimatedShipmentDate);
                    r.originalShipmentDate = YMDDateFormat(r.originalShipmentDate);
                    r.key = index;
                });

                return _backorderWindows;
            });            
        }
    }, [backorderItems, setBackorderWindows]);

    return (<div style={{ paddingTop: "1rem" }}>
        
        <div className={`${styles.tableTitle} pt-4`} id="title-backorder">
            Windows
        </div>

        {backorderWindows?.length > 0 ?
            <Table
                columns={getTableColumns(isMobile ? "backorderVertical" : "backorderWindows", backorderWindows)}
                dataSource={backorderWindows}
                pagination={false}
                bordered={false}
                className="pt-4"
            />
            :
            <div className="pl-6 pt-4 pb-4 text-red-800">{generateEmptyTableMessage("Windows")}</div>
        }

        <div className={`${styles.tableTitle} pt-4`} id="title-backorder">
            Patio Doors
        </div>

        {backorderPatioDoors?.length > 0 ?
            <Table
                columns={getTableColumns(isMobile ? "backorderVertical" : "backorderPatioDoors", backorderPatioDoors)}
                dataSource={backorderPatioDoors}
                pagination={false}
                bordered={false}
                className="pt-4"
            />
            :
            <div className="pl-6 pt-4 pb-4 text-red-800">{generateEmptyTableMessage("Patio Doors")}</div>
        }

        <div className={`${styles.tableTitle} pt-4`} id="title-backorder">
            Vinyl Doors
        </div>

        {backorderVinylDoors?.length > 0 ?
            <Table
                columns={getTableColumns(isMobile ? "backorderVertical" : "backorderVinylDoors", backorderVinylDoors)}
                dataSource={backorderVinylDoors}
                pagination={false}
                bordered={false}
                className="pt-4"
            />
            :
            <div className="pl-6 pt-4 pb-4 text-red-800">{generateEmptyTableMessage("Vinyl Doors")}</div>
        }

        <div className={`${styles.tableTitle} pt-4`} id="title-backorder">
            Exterior Doors
        </div>

        {backorderExteriorDoors?.length > 0 ?
            <Table
                columns={getTableColumns(isMobile ? "backorderVertical" : "backorderExteriorDoors", backorderExteriorDoors)}
                dataSource={backorderExteriorDoors}
                pagination={false}
                bordered={false}
                className="pt-4"
            />
            :
            <div className="pl-6 pt-4 pb-4 text-red-800">{generateEmptyTableMessage("Exterior Doors")}</div>
        }
              
    </div>)
}