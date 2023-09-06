import React from "react";

const Message = ({ className, msgContent, timestamp }) => {
  return (
    <div className={className}>
      <div className="messageInfo">
        <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        />
        <span>{timestamp}</span>
      </div>
      <div className="messageContent">
        {console.log(`Printing msg content : ${msgContent}`)}
        <p className="p">{msgContent}</p>
        {/* <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        /> */}
      </div>
    </div>
  );
};

export default Message;
