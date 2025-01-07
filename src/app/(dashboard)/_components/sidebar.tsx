"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { User2Icon } from "lucide-react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { NewDirectMessage } from "./new-direct-message";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
	const user = useQuery(api.functions.user.get);
	const dms = useQuery(api.functions.dm.list);
	const pathName = usePathname();

	if (!user) {
		return null;
	}

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={pathName === "/"}>
									<Link href="/">
										<User2Icon />
										Friends
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
					<SidebarGroup>
						<SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
						<NewDirectMessage />
						<SidebarGroupContent>
							<SidebarMenu>
								{dms?.map((dm) => (
									<SidebarMenuItem key={dm._id}>
										<SidebarMenuButton
											asChild
											isActive={pathName === `/dms/${dm._id}`}
										>
											<Link href={`/dms/${dm._id}`}>
												<Avatar className="size-6">
													<AvatarImage src={dm.user.image} />
													<AvatarFallback>{dm.user.username[0]}</AvatarFallback>
												</Avatar>
												<p className="font-medium">{dm.user.username}</p>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton className="flex items-center">
											<Avatar className="size-6">
												<AvatarImage src={user.image} />
												<AvatarFallback>{user.username[0]}</AvatarFallback>
											</Avatar>
											<p>{user.username}</p>
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem asChild>
											<SignOutButton />
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
