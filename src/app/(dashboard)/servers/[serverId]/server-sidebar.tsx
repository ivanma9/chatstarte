import { Id } from "../../../../../convex/_generated/dataModel";
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuAction,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import CreateChannel from "./create-channel";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import Voice from "./voice";
export default function ServerSidebar({ id }: { id: Id<"servers"> }) {
	const server = useQuery(api.functions.server.get, { id });
	const channels = useQuery(api.functions.channel.list, { id });
	const pathName = usePathname();
	const removeChannel = useMutation(api.functions.channel.remove);
	const router = useRouter();

	const handleRemoveChannel = async (id: Id<"channels">) => {
		try {
			if (server) {
				router.push(
					`/servers/${server._id}/channels/${server.defaultChannelId}`
				);
			}
			await removeChannel({ id });
			toast.success("Channel removed");
		} catch (error) {
			toast.error("Failed to remove channel", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		}
	};

	return (
		<Sidebar className="left-12">
			<SidebarHeader>{server?.name}</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Channels</SidebarGroupLabel>
					<CreateChannel serverId={id} />
					<SidebarGroupContent>
						<SidebarMenu>
							{channels?.map((channel) => (
								<SidebarMenuItem key={channel._id}>
									<SidebarMenuButton
										asChild
										isActive={
											pathName === `/servers/${id}/channels/${channel._id}`
										}
									>
										<Link href={`/servers/${id}/channels/${channel._id}`}>
											{channel.name}
										</Link>
									</SidebarMenuButton>
									<SidebarMenuAction
										onClick={() => handleRemoveChannel(channel._id)}
									>
										<Trash2Icon />
									</SidebarMenuAction>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<Voice serverId={id} />
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
