import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/slices/uiSlice";
import { FiMenu, FiBell } from "react-icons/fi";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-jakarta font-semibold text-gray-800">
          Pavement Management Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <FiBell
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          size={22}
        />
        <div className="w-8 h-8 rounded-full text-[13x] p-1 bg-blue-500 text-white flex items-center justify-center font-jakarta font-medium">
          PM
        </div>
      </div>
    </header>
  );
};

export default Header;
