"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function NewDirectMessage() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<SidebarGroupAction>
					<PlusIcon />
					<span className="sr-only">New DM</span>
				</SidebarGroupAction>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New DM</DialogTitle>
					<DialogDescription>
						Enter a username to start a new direct message
					</DialogDescription>
				</DialogHeader>
				<form className="contents">
					<div className="flex flex-col gap-1">
						<Label htmlFor="username">Username</Label>
						<Input id="username" type="text" />
					</div>
					<DialogFooter>
						<Button>Send DM</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
