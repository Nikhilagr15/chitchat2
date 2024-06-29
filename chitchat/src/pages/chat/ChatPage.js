import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchUserChats } from "../../helpers/services";
import ChatSideBar from "./ChatSideBar";
import ChatBox from "./ChatsBox";

const ChatPage = () => {
    const [selectedChatId, setSelectedChatId] = useState(null)

    const handleChatOpen = useCallback((chat) => {
        setSelectedChatId(chat._id)
    }, [])

    
    return (
        <div>
            {/* <h3>Chat page</h3> */}
            <div style={{ display: "flex", flexDirection: "row", height: "90vh" }}>
                <div className="chat-sidebar" style={{ flex: 1, margin: 5 }}>
                    <ChatSideBar handleChatOpen={handleChatOpen} selectedChat={selectedChatId} />
                </div>

                <div style={{ flex: 3, border: "2px solid", borderRadius: 15, margin: 5 }}>
                    <ChatBox chatId={selectedChatId} />
                </div>

            </div>

        </div>
    )
}

export default ChatPage;