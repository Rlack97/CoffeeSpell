"use client";
import axios from "axios";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { BiSolidCoffeeBean } from "react-icons/bi";
import { useRouter } from "next/navigation";
import useMenuStore from "@/app/hooks/useMenuInfo";
import Pusher from "pusher-js";

interface Menu {
  menu_id: number;
  menu_name: string;
  menu_price: number;
  menu_category: string;
  user_id: number;
}

interface Menu_send {
  name: string;
  price: number;
  quantity: number;
  category: string;
  ice: boolean;
}

export default function Counter() {
  const router = useRouter();
  const { menuItems, setMenuItems } = useMenuStore();
  const [usePusher, setUsePusher] = useState<Pusher | null>(null);
  const [menuList, setmenuList] = useState<Menu_send[]>([]);
  const [packing, setPacking] = useState(false);

  // 주문 페이지 on off 용
  const [receipt, setReceipt] = useState<Boolean>(false);

  // 주문 리스트에 음식 추가
  const handleAddMenu = (menu: Menu, quantity: number) => {
    const menuObj = {
      name: menu.menu_name,
      price: menu.menu_price,
      quantity: quantity,
      category: menu.menu_category,
      ice: false,
    };
    setmenuList((prevList) => [...prevList, menuObj]);
    setReceipt(true);
  };

  // 카테고리별 메뉴 정렬
  const handleFilterMenu = (category: string) => {
    if (menuItems != null) {
      return menuItems.filter((menu) => menu.menu_category === category);
    } else {
      return [];
    }
  };
  // 메뉴 불러오기
  async function handleGetMenu() {
    try {
      const apiUrl = "/api/menu";
      const response = await axios.get(apiUrl);
      setMenuItems(response.data.rows);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }

  useEffect(() => {
    // @ts-ignore
    const channels = new Pusher(process.env.NEXT_PUBLIC_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });

    // @ts-ignore
    const channel = channels.subscribe("my-channel");
    // channel.bind("my-event", function (data: any) {
    //   alert(JSON.stringify(data));
    // });

    setUsePusher(channels);

    return () => {
      // @ts-ignore
      channel.unsubscribe("my-channel");
    };
  }, []);

  useLayoutEffect(() => {
    // 메뉴 불러오기
    if (menuItems === null) {
      handleGetMenu();
      console.log("menu called");
    }
  }, []);

  // 주문 보내기
  async function sendMenuSelectionToServer(
    menuList: Menu_send[],
    packing: boolean
  ) {
    if (menuList.length == 0) {
      alert("메뉴를 선택하세요");
    } else if (usePusher) {
      const select = window.confirm("주문을 확정하시겠습니까?");
      if (select) {
        const sendData = {
          menuList: menuList,
          packing: packing,
        };
        const apiUrl = "/api/pusher";

        try {
          // API 요청 보내기
          const response = await axios.post(apiUrl, JSON.stringify(sendData), {
            headers: {
              "Content-Type": "application/json",
            },
          });

          // 리스트 초기화
          setReceipt(false);
          setmenuList([]);
          setPacking(false);
        } catch (error) {
          console.error("API 요청 중 오류 발생:", error);
        }
      } else {
        alert("취소했습니다");
      }
    } else {
      alert("서버 오류입니다.");
    }
  }

  function decreaseQuantity(index: number) {
    setmenuList((prevList) => {
      const newList = [...prevList];
      newList[index].quantity -= 1;
      if (newList[index].quantity == 0) {
        newList.splice(index, 1);
      }
      return newList;
    });
  }

  function increaseQuantity(index: number) {
    setmenuList((prevList) => {
      const newList = [...prevList];
      newList[index].quantity += 1;
      return newList;
    });
  }

  function make_ice(index: number) {
    const checkbox = document.getElementById(
      `${menuList[index].name} 아이스 ${index}`
    );
    setmenuList((prevList) => {
      const newList = [...prevList];
      if (checkbox instanceof HTMLInputElement) {
        if (checkbox.checked) {
          newList[index].price += 500;
          newList[index].ice = true;
        } else {
          newList[index].price -= 500;
          newList[index].ice = false;
        }
      }

      return newList;
    });
  }

  const totalPrice = () => {
    let total = 0;
    for (const item of menuList) {
      total += item.price * item.quantity;
    }
    return total;
  };

  const scrollToKey = (key: string) => {
    const container = document.getElementById("menulist");
    if (container instanceof HTMLElement) {
      const keyDiv = document.getElementById(key);
      if (keyDiv instanceof HTMLElement) {
        container.scrollTo({
          top: keyDiv.offsetTop - 100, // 100은 메뉴 표시 제목 크기만큼
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="flex flex-col p-8">
      <h1
        className="text-2xl font-semibold mb-6 flex items-center w-64"
        onClick={() => router.push("/setting/cross")}
      >
        <BiSolidCoffeeBean className="mr-3" />
        Coffee Spell
      </h1>

      <div className="grow flex">
        {/* 카테고리별 버튼 렌더링 */}
        <div className="flex flex-col w-64">
          <button
            className="h-16 relative bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-l-lg text-xl"
            onClick={() => {
              setReceipt(true);
            }}
          >
            장바구니
            {menuList.length > 0 && (
              <span className="absolute top-1 left-1 transform -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-sm">
                {menuList.length}
              </span>
            )}
          </button>
          {["커피", "차", "음료", "음식"].map((category) => (
            <button
              key={`button-${category}`}
              className="h-16 relative bg-gray-200 focus:bg-gray-400 font-bold py-2 px-4 rounded-l-lg text-xl"
              onClick={() => {
                scrollToKey(category);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          id={"menulist"}
          className="bg-gray-200 p-4 rounded-r-lg overflow-y-scroll flex flex-col max-h-[83vh]"
        >
          <div className="flex space-x-4 mb-3">
            <button
              className={`px-4 py-2 rounded-md text-white ${
                packing ? "bg-green-500" : "bg-gray-300"
              }`}
              onClick={() => setPacking(true)}
              disabled={packing}
            >
              포장
            </button>
            <button
              className={`px-4 py-2 rounded-md text-white ${
                !packing ? "bg-red-500" : "bg-gray-300"
              }`}
              onClick={() => setPacking(false)}
              disabled={!packing}
            >
              매장
            </button>
          </div>
          {["커피", "차", "음료", "음식"].map((category) => (
            <div key={category} id={category} className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{category}</h2>
              <div className="flex flex-wrap">
                {handleFilterMenu(category).map((menu) => (
                  <button
                    key={menu.menu_id}
                    className="m-4 btn basis-1/5 grow-0 h-20 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-2 px-4 rounded"
                    onClick={() => handleAddMenu(menu, 1)}
                  >
                    {menu.menu_name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 주문정보 출력 및 갯수조정 */}
      {receipt && (
        <div className="fixed flex flex-col top-0 right-0 bg-white p-4 shadow-md h-full">
          <ul className="h-full overflow-y-auto flex-col">
            <div className="my-2">
              {packing && <div className="text-lg">포장주문</div>}
              {packing == false && <div className="text-lg">매장주문</div>}
            </div>
            {menuList.map((menu, index) => (
              <div key={index} className="flex-col">
                <li className="my-2">{menu.name}</li>
                {menu.category != "음식" && (
                  <div className="my-1 flex justify-between">
                    <label htmlFor="">아이스</label>
                    <input
                      type="checkbox"
                      id={`${menu.name} 아이스 ${index}`}
                      onClick={() => {
                        make_ice(index);
                      }}
                    />
                  </div>
                )}
                <li className="my-1">{menu.price * menu.quantity}</li>

                <div className="flex flex-1 items-center my-1">
                  <button
                    onClick={() => decreaseQuantity(index)}
                    className="bg-gray-200 rounded-l px-2"
                  >
                    -
                  </button>
                  <li className="px-2">{menu.quantity}개</li>
                  <button
                    onClick={() => increaseQuantity(index)}
                    className="bg-gray-200 rounded-r px-2"
                  >
                    +
                  </button>
                </div>

                <hr />
              </div>
            ))}
          </ul>
          <div className="flex-end font-bold flex justify-between">
            <div>합계</div> <div>{totalPrice()}</div>
          </div>
          <div className="flex-end">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => {
                setReceipt(false);
              }}
            >
              닫기
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => {
                if (menuList) {
                  sendMenuSelectionToServer(menuList, packing);
                }
              }}
            >
              주문하기
            </button>
          </div>
        </div>
      )}
      <script async src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    </div>
  );
}
