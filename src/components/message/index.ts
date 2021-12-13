customElements.define(
  "c-sms",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const variant = this.getAttribute("who") || "you";
      const name = this.getAttribute("name") || "";
      const div = document.createElement("div");
      const label = document.createElement("label");
      const style = document.createElement("style");
      const styleMe = "style=background-color:#B9E97C;text-align:right;";
      const styleYou = "style=background-color:#D8D8D8;";
      label.textContent = name;
      label.setAttribute("class", "label");
      div.innerHTML = `
        <span ${variant == "me" ? styleMe : styleYou}>
        ${this.textContent}
        </span>

      `;
      style.innerHTML = `
      .you,.me{
        display: flex;
        justify-content: ${variant == "me" ? "flex-end;" : "flex-start;"}
        margin-bottom: 5px;
      }
      span{
        border-radius: 4px;
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        padding: 15px 7px 15px 9px;
        max-width: 250px;
        word-break: break-word;
        box-sizing: border-box;
      }
      .label{
        display: block;
        font-size: 14px;
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        color: #A5A5A5;
        text-align: ${variant == "me" ? "end;" : "start;"}
        margin-right: 3px;
        margin-left: 3px;
      }
      `;
      div.className = variant;
      this.shadow.append(label);
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
