import _ from "react";
import { IconAppWindow as lr, IconBrandSpotify as Te } from "@tabler/icons";
var L = {}, fr = {
  get exports() {
    return L;
  },
  set exports(f) {
    L = f;
  }
}, D = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var we;
function cr() {
  if (we)
    return D;
  we = 1;
  var f = _, P = Symbol.for("react.element"), U = Symbol.for("react.fragment"), T = Object.prototype.hasOwnProperty, A = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, I = { key: !0, ref: !0, __self: !0, __source: !0 };
  function x(E, c, w) {
    var p, m = {}, y = null, W = null;
    w !== void 0 && (y = "" + w), c.key !== void 0 && (y = "" + c.key), c.ref !== void 0 && (W = c.ref);
    for (p in c)
      T.call(c, p) && !I.hasOwnProperty(p) && (m[p] = c[p]);
    if (E && E.defaultProps)
      for (p in c = E.defaultProps, c)
        m[p] === void 0 && (m[p] = c[p]);
    return { $$typeof: P, type: E, key: y, ref: W, props: m, _owner: A.current };
  }
  return D.Fragment = U, D.jsx = x, D.jsxs = x, D;
}
var F = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ce;
function vr() {
  return Ce || (Ce = 1, process.env.NODE_ENV !== "production" && function() {
    var f = _, P = Symbol.for("react.element"), U = Symbol.for("react.portal"), T = Symbol.for("react.fragment"), A = Symbol.for("react.strict_mode"), I = Symbol.for("react.profiler"), x = Symbol.for("react.provider"), E = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), p = Symbol.for("react.suspense_list"), m = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), W = Symbol.for("react.offscreen"), Z = Symbol.iterator, Pe = "@@iterator";
    function xe(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = Z && e[Z] || e[Pe];
      return typeof r == "function" ? r : null;
    }
    var C = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function v(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
          t[n - 1] = arguments[n];
        je("error", e, t);
      }
    }
    function je(e, r, t) {
      {
        var n = C.ReactDebugCurrentFrame, o = n.getStackAddendum();
        o !== "" && (r += "%s", t = t.concat([o]));
        var u = t.map(function(i) {
          return String(i);
        });
        u.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, u);
      }
    }
    var ke = !1, De = !1, Fe = !1, Ae = !1, Ie = !1, Q;
    Q = Symbol.for("react.module.reference");
    function We(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === T || e === I || Ie || e === A || e === w || e === p || Ae || e === W || ke || De || Fe || typeof e == "object" && e !== null && (e.$$typeof === y || e.$$typeof === m || e.$$typeof === x || e.$$typeof === E || e.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === Q || e.getModuleId !== void 0));
    }
    function $e(e, r, t) {
      var n = e.displayName;
      if (n)
        return n;
      var o = r.displayName || r.name || "";
      return o !== "" ? t + "(" + o + ")" : t;
    }
    function ee(e) {
      return e.displayName || "Context";
    }
    function h(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && v("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case T:
          return "Fragment";
        case U:
          return "Portal";
        case I:
          return "Profiler";
        case A:
          return "StrictMode";
        case w:
          return "Suspense";
        case p:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case E:
            var r = e;
            return ee(r) + ".Consumer";
          case x:
            var t = e;
            return ee(t._context) + ".Provider";
          case c:
            return $e(e, e.render, "ForwardRef");
          case m:
            var n = e.displayName || null;
            return n !== null ? n : h(e.type) || "Memo";
          case y: {
            var o = e, u = o._payload, i = o._init;
            try {
              return h(i(u));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var R = Object.assign, j = 0, re, te, ne, ae, ie, oe, ue;
    function se() {
    }
    se.__reactDisabledLog = !0;
    function Ye() {
      {
        if (j === 0) {
          re = console.log, te = console.info, ne = console.warn, ae = console.error, ie = console.group, oe = console.groupCollapsed, ue = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: se,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        j++;
      }
    }
    function Me() {
      {
        if (j--, j === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: R({}, e, {
              value: re
            }),
            info: R({}, e, {
              value: te
            }),
            warn: R({}, e, {
              value: ne
            }),
            error: R({}, e, {
              value: ae
            }),
            group: R({}, e, {
              value: ie
            }),
            groupCollapsed: R({}, e, {
              value: oe
            }),
            groupEnd: R({}, e, {
              value: ue
            })
          });
        }
        j < 0 && v("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var B = C.ReactCurrentDispatcher, H;
    function $(e, r, t) {
      {
        if (H === void 0)
          try {
            throw Error();
          } catch (o) {
            var n = o.stack.trim().match(/\n( *(at )?)/);
            H = n && n[1] || "";
          }
        return `
` + H + e;
      }
    }
    var z = !1, Y;
    {
      var Ve = typeof WeakMap == "function" ? WeakMap : Map;
      Y = new Ve();
    }
    function le(e, r) {
      if (!e || z)
        return "";
      {
        var t = Y.get(e);
        if (t !== void 0)
          return t;
      }
      var n;
      z = !0;
      var o = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var u;
      u = B.current, B.current = null, Ye();
      try {
        if (r) {
          var i = function() {
            throw Error();
          };
          if (Object.defineProperty(i.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(i, []);
            } catch (b) {
              n = b;
            }
            Reflect.construct(e, [], i);
          } else {
            try {
              i.call();
            } catch (b) {
              n = b;
            }
            e.call(i.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (b) {
            n = b;
          }
          e();
        }
      } catch (b) {
        if (b && n && typeof b.stack == "string") {
          for (var a = b.stack.split(`
`), d = n.stack.split(`
`), s = a.length - 1, l = d.length - 1; s >= 1 && l >= 0 && a[s] !== d[l]; )
            l--;
          for (; s >= 1 && l >= 0; s--, l--)
            if (a[s] !== d[l]) {
              if (s !== 1 || l !== 1)
                do
                  if (s--, l--, l < 0 || a[s] !== d[l]) {
                    var g = `
` + a[s].replace(" at new ", " at ");
                    return e.displayName && g.includes("<anonymous>") && (g = g.replace("<anonymous>", e.displayName)), typeof e == "function" && Y.set(e, g), g;
                  }
                while (s >= 1 && l >= 0);
              break;
            }
        }
      } finally {
        z = !1, B.current = u, Me(), Error.prepareStackTrace = o;
      }
      var S = e ? e.displayName || e.name : "", _e = S ? $(S) : "";
      return typeof e == "function" && Y.set(e, _e), _e;
    }
    function Ne(e, r, t) {
      return le(e, !1);
    }
    function Le(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function M(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return le(e, Le(e));
      if (typeof e == "string")
        return $(e);
      switch (e) {
        case w:
          return $("Suspense");
        case p:
          return $("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case c:
            return Ne(e.render);
          case m:
            return M(e.type, r, t);
          case y: {
            var n = e, o = n._payload, u = n._init;
            try {
              return M(u(o), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var V = Object.prototype.hasOwnProperty, fe = {}, ce = C.ReactDebugCurrentFrame;
    function N(e) {
      if (e) {
        var r = e._owner, t = M(e.type, e._source, r ? r.type : null);
        ce.setExtraStackFrame(t);
      } else
        ce.setExtraStackFrame(null);
    }
    function Ue(e, r, t, n, o) {
      {
        var u = Function.call.bind(V);
        for (var i in e)
          if (u(e, i)) {
            var a = void 0;
            try {
              if (typeof e[i] != "function") {
                var d = Error((n || "React class") + ": " + t + " type `" + i + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[i] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw d.name = "Invariant Violation", d;
              }
              a = e[i](r, i, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (s) {
              a = s;
            }
            a && !(a instanceof Error) && (N(o), v("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, i, typeof a), N(null)), a instanceof Error && !(a.message in fe) && (fe[a.message] = !0, N(o), v("Failed %s type: %s", t, a.message), N(null));
          }
      }
    }
    var Be = Array.isArray;
    function q(e) {
      return Be(e);
    }
    function He(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function ze(e) {
      try {
        return ve(e), !1;
      } catch {
        return !0;
      }
    }
    function ve(e) {
      return "" + e;
    }
    function de(e) {
      if (ze(e))
        return v("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", He(e)), ve(e);
    }
    var k = C.ReactCurrentOwner, qe = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, pe, ge, J;
    J = {};
    function Je(e) {
      if (V.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function Ge(e) {
      if (V.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function Ke(e, r) {
      if (typeof e.ref == "string" && k.current && r && k.current.stateNode !== r) {
        var t = h(k.current.type);
        J[t] || (v('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', h(k.current.type), e.ref), J[t] = !0);
      }
    }
    function Xe(e, r) {
      {
        var t = function() {
          pe || (pe = !0, v("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function Ze(e, r) {
      {
        var t = function() {
          ge || (ge = !0, v("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var Qe = function(e, r, t, n, o, u, i) {
      var a = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: P,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: i,
        // Record the component responsible for creating this element.
        _owner: u
      };
      return a._store = {}, Object.defineProperty(a._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(a, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: n
      }), Object.defineProperty(a, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: o
      }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
    };
    function er(e, r, t, n, o) {
      {
        var u, i = {}, a = null, d = null;
        t !== void 0 && (de(t), a = "" + t), Ge(r) && (de(r.key), a = "" + r.key), Je(r) && (d = r.ref, Ke(r, o));
        for (u in r)
          V.call(r, u) && !qe.hasOwnProperty(u) && (i[u] = r[u]);
        if (e && e.defaultProps) {
          var s = e.defaultProps;
          for (u in s)
            i[u] === void 0 && (i[u] = s[u]);
        }
        if (a || d) {
          var l = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          a && Xe(i, l), d && Ze(i, l);
        }
        return Qe(e, a, d, o, n, k.current, i);
      }
    }
    var G = C.ReactCurrentOwner, me = C.ReactDebugCurrentFrame;
    function O(e) {
      if (e) {
        var r = e._owner, t = M(e.type, e._source, r ? r.type : null);
        me.setExtraStackFrame(t);
      } else
        me.setExtraStackFrame(null);
    }
    var K;
    K = !1;
    function X(e) {
      return typeof e == "object" && e !== null && e.$$typeof === P;
    }
    function he() {
      {
        if (G.current) {
          var e = h(G.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function rr(e) {
      {
        if (e !== void 0) {
          var r = e.fileName.replace(/^.*[\\\/]/, ""), t = e.lineNumber;
          return `

Check your code at ` + r + ":" + t + ".";
        }
        return "";
      }
    }
    var be = {};
    function tr(e) {
      {
        var r = he();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function Ee(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = tr(r);
        if (be[t])
          return;
        be[t] = !0;
        var n = "";
        e && e._owner && e._owner !== G.current && (n = " It was passed a child from " + h(e._owner.type) + "."), O(e), v('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), O(null);
      }
    }
    function ye(e, r) {
      {
        if (typeof e != "object")
          return;
        if (q(e))
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            X(n) && Ee(n, r);
          }
        else if (X(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var o = xe(e);
          if (typeof o == "function" && o !== e.entries)
            for (var u = o.call(e), i; !(i = u.next()).done; )
              X(i.value) && Ee(i.value, r);
        }
      }
    }
    function nr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === c || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === m))
          t = r.propTypes;
        else
          return;
        if (t) {
          var n = h(r);
          Ue(t, e.props, "prop", n, e);
        } else if (r.PropTypes !== void 0 && !K) {
          K = !0;
          var o = h(r);
          v("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", o || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && v("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ar(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== "children" && n !== "key") {
            O(e), v("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), O(null);
            break;
          }
        }
        e.ref !== null && (O(e), v("Invalid attribute `ref` supplied to `React.Fragment`."), O(null));
      }
    }
    function Re(e, r, t, n, o, u) {
      {
        var i = We(e);
        if (!i) {
          var a = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var d = rr(o);
          d ? a += d : a += he();
          var s;
          e === null ? s = "null" : q(e) ? s = "array" : e !== void 0 && e.$$typeof === P ? (s = "<" + (h(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : s = typeof e, v("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", s, a);
        }
        var l = er(e, r, t, o, u);
        if (l == null)
          return l;
        if (i) {
          var g = r.children;
          if (g !== void 0)
            if (n)
              if (q(g)) {
                for (var S = 0; S < g.length; S++)
                  ye(g[S], e);
                Object.freeze && Object.freeze(g);
              } else
                v("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              ye(g, e);
        }
        return e === T ? ar(l) : nr(l), l;
      }
    }
    function ir(e, r, t) {
      return Re(e, r, t, !0);
    }
    function or(e, r, t) {
      return Re(e, r, t, !1);
    }
    var ur = or, sr = ir;
    F.Fragment = T, F.jsx = ur, F.jsxs = sr;
  }()), F;
}
(function(f) {
  process.env.NODE_ENV === "production" ? f.exports = cr() : f.exports = vr();
})(fr);
const Oe = L.jsx, dr = L.jsxs;
function Se({ app: f }) {
  return /* @__PURE__ */ dr("div", { children: [
    /* @__PURE__ */ Oe("p", { children: "Hello this is a plugin view" }),
    /* @__PURE__ */ Oe(
      "button",
      {
        onClick: () => f.notificationManager.success("Hello from plugin", "Hello"),
        children: "Say Hello"
      }
    )
  ] });
}
function mr(f) {
  f.notificationManager.success("Hello from plugin", "Hello"), f.navbarManager.pushTopItem({
    id: "test-navbar-item",
    icon: () => _.createElement(lr, { size: 20, stroke: 1.5 }),
    label: "Test Navbar Item",
    onClick: () => {
      f.viewManager.pushView({ view: {
        id: "custom-view",
        title: "Test",
        icon: "h",
        render: () => _.createElement(Se, { app: f })
      } });
    }
  }), f.navbarManager.pushTopItem({
    id: "spotify",
    icon: () => _.createElement(Te, { size: 20, stroke: 1.5 }),
    label: "Spotify",
    onClick: () => {
      f.viewManager.pushView({ view: {
        id: "custom-spotify",
        title: "Spotify",
        icon: _.createElement(Te, { size: 18, stroke: 1.5 }),
        render: () => _.createElement(Se, { app: f })
      } });
    }
  });
}
export {
  mr as init
};
//# sourceMappingURL=entry.js.map
