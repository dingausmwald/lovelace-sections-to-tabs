/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, Y = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = Symbol(), at = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Y && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = at.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && at.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const St = (r) => new bt(typeof r == "string" ? r : r + "", void 0, tt), yt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new bt(e, r, tt);
}, Et = (r, t) => {
  if (Y) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = B.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, ht = Y ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return St(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xt, defineProperty: Tt, getOwnPropertyDescriptor: Pt, getOwnPropertyNames: Nt, getOwnPropertySymbols: Mt, getPrototypeOf: Ot } = Object, y = globalThis, lt = y.trustedTypes, Ut = lt ? lt.emptyScript : "", Z = y.reactiveElementPolyfillSupport, H = (r, t) => r, Q = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Ut : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, et = (r, t) => !xt(r, t), ct = { attribute: !0, type: String, converter: Q, reflect: !1, useDefault: !1, hasChanged: et };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ct) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Tt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = Pt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const h = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ct;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = Ot(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, s = [...Nt(e), ...Mt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(ht(i));
    } else t !== void 0 && e.push(ht(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Et(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : Q).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const h = s.getPropertyOptions(i), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((n = h.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? h.converter : Q;
      this._$Em = i;
      const c = a.fromAttribute(e, h.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    var o;
    if (t !== void 0) {
      const h = this.constructor;
      if (i === !1 && (n = this[t]), s ?? (s = h.getPropertyOptions(t)), !((s.hasChanged ?? et)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(h._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: h } = o, a = this[n];
        h !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[H("elementProperties")] = /* @__PURE__ */ new Map(), T[H("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: T }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, dt = (r) => r, W = R.trustedTypes, pt = W ? W.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, vt = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, wt = "?" + b, Ht = `<${wt}>`, S = document, L = () => S.createComment(""), k = (r) => r === null || typeof r != "object" && typeof r != "function", st = Array.isArray, Rt = (r) => st(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", G = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ut = /-->/g, _t = />/g, w = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, gt = /"/g, At = /^(?:script|style|textarea|title)$/i, Lt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), V = Lt(1), N = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), mt = /* @__PURE__ */ new WeakMap(), A = S.createTreeWalker(S, 129);
function Ct(r, t) {
  if (!st(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pt !== void 0 ? pt.createHTML(t) : t;
}
const kt = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = U;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let c, d, l = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, d = o.exec(a), d !== null); ) u = o.lastIndex, o === U ? d[1] === "!--" ? o = ut : d[1] !== void 0 ? o = _t : d[2] !== void 0 ? (At.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = w) : d[3] !== void 0 && (o = w) : o === w ? d[0] === ">" ? (o = i ?? U, l = -1) : d[1] === void 0 ? l = -2 : (l = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? w : d[3] === '"' ? gt : ft) : o === gt || o === ft ? o = w : o === ut || o === _t ? o = U : (o = w, i = void 0);
    const p = o === w && r[h + 1].startsWith("/>") ? " " : "";
    n += o === U ? a + Ht : l >= 0 ? (s.push(c), a.slice(0, l) + vt + a.slice(l) + b + p) : a + b + (l === -2 ? h : p);
  }
  return [Ct(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class z {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const h = t.length - 1, a = this.parts, [c, d] = kt(t, e);
    if (this.el = z.createElement(c, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = A.nextNode()) !== null && a.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(vt)) {
          const u = d[o++], p = i.getAttribute(l).split(b), f = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: f[2], strings: p, ctor: f[1] === "." ? Dt : f[1] === "?" ? It : f[1] === "@" ? jt : F }), i.removeAttribute(l);
        } else l.startsWith(b) && (a.push({ type: 6, index: n }), i.removeAttribute(l));
        if (At.test(i.tagName)) {
          const l = i.textContent.split(b), u = l.length - 1;
          if (u > 0) {
            i.textContent = W ? W.emptyScript : "";
            for (let p = 0; p < u; p++) i.append(l[p], L()), A.nextNode(), a.push({ type: 2, index: ++n });
            i.append(l[u], L());
          }
        }
      } else if (i.nodeType === 8) if (i.data === wt) a.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = i.data.indexOf(b, l + 1)) !== -1; ) a.push({ type: 7, index: n }), l += b.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function M(r, t, e = r, s) {
  var o, h;
  if (t === N) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = k(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((h = i == null ? void 0 : i._$AO) == null || h.call(i, !1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = M(r, i._$AS(r, t.values), i, s)), t;
}
class zt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    A.currentNode = i;
    let n = A.nextNode(), o = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new I(n, n.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (c = new qt(n, this, t)), this._$AV.push(c), a = s[++h];
      }
      o !== (a == null ? void 0 : a.index) && (n = A.nextNode(), o++);
    }
    return A.currentNode = S, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class I {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = M(this, t, e), k(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== N && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = z.createElement(Ct(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const o = new zt(i, this), h = o.u(this.options);
      o.p(e), this.T(h), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = mt.get(t.strings);
    return e === void 0 && mt.set(t.strings, e = new z(t)), e;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new I(this.O(L()), this.O(L()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = dt(t).nextSibling;
      dt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = _;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = M(this, t, e, 0), o = !k(t) || t !== this._$AH && t !== N, o && (this._$AH = t);
    else {
      const h = t;
      let a, c;
      for (t = n[0], a = 0; a < n.length - 1; a++) c = M(this, h[s + a], e, a), c === N && (c = this._$AH[a]), o || (o = !k(c) || c !== this._$AH[a]), c === _ ? t = _ : t !== _ && (t += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Dt extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class It extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class jt extends F {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? _) === N) return;
    const s = this._$AH, i = t === _ && s !== _ || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== _ && (s === _ || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class qt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const K = R.litHtmlPolyfillSupport;
K == null || K(z, I), (R.litHtmlVersions ?? (R.litHtmlVersions = [])).push("3.3.2");
const Bt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new I(t.insertBefore(L(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
class P extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Bt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return N;
  }
}
var $t;
P._$litElement$ = !0, P.finalized = !0, ($t = C.litElementHydrateSupport) == null || $t.call(C, { LitElement: P });
const X = C.litElementPolyfillSupport;
X == null || X({ LitElement: P });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Vt = { attribute: !0, type: String, converter: Q, reflect: !1, hasChanged: et }, Qt = (r = Vt, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, r, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, r, h), h;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, r, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function it(r) {
  return (t, e) => typeof e == "object" ? Qt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function O(r) {
  return it({ ...r, state: !0, attribute: !1 });
}
var Wt = Object.defineProperty, v = (r, t, e, s) => {
  for (var i = void 0, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = o(t, e, i) || i);
  return i && Wt(t, e, i), i;
};
const ot = class ot extends P {
  constructor() {
    super(...arguments), this._activeTab = 0, this._showTabs = !1, this._sections = [], this._sectionNames = [], this._view = null, this._scrollSpyPaused = !1, this._handleMediaChange = (t) => {
      this._showTabs = t.matches, this._updateVisibility();
    }, this._tabsContainer = null;
  }
  static getStubConfig() {
    return {
      type: "custom:sections-to-tabs-card",
      mediaquery: "(max-width: 768px)",
      position: "top",
      align: "center",
      height: 58,
      show_labels: !0,
      show_all: !0,
      background_color: "var(--primary-background-color)",
      foreground_color: "var(--primary-color)"
    };
  }
  static getConfigElement() {
    return document.createElement("sections-to-tabs-editor");
  }
  setConfig(t) {
    console.log("sections-to-tabs: setConfig", t), this._config = t, this.requestUpdate();
  }
  getCardSize() {
    return 1;
  }
  connectedCallback() {
    super.connectedCallback(), this._waitForView();
  }
  async _waitForView() {
    const t = [100, 300, 500, 1e3, 2e3];
    for (const e of t)
      if (await new Promise((s) => setTimeout(s, e)), this._init(), this._view && this._sections.length > 0) {
        console.log("sections-to-tabs: initialized after", e, "ms");
        return;
      }
    console.log("sections-to-tabs: failed to initialize after all attempts");
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mediaQueryList && this._mediaQueryList.removeEventListener("change", this._handleMediaChange), this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = void 0), this._teardownScrollSpy(), this._resetSectionStyles(), this._tabsContainer && (this._tabsContainer.remove(), this._tabsContainer = null);
  }
  _init() {
    this._activeTab = 0, this._findSections(), this._debugDomTree(), this._setupMediaQuery(), this._updateVisibility();
  }
  _findSections() {
    var n, o, h, a, c, d;
    let t = this, e = 0;
    for (; t && e < 20; ) {
      if (console.log("sections-to-tabs: checking", t.tagName), ((n = t.tagName) == null ? void 0 : n.toLowerCase()) === "hui-sections-view") {
        this._view = t;
        break;
      }
      t = t.parentElement || ((o = t.getRootNode()) == null ? void 0 : o.host), e++;
    }
    if (console.log("sections-to-tabs: view found?", (h = this._view) == null ? void 0 : h.tagName), !this._view) return;
    let s = null;
    this._view.shadowRoot && (s = this._view.shadowRoot.querySelectorAll("hui-section"), console.log("sections-to-tabs: sections in shadowRoot", s.length)), (!s || s.length === 0) && (s = this._view.querySelectorAll("hui-section"), console.log("sections-to-tabs: sections direct", s.length)), this._sections = Array.from(s);
    const i = this._sections.map((l, u) => {
      const p = l.config, f = (p == null ? void 0 : p.title) || (p == null ? void 0 : p.name) || `Section ${u + 1}`;
      return console.log(`sections-to-tabs: section[${u}] config:`, JSON.stringify(p), "→ name:", f), f;
    });
    if ((c = (a = this._config) == null ? void 0 : a.tabs) != null && c.length) {
      const l = [], u = [], p = /* @__PURE__ */ new Set();
      for (const f of this._config.tabs) {
        const m = (d = f.section) == null ? void 0 : d.toLowerCase();
        if (!m) continue;
        const $ = i.findIndex(
          (j, E) => !p.has(E) && j.toLowerCase() === m
        );
        console.log(`sections-to-tabs: matching tab "${f.section}" → found at index ${$} (names: ${i.map((j) => `"${j}"`).join(", ")})`), $ !== -1 && (l.push(this._sections[$]), u.push(i[$]), p.add($));
      }
      this._sections.forEach((f, m) => {
        p.has(m) || (l.push(f), u.push(i[m]));
      }), this._sections = l, this._sectionNames = u;
    } else
      this._sectionNames = i;
    console.log("sections-to-tabs: found sections", this._sectionNames), this.requestUpdate();
  }
  _debugDomTree() {
    var i, n;
    if (!this._sections.length) return;
    const t = this._sections[0];
    console.log("sections-to-tabs: === DOM DEBUG ==="), console.log("sections-to-tabs: section tag:", t.tagName, "has shadowRoot:", !!t.shadowRoot);
    let e = t, s = 0;
    for (; e && s < 15; ) {
      const o = window.getComputedStyle(e);
      if (console.log(
        `sections-to-tabs: [${s}] <${e.tagName.toLowerCase()}> class="${e.className}"`,
        `| display: ${o.display}`,
        `| grid-template-columns: ${o.gridTemplateColumns}`,
        `| width: ${o.width}`,
        `| max-width: ${o.maxWidth}`,
        `| padding: ${o.paddingLeft} ${o.paddingRight}`,
        `| margin: ${o.marginLeft} ${o.marginRight}`,
        `| hasShadowRoot: ${!!e.shadowRoot}`
      ), e === this._view) {
        console.log("sections-to-tabs: ^^^ this is the view");
        break;
      }
      e = e.parentElement || ((i = e.getRootNode()) == null ? void 0 : i.host), s++;
    }
    (n = this._view) != null && n.shadowRoot && (console.log("sections-to-tabs: view shadowRoot children:"), this._view.shadowRoot.childNodes.forEach((o) => {
      o instanceof HTMLElement ? console.log(`  <${o.tagName.toLowerCase()}> class="${o.className}"`) : o instanceof HTMLStyleElement && console.log("  <style>");
    })), console.log("sections-to-tabs: === END DEBUG ===");
  }
  _setupMediaQuery() {
    var e;
    this._mediaQueryList && this._mediaQueryList.removeEventListener("change", this._handleMediaChange);
    const t = ((e = this._config) == null ? void 0 : e.mediaquery) || "(max-width: 768px)";
    this._mediaQueryList = window.matchMedia(t), this._mediaQueryList.addEventListener("change", this._handleMediaChange), this._showTabs = this._mediaQueryList.matches, console.log("sections-to-tabs: mediaquery", t, "matches:", this._showTabs), this.requestUpdate();
  }
  _resetSectionStyles() {
    this._sections.forEach((t) => {
      t.style.display = "";
      const e = t.parentElement;
      e && (e.style.display = "", e.style.gridColumn = "", e.style.scrollMarginTop = "", e.style.order = "");
    }), this._view && (this._view.style.paddingTop = "", this._view.style.paddingBottom = "");
  }
  _updateVisibility() {
    var e, s, i;
    if (!this._sections.length) return;
    const t = ((e = this._config) == null ? void 0 : e.show_all) !== !1;
    if (this._showTabs)
      if (t) {
        const n = ((s = this._config) == null ? void 0 : s.height) || 58, h = (((i = this._config) == null ? void 0 : i.position) || "top") === "top" ? 56 + n : 0;
        this._sections.forEach((a, c) => {
          a.style.display = "";
          const d = a.parentElement;
          d && (d.style.display = "", d.style.setProperty("grid-column", "1 / -1", "important"), d.style.scrollMarginTop = `${h}px`, d.style.order = `${c}`);
        }), this._setupScrollSpy();
      } else
        this._teardownScrollSpy(), this._sections.forEach((n, o) => {
          const h = n.parentElement;
          o === this._activeTab ? (n.style.display = "", h && (h.style.display = "", h.style.setProperty("grid-column", "1 / -1", "important"))) : (n.style.display = "none", h && (h.style.display = "none"));
        });
    else
      this._teardownScrollSpy(), this._resetSectionStyles();
  }
  _selectTab(t) {
    var s, i;
    if (this._activeTab = t, ((s = this._config) == null ? void 0 : s.show_all) !== !1 && this._showTabs) {
      this._scrollSpyPaused = !0;
      const n = (i = this._sections[t]) == null ? void 0 : i.parentElement;
      n && n.scrollIntoView({ behavior: "smooth" }), this._updateTabIndicator(), setTimeout(() => {
        this._scrollSpyPaused = !1;
      }, 800);
    } else
      this._updateVisibility();
  }
  _setupScrollSpy() {
    this._scrollHandler || (this._scrollHandler = () => {
      var n;
      if (this._scrollSpyPaused) return;
      const e = 56 + (((n = this._config) == null ? void 0 : n.height) || 58) + 20, s = this._sections.map((o, h) => {
        var a;
        return {
          index: h,
          top: ((a = o.parentElement) == null ? void 0 : a.getBoundingClientRect().top) ?? 1 / 0
        };
      }).sort((o, h) => o.top - h.top);
      let i = 0;
      for (const o of s)
        o.top <= e && (i = o.index);
      i !== this._activeTab && (this._activeTab = i, this._updateTabIndicator());
    }, window.addEventListener("scroll", this._scrollHandler, { passive: !0 }));
  }
  _teardownScrollSpy() {
    this._scrollHandler && (window.removeEventListener("scroll", this._scrollHandler), this._scrollHandler = void 0);
  }
  _updateTabIndicator() {
    var s;
    if (!this._tabsContainer) return;
    const t = ((s = this._config) == null ? void 0 : s.foreground_color) || "var(--primary-color)";
    this._tabsContainer.querySelectorAll("button").forEach((i, n) => {
      const o = n === this._activeTab;
      i.style.borderBottom = `2px solid ${o ? t : "transparent"}`, i.style.opacity = o ? "1" : "0.5";
    });
  }
  _getTabLabel(t) {
    var s, i, n;
    const e = ((s = this._config) == null ? void 0 : s.tabs) || [];
    return (i = e[t]) != null && i.title ? e[t].title : (n = e[t]) != null && n.section ? e[t].section : this._sectionNames[t] || `Tab ${t + 1}`;
  }
  _getTabIcon(t) {
    var s, i;
    return (i = (((s = this._config) == null ? void 0 : s.tabs) || [])[t]) == null ? void 0 : i.icon;
  }
  _createTabsContainer() {
    this._view && (this._tabsContainer && this._tabsContainer.isConnected || (document.querySelectorAll(".sections-to-tabs-bar").forEach((t) => t.remove()), this._tabsContainer = document.createElement("div"), this._tabsContainer.className = "sections-to-tabs-bar", document.body.appendChild(this._tabsContainer), this._view && !this._resizeObserver && (this._resizeObserver = new ResizeObserver(() => {
      this._showTabs && this._renderTabsToContainer();
    }), this._resizeObserver.observe(this._view)), console.log("sections-to-tabs: tabs container created")));
  }
  _renderTabsToContainer() {
    var l, u, p, f, m, $;
    if (!this._tabsContainer) return;
    const t = ((l = this._config) == null ? void 0 : l.position) || "top", e = ((u = this._config) == null ? void 0 : u.align) || "center", s = e === "left" ? "flex-start" : e === "right" ? "flex-end" : "center", i = ((p = this._config) == null ? void 0 : p.height) || 58, n = this._view ? this._view.getBoundingClientRect().left : 0, o = n > 0 ? 12 : 0, h = ((f = this._config) == null ? void 0 : f.background_color) || "var(--primary-background-color)", a = ((m = this._config) == null ? void 0 : m.foreground_color) || "var(--primary-color)";
    this._tabsContainer.setAttribute("style", `
      display: flex;
      gap: 0;
      padding: 0 8px 0 ${o}px;
      background: ${h};
      justify-content: ${s};
      width: calc(100% - ${n}px);
      box-sizing: border-box;
      height: ${i}px;
      align-items: center;
      ${t === "top" ? "border-bottom: 1px solid var(--divider-color);" : "border-top: 1px solid var(--divider-color);"}
      position: fixed;
      ${t === "top" ? "top: 56px;" : "bottom: 0;"}
      left: ${n}px;
      z-index: 2;
    `), this._tabsContainer.innerHTML = "";
    const c = (($ = this._config) == null ? void 0 : $.show_labels) !== !1, d = Math.round(c ? i * 0.33 : i * 0.42);
    this._view && (t === "top" ? (this._view.style.paddingTop = `${i}px`, this._view.style.paddingBottom = "") : (this._view.style.paddingBottom = `${i}px`, this._view.style.paddingTop = "")), this._sections.forEach((j, E) => {
      const x = document.createElement("button"), q = this._getTabIcon(E), J = this._getTabLabel(E), rt = E === this._activeTab;
      c ? x.innerHTML = `
          ${q ? `<ha-icon icon="${q}" style="--mdc-icon-size: ${d}px;"></ha-icon>` : ""}
          <span>${J}</span>
        ` : (x.innerHTML = q ? `<ha-icon icon="${q}" style="--mdc-icon-size: ${d}px;"></ha-icon>` : `<span>${J}</span>`, x.title = J), x.style.cssText = `
        padding: ${c ? "0 16px" : "0"};
        border: none;
        background: transparent;
        color: ${a};
        cursor: pointer;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-family: inherit;
        font-size: 14px;
        ${c ? "" : "width: 56px;"};
        height: 100%;
        box-sizing: border-box;
        border-bottom: 2px solid ${rt ? a : "transparent"};
        opacity: ${rt ? "1" : "0.5"};
        transition: opacity 0.2s, border-color 0.2s;
      `, x.onclick = () => this._selectTab(E), this._tabsContainer.appendChild(x);
    });
  }
  render() {
    return this._showTabs && this._sections.length > 0 ? (this._createTabsContainer(), this._renderTabsToContainer()) : this._tabsContainer && (this._tabsContainer.remove(), this._tabsContainer = null), V``;
  }
};
ot.styles = yt`
    :host {
      display: none !important;
    }
  `;
let g = ot;
v([
  it({ attribute: !1 })
], g.prototype, "hass");
v([
  O()
], g.prototype, "_config");
v([
  O()
], g.prototype, "_activeTab");
v([
  O()
], g.prototype, "_showTabs");
v([
  O()
], g.prototype, "_sections");
v([
  O()
], g.prototype, "_sectionNames");
customElements.define("sections-to-tabs-card", g);
const nt = class nt extends P {
  constructor() {
    super(...arguments), this._schema = [
      {
        name: "",
        type: "grid",
        schema: [
          { name: "mediaquery", selector: { text: {} } },
          { name: "position", selector: { select: { options: ["top", "bottom"] } } },
          { name: "align", selector: { select: { options: ["left", "center", "right"] } } },
          { name: "height", selector: { number: { min: 30, max: 120, step: 1, mode: "slider" } } }
        ]
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "show_labels", selector: { boolean: {} } },
          { name: "show_all", selector: { boolean: {} } }
        ]
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "background_color", selector: { text: {} } },
          { name: "foreground_color", selector: { text: {} } }
        ]
      }
    ], this._labels = {
      mediaquery: "Media Query",
      position: "Position",
      align: "Alignment",
      height: "Height (px)",
      show_labels: "Show Labels",
      show_all: "Show All Sections",
      background_color: "Background Color",
      foreground_color: "Foreground Color"
    };
  }
  setConfig(t) {
    this._config = t;
  }
  _fireChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: !0,
      composed: !0
    }));
  }
  _formChanged(t) {
    const e = { ...this._config, ...t.detail.value };
    this._config = e, this._fireChanged();
  }
  _addTab() {
    const t = [...this._config.tabs || [], { section: "", icon: "", title: "" }];
    this._config = { ...this._config, tabs: t }, this._fireChanged();
  }
  _removeTab(t) {
    const e = [...this._config.tabs || []];
    e.splice(t, 1), this._config = { ...this._config, tabs: e }, this._fireChanged();
  }
  _tabChanged(t, e, s) {
    const i = [...this._config.tabs || []];
    i[t] = { ...i[t], [e]: s }, this._config = { ...this._config, tabs: i }, this._fireChanged();
  }
  render() {
    if (!this._config) return V``;
    const t = this._config.tabs || [];
    return V`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${(e) => this._labels[e.name] || e.name}
        @value-changed=${this._formChanged}
      ></ha-form>

      <div class="tabs-header">
        <span>Tabs</span>
        <ha-icon-button @click=${this._addTab}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </ha-icon-button>
      </div>

      ${t.map((e, s) => V`
        <div class="tab-row">
          <ha-textfield
            label="Section"
            .value=${e.section || ""}
            @change=${(i) => this._tabChanged(s, "section", i.target.value)}
          ></ha-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="Icon"
            .value=${e.icon || ""}
            @value-changed=${(i) => this._tabChanged(s, "icon", i.detail.value)}
          ></ha-icon-picker>
          <ha-textfield
            label="Title"
            .value=${e.title || ""}
            @change=${(i) => this._tabChanged(s, "title", i.target.value)}
          ></ha-textfield>
          <ha-icon-button @click=${() => this._removeTab(s)}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        </div>
      `)}
    `;
  }
};
nt.styles = yt`
    .tabs-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0 4px;
      font-weight: 500;
      font-size: 14px;
      border-top: 1px solid var(--divider-color);
      margin-top: 12px;
    }
    .tab-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }
    .tab-row ha-textfield {
      flex: 1;
    }
    .tab-row ha-icon-picker {
      flex: 1;
    }
  `;
let D = nt;
v([
  it({ attribute: !1 })
], D.prototype, "hass");
v([
  O()
], D.prototype, "_config");
customElements.define("sections-to-tabs-editor", D);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "sections-to-tabs-card",
  name: "Sections to Tabs",
  description: "Converts sections to tabs on mobile"
});
console.info(
  "%c SECTIONS-TO-TABS %c v1.5.0 ",
  "color: white; background: #039be5; font-weight: bold;",
  "color: #039be5; background: white; font-weight: bold;"
);
