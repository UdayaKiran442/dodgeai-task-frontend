import { IChatHistoryResponse, IChatQueryResponse } from "@/types/types";

export async function fetchChatHistoryAPI(chatId: string): Promise<IChatHistoryResponse> {
    const fetchChatHistory = await fetch("http://localhost:3000/v1/message/fetch-chat-history", {
        method: "POST",
        headers: {
             "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
    }) 
    return await fetchChatHistory.json();
}

export async function sendPromptForQueryAPI(prompt: string): Promise<IChatQueryResponse> {
    const response = await fetch("http://localhost:3000/v1/message/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
    })
    console.log("API Raw Response:", response);
    return await response.json();
}