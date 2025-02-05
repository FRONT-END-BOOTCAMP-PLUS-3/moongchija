"use client";

import { useState } from "react";
import CreateInformation from "./components/information";
import CreateTime from "./components/time";
import CreatePlace from "./components/place";
import { CreateAppointmentProvider } from "@/context/CreateAppointmentContext";
import ArrowHeader from "@/components/header/ArrowHeader";

const CreatePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
  };

  return (
    <CreateAppointmentProvider>
        <ArrowHeader setValue={setCurrentPage}/>
      {currentPage === 1 && (<CreateInformation onPageChange={handlePageChange} />)}
      {currentPage === 2 && <CreateTime onPageChange={handlePageChange} />}
      {currentPage === 3 && <CreatePlace />}
    </CreateAppointmentProvider>
  );
};

export default CreatePage;
