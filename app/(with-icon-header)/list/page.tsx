"use client"

import React, { useState } from "react";
import styles from "./list.module.scss"
import TabMenu from "../../../components/tabMenu/TabMenu";
import AppointmentList from "./_components/AppointmentList";
import VotingList from "./_components/VotingList";

const MainComponent: React.FC = () => {
  const tabs = ["투표 진행중", "약속 리스트"];
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = (index: number) => {
    setCurrentTab(index);
  };

  return (
    <>
      <TabMenu tabs={tabs} onTabChange={handleTabChange} />
      <main className={styles.mainBox}>
        {currentTab === 0 && <VotingList />}
        {currentTab === 1 && <AppointmentList />}
      </main>
    </>
  );
};

export default MainComponent;
