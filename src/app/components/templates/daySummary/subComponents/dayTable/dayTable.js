import React from "react";
import styles from './dayTable.module.css';

export default function DayTable(props) {
    const { data, valueStyle, headerValueStyle, propertyStyle } = props;

    return (
        <div className={`${styles.root} text-sm`} style={{ ...props.style }}>            
            <table className={`table ${styles.table}`} style={{marginBottom: 0}}>
                <thead></thead>
                <tbody>
                    <tr className={styles.tableRowHeader}>
                        <td className={styles.tablePropertyHeader}>{data?.header.label}</td>
                        <td className={styles.tableValue} style={{color: "var(--centrablue)"}}>{data?.header.value}</td>
                    </tr>
                    {data?.items?.map((item, index) => {
                        return (
                            <tr key={index} className={styles.tableRow}>
                                <td className={styles.tableProperty} style={{ ...propertyStyle }}>{item?.label}</td>
                                <td className={styles.tableValue} style={{...valueStyle}}>{item?.value}</td>
                            </tr>
                        )
                    })}                    
                </tbody>
            </table>
        </div>
    );
}
