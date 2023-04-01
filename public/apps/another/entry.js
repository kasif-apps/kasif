function i(t) {
  t.notificationManager.success("Hello from plugin", "Hello"), t.viewManager.pushView({
    id: `custom-${Date.now()}`,
    title: "Test",
    icon: "h",
    render: {
      render: (n) => {
        const e = document.createElement("div"), o = document.createTextNode("Hello, world!");
        return e.appendChild(o), n.appendChild(e), () => {
          n.removeChild(e);
        };
      }
    }
  });
}
export {
  i as init
};
//# sourceMappingURL=entry.js.map
