import { ChatContainer } from "@/components/ChatContainer";
import AuthGuard from "@/components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-white">
        <ChatContainer />
      </main>
    </AuthGuard>
  );
}
