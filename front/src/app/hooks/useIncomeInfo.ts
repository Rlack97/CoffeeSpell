import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseIncomeStore {
  income: number;
  setIncome: (daily_income: number) => void;
  resetIncome: () => void;
}

const useIncomeStore = create(
  persist<UseIncomeStore>(
    (set) => ({
      income: 0,
      setIncome: (income: number) =>
        set((state) => ({ income: state.income + income })),
      resetIncome: () => set(() => ({ income: 0 })),
    }),
    {
      name: "incomeStorage",
    }
  )
);

export default useIncomeStore;
