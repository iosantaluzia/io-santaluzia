
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DropdownItem {
  name: string;
  href: string;
}

interface HeaderDropdownProps {
  title: string;
  items: DropdownItem[];
  className?: string;
}

const HeaderDropdown = ({ title, items, className = "" }: HeaderDropdownProps) => {
  const navigate = useNavigate();

  const handleItemClick = (href: string) => {
    console.log(`Navigating to: ${href}`);
    navigate(href);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center space-x-1 text-medical-primary hover:text-medical-secondary transition-colors duration-300 font-medium outline-none ${className}`}>
          <span>{title}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-white border border-gray-200 shadow-medium rounded-lg p-2 min-w-[200px] z-50"
        sideOffset={8}
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.name}
            onClick={() => handleItemClick(item.href)}
            className="cursor-pointer px-4 py-2 text-medical-primary hover:bg-medical-muted hover:text-medical-secondary transition-colors rounded-md focus:bg-medical-muted focus:text-medical-secondary outline-none"
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderDropdown;
