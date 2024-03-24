"use client";
import { useEffect, useRef, useState } from "react";
import useOrderStore from "../hooks/useOrderInfo";
import { useRouter } from "next/navigation";
import { BiSolidCoffeeBean } from "react-icons/bi";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  category: string;
  ice: boolean;
}

export default function kitchen() {
  const router = useRouter();
  const { orders, packing, addOrderItems, resetOrderItmes, deleteOrderItems } =
    useOrderStore();

  useEffect(() => {
    // 웹소켓 연결
    const socketurl = "ws://localhost:8080";
    const socket = new WebSocket(socketurl);
    socket.onopen = function (event) {
      console.log("WebSocket 연결 성공!");
    };
    // 메시지를 수신하면 호출되는 이벤트 핸들러
    socket.onmessage = function (event) {
      const receivedData = event.data;
      const reader = new FileReader();
      reader.onload = function () {
        const textData = reader.result;
        if (textData && typeof textData === "string") {
          const receivedOrder = JSON.parse(textData);
          addOrderItems(receivedOrder.menuList, receivedOrder.packing);
        }
      };
      reader.readAsText(receivedData);
    };
  }, []);

  function completeOrders() {}

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
                <button className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
                  완료
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md">
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
    </div>
  );
}

// 전달받은 리스트를 삭제하거나, 완료할수 있다
// 완료한 리스트는 DB에 저장한다.
