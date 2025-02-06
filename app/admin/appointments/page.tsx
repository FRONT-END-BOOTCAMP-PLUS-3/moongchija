"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./appointments.module.scss";

interface Appointment {
  id: number;
  title: string;
  status: string;
  confirm_time: string | null;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

  const fetchAppointments = async () => {
    const res = await fetch("/api/admin/appointments");
    const data = await res.json();
    setAppointments(data);
    setFilteredAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const updatedAppointments = appointments.filter(
        (appointment) => appointment.id !== id
      );
      setAppointments(updatedAppointments);
      filterAppointments(statusFilter, updatedAppointments);
    } else {
      alert("삭제 실패");
    }
  };

  // ✅ 상태 라벨 결정 함수
  const getStatusLabel = (status: string, confirmTime: string | null) => {
    if (status === "voting") return "투표중";
    if (status === "confirmed") {
      return confirmTime && new Date(confirmTime) > new Date()
        ? "예정"
        : "종료";
    }
    return "알 수 없음";
  };

  // ✅ 확정 시간 표시 함수
  const getConfirmTimeLabel = (status: string, confirmTime: string | null) => {
    if (status === "voting") return "미정";
    return confirmTime ? new Date(confirmTime).toLocaleString() : "미정";
  };

  // ✅ 상태 필터 적용 함수
  const filterAppointments = (
    filter: string,
    data: Appointment[] = appointments
  ) => {
    if (filter === "all") {
      setFilteredAppointments(data);
    } else {
      setFilteredAppointments(
        data.filter(
          (appointment) =>
            getStatusLabel(appointment.status, appointment.confirm_time) ===
            filter
        )
      );
    }
  };

  // ✅ 드롭다운 선택 시 필터링
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setStatusFilter(value);
    filterAppointments(value);
  };

  return (
    <div className={styles.container}>
      <h2>📅 약속 관리</h2>

      {/* ✅ 상태 필터 드롭다운 */}
      <div className={styles.filterContainer}>
        <label htmlFor="statusFilter">상태 필터:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="all">전체</option>
          <option value="투표중">투표중</option>
          <option value="예정">예정</option>
          <option value="종료">종료</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>상태</th>
            <th>확정 시간</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td
                  className={styles.link}
                  onClick={() =>
                    router.push(
                      `/user/appointments/${appointment.id}/information`
                    )
                  }
                >
                  {appointment.id}
                </td>
                <td>{appointment.title}</td>
                <td
                  className={
                    getStatusLabel(
                      appointment.status,
                      appointment.confirm_time
                    ) === "투표중"
                      ? styles.voting
                      : getStatusLabel(
                          appointment.status,
                          appointment.confirm_time
                        ) === "예정"
                      ? styles.upcoming
                      : styles.finished
                  }
                >
                  {getStatusLabel(appointment.status, appointment.confirm_time)}
                </td>
                <td>
                  {getConfirmTimeLabel(
                    appointment.status,
                    appointment.confirm_time
                  )}
                </td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(appointment.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                등록된 약속이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
