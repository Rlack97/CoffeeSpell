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
  orderNum: number;
  numList: number[];
  resetOrderItmes: () => void;
  addOrderItems: (
    orderItem: OrderItem[],
    packing: boolean,
    num: number
  ) => void; // 주문 리스트에 주문 항목 추가
  deleteOrderItems: (orderIndex: number) => void;
  increaseOrderNum: () => void;
}

const useOrderStore = create(
  persist<UseOrderStore>(
    (set) => ({
      orders: [[]], // 메뉴 정보를 담을 빈 배열
      packing: [],
      orderNum: 1,
      numList: [],
      addOrderItems: (
        orderItem: OrderItem[],
        packing: boolean,
        num: number
      ) => {
        set((state) => {
          if (
            // 빈 리스트일 경우에는 push가 아니라 값을 대체함
            Array.isArray(state.orders) &&
            state.orders.length === 1 &&
            Array.isArray(state.orders[0]) &&
            state.orders[0].length === 0
          ) {
            const newOrders = [orderItem];
            return { orders: newOrders, packing: [packing], numList: [num] };
          }
          const newOrders = [...state.orders];
          newOrders.push(orderItem);
          const newPacking = [...state.packing];
          newPacking.push(packing);
          const newNumList = [...state.numList];
          newNumList.push(num);
          return {
            orders: newOrders,
            packing: newPacking,
            numList: newNumList,
          };
        });
      },
      resetOrderItmes: () => {
        set(() => {
          return { orders: [[]], packing: [], orderNum: 1, numList: [] };
        });
      },
      deleteOrderItems: (orderIndex: number) => {
        set((state) => {
          const newOrders = [...state.orders];
          const newPacking = [...state.packing];
          const newNumList = [...state.numList];

          // 주문 및 포장 여부 배열에서 해당 인덱스의 항목 삭제
          newOrders.splice(orderIndex, 1);
          newPacking.splice(orderIndex, 1);
          newNumList.splice(orderIndex, 1);

          return {
            orders: newOrders,
            packing: newPacking,
            numList: newNumList,
          };
        });
      },
      increaseOrderNum: () => {
        set((state) => {
          const increased = state.orderNum + 1;
          return { orderNum: increased };
        });
      },
      resetOrderNum: () => {
        set(() => {
          return { orderNum: 1 };
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
