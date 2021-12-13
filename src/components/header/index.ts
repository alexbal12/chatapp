customElements.define(
  "custom-header",
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
      const div = document.createElement("div");
      const style = document.createElement("style");
      style.innerHTML = `
        div{
          height: 60px;
          background-color: #FF8282;
        }
        `;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
