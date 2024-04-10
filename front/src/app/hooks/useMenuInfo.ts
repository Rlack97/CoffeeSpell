import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IMenuItem {
  menu_id: number;
  menu_name: string;
  menu_price: number;
  menu_category: string;
  user_id: number;
}

interface IUseMenuStore {
  menuItems: IMenuItem[] | null; // 메뉴 정보를 담을 배열 추가
  setMenuItems: (menuItems: IMenuItem[] | null) => void;
}

const useMenuStore = create(
  persist<IUseMenuStore>(
    (set) => ({
      menuItems: null, // 메뉴 정보를 담을 빈 배열
      setMenuItems: (menuItems: IMenuItem[] | null) =>
        set(() => {
          const newMenu = menuItems;
          return {
            menuItems: newMenu,
          };
        }),
    }),
    {
      name: "menuStorage",
    }
  )
);

export default useMenuStore;
