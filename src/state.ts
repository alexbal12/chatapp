const API_BASE_URL = "https://dwf-m6-chatapp.herokuapp.com";
import { rtdb } from "./rtdb";
import map from "lodash/map";
const state = {
  data: {
    email: "",
    name: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    messages: [],
  },
  listeners: [],
  init() {},
  listenRoom() {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;
    const roomsFef = rtdb.ref("/rooms/" + rtdbRoomId);
    roomsFef.on("value", (snapshot) => {
      const messagesFromServer = snapshot.val();
      const messageList = map(messagesFromServer.messages);
      currentState.messages = messageList;
      this.setState(currentState);
    });
  },
  getState() {
    return this.data;
  },
  setNameAndEmail(name: string, email: string) {
    const currentState = this.getState();
    currentState.name = name;
    currentState.email = email;
    this.setState(currentState);
  },
  signIn(callback) {
    const currentState = this.getState();
    const email = currentState.email;
    return fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.userId = data.id;
        this.setState(currentState);
        callback();
      });
  },
  askNewRoom(callback) {
    const currentState = this.getState();
    const userId = currentState.userId;
    return fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.roomId = data.id;
        this.setState(currentState);
        callback();
      });
  },
  accessToRoom(callback?) {
    const currentState = this.getState();
    const userId = currentState.userId;
    const roomId = currentState.roomId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.rtdbRoomId = data.rtdbRoomId;
        this.setState(currentState);
        this.listenRoom();
        if (callback) callback();
      });
  },
  setRoomId(roomId) {
    const currentState = this.getState();
    currentState.roomId = roomId;
    this.setState(currentState);
  },
  pushMessage(message: string) {
    const cs = this.getState();
    const userName = cs.name;
    const rtdbRoomId = cs.rtdbRoomId;
    fetch(API_BASE_URL + "/messages/" + rtdbRoomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: userName,
        message: message,
      }),
    });
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    console.log("Soy el state, he cambiado", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
