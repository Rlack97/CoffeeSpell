import { BiX } from "react-icons/bi";
import { useState, useEffect } from "react";
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
}

export default function MenuModal({ isOpen, onClose, menu }: MenuModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
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

  const handleCreateMenu = () => {
    // 메뉴 추가 기능 구현
  };

  const handleDeleteMenu = () => {
    // 메뉴 삭제 기능 구현
    const result = confirm("메뉴를 삭제하시겠습니까?");
    if (result) {
      // 삭제 동작 실행
    } else {
      // 삭제 취소
    }
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 수정된 메뉴 정보를 서버로 전송하는 로직 추가
    const result = confirm("메뉴 정보를 수정하시겠습니까?");
    if (result) {
      // 수정 동작 실행
    } else {
      // 수정 취소
      alert("취소합니다.");
    }
    onClose();
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
            <h2 className="text-2xl font-semibold mb-4">메뉴 정보 수정</h2>
            <form onSubmit={handleFormSubmit}>
              {/* 메뉴 이름 수정 폼 */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  메뉴 이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              {/* 메뉴 가격 수정 폼 */}
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  메뉴 가격
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              {/* 메뉴 카테고리 수정 폼 */}
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  메뉴 카테고리
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  수정
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

// 추가 필요
// 메뉴 추가 / 수정 / 삭제 로직 (db 및 zustand 데이터 변경)
