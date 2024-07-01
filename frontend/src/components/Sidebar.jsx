import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Chats from "./Chats";
import axios from "axios";
import { CgClose } from "react-icons/cg";

const Sidebar = (props) => {
  const [contactName, setContactName] = useState("");
  const [show, setShow] = useState(false);
  const [contactNo, setContactNo] = useState("");
  const [chats, setChats] = useState([]);

  // useEffect(() => {
  //   axios.get(`http://localhost:4000/allContacts/${props.userInfo.mobileno}`).
  //   then((response) => {
  //     if (response.data.status === "success") {
  //       const user_contacts = response.data.user_contacts;
  //       console.log(
  //         `Fetched contacts successfully, Contacts : ${JSON.stringify(
  //           user_contacts
  //         )}`
  //       );
  //       setChats(user_contacts);
  //     } else {
  //       console.log(`Printing invalid status data : ${response.data}`);
  //     }
  //   })
  // })

  const fetchContactsData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/allContacts/${props.userInfo.mobileno}`
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

  useEffect(() => {
    fetchContactsData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const userInfo = props.userInfo;
  // const output = useQuery("todos", getContacts(userInfo));
  // console.log(`React Query data output : ${JSON.stringify(output)}`);

  // if (isLoading) return "Loading...";
  // if (isError) return "An error occurred";
  const submit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/createContact/", {
        mobileno: props.userInfo.mobileno,
        clientname: contactName,
        contactno: contactNo,
      })
      .then((response) => {
        if (response.data.status === "success") {
          console.log(
            `Received success message : ${JSON.stringify(response.data.msg)}`
          );
          fetchContactsData();
        } else {
          console.log(
            `Received error message : ${JSON.stringify(response.data)}`
          );
        }
      })
      .catch((error) => {
        console.log(
          `Received error while adding new contact : ${JSON.stringify(error)}`
        );
      });
    setShow(false);
  };
  return (
    <div className="sidebar">
      <Navbar userInfo={props.userInfo} sendMessage={props.sendMessage} />
      <div className="sidebarBody">
        <button className="newContactBtn" onClick={() => setShow(true)}>
          Add New Contact
        </button>
        {show ? (
          <form className="contactForm">
            <header className="contactHeader">
              <CgClose size={30} onClick={() => setShow(false)} />
            </header>

            <div className="contactBody">
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                Create Contact
              </span>
              <div className="contactInput">
                <input
                  type="text"
                  placeholder="Contact Name"
                  className="contactName"
                  onChange={(e) => {
                    setContactName(e.target.value);
                  }}
                />
                <input
                  type="text"
                  placeholder="MobileNo"
                  className="contactName"
                  onChange={(e) => {
                    setContactNo(e.target.value);
                  }}
                />
              </div>
              <br />
              <button className="contactButton" onClick={(e) => submit(e)}>
                Add
              </button>
            </div>
          </form>
        ) : (
          <Chats
            userInfo={props.userInfo}
            updateMsgsList={props.updateMsgsList}
            lastJsonMessage={props.lastJsonMessage}
            setSentMsgs={props.setSentMsgs}
            setReceivedMsgs={props.setReceivedMsgs}
            selectedChat={props.selectedChat}
            setSelectedChat={props.setSelectedChat}
            setSelectedChatInfo={props.setSelectedChatInfo}
            selectedChatInfo={props.selectedChatInfo}
            setChats={setChats}
            chats={chats}
          />
        )}
      </div>
    </div>
  );
};

// const getContacts = async (userInfo) => {
//   const response = await axios.get(
//     `http://localhost:4000/allContacts/${userInfo.mobileno}`
//   );
//   if (response.status !== 200) {
//     console.log(
//       `Received error response for getContacts API, Resp : ${JSON.stringify(
//         response
//       )}`
//     );
//     throw new Error("Network response was not ok");
//   }
//   console.log(`Data received : ${JSON.stringify(response)}`);
//   // if (response.data.status === "success") {
//   //   return response.data;
//   // } else {
//   //   return [];
//   // }
//   return response.data.status;
// };

export default Sidebar;
