export type IMessage = {
    messageId: string;
    chatId: string;
    prompt: string;
    response: string;
    createdAt: string
}

export type IChatHistoryResponse = {
    success: boolean;
    chatHistory: IMessage[];
}

export type IChatQueryResponse = {
    success: boolean;
    response: string;
}