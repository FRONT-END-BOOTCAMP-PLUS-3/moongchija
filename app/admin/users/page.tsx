"use client";

import { useEffect, useState } from "react";
import styles from "./users.module.scss";
import useAdminCheck from "../hooks/useAdminCheck";

interface User {
  id: string;
  email: string;
  nickname: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // 검색 필터링된 목록
  const [searchType, setSearchType] = useState<"id" | "email" | "nickname">(
    "id"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { errorMessage } = useAdminCheck();

  // ✅ 전체 유저 목록 불러오기
  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    const mappedData = data.map((user: any) => ({
      id: user.id,
      email: user.user_email, // ✅ 여기서 필드명 변경
      nickname: user.nickname,
    }));

    setUsers(mappedData);
    setFilteredUsers(mappedData); // 기본적으로 모든 유저 표시
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ 검색 필터링 기능 (useEffect 사용)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users); // 검색어가 없으면 전체 목록 표시
      return;
    }

    // ✅ 검색어를 포함하는 유저만 필터링
    const filtered = users.filter((user) =>
      user[searchType].toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchQuery, searchType, users]);

  // ✅ 삭제 기능
  const handleDelete = async (userId: string) => {
    if (!confirm("정말 이 유저를 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("유저가 삭제되었습니다.");
      setUsers(users.filter((user) => user.id !== userId)); // 삭제된 유저 목록에서 제거
    } else {
      alert("유저 삭제에 실패했습니다.");
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div className={styles.container}>
          <h2>👥 유저 관리</h2>

          <div className={styles.searchBar}>
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as "id" | "email" | "nickname")
              }
            >
              <option value="id">ID</option>
              <option value="email">이메일</option>
              <option value="nickname">닉네임</option>
            </select>
            <input
              type="text"
              placeholder="검색어 입력"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이메일</th>
                  <th>닉네임</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td title={user.id}>{user.id}</td>
                      <td title={user.email}>{user.email}</td>
                      <td title={user.nickname}>{user.nickname}</td>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(user.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      검색 결과가 없습니다.
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
