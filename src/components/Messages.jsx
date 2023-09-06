import React, { useRef, useEffect } from "react";
import Message from "./Message";

const Messages = (props) => {
  const myElementRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, []);
  const scrollToBottom = () => {
    if (myElementRef.current) {
      myElementRef.current.scrollTop = myElementRef.current.scrollHeight;
    }
  };

  const sentMsgs = props.sentMsgs;
  const receivedMsgs = props.receivedMsgs;
  const selectedChatInfo = props.selectedChatInfo;
  const newSentMsgs = sentMsgs.map((obj) => ({ ...obj, type: "sender" }));
  const newReceivedMsgs = receivedMsgs.map((obj) => ({
    ...obj,
    type: "receiver",
  }));
  const finalMsgsList = newSentMsgs.concat(newReceivedMsgs);
  const segregatedMsgs = finalMsgsList.filter(
    (msgObj) => msgObj.userId === selectedChatInfo.chatId
  );
  const sortedMsgsList = segregatedMsgs.sort((a, b) =>
    a.timestamp.toLowerCase() < b.timestamp.toLowerCase() ? -1 : 1
  );
  console.log(`Sorted Messages List : ${JSON.stringify(sortedMsgsList)}`);

  return (
    <div className="messages" ref={myElementRef}>
      {sortedMsgsList.map((message, index) => {
        const { msg } = message;
        return message.type === "sender" ? (
          <Message
            className="message owner"
            msgContent={msg}
            timestamp={msg.timestamp}
            key={index}
          />
        ) : (
          <Message
            className="message"
            msgContent={msg}
            timestamp={msg.timestamp}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default Messages;
