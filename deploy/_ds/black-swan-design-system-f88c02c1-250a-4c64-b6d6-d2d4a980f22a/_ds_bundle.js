/* @ds-bundle: {"format":3,"namespace":"BlackSwanDesignSystem_f88c02","components":[{"name":"Alert","sourcePath":"components/core/Alert.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"}],"sourceHashes":{"components/core/Alert.jsx":"2d147df0216d","components/core/Badge.jsx":"2c2ab3db3670","components/core/Button.jsx":"b773fa323ee1","components/core/Card.jsx":"68c6cb64357f","components/core/Checkbox.jsx":"d658bb16dcb4","components/core/Input.jsx":"718ad8d2408e","components/core/Select.jsx":"8c292e2e01ae","components/core/Switch.jsx":"242e79cb2a56","ui_kits/console/Dashboard.jsx":"1d4a58b8ff43","ui_kits/console/LoginScreen.jsx":"d85a6d03f62b","ui_kits/console/Sidebar.jsx":"5ecfc61be676","ui_kits/console/SignalDrawer.jsx":"525b082f4d7b","ui_kits/console/Topbar.jsx":"6c88f6ef0225"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BlackSwanDesignSystem_f88c02 = window.BlackSwanDesignSystem_f88c02 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan inline alert. A left accent bar + tinted surface carry the tone.
 * Use for inline form/system feedback — not for transient toasts.
 */
function Alert({
  tone = "info",
  title = null,
  style = {},
  children,
  ...rest
}) {
  const tones = {
    success: {
      tint: "var(--success-tint)",
      bar: "var(--success)"
    },
    warning: {
      tint: "var(--warning-tint)",
      bar: "var(--warning)"
    },
    danger: {
      tint: "var(--danger-tint)",
      bar: "var(--danger)"
    },
    info: {
      tint: "var(--info-tint)",
      bar: "var(--info)"
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      gap: "var(--space-3)",
      padding: "var(--space-4)",
      background: t.tint,
      borderRadius: "var(--radius-lg)",
      borderLeft: `3px solid ${t.bar}`,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      display: "block",
      fontWeight: "var(--weight-semibold)",
      marginBottom: 2
    }
  }, title), children));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Alert.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan badge / pill. Small status or category marker. `brand` uses the
 * orange accent tint; status tones map to system colors.
 */
function Badge({
  tone = "brand",
  style = {},
  children,
  ...rest
}) {
  const tones = {
    brand: {
      background: "var(--accent)",
      color: "var(--accent-foreground)"
    },
    neutral: {
      background: "var(--muted)",
      color: "var(--muted-foreground)"
    },
    success: {
      background: "var(--success-tint)",
      color: "var(--success)"
    },
    warning: {
      background: "var(--warning-tint)",
      color: "var(--warning)"
    },
    danger: {
      background: "var(--danger-tint)",
      color: "var(--danger)"
    },
    info: {
      background: "var(--info-tint)",
      color: "var(--info)"
    },
    solid: {
      background: "var(--foreground)",
      color: "var(--background)"
    }
  };
  const t = tones[tone] || tones.brand;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 10px",
      borderRadius: "var(--radius-full)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-semibold)",
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      ...t,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan Button. Signal-orange primary is the only loud action — use
 * it once per view. Everything else is secondary / outline / ghost.
 */
function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  children,
  ...rest
}) {
  const sizes = {
    sm: {
      height: 32,
      padding: "0 var(--space-3)",
      font: "var(--text-xs)"
    },
    md: {
      height: 40,
      padding: "0 var(--space-4)",
      font: "var(--text-sm)"
    },
    lg: {
      height: 48,
      padding: "0 var(--space-6)",
      font: "var(--text-base)"
    }
  };
  const variants = {
    primary: {
      background: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "1px solid transparent"
    },
    secondary: {
      background: "var(--secondary)",
      color: "var(--secondary-foreground)",
      border: "1px solid transparent"
    },
    outline: {
      background: "transparent",
      color: "var(--foreground)",
      border: "1px solid var(--border)"
    },
    ghost: {
      background: "transparent",
      color: "var(--foreground)",
      border: "1px solid transparent"
    },
    danger: {
      background: "var(--danger)",
      color: "#fff",
      border: "1px solid transparent"
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    className: `bsw-btn bsw-btn--${variant}`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-2)",
      height: s.height,
      padding: s.padding,
      fontFamily: "var(--font-sans)",
      fontSize: s.font,
      fontWeight: "var(--weight-semibold)",
      lineHeight: 1,
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease)",
      ...v,
      ...style
    }
  }, rest), iconLeft, children, iconRight, /*#__PURE__*/React.createElement("style", null, `
        .bsw-btn:focus-visible{outline:none;box-shadow:var(--shadow-focus)}
        .bsw-btn--primary:not(:disabled):hover{background:var(--primary-hover)!important}
        .bsw-btn--primary:not(:disabled):active{background:var(--primary-active)!important}
        .bsw-btn--secondary:not(:disabled):hover{background:var(--secondary-hover)!important}
        .bsw-btn--outline:not(:disabled):hover{background:var(--muted)!important}
        .bsw-btn--ghost:not(:disabled):hover{background:var(--muted)!important}
        .bsw-btn--danger:not(:disabled):hover{filter:brightness(.92)}
      `));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan surface card. White panel, hairline border, soft warm shadow.
 * Compose freely; `interactive` adds a hover lift for clickable cards.
 */
function Card({
  interactive = false,
  padding = "var(--space-6)",
  style = {},
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: interactive ? "bsw-card bsw-card--interactive" : "bsw-card",
    style: {
      background: "var(--card)",
      color: "var(--card-foreground)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-sm)",
      padding,
      transition: "box-shadow var(--duration-normal) var(--ease), transform var(--duration-normal) var(--ease)",
      ...style
    }
  }, rest), children, /*#__PURE__*/React.createElement("style", null, `
        .bsw-card--interactive{cursor:pointer}
        .bsw-card--interactive:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
      `));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan checkbox. Orange fill + white check when selected. Controlled.
 */
function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label = null,
  id,
  style = {},
  ...rest
}) {
  const fieldId = id || (label ? `bsw-cb-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const box = {
    width: 18,
    height: 18,
    flex: "none",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${checked ? "var(--primary)" : "var(--border)"}`,
    background: checked ? "var(--primary)" : "var(--card)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease)"
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-2)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: box
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), checked && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2 5 8.6 9.5 3.6",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan text input. Pairs with a label and optional error/hint text.
 * Focus draws the orange ring; `error` swaps the border to danger.
 */
function Input({
  label = null,
  hint = null,
  error = null,
  size = "md",
  id,
  style = {},
  ...rest
}) {
  const heights = {
    sm: 32,
    md: 40,
    lg: 48
  };
  const h = heights[size] || heights.md;
  const fieldId = id || (label ? `bsw-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--foreground)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: "bsw-input",
    "aria-invalid": !!error,
    style: {
      height: h,
      width: "100%",
      padding: "0 var(--space-3)",
      background: "var(--card)",
      border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      color: "var(--foreground)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      transition: "border-color var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease)",
      ...style
    }
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger)" : "var(--muted-foreground)"
    }
  }, error || hint), /*#__PURE__*/React.createElement("style", null, `
        .bsw-input::placeholder{color:var(--muted-foreground)}
        .bsw-input:focus{outline:none;border-color:var(--ring);box-shadow:var(--shadow-focus)}
      `));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan select. Native <select> styled to match Input, with a custom
 * chevron. Pass `options` as [{value,label}] or strings, or use children.
 */
function Select({
  label = null,
  hint = null,
  error = null,
  options = null,
  size = "md",
  id,
  style = {},
  children,
  ...rest
}) {
  const heights = {
    sm: 32,
    md: 40,
    lg: 48
  };
  const h = heights[size] || heights.md;
  const fieldId = id || (label ? `bsw-sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const opts = options ? options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--foreground)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    className: "bsw-select",
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      height: h,
      width: "100%",
      padding: "0 var(--space-8) 0 var(--space-3)",
      background: "var(--card)",
      border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      color: "var(--foreground)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      cursor: "pointer",
      transition: "border-color var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease)",
      ...style
    }
  }, rest), opts ? opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)) : children), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: "var(--space-3)",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--muted-foreground)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6l4 4 4-4",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger)" : "var(--muted-foreground)"
    }
  }, error || hint), /*#__PURE__*/React.createElement("style", null, `.bsw-select:focus{outline:none;border-color:var(--ring);box-shadow:var(--shadow-focus)}`));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Black Swan toggle switch. Orange when on. Controlled via `checked`/`onChange`.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label = null,
  id,
  style = {},
  ...rest
}) {
  const fieldId = id || (label ? `bsw-sw-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const track = {
    width: 40,
    height: 24,
    borderRadius: "var(--radius-full)",
    background: checked ? "var(--primary)" : "var(--color-black-300)",
    transition: "background var(--duration-fast) var(--ease)",
    flex: "none",
    position: "relative",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1
  };
  const knob = {
    position: "absolute",
    top: 2,
    left: checked ? 18 : 2,
    width: 20,
    height: 20,
    borderRadius: "var(--radius-full)",
    background: "#fff",
    boxShadow: "var(--shadow-sm)",
    transition: "left var(--duration-fast) var(--ease)"
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: track
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: knob
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Dashboard.jsx
try { (() => {
const SIGNALS = [{
  id: "SIG-4821",
  name: "FX liquidity gap — EUR/CHF",
  domain: "Markets",
  sev: "critical",
  score: 92,
  change: "+14",
  time: "2m ago"
}, {
  id: "SIG-4817",
  name: "Supplier concentration breach",
  domain: "Operations",
  sev: "high",
  score: 78,
  change: "+6",
  time: "18m ago"
}, {
  id: "SIG-4809",
  name: "Sentiment spike — energy sector",
  domain: "Markets",
  sev: "medium",
  score: 54,
  change: "−3",
  time: "1h ago"
}, {
  id: "SIG-4802",
  name: "Counterparty downgrade watch",
  domain: "Credit",
  sev: "high",
  score: 71,
  change: "+9",
  time: "3h ago"
}, {
  id: "SIG-4795",
  name: "Regulatory filing anomaly",
  domain: "Compliance",
  sev: "low",
  score: 31,
  change: "+1",
  time: "5h ago"
}];
const SEV = {
  critical: {
    tone: "danger",
    label: "Critical"
  },
  high: {
    tone: "warning",
    label: "High"
  },
  medium: {
    tone: "info",
    label: "Medium"
  },
  low: {
    tone: "neutral",
    label: "Low"
  }
};
function Kpi({
  label,
  value,
  sub,
  icon,
  trend
}) {
  const {
    Card
  } = window.BlackSwanDesignSystem_f88c02;
  const up = trend && trend.startsWith("+");
  return /*#__PURE__*/React.createElement(Card, {
    padding: "18px 20px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)",
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("i", {
    className: `ph ${icon}`,
    style: {
      fontSize: 18,
      color: "var(--muted-foreground)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 32,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "var(--foreground)"
    }
  }, value), trend && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: up ? "var(--danger)" : "var(--success)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph ${up ? "ph-trend-up" : "ph-trend-down"}`
  }), " ", trend)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)",
      marginTop: 4
    }
  }, sub));
}
function Sparkline() {
  const pts = [18, 22, 19, 28, 24, 34, 30, 42, 38, 52, 48, 61];
  const max = 64,
    w = 100,
    h = 36;
  const d = pts.map((p, i) => `${i / (pts.length - 1) * w},${h - p / max * h}`).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: "none",
    style: {
      width: "100%",
      height: 60
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: d,
    fill: "none",
    stroke: "var(--primary)",
    strokeWidth: "2",
    vectorEffect: "non-scaling-stroke",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function Dashboard({
  onOpenSignal
}) {
  const {
    Card,
    Badge,
    Button
  } = window.BlackSwanDesignSystem_f88c02;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      overflow: "auto",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Kpi, {
    label: "Active signals",
    value: "12",
    sub: "across 4 domains",
    icon: "ph-pulse",
    trend: "+3"
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Aggregate risk",
    value: "71",
    sub: "composite index",
    icon: "ph-gauge",
    trend: "+8"
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Exposure at risk",
    value: "\u20AC48.2M",
    sub: "modelled, 30d",
    icon: "ph-coins",
    trend: "+5"
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Scenarios run",
    value: "146",
    sub: "this quarter",
    icon: "ph-tree-structure"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 16,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      fontWeight: 700,
      color: "var(--foreground)"
    }
  }, "Risk index \u2014 12 weeks"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, "Composite of all monitored signals")), /*#__PURE__*/React.createElement(Badge, {
    tone: "danger"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-arrow-up"
  }), " Elevated")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Sparkline, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 8,
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--muted-foreground)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "W1"), /*#__PURE__*/React.createElement("span", null, "W4"), /*#__PURE__*/React.createElement("span", null, "W8"), /*#__PURE__*/React.createElement("span", null, "W12"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      fontWeight: 700,
      color: "var(--foreground)"
    }
  }, "By domain"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      marginTop: 18
    }
  }, [["Markets", 64, "var(--primary)"], ["Credit", 42, "var(--color-orange-300)"], ["Operations", 28, "var(--color-black-400)"], ["Compliance", 16, "var(--color-black-300)"]].map(([n, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      marginBottom: 6,
      color: "var(--foreground)"
    }
  }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      color: "var(--muted-foreground)"
    }
  }, v)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 4,
      background: "var(--muted)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${v}%`,
      height: "100%",
      borderRadius: 4,
      background: c
    }
  }))))))), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    style: {
      marginTop: 16,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      fontWeight: 700,
      color: "var(--foreground)"
    }
  }, "Live signals"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-funnel",
      style: {
        fontSize: 15
      }
    })
  }, "Filter")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      textAlign: "left",
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: "var(--muted-foreground)"
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Signal"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Domain"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Severity"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Score"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "\u0394 24h"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Updated"))), /*#__PURE__*/React.createElement("tbody", null, SIGNALS.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id,
    onClick: () => onOpenSignal(s),
    className: "bsw-srow",
    style: {
      cursor: "pointer",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: "var(--foreground)"
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--muted-foreground)"
    }
  }, s.id)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: "var(--muted-foreground)"
    }
  }, s.domain), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: SEV[s.sev].tone
  }, SEV[s.sev].label)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: "var(--font-mono)",
      fontWeight: 600,
      color: "var(--foreground)"
    }
  }, s.score), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: "var(--font-mono)",
      color: s.change.startsWith("+") ? "var(--danger)" : "var(--success)"
    }
  }, s.change), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: "var(--muted-foreground)",
      fontSize: "var(--text-sm)"
    }
  }, s.time)))))), /*#__PURE__*/React.createElement("style", null, `.bsw-srow:hover{background:var(--background)}`));
}
const th = {
  padding: "12px 20px",
  fontWeight: 600
};
const td = {
  padding: "14px 20px",
  fontSize: "var(--text-sm)",
  verticalAlign: "middle"
};
window.Dashboard = Dashboard;
window.__SIGNALS = SIGNALS;
window.__SEV = SEV;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/LoginScreen.jsx
try { (() => {
function LoginScreen({
  onLogin
}) {
  const {
    Button,
    Input,
    Checkbox
  } = window.BlackSwanDesignSystem_f88c02;
  const [remember, setRemember] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: "100%",
      height: "100%",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: "var(--color-black-900)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 48,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: "var(--primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bird",
    style: {
      fontSize: 20,
      color: "#fff"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: "-0.01em"
    }
  }, "Black Swan Solutions")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "var(--color-orange-400)",
      marginBottom: 16
    }
  }, "Signal Console"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 44,
      fontWeight: 800,
      lineHeight: 1.05,
      letterSpacing: "-0.03em"
    }
  }, "See the rare event", /*#__PURE__*/React.createElement("br", null), "before it arrives."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontSize: 16,
      lineHeight: 1.6,
      color: "var(--color-black-300)",
      maxWidth: "44ch"
    }
  }, "Continuous risk monitoring across markets, credit, operations and compliance \u2014 one composite index, every signal that matters.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--color-black-400)"
    }
  }, "\xA9 2026 Black Swan Solutions"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -120,
      bottom: -120,
      width: 420,
      height: 420,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(240,90,26,.22), transparent 70%)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 480,
      flex: "none",
      background: "var(--card)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "var(--foreground)"
    }
  }, "Sign in"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 28px",
      fontSize: 15,
      color: "var(--muted-foreground)"
    }
  }, "Welcome back. Enter your credentials."), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onLogin();
    },
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    placeholder: "you@blackswan.de",
    defaultValue: "a.reinhardt@blackswan.de"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    defaultValue: "password"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: remember,
    onChange: e => setRemember(e.target.checked),
    label: "Remember me"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--primary)",
      textDecoration: "none",
      fontWeight: 600
    }
  }, "Forgot?")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "primary",
    size: "lg",
    style: {
      width: "100%"
    }
  }, "Sign in to Console")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      paddingTop: 22,
      borderTop: "1px solid var(--border)",
      textAlign: "center",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, "Need access? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: "var(--primary)",
      textDecoration: "none",
      fontWeight: 600
    }
  }, "Contact your administrator")))));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Sidebar.jsx
try { (() => {
function Sidebar({
  active,
  onNavigate
}) {
  const {
    Badge
  } = window.BlackSwanDesignSystem_f88c02;
  const nav = [{
    id: "overview",
    icon: "ph-gauge",
    label: "Overview"
  }, {
    id: "signals",
    icon: "ph-pulse",
    label: "Signals",
    count: 12
  }, {
    id: "exposure",
    icon: "ph-chart-line-up",
    label: "Exposure"
  }, {
    id: "scenarios",
    icon: "ph-tree-structure",
    label: "Scenarios"
  }, {
    id: "reports",
    icon: "ph-file-text",
    label: "Reports"
  }];
  const bottom = [{
    id: "settings",
    icon: "ph-gear-six",
    label: "Settings"
  }, {
    id: "help",
    icon: "ph-question",
    label: "Help"
  }];
  const Item = ({
    item
  }) => {
    const on = active === item.id;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate(item.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 12px",
        border: "none",
        borderRadius: "var(--radius-md)",
        background: on ? "var(--accent)" : "transparent",
        color: on ? "var(--accent-foreground)" : "var(--color-black-300)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        fontWeight: on ? 600 : 500,
        cursor: "pointer",
        textAlign: "left",
        transition: "background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)"
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.color = "#fff";
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.color = "var(--color-black-300)";
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `ph ${item.icon}`,
      style: {
        fontSize: 20
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, item.label), item.count && /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, item.count));
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flex: "none",
      background: "var(--color-black-900)",
      display: "flex",
      flexDirection: "column",
      padding: 16,
      gap: 4,
      borderRight: "1px solid var(--color-black-700)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "var(--primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bird",
    style: {
      fontSize: 18,
      color: "#fff"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: "-0.01em"
    }
  }, "Black Swan"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--color-black-400)",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }
  }, "Signal Console"))), nav.map(i => /*#__PURE__*/React.createElement(Item, {
    key: i.id,
    item: i
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), bottom.map(i => /*#__PURE__*/React.createElement(Item, {
    key: i.id,
    item: i
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "10px 12px",
      borderRadius: "var(--radius-md)",
      background: "var(--color-black-800)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: "var(--radius-full)",
      background: "var(--color-orange-700)",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "AR"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontSize: 12,
      fontWeight: 600,
      fontFamily: "var(--font-sans)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "A. Reinhardt"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--color-black-400)",
      fontSize: 11,
      fontFamily: "var(--font-sans)"
    }
  }, "Risk Analyst")), /*#__PURE__*/React.createElement("i", {
    className: "ph ph-caret-up-down",
    style: {
      color: "var(--color-black-400)",
      fontSize: 16
    }
  })));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/SignalDrawer.jsx
try { (() => {
function SignalDrawer({
  signal,
  onClose
}) {
  const {
    Badge,
    Button,
    Card
  } = window.BlackSwanDesignSystem_f88c02;
  const SEV = window.__SEV;
  if (!signal) return null;
  const sev = SEV[signal.sev];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(15,15,15,.4)",
      zIndex: 20
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: 440,
      zIndex: 21,
      background: "var(--card)",
      borderLeft: "1px solid var(--border)",
      boxShadow: "var(--shadow-xl)",
      display: "flex",
      flexDirection: "column",
      animation: "bsw-slide .25s var(--ease)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 24px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "flex-start",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: sev.tone
  }, sev.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--muted-foreground)"
    }
  }, signal.id)), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "10px 0 0",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xl)",
      fontWeight: 700,
      letterSpacing: "-0.015em",
      color: "var(--foreground)"
    }
  }, signal.name)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 34,
      height: 34,
      flex: "none",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      background: "var(--card)",
      cursor: "pointer",
      color: "var(--foreground)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-x",
    style: {
      fontSize: 16
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Risk score",
    value: signal.score,
    mono: true
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "24h change",
    value: signal.change,
    mono: true,
    danger: signal.change.startsWith("+")
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Domain",
    value: signal.domain
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Updated",
    value: signal.time
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: hdr
  }, "Summary"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
      color: "var(--foreground)"
    }
  }, "Model detected a ", sev.label.toLowerCase(), "-severity deviation in ", signal.domain.toLowerCase(), " indicators. Composite score moved ", signal.change, " over the last 24 hours, crossing the alert threshold. Recommend analyst review and a stress scenario run.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: hdr
  }, "Contributing factors"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, [["Volatility regime shift", 38], ["Concentration ratio", 27], ["External sentiment", 21], ["Historical analogue", 14]].map(([n, v]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)"
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 6,
      borderRadius: 3,
      background: "var(--muted)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${v * 2}%`,
      height: "100%",
      borderRadius: 3,
      background: "var(--primary)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--muted-foreground)"
    }
  }, v, "%")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: "16px 24px",
      borderTop: "1px solid var(--border)",
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-tree-structure",
      style: {
        fontSize: 16
      }
    })
  }, "Run scenario"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "Assign"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-check",
      style: {
        fontSize: 16
      }
    })
  }, "Acknowledge"))), /*#__PURE__*/React.createElement("style", null, `@keyframes bsw-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}`));
}
function Stat({
  label,
  value,
  mono,
  danger
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      background: "var(--background)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)",
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontSize: "var(--text-lg)",
      fontWeight: 700,
      color: danger ? "var(--danger)" : "var(--foreground)"
    }
  }, value));
}
const hdr = {
  margin: "0 0 10px",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-xs)",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--muted-foreground)"
};
window.SignalDrawer = SignalDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/SignalDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Topbar.jsx
try { (() => {
function Topbar({
  title,
  onLogout
}) {
  const {
    Button
  } = window.BlackSwanDesignSystem_f88c02;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 64,
      flex: "none",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 28px",
      borderBottom: "1px solid var(--border)",
      background: "var(--card)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xl)",
      fontWeight: 700,
      letterSpacing: "-0.015em",
      color: "var(--foreground)"
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 38,
      width: 280,
      padding: "0 12px",
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      color: "var(--muted-foreground)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-magnifying-glass",
    style: {
      fontSize: 16
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)"
    }
  }, "Search signals, scenarios\u2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      padding: "1px 6px",
      border: "1px solid var(--border)",
      borderRadius: 4
    }
  }, "\u2318K")), /*#__PURE__*/React.createElement("button", {
    style: iconBtn,
    title: "Notifications"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-bell",
    style: {
      fontSize: 20
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 7,
      right: 7,
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "var(--primary)",
      border: "2px solid var(--card)"
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement("i", {
      className: "ph ph-plus",
      style: {
        fontSize: 15
      }
    })
  }, "New scenario"), /*#__PURE__*/React.createElement("button", {
    style: iconBtn,
    title: "Sign out",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-sign-out",
    style: {
      fontSize: 20
    }
  })));
}
const iconBtn = {
  position: "relative",
  width: 38,
  height: 38,
  flex: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  background: "var(--card)",
  color: "var(--foreground)",
  cursor: "pointer"
};
window.Topbar = Topbar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Topbar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();
