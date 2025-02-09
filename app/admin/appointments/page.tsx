"use client";

import { useEffect, useState } from "react";
import styles from "./appointments.module.scss";
import Link from "next/link";
import { getUserIdClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Appointment {
  id: number;
  title: string;
  status: "voting" | "confirmed";
  confirm_time: string;
}
const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUserId = await getUserIdClient();
      setUserId(currentUserId);
      if (currentUserId !== ADMIN_USER_ID) {
        setErrorMessage(
          "이 페이지는 관리자 전용입니다. 권한이 없는 사용자로는 접근할 수 없습니다."
        );
        setTimeout(() => {
          router.push("/user/appointments");
        }, 2000);
      }
    };

    checkUser();
  }, [router]);

  // ✅ 약속 데이터 불러오기
  const fetchAppointments = async () => {
    const res = await fetch("/api/admin/appointments");
    const data = await res.json();
    setAppointments(data);
    setFilteredAppointments(data); // 기본적으로 모든 약속 표시
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ 상태 필터링 기능
  useEffect(() => {
    if (statusFilter === "전체") {
      setFilteredAppointments(appointments);
      return;
    }

    const filtered = appointments.filter((appointment) => {
      if (statusFilter === "투표중") return appointment.status === "voting";
      if (statusFilter === "예정")
        return (
          appointment.status === "confirmed" &&
          new Date(appointment.confirm_time) > new Date()
        );
      if (statusFilter === "종료")
        return (
          appointment.status === "confirmed" &&
          new Date(appointment.confirm_time) <= new Date()
        );
    });

    setFilteredAppointments(filtered);
  }, [statusFilter, appointments]);

  // ✅ 약속 삭제 기능
  const handleDelete = async (appointmentId: number) => {
    if (!confirm("정말 이 약속을 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("약속이 삭제되었습니다.");
      setAppointments(
        appointments.filter((appointment) => appointment.id !== appointmentId)
      );
    } else {
      alert("약속 삭제에 실패했습니다.");
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div className={styles.container}>
          <h2>📅 약속 관리</h2>
          <div className={styles.filterContainer}>
            <label htmlFor="statusFilter">상태 필터:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="투표중">투표중</option>
              <option value="예정">예정</option>
              <option value="종료">종료</option>
            </select>
          </div>

          <div className={styles.tableContainer}>
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
                      <td>
                        <div className={styles.wrapLink}>
                          <Link
                            href={`/user/appointments/${appointment.id}/information`}
                            className={styles.link}
                          >
                            {appointment.id}
                          </Link>
                        </div>
                      </td>

                      <td>{appointment.title}</td>
                      <td
                        className={
                          appointment.status === "voting"
                            ? styles.voting
                            : new Date(appointment.confirm_time) > new Date()
                            ? styles.upcoming
                            : styles.finished
                        }
                      >
                        {appointment.status === "voting"
                          ? "투표중"
                          : new Date(appointment.confirm_time) > new Date()
                          ? "예정"
                          : "종료"}
                      </td>

                      <td
                        title={
                          appointment.status === "voting"
                            ? "미정"
                            : appointment.confirm_time
                        }
                      >
                        {appointment.status === "voting"
                          ? "미정"
                          : appointment.confirm_time}
                      </td>

                      {/* ✅ 삭제 버튼 */}
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
                      약속이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
