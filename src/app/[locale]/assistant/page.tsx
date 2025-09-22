import ChatFullPage from "@/components/chat-full-page";
import DashboardAuthWrapper from "@/components/dashboard-auth-wrapper";

export default function AssistantPage() {
  return (
    <DashboardAuthWrapper>
      <ChatFullPage />
    </DashboardAuthWrapper>
  );
}
