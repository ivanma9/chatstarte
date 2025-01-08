import { api } from "../../convex/_generated/api";

import { useMutation, useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { ScrollArea } from "./ui/scroll-area";
import { FunctionReturnType } from "convex/server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	MoreVerticalIcon,
	TrashIcon,
	SendIcon,
	PlusIcon,
	Loader2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/use-image-upload";

export function Messages({ id }: { id: Id<"directMessages" | "channels"> }) {
	const messages = useQuery(api.functions.message.list, {
		dmOrChannelId: id,
	});
	return (
		<>
			<ScrollArea className="h-full py-4">
				{messages?.map((message) => (
					<MessageItem key={message._id} message={message} />
				))}
			</ScrollArea>
			<TypingIndicator dmOrChannelId={id} />
			<MessageInput dmOrChannelId={id} />
		</>
	);
}

function TypingIndicator({
	dmOrChannelId,
}: {
	dmOrChannelId: Id<"directMessages" | "channels">;
}) {
	const usernames = useQuery(api.functions.typing.list, {
		dmOrChannelId,
	});
	if (!usernames || usernames.length === 0) return null;
	return (
		<div className="flex items-center px-4 gap-2 py-2">
			<p className="text-xs text-muted-foreground">
				{usernames.join(", ")} is typing...
			</p>
		</div>
	);
}

type Message = FunctionReturnType<typeof api.functions.message.list>[number];

function MessageItem({ message }: { message: Message }) {
	return (
		<div className="flex items-center px-4 gap-2 py-2">
			<Avatar className="size-8 border">
				{message.sender && <AvatarImage src={message.sender.image} />}
				<AvatarFallback />
			</Avatar>
			<div className="flex flex-col mr-auto">
				<p className="text-xs text-muted-foreground">
					{message.sender?.username ?? "Deleted User"}
				</p>
				<p className="text-sm">{message.content}</p>
				{message.attachment && (
					<Image
						src={message.attachment}
						alt="Attachment"
						width={300}
						height={300}
						className="rounded border overflow-hidden"
					/>
				)}
			</div>
			<MessageActions message={message} />
		</div>
	);
}

function MessageActions({ message }: { message: Message }) {
	const user = useQuery(api.functions.user.get);
	const removeMutation = useMutation(api.functions.message.remove);
	if (!user || !message.sender || user._id !== message.sender._id) {
		return null;
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<MoreVerticalIcon className="size-4 text-muted-foreground" />
				<span className="sr-only">Message Actions</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					className="text-destructive"
					onClick={() => removeMutation({ id: message._id })}
				>
					<TrashIcon />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function MessageInput({
	dmOrChannelId,
}: {
	dmOrChannelId: Id<"directMessages" | "channels">;
}) {
	const [content, setContent] = useState("");
	const sendMessage = useMutation(api.functions.message.create);
	const sendTypingIndicator = useMutation(api.functions.typing.upsert);

	const imageUpload = useImageUpload();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await sendMessage({
				content,
				attachment: imageUpload.storageId,
				dmOrChannelId,
			});
			setContent("");
			imageUpload.reset();
		} catch (error) {
			toast.error("Failed to send message", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		}
	};
	return (
		<>
			<form className="flex items-end gap-2 p-4" onSubmit={handleSubmit}>
				<Button type="button" size="icon" onClick={() => imageUpload.open()}>
					<PlusIcon className="size-4" />
					<span className="sr-only">Attach</span>
				</Button>
				<div className="flex flex-col flex-1 gap-2">
					{imageUpload.previewUrl && (
						<ImagePreview
							url={imageUpload.previewUrl}
							isUploading={imageUpload.isUploading}
						/>
					)}
					<Input
						placeholder="Message"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						onKeyDown={() => {
							if (content.length > 0) {
								sendTypingIndicator({ dmOrChannelId });
							}
						}}
					/>
				</div>

				<Button size="icon">
					<SendIcon className="size-4" />
				</Button>
			</form>

			<input {...imageUpload.inputProps} />
		</>
	);
}

function ImagePreview({
	url,
	isUploading,
}: {
	url: string;
	isUploading: boolean;
}) {
	return (
		<div className="relative size-40 overflow-hidden rounded border ">
			<Image src={url} alt="Attachment" width={300} height={300} />
			{isUploading && (
				<div className="absolute inset-0 flex items-center justify-center bg-background/50">
					<Loader2Icon className="size-8 animate-spin" />
				</div>
			)}
		</div>
	);
}
