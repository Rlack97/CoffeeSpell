import { BiX } from "react-icons/bi";
import { useState, useEffect, useLayoutEffect } from "react";
import useUserIdStore from "@/app/hooks/useUserInfo";
import axios from "axios";

interface Menu {
  menu_id: number;
  menu_name: string;
  menu_price: number;
  menu_category: string;
  user_id: number;
}

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu | null;
  menuUpdate: () => void;
}

export default function MenuModal({
  isOpen,
  onClose,
  menu,
  menuUpdate,
}: MenuModalProps) {
  const { user_pk } = useUserIdStore();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [title, setTitle] = useState("메뉴 정보 수정");

  useLayoutEffect(() => {
    if (menu) {
      setTitle("메뉴 정보 수정");
    } else {
      setTitle("신 메뉴 등록");
    }
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.menu_name,
        price: menu.menu_price.toString(),
        category: menu.menu_category,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
      });
    }
  }, [menu]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 메뉴 추가 기능
  async function handleCreateMenu() {
    const message = window.confirm("메뉴를 추가하시겠습니까?");
    if (message) {
      if (!formData.category) {
        alert("카테고리를 선택해 주세요");
        return; // 카테고리가 비어있으면 함수 종료
      }

      const apiUrl = "/api/menu/add";
      try {
        const sendData = {
          menu_name: formData.name,
          menu_price: formData.price,
          menu_category: formData.category,
          user_pk: user_pk,
        };
        const response = await axios.post(apiUrl, JSON.stringify(sendData), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        // 요청이 성공적으로 반환되었을 때
        if (response.status === 200) {
          // 성공 상태 코드 확인
          alert("메뉴가 추가되었습니다.");
          menuUpdate(); // menuUpdate 함수 호출
        }
      } catch (error) {
        alert("API 요청 중 오류 발생");
      }
    }
  }

  // 메뉴 삭제 기능 구현
  async function handleDeleteMenu() {
    const result = window.confirm("메뉴를 삭제하시겠습니까?");
    if (result) {
      const apiUrl = `/api/menu/${menu?.menu_id}`;
      // 삭제 동작 실행
      try {
        const sendData = {
          menu_id: menu?.menu_id,
          user_pk: user_pk,
        };
        const response = await axios.delete(apiUrl, {
          data: sendData,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          // 성공 상태 코드 확인
          alert("메뉴가 삭제되었습니다.");
          menuUpdate(); // menuUpdate 함수 호출
        }
        onClose();
        setFormData({
          name: "",
          price: "",
          category: "",
        });
      } catch (error) {
        console.error("API 요청 중 오류 발생");
      }
    } else {
      // 삭제 취소
      alert("취소합니다.");
      onClose();
      setFormData({
        name: "",
        price: "",
        category: "",
      });
    }
    onClose();
  }

  async function handleUpdateMenu(menu: Menu) {
    const message = window.confirm("메뉴 정보를 수정하시겠습니까?");
    if (message) {
      const apiUrl = `/api/menu/${menu.menu_id}`;
      try {
        const sendData = {
          menu_id: menu?.menu_id,
          menu_name: formData.name,
          menu_price: formData.price,
          menu_category: formData.category,
          user_pk: user_pk,
        };
        const response = await axios.post(apiUrl, JSON.stringify(sendData), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          alert("메뉴가 수정되었습니다.");
          menuUpdate();
        }
      } catch (error) {
        alert("API 요청 중 오류 발생");
      }
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 전달받은 값이 있음 = 수정
    if (menu) {
      // 수정된 메뉴 정보를 서버로 전송하는 로직 추가
      handleUpdateMenu(menu);
    } else {
      // 전달값 없음 = 추가
      handleCreateMenu();
    }
    onClose();
    setFormData({
      name: "",
      price: "",
      category: "",
    });
  };

  const handleModalClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
          onClick={handleModalClick}
        >
          <div
            className="bg-white p-8 rounded-lg z-10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2"
              onClick={() => {
                onClose();
                setFormData({
                  name: "",
                  price: "",
                  category: "",
                });
              }}
            >
              <BiX className="text-gray-600" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* 메뉴 이름 수정 폼 */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-base font-medium text-gray-700"
                >
                  메뉴 이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-200 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-base border-gray-300 rounded-md py-2 px-4 "
                />
              </div>
              {/* 메뉴 가격 수정 폼 */}
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-base font-medium text-gray-700"
                >
                  메뉴 가격
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="bg-gray-200 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-base border-gray-300 rounded-md py-2 px-4"
                />
              </div>
              {/* 메뉴 카테고리 수정 폼 */}
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-base font-medium text-gray-700"
                >
                  메뉴 카테고리
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  className="bg-gray-200 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-base border-gray-300 rounded-md py-2 px-4"
                >
                  <option value="" disabled>
                    카테고리 선택
                  </option>
                  <option value="커피">커피</option>
                  <option value="차">차</option>
                  <option value="음료">음료</option>
                  <option value="음식">음식</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  {menu ? "수정" : "추가"}
                </button>
                {menu && (
                  <button
                    type="button"
                    onClick={handleDeleteMenu}
                    className="bg-red-500 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                  >
                    삭제
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
