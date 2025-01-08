"use client";
import { useMutation, useQuery } from "convex/react";
import { use, useRef, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Loader2Icon,
	MoreVerticalIcon,
	PlusIcon,
	SendIcon,
	TrashIcon,
} from "lucide-react";
import { FunctionReturnType } from "convex/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Image from "next/image";
import { Messages } from "@/components/messages";

export default function MessagePage({
	params,
}: {
	params: Promise<{ id: Id<"directMessages"> }>;
}) {
	const { id } = use(params);
	const directMessage = useQuery(api.functions.dm.get, { id });

	if (!directMessage) {
		return null;
	}
	return (
		<div className="flex flex-1 flex-col divide-y max-h-screen">
			<header className="flex items-center gap-2 p-4">
				<Avatar className="size-8 border">
					<AvatarImage src={directMessage.user.image} />
					<AvatarFallback />
				</Avatar>
				<h1 className="font-semibold">{directMessage.user.username}</h1>
			</header>
			<Messages id={id} />
		</div>
	);
}
