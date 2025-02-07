"use client";
import React, { useState, useId, Fragment } from "react";
import styles from './weekTable.module.css';

export default function WeekTable(props) {
    const { data } = props;
    const [showBody, setShowBody] = useState(true);

    return (        
        <>
            {showBody && data.map((rowData, index) => {
                return (
                    <Fragment key={`${rowData.key}-${index}`}>
                        {index === 0 &&
                            <tr className={`${styles.header}`}>{/* Header */}
                                <td>
                                {/*<td onClick={() => { setShowBody(s => !s) }} >*/}
                                    {rowData?.label}

                                    {/*{showBody ?*/}
                                    {/*    <KeyboardArrowUpIcon className={`${styles.icon}`} />*/}
                                    {/*    :*/}
                                    {/*    <KeyboardArrowDownIcon className={`${styles.icon}`} />*/}
                                    {/*}*/}
                                </td>
                                {rowData?.values?.map((subItem) => {
                                    return (<td key={`${subItem?.key}`} className="font-normal">{subItem?.value}</td>)
                                })}
                                <td className="text-blue-600">{rowData.total}</td>
                            </tr>
                        }

                        {index > 0 &&
                            <tr key={rowData?.key}>
                                <td>{rowData?.label}</td>
                                {rowData?.values?.map((rowDataItem) => { /* Render columns */
                                    return (<td key={`${rowDataItem?.key}`} className="font-normal">{rowDataItem?.value}</td>)
                                })}
                                <td className="text-blue-600">{rowData?.total}</td>
                            </tr>
                        }
                    </Fragment>   
                )
            })}
        </>        
    );
}
