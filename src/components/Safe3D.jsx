import { Component } from "react";
import { img } from "../data";

/* If WebGL is unavailable or the scene throws, show a photo instead of breaking the page. */
const hasWebGL = (() => {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
})();

export default class Safe3D extends Component {
  state = { failed: !hasWebGL };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {}
  render() {
    if (this.state.failed)
      return (
        <div className={`absolute inset-0 ${this.props.className || ""}`}>
          <img src={img(this.props.fallback || "hero-thar.jpg")} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/60" />
        </div>
      );
    return this.props.children;
  }
}
