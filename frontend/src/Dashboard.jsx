import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import useWebSocket from "react-use-websocket";
// import axios from "axios";
import "./App.css";

const WS_URL = "ws://localhost:8181/ws";
const Dashboard = (props) => {
  const userInfo = props.userInfo;
  const [sentMsgs, setSentMsgs] = useState([]);
  const [receivedMsgs, setReceivedMsgs] = useState([]);
  const [selectedChat, setSelectedChat] = useState(false);
  const [selectedChatInfo, setSelectedChatInfo] = useState({
    chatId: "",
    chatName: "",
  });
  const { readyState, sendMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("Websocket connected");
      sendMessage(
        JSON.stringify({
          type: "connect",
          connectionInfo: {
            clientId: userInfo.mobileno,
            clientName: userInfo.username,
          },
        })
      );
    },
    onMessage: (e) => {
      console.log(`Websocket message received : ${JSON.stringify(JSON.parse(e.data))}`);
      updateMsgsList(JSON.parse(e.data));
    }
  });
  // const [chats, setChats] = useState([]);
  // console.log(`Websocket last message: ${JSON.stringify(lastMessage)}`);
  console.log(
    `Websocket last Json message: ${JSON.stringify(lastJsonMessage)}`
  );
  const msg_list = lastJsonMessage ? lastJsonMessage.msg_list : null;
  console.log(
    `Websocket last Json message without stringify: ${JSON.stringify(msg_list)}`
  );
  const updateMsgsList = (lastJsonMessage) => {
    if (lastJsonMessage) {
      const { msg_list } = lastJsonMessage;
      const { sent_msgs, received_msgs } = msg_list;
      setReceivedMsgs(received_msgs);
      setSentMsgs(sent_msgs);
    }
  };

  // useEffect(() => {
  //   updateMsgsList(lastJsonMessage);
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="dashboard">
      <div className="container">
        <Sidebar
          userInfo={userInfo}
          lastJsonMessage={lastJsonMessage}
          setSentMsgs={setSentMsgs}
          setReceivedMsgs={setReceivedMsgs}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          sendMessage={sendMessage}
          selectedChatInfo={selectedChatInfo}
          setSelectedChatInfo={setSelectedChatInfo}
        />
        <Chat
          userInfo={userInfo}
          sentMsgs={sentMsgs}
          receivedMsgs={receivedMsgs}
          setSentMsgs={setSentMsgs}
          setReceivedMsgs={setReceivedMsgs}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          readyState={readyState}
          sendMessage={sendMessage}
          selectedChatInfo={selectedChatInfo}
        />
      </div>
    </div>
  );
};

export default Dashboard;
