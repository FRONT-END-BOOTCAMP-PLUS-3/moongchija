"use client";

import { useEffect, useState } from "react";
import styles from "./users.module.scss";

interface User {
  id: string;
  email: string;
  nickname: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchType, setSearchType] = useState<"id" | "email" | "nickname">(
    "id"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers(); // 검색어가 없으면 전체 목록 로드
      return;
    }

    const query = new URLSearchParams({ [searchType]: searchQuery }).toString();
    const res = await fetch(`/api/admin/users?${query}`);
    const data = await res.json();
    setUsers(data);
  };

  return (
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
        <button className={styles.searchButton} onClick={handleSearch}>
          검색
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>닉네임</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.nickname}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
