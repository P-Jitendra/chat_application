import React from "react";
import { MdAttachFile } from "react-icons/md";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdSend } from "react-icons/md";

const Input = () => {
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something ..."
        className="input1"
      ></input>

      <div className="send">
        <MdAttachFile size={20} cursor={"pointer"} color="gray" />
        <input type="file" style={{ display: "none" }} id="file" />
        <label htmlFor="file">
          <MdOutlineAddPhotoAlternate
            size={22}
            cursor={"pointer"}
            color="gray"
          />
        </label>
        <MdSend size={25} cursor={"pointer"} color="gray"/>
        {/* <button className="btn">Send</button> */}
      </div>
    </div>
  );
};

export default Input;
