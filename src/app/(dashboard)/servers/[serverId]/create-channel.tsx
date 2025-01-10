"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Id } from "../../../../../convex/_generated/dataModel";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "../../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";

export default function CreateChannel({
	serverId,
}: {
	serverId: Id<"servers">;
}) {
	const [name, setName] = useState("");
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const createChannel = useMutation(api.functions.channel.create);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const channelId = await createChannel({ name, serverId });
			setOpen(false);
			toast.success("Channel created");
			router.push(`/servers/${serverId}/channels/${channelId}`);
		} catch (error) {
			toast.error("Failed to create channel", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		}
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<SidebarGroupAction>
					<PlusIcon className="w-4 h-4" />
				</SidebarGroupAction>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Channel</DialogTitle>
					<DialogDescription>Enter a name for your channel.</DialogDescription>
				</DialogHeader>
				<form className="contents" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="Channel Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button type="submit">Create Channel</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
