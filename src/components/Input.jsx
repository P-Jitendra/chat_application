import React, { useState } from "react";
import { MdAttachFile } from "react-icons/md";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdSend } from "react-icons/md";

const Input = (props) => {
  // useWebSocket(WS_URL, {
  //   onOpen: () => {
  //     console.log("WebSocket connection established.");
  //   },
  // });
  const selectedChatInfo = props.selectedChatInfo;
  console.log(
    `#InputComponent: Selected ChatInfo : ${JSON.stringify(selectedChatInfo)}`
  );
  const userInfo = props.userInfo;
  const sendMessage = props.sendMessage;
  const [msg, setMsg] = useState("");
  // const sendMessage = props.sendMessage;
  const handleChange = (e) => {
    setMsg(e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    console.log(`Received chat msg : ${msg}`);
    sendMessage(
      JSON.stringify({
        type: "send_msg",
        msg_data: {
          sender: userInfo.mobileno,
          receiver: selectedChatInfo.chatId,
          msgInfo: msg,
        },
      })
    );
    setMsg("");
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something ..."
        className="input1"
        value={msg}
        onChange={(e) => handleChange(e)}
      ></input>

      <div className="send">
        <label htmlFor="doc">
          <input type="file" style={{ display: "none" }} id="doc"></input>
          <MdAttachFile size={20} cursor={"pointer"} color="gray" />
        </label>

        <label>
          <input type="file" style={{ display: "none" }}></input>
          <MdOutlineAddPhotoAlternate
            size={22}
            cursor={"pointer"}
            color="gray"
          />
        </label>

        {/* <div disabled={!msg}> */}
        <MdSend
          size={25}
          cursor={msg ? "pointer" : "none"}
          color={msg ? "gray" : "silver"}
          onClick={(e) => submit(e)}
        />
        {/* </div> */}

        {/* <button className="btn">Send</button> */}
      </div>
    </div>
  );
};

export default Input;
