import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUseUserIdStore {
  user_id: string | null;
  user_pk: number | null;
  setUser_id: (userId: string | null) => void;
  setUser_pk: (user_pk: number | null) => void;
}

const useUserIdStore = create(
  persist<IUseUserIdStore>(
    (set) => ({
      user_id: null,
      user_pk: null,
      setUser_id: (userId: string | null) => set(() => ({ user_id: userId })),
      setUser_pk: (user_pk: number | null) => set(() => ({ user_pk: user_pk })),
    }),

    {
      name: "userIdStorage",
    }
  )
);

export default useUserIdStore;
