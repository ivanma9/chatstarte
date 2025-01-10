import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useQuery } from "convex/react";
import { PhoneIcon } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
export default function Voice({ serverId }: { serverId: Id<"servers"> }) {
	const token = useQuery(api.functions.livekit.getToken, { serverId });

	return (
		<Dialog>
			<DialogTrigger asChild>
				<SidebarMenuButton>
					<PhoneIcon className="w-4 h-4" />
					Voice
				</SidebarMenuButton>
			</DialogTrigger>
			<DialogContent className="max-w-screen-md">
				<DialogTitle className="sr-only">Voice</DialogTitle>
				<LiveKitRoom
					serverUrl="wss://chatstarter-4abfxxpn.livekit.cloud"
					token={token}
				>
					<VideoConference />
				</LiveKitRoom>
			</DialogContent>
		</Dialog>
	);
}
