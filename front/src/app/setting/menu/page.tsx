"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidCoffeeBean } from "react-icons/bi";

export default function menu() {
  const router = useRouter();

  return (
    <div>
      <h1
        className="text-3xl font-semibold mb-6 flex items-center"
        onClick={() => {
          router.push("/setting/cross");
        }}
      >
        <BiSolidCoffeeBean className="mr-2" />
        Coffee Spell
      </h1>
    </div>
  );
}

{
  /*추가 요구사항
1. (상태관리가 비어있을 경우 )
user id 기반으로 메뉴 리스트 요청해서 받아와서 상태관리에 저장
2. 메뉴 id 기반으로 등록 / 수정 / 삭제 
   */
}
