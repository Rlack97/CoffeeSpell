"use client";
import axios from "axios";
import { useEffect } from "react";
import useOrderStore from "../hooks/useOrderInfo";
import useIncomeStore from "../hooks/useIncomeInfo";
import useUserIdStore from "../hooks/useUserInfo";
import { useRouter } from "next/navigation";
import { BiSolidCoffeeBean } from "react-icons/bi";
import Pusher from "pusher-js";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  category: string;
  ice: boolean;
}

export default function Kitchen() {
  const router = useRouter();
  const { user_id } = useUserIdStore();
  const { orders, packing, addOrderItems, resetOrderItmes, deleteOrderItems } =
    useOrderStore();
  const { income, setIncome, resetIncome } = useIncomeStore();

  useEffect(() => {
    // 웹소켓 연결
    // @ts-ignore
    const channels = new Pusher(process.env.NEXT_PUBLIC_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });
    // @ts-ignore
    const channel = channels.subscribe("my-channel");

    // 메시지를 수신하면 호출되는 이벤트 핸들러
    channel.bind("my-event", function (data: any) {
      addOrderItems(data.message.menuList, data.message.packing);
    });
  }, []);

  function completeOrders(orderList: OrderItem[], index: number) {
    // 일일매출값에 현재 주문의 금액만큼의 값을 더함\
    const totalPrice: number = orderList.reduce((acc, currentItem) => {
      // 각 항목의 가격 * 수량을 합산하여 반환
      return acc + currentItem.price * currentItem.quantity;
    }, 0);

    setIncome(totalPrice);
    // 리스트에서 삭제
    deleteOrderItems(index);
  }

  async function completeDay() {
    const endDay = window.confirm(
      "하루 영업을 마치고 일일 매출을 저장하시겠습니까?"
    );
    if (endDay) {
      const apiUrl = "/api/dailyincome/add";
      try {
        const sendData = {
          user_id: user_id,
          income: income,
        };
        // 일일매출값을 DB에 저장
        const response = await axios.post(apiUrl, JSON.stringify(sendData), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    }
  }

  return (
    <div className="flex flex-col p-8">
      <h1
        className="text-3xl font-semibold mb-6 flex items-center"
        onClick={() => router.push("/setting/cross")}
      >
        <BiSolidCoffeeBean className="mr-3" />
        Coffee Spell
      </h1>

      <div className="flex flex-row gap-4 overflow-x-scroll">
        {orders.length === 0 ||
        (orders.length === 1 && orders[0].length === 0) ? (
          <div className="bg-gray-200 p-4 rounded-md flex-shrink-0">
            <h2 className="text-lg font-semibold">들어온 주문이 없어요!</h2>
          </div>
        ) : (
          orders.map((orderList, index) => (
            <div
              key={index}
              className="bg-gray-200 p-4 rounded-md flex-shrink-0"
            >
              <h2>{packing[index] ? "포장" : "매장"}</h2>
              <h2 className="text-lg font-semibold mb-2">
                주문 리스트 #{index + 1}
              </h2>
              <ul className="space-y-2">
                {orderList.map((orderItem, itemIndex) => (
                  <div key={itemIndex} className="flex items-center">
                    <strong>{orderItem.name}</strong>&nbsp;
                    {orderItem.ice && "아이스"}&nbsp;
                    <span className="ml-auto">
                      {orderItem.quantity}개 -
                      {orderItem.price * orderItem.quantity}₩
                    </span>
                  </div>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    completeOrders(orderList, index);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  완료
                </button>
                <button
                  onClick={() => {
                    deleteOrderItems(index);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  취소
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        onClick={resetOrderItmes}
        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
      >
        초기화
      </button>
      <button
        onClick={resetIncome}
        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
      >
        매출 초기화
      </button>
      <div> 오늘 매출 : {income}원</div>
      <button
        onClick={completeDay}
        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
      >
        일일 마감
      </button>
    </div>
  );
}
