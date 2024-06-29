import React, { memo, useEffect, useState } from "react";
import { fetchLoggedInUser, fetchUserChats } from "../../helpers/services";
import { receiver } from "../../helpers/helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ChatSideBar = ({ handleChatOpen, selectedChat }) => {
    const history = useHistory()
    const [allChats, setAllChats] = useState([])
    const [loggedinUser, setLoggedinUser] = useState({})

    useEffect(() => {
        setLoggedinUser(fetchLoggedInUser())
        fetchUserChats()
            .then(res => {
                if (res.length) {
                    setAllChats(res);
                    handleChatOpen(res[0]);
                }
            })
            .catch(e => {
                // history.replace("/")
                console.log("fetchUserChats error: ", e)
            })
    }, [])
    console.log("chat sidebar")
    return (
        <div>
            <ul>
                {allChats.map((chat, index) => {
                    return <li key={chat._id} className={`chat ${selectedChat === chat._id && "selected"}`}>
                        <a href="" onClick={(e) => { e.preventDefault(); handleChatOpen(chat) }}>{chat.isGroupChat ? chat.chatName : receiver(chat.users, loggedinUser)?.name}</a>
                    </li>
                })}
            </ul>
        </div>
    )
}

export default memo(ChatSideBar);