"use client";

import {
	Authenticated,
	Unauthenticated,
	useMutation,
	useQuery,
} from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { use } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
export default function JoinPage({
	params,
}: {
	params: Promise<{ id: Id<"invites"> }>;
}) {
	const { id } = use(params);
	const invite = useQuery(api.functions.invite.get, { id });
	const join = useMutation(api.functions.invite.join);
	const router = useRouter();
	const handleJoin = async () => {
		await join({ id });
		router.push(
			`/servers/${invite?.serverId}/channels/${invite?.server.defaultChannelId}`
		);
	};

	return (
		<div className="flex items-center justify-center h-screen w-screen">
			<Card>
				<CardHeader>
					<CardTitle>Join {invite?.server.name}</CardTitle>
					<CardDescription>
						but You are invited to join <strong>{invite?.server.name}</strong>
					</CardDescription>
				</CardHeader>

				<CardFooter className="flex flex-col gap-2">
					<Authenticated>
						<Button onClick={handleJoin}>Join Server</Button>
					</Authenticated>

					<Unauthenticated>
						<Button asChild variant="secondary">
							<SignInButton forceRedirectUrl={`/join/${id}`}>
								Sign in to join
							</SignInButton>
						</Button>
					</Unauthenticated>
					<Button variant="secondary" asChild>
						<Link href="/dms">Not Now</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
