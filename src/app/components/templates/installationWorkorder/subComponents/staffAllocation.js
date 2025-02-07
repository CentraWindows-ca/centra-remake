"use client";
import styles from '../installationWorkorder.module.css';
import React from "react";

import Group from "app/components/atoms/workorderComponents/group";
import CrewSelection from "app/components/atoms/workorderComponents/crewSelection";
import InputNumberItem from "app/components/atoms/workorderComponents/inputNumberItem";

export default function StaffAllocation(props) {
  const {
    staffOptions,
    className,
    style,
    inputData,
    handleCrewInputChange,
    handleInputChange,
    crew
  } = props;

  const sortByInstallerLevel = (a, b) => {
    const installerLevelA = a.installerLevel;
    const installerLevelB = b.installerLevel;

    if (installerLevelA < installerLevelB) {
      return 1;
    }
    if (installerLevelA > installerLevelB) {
      return -1;
    }

    return 0;
  }

  let sortedStaffOptions = staffOptions.sort(sortByInstallerLevel)

  return (
    <Group
      title={"Staff Allocation"}
      contentStyle={{
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateColumns: "2fr 3fr",
        rowGap: "0.3rem"
      }}
      className={`${styles.groupInfo} ${className}`}
      style={{...style}}
    >             
      <InputNumberItem
        label={"Number of installers"}
        value={inputData?.estInstallerCnt}
        style={{ paddingLeft: "8px" }}
        leftAlign={true}
        className="mb-1"
        handleInputChange={handleInputChange}
      />

      <CrewSelection
        label={"Senior Installer"}
        name={"seniorInstaller"}
        options={sortedStaffOptions}
        isSearchView
        className="mb-1"
        value={crew?.seniorInstaller}
        crew={crew}
        handleCrewInputChange={handleCrewInputChange}
      />

      <CrewSelection
        name={"remeasurer"}
        label={"Remeasurer"}
        options={sortedStaffOptions}
        isSearchView
        className="mb-1"
        crew={crew}
        value={crew?.remeasurer}
        //defaultValue={staffOptions[1].options[1]}
        //value={staffOptions[1].options[1]}
        handleCrewInputChange={handleCrewInputChange}
      />

      <CrewSelection
        name={"installers"}
        label={"Crew"}
        options={sortedStaffOptions}
        isSearchView
        mode={"multiple"}
        crew={crew}
        value={crew?.installers}
        handleCrewInputChange={handleCrewInputChange}
      />
    </Group>
  )
}