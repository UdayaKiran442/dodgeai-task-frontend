"use client";

import { IChatHistoryResponse, IMessage } from "@/types/types";
import { useState } from "react";
// import { fetchChatHistoryAPI, sendPromptForQueryAPI } from "@/actions/messages.actions";

export function Chatbot({ messages, chatId }: { messages: IChatHistoryResponse['chatHistory']; chatId: string }) {
    const [chatMessages, setChatMessages] = useState(messages);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    function handlePromptChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPrompt(e.target.value);
    }

   async function handleSubmit() {
    const tempMessage: IMessage = {
        chatId: chatId,
        messageId: "",
        response: "",
        createdAt: new Date().toISOString(),
        prompt: prompt,
    };

    setLoading(true);
    setChatMessages((prev) => [...prev, tempMessage]);
    setPrompt("");

    try {
        const response = await fetch("http://localhost:3000/v1/message/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            setChatMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage) {
                    lastMessage.response = data.response;
                }
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Error during fetch:", error);
    } finally {
        setLoading(false);
    }
}

    return (
         <div className="min-h-screen w-full bg-gray-50">
            {/* Main Content Area (Graph Visualization) */}
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-400">Graph Visualization Area</p>
            </div>

            {/* Chatbot Container */}
            <div className="fixed right-6 bottom-6 z-50 w-80">
                <div className="bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-black p-3">
                        <h4 className="text-white font-medium text-sm">Dodge AI Chatbot</h4>
                    </div>
                    
                    {/* Chat Body */}
                    <div className="h-64 p-4 overflow-scroll">
                        {chatMessages.length === 0 ? (
                            <p className="text-gray-400 text-center mt-20">No messages yet. Start the conversation!</p>
                        ) : (
                            chatMessages.map((msg) => (
                                <div key={msg.messageId} className="mb-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">User:</p>
                                    <p className="bg-gray-100 p-2 rounded-md mb-2">{msg.prompt}</p>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Dodge AI:</p>
                                    {(msg.response === "" && loading === true) ? (
                                        <p className="bg-blue-100 p-2 rounded-md">Loading...</p>
                                    ) : (
                                        <p className="bg-blue-100 p-2 rounded-md">{msg.response}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    {/* Input Area */}
                    <div className="p-3 border-t border-slate-200 flex">
                        <input
                            value={prompt}
                            onChange={handlePromptChange}
                            type="text"
                            placeholder="Type your message..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button disabled={loading} onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}