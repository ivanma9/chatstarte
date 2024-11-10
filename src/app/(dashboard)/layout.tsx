"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { RedirectToSignIn, SignOutButton } from "@clerk/nextjs";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarProvider,
	SidebarGroupLabel,
	SidebarGroupAction,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, PlusIcon, User2Icon } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "../../../convex/_generated/api";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Authenticated>
				<SidebarProvider>
					<DashboardSidebar />
					{children}
				</SidebarProvider>
			</Authenticated>
			<Unauthenticated>
				<RedirectToSignIn />
			</Unauthenticated>
		</>
	);
}

function DashboardSidebar() {
	const user = useQuery(api.functions.user.get);

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
								<SidebarMenuButton asChild>
									<Link href="/friends">
										<User2Icon />
										Friends
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
					<SidebarGroup>
						<SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
						<SidebarGroupAction>
							<PlusIcon />
							<span className="sr-only">New DM</span>
						</SidebarGroupAction>
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
