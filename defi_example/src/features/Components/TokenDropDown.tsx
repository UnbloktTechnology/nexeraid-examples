import { useState } from "react";
import { Icon } from "@nexeraprotocol/react-components";
import { type IDropDown, type ITokenInfo } from "../Interfaces";

export const TokenDropDown = ({
  items,
  selected,
  className="",
  classNameButton="",
  classNameList="",
  onSelect,
}: IDropDown) => {
  const [isOpen, setIsOpen] = useState(false);

  if (typeof selected === "undefined") {
    selected = {
      value: "select",
      label: 'Select Token',
      pairs: [],
      address: "",
    }
  }

  const initialClass = selected?.value === "select" ? "!bg-[#4C82FB]" : "";

  const toggleDropdown = (item?: ITokenInfo) => {
    setIsOpen(!isOpen);

    if (item) {
      onSelect(item);
    }
  }

  return (
    <div onMouseLeave={() => setIsOpen(false)} className={`flex items-center w-auto ${className}`}>
      <button
        type="button"
        onClick={() => toggleDropdown()}
        className={`inline-flex items-center px-3 py-2 shadow-sm ${classNameButton} ${initialClass}`}
      >
        {selected?.icon && <Icon icon={selected.icon} size={24} className="mr-2" />}
        <span>{selected?.label}</span>
        <Icon icon="expand" size={12} color="#FFFF" className="ml-2 mt-2"/>
      </button>
      {isOpen && (
        <div className={`absolute top-[68px] z-40 w-full rounded-md shadow-lg ${classNameList}`}>
          <ul className="py-1 scroll-auto max-h-52 overflow-y-auto">
            {items.map((item) => (
              <li
                key={item.value}
                className="flex items-center cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => toggleDropdown(item)}
              >
                {item.icon && <Icon icon={item.icon} size={24} className="mr-2" />}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}