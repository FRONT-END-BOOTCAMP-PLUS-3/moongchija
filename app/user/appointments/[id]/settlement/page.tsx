"use client"

import { useEffect, useState } from "react";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import detailDummyData from "../components/detail/dummyData/detailDummyData";
import SettlementDetail from "../components/settlement/SettlementDetail/SettlementDetail";
import styles from "./settlement.module.scss";
import { useParams } from "next/navigation";
import { detailTypes } from "../components/detail/types/detailTypes";
import IconHeader from "@/components/header/IconHeader";

const SettlementPage = () => {

  const { id } = useParams(); 
  const [detail, setDetail] =  useState<detailTypes | null>(null);

  useEffect(() => {
    if (id) {
      const appointmentDetail = detailDummyData.find((data) => data.id === Number(id));
      setDetail(appointmentDetail|| null);
    }
  }, [id]);

  if (!detail) return <div>Loading...</div>;

  return (
    <div className={styles.pageContainer}>
       <IconHeader />
      <DetailTabMenu />
      <div className={styles.container}  >
        <SettlementDetail settlementData={detail.settlement} />
      </div>
    </div>
  );
};

export default SettlementPage;
