customElements.define(
  "custom-title",
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
      const title = document.createElement("h1");
      title.textContent = this.textContent;
      const style = document.createElement("style");
      style.innerHTML = `
          h1 {
            font-family: 'Roboto', sans-serif;
            font-weight: bold;
            font-size: 52px;
            margin-bottom: 0px;
          }
        `;
      this.shadow.appendChild(title);
      this.shadow.appendChild(style);
    }
  }
);
