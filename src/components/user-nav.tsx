import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LogOut, Scale, Settings, Users} from "lucide-react";
import Link from "next/link";
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";

interface iAppProps {
    userImage: string | null;
}

export default function UserNav({userImage} : iAppProps) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={userImage ?? "/placeholder-avatar.png"} alt="@Avatar" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"w-52"}>
                    <DropdownMenuLabel>My account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link href={"/r/create"} className={"flex items-center w-full"}>
                                <Users className={"h-4 w-4 mr-2"}/> Create community
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={"/settings"} className={"flex items-center w-full"}>
                                <Settings className={"h-4 w-4 mr-2"} /> User settings
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link href={"/privacy-policy"} className={"flex items-center w-full"}>
                                <Scale className={"h-4 w-4 mr-2"}/> Privacy Policy
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={"/terms-of-use"} className={"flex items-center w-full"}>
                                <Scale className={"h-4 w-4 mr-2"}/> Terms of Use
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={"text-red-500 font-medium focus:bg-red-500 focus:text-white"}>
                        <LogoutLink className={"flex items-center w-full"}>
                            <LogOut className={"h-4 w-4 mr-2"} /> Log out
                        </LogoutLink>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )

}
