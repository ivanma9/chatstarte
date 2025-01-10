import { useQuery } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import CreateInvite from "./create-invite";
export default function ServerMembers({ id }: { id: Id<"servers"> }) {
	const members = useQuery(api.functions.server.members, { id });
	return (
		<div className="flex flex-col max-w-80 w-full border-l p-4 bg-muted">
			{members?.map((member) => (
				<div className="flex items-center gap-2" key={member._id}>
					<Avatar>
						<AvatarImage src={member.image} />
						<AvatarFallback>{member.username[0]}</AvatarFallback>
					</Avatar>
					<p>{member.username}</p>
				</div>
			))}
			<CreateInvite serverId={id} />
		</div>
	);
}
