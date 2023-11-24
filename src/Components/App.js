import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Apps = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [sms, setSms] = useState("");
  const [chats, setChats] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [dots, setDots] = useState("...");
  const input = useRef(null);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_BACKEND;
  var interval = null;
  const getChats = () => {
    axios({
      method: "GET",
      url: `${apiUrl}api/chat/get`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        await setChats(res.data);
        console.log(res.data);
        var correct = false;
        res.data.forEach((element, index) => {
          if (element._id === id) {
            correct = true;
            setRoomName(element.name);
            setMessages(element.messages);
            setIndex(index);
          }
        });
        if (id === undefined) {
          navigate(`/${res.data[0]._id}`);
          setRoomName(res.data[0].name);
          setMessages(res.data[0].messages);
          setIndex(0);
          return;
        }
        if (!correct) {
          alert("wrong chat link");
        }
      })
      .catch((e) => {
        console.log(e);
        console.log(e.response);
        if (e?.response?.status === 400 || e?.response?.status === 404) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert("Server error");
        }
      });
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    socket.emit("join-room", id);
  }, [id]);

  socket.on("message", (message, id, typing) => {
    var newMessage = [...messages];
    newMessage.push(message);
    setTyping(typing);
    setMessages(newMessage);
  });
  const sendMessage = (e) => {
    if (typing || sms.length === 0) {
      input.current.focus();
      return;
    }
    e.preventDefault();
    console.log(id);
    socket.emit("send", sms, id);
    setSms("");
    input.current.focus();
  };

  const createChat = async () => {
    axios({
      method: "post",
      url: `${apiUrl}api/chat/add/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        number: chats.length + 1,
      },
    })
      .then((res) => {
        console.log(res.data);
        var newChats = chats;
        newChats.push(res.data);
        setChats(newChats);
        changeChat(res.data, newChats.length - 1);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const navigate = useNavigate();

  const Logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
  };

  const changeChat = (newChat, newIndex) => {
    var newChats = [...chats];
    console.log(newChats[index]);
    newChats[index].messages = messages ?? [];
    console.log(newChats, "newChats");
    setIndex(newIndex);
    setChats(newChats);
    setRoomName(newChat.name);
    setMessages(newChat.messages);
    navigate(`/${newChat._id}`);
    socket.emit("join-room", id);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile"></i> ChatCord
        </h1>
        <button onClick={Logout} className="btn">
          Leave Chat
        </button>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>Chat Name:</h3>
          <h2 id="room-name">{roomName}</h2>
          <div className="chat-creator" onClick={createChat}>
            <h3>
              <i className="fas fa-comments"></i> Chats
            </h3>
            <h3>
              <i className="fas fa-plus"></i>
            </h3>
          </div>
          <ul id="chats">
            {chats.map((item, index) => {
              return (
                <li
                  className="chat"
                  key={index}
                  onClick={() => changeChat(item, index)}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="chat-messages">
          {messages.map((item, index) => {
            return (
              <div className="message" key={index}>
                <p className="meta">{index % 2 ? "ChatCord" : "Me"}</p>
                <p className="text">{item}</p>
              </div>
            );
          })}
          {typing ? <h6 className="typing">typing{dots}</h6> : null}
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={sendMessage}>
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            ref={input}
            value={sms}
            onChange={(e) => {
              setSms(e.target.value);
            }}
            autoComplete="off"
          />
          <button className="btn" onClick={sendMessage}>
            <i className="fas fa-paper-plane"></i>{" "}
            <span className="btn-txt">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apps;
