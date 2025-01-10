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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function CreateInvite({
	serverId,
}: {
	serverId: Id<"servers">;
}) {
	const [inviteId, setInviteId] = useState<Id<"invites"> | null>(null);
	const createInvite = useMutation(api.functions.invite.create);
	const handleSubmit = async (
		maxUses: number | undefined,
		expiresAt: number | undefined
	) => {
		try {
			const invite = await createInvite({ serverId, maxUses, expiresAt });
			setInviteId(invite);
		} catch (error) {
			toast.error("Failed to create invite", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		}
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Create Invite
				</Button>
			</DialogTrigger>
			{inviteId ? (
				<CreateInviteDialog
					inviteId={inviteId}
					onClose={() => setInviteId(null)}
				/>
			) : (
				<CreateInviteForm onSubmit={handleSubmit} />
			)}
		</Dialog>
	);
}

const EXPIRES_AT_OPTIONS = [
	{ label: "Never", value: 0 },
	{ label: "1 hour", value: 1 },
	{ label: "6 hours", value: 6 },
	{ label: "12 hours", value: 12 },
	{ label: "1 day", value: 24 },
	{ label: "1 week", value: 168 },
	{ label: "1 month", value: 720 },
];

const MAX_USES_OPTIONS = [
	{ label: "Unlimited", value: 0 },
	{ label: "1", value: 1 },
	{ label: "5", value: 5 },
	{ label: "10", value: 10 },
	{ label: "25", value: 25 },
	{ label: "50", value: 50 },
	{ label: "100", value: 100 },
];

function CreateInviteForm({
	onSubmit,
}: {
	onSubmit: (
		maxUses: number | undefined,
		expiresAt: number | undefined
	) => void;
}) {
	const [maxUses, setMaxUses] = useState("");
	const [expiresAt, setExpiresAt] = useState("");

	const parseNumber = (str: string) => {
		const number = parseInt(str);
		if (!number) return undefined;
		return number;
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const parsedMaxUses = parseNumber(maxUses);
		const parsedExpiresAt = parseNumber(expiresAt);
		if (parsedMaxUses === undefined || parsedExpiresAt === undefined) {
			toast.error("Invalid input");
			return;
		}
		onSubmit(
			parsedMaxUses,
			parsedExpiresAt
				? Date.now() + parsedExpiresAt * 60 * 60 * 1000
				: undefined
		);
	};
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Create Invite</DialogTitle>
			</DialogHeader>
			<form className="contents" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-2">
					<Label htmlFor="expiresAt">Expires At</Label>
					<Select value={expiresAt} onValueChange={setExpiresAt}>
						<SelectTrigger>
							<SelectValue placeholder="Select expiration" />
						</SelectTrigger>
						<SelectContent>
							{EXPIRES_AT_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value.toString()}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="maxUses">Max Uses</Label>
					<Select value={maxUses} onValueChange={setMaxUses}>
						<SelectTrigger>
							<SelectValue placeholder="Select max uses" />
						</SelectTrigger>
						<SelectContent>
							{MAX_USES_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value.toString()}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DialogFooter>
					<Button type="submit">Create Invite</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}

function CreateInviteDialog({
	inviteId,
	onClose,
}: {
	inviteId: Id<"invites">;
	onClose: () => void;
}) {
	const url = new URL(`/join/${inviteId}`, window.location.href).toString();
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Invite Created</DialogTitle>
				<DialogDescription>
					You can now share this link with your friends:
				</DialogDescription>
			</DialogHeader>
			<div className="flex flex-col gap-2">
				<Label htmlFor="url">Invite URL</Label>
				<Input id="url" type="text" value={url} readOnly />
			</div>
			<DialogFooter>
				<Button variant="secondary" onClick={onClose}>
					Back
				</Button>
				<Button
					onClick={() => {
						navigator.clipboard.writeText(url);
						toast.success("Copied URL to clipboard");
					}}
				>
					Copy
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
