import React, { useEffect, useRef, useState } from "react";
import { fetchLoggedInUser, getChatMessage, sendMessage } from "../../helpers/services";
import io from "socket.io-client"
import { SOCKET_IO_ENDPOINT } from "../../config/config";

var socket
const ChatBox = ({ chatId }) => {
    const [messages, setMessages] = useState([])
    const user = fetchLoggedInUser()
    const contentRef = useRef()
    const messagesEndRef = useRef()

    const sendMessageHandle = (e) => {
        e.preventDefault()
        const content = contentRef.current.value
        console.log({ content })
        if (content) {
            sendMessage(content, chatId)
                .then(res => {
                    setMessages(m => [...m, res])
                    contentRef.current.value = ""
                    socket.emit("new message", res)
                })
                .catch(console.error)
        }
    }

    useEffect(() => {
        function onConnect() {
            console.log("connected" );
        }

        socket = io(SOCKET_IO_ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", onConnect);

        return () => {
            socket.off("connected", onConnect)
        }
    }, [])


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])


    useEffect(() => {
        if (chatId) {
            getChatMessage(chatId)
                .then(mes => {
                    socket.emit("join chat", chatId)
                    setMessages(mes)
                })
                .catch(alert)
        }

        function onMessageReceived(message) {
            console.log("message received", message.chat._id, chatId, message);
            if (message.chat._id !== chatId) {
                //notification
            } else {
                setMessages(m => ([...m, message]))
            }
        }
        socket.on("message received", onMessageReceived);
        return () => {
            socket.off("message received", onMessageReceived)
        }
    }, [chatId])



    return (
        <div style={{ border: "2 solid", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ overflowY: "auto" }}>

                {
                    messages.map(mess => {
                        return <div key={mess._id} className={`message ${user._id === mess.sender._id ? "right" : "left"}`}>
                            <p><strong>{mess.sender.email} saying</strong></p>
                            <p>{mess.content}</p>
                        </div>
                    })
                }
                <div style={{ clear: "both" }} ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessageHandle} style={{ margin: 20, marginTop: "auto", border: "2px groove", borderRadius: 15, padding: 15, display: "flex" }}>
                <input ref={contentRef} type="text" style={{ flex: 1 }} autoFocus />
                <input type="submit" />
            </form>
        </div>
    )

}

export default ChatBox;