import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  category: string;
  ice: boolean;
}

interface UseOrderStore {
  orders: OrderItem[][]; // 메뉴 정보를 담을 배열 추가
  packing: boolean[];
  resetOrderItmes: () => void;
  addOrderItems: (orderItem: OrderItem[], packing: boolean) => void; // 주문 리스트에 주문 항목 추가
  deleteOrderItems: (orderIndex: number) => void;
}

const useOrderStore = create(
  persist<UseOrderStore>(
    (set) => ({
      orders: [[]], // 메뉴 정보를 담을 빈 배열
      packing: [],
      addOrderItems: (orderItem: OrderItem[], packing: boolean) => {
        set((state) => {
          if (
            // 빈 리스트일 경우에는 push가 아니라 값을 대체함
            Array.isArray(state.orders) &&
            state.orders.length === 1 &&
            Array.isArray(state.orders[0]) &&
            state.orders[0].length === 0
          ) {
            const newOrders = [orderItem];
            return { orders: newOrders, packing: [packing] };
          }
          const newOrders = [...state.orders];
          newOrders.push(orderItem);
          const newPacking = [...state.packing];
          newPacking.push(packing);
          return { orders: newOrders, packing: newPacking };
        });
      },
      resetOrderItmes: () => {
        set(() => {
          return { orders: [[]], packing: [] };
        });
      },
      deleteOrderItems: (orderIndex: number) => {
        set((state) => {
          const newOrders = [...state.orders];
          const newPacking = [...state.packing];

          // 주문 및 포장 여부 배열에서 해당 인덱스의 항목 삭제
          newOrders.splice(orderIndex, 1);
          newPacking.splice(orderIndex, 1);

          return { orders: newOrders, packing: newPacking };
        });
      },
    }),
    {
      name: "orderStorage",
    }
  )
);

export default useOrderStore;

// 초기화 및 삭제 로직
