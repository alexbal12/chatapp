import { state } from "../../state";
type Message = {
  from: string;
  message: string;
};
class Chat extends HTMLElement {
  messages: Message[] = state.getState().messages;
  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.render();
    });
    this.render();
  }
  addListeners() {
    const form = this.querySelector(".submit-message");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      state.pushMessage(target["new-messenge"].value);
    });
    const chatContainer = document.querySelector(".chat");
    chatContainer.scrollTo({
      top: 1000000000000000,
      left: 0,
      behavior: "auto",
    });
  }

  render() {
    const style = document.createElement("style");
    const currentState = state.getState();
    const nombre = currentState.name;
    const roomId = currentState.roomId;
    this.innerHTML = `
      <div class="container">
        <custom-title>Chat</custom-title>
        <h2 class="subtitle">Room ID: ${roomId}</h2>
        <div class="chat">
        ${this.messages
          .map((m) => {
            return `<c-sms name="${m.from}" who=${
              nombre == m.from ? "me" : "you"
            }>${m.message}</c-sms>`;
          })
          .join("")}
        </div>
        <form class="submit-message">
        <input type="text" name="new-messenge" class="input"/>
        <button class="button">Enviar</button>
      </form>
      </div>
    `;
    style.innerHTML = `
      * {
        box-sizing: border-box;
      }
      .container{
        display:flex;
        flex-direction:column;
        gap: 20px;
      }
      .chat{
        height: 400px;
        border: solid 1px #A5A5A5;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding:5px;
      }
      .subtitle{
        font-family: Roboto;
        font-weight: 500;
        font-size: 24px;
        margin: 0px;
      }
      .input{
        width: 100%;
        height: 55px;
        font-size: 18px;
        border: 2px solid #000000;
        border-radius: 4px;
        padding: 17px 13px;
        font-family: Roboto;
      }
      .button{
        width: 100%;
        height: 55px;
        background-color: #9CBBE9;
        border: none;
        border-radius: 4px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 22px;
        margin-top:20px;
      }
      .label{
        display: flex;
        font-size: 14px;
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        color: #A5A5A5;
      }
      `;
    this.appendChild(style);
    this.addListeners();
  }
}
customElements.define("chat-page", Chat);
