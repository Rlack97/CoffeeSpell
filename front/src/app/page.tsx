"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidCoffeeBean } from "react-icons/bi";
import useUserIdStore from "./hooks/useUserInfo";

interface Inputs {
  username: string;
}

export default function Home() {
  const router = useRouter();
  const { setUser_id } = useUserIdStore();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

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
      // 로그인 성공
      setUser_id(response.data.user_id);
      router.push("/setting/cross");
    } catch (error) {
      // 에러 처리
      alert("id 또는 비밀번호를 확인해 주세요");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <h1 className="text-3xl font-semibold mb-6 grid place-items-center">
          <BiSolidCoffeeBean />
          Coffee Spell
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="Input ID"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Input Password"
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

{
  /*추가 요구사항
  1. 로그아웃으로 이 페이지에 도달했을 경우,
      뒤로가기로 다시 로그인 상태로 못돌아가게 방지
  2. 이 페이지 이외의 모든 페이지들을 주소 접근으로 못들어가게 하기
      => 시도할 경우 로그인 페이지로 강제이동
  3. 로그인 시 받아온 user_id / user_pk 등을 공유 상태정리로 저장하기
   */
}
