import { useState } from "react";
import { type IDropDown } from "../Interfaces";
import { type TestUser } from "@/appConfig";

export const UsersDropDown = ({
  items,
  selected,
  className = "",
  classNameButton = "",
  classNameList = "",
  onSelect,
}: IDropDown) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (item?: TestUser) => {
    setIsOpen(!isOpen);

    if (item) {
      onSelect(item);
    }
  };

  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className={`flex w-auto items-center ${className}`}
    >
      <button
        type="button"
        onClick={() => toggleDropdown()}
        className={`inline-flex items-center px-3 py-2 shadow-sm ${classNameButton}`}
      >
        {selected?.avatar && <div className="mr-2">{selected.avatar}</div>}
        <span className="w-full text-left">{selected?.name}</span>
        <div color="#000" className="ml-2 mt-2">
          expand
        </div>
      </button>
      {isOpen && (
        <div
          className={`absolute top-[35px] z-10 w-full shadow-lg ${classNameList}`}
        >
          <ul className="max-h-52 overflow-y-auto scroll-auto py-1">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => toggleDropdown(item)}
              >
                {item.avatar && <button className="mr-2">{item.avatar}</button>}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
