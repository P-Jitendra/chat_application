import React from "react";

const Message = ({ className }) => {
  return (
    <div className={ className }>
      <div className="messageInfo">
        <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p className="p">hello</p>
        <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        />
      </div>
    </div>
  );
};

export default Message;
