import React, { useEffect } from 'react'
import axios from 'axios'

const ChatPage = () => {
    const fechChats = async () => {
        const data = await axios.get("api/chat");
        console.log(data);
    }

    useEffect(() => {
        fechChats();
    }, [])

  return (
    <div>ChatPage</div>
  )
}

export default ChatPage