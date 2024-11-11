import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddFriend() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm">Add Friend</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Friend</DialogTitle>
					<DialogDescription>
						You can add a friend by username
					</DialogDescription>
				</DialogHeader>
				<form className="contents">
					<div className="flex flex-col gap-1">
						<Label htmlFor="username">Username</Label>
						<Input id="username" type="text" />
					</div>
					<DialogFooter>
						<Button>Send Friend Request</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
