import React from "react";
import { MdRemoveCircleOutline } from "react-icons/md";
import axios from "axios";

const Chats = (props) => {
  const userInfo = props.userInfo;
  const setSelectedChat = props.setSelectedChat;
  const setSelectedChatInfo = props.setSelectedChatInfo;
  const selectedChatInfo = props.selectedChatInfo;
  const setChats = props.setChats;
  const fetchContactsData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/allContacts/${userInfo.mobileno}`
      );
      if (response.data.status === "success") {
        console.log(
          `Got success response : ${JSON.stringify(
            response.data.user_contacts
          )}`
        );
        setChats(response.data.user_contacts);
      } else {
        console.log(
          `Received incorrect data : ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      console.log(
        `Received error while fetching data : ${JSON.stringify(error)}`
      );
    }
  };
  const deleteContact = (contactNo) => {
    console.log(`Printing contactNo: ${JSON.stringify(contactNo)}`);
    console.log(
      `#deleteContact: Printing UserInfo: ${JSON.stringify(userInfo)}`
    );
    axios
      .post("http://localhost:4000/deleteContact/", {
        mobileno: userInfo.mobileno,
        contactno: contactNo,
      })
      .then((response) => {
        if (response.data.status === "success") {
          console.log(
            `Received success message : ${JSON.stringify(response.data)}`
          );
          fetchContactsData();
          if (selectedChatInfo.chatId === contactNo) {
            setSelectedChat(false);
          }
        }
      })
      .catch((err) => {
        console.log(
          `Received error while deleting contact : ${JSON.stringify(err)}`
        );
      });
  };
  // const setSentMsgs = props.setSentMsgs;
  // const setReceivedMsgs = props.setReceivedMsgs;
  // const lastJsonMessage = props.lastJsonMessage;

  // const userChat = [
  //   { id: 1, user_name: "John", last_message: "Hello" },
  //   { id: 2, user_name: "Surya", last_message: "Hello" },
  //   { id: 3, user_name: "Mike", last_message: "Hello" },
  //   { id: 4, user_name: "Sai", last_message: "hello" },
  // ];
  const userChat = props.chats;
  // const messagesList = [1, 2, 3, 4, 5, 6];
  //   <Message className="message" />,
  //   <Message className="message owner" />,
  //   <Message className="message" />,
  //   <Message className="message owner" />,
  //   <Message className="message" />,
  //   <Message className="message owner" />,
  // ];
  return (
    <div className="chats">
      {userChat.map((userChat, index) => {
        return (
          <div
            style={{ display: "flex", border: "1px solid rgb(17, 162, 68)" }}
            key={index}
          >
            <div
              className="userChat"
              onClick={() => {
                setSelectedChat(true);
                setSelectedChatInfo({
                  chatId: userChat.contactno,
                  chatName: userChat.clientname,
                });
                // updateMsgsList(lastJsonMessage);
                // index % 2 === 0 ? setMessages([]) : setMessages(messagesList);
              }}
            >
              <img
                src="https://randomuser.me/api/portraits/lego/5.jpg"
                alt=""
                className="image"
              />
              <div className="userChatInfo">
                <span className="span_custom">{userChat.clientname}</span>
                <p className="pg">Hello</p>
              </div>
            </div>
            <MdRemoveCircleOutline
              size={32}
              style={{
                position: "absolute",
                right: "7",
                marginTop: "15",
                cursor: "pointer",
              }}
              onClick={() => deleteContact(userChat.contactno)}
            />
          </div>
        );
      })}
      {/* <div
        className="userChat"
        onClick={() => {
          setSelectedChat(true);
        }}
      >
        <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        />
        <div className="userChatInfo">
          <span className="span_custom">John</span>
          <p className="pg">Hello</p>
        </div>
      </div>
      <div
        className="userChat"
      >
        <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        />
        <div className="userChatInfo">
          <span className="span_custom">Surya</span>
          <p className="pg">Hello</p>
        </div>
      </div>
      <div className="userChat">
        <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        />
        <div className="userChatInfo">
          <span className="span_custom">Mike</span>
          <p className="pg">Hello</p>
        </div>
      </div>
      <div className="userChat">
        <img
          src="https://randomuser.me/api/portraits/lego/5.jpg"
          alt=""
          className="image"
        />
        <div className="userChatInfo">
          <span className="span_custom">Sai</span>
          <p className="pg">Hello</p>
        </div>
      </div> */}
    </div>
  );
};

export default Chats;
