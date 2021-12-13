import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "home-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    addListeners() {
      //habilitar y deshabilitar input
      const roomSelect = this.shadow.querySelector(".select") as any;
      const roomId = this.shadow.querySelector(".input-roomid") as any;
      roomId.disabled = true;
      roomId.style.backgroundColor = "#D8D8D8";
      roomSelect.addEventListener("change", () => {
        if (roomSelect.value == "newRoom") {
          roomId.disabled = true;
          roomId.style.backgroundColor = "#D8D8D8";
        } else {
          roomId.disabled = false;
          roomId.style.backgroundColor = "white";
        }
      });

      //formulario
      const form = this.shadow.querySelector(".form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        if (target.nombre.value && target.email.value) {
          state.setNameAndEmail(target.nombre.value, target.email.value);
          state.signIn((err) => {
            if (err) console.error("Hubo un error en el SignIn");
            if (roomSelect.value == "newRoom") {
              state.askNewRoom(() => {
                state.accessToRoom();
              });
            } else {
              state.setRoomId(roomId.value);
              console.log(roomId.value);
              state.accessToRoom();
            }
          });
        } else {
          state.setNameAndEmail("Anónimo", "Anónimo");
        }
        Router.go("/chat");
      });
    }

    connectedCallback() {
      this.render();
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.className = "home-page";
      div.innerHTML = `
        <div class="container">
        <custom-title>Bienvenido</custom-title>
        <form class="form">
          <label class="label">Email</label>
          <input type="text" name="email" class="input"/>

          <label class="label">Tu nombre</label>
          <input type="text" name="nombre" class="input"/>

          <label class="label">Room</label>
          <select class="select" type="text" name="room">
            <option class="new" value="newRoom"> Nueva Room </option>
            <option class="current" value="currentRoom"> Room Existente </option>
          </select>

          <label class="label">Room Id</label>
          <input type="text" name="roomId" class="input-roomid"/>

          <button class="button">Comenzar</button>
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
        .label{
          font-family: 'Roboto', sans-serif;
          font-size: 24px;
          font-weight: 500;
        }
        .input, .input-roomid, .select{
          width: 100%;
          height: 55px;
          font-size: 18px;
          border: 2px solid #000000;
          border-radius: 4px;
          padding: 10px 13px;
          font-family: Roboto;
          margin-bottom:13px;
          background-color: white;
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
        `;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
      this.addListeners();
    }
  }
);
