/*
  This is not mine, but a browsified version of debug (see https://www.npmjs.com/package/debug) snapshotted and browsified at version 4.3.1
  I found usage instructions a bit hard to follow, so here is the simple guide

  1.  Include a script tag in your index.html file <script src="/path/to/libs/debug.js" defer></script>
  2.  Manually set localStorage debug variable to the "DEBUG" environment variable described in the nodejs version
  2.  In you code in a module where you want to use debug
      const debug = require('debug')('debug:tag:for:this:module');
      use with debug('output',...args);

*/
require = function () { return function e(n, t, r) { function o(i, c) { if (!t[i]) { if (!n[i]) { var u = "function" == typeof require && require; if (!c && u) return u(i, !0); if (s) return s(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var f = t[i] = { exports: {} }; n[i][0].call(f.exports, function (e) { return o(n[i][1][e] || e) }, f, f.exports, e, n, t, r) } return t[i].exports } for (var s = "function" == typeof require && require, i = 0; i < r.length; i++)o(r[i]); return o } }()({ 1: [function (e, n, t) { var r, o, s = n.exports = {}; function i() { throw new Error("setTimeout has not been defined") } function c() { throw new Error("clearTimeout has not been defined") } function u(e) { if (r === setTimeout) return setTimeout(e, 0); if ((r === i || !r) && setTimeout) return r = setTimeout, setTimeout(e, 0); try { return r(e, 0) } catch (n) { try { return r.call(null, e, 0) } catch (n) { return r.call(this, e, 0) } } } !function () { try { r = "function" == typeof setTimeout ? setTimeout : i } catch (e) { r = i } try { o = "function" == typeof clearTimeout ? clearTimeout : c } catch (e) { o = c } }(); var a, f = [], l = !1, C = -1; function d() { l && a && (l = !1, a.length ? f = a.concat(f) : C = -1, f.length && m()) } function m() { if (!l) { var e = u(d); l = !0; for (var n = f.length; n;) { for (a = f, f = []; ++C < n;)a && a[C].run(); C = -1, n = f.length } a = null, l = !1, function (e) { if (o === clearTimeout) return clearTimeout(e); if ((o === c || !o) && clearTimeout) return o = clearTimeout, clearTimeout(e); try { o(e) } catch (n) { try { return o.call(null, e) } catch (n) { return o.call(this, e) } } }(e) } } function h(e, n) { this.fun = e, this.array = n } function p() { } s.nextTick = function (e) { var n = new Array(arguments.length - 1); if (arguments.length > 1) for (var t = 1; t < arguments.length; t++)n[t - 1] = arguments[t]; f.push(new h(e, n)), 1 !== f.length || l || u(m) }, h.prototype.run = function () { this.fun.apply(null, this.array) }, s.title = "browser", s.browser = !0, s.env = {}, s.argv = [], s.version = "", s.versions = {}, s.on = p, s.addListener = p, s.once = p, s.off = p, s.removeListener = p, s.removeAllListeners = p, s.emit = p, s.prependListener = p, s.prependOnceListener = p, s.listeners = function (e) { return [] }, s.binding = function (e) { throw new Error("process.binding is not supported") }, s.cwd = function () { return "/" }, s.chdir = function (e) { throw new Error("process.chdir is not supported") }, s.umask = function () { return 0 } }, {}], 2: [function (e, n, t) { var r = 1e3, o = 60 * r, s = 60 * o, i = 24 * s, c = 7 * i, u = 365.25 * i; function a(e, n, t, r) { var o = n >= 1.5 * t; return Math.round(e / t) + " " + r + (o ? "s" : "") } n.exports = function (e, n) { n = n || {}; var t = typeof e; if ("string" === t && e.length > 0) return function (e) { if ((e = String(e)).length > 100) return; var n = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e); if (!n) return; var t = parseFloat(n[1]); switch ((n[2] || "ms").toLowerCase()) { case "years": case "year": case "yrs": case "yr": case "y": return t * u; case "weeks": case "week": case "w": return t * c; case "days": case "day": case "d": return t * i; case "hours": case "hour": case "hrs": case "hr": case "h": return t * s; case "minutes": case "minute": case "mins": case "min": case "m": return t * o; case "seconds": case "second": case "secs": case "sec": case "s": return t * r; case "milliseconds": case "millisecond": case "msecs": case "msec": case "ms": return t; default: return } }(e); if ("number" === t && !1 === isNaN(e)) return n.long ? function (e) { var n = Math.abs(e); if (n >= i) return a(e, n, i, "day"); if (n >= s) return a(e, n, s, "hour"); if (n >= o) return a(e, n, o, "minute"); if (n >= r) return a(e, n, r, "second"); return e + " ms" }(e) : function (e) { var n = Math.abs(e); if (n >= i) return Math.round(e / i) + "d"; if (n >= s) return Math.round(e / s) + "h"; if (n >= o) return Math.round(e / o) + "m"; if (n >= r) return Math.round(e / r) + "s"; return e + "ms" }(e); throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e)) } }, {}], 3: [function (e, n, t) { n.exports = function (n) { function t(e) { let n = 0; for (let t = 0; t < e.length; t++)n = (n << 5) - n + e.charCodeAt(t), n |= 0; return r.colors[Math.abs(n) % r.colors.length] } function r(e) { let n; function i(...e) { if (!i.enabled) return; const t = i, o = Number(new Date), s = o - (n || o); t.diff = s, t.prev = n, t.curr = o, n = o, e[0] = r.coerce(e[0]), "string" != typeof e[0] && e.unshift("%O"); let c = 0; e[0] = e[0].replace(/%([a-zA-Z%])/g, (n, o) => { if ("%%" === n) return n; c++; const s = r.formatters[o]; if ("function" == typeof s) { const r = e[c]; n = s.call(t, r), e.splice(c, 1), c-- } return n }), r.formatArgs.call(t, e), (t.log || r.log).apply(t, e) } return i.namespace = e, i.enabled = r.enabled(e), i.useColors = r.useColors(), i.color = t(e), i.destroy = o, i.extend = s, "function" == typeof r.init && r.init(i), r.instances.push(i), i } function o() { const e = r.instances.indexOf(this); return -1 !== e && (r.instances.splice(e, 1), !0) } function s(e, n) { const t = r(this.namespace + (void 0 === n ? ":" : n) + e); return t.log = this.log, t } function i(e) { return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*") } return r.debug = r, r.default = r, r.coerce = function (e) { return e instanceof Error ? e.stack || e.message : e }, r.disable = function () { const e = [...r.names.map(i), ...r.skips.map(i).map(e => "-" + e)].join(","); return r.enable(""), e }, r.enable = function (e) { let n; r.save(e), r.names = [], r.skips = []; const t = ("string" == typeof e ? e : "").split(/[\s,]+/), o = t.length; for (n = 0; n < o; n++)t[n] && ("-" === (e = t[n].replace(/\*/g, ".*?"))[0] ? r.skips.push(new RegExp("^" + e.substr(1) + "$")) : r.names.push(new RegExp("^" + e + "$"))); for (n = 0; n < r.instances.length; n++) { const e = r.instances[n]; e.enabled = r.enabled(e.namespace) } }, r.enabled = function (e) { if ("*" === e[e.length - 1]) return !0; let n, t; for (n = 0, t = r.skips.length; n < t; n++)if (r.skips[n].test(e)) return !1; for (n = 0, t = r.names.length; n < t; n++)if (r.names[n].test(e)) return !0; return !1 }, r.humanize = e("ms"), Object.keys(n).forEach(e => { r[e] = n[e] }), r.instances = [], r.names = [], r.skips = [], r.formatters = {}, r.selectColor = t, r.enable(r.load()), r } }, { ms: 2 }], debug: [function (e, n, t) { (function (r) { t.log = function (...e) { return "object" == typeof console && console.log && console.log(...e) }, t.formatArgs = function (e) { if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + n.exports.humanize(this.diff), !this.useColors) return; const t = "color: " + this.color; e.splice(1, 0, t, "color: inherit"); let r = 0, o = 0; e[0].replace(/%[a-zA-Z%]/g, e => { "%%" !== e && (r++, "%c" === e && (o = r)) }), e.splice(o, 0, t) }, t.save = function (e) { try { e ? t.storage.setItem("debug", e) : t.storage.removeItem("debug") } catch (e) { } }, t.load = function () { let e; try { e = t.storage.getItem("debug") } catch (e) { } !e && void 0 !== r && "env" in r && (e = r.env.DEBUG); return e }, t.useColors = function () { if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs)) return !0; if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1; return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/) }, t.storage = function () { try { return localStorage } catch (e) { } }(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], n.exports = e("./common")(t); const { formatters: o } = n.exports; o.j = function (e) { try { return JSON.stringify(e) } catch (e) { return "[UnexpectedJSONParseError]: " + e.message } } }).call(this, e("_process")) }, { "./common": 3, _process: 1 }] }, {}, []);