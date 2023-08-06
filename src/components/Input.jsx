import React from "react";
import useWebSocket from "react-use-websocket";
import { MdAttachFile } from "react-icons/md";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdSend } from "react-icons/md";

const WS_URL = "ws://127.0.0.1:8181";

const Input = () => {
  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
  });
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something ..."
        className="input1"
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

        <MdSend size={25} cursor={"pointer"} color="gray" />
        {/* <button className="btn">Send</button> */}
      </div>
    </div>
  );
};

export default Input;
