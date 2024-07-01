import React from "react";
import { FaVideo } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
import Messages from "./Messages";
import Input from "./Input";
import { ReadyState } from "react-use-websocket";
import { v4 as uuidv4 } from "uuid";

const Chat = (props) => {
  const userInfo = props.userInfo;
  const selectedChat = props.selectedChat;
  const selectedChatInfo = props.selectedChatInfo;
  return (
    <div className="chat">
      <div className="chatInfo">
        {selectedChat
          ? [
              <span key={uuidv4()}>{selectedChatInfo.chatName}</span>,
              <div className="chatIcons" key={uuidv4()}>
                <FaVideo size={20} />
                <MdPersonAddAlt1 size={20} />
                <MdMoreHoriz size={20} />
              </div>,
            ]
          : null}
      </div>
      {props.readyState === ReadyState.OPEN ? (
        selectedChat ? (
          [
            <Messages
              userInfo={userInfo}
              sentMsgs={props.sentMsgs}
              receivedMsgs={props.receivedMsgs}
              setSentMsgs={props.setSentMsgs}
              setReceivedMsgs={props.setReceivedMsgs}
              selectedChat={selectedChat}
              selectedChatInfo={selectedChatInfo}
              setSelectedChat={props.setSelectedChat}
              readyState={props.readyState}
              key={uuidv4()}
            />,
            <Input
              userInfo={userInfo}
              selectedChatInfo={selectedChatInfo}
              sendMessage={props.sendMessage}
              key={uuidv4()}
            />,
          ]
        ) : (
          <div className="chatDashboard">
            {/* <img src={backgroundImage} ></img> */}
          </div>
        )
      ) : (
        <div className="chatDashboard">
          <p>WebSocket Status : 'Disconnected'</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
