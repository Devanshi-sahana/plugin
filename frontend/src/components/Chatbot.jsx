import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Chatbot.module.css";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MinimizeIcon from "@mui/icons-material/Minimize";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import OneWayTrip from "./OneWayTrip";
import RoundTrip from "./RoundTrip";
import { ChatbotText } from "../helpers/enums";

const Chatbot = () => {
  const [ws, setWs] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(true);
  const [chatOpenTime, setChatOpenTime] = useState(null);
  const [initialMessageDisplayed, setInitialMessageDisplayed] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [showGreeting, setShowGreeting] = useState(true);
  const [showSubGreeting, setShowSubGreeting] = useState(false);
  const [isButtonInvisible, setIsButtonInvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const originalTitle = useRef(document.title);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);

    // Toggle visibility only if the chat is not open or is minimized
    if (!isChatOpen) {
      setIsButtonInvisible(!isButtonInvisible);
    } else {
      setIsButtonInvisible(false); // Ensure button is visible in fullscreen mode
    }

    console.log("After toggle:", !isFullScreen);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBotTyping(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isBotTyping && !initialMessageDisplayed) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          botMessage: "Hello! How can I assist you today?",
          timestamp: new Date(),
        },
      ]);
      setInitialMessageDisplayed(true);
    }
  }, [isBotTyping, initialMessageDisplayed]);

  useEffect(() => {
    if (!isChatOpen && newMessagesCount > 0) {
      document.title = `(${newMessagesCount}) New messages`;
    } else {
      document.title = originalTitle.current;
    }
  }, [newMessagesCount, isChatOpen]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  useEffect(() => {
    console.log("Component mounted");
    setShowGreeting(true);

    const greetingTimeout = setTimeout(() => {
      console.log("Showing sub-greeting");
      setShowGreeting(false);
      setShowSubGreeting(true);
    }, 5000);

    const subGreetingTimeout = setTimeout(() => {
      console.log("Hiding sub-greeting");
      setShowSubGreeting(false);
    }, 8000);

    return () => {
      clearTimeout(greetingTimeout);
      clearTimeout(subGreetingTimeout);
    };
  }, []);

  const userId =
    localStorage.getItem("userId") ||
    `user_${Math.random().toString(36).substr(2, 9)}`;

  const connectWS = () => {
    console.log("connect");
    // if (wsRef.current) return; // Avoid multiple connections

    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", userId);
    }

    // Establish WebSocket connection
    const wsUrl = `${import.meta.env.VITE_WS_URL}/${userId}`;
    console.log("url", wsUrl);
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = (event) => {
      console.log("Connected to WebSocket");
      console.log("open", event);
    };

    socket.onmessage = (event) => {
      // setLoading(false); // Show loader when new data is received

      console.log("Received:", event, event.data, typeof event.data);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { botMessage: event.data, timestamp: new Date() },
      ]);
      setLoading(false); // Show loader when new data is received
    };

    socket.onclose = (e) => {
      console.log("WebSocket connection closed", e);
    };

    // Save the WebSocket instance to state
    setWs(socket);

    // Cleanup on unmount
    // return () => {
    //   socket.close();
    // };
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);

    if (!isChatOpen) {
      setChatOpenTime(new Date());
      setNewMessagesCount(0);
      connectWS(); // Connect WebSocket only when the chat is opened
      setIsFullScreen(false);
    } else {
      setChatOpenTime(null);
      if (ws) {
        ws.close(); // Close WebSocket connection when chat is closed

        setWs(null); // Reset WebSocket state
      }
    }
  };

  const handleMinimizeChat = () => {
    setIsChatOpen(!isChatOpen);

    // Ensure chat icon becomes visible when minimizing from fullscreen
    if (isFullScreen) {
      setIsFullScreen(false);
      setIsButtonInvisible(false); // Reset button visibility
    } else {
      // setIsButtonInvisible(!isButtonInvisible); // Toggle visibility if not in fullscreen
    }

    if (!isChatOpen) {
      setChatOpenTime(new Date());
      setNewMessagesCount(0);
      connectWS();
    } else {
      setChatOpenTime(null);
      if (ws) {
        ws.close(); // Close WebSocket connection when chat is minimized

        setWs(null); // Reset WebSocket state
      }
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMsg = async (msg) => {
    console.log("click");
    const messageToSend = msg || message;
    console.log("msgTosend", messageToSend);

    if (!messageToSend.trim()) return;
    // setLoading(true);
    setLoading(true);

    // Add user message to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { userMessage: messageToSend, timestamp: new Date() },
    ]);

    setMessage(""); // Clear the input message

    // Send message through WebSocket
    if (ws) {
      console.log("WS onsend::");

      await ws.send(messageToSend);
    } else {
      // handleReconnect(msg)
    }
  };

  const getChatOpenLabel = () => {
    if (!chatOpenTime) return null;

    const today = moment();
    const yesterday = moment().subtract(1, "days");

    if (moment(chatOpenTime).isSame(today, "day")) {
      return `Today ${moment(chatOpenTime).format("h:mm A")}`;
    } else if (moment(chatOpenTime).isSame(yesterday, "day")) {
      return `Yesterday ${moment(chatOpenTime).format("h:mm A")}`;
    } else {
      return `${moment(chatOpenTime).format("dddd h:mm A")}`;
    }
  };

  const handleRefreshChat = () => {
    handleReconnect();
    setChatHistory([]);
    setInitialMessageDisplayed(false);
    setIsBotTyping(true);

    const timer = setTimeout(() => {
      setIsBotTyping(false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  const handleReconnect = () => {
    if (ws) {
      console.log("ws", ws);
      console.log("ws event ", ws.event);
      ws.close();
    }
    reconnectOnRefresh();
  };

  const reconnectOnRefresh = () => {
    console.log("connect");

    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", userId); // Save userId for future sessions
    }

    const wsUrl = `${import.meta.env.VITE_WS_URL}/${userId}`;

    console.log("url", wsUrl);
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = (event) => {
      console.log("Connected to WebSocket");
      console.log("open", event);
    };

    socket.onmessage = (event) => {
      // setLoading(false); // Show loader when new data is received

      console.log("Received:", event, event.data, typeof event.data);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { botMessage: event.data, timestamp: new Date() },
      ]);
      setLoading(false); // Show loader when new data is received
    };

    socket.onclose = (e) => {
      console.log("WebSocket connection closed", e);
    };

    // Save the WebSocket instance to state
    setWs(socket);
  };

  const handleShowMoreClick = async () => {
    try {
      setLoading(true);
      await handleSendMsg("show more");
    } catch (error) {
      console.error("Error handling 'show more' click:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className={styles.ChatBody}>
      <div
        className={`${styles.chat} ${isChatOpen ? "" : styles.invisible} ${
          isFullScreen ? styles.fullScreen : ""
        }`}
      >
        <div className={`${styles.contact} ${styles.bar}`}>
          <div className={`${styles.pic} ${styles.bot}`}></div>
          <div className={styles.name}>{ChatbotText.BOT_NAME}</div>

          <div className={styles.seen}>{getChatOpenLabel()}</div>

          <div className={styles.minimizeButton}>
            <span className={styles.refreshIcon}>
              <RefreshIcon onClick={handleRefreshChat} />
            </span>
            <span>
              <MinimizeIcon onClick={handleMinimizeChat} />
            </span>
            <span style={{ marginTop: "15px" }}>
              {isFullScreen ? (
                <FullscreenExitIcon onClick={toggleFullScreen} />
              ) : (
                <FullscreenIcon onClick={toggleFullScreen} />
              )}
            </span>
          </div>
        </div>
        <div
          className={styles.messages}
          id="chat"
          style={{ width: "-webkit-fill-available" }}
        >
          {chatHistory.map((item, index) => (
            <React.Fragment key={index}>
              {item.userMessage && (
                <div>
                  <span
                    className={`${styles.messageTimestamp} ${styles.userTimestamp}`}
                  >
                    {moment(item.timestamp).format("LT")}
                  </span>
                  <div className={`${styles.message} ${styles.user}`}>
                    {item.userMessage}
                  </div>
                </div>
              )}
              {(() => {
                if (typeof item.botMessage === "string") {
                  try {
                    const parsedData = JSON.parse(item.botMessage);
                    if (parsedData.type === "list") {
                      if (parsedData.content.length === 0) {
                        // If content array is empty, show "No more flights available"
                        return (
                          <div>
                            <span
                              className={`${styles.messageTimestamp} ${styles.botTimestamp}`}
                            >
                              {moment(item.timestamp).format("LT")}
                            </span>
                            <div className={`${styles.message} ${styles.bot}`}>
                              {ChatbotText.NO_MORE_FLIGHTS}{" "}
                            </div>
                          </div>
                        );
                      } else if (
                        parsedData.content[0].trip_type === "round-trip"
                      ) {
                        return (
                          <React.Fragment>
                            <RoundTrip
                              tripsData={parsedData}
                              handleShowMoreClick={handleShowMoreClick}
                            />
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment>
                            <OneWayTrip
                              tripsData={parsedData}
                              handleShowMoreClick={handleShowMoreClick}
                            />
                          </React.Fragment>
                        );
                      }
                    } else if (
                      parsedData.type === "string" &&
                      parsedData.content
                    ) {
                      return (
                        <div>
                          <span
                            className={`${styles.messageTimestamp} ${styles.botTimestamp}`}
                          >
                            {moment(item.timestamp).format("LT")}
                          </span>
                          <div className={`${styles.message} ${styles.bot}`}>
                            {parsedData.content}
                          </div>
                        </div>
                      );
                    }
                  } catch (error) {
                    return (
                      <div>
                        <span
                          className={`${styles.messageTimestamp} ${styles.botTimestamp}`}
                        >
                          {moment(item.timestamp).format("LT")}
                        </span>
                        <div className={`${styles.message} ${styles.bot}`}>
                          {item.botMessage}
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </React.Fragment>
          ))}
          {isBotTyping && (
            <div className={`${styles.message} ${styles.bot} ${styles.typing}`}>
              <div className={`${styles.typing} ${styles.typing1}`}></div>
              <div className={`${styles.typing} ${styles.typing2}`}></div>
              <div className={`${styles.typing} ${styles.typing3}`}></div>
            </div>
          )}

          {loading && (
            <div className={`${styles.message} ${styles.bot} ${styles.typing}`}>
              <div className={`${styles.typing} ${styles.typing1}`}></div>
              <div className={`${styles.typing} ${styles.typing2}`}></div>
              <div className={`${styles.typing} ${styles.typing3}`}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.input}>
          <input
            ref={inputRef}
            placeholder={ChatbotText.PLACEHOLDER_MESSAGE}
            type="text"
            value={message}
            onChange={handleMessageChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMsg();
              }
            }}
          />
          <button
            onClick={() => handleSendMsg(message)}
            disabled={!message.trim()}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: message.trim() ? "pointer" : "not-allowed",
              padding: 0,
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
      <button
        onClick={toggleChat}
        className={`${styles.chatButton} ${
          isButtonInvisible || isFullScreen ? styles.invisible : ""
        }`}
      >
        {isChatOpen ? <CloseIcon /> : <ChatBubbleIcon />}
        {!isChatOpen && newMessagesCount > 0 && (
          <span className="notification-badge">{newMessagesCount}</span>
        )}
      </button>
      {showGreeting && (
        <div className={styles.chatbotGreeting}>{ChatbotText.GREETING}</div>
      )}
      {showSubGreeting && (
        <div className={styles.chatbotSubGreeting}>
          {ChatbotText.SUB_GREETING}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
