"use client";

import { useState } from "react";
import { CreateAppointmentProvider } from "@/context/CreateAppointmentContext";

import ArrowHeader from "@/components/header/ArrowHeader";
import CreateComplete from "./components/createComplete";
import CreateInformation from "./components/createInformation";
import CreateTime from "./components/createTime";
import CreatePlace from "./components/createPlace";

const CreatePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
  };

  const handleIsComplete = () => {
    setIsComplete(true);
  }

  return (
    <CreateAppointmentProvider>
      <ArrowHeader setValue={isComplete ? undefined : setCurrentPage}/>
      {currentPage === 1 && (<CreateInformation onPageChange={handlePageChange} />)}
      {currentPage === 2 && <CreateTime onPageChange={handlePageChange} />}
      {currentPage === 3 && <CreatePlace onPageChange={handlePageChange} />}
      {currentPage === 4 && <CreateComplete onIsComplete={handleIsComplete} />}
    </CreateAppointmentProvider>
  );
};

export default CreatePage;
