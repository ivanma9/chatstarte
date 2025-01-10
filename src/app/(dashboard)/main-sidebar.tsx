import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreateServer } from "./create-server";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
export function MainSidebar() {
	const servers = useQuery(api.functions.server.list);
	const pathName = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip="Direct Messages"
									asChild
									isActive={pathName.startsWith("/dms")}
								>
									<Link href="/dms">
										<UserIcon className="w-4 h-4" />
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{servers?.map((server) => (
								<SidebarMenuItem key={server._id}>
									<SidebarMenuButton
										className="group-data-[collapsible=icon]:!p-0 flex items-center justify-center"
										tooltip={server.name}
									>
										<Link
											href={`/servers/${server._id}/channels/${server.defaultChannelId}`}
										>
											<Avatar className="rounded-none flex items-center justify-center">
												{server.iconUrl && <AvatarImage src={server.iconUrl} />}
												<AvatarFallback>{server.name[0]}</AvatarFallback>
											</Avatar>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<SidebarMenuItem>
								<CreateServer />
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
