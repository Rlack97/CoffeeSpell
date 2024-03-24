import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUseUserIdStore {
  user_id: string | null;
  setUser_id: (userId: string | null) => void;
}

const useUserIdStore = create(
  persist<IUseUserIdStore>(
    (set) => ({
      user_id: null,
      setUser_id: (userId: string | null) => set(() => ({ user_id: userId })),
    }),
    {
      name: "userIdStorage",
    }
  )
);

export default useUserIdStore;
