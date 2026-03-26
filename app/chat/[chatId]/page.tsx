import { fetchChatHistoryAPI } from "@/actions/messages.actions";
import { Chatbot } from "@/component/Chatbot";

export default async function ChatPage({ params }: { params: { chatId: string } }) {
    const { chatId } = await params;
    const messages = await fetchChatHistoryAPI(chatId);

    return (
       <div>
        <Chatbot chatId={chatId} messages={messages.chatHistory} />
       </div>
    );
}