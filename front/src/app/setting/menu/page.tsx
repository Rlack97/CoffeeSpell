"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useMenuStore from "@/app/hooks/useMenuInfo";
import MenuModal from "./menumodal";
import { BiSolidCoffeeBean } from "react-icons/bi";

interface Menu {
  menu_id: number;
  menu_name: string;
  menu_price: number;
  menu_category: string;
  user_id: number;
}

export default function Menu() {
  const router = useRouter();
  const { menuItems, setMenuItems } = useMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  useEffect(() => {
    if (menuItems === null) {
      handleGetMenu();
      console.log("menu called");
    }
  }, []);

  async function handleGetMenu() {
    try {
      const apiUrl = "/api/menu";
      const response = await axios.get(apiUrl);
      setMenuItems(response.data.message);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }

  const handleAddMenu = () => {
    setSelectedMenu(null);
    handleModalOpen();
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    handleModalOpen();
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFilterMenu = (category: string) => {
    if (menuItems != null) {
      return menuItems.filter((menu) => menu.menu_category === category);
    } else {
      return [];
    }
  };

  return (
    <div>
      <h1
        className="text-3xl font-semibold mb-6 flex items-center"
        onClick={() => router.push("/setting/cross")}
      >
        <BiSolidCoffeeBean className="mr-2" />
        Coffee Spell
      </h1>
      <div className="mb-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleAddMenu}
        >
          메뉴 추가
        </button>
      </div>
      <div>
        {/* 카테고리별로 버튼 렌더링 */}
        {["커피", "차", "음료", "음식"].map((category) => (
          <div key={category} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{category}</h2>
            <div className="flex flex-wrap ">
              {handleFilterMenu(category).map((menu) => (
                <button
                  key={menu.menu_id}
                  className="m-4 btn w-64 h-20 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditMenu(menu)}
                >
                  {menu.menu_name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <MenuModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        menu={selectedMenu}
      />
    </div>
  );
}
