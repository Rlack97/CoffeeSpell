"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      // API 엔드포인트 URL
      const apiUrl = "http://localhost:3000/api/user/login";

      // 로그인 데이터
      const data = {
        userId: userId,
        password: password,
      };

      // API 요청 보내기
      const response = await axios.post(apiUrl, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // 응답 데이터 출력
      console.log("응답 데이터:", response.data);
      setMessage(response.data.message);
    } catch (error) {
      // 에러 처리
      console.error("API 요청 에러:", error);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <h1 className="text-3xl font-semibold mb-6">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="userId" className="block">
              User ID:
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
