customElements.define(
  "custom-button",
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
      const button = document.createElement("button");
      button.textContent = this.textContent;
      const style = document.createElement("style");
      style.innerHTML = `
          button{
            width: 100%;
            height: 55px;
            background-color: #9CBBE9;
            border: none;
            border-radius: 4px;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            font-size: 22px;
          }
        `;
      this.shadow.appendChild(button);
      this.shadow.appendChild(style);
    }
  }
);
