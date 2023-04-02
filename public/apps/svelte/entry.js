function h() {
}
function m(e, t) {
  for (const n in t)
    e[n] = t[n];
  return e;
}
function ne(e) {
  return e();
}
function K() {
  return /* @__PURE__ */ Object.create(null);
}
function j(e) {
  e.forEach(ne);
}
function oe(e) {
  return typeof e == "function";
}
function k(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function de(e) {
  return Object.keys(e).length === 0;
}
function _e(e, ...t) {
  if (e == null)
    return h;
  const n = e.subscribe(...t);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function he(e, t, n) {
  e.$$.on_destroy.push(_e(t, n));
}
function re(e, t, n, o) {
  if (e) {
    const r = ie(e, t, n, o);
    return e[0](r);
  }
}
function ie(e, t, n, o) {
  return e[1] && o ? m(n.ctx.slice(), e[1](o(t))) : n.ctx;
}
function se(e, t, n, o) {
  if (e[2] && o) {
    const r = e[2](o(n));
    if (t.dirty === void 0)
      return r;
    if (typeof r == "object") {
      const i = [], s = Math.max(t.dirty.length, r.length);
      for (let l = 0; l < s; l += 1)
        i[l] = t.dirty[l] | r[l];
      return i;
    }
    return t.dirty | r;
  }
  return t.dirty;
}
function ce(e, t, n, o, r, i) {
  if (r) {
    const s = ie(t, n, o, i);
    e.p(s, r);
  }
}
function le(e) {
  if (e.ctx.length > 32) {
    const t = [], n = e.ctx.length / 32;
    for (let o = 0; o < n; o++)
      t[o] = -1;
    return t;
  }
  return -1;
}
function A(e) {
  const t = {};
  for (const n in e)
    n[0] !== "$" && (t[n] = e[n]);
  return t;
}
function Q(e, t) {
  const n = {};
  t = new Set(t);
  for (const o in e)
    !t.has(o) && o[0] !== "$" && (n[o] = e[o]);
  return n;
}
function C(e, t) {
  e.appendChild(t);
}
function me(e, t, n) {
  const o = ge(e);
  if (!o.getElementById(t)) {
    const r = S("style");
    r.id = t, r.textContent = n, be(o, r);
  }
}
function ge(e) {
  if (!e)
    return document;
  const t = e.getRootNode ? e.getRootNode() : e.ownerDocument;
  return t && t.host ? t : e.ownerDocument;
}
function be(e, t) {
  return C(e.head || e, t), t.sheet;
}
function z(e, t, n) {
  e.insertBefore(t, n || null);
}
function N(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function ve(e, t) {
  for (let n = 0; n < e.length; n += 1)
    e[n] && e[n].d(t);
}
function S(e) {
  return document.createElement(e);
}
function ue(e) {
  return document.createElementNS("http://www.w3.org/2000/svg", e);
}
function H(e) {
  return document.createTextNode(e);
}
function fe() {
  return H("");
}
function pe(e, t, n, o) {
  return e.addEventListener(t, n, o), () => e.removeEventListener(t, n, o);
}
function F(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function T(e, t) {
  for (const n in t)
    F(e, n, t[n]);
}
function we(e) {
  return Array.from(e.childNodes);
}
function ye(e, t) {
  t = "" + t, e.data !== t && (e.data = t);
}
function U(e, t) {
  return new e(t);
}
let G;
function E(e) {
  G = e;
}
const p = [], X = [];
let w = [];
const Y = [], ke = /* @__PURE__ */ Promise.resolve();
let L = !1;
function Ne() {
  L || (L = !0, ke.then(ae));
}
function R(e) {
  w.push(e);
}
const P = /* @__PURE__ */ new Set();
let b = 0;
function ae() {
  if (b !== 0)
    return;
  const e = G;
  do {
    try {
      for (; b < p.length; ) {
        const t = p[b];
        b++, E(t), Ie(t.$$);
      }
    } catch (t) {
      throw p.length = 0, b = 0, t;
    }
    for (E(null), p.length = 0, b = 0; X.length; )
      X.pop()();
    for (let t = 0; t < w.length; t += 1) {
      const n = w[t];
      P.has(n) || (P.add(n), n());
    }
    w.length = 0;
  } while (p.length);
  for (; Y.length; )
    Y.pop()();
  L = !1, P.clear(), E(e);
}
function Ie(e) {
  if (e.fragment !== null) {
    e.update(), j(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(R);
  }
}
function Ce(e) {
  const t = [], n = [];
  w.forEach((o) => e.indexOf(o) === -1 ? t.push(o) : n.push(o)), n.forEach((o) => o()), w = t;
}
const $ = /* @__PURE__ */ new Set();
let g;
function Ee() {
  g = {
    r: 0,
    c: [],
    p: g
    // parent group
  };
}
function Me() {
  g.r || j(g.c), g = g.p;
}
function y(e, t) {
  e && e.i && ($.delete(e), e.i(t));
}
function M(e, t, n, o) {
  if (e && e.o) {
    if ($.has(e))
      return;
    $.add(e), g.c.push(() => {
      $.delete(e), o && (n && e.d(1), o());
    }), e.o(t);
  } else
    o && o();
}
function J(e, t) {
  const n = {}, o = {}, r = { $$scope: 1 };
  let i = e.length;
  for (; i--; ) {
    const s = e[i], l = t[i];
    if (l) {
      for (const u in s)
        u in l || (o[u] = 1);
      for (const u in l)
        r[u] || (n[u] = l[u], r[u] = 1);
      e[i] = l;
    } else
      for (const u in s)
        r[u] = 1;
  }
  for (const s in o)
    s in n || (n[s] = void 0);
  return n;
}
function je(e) {
  return typeof e == "object" && e !== null ? e : {};
}
function W(e) {
  e && e.c();
}
function O(e, t, n, o) {
  const { fragment: r, after_update: i } = e.$$;
  r && r.m(t, n), o || R(() => {
    const s = e.$$.on_mount.map(ne).filter(oe);
    e.$$.on_destroy ? e.$$.on_destroy.push(...s) : j(s), e.$$.on_mount = [];
  }), i.forEach(R);
}
function V(e, t) {
  const n = e.$$;
  n.fragment !== null && (Ce(n.after_update), j(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function ze(e, t) {
  e.$$.dirty[0] === -1 && (p.push(e), Ne(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function q(e, t, n, o, r, i, s, l = [-1]) {
  const u = G;
  E(e);
  const f = e.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: i,
    update: h,
    not_equal: r,
    bound: K(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (u ? u.$$.context : [])),
    // everything else
    callbacks: K(),
    dirty: l,
    skip_bound: !1,
    root: t.target || u.$$.root
  };
  s && s(f.root);
  let _ = !1;
  if (f.ctx = n ? n(e, t.props || {}, (c, a, ...d) => {
    const I = d.length ? d[0] : a;
    return f.ctx && r(f.ctx[c], f.ctx[c] = I) && (!f.skip_bound && f.bound[c] && f.bound[c](I), _ && ze(e, c)), a;
  }) : [], f.update(), _ = !0, j(f.before_update), f.fragment = o ? o(f.ctx) : !1, t.target) {
    if (t.hydrate) {
      const c = we(t.target);
      f.fragment && f.fragment.l(c), c.forEach(N);
    } else
      f.fragment && f.fragment.c();
    t.intro && y(e.$$.fragment), O(e, t.target, t.anchor, t.customElement), ae();
  }
  E(u);
}
class B {
  $destroy() {
    V(this, 1), this.$destroy = h;
  }
  $on(t, n) {
    if (!oe(n))
      return h;
    const o = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return o.push(n), () => {
      const r = o.indexOf(n);
      r !== -1 && o.splice(r, 1);
    };
  }
  $set(t) {
    this.$$set && !de(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const v = [];
function $e(e, t = h) {
  let n;
  const o = /* @__PURE__ */ new Set();
  function r(l) {
    if (k(e, l) && (e = l, n)) {
      const u = !v.length;
      for (const f of o)
        f[1](), v.push(f, e);
      if (u) {
        for (let f = 0; f < v.length; f += 2)
          v[f][0](v[f + 1]);
        v.length = 0;
      }
    }
  }
  function i(l) {
    r(l(e));
  }
  function s(l, u = h) {
    const f = [l, u];
    return o.add(f), o.size === 1 && (n = t(r) || h), l(e), () => {
      o.delete(f), o.size === 0 && n && (n(), n = null);
    };
  }
  return { set: r, update: i, subscribe: s };
}
const Z = $e(0);
function Ae(e) {
  let t, n, o, r, i, s;
  return {
    c() {
      t = S("div"), n = S("button"), o = H("count is "), r = H(
        /*$count*/
        e[0]
      ), F(t, "id", "svelte-app");
    },
    m(l, u) {
      z(l, t, u), C(t, n), C(n, o), C(n, r), i || (s = pe(
        n,
        "click",
        /*increment*/
        e[1]
      ), i = !0);
    },
    p(l, [u]) {
      u & /*$count*/
      1 && ye(
        r,
        /*$count*/
        l[0]
      );
    },
    i: h,
    o: h,
    d(l) {
      l && N(t), i = !1, s();
    }
  };
}
function Se(e, t, n) {
  let o;
  return he(e, Z, (i) => n(0, o = i)), [o, () => {
    Z.set(o + 1);
  }];
}
class Te extends B {
  constructor(t) {
    super(), q(this, t, Se, Ae, k, {});
  }
}
function Oe(e) {
  me(e, "svelte-1t5e2bf", "div.svelte-1t5e2bf{display:flex;width:100%;height:100%;align-items:center;justify-content:center}");
}
function Ve(e) {
  let t, n, o;
  var r = (
    /*Icon*/
    e[0]
  );
  function i(s) {
    return { props: { stroke: 1.5, size: 20 } };
  }
  return r && (n = U(r, i())), {
    c() {
      t = S("div"), n && W(n.$$.fragment), F(t, "class", "svelte-1t5e2bf");
    },
    m(s, l) {
      z(s, t, l), n && O(n, t, null), o = !0;
    },
    p(s, [l]) {
      if (l & /*Icon*/
      1 && r !== (r = /*Icon*/
      s[0])) {
        if (n) {
          Ee();
          const u = n;
          M(u.$$.fragment, 1, 0, () => {
            V(u, 1);
          }), Me();
        }
        r ? (n = U(r, i()), W(n.$$.fragment), y(n.$$.fragment, 1), O(n, t, null)) : n = null;
      }
    },
    i(s) {
      o || (n && y(n.$$.fragment, s), o = !0);
    },
    o(s) {
      n && M(n.$$.fragment, s), o = !1;
    },
    d(s) {
      s && N(t), n && V(n);
    }
  };
}
function qe(e, t, n) {
  let { Icon: o } = t;
  return e.$$set = (r) => {
    "Icon" in r && n(0, o = r.Icon);
  }, [o];
}
class Be extends B {
  constructor(t) {
    super(), q(this, t, qe, Ve, k, { Icon: 0 }, Oe);
  }
}
var x = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function ee(e, t, n) {
  const o = e.slice();
  return o[9] = t[n][0], o[10] = t[n][1], o;
}
function D(e) {
  let t, n = [
    /*attrs*/
    e[10]
  ], o = {};
  for (let r = 0; r < n.length; r += 1)
    o = m(o, n[r]);
  return {
    c() {
      t = ue(
        /*tag*/
        e[9]
      ), T(t, o);
    },
    m(r, i) {
      z(r, t, i);
    },
    p(r, i) {
      T(t, o = J(n, [i & /*iconNode*/
      16 && /*attrs*/
      r[10]]));
    },
    d(r) {
      r && N(t);
    }
  };
}
function te(e) {
  let t = (
    /*tag*/
    e[9]
  ), n, o = (
    /*tag*/
    e[9] && D(e)
  );
  return {
    c() {
      o && o.c(), n = fe();
    },
    m(r, i) {
      o && o.m(r, i), z(r, n, i);
    },
    p(r, i) {
      /*tag*/
      r[9] ? t ? k(
        t,
        /*tag*/
        r[9]
      ) ? (o.d(1), o = D(r), t = /*tag*/
      r[9], o.c(), o.m(n.parentNode, n)) : o.p(r, i) : (o = D(r), t = /*tag*/
      r[9], o.c(), o.m(n.parentNode, n)) : t && (o.d(1), o = null, t = /*tag*/
      r[9]);
    },
    d(r) {
      r && N(n), o && o.d(r);
    }
  };
}
function Pe(e) {
  let t, n, o, r, i = (
    /*iconNode*/
    e[4]
  ), s = [];
  for (let c = 0; c < i.length; c += 1)
    s[c] = te(ee(e, i, c));
  const l = (
    /*#slots*/
    e[8].default
  ), u = re(
    l,
    e,
    /*$$scope*/
    e[7],
    null
  );
  let f = [
    x,
    /*$$restProps*/
    e[5],
    { width: (
      /*size*/
      e[2]
    ) },
    { height: (
      /*size*/
      e[2]
    ) },
    { stroke: (
      /*color*/
      e[1]
    ) },
    { "stroke-width": (
      /*stroke*/
      e[3]
    ) },
    {
      class: o = `tabler-icon tabler-icon-${/*name*/
      e[0]} ${/*$$props*/
      e[6].class ?? ""}`
    }
  ], _ = {};
  for (let c = 0; c < f.length; c += 1)
    _ = m(_, f[c]);
  return {
    c() {
      t = ue("svg");
      for (let c = 0; c < s.length; c += 1)
        s[c].c();
      n = fe(), u && u.c(), T(t, _);
    },
    m(c, a) {
      z(c, t, a);
      for (let d = 0; d < s.length; d += 1)
        s[d] && s[d].m(t, null);
      C(t, n), u && u.m(t, null), r = !0;
    },
    p(c, [a]) {
      if (a & /*iconNode*/
      16) {
        i = /*iconNode*/
        c[4];
        let d;
        for (d = 0; d < i.length; d += 1) {
          const I = ee(c, i, d);
          s[d] ? s[d].p(I, a) : (s[d] = te(I), s[d].c(), s[d].m(t, n));
        }
        for (; d < s.length; d += 1)
          s[d].d(1);
        s.length = i.length;
      }
      u && u.p && (!r || a & /*$$scope*/
      128) && ce(
        u,
        l,
        c,
        /*$$scope*/
        c[7],
        r ? se(
          l,
          /*$$scope*/
          c[7],
          a,
          null
        ) : le(
          /*$$scope*/
          c[7]
        ),
        null
      ), T(t, _ = J(f, [
        x,
        a & /*$$restProps*/
        32 && /*$$restProps*/
        c[5],
        (!r || a & /*size*/
        4) && { width: (
          /*size*/
          c[2]
        ) },
        (!r || a & /*size*/
        4) && { height: (
          /*size*/
          c[2]
        ) },
        (!r || a & /*color*/
        2) && { stroke: (
          /*color*/
          c[1]
        ) },
        (!r || a & /*stroke*/
        8) && { "stroke-width": (
          /*stroke*/
          c[3]
        ) },
        (!r || a & /*name, $$props*/
        65 && o !== (o = `tabler-icon tabler-icon-${/*name*/
        c[0]} ${/*$$props*/
        c[6].class ?? ""}`)) && { class: o }
      ]));
    },
    i(c) {
      r || (y(u, c), r = !0);
    },
    o(c) {
      M(u, c), r = !1;
    },
    d(c) {
      c && N(t), ve(s, c), u && u.d(c);
    }
  };
}
function De(e, t, n) {
  const o = ["name", "color", "size", "stroke", "iconNode"];
  let r = Q(t, o), { $$slots: i = {}, $$scope: s } = t, { name: l } = t, { color: u = "currentColor" } = t, { size: f = 24 } = t, { stroke: _ = 2 } = t, { iconNode: c } = t;
  return e.$$set = (a) => {
    n(6, t = m(m({}, t), A(a))), n(5, r = Q(t, o)), "name" in a && n(0, l = a.name), "color" in a && n(1, u = a.color), "size" in a && n(2, f = a.size), "stroke" in a && n(3, _ = a.stroke), "iconNode" in a && n(4, c = a.iconNode), "$$scope" in a && n(7, s = a.$$scope);
  }, t = A(t), [l, u, f, _, c, r, t, s, i];
}
class He extends B {
  constructor(t) {
    super(), q(this, t, De, Pe, k, {
      name: 0,
      color: 1,
      size: 2,
      stroke: 3,
      iconNode: 4
    });
  }
}
const Le = He;
function Re(e) {
  let t;
  const n = (
    /*#slots*/
    e[2].default
  ), o = re(
    n,
    e,
    /*$$scope*/
    e[3],
    null
  );
  return {
    c() {
      o && o.c();
    },
    m(r, i) {
      o && o.m(r, i), t = !0;
    },
    p(r, i) {
      o && o.p && (!t || i & /*$$scope*/
      8) && ce(
        o,
        n,
        r,
        /*$$scope*/
        r[3],
        t ? se(
          n,
          /*$$scope*/
          r[3],
          i,
          null
        ) : le(
          /*$$scope*/
          r[3]
        ),
        null
      );
    },
    i(r) {
      t || (y(o, r), t = !0);
    },
    o(r) {
      M(o, r), t = !1;
    },
    d(r) {
      o && o.d(r);
    }
  };
}
function We(e) {
  let t, n;
  const o = [
    { name: "app-window" },
    /*$$props*/
    e[1],
    { iconNode: (
      /*iconNode*/
      e[0]
    ) }
  ];
  let r = {
    $$slots: { default: [Re] },
    $$scope: { ctx: e }
  };
  for (let i = 0; i < o.length; i += 1)
    r = m(r, o[i]);
  return t = new Le({ props: r }), {
    c() {
      W(t.$$.fragment);
    },
    m(i, s) {
      O(t, i, s), n = !0;
    },
    p(i, [s]) {
      const l = s & /*$$props, iconNode*/
      3 ? J(o, [
        o[0],
        s & /*$$props*/
        2 && je(
          /*$$props*/
          i[1]
        ),
        s & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          i[0]
        ) }
      ]) : {};
      s & /*$$scope*/
      8 && (l.$$scope = { dirty: s, ctx: i }), t.$set(l);
    },
    i(i) {
      n || (y(t.$$.fragment, i), n = !0);
    },
    o(i) {
      M(t.$$.fragment, i), n = !1;
    },
    d(i) {
      V(t, i);
    }
  };
}
function Fe(e, t, n) {
  let { $$slots: o = {}, $$scope: r } = t;
  const i = [
    [
      "path",
      {
        d: "M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"
      }
    ],
    ["path", { d: "M6 8h.01" }],
    ["path", { d: "M9 8h.01" }]
  ];
  return e.$$set = (s) => {
    n(1, t = m(m({}, t), A(s))), "$$scope" in s && n(3, r = s.$$scope);
  }, t = A(t), [i, t, o, r];
}
class Ge extends B {
  constructor(t) {
    super(), q(this, t, Fe, We, k, {});
  }
}
const Je = Ge;
function Ke(e) {
  e.notificationManager.success("Hello from svelte plugin", "Hello"), e.navbarManager.pushTopItem({
    id: "test-navbar-item-2",
    icon: {
      render(t) {
        new Be({
          target: t,
          props: {
            Icon: Je
          }
        });
      }
    },
    label: "Test Navbar Item",
    onClick: () => {
      e.viewManager.pushView({
        view: {
          id: "custom-view-2",
          title: "Test",
          icon: "h",
          render: {
            render(t) {
              new Te({
                target: t
              });
              const n = document.querySelector("#svelte-app");
              return () => {
                n && t.removeChild(n), console.log(t, n);
              };
            }
          }
        }
      });
    }
  }), e.commandManager.defineCommand({
    id: "close-tab-plugin",
    title: "Close Tab From Plugin",
    shortCut: "mod+T",
    onTrigger: () => {
      const t = e.viewManager.store.get();
      t.currentView && e.viewManager.removeView(t.currentView);
    }
  });
}
export {
  Ke as init
};
//# sourceMappingURL=entry.js.map
