import { BASE_URL } from "../config/config"

export function fetchLoggedInUser() {
    return JSON.parse(localStorage.getItem("userInfo"))
}

export async function loginService(email, password) {
    const body = JSON.stringify({
        email, password 
    })
    const res = await fetch(BASE_URL + "/api/user/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body
    })
    const data = await res.json()
    if (res.status === 200) {
        return data
    } else {
        throw data.message
    }
}

export async function logoutService(){
    localStorage.removeItem("userInfo")
}

export async function registerService(name, profile, email, password) {
    const body = JSON.stringify({
        name, email, password, profile
    })
    const res = await fetch(BASE_URL + "/api/user/register", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body
    })
    const data = await res.json()
    if (res.status === 201) {
        return data
    } else {
        throw data.message
    }
}

export async function uploadImage(blob) {
    if (blob.type == "image/png" || blob.type === "image/jpeg" || blob.type === "image/svg+xml") {
        const data = new FormData();
        data.append("file", blob);
        data.append("upload_preset", "chit-chat");
        data.append("cloud_name", "codeplanate");
        return fetch("https://api.cloudinary.com/v1_1/codeplanate/image/upload", {
            method: "POST",
            body: data
        }).then(res => res.json())
    } else {
        throw new Error(`File format ${blob.type} not supported.`)
    }
}

export async function fetchUserChats() {
    const user = fetchLoggedInUser()
    return fetch(BASE_URL + "/api/chat/", {
        headers: {
            'Authorization': "Bearer " + user.token,
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error(res.statusText)
            }
        })
        .catch(e => {
            throw new Error(e.message)
        })
}

export async function getChatMessage(chatId) {
    const user = fetchLoggedInUser()

    return fetch(BASE_URL + "/api/message/" + chatId, {
        headers: {
            'Authorization': "Bearer " + user.token,
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error(res.statusText)
            }
        })
        .catch(e => {
            throw new Error(e.message)
        })
}

export async function sendMessage(content, chatId) {
    const user = fetchLoggedInUser()

    return fetch(BASE_URL + "/api/message/", {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + user.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, chatId })
    })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error(res.statusText)
            }
        })
        .catch(e => {
            throw new Error(e.message)
        })
}