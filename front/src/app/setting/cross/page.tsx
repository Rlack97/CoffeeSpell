"use client";

import { BiSolidCoffeeBean } from "react-icons/bi";
import { useRouter } from "next/navigation";
import useUserIdStore from "@/app/hooks/useUserInfo";

export default function cross() {
  const router = useRouter();
  const { user_id, setUser_id } = useUserIdStore();
  const clearUserIdStorage = useUserIdStore.persist.clearStorage;

  function logout() {
    if (window.confirm("로그아웃 하시겠습니까?")) {
    } else {
      alert("취소합니다.");
      return;
    }
    router.push("/");
    setUser_id("");
    clearUserIdStorage();
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <h1 className="text-3xl font-semibold mb-6 grid place-items-center">
          <BiSolidCoffeeBean />
          Wellcome, {user_id}
        </h1>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/setting/menu")}
          >
            관리
          </button>

          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/counter")}
          >
            카운터
          </button>

          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/kitchen")}
          >
            주방
          </button>
        </div>
        <div
          className="flex justify-end mt-2 text-blue-500 hover:underline"
          onClick={() => {
            logout();
          }}
        >
          logout
        </div>
      </div>
    </div>
  );
}

// 함수들에 다 이름 붙여서 쓸 것. 에러코드 난다.
