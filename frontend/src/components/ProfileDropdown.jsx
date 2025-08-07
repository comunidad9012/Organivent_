import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logout from "./Logout";

import store from "../redux/store";
import { useSelector } from "react-redux";
import { Roles } from "../models/roles";
import { ChevronDown } from "lucide-react";

export default function ProfileDropdown() {
  const userState = useSelector(store => store.user) //consumo el estado de redux para saber datos del usuario

  return (
    <>
   <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 transition">
        <Avatar className="h-8 w-8">
          <AvatarImage
            alt="Foto de perfil"
            src="https://github.com/shadcn.png"
          />
          {/* poner aca las iniciales de la persona */}
          <AvatarFallback>SS</AvatarFallback> 
        </Avatar>
        <span className="!text-gray-700 hover:!text-gray-900 visited:!text-gray-500">{userState.nombre_usuario}</span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>
    </DropdownMenuTrigger>


      <DropdownMenuContent className="bg-white dark:bg-zinc-900  right-0 z-50  mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black/5">
        <DropdownMenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</DropdownMenuItem>
        <DropdownMenuItem className="border-bottom block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</DropdownMenuItem>
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>

    </>
  );
}

