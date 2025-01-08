import { SidebarProvider } from "@/components/ui/sidebar";
import { DMSidebar } from "./_components/sidebar";

export default function DmLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<DMSidebar />
			{children}
		</SidebarProvider>
	);
}
