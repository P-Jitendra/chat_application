import React from "react";
import { FaVideo } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
import Messages from "./Messages";
import Input from "./Input";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>John</span>
        <div className="chatIcons">
          <FaVideo size={20}/>
          <MdPersonAddAlt1 size={20}/>
          <MdMoreHoriz size={20}/>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  );
};

export default Chat;
