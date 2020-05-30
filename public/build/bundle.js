<<<<<<< HEAD
var app=function(){"use strict";function t(){}const n=t=>t;function r(t){return t()}function o(){return Object.create(null)}function s(t){t.forEach(r)}function i(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function l(t,e,n){t.$$.on_destroy.push(c(e,n))}function u(t){return null==t?"":t}const p="undefined"!=typeof window;let h=p?()=>window.performance.now():()=>Date.now(),f=p?t=>requestAnimationFrame(t):t;const d=new Set;function m(t){d.forEach(e=>{e.c(t)||(d.delete(e),e.f())}),0!==d.size&&f(m)}function y(t){let e;return 0===d.size&&f(m),{promise:new Promise(n=>{d.add(e={c:t,f:n})}),abort(){d.delete(e)}}}function g(t,e){t.appendChild(e)}function v(t,e,n){t.insertBefore(e,n||null)}function b(t){t.parentNode.removeChild(t)}function w(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function C(t){return document.createElement(t)}function k(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function x(t){return document.createTextNode(t)}function P(){return x(" ")}function A(){return x("")}function B(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function S(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function E(t){return""===t?void 0:+t}function F(t,e){e=""+e,t.data!==e&&(t.data=e)}function $(t,e){(null!=e||t.value)&&(t.value=e)}function N(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}const T=new Set;let _,M=0;function R(t,e,n,r,o,s,i,a=0){const c=16.666/r;let l="{\n";for(let t=0;t<=1;t+=c){const r=e+(n-e)*s(t);l+=100*t+`%{${i(r,1-r)}}\n`}const u=l+`100% {${i(n,1-n)}}\n}`,p=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${a}`,h=t.ownerDocument;T.add(h);const f=h.__svelte_stylesheet||(h.__svelte_stylesheet=h.head.appendChild(C("style")).sheet),d=h.__svelte_rules||(h.__svelte_rules={});d[p]||(d[p]=!0,f.insertRule(`@keyframes ${p} ${u}`,f.cssRules.length));const m=t.style.animation||"";return t.style.animation=`${m?m+", ":""}${p} ${r}ms linear ${o}ms 1 both`,M+=1,p}function O(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),o=n.length-r.length;o&&(t.style.animation=r.join(", "),M-=o,M||f(()=>{M||(T.forEach(t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}}),T.clear())}))}function I(t){_=t}function j(){if(!_)throw new Error("Function called outside component initialization");return _}const q=[],D=[],U=[],L=[],H=Promise.resolve();let z=!1;function G(t){U.push(t)}let J=!1;const X=new Set;function W(){if(!J){J=!0;do{for(let t=0;t<q.length;t+=1){const e=q[t];I(e),Y(e.$$)}for(q.length=0;D.length;)D.pop()();for(let t=0;t<U.length;t+=1){const e=U[t];X.has(e)||(X.add(e),e())}U.length=0}while(q.length);for(;L.length;)L.pop()();z=!1,J=!1,X.clear()}}function Y(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(G)}}let V;function K(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const Z=new Set;let Q;function tt(){Q={r:0,c:[],p:Q}}function et(){Q.r||s(Q.c),Q=Q.p}function nt(t,e){t&&t.i&&(Z.delete(t),t.i(e))}function rt(t,e,n,r){if(t&&t.o){if(Z.has(t))return;Z.add(t),Q.c.push(()=>{Z.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const ot={duration:0};function st(e,r,o,a){let c=r(e,o),l=a?0:1,u=null,p=null,f=null;function d(){f&&O(e,f)}function m(t,e){const n=t.b-l;return e*=Math.abs(n),{a:l,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function g(r){const{delay:o=0,duration:i=300,easing:a=n,tick:g=t,css:v}=c||ot,b={start:h()+o,b:r};r||(b.group=Q,Q.r+=1),u?p=b:(v&&(d(),f=R(e,l,r,i,o,a,v)),r&&g(0,1),u=m(b,i),G(()=>K(e,r,"start")),y(t=>{if(p&&t>p.start&&(u=m(p,i),p=null,K(e,u.b,"start"),v&&(d(),f=R(e,l,u.b,u.duration,0,a,c.css))),u)if(t>=u.end)g(l=u.b,1-l),K(e,u.b,"end"),p||(u.b?d():--u.group.r||s(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;l=u.a+u.d*a(e/u.duration),g(l,1-l)}return!(!u&&!p)}))}return{run(t){i(c)?(V||(V=Promise.resolve(),V.then(()=>{V=null})),V).then(()=>{c=c(),g(t)}):g(t)},end(){d(),u=p=null}}}function it(t){t&&t.c()}function at(t,e,n){const{fragment:o,on_mount:a,on_destroy:c,after_update:l}=t.$$;o&&o.m(e,n),G(()=>{const e=a.map(r).filter(i);c?c.push(...e):s(e),t.$$.on_mount=[]}),l.forEach(G)}function ct(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function lt(t,e){-1===t.$$.dirty[0]&&(q.push(t),z||(z=!0,H.then(W)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ut(e,n,r,i,a,c,l=[-1]){const u=_;I(e);const p=n.props||{},h=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:l};let f=!1;if(h.ctx=r?r(e,p,(t,n,...r)=>{const o=r.length?r[0]:n;return h.ctx&&a(h.ctx[t],h.ctx[t]=o)&&(h.bound[t]&&h.bound[t](o),f&&lt(e,t)),n}):[],h.update(),f=!0,s(h.before_update),h.fragment=!!i&&i(h.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);h.fragment&&h.fragment.l(t),t.forEach(b)}else h.fragment&&h.fragment.c();n.intro&&nt(e.$$.fragment),at(e,n.target,n.anchor),W()}I(u)}class pt{$destroy(){ct(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const ht=[];function ft(e,n=t){let r;const o=[];function s(t){if(a(e,t)&&(e=t,r)){const t=!ht.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),ht.push(n,e)}if(t){for(let t=0;t<ht.length;t+=2)ht[t][0](ht[t+1]);ht.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(i,a=t){const c=[i,a];return o.push(c),1===o.length&&(r=n(s)||t),i(e),()=>{const t=o.indexOf(c);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}function dt(t,e){return t(e={exports:{}},e.exports),e.exports}var mt=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,yt=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],gt=function(t){var e=t,n=t.indexOf("["),r=t.indexOf("]");-1!=n&&-1!=r&&(t=t.substring(0,n)+t.substring(n,r).replace(/:/g,";")+t.substring(r,t.length));for(var o=mt.exec(t||""),s={},i=14;i--;)s[yt[i]]=o[i]||"";return-1!=n&&-1!=r&&(s.source=e,s.host=s.host.substring(1,s.host.length-1).replace(/;/g,":"),s.authority=s.authority.replace("[","").replace("]","").replace(/;/g,":"),s.ipv6uri=!0),s},vt=1e3,bt=6e4,wt=60*bt,Ct=24*wt,kt=function(t,e){e=e||{};var n=typeof t;if("string"===n&&t.length>0)return function(t){if((t=String(t)).length>100)return;var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(t);if(!e)return;var n=parseFloat(e[1]);switch((e[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*n;case"weeks":case"week":case"w":return 6048e5*n;case"days":case"day":case"d":return n*Ct;case"hours":case"hour":case"hrs":case"hr":case"h":return n*wt;case"minutes":case"minute":case"mins":case"min":case"m":return n*bt;case"seconds":case"second":case"secs":case"sec":case"s":return n*vt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}(t);if("number"===n&&isFinite(t))return e.long?function(t){var e=Math.abs(t);if(e>=Ct)return xt(t,e,Ct,"day");if(e>=wt)return xt(t,e,wt,"hour");if(e>=bt)return xt(t,e,bt,"minute");if(e>=vt)return xt(t,e,vt,"second");return t+" ms"}(t):function(t){var e=Math.abs(t);if(e>=Ct)return Math.round(t/Ct)+"d";if(e>=wt)return Math.round(t/wt)+"h";if(e>=bt)return Math.round(t/bt)+"m";if(e>=vt)return Math.round(t/vt)+"s";return t+"ms"}(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))};function xt(t,e,n,r){var o=e>=1.5*n;return Math.round(t/n)+" "+r+(o?"s":"")}var Pt=function(t){function e(t){let e=0;for(let n=0;n<t.length;n++)e=(e<<5)-e+t.charCodeAt(n),e|=0;return n.colors[Math.abs(e)%n.colors.length]}function n(t){let s;function i(...t){if(!i.enabled)return;const e=i,r=Number(new Date),o=r-(s||r);e.diff=o,e.prev=s,e.curr=r,s=r,t[0]=n.coerce(t[0]),"string"!=typeof t[0]&&t.unshift("%O");let a=0;t[0]=t[0].replace(/%([a-zA-Z%])/g,(r,o)=>{if("%%"===r)return r;a++;const s=n.formatters[o];if("function"==typeof s){const n=t[a];r=s.call(e,n),t.splice(a,1),a--}return r}),n.formatArgs.call(e,t);(e.log||n.log).apply(e,t)}return i.namespace=t,i.enabled=n.enabled(t),i.useColors=n.useColors(),i.color=e(t),i.destroy=r,i.extend=o,"function"==typeof n.init&&n.init(i),n.instances.push(i),i}function r(){const t=n.instances.indexOf(this);return-1!==t&&(n.instances.splice(t,1),!0)}function o(t,e){const r=n(this.namespace+(void 0===e?":":e)+t);return r.log=this.log,r}function s(t){return t.toString().substring(2,t.toString().length-2).replace(/\.\*\?$/,"*")}return n.debug=n,n.default=n,n.coerce=function(t){if(t instanceof Error)return t.stack||t.message;return t},n.disable=function(){const t=[...n.names.map(s),...n.skips.map(s).map(t=>"-"+t)].join(",");return n.enable(""),t},n.enable=function(t){let e;n.save(t),n.names=[],n.skips=[];const r=("string"==typeof t?t:"").split(/[\s,]+/),o=r.length;for(e=0;e<o;e++)r[e]&&("-"===(t=r[e].replace(/\*/g,".*?"))[0]?n.skips.push(new RegExp("^"+t.substr(1)+"$")):n.names.push(new RegExp("^"+t+"$")));for(e=0;e<n.instances.length;e++){const t=n.instances[e];t.enabled=n.enabled(t.namespace)}},n.enabled=function(t){if("*"===t[t.length-1])return!0;let e,r;for(e=0,r=n.skips.length;e<r;e++)if(n.skips[e].test(t))return!1;for(e=0,r=n.names.length;e<r;e++)if(n.names[e].test(t))return!0;return!1},n.humanize=kt,Object.keys(t).forEach(e=>{n[e]=t[e]}),n.instances=[],n.names=[],n.skips=[],n.formatters={},n.selectColor=e,n.enable(n.load()),n},At=dt((function(t,e){e.log=function(...t){return"object"==typeof console&&console.log&&console.log(...t)},e.formatArgs=function(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+t.exports.humanize(this.diff),!this.useColors)return;const n="color: "+this.color;e.splice(1,0,n,"color: inherit");let r=0,o=0;e[0].replace(/%[a-zA-Z%]/g,t=>{"%%"!==t&&(r++,"%c"===t&&(o=r))}),e.splice(o,0,n)},e.save=function(t){try{t?e.storage.setItem("debug",t):e.storage.removeItem("debug")}catch(t){}},e.load=function(){let t;try{t=e.storage.getItem("debug")}catch(t){}!t&&"undefined"!=typeof process&&"env"in process&&(t=process.env.DEBUG);return t},e.useColors=function(){if("undefined"!=typeof window&&window.process&&("renderer"===window.process.type||window.process.__nwjs))return!0;if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},e.storage=function(){try{return localStorage}catch(t){}}(),e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],t.exports=Pt(e);const{formatters:n}=t.exports;n.j=function(t){try{return JSON.stringify(t)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}})),Bt=(At.log,At.formatArgs,At.save,At.load,At.useColors,At.storage,At.colors,At("socket.io-client:url")),St=function(t,e){var n=t;e=e||"undefined"!=typeof location&&location,null==t&&(t=e.protocol+"//"+e.host);"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?e.protocol+t:e.host+t),/^(https?|wss?):\/\//.test(t)||(Bt("protocol-less url %s",t),t=void 0!==e?e.protocol+"//"+t:"https://"+t),Bt("parse %s",t),n=gt(t));n.port||(/^(http|ws)$/.test(n.protocol)?n.port="80":/^(http|ws)s$/.test(n.protocol)&&(n.port="443"));n.path=n.path||"/";var r=-1!==n.host.indexOf(":")?"["+n.host+"]":n.host;return n.id=n.protocol+"://"+r+":"+n.port,n.href=n.protocol+"://"+r+(e&&e.port===n.port?"":":"+n.port),n};var Et=36e5,Ft=24*Et,$t=function(t,e){e=e||{};var n=typeof t;if("string"===n&&t.length>0)return function(t){if((t=String(t)).length>100)return;var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(!e)return;var n=parseFloat(e[1]);switch((e[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*n;case"days":case"day":case"d":return n*Ft;case"hours":case"hour":case"hrs":case"hr":case"h":return n*Et;case"minutes":case"minute":case"mins":case"min":case"m":return 6e4*n;case"seconds":case"second":case"secs":case"sec":case"s":return 1e3*n;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}(t);if("number"===n&&!1===isNaN(t))return e.long?function(t){return Nt(t,Ft,"day")||Nt(t,Et,"hour")||Nt(t,6e4,"minute")||Nt(t,1e3,"second")||t+" ms"}(t):function(t){if(t>=Ft)return Math.round(t/Ft)+"d";if(t>=Et)return Math.round(t/Et)+"h";if(t>=6e4)return Math.round(t/6e4)+"m";if(t>=1e3)return Math.round(t/1e3)+"s";return t+"ms"}(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))};function Nt(t,e,n){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}var Tt=dt((function(t,e){function n(t){var n;function o(){if(o.enabled){var t=o,r=+new Date,s=r-(n||r);t.diff=s,t.prev=n,t.curr=r,n=r;for(var i=new Array(arguments.length),a=0;a<i.length;a++)i[a]=arguments[a];i[0]=e.coerce(i[0]),"string"!=typeof i[0]&&i.unshift("%O");var c=0;i[0]=i[0].replace(/%([a-zA-Z%])/g,(function(n,r){if("%%"===n)return n;c++;var o=e.formatters[r];if("function"==typeof o){var s=i[c];n=o.call(t,s),i.splice(c,1),c--}return n})),e.formatArgs.call(t,i);var l=o.log||e.log||console.log.bind(console);l.apply(t,i)}}return o.namespace=t,o.enabled=e.enabled(t),o.useColors=e.useColors(),o.color=function(t){var n,r=0;for(n in t)r=(r<<5)-r+t.charCodeAt(n),r|=0;return e.colors[Math.abs(r)%e.colors.length]}(t),o.destroy=r,"function"==typeof e.init&&e.init(o),e.instances.push(o),o}function r(){var t=e.instances.indexOf(this);return-1!==t&&(e.instances.splice(t,1),!0)}(e=t.exports=n.debug=n.default=n).coerce=function(t){return t instanceof Error?t.stack||t.message:t},e.disable=function(){e.enable("")},e.enable=function(t){var n;e.save(t),e.names=[],e.skips=[];var r=("string"==typeof t?t:"").split(/[\s,]+/),o=r.length;for(n=0;n<o;n++)r[n]&&("-"===(t=r[n].replace(/\*/g,".*?"))[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")));for(n=0;n<e.instances.length;n++){var s=e.instances[n];s.enabled=e.enabled(s.namespace)}},e.enabled=function(t){if("*"===t[t.length-1])return!0;var n,r;for(n=0,r=e.skips.length;n<r;n++)if(e.skips[n].test(t))return!1;for(n=0,r=e.names.length;n<r;n++)if(e.names[n].test(t))return!0;return!1},e.humanize=$t,e.instances=[],e.names=[],e.skips=[],e.formatters={}})),_t=(Tt.coerce,Tt.disable,Tt.enable,Tt.enabled,Tt.humanize,Tt.instances,Tt.names,Tt.skips,Tt.formatters,dt((function(t,e){function n(){var t;try{t=e.storage.debug}catch(t){}return!t&&"undefined"!=typeof process&&"env"in process&&(t=process.env.DEBUG),t}(e=t.exports=Tt).log=function(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)},e.formatArgs=function(t){var n=this.useColors;if(t[0]=(n?"%c":"")+this.namespace+(n?" %c":" ")+t[0]+(n?"%c ":" ")+"+"+e.humanize(this.diff),!n)return;var r="color: "+this.color;t.splice(1,0,r,"color: inherit");var o=0,s=0;t[0].replace(/%[a-zA-Z%]/g,(function(t){"%%"!==t&&(o++,"%c"===t&&(s=o))})),t.splice(s,0,r)},e.save=function(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(t){}},e.load=n,e.useColors=function(){if("undefined"!=typeof window&&window.process&&"renderer"===window.process.type)return!0;if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},e.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:function(){try{return window.localStorage}catch(t){}}(),e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}},e.enable(n())}))),Mt=(_t.log,_t.formatArgs,_t.save,_t.load,_t.useColors,_t.storage,_t.colors,dt((function(t){function e(t){if(t)return function(t){for(var n in e.prototype)t[n]=e.prototype[n];return t}(t)}t.exports=e,e.prototype.on=e.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},e.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},e.prototype.off=e.prototype.removeListener=e.prototype.removeAllListeners=e.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n,r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var o=0;o<r.length;o++)if((n=r[o])===e||n.fn===e){r.splice(o,1);break}return this},e.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n)for(var r=0,o=(n=n.slice(0)).length;r<o;++r)n[r].apply(this,e);return this},e.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},e.prototype.hasListeners=function(t){return!!this.listeners(t).length}}))),Rt={}.toString,Ot=Array.isArray||function(t){return"[object Array]"==Rt.call(t)},It=function(t){return jt&&Buffer.isBuffer(t)||qt&&(t instanceof ArrayBuffer||function(t){return"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer}(t))},jt="function"==typeof Buffer&&"function"==typeof Buffer.isBuffer,qt="function"==typeof ArrayBuffer;var Dt=Object.prototype.toString,Ut="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===Dt.call(Blob),Lt="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===Dt.call(File);var Ht=function(t){var e=[],n=t.data,r=t;return r.data=function t(e,n){if(!e)return e;if(It(e)){var r={_placeholder:!0,num:n.length};return n.push(e),r}if(Ot(e)){for(var o=new Array(e.length),s=0;s<e.length;s++)o[s]=t(e[s],n);return o}if("object"==typeof e&&!(e instanceof Date)){o={};for(var i in e)o[i]=t(e[i],n);return o}return e}(n,e),r.attachments=e.length,{packet:r,buffers:e}},zt=function(t,e){return t.data=function t(e,n){if(!e)return e;if(e&&e._placeholder)return n[e.num];if(Ot(e))for(var r=0;r<e.length;r++)e[r]=t(e[r],n);else if("object"==typeof e)for(var o in e)e[o]=t(e[o],n);return e}(t.data,e),t.attachments=void 0,t},Gt=function(t,e){var n=0,r=t;!function t(o,s,i){if(!o)return o;if(Ut&&o instanceof Blob||Lt&&o instanceof File){n++;var a=new FileReader;a.onload=function(){i?i[s]=this.result:r=this.result,--n||e(r)},a.readAsArrayBuffer(o)}else if(Ot(o))for(var c=0;c<o.length;c++)t(o[c],c,o);else if("object"==typeof o&&!It(o))for(var l in o)t(o[l],l,o)}(r),n||e(r)},Jt=dt((function(t,e){var n=_t("socket.io-parser");function r(){}e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=r,e.Decoder=i;var o=e.ERROR+'"encode error"';function s(t){var r=""+t.type;if(e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(r+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(r+=t.nsp+","),null!=t.id&&(r+=t.id),null!=t.data){var s=function(t){try{return JSON.stringify(t)}catch(t){return!1}}(t.data);if(!1===s)return o;r+=s}return n("encoded %j as %s",t,r),r}function i(){this.reconstructor=null}function a(t){this.reconPack=t,this.buffers=[]}function c(t){return{type:e.ERROR,data:"parser error: "+t}}r.prototype.encode=function(t,r){(n("encoding packet %j",t),e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)?function(t,e){Gt(t,(function(t){var n=Ht(t),r=s(n.packet),o=n.buffers;o.unshift(r),e(o)}))}(t,r):r([s(t)])},Mt(i.prototype),i.prototype.add=function(t){var r;if("string"==typeof t)r=function(t){var r=0,o={type:Number(t.charAt(0))};if(null==e.types[o.type])return c("unknown packet type "+o.type);if(e.BINARY_EVENT===o.type||e.BINARY_ACK===o.type){for(var s="";"-"!==t.charAt(++r)&&(s+=t.charAt(r),r!=t.length););if(s!=Number(s)||"-"!==t.charAt(r))throw new Error("Illegal attachments");o.attachments=Number(s)}if("/"===t.charAt(r+1))for(o.nsp="";++r;){if(","===(a=t.charAt(r)))break;if(o.nsp+=a,r===t.length)break}else o.nsp="/";var i=t.charAt(r+1);if(""!==i&&Number(i)==i){for(o.id="";++r;){var a;if(null==(a=t.charAt(r))||Number(a)!=a){--r;break}if(o.id+=t.charAt(r),r===t.length)break}o.id=Number(o.id)}if(t.charAt(++r)){var l=function(t){try{return JSON.parse(t)}catch(t){return!1}}(t.substr(r));if(!(!1!==l&&(o.type===e.ERROR||Ot(l))))return c("invalid payload");o.data=l}return n("decoded %s as %j",t,o),o}(t),e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type?(this.reconstructor=new a(r),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",r)):this.emit("decoded",r);else{if(!It(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");(r=this.reconstructor.takeBinaryData(t))&&(this.reconstructor=null,this.emit("decoded",r))}},i.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},a.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=zt(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},a.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}})),Xt=(Jt.protocol,Jt.types,Jt.CONNECT,Jt.DISCONNECT,Jt.EVENT,Jt.ACK,Jt.ERROR,Jt.BINARY_EVENT,Jt.BINARY_ACK,Jt.Encoder,Jt.Decoder,dt((function(t){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(e){t.exports=!1}}))),Wt="undefined"!=typeof self?self:"undefined"!=typeof window?window:Function("return this")(),Yt=function(t){var e=t.xdomain,n=t.xscheme,r=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!e||Xt))return new XMLHttpRequest}catch(t){}try{if("undefined"!=typeof XDomainRequest&&!n&&r)return new XDomainRequest}catch(t){}if(!e)try{return new(Wt[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(t){}},Vt=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty;for(var r in t)n.call(t,r)&&e.push(r);return e},Kt=Object.prototype.toString,Zt="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===Kt.call(Blob),Qt="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===Kt.call(File),te=function t(e){if(!e||"object"!=typeof e)return!1;if(Ot(e)){for(var n=0,r=e.length;n<r;n++)if(t(e[n]))return!0;return!1}if("function"==typeof Buffer&&Buffer.isBuffer&&Buffer.isBuffer(e)||"function"==typeof ArrayBuffer&&e instanceof ArrayBuffer||Zt&&e instanceof Blob||Qt&&e instanceof File)return!0;if(e.toJSON&&"function"==typeof e.toJSON&&1===arguments.length)return t(e.toJSON(),!0);for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)&&t(e[o]))return!0;return!1};var ee=function(t,e,n){var r=t.byteLength;if(e=e||0,n=n||r,t.slice)return t.slice(e,n);if(e<0&&(e+=r),n<0&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0);for(var o=new Uint8Array(t),s=new Uint8Array(n-e),i=e,a=0;i<n;i++,a++)s[a]=o[i];return s.buffer},ne=function(t,e,n){var r=!1;return n=n||re,o.count=t,0===t?e():o;function o(t,s){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(r=!0,e(t),e=n):0!==o.count||r||e(null,s)}};function re(){}
/*! https://mths.be/utf8js v2.1.2 by @mathias */var oe,se,ie,ae=String.fromCharCode;function ce(t){for(var e,n,r=[],o=0,s=t.length;o<s;)(e=t.charCodeAt(o++))>=55296&&e<=56319&&o<s?56320==(64512&(n=t.charCodeAt(o++)))?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--):r.push(e);return r}function le(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function ue(t,e){return ae(t>>e&63|128)}function pe(t,e){if(0==(4294967168&t))return ae(t);var n="";return 0==(4294965248&t)?n=ae(t>>6&31|192):0==(4294901760&t)?(le(t,e)||(t=65533),n=ae(t>>12&15|224),n+=ue(t,6)):0==(4292870144&t)&&(n=ae(t>>18&7|240),n+=ue(t,12),n+=ue(t,6)),n+=ae(63&t|128)}function he(){if(ie>=se)throw Error("Invalid byte index");var t=255&oe[ie];if(ie++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function fe(t){var e,n;if(ie>se)throw Error("Invalid byte index");if(ie==se)return!1;if(e=255&oe[ie],ie++,0==(128&e))return e;if(192==(224&e)){if((n=(31&e)<<6|he())>=128)return n;throw Error("Invalid continuation byte")}if(224==(240&e)){if((n=(15&e)<<12|he()<<6|he())>=2048)return le(n,t)?n:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(n=(7&e)<<18|he()<<12|he()<<6|he())>=65536&&n<=1114111)return n;throw Error("Invalid UTF-8 detected")}var de={version:"2.1.2",encode:function(t,e){for(var n=!1!==(e=e||{}).strict,r=ce(t),o=r.length,s=-1,i="";++s<o;)i+=pe(r[s],n);return i},decode:function(t,e){var n=!1!==(e=e||{}).strict;oe=ce(t),se=oe.length,ie=0;for(var r,o=[];!1!==(r=fe(n));)o.push(r);return function(t){for(var e,n=t.length,r=-1,o="";++r<n;)(e=t[r])>65535&&(o+=ae((e-=65536)>>>10&1023|55296),e=56320|1023&e),o+=ae(e);return o}(o)}},me=dt((function(t,e){!function(){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=new Uint8Array(256),r=0;r<t.length;r++)n[t.charCodeAt(r)]=r;e.encode=function(e){var n,r=new Uint8Array(e),o=r.length,s="";for(n=0;n<o;n+=3)s+=t[r[n]>>2],s+=t[(3&r[n])<<4|r[n+1]>>4],s+=t[(15&r[n+1])<<2|r[n+2]>>6],s+=t[63&r[n+2]];return o%3==2?s=s.substring(0,s.length-1)+"=":o%3==1&&(s=s.substring(0,s.length-2)+"=="),s},e.decode=function(t){var e,r,o,s,i,a=.75*t.length,c=t.length,l=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var u=new ArrayBuffer(a),p=new Uint8Array(u);for(e=0;e<c;e+=4)r=n[t.charCodeAt(e)],o=n[t.charCodeAt(e+1)],s=n[t.charCodeAt(e+2)],i=n[t.charCodeAt(e+3)],p[l++]=r<<2|o>>4,p[l++]=(15&o)<<4|s>>2,p[l++]=(3&s)<<6|63&i;return u}}()})),ye=(me.encode,me.decode,void 0!==ye?ye:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder&&MozBlobBuilder),ge=function(){try{return 2===new Blob(["hi"]).size}catch(t){return!1}}(),ve=ge&&function(){try{return 2===new Blob([new Uint8Array([1,2])]).size}catch(t){return!1}}(),be=ye&&ye.prototype.append&&ye.prototype.getBlob;function we(t){return t.map((function(t){if(t.buffer instanceof ArrayBuffer){var e=t.buffer;if(t.byteLength!==e.byteLength){var n=new Uint8Array(t.byteLength);n.set(new Uint8Array(e,t.byteOffset,t.byteLength)),e=n.buffer}return e}return t}))}function Ce(t,e){e=e||{};var n=new ye;return we(t).forEach((function(t){n.append(t)})),e.type?n.getBlob(e.type):n.getBlob()}function ke(t,e){return new Blob(we(t),e||{})}"undefined"!=typeof Blob&&(Ce.prototype=Blob.prototype,ke.prototype=Blob.prototype);var xe=ge?ve?Blob:ke:be?Ce:void 0,Pe=dt((function(t,e){var n;"undefined"!=typeof ArrayBuffer&&(n=me);var r="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),o="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),s=r||o;e.protocol=3;var i=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},a=Vt(i),c={type:"error",data:"parser error"};function l(t,e,n){for(var r=new Array(t.length),o=ne(t.length,n),s=function(t,n,o){e(n,(function(e,n){r[t]=n,o(e,r)}))},i=0;i<t.length;i++)s(i,t[i],o)}e.encodePacket=function(t,n,r,o){"function"==typeof n&&(o=n,n=!1),"function"==typeof r&&(o=r,r=null);var a=void 0===t.data?void 0:t.data.buffer||t.data;if("undefined"!=typeof ArrayBuffer&&a instanceof ArrayBuffer)return function(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=t.data,s=new Uint8Array(o),a=new Uint8Array(1+o.byteLength);a[0]=i[t.type];for(var c=0;c<s.length;c++)a[c+1]=s[c];return r(a.buffer)}(t,n,o);if(void 0!==xe&&a instanceof xe)return function(t,n,r){if(!n)return e.encodeBase64Packet(t,r);if(s)return function(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=new FileReader;return o.onload=function(){e.encodePacket({type:t.type,data:o.result},n,!0,r)},o.readAsArrayBuffer(t.data)}(t,n,r);var o=new Uint8Array(1);o[0]=i[t.type];var a=new xe([o.buffer,t.data]);return r(a)}(t,n,o);if(a&&a.base64)return function(t,n){var r="b"+e.packets[t.type]+t.data.data;return n(r)}(t,o);var c=i[t.type];return void 0!==t.data&&(c+=r?de.encode(String(t.data),{strict:!1}):String(t.data)),o(""+c)},e.encodeBase64Packet=function(t,n){var r,o="b"+e.packets[t.type];if(void 0!==xe&&t.data instanceof xe){var s=new FileReader;return s.onload=function(){var t=s.result.split(",")[1];n(o+t)},s.readAsDataURL(t.data)}try{r=String.fromCharCode.apply(null,new Uint8Array(t.data))}catch(e){for(var i=new Uint8Array(t.data),a=new Array(i.length),c=0;c<i.length;c++)a[c]=i[c];r=String.fromCharCode.apply(null,a)}return o+=btoa(r),n(o)},e.decodePacket=function(t,n,r){if(void 0===t)return c;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),n);if(r&&!1===(t=function(t){try{t=de.decode(t,{strict:!1})}catch(t){return!1}return t}(t)))return c;var o=t.charAt(0);return Number(o)==o&&a[o]?t.length>1?{type:a[o],data:t.substring(1)}:{type:a[o]}:c}o=new Uint8Array(t)[0];var s=ee(t,1);return xe&&"blob"===n&&(s=new xe([s])),{type:a[o],data:s}},e.decodeBase64Packet=function(t,e){var r=a[t.charAt(0)];if(!n)return{type:r,data:{base64:!0,data:t.substr(1)}};var o=n.decode(t.substr(1));return"blob"===e&&xe&&(o=new xe([o])),{type:r,data:o}},e.encodePayload=function(t,n,r){"function"==typeof n&&(r=n,n=null);var o=te(t);if(n&&o)return xe&&!s?e.encodePayloadAsBlob(t,r):e.encodePayloadAsArrayBuffer(t,r);if(!t.length)return r("0:");l(t,(function(t,r){e.encodePacket(t,!!o&&n,!1,(function(t){r(null,function(t){return t.length+":"+t}(t))}))}),(function(t,e){return r(e.join(""))}))},e.decodePayload=function(t,n,r){if("string"!=typeof t)return e.decodePayloadAsBinary(t,n,r);var o;if("function"==typeof n&&(r=n,n=null),""===t)return r(c,0,1);for(var s,i,a="",l=0,u=t.length;l<u;l++){var p=t.charAt(l);if(":"===p){if(""===a||a!=(s=Number(a)))return r(c,0,1);if(a!=(i=t.substr(l+1,s)).length)return r(c,0,1);if(i.length){if(o=e.decodePacket(i,n,!1),c.type===o.type&&c.data===o.data)return r(c,0,1);if(!1===r(o,l+s,u))return}l+=s,a=""}else a+=p}return""!==a?r(c,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,n){if(!t.length)return n(new ArrayBuffer(0));l(t,(function(t,n){e.encodePacket(t,!0,!0,(function(t){return n(null,t)}))}),(function(t,e){var r=e.reduce((function(t,e){var n;return t+(n="string"==typeof e?e.length:e.byteLength).toString().length+n+2}),0),o=new Uint8Array(r),s=0;return e.forEach((function(t){var e="string"==typeof t,n=t;if(e){for(var r=new Uint8Array(t.length),i=0;i<t.length;i++)r[i]=t.charCodeAt(i);n=r.buffer}o[s++]=e?0:1;var a=n.byteLength.toString();for(i=0;i<a.length;i++)o[s++]=parseInt(a[i]);o[s++]=255;for(r=new Uint8Array(n),i=0;i<r.length;i++)o[s++]=r[i]})),n(o.buffer)}))},e.encodePayloadAsBlob=function(t,n){l(t,(function(t,n){e.encodePacket(t,!0,!0,(function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o);t=r.buffer,e[0]=0}var s=(t instanceof ArrayBuffer?t.byteLength:t.size).toString(),i=new Uint8Array(s.length+1);for(o=0;o<s.length;o++)i[o]=parseInt(s[o]);if(i[s.length]=255,xe){var a=new xe([e.buffer,i.buffer,t]);n(null,a)}}))}),(function(t,e){return n(new xe(e))}))},e.decodePayloadAsBinary=function(t,n,r){"function"==typeof n&&(r=n,n=null);for(var o=t,s=[];o.byteLength>0;){for(var i=new Uint8Array(o),a=0===i[0],l="",u=1;255!==i[u];u++){if(l.length>310)return r(c,0,1);l+=i[u]}o=ee(o,2+l.length),l=parseInt(l);var p=ee(o,0,l);if(a)try{p=String.fromCharCode.apply(null,new Uint8Array(p))}catch(t){var h=new Uint8Array(p);p="";for(u=0;u<h.length;u++)p+=String.fromCharCode(h[u])}s.push(p),o=ee(o,l)}var f=s.length;s.forEach((function(t,o){r(e.decodePacket(t,n,!0),o,f)}))}})),Ae=(Pe.protocol,Pe.packets,Pe.encodePacket,Pe.encodeBase64Packet,Pe.decodePacket,Pe.decodeBase64Packet,Pe.encodePayload,Pe.decodePayload,Pe.encodePayloadAsArrayBuffer,Pe.encodePayloadAsBlob,Pe.decodePayloadAsBinary,dt((function(t){function e(t){if(t)return function(t){for(var n in e.prototype)t[n]=e.prototype[n];return t}(t)}t.exports=e,e.prototype.on=e.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},e.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},e.prototype.off=e.prototype.removeListener=e.prototype.removeAllListeners=e.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n,r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var o=0;o<r.length;o++)if((n=r[o])===e||n.fn===e){r.splice(o,1);break}return 0===r.length&&delete this._callbacks["$"+t],this},e.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),n=this._callbacks["$"+t],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(n){r=0;for(var o=(n=n.slice(0)).length;r<o;++r)n[r].apply(this,e)}return this},e.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},e.prototype.hasListeners=function(t){return!!this.listeners(t).length}}))),Be=Se;function Se(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.withCredentials=t.withCredentials,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.isReactNative=t.isReactNative,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}Ae(Se.prototype),Se.prototype.onError=function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this},Se.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},Se.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},Se.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},Se.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},Se.prototype.onData=function(t){var e=Pe.decodePacket(t,this.socket.binaryType);this.onPacket(e)},Se.prototype.onPacket=function(t){this.emit("packet",t)},Se.prototype.onClose=function(){this.readyState="closed",this.emit("close")};var Ee,Fe=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},$e=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;r<o;r++){var s=n[r].split("=");e[decodeURIComponent(s[0])]=decodeURIComponent(s[1])}return e},Ne=function(t,e){var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t},Te="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),_e={},Me=0,Re=0;function Oe(t){var e="";do{e=Te[t%64]+e,t=Math.floor(t/64)}while(t>0);return e}function Ie(){var t=Oe(+new Date);return t!==Ee?(Me=0,Ee=t):t+"."+Oe(Me++)}for(;Re<64;Re++)_e[Te[Re]]=Re;Ie.encode=Oe,Ie.decode=function(t){var e=0;for(Re=0;Re<t.length;Re++)e=64*e+_e[t.charAt(Re)];return e};var je=Ie,qe=At("engine.io-client:polling"),De=Le,Ue=null!=new Yt({xdomain:!1}).responseType;function Le(t){var e=t&&t.forceBase64;Ue&&!e||(this.supportsBinary=!1),Be.call(this,t)}Ne(Le,Be),Le.prototype.name="polling",Le.prototype.doOpen=function(){this.poll()},Le.prototype.pause=function(t){var e=this;function n(){qe("paused"),e.readyState="paused",t()}if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(qe("we are currently polling - waiting to pause"),r++,this.once("pollComplete",(function(){qe("pre-pause polling complete"),--r||n()}))),this.writable||(qe("we are currently writing - waiting to pause"),r++,this.once("drain",(function(){qe("pre-pause writing complete"),--r||n()})))}else n()},Le.prototype.poll=function(){qe("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},Le.prototype.onData=function(t){var e=this;qe("polling got data %s",t);Pe.decodePayload(t,this.socket.binaryType,(function(t,n,r){if("opening"===e.readyState&&e.onOpen(),"close"===t.type)return e.onClose(),!1;e.onPacket(t)})),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState?this.poll():qe('ignoring poll - transport state "%s"',this.readyState))},Le.prototype.doClose=function(){var t=this;function e(){qe("writing close packet"),t.write([{type:"close"}])}"open"===this.readyState?(qe("transport open - closing"),e()):(qe("transport not open - deferring close"),this.once("open",e))},Le.prototype.write=function(t){var e=this;this.writable=!1;var n=function(){e.writable=!0,e.emit("drain")};Pe.encodePayload(t,this.supportsBinary,(function(t){e.doWrite(t,n)}))},Le.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n="";return!1!==this.timestampRequests&&(t[this.timestampParam]=je()),this.supportsBinary||t.sid||(t.b64=1),t=Fe(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(n=":"+this.port),t.length&&(t="?"+t),e+"://"+(-1!==this.hostname.indexOf(":")?"["+this.hostname+"]":this.hostname)+n+this.path+t};var He=At("engine.io-client:polling-xhr"),ze=Xe,Ge=We;function Je(){}function Xe(t){if(De.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,"undefined"!=typeof location){var e="https:"===location.protocol,n=location.port;n||(n=e?443:80),this.xd="undefined"!=typeof location&&t.hostname!==location.hostname||n!==t.port,this.xs=t.secure!==e}}function We(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.withCredentials=t.withCredentials,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}if(Ne(Xe,De),Xe.prototype.supportsBinary=!0,Xe.prototype.request=function(t){return(t=t||{}).uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.withCredentials=this.withCredentials,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new We(t)},Xe.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this;r.on("success",e),r.on("error",(function(t){o.onError("xhr post error",t)})),this.sendXhr=r},Xe.prototype.doPoll=function(){He("xhr poll");var t=this.request(),e=this;t.on("data",(function(t){e.onData(t)})),t.on("error",(function(t){e.onError("xhr poll error",t)})),this.pollXhr=t},Ae(We.prototype),We.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var e=this.xhr=new Yt(t),n=this;try{He("xhr open %s: %s",this.method,this.uri),e.open(this.method,this.uri,this.async);try{if(this.extraHeaders)for(var r in e.setDisableHeaderCheck&&e.setDisableHeaderCheck(!0),this.extraHeaders)this.extraHeaders.hasOwnProperty(r)&&e.setRequestHeader(r,this.extraHeaders[r])}catch(t){}if("POST"===this.method)try{this.isBinary?e.setRequestHeader("Content-type","application/octet-stream"):e.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(t){}try{e.setRequestHeader("Accept","*/*")}catch(t){}"withCredentials"in e&&(e.withCredentials=this.withCredentials),this.requestTimeout&&(e.timeout=this.requestTimeout),this.hasXDR()?(e.onload=function(){n.onLoad()},e.onerror=function(){n.onError(e.responseText)}):e.onreadystatechange=function(){if(2===e.readyState)try{var t=e.getResponseHeader("Content-Type");(n.supportsBinary&&"application/octet-stream"===t||"application/octet-stream; charset=UTF-8"===t)&&(e.responseType="arraybuffer")}catch(t){}4===e.readyState&&(200===e.status||1223===e.status?n.onLoad():setTimeout((function(){n.onError("number"==typeof e.status?e.status:0)}),0))},He("xhr data %s",this.data),e.send(this.data)}catch(t){return void setTimeout((function(){n.onError(t)}),0)}"undefined"!=typeof document&&(this.index=We.requestsCount++,We.requests[this.index]=this)},We.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},We.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},We.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},We.prototype.cleanup=function(t){if(void 0!==this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=Je:this.xhr.onreadystatechange=Je,t)try{this.xhr.abort()}catch(t){}"undefined"!=typeof document&&delete We.requests[this.index],this.xhr=null}},We.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(t){}t=("application/octet-stream"===e||"application/octet-stream; charset=UTF-8"===e)&&this.xhr.response||this.xhr.responseText}catch(t){this.onError(t)}null!=t&&this.onData(t)},We.prototype.hasXDR=function(){return"undefined"!=typeof XDomainRequest&&!this.xs&&this.enablesXDR},We.prototype.abort=function(){this.cleanup()},We.requestsCount=0,We.requests={},"undefined"!=typeof document)if("function"==typeof attachEvent)attachEvent("onunload",Ye);else if("function"==typeof addEventListener){addEventListener("onpagehide"in Wt?"pagehide":"unload",Ye,!1)}function Ye(){for(var t in We.requests)We.requests.hasOwnProperty(t)&&We.requests[t].abort()}ze.Request=Ge;var Ve,Ke=en,Ze=/\n/g,Qe=/\\n/g;function tn(){}function en(t){De.call(this,t),this.query=this.query||{},Ve||(Ve=Wt.___eio=Wt.___eio||[]),this.index=Ve.length;var e=this;Ve.push((function(t){e.onData(t)})),this.query.j=this.index,"function"==typeof addEventListener&&addEventListener("beforeunload",(function(){e.script&&(e.script.onerror=tn)}),!1)}Ne(en,De),en.prototype.supportsBinary=!1,en.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),De.prototype.doClose.call(this)},en.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n?n.parentNode.insertBefore(e,n):(document.head||document.body).appendChild(e),this.script=e,"undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent)&&setTimeout((function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)}),100)},en.prototype.doWrite=function(t,e){var n=this;if(!this.form){var r,o=document.createElement("form"),s=document.createElement("textarea"),i=this.iframeId="eio_iframe_"+this.index;o.className="socketio",o.style.position="absolute",o.style.top="-1000px",o.style.left="-1000px",o.target=i,o.method="POST",o.setAttribute("accept-charset","utf-8"),s.name="d",o.appendChild(s),document.body.appendChild(o),this.form=o,this.area=s}function a(){c(),e()}function c(){if(n.iframe)try{n.form.removeChild(n.iframe)}catch(t){n.onError("jsonp polling iframe removal error",t)}try{var t='<iframe src="javascript:0" name="'+n.iframeId+'">';r=document.createElement(t)}catch(t){(r=document.createElement("iframe")).name=n.iframeId,r.src="javascript:0"}r.id=n.iframeId,n.form.appendChild(r),n.iframe=r}this.form.action=this.uri(),c(),t=t.replace(Qe,"\\\n"),this.area.value=t.replace(Ze,"\\n");try{this.form.submit()}catch(t){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===n.iframe.readyState&&a()}:this.iframe.onload=a};var nn,rn,on,sn=(nn=Object.freeze({__proto__:null,default:{}}))&&nn.default||nn,an=At("engine.io-client:websocket");if("undefined"!=typeof WebSocket?rn=WebSocket:"undefined"!=typeof self&&(rn=self.WebSocket||self.MozWebSocket),"undefined"==typeof window)try{on=sn}catch(t){}var cn=rn||on,ln=un;function un(t){t&&t.forceBase64&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=rn&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(cn=on),Be.call(this,t)}Ne(un,Be),un.prototype.name="websocket",un.prototype.supportsBinary=!0,un.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,n={agent:this.agent,perMessageDeflate:this.perMessageDeflate};n.pfx=this.pfx,n.key=this.key,n.passphrase=this.passphrase,n.cert=this.cert,n.ca=this.ca,n.ciphers=this.ciphers,n.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(n.headers=this.extraHeaders),this.localAddress&&(n.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket&&!this.isReactNative?e?new cn(t,e):new cn(t):new cn(t,e,n)}catch(t){return this.emit("error",t)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},un.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},un.prototype.write=function(t){var e=this;this.writable=!1;for(var n=t.length,r=0,o=n;r<o;r++)!function(t){Pe.encodePacket(t,e.supportsBinary,(function(r){if(!e.usingBrowserWebSocket){var o={};if(t.options&&(o.compress=t.options.compress),e.perMessageDeflate)("string"==typeof r?Buffer.byteLength(r):r.length)<e.perMessageDeflate.threshold&&(o.compress=!1)}try{e.usingBrowserWebSocket?e.ws.send(r):e.ws.send(r,o)}catch(t){an("websocket closed before onclose event")}--n||s()}))}(t[r]);function s(){e.emit("flush"),setTimeout((function(){e.writable=!0,e.emit("drain")}),0)}},un.prototype.onClose=function(){Be.prototype.onClose.call(this)},un.prototype.doClose=function(){void 0!==this.ws&&this.ws.close()},un.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n="";return this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=je()),this.supportsBinary||(t.b64=1),(t=Fe(t)).length&&(t="?"+t),e+"://"+(-1!==this.hostname.indexOf(":")?"["+this.hostname+"]":this.hostname)+n+this.path+t},un.prototype.check=function(){return!(!cn||"__initialize"in cn&&this.name===un.prototype.name)};var pn={polling:function(t){var e=!1,n=!1,r=!1!==t.jsonp;if("undefined"!=typeof location){var o="https:"===location.protocol,s=location.port;s||(s=o?443:80),e=t.hostname!==location.hostname||s!==t.port,n=t.secure!==o}if(t.xdomain=e,t.xscheme=n,"open"in new Yt(t)&&!t.forceJSONP)return new ze(t);if(!r)throw new Error("JSONP disabled");return new Ke(t)},websocket:ln},hn=[].indexOf,fn=function(t,e){if(hn)return t.indexOf(e);for(var n=0;n<t.length;++n)if(t[n]===e)return n;return-1},dn=At("engine.io-client:socket"),mn=yn;function yn(t,e){if(!(this instanceof yn))return new yn(t,e);e=e||{},t&&"object"==typeof t&&(e=t,t=null),t?(t=gt(t),e.hostname=t.host,e.secure="https"===t.protocol||"wss"===t.protocol,e.port=t.port,t.query&&(e.query=t.query)):e.host&&(e.hostname=gt(e.host).host),this.secure=null!=e.secure?e.secure:"undefined"!=typeof location&&"https:"===location.protocol,e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.agent=e.agent||!1,this.hostname=e.hostname||("undefined"!=typeof location?location.hostname:"localhost"),this.port=e.port||("undefined"!=typeof location&&location.port?location.port:this.secure?443:80),this.query=e.query||{},"string"==typeof this.query&&(this.query=$e(this.query)),this.upgrade=!1!==e.upgrade,this.path=(e.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!e.forceJSONP,this.jsonp=!1!==e.jsonp,this.forceBase64=!!e.forceBase64,this.enablesXDR=!!e.enablesXDR,this.withCredentials=!1!==e.withCredentials,this.timestampParam=e.timestampParam||"t",this.timestampRequests=e.timestampRequests,this.transports=e.transports||["polling","websocket"],this.transportOptions=e.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=e.policyPort||843,this.rememberUpgrade=e.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=e.onlyBinaryUpgrades,this.perMessageDeflate=!1!==e.perMessageDeflate&&(e.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=e.pfx||null,this.key=e.key||null,this.passphrase=e.passphrase||null,this.cert=e.cert||null,this.ca=e.ca||null,this.ciphers=e.ciphers||null,this.rejectUnauthorized=void 0===e.rejectUnauthorized||e.rejectUnauthorized,this.forceNode=!!e.forceNode,this.isReactNative="undefined"!=typeof navigator&&"string"==typeof navigator.product&&"reactnative"===navigator.product.toLowerCase(),("undefined"==typeof self||this.isReactNative)&&(e.extraHeaders&&Object.keys(e.extraHeaders).length>0&&(this.extraHeaders=e.extraHeaders),e.localAddress&&(this.localAddress=e.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open()}yn.priorWebsocketSuccess=!1,Ae(yn.prototype),yn.protocol=Pe.protocol,yn.Socket=yn,yn.Transport=Be,yn.transports=pn,yn.parser=Pe,yn.prototype.createTransport=function(t){dn('creating transport "%s"',t);var e=function(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}(this.query);e.EIO=Pe.protocol,e.transport=t;var n=this.transportOptions[t]||{};return this.id&&(e.sid=this.id),new pn[t]({query:e,socket:this,agent:n.agent||this.agent,hostname:n.hostname||this.hostname,port:n.port||this.port,secure:n.secure||this.secure,path:n.path||this.path,forceJSONP:n.forceJSONP||this.forceJSONP,jsonp:n.jsonp||this.jsonp,forceBase64:n.forceBase64||this.forceBase64,enablesXDR:n.enablesXDR||this.enablesXDR,withCredentials:n.withCredentials||this.withCredentials,timestampRequests:n.timestampRequests||this.timestampRequests,timestampParam:n.timestampParam||this.timestampParam,policyPort:n.policyPort||this.policyPort,pfx:n.pfx||this.pfx,key:n.key||this.key,passphrase:n.passphrase||this.passphrase,cert:n.cert||this.cert,ca:n.ca||this.ca,ciphers:n.ciphers||this.ciphers,rejectUnauthorized:n.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:n.perMessageDeflate||this.perMessageDeflate,extraHeaders:n.extraHeaders||this.extraHeaders,forceNode:n.forceNode||this.forceNode,localAddress:n.localAddress||this.localAddress,requestTimeout:n.requestTimeout||this.requestTimeout,protocols:n.protocols||void 0,isReactNative:this.isReactNative})},yn.prototype.open=function(){var t;if(this.rememberUpgrade&&yn.priorWebsocketSuccess&&-1!==this.transports.indexOf("websocket"))t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout((function(){e.emit("error","No transports available")}),0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(t){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},yn.prototype.setTransport=function(t){dn("setting transport %s",t.name);var e=this;this.transport&&(dn("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",(function(){e.onDrain()})).on("packet",(function(t){e.onPacket(t)})).on("error",(function(t){e.onError(t)})).on("close",(function(){e.onClose("transport close")}))},yn.prototype.probe=function(t){dn('probing transport "%s"',t);var e=this.createTransport(t,{probe:1}),n=!1,r=this;function o(){if(r.onlyBinaryUpgrades){var o=!this.supportsBinary&&r.transport.supportsBinary;n=n||o}n||(dn('probe transport "%s" opened',t),e.send([{type:"ping",data:"probe"}]),e.once("packet",(function(o){if(!n)if("pong"===o.type&&"probe"===o.data){if(dn('probe transport "%s" pong',t),r.upgrading=!0,r.emit("upgrading",e),!e)return;yn.priorWebsocketSuccess="websocket"===e.name,dn('pausing current transport "%s"',r.transport.name),r.transport.pause((function(){n||"closed"!==r.readyState&&(dn("changing transport and sending upgrade packet"),u(),r.setTransport(e),e.send([{type:"upgrade"}]),r.emit("upgrade",e),e=null,r.upgrading=!1,r.flush())}))}else{dn('probe transport "%s" failed',t);var s=new Error("probe error");s.transport=e.name,r.emit("upgradeError",s)}})))}function s(){n||(n=!0,u(),e.close(),e=null)}function i(n){var o=new Error("probe error: "+n);o.transport=e.name,s(),dn('probe transport "%s" failed because of error: %s',t,n),r.emit("upgradeError",o)}function a(){i("transport closed")}function c(){i("socket closed")}function l(t){e&&t.name!==e.name&&(dn('"%s" works - aborting "%s"',t.name,e.name),s())}function u(){e.removeListener("open",o),e.removeListener("error",i),e.removeListener("close",a),r.removeListener("close",c),r.removeListener("upgrading",l)}yn.priorWebsocketSuccess=!1,e.once("open",o),e.once("error",i),e.once("close",a),this.once("close",c),this.once("upgrading",l),e.open()},yn.prototype.onOpen=function(){if(dn("socket open"),this.readyState="open",yn.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause){dn("starting upgrade probes");for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])}},yn.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(dn('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else dn('packet received with socket readyState "%s"',this.readyState)},yn.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},yn.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout((function(){"closed"!==e.readyState&&e.onClose("ping timeout")}),t||e.pingInterval+e.pingTimeout)},yn.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout((function(){dn("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)}),t.pingInterval)},yn.prototype.ping=function(){var t=this;this.sendPacket("ping",(function(){t.emit("ping")}))},yn.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},yn.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(dn("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},yn.prototype.write=yn.prototype.send=function(t,e,n){return this.sendPacket("message",t,e,n),this},yn.prototype.sendPacket=function(t,e,n,r){if("function"==typeof e&&(r=e,e=void 0),"function"==typeof n&&(r=n,n=null),"closing"!==this.readyState&&"closed"!==this.readyState){(n=n||{}).compress=!1!==n.compress;var o={type:t,data:e,options:n};this.emit("packetCreate",o),this.writeBuffer.push(o),r&&this.once("flush",r),this.flush()}},yn.prototype.close=function(){if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var t=this;this.writeBuffer.length?this.once("drain",(function(){this.upgrading?r():e()})):this.upgrading?r():e()}function e(){t.onClose("forced close"),dn("socket closing - telling transport to close"),t.transport.close()}function n(){t.removeListener("upgrade",n),t.removeListener("upgradeError",n),e()}function r(){t.once("upgrade",n),t.once("upgradeError",n)}return this},yn.prototype.onError=function(t){dn("socket error %j",t),yn.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},yn.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){dn('socket close with reason: "%s"',t);clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),this.writeBuffer=[],this.prevBufferLen=0}},yn.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;n<r;n++)~fn(this.transports,t[n])&&e.push(t[n]);return e};var gn=mn,vn=Pe;gn.parser=vn;var bn=function(t,e){for(var n=[],r=(e=e||0)||0;r<t.length;r++)n[r-e]=t[r];return n};var wn=function(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}};var Cn=[].slice,kn=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var n=Cn.call(arguments,2);return function(){return e.apply(t,n.concat(Cn.call(arguments)))}},xn=dt((function(t,e){var n=At("socket.io-client:socket");t.exports=s;var r={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},o=Mt.prototype.emit;function s(t,e,n){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},n&&n.query&&(this.query=n.query),this.io.autoConnect&&this.open()}Mt(s.prototype),s.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[wn(t,"open",kn(this,"onopen")),wn(t,"packet",kn(this,"onpacket")),wn(t,"close",kn(this,"onclose"))]}},s.prototype.open=s.prototype.connect=function(){return this.connected||(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting")),this},s.prototype.send=function(){var t=bn(arguments);return t.unshift("message"),this.emit.apply(this,t),this},s.prototype.emit=function(t){if(r.hasOwnProperty(t))return o.apply(this,arguments),this;var e=bn(arguments),s={type:(void 0!==this.flags.binary?this.flags.binary:te(e))?Jt.BINARY_EVENT:Jt.EVENT,data:e,options:{}};return s.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(n("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),s.id=this.ids++),this.connected?this.packet(s):this.sendBuffer.push(s),this.flags={},this},s.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},s.prototype.onopen=function(){if(n("transport is open - connecting"),"/"!==this.nsp)if(this.query){var t="object"==typeof this.query?Fe(this.query):this.query;n("sending connect packet with query %s",t),this.packet({type:Jt.CONNECT,query:t})}else this.packet({type:Jt.CONNECT})},s.prototype.onclose=function(t){n("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},s.prototype.onpacket=function(t){var e=t.nsp===this.nsp,n=t.type===Jt.ERROR&&"/"===t.nsp;if(e||n)switch(t.type){case Jt.CONNECT:this.onconnect();break;case Jt.EVENT:case Jt.BINARY_EVENT:this.onevent(t);break;case Jt.ACK:case Jt.BINARY_ACK:this.onack(t);break;case Jt.DISCONNECT:this.ondisconnect();break;case Jt.ERROR:this.emit("error",t.data)}},s.prototype.onevent=function(t){var e=t.data||[];n("emitting event %j",e),null!=t.id&&(n("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?o.apply(this,e):this.receiveBuffer.push(e)},s.prototype.ack=function(t){var e=this,r=!1;return function(){if(!r){r=!0;var o=bn(arguments);n("sending ack %j",o),e.packet({type:te(o)?Jt.BINARY_ACK:Jt.ACK,id:t,data:o})}}},s.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(n("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):n("bad ack %s",t.id)},s.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},s.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)o.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},s.prototype.ondisconnect=function(){n("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},s.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},s.prototype.close=s.prototype.disconnect=function(){return this.connected&&(n("performing disconnect (%s)",this.nsp),this.packet({type:Jt.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},s.prototype.compress=function(t){return this.flags.compress=t,this},s.prototype.binary=function(t){return this.flags.binary=t,this}})),Pn=An;function An(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}An.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},An.prototype.reset=function(){this.attempts=0},An.prototype.setMin=function(t){this.ms=t},An.prototype.setMax=function(t){this.max=t},An.prototype.setJitter=function(t){this.jitter=t};var Bn=At("socket.io-client:manager"),Sn=Object.prototype.hasOwnProperty,En=Fn;function Fn(t,e){if(!(this instanceof Fn))return new Fn(t,e);t&&"object"==typeof t&&(e=t,t=void 0),(e=e||{}).path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(!1!==e.reconnection),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new Pn({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var n=e.parser||Jt;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this.autoConnect=!1!==e.autoConnect,this.autoConnect&&this.open()}Fn.prototype.emitAll=function(){for(var t in this.emit.apply(this,arguments),this.nsps)Sn.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},Fn.prototype.updateSocketIds=function(){for(var t in this.nsps)Sn.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},Fn.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},Mt(Fn.prototype),Fn.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},Fn.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},Fn.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},Fn.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},Fn.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},Fn.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},Fn.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},Fn.prototype.open=Fn.prototype.connect=function(t,e){if(Bn("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;Bn("opening %s",this.uri),this.engine=gn(this.uri,this.opts);var n=this.engine,r=this;this.readyState="opening",this.skipReconnect=!1;var o=wn(n,"open",(function(){r.onopen(),t&&t()})),s=wn(n,"error",(function(e){if(Bn("connect_error"),r.cleanup(),r.readyState="closed",r.emitAll("connect_error",e),t){var n=new Error("Connection error");n.data=e,t(n)}else r.maybeReconnectOnOpen()}));if(!1!==this._timeout){var i=this._timeout;Bn("connect attempt will timeout after %d",i);var a=setTimeout((function(){Bn("connect attempt timed out after %d",i),o.destroy(),n.close(),n.emit("error","timeout"),r.emitAll("connect_timeout",i)}),i);this.subs.push({destroy:function(){clearTimeout(a)}})}return this.subs.push(o),this.subs.push(s),this},Fn.prototype.onopen=function(){Bn("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(wn(t,"data",kn(this,"ondata"))),this.subs.push(wn(t,"ping",kn(this,"onping"))),this.subs.push(wn(t,"pong",kn(this,"onpong"))),this.subs.push(wn(t,"error",kn(this,"onerror"))),this.subs.push(wn(t,"close",kn(this,"onclose"))),this.subs.push(wn(this.decoder,"decoded",kn(this,"ondecoded")))},Fn.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},Fn.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},Fn.prototype.ondata=function(t){this.decoder.add(t)},Fn.prototype.ondecoded=function(t){this.emit("packet",t)},Fn.prototype.onerror=function(t){Bn("error",t),this.emitAll("error",t)},Fn.prototype.socket=function(t,e){var n=this.nsps[t];if(!n){n=new xn(this,t,e),this.nsps[t]=n;var r=this;n.on("connecting",o),n.on("connect",(function(){n.id=r.generateId(t)})),this.autoConnect&&o()}function o(){~fn(r.connecting,n)||r.connecting.push(n)}return n},Fn.prototype.destroy=function(t){var e=fn(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},Fn.prototype.packet=function(t){Bn("writing packet %j",t);var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,(function(n){for(var r=0;r<n.length;r++)e.engine.write(n[r],t.options);e.encoding=!1,e.processPacketQueue()})))},Fn.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},Fn.prototype.cleanup=function(){Bn("cleanup");for(var t=this.subs.length,e=0;e<t;e++){this.subs.shift().destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},Fn.prototype.close=Fn.prototype.disconnect=function(){Bn("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},Fn.prototype.onclose=function(t){Bn("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},Fn.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)Bn("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();Bn("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout((function(){t.skipReconnect||(Bn("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open((function(e){e?(Bn("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(Bn("reconnect success"),t.onreconnect())})))}),e);this.subs.push({destroy:function(){clearTimeout(n)}})}},Fn.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)};var $n=dt((function(t,e){var n=At("socket.io-client");t.exports=e=o;var r=e.managers={};function o(t,e){"object"==typeof t&&(e=t,t=void 0),e=e||{};var o,s=St(t),i=s.source,a=s.id,c=s.path,l=r[a]&&c in r[a].nsps;return e.forceNew||e["force new connection"]||!1===e.multiplex||l?(n("ignoring socket cache for %s",i),o=En(i,e)):(r[a]||(n("new io instance for %s",i),r[a]=En(i,e)),o=r[a]),s.query&&!e.query&&(e.query=s.query),o.socket(s.path,e)}e.protocol=Jt.protocol,e.connect=o,e.Manager=En,e.Socket=xn}));$n.managers,$n.protocol,$n.connect,$n.Manager,$n.Socket;class Nn{constructor(t,e,n){this.xPos=t,this.yPos=e,this.isEmpty="E"==n}}class Tn{constructor(t,e,n,r,o){this.id=r,this.positon=new Nn(t,e,n),this.side=n,this.stack=null!=o?o:1}getPosition(){return this.positon}setPosition(t,e){this.positon=new Nn(t,e,null)}incrementStack(){this.stack=2}}class _n{constructor(t,e){if(null!=t||e){if(null!=t&&null==e){let e,n;for(this.board=[],e=0;e<8;e++)for(this.board[e]=[],n=0;n<8;n++)null!=t[e][n]?this.board[e][n]=new Tn(e,n,t[e][n].side,t[e][n].id,t[e][n].stack):this.board[e][n]=null}else if(null==t&&e){this.board=[];let t,e,n=23;for(t=0;t<8;t++)for(this.board[t]=[],e=0;e<8;e++){let r=t%2!=0&&e%2!=0;t%2==0&&e%2==0||r||3==t||4==t?this.board[t][e]=null:(this.board[t][e]=new Tn(t,e,0<=t&&t<=2?"red":"black",n,null),n--)}}}else{this.board=[];let t,e,n=0;for(t=0;t<8;t++)for(this.board[t]=[],e=0;e<8;e++){let r=t%2!=0&&e%2!=0;t%2==0&&e%2==0||r||3==t||4==t?this.board[t][e]=null:(this.board[t][e]=new Tn(t,e,0<=t&&t<=2?"black":"red",n,null),n++)}}}saveBoardState(){let t,e,n=[];for(t=0;t<8;t++)for(n[t]=[],e=0;e<8;e++)null!=this.board[t][e]?(n[t][e]={},n[t][e].stack=this.board[t][e].stack,n[t][e].side=this.board[t][e].side,n[t][e].id=this.board[t][e].id):n[t][e]=null;return n}takePiece(t,e,n,r){let o=!1,s=null,i=null;return r.xPos<e.xPos&&r.yPos<e.yPos&&(s=e.xPos-1,i=e.yPos-1,null!=this.board[s][i]&&this.board[s][i].side!=t.side&&(this.board[s][i]=null,o=!0)),r.xPos<e.xPos&&r.yPos>e.yPos&&(s=e.xPos-1,i=e.yPos+1,null!=this.board[s][i]&&this.board[s][i].side!=t.side&&(this.board[s][i]=null,o=!0)),r.xPos>e.xPos&&r.yPos<e.yPos&&(s=e.xPos+1,i=e.yPos-1,null!=this.board[s][i]&&this.board[s][i].side!=t.side&&(this.board[s][i]=null,o=!0)),r.xPos>e.xPos&&r.yPos>e.yPos&&(s=e.xPos+1,i=e.yPos+1,null!=this.board[s][i]&&this.board[s][i].side!=t.side&&(this.board[s][i]=null,o=!0)),o}isMoveLegal(t,e){let n,r,o;Rn.update(t=>(n=t.name,t)),Un.update(t=>(r=t.pri,o=t.sec,t));let s=!1,i=t.getPosition();if(console.log(e.isEmpty),console.log("red: "+t.side=="red"),console.log("black: "+t.side=="black"),"red"==t.side&&e.isEmpty&&n==r){console.log(i.xPos+", "+i.yPos+" --\x3e "+e.xPos+", "+e.yPos);let n=i.xPos-e.xPos,r=i.yPos-e.yPos;if(1==t.stack){(1==r||-1==r)&&1==n&&(s=!0),!(2!=n&&-2!=n||2!=r&&-2!=r)&&this.takePiece(t,i,r,e)&&(s=!0)}else{!(1!=n&&-1!=n||1!=r&&-1!=r)&&(s=!0),!(2!=n&&-2!=n||2!=r&&-2!=r)&&this.takePiece(t,i,r,e)&&(s=!0)}}if("black"==t.side&&e.isEmpty&&n==o){let n=i.xPos-e.xPos,r=i.yPos-e.yPos;if(1==t.stack){(1==r||-1==r)&&1==n&&(s=!0),!(2!=n&&-2!=n||2!=r&&-2!=r)&&this.takePiece(t,i,r,e)&&(s=!0)}else{!(1!=n&&-1!=n||1!=r&&-1!=r)&&(s=!0),!(2!=n&&-2!=n||2!=r&&-2!=r)&&this.takePiece(t,i,r,e)&&(s=!0)}}return s}doMove(t,e){let n,r,o;Rn.update(t=>(n=t.name,t)),Un.update(t=>(r=t.pri,o=t.sec,t));let s=!1,i=null;if(this.isMoveLegal(t,e)){i=this.scanBoard(t,e);let a=new Tn(e.xPos,e.yPos,t.side,t.id,t.stack);n==r&&0==e.xPos&&"red"==a.side&&1==a.stack&&a.incrementStack(),n==o&&0==e.xPos&&"black"==a.side&&1==a.stack&&a.incrementStack(),this.board[e.xPos][e.yPos]=a;let c=t.getPosition();this.board[c.xPos][c.yPos]=null,s=!0}return{move:s,id:i}}scanBoard(t,e){let n,r,o=null;for(n=0;n<8;n++)for(r=0;r<8;r++)if(null!=this.board[n][r]&&this.board[n][r].id!=t.id&&this.board[n][r].side==t.side&&this.checkPiece(this.board[n][r],t,e)){o=t.id;break}return o}checkPiece(t,e,n){let r=!1,o=(n.xPos,n.yPos,t.getPosition().xPos),s=t.getPosition().yPos;return 0<=o-2&&0<=s-2&&o-2<=7&&s-2<=7&&null!=this.board[o-1][s-1]&&this.board[o-1][s-1].side!=e.side&&null==this.board[o-2][s-2]&&(this.board[o][s]=null,r=!0),0<=o+2&&0<=s+2&&o+2<=7&&s+2<=7&&0==r&&null!=this.board[o+1][s+1]&&this.board[o+1][s+1].side!=e.side&&null==this.board[o+2][s+2]&&(this.board[o][s]=null,r=!0),0<=o-2&&0<=s+2&&o-2<=7&&s+2<=7&&0==r&&null!=this.board[o-1][s+1]&&this.board[o-1][s+1].side!=e.side&&null==this.board[o-2][s+2]&&(this.board[o][s]=null,r=!0),0<=o+2&&0<=s-2&&o+2<=7&&s-2<=7&&0==r&&null!=this.board[o+1][s-1]&&this.board[o+1][s-1].side!=e.side&&null==this.board[o+2][s-2]&&(this.board[o][s]=null,r=!0),r}removePiece(t){let e=t.getPosition().xPos,n=t.getPosition().yPos;this.board[e][n]=null}otherPlayerMove(t,e,n){let r,o,s;Rn.update(t=>(r=t.name,t)),Un.update(t=>(o=t.pri,s=t.sec,t));let i=t.getPosition().xPos,a=t.getPosition().yPos,c=i+e,l=a+n,u=new Tn(c,l,t.side,t.id,t.stack);r==o&&0==c&&"red"==u.side&&1==u.stack&&u.incrementStack(),r==s&&0==c&&"black"==u.side&&1==u.stack&&u.incrementStack(),this.board[c][l]=u,2==e&&2==n&&(c=i+e/2,l=a+n/2,this.board[c][l]=null),this.board[i][a]=null}isEmpty(t,e){return null==this.board[t][e]}getId(t,e){return this.board[t][e].id}getSide(t,e){return this.board[t][e].side}getPiece(t,e){if(null!=this.board[t][e])return this.board[t][e]}getPieceFromId(t){let e,n,r;for(e=0;e<8;e++)for(n=0;n<8;n++)if(null!=this.board[e][n]&&this.board[e][n].id==t){r=this.board[e][n];break}return r}getBoard(){return this.board}}window.onload=async function(){if(null!=sessionStorage.getItem("idx")){const t=await JSON.parse(sessionStorage.getItem("idx"));await Rn.set(t.user),await qn.set(new _n(t.board.board,null)),await Dn.set(t.history),await Un.set(t.pref),await Ln.set(t.chat),await In.set(t.tab),await jn.set(t.games),await On.set(t.page),sessionStorage.removeItem("idx")}};const Mn=ft($n("http://localhost:4000/")),Rn=ft(null),On=ft(0),In=ft(0),jn=ft([]),qn=ft(null),Dn=ft([]),Un=ft(null),Ln=ft([]);function Hn(t){return new Promise((e,n)=>{const r="https://us-central1-checker-io.cloudfunctions.net/"+t.func;t=new URLSearchParams(t).toString(),fetch(r,{method:"POST",body:t,headers:{Accept:"*/*","Content-Type":"application/x-www-form-urlencoded"},"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"}).then(t=>t.json()).then(t=>{e(t)}).catch(t=>n(t))})}function zn(t){const e=t-1;return e*e*e+1}function Gn(t,{delay:e=0,duration:n=400,easing:r=zn,x:o=0,y:s=0,opacity:i=0}){const a=getComputedStyle(t),c=+a.opacity,l="none"===a.transform?"":a.transform,u=c*(1-i);return{delay:e,duration:n,easing:r,css:(t,e)=>`\n\t\t\ttransform: ${l} translate(${(1-t)*o}px, ${(1-t)*s}px);\n\t\t\topacity: ${c-u*e}`}}function Jn(t,e,n){const r=t.slice();return r[5]=e[n],r}function Xn(t,e,n){const r=t.slice();return r[5]=e[n],r}function Wn(t){let e,n,r,o,s,i,a=t[0],c=[];for(let e=0;e<a.length;e+=1)c[e]=Kn(Xn(t,a,e));let l=t[0],u=[];for(let e=0;e<l.length;e+=1)u[e]=Qn(Jn(t,l,e));return{c(){e=C("h5"),e.textContent="On-Going Games",n=P();for(let t=0;t<c.length;t+=1)c[t].c();r=P(),o=C("h5"),o.textContent="Finished Games",s=P();for(let t=0;t<u.length;t+=1)u[t].c();i=A(),S(e,"class","svelte-4eh53h"),S(o,"class","svelte-4eh53h")},m(t,a){v(t,e,a),v(t,n,a);for(let e=0;e<c.length;e+=1)c[e].m(t,a);v(t,r,a),v(t,o,a),v(t,s,a);for(let e=0;e<u.length;e+=1)u[e].m(t,a);v(t,i,a)},p(t,e){if(3&e){let n;for(a=t[0],n=0;n<a.length;n+=1){const o=Xn(t,a,n);c[n]?c[n].p(o,e):(c[n]=Kn(o),c[n].c(),c[n].m(r.parentNode,r))}for(;n<c.length;n+=1)c[n].d(1);c.length=a.length}if(3&e){let n;for(l=t[0],n=0;n<l.length;n+=1){const r=Jn(t,l,n);u[n]?u[n].p(r,e):(u[n]=Qn(r),u[n].c(),u[n].m(i.parentNode,i))}for(;n<u.length;n+=1)u[n].d(1);u.length=l.length}},d(t){t&&b(e),t&&b(n),w(c,t),t&&b(r),t&&b(o),t&&b(s),w(u,t),t&&b(i)}}}function Yn(e){let n,r,o;return{c(){n=C("h5"),n.textContent="There are no games to view",r=P(),o=C("h5"),o.textContent="Create or Join a Game",S(n,"id","empty"),S(n,"class","svelte-4eh53h"),S(o,"class","svelte-4eh53h")},m(t,e){v(t,n,e),v(t,r,e),v(t,o,e)},p:t,d(t){t&&b(n),t&&b(r),t&&b(o)}}}function Vn(t){let e,n,r,o,s,i,a,c=t[5].priPlayer+"",l=t[5].secPlayer+"",u=t[5].date+"";function p(...e){return t[3](t[5],...e)}return{c(){e=C("button"),n=x(c),r=x(" vs. "),o=x(l),s=x(" - "),i=x(u),S(e,"class","btn btn-warning svelte-4eh53h")},m(t,c,l){v(t,e,c),g(e,n),g(e,r),g(e,o),g(e,s),g(e,i),l&&a(),a=B(e,"click",p)},p(e,r){t=e,1&r&&c!==(c=t[5].priPlayer+"")&&F(n,c),1&r&&l!==(l=t[5].secPlayer+"")&&F(o,l),1&r&&u!==(u=t[5].date+"")&&F(i,u)},d(t){t&&b(e),a()}}}function Kn(t){let e,n=!t[5].finished&&Vn(t);return{c(){n&&n.c(),e=A()},m(t,r){n&&n.m(t,r),v(t,e,r)},p(t,r){t[5].finished?n&&(n.d(1),n=null):n?n.p(t,r):(n=Vn(t),n.c(),n.m(e.parentNode,e))},d(t){n&&n.d(t),t&&b(e)}}}function Zn(t){let e,n,r,o,s,i,a,c=t[5].priPlayer+"",l=t[5].secPlayer+"",u=t[5].date+"";function p(...e){return t[4](t[5],...e)}return{c(){e=C("button"),n=x(c),r=x(" vs. "),o=x(l),s=x(" - "),i=x(u),S(e,"class","btn btn-light svelte-4eh53h")},m(t,c,l){v(t,e,c),g(e,n),g(e,r),g(e,o),g(e,s),g(e,i),l&&a(),a=B(e,"click",p)},p(e,r){t=e,1&r&&c!==(c=t[5].priPlayer+"")&&F(n,c),1&r&&l!==(l=t[5].secPlayer+"")&&F(o,l),1&r&&u!==(u=t[5].date+"")&&F(i,u)},d(t){t&&b(e),a()}}}function Qn(t){let e,n=t[5].finished&&Zn(t);return{c(){n&&n.c(),e=A()},m(t,r){n&&n.m(t,r),v(t,e,r)},p(t,r){t[5].finished?n?n.p(t,r):(n=Zn(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(t){n&&n.d(t),t&&b(e)}}}function tr(e){let n;function r(t,e){return 0==t[0].length?Yn:Wn}let o=r(e),s=o(e);return{c(){s.c(),n=A()},m(t,e){s.m(t,e),v(t,n,e)},p(t,[e]){o===(o=r(t))&&s?s.p(t,e):(s.d(1),s=o(t),s&&(s.c(),s.m(n.parentNode,n)))},i:t,o:t,d(t){s.d(t),t&&b(n)}}}function er(t,e,n){let r,o;function s(t,e){let n=t.priEmail==r.email?JSON.parse(t.priGameHistory):JSON.parse(t.secGameHistory);qn.set(new _n(n[n.length-1],null)),Dn.set(n),Ln.set(JSON.parse(t.chatHistory)),Un.update(o=>((o={}).id=t.id,o.time=t.time,o.timer=t.time,o.pri=t.priEmail==r.email?r.name:null,o.sec=t.secEmail==r.email?r.name:null,o.currPlayer=t.currPlayer,o.numMoves=n.length,o.rangeMoves=n.length,o.paused=1==e,o.finished=1!=e,o.side=t.priEmail==r.email?"red":"black",o.secondsPlayed=60*t.minutesPlayed,o)),On.set(1),In.set(0)}l(t,Rn,t=>n(2,r=t)),l(t,jn,t=>n(0,o=t));return[o,s,r,t=>s(t,!0),t=>s(t,!1)]}window.onbeforeunload=async function(){const t={};await Rn.update(e=>(t.user=e,e)),await On.update(e=>(t.page=e,e)),await In.update(e=>(t.tab=e,e)),await qn.update(e=>(t.board=e,e)),await Dn.update(e=>(t.history=e,e)),await Un.update(e=>(t.pref=e,e)),await Ln.update(e=>(t.chat=e,e)),await jn.update(e=>(t.games=e,e)),await sessionStorage.setItem("idx",JSON.stringify(t))};class nr extends pt{constructor(t){super(),ut(this,t,er,tr,a,{})}}function rr(e){let n,r,o,i,a,c,l,u,p,h,f,d,m,y,w,k,A,E,T,_,M,R,O,I,j,q,D,U,L,H,z,G,J,X,W,Y,V,K,Z,Q,tt,et,nt,rt=e[6].email+"";return{c(){n=C("h3"),n.textContent="Settings",r=P(),o=C("h5"),o.textContent="Profile",i=P(),a=C("h6"),c=x("Account ID: "),l=C("span"),u=x(rt),p=P(),h=C("img"),d=P(),m=C("div"),y=C("input"),w=P(),k=C("label"),A=x(e[5]),E=P(),T=C("p"),T.textContent="Image size should be less than 1MB",_=P(),M=C("div"),R=C("div"),R.innerHTML='<div class="input-group-text">Display Name:</div>',O=P(),I=C("input"),j=P(),q=C("input"),D=P(),U=C("button"),U.textContent="Update Profile",L=P(),H=C("h5"),H.textContent="Reset Password",z=P(),G=C("div"),J=C("div"),J.innerHTML='<div class="input-group-text">Old Password:</div>',X=P(),W=C("input"),Y=P(),V=C("div"),K=C("div"),K.innerHTML='<div class="input-group-text">New Password:</div>',Z=P(),Q=C("input"),tt=P(),et=C("button"),et.textContent="Reset",S(n,"class","svelte-5d476"),N(a,"text-align","center"),N(h,"float","left"),S(h,"alt","propic"),h.src!==(f=e[1])&&S(h,"src",f),S(h,"class","svelte-5d476"),S(y,"type","file"),S(y,"accept","image/jpeg"),S(y,"class","custom-file-input"),S(y,"id","customFile"),S(k,"class","custom-file-label"),S(k,"for","customFile"),S(m,"id","propic"),S(m,"class","custom-file input-group svelte-5d476"),N(T,"float","right"),S(R,"class","input-group-prepend"),S(I,"type","text"),S(I,"class","form-control"),S(I,"id","inlineFormInputGroup"),S(I,"placeholder",e[0]),S(M,"class","input-group mb-2 svelte-5d476"),S(q,"id","authPass"),S(q,"placeholder","Account Password"),S(q,"class","svelte-5d476"),S(U,"class","btn btn-success svelte-5d476"),N(H,"margin-top","60px"),S(J,"class","input-group-prepend"),S(W,"type","text"),S(W,"class","form-control"),S(W,"id","inlineFormInputGroup"),S(W,"placeholder","Account Password"),S(G,"class","input-group mb-2 svelte-5d476"),S(K,"class","input-group-prepend"),S(Q,"type","text"),S(Q,"class","form-control"),S(Q,"id","inlineFormInputGroup"),S(Q,"placeholder","New Password"),S(V,"class","input-group mb-2 svelte-5d476"),S(et,"class","btn btn-success svelte-5d476")},m(t,f,b){v(t,n,f),v(t,r,f),v(t,o,f),v(t,i,f),v(t,a,f),g(a,c),g(a,l),g(l,u),v(t,p,f),v(t,h,f),v(t,d,f),v(t,m,f),g(m,y),g(m,w),g(m,k),g(k,A),v(t,E,f),v(t,T,f),v(t,_,f),v(t,M,f),g(M,R),g(M,O),g(M,I),$(I,e[0]),v(t,j,f),v(t,q,f),$(q,e[2]),v(t,D,f),v(t,U,f),v(t,L,f),v(t,H,f),v(t,z,f),v(t,G,f),g(G,J),g(G,X),g(G,W),$(W,e[3]),v(t,Y,f),v(t,V,f),g(V,K),g(V,Z),g(V,Q),$(Q,e[4]),v(t,tt,f),v(t,et,f),b&&s(nt),nt=[B(y,"change",e[7]),B(I,"input",e[11]),B(q,"input",e[12]),B(U,"click",e[8]),B(W,"input",e[13]),B(Q,"input",e[14]),B(et,"click",e[9])]},p(t,[e]){64&e&&rt!==(rt=t[6].email+"")&&F(u,rt),2&e&&h.src!==(f=t[1])&&S(h,"src",f),32&e&&F(A,t[5]),1&e&&S(I,"placeholder",t[0]),1&e&&I.value!==t[0]&&$(I,t[0]),4&e&&q.value!==t[2]&&$(q,t[2]),8&e&&W.value!==t[3]&&$(W,t[3]),16&e&&Q.value!==t[4]&&$(Q,t[4])},i:t,o:t,d(t){t&&b(n),t&&b(r),t&&b(o),t&&b(i),t&&b(a),t&&b(p),t&&b(h),t&&b(d),t&&b(m),t&&b(E),t&&b(T),t&&b(_),t&&b(M),t&&b(j),t&&b(q),t&&b(D),t&&b(U),t&&b(L),t&&b(H),t&&b(z),t&&b(G),t&&b(Y),t&&b(V),t&&b(tt),t&&b(et),s(nt)}}}function or(t,n,r){let o;l(t,Rn,t=>r(6,o=t));let s,i,a,c,u=o.name,p=o.picture,h="Choose Profile Photo";return[u,p,s,i,a,h,o,function(){if(e.target.files[0].size<=1e6&&"image/jpeg"==e.target.files[0].type){var t=new FileReader;t.onload=function(t){r(1,p=t.target.result),Rn.update(e=>(e.picture=t.target.result,e))},t.readAsDataURL(e.target.files[0]),r(5,h=e.target.files[0].name)}},function(){null!=u&&null!=s&&(c={func:"updateProfile",name:u,picture:p.includes("unsplash")?null:p,password:s,email:o.email},Hn(c).then(t=>{null!=t.msg?(console.log(t.msg),r(2,s=""),Rn.update(t=>(t.name=u,t))):console.log(t.err)}).catch(t=>{console.log(t)}))},function(){null!=i&&null!=a&&i!=a&&(c={func:"resetPassword",email:o.email,password:i,newPass:a},Hn(c).then(t=>{null!=t.msg?(console.log(t.msg),r(3,i=""),r(4,a="")):console.log(t.err)}).catch(t=>{console.log(t)}))},c,function(){u=this.value,r(0,u)},function(){s=this.value,r(2,s)},function(){i=this.value,r(3,i)},function(){a=this.value,r(4,a)}]}class sr extends pt{constructor(t){super(),ut(this,t,or,rr,a,{})}}function ir(e){let n,r,o,i,a,c,l,u,p,h,f;return{c(){n=C("h5"),n.textContent="Game Preferences",r=P(),o=C("h6"),i=x("Time Per Turn: "),a=x(e[0]),c=x(" seconds"),l=P(),u=C("input"),p=P(),h=C("button"),h.textContent="Create",S(n,"class","svelte-ygik97"),S(o,"class","svelte-ygik97"),S(u,"class","custom-range"),S(u,"type","range"),S(u,"min","15"),S(u,"max","60"),S(u,"step","1"),S(h,"class","btn btn-primary svelte-ygik97")},m(t,d,m){v(t,n,d),v(t,r,d),v(t,o,d),g(o,i),g(o,a),g(o,c),v(t,l,d),v(t,u,d),$(u,e[0]),v(t,p,d),v(t,h,d),m&&s(f),f=[B(u,"change",e[6]),B(u,"input",e[6]),B(h,"click",e[1])]},p(t,[e]){1&e&&F(a,t[0]),1&e&&$(u,t[0])},i:t,o:t,d(t){t&&b(n),t&&b(r),t&&b(o),t&&b(l),t&&b(u),t&&b(p),t&&b(h),s(f)}}}function ar(t,e,n){let r,o,s;l(t,Dn,t=>n(3,r=t)),l(t,qn,t=>n(4,o=t)),l(t,Rn,t=>n(5,s=t));let i,a=15;return[a,function(){qn.set(new _n(null,!1)),r.push(o.saveBoardState()),Un.update(t=>((t={}).time=a,t.timer=a,t.pri=s.name,t.sec=null,t.currPlayer=null,t.numMoves=0,t.rangeMoves=0,t.paused=!0,t.finished=!1,t.side="red",t.secondsPlayed=0,t)),i={func:"createGame",email:s.email,name:s.name,time:a,date:(new Date).getFullYear()+"-"+((new Date).getMonth()+1)+"-"+(new Date).getDate()},console.log(i),Hn(i).then(t=>{console.log(t),null!=t.msg?(console.log(t.msg),Un.update(e=>(e.id=t.msg,e)),On.set(1),In.set(0)):console.log(t.err)}).catch(t=>{console.log(t)})},i,r,o,s,function(){a=E(this.value),n(0,a)}]}class cr extends pt{constructor(t){super(),ut(this,t,ar,ir,a,{})}}function lr(e){let n,r,o,i,a,c,l,u,p,h;return{c(){n=C("h5"),n.textContent="Game Password",r=P(),o=C("input"),i=P(),a=C("button"),a.textContent="Join",c=P(),l=C("hr"),u=P(),p=C("button"),p.textContent="Find A Random Game",S(n,"class","svelte-uoxtb0"),S(o,"placeholder","Game Password"),S(o,"class","svelte-uoxtb0"),S(a,"class","btn btn-primary svelte-uoxtb0"),N(a,"margin-bottom","30px"),S(p,"class","btn btn-primary svelte-uoxtb0")},m(t,f,d){v(t,n,f),v(t,r,f),v(t,o,f),$(o,e[0]),v(t,i,f),v(t,a,f),v(t,c,f),v(t,l,f),v(t,u,f),v(t,p,f),d&&s(h),h=[B(o,"input",e[6]),B(a,"click",e[1])]},p(t,[e]){1&e&&o.value!==t[0]&&$(o,t[0])},i:t,o:t,d(t){t&&b(n),t&&b(r),t&&b(o),t&&b(i),t&&b(a),t&&b(c),t&&b(l),t&&b(u),t&&b(p),s(h)}}}function ur(t,e,n){let r,o,s,i,a;return l(t,Rn,t=>n(3,r=t)),l(t,Dn,t=>n(4,o=t)),l(t,qn,t=>n(5,s=t)),[i,function(){null!=i&&(a={func:"joinGame",gameID:i,email:r.email,name:r.name},Hn(a).then(t=>{if(null!=t.msg){console.log(t.msg);let e=t.msg;e.priEmail!=r.email?(qn.set(new _n(null,!0)),o.push(s.saveBoardState()),Un.update(t=>((t={}).time=e.time,t.timer=e.time,t.id=i,t.pri=null,t.sec=e.secPlayer,t.currPlayer=null,t.numMoves=0,t.rangeMoves=0,t.paused=!0,t.finished=!1,t.side="black",t.secondsPlayed=0,t)),On.set(1),In.set(0)):console.log("Same Player")}else console.log(t.err)}).catch(t=>{console.log(t)}))},a,r,o,s,function(){i=this.value,n(0,i)}]}class pr extends pt{constructor(t){super(),ut(this,t,ur,lr,a,{})}}function hr(e){let n,r,o,s,i,a=e[6]<800&&function(e){let n,r;return{c(){n=C("button"),n.textContent="Close",S(n,"class","btn btn-danger svelte-9xhgok")},m(t,o,s){v(t,n,o),s&&r(),r=B(n,"click",e[7])},p:t,d(t){t&&b(n),r()}}}(e),c=e[4]&&fr(),l=e[5]&&dr();return{c(){n=C("div"),a&&a.c(),r=P(),c&&c.c(),o=P(),l&&l.c(),S(n,"id","popUp"),S(n,"class","container-fluid svelte-9xhgok")},m(t,e){v(t,n,e),a&&a.m(n,null),g(n,r),c&&c.m(n,null),g(n,o),l&&l.m(n,null),i=!0},p(t,e){t[6]<800&&a.p(t,e),t[4]?c?16&e&&nt(c,1):(c=fr(),c.c(),nt(c,1),c.m(n,o)):c&&(tt(),rt(c,1,1,()=>{c=null}),et()),t[5]?l?32&e&&nt(l,1):(l=dr(),l.c(),nt(l,1),l.m(n,null)):l&&(tt(),rt(l,1,1,()=>{l=null}),et())},i(t){i||(nt(c),nt(l),G(()=>{s||(s=st(n,Gn,{y:-200,duration:1e3},!0)),s.run(1)}),i=!0)},o(t){rt(c),rt(l),s||(s=st(n,Gn,{y:-200,duration:1e3},!1)),s.run(0),i=!1},d(t){t&&b(n),a&&a.d(),c&&c.d(),l&&l.d(),t&&s&&s.end()}}}function fr(t){let e;const n=new cr({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function dr(t){let e;const n=new pr({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function mr(e){let n,r,o,s,i,a=e[6]<800&&function(e){let n,r;return{c(){n=C("button"),n.textContent="Back",S(n,"class","btn btn-danger svelte-9xhgok")},m(t,o,s){v(t,n,o),s&&r(),r=B(n,"click",e[7])},p:t,d(t){t&&b(n),r()}}}(e),c=e[1]&&yr(),l=e[2]&&gr();return{c(){n=C("div"),a&&a.c(),r=P(),c&&c.c(),o=P(),l&&l.c(),S(n,"id","rightSlide"),S(n,"class","container-fluid svelte-9xhgok")},m(t,e){v(t,n,e),a&&a.m(n,null),g(n,r),c&&c.m(n,null),g(n,o),l&&l.m(n,null),i=!0},p(t,e){t[6]<800&&a.p(t,e),t[1]?c?2&e&&nt(c,1):(c=yr(),c.c(),nt(c,1),c.m(n,o)):c&&(tt(),rt(c,1,1,()=>{c=null}),et()),t[2]?l?4&e&&nt(l,1):(l=gr(),l.c(),nt(l,1),l.m(n,null)):l&&(tt(),rt(l,1,1,()=>{l=null}),et())},i(t){i||(nt(c),nt(l),G(()=>{s||(s=st(n,Gn,{x:200,duration:1e3},!0)),s.run(1)}),i=!0)},o(t){rt(c),rt(l),s||(s=st(n,Gn,{x:200,duration:1e3},!1)),s.run(0),i=!1},d(t){t&&b(n),a&&a.d(),c&&c.d(),l&&l.d(),t&&s&&s.end()}}}function yr(t){let e;const n=new nr({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function gr(t){let e;const n=new sr({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function vr(t){let e,n,r,o,i,a,c,l,u,p,h,f,d,m,y,w,k,E,F,$=t[3]&&hr(t),N=t[0]&&mr(t);return{c(){$&&$.c(),e=P(),n=C("div"),r=C("h1"),r.textContent="Dashboard",o=P(),i=C("button"),i.textContent="Create Game",a=P(),c=C("button"),c.textContent="Join Game",l=P(),u=C("button"),u.textContent="View Games",p=P(),h=C("button"),h.textContent="Leadership Board \n    ",f=x(">\n\n    "),d=C("button"),d.textContent="Tutorial",m=P(),y=C("button"),y.textContent="Settings",w=P(),N&&N.c(),k=A(),S(r,"class","svelte-9xhgok"),S(i,"class","circles btn btn-info svelte-9xhgok"),S(c,"class","circles btn btn-info svelte-9xhgok"),S(u,"class","circles btn btn-info svelte-9xhgok"),S(h,"class","circles btn btn-info svelte-9xhgok"),S(d,"class","circles btn btn-info svelte-9xhgok"),S(y,"class","circles btn btn-info svelte-9xhgok"),S(n,"id","backpurple"),S(n,"class","svelte-9xhgok")},m(b,C,x){$&&$.m(b,C),v(b,e,C),v(b,n,C),g(n,r),g(n,o),g(n,i),g(n,a),g(n,c),g(n,l),g(n,u),g(n,p),g(n,h),g(n,f),g(n,d),g(n,m),g(n,y),v(b,w,C),N&&N.m(b,C),v(b,k,C),E=!0,x&&s(F),F=[B(i,"click",t[8]),B(c,"click",t[9]),B(u,"click",t[10]),B(y,"click",t[11]),B(n,"click",t[7])]},p(t,[n]){t[3]?$?($.p(t,n),8&n&&nt($,1)):($=hr(t),$.c(),nt($,1),$.m(e.parentNode,e)):$&&(tt(),rt($,1,1,()=>{$=null}),et()),t[0]?N?(N.p(t,n),1&n&&nt(N,1)):(N=mr(t),N.c(),nt(N,1),N.m(k.parentNode,k)):N&&(tt(),rt(N,1,1,()=>{N=null}),et())},i(t){E||(nt($),nt(N),E=!0)},o(t){rt($),rt(N),E=!1},d(t){$&&$.d(t),t&&b(e),t&&b(n),t&&b(w),N&&N.d(t),t&&b(k),s(F)}}}function br(t,e,n){let r,o;l(t,Rn,t=>n(14,r=t));let s=!1,i=!1,a=!1,c=!1,u=!1,p=!1,h=!1,f=screen.width;function d(){n(0,s=!1),i=!1,n(1,a=!1),n(2,c=!1),n(3,u=!1),n(4,p=!1),n(5,h=!1)}return[s,a,c,u,p,h,f,d,function(){d(),setTimeout(()=>{n(3,u=!0)},1),setTimeout(()=>{n(4,p=!0)},2)},function(){d(),setTimeout(()=>{n(3,u=!0)},1),setTimeout(()=>{n(5,h=!0)},2)},function(){d(),setTimeout(()=>{n(0,s=!0)},1),o={func:"retrieveUserGames",email:r.email},Hn(o).then(t=>{if(console.log(t),null!=t.msg){let e=t.msg;jn.update(t=>{t=[];for(let n=0;n<e.length;n++)e[n].finished?t.push(e[n]):t.unshift(e[n]);return t}),setTimeout(()=>{n(1,a=!0)},1)}else console.log(t.err)}).catch(t=>{console.log(t)})},function(){d(),setTimeout(()=>{n(0,s=!0)},1),setTimeout(()=>{n(2,c=!0)},1)}]}class wr extends pt{constructor(t){super(),ut(this,t,br,vr,a,{})}}function Cr(t){return"[object Date]"===Object.prototype.toString.call(t)}function kr(t,e={}){const n=ft(t),{stiffness:r=.15,damping:o=.8,precision:s=.01}=e;let i,a,c,l=t,u=t,p=1,f=0,d=!1;function m(e,r={}){u=e;const o=c={};if(null==t||r.hard||g.stiffness>=1&&g.damping>=1)return d=!0,i=h(),l=e,n.set(t=u),Promise.resolve();if(r.soft){const t=!0===r.soft?.5:+r.soft;f=1/(60*t),p=0}return a||(i=h(),d=!1,a=y(e=>{if(d)return d=!1,a=null,!1;p=Math.min(p+f,1);const r={inv_mass:p,opts:g,settled:!0,dt:60*(e-i)/1e3},o=function t(e,n,r,o){if("number"==typeof r||Cr(r)){const t=o-r,s=(r-n)/(e.dt||1/60),i=(s+(e.opts.stiffness*t-e.opts.damping*s)*e.inv_mass)*e.dt;return Math.abs(i)<e.opts.precision&&Math.abs(t)<e.opts.precision?o:(e.settled=!1,Cr(r)?new Date(r.getTime()+i):r+i)}if(Array.isArray(r))return r.map((s,i)=>t(e,n[i],r[i],o[i]));if("object"==typeof r){const s={};for(const i in r)s[i]=t(e,n[i],r[i],o[i]);return s}throw new Error(`Cannot spring ${typeof r} values`)}(r,l,t,u);return i=e,l=t,n.set(t=o),r.settled&&(a=null),!r.settled})),new Promise(t=>{a.promise.then(()=>{o===c&&t()})})}const g={set:m,update:(e,n)=>m(e(u,t),n),subscribe:n.subscribe,stiffness:r,damping:o,precision:s};return g}function xr(e){let n,r,o,s,i;return{c(){n=k("svg"),r=k("g"),o=k("circle"),s=k("circle"),i=k("circle"),S(o,"class","dot svelte-16rctq0"),S(o,"cx","3"),S(o,"cy","3"),S(o,"r","3"),S(s,"class","dot svelte-16rctq0"),S(s,"cx","12"),S(s,"cy","3"),S(s,"r","3"),S(i,"class","dot svelte-16rctq0"),S(i,"cx","21"),S(i,"cy","3"),S(i,"r","3"),S(n,"id","typing_bubble"),S(n,"data-name","typing bubble"),S(n,"xmlns","http://www.w3.org/2000/svg"),S(n,"width","24"),S(n,"height","6"),S(n,"viewBox","0 0 24 6")},m(t,e){v(t,n,e),g(n,r),g(r,o),g(r,s),g(r,i)},p:t,i:t,o:t,d(t){t&&b(n)}}}class Pr extends pt{constructor(t){super(),ut(this,t,null,xr,a,{})}}function Ar(t,e,n){const r=t.slice();return r[16]=e[n],r}function Br(t){let e,n,r=t[3].pri+"";return{c(){e=C("h4"),n=x(r),N(e,"text-align","center"),S(e,"class","svelte-12nht46")},m(t,r){v(t,e,r),g(e,n)},p(t,e){8&e&&r!==(r=t[3].pri+"")&&F(n,r)},d(t){t&&b(e)}}}function Sr(e){let n;return{c(){n=C("h4"),n.textContent="Waiting for other player",S(n,"class","blinking svelte-12nht46"),N(n,"text-align","center")},m(t,e){v(t,n,e)},p:t,d(t){t&&b(n)}}}function Er(t){let e,n,r=t[3].sec+"";return{c(){e=C("h4"),n=x(r),N(e,"text-align","center"),S(e,"class","svelte-12nht46")},m(t,r){v(t,e,r),g(e,n)},p(t,e){8&e&&r!==(r=t[3].sec+"")&&F(n,r)},d(t){t&&b(e)}}}function Fr(t){let e,n,r,o=t[16].msg+"";return{c(){e=C("article"),n=C("span"),r=x(o),S(n,"class","txtMsg svelte-12nht46"),S(e,"class","odaMsg svelte-12nht46")},m(t,o){v(t,e,o),g(e,n),g(n,r)},p(t,e){32&e&&o!==(o=t[16].msg+"")&&F(r,o)},d(t){t&&b(e)}}}function $r(t){let e,n,r,o=t[16].msg+"";return{c(){e=C("article"),n=C("span"),r=x(o),S(n,"class","txtMsg svelte-12nht46"),S(e,"class","myMsg svelte-12nht46")},m(t,o){v(t,e,o),g(e,n),g(n,r)},p(t,e){32&e&&o!==(o=t[16].msg+"")&&F(r,o)},d(t){t&&b(e)}}}function Nr(t){let e;function n(t,e){return t[16].name==t[4].name?$r:Fr}let r=n(t),o=r(t);return{c(){o.c(),e=A()},m(t,n){o.m(t,n),v(t,e,n)},p(t,s){r===(r=n(t))&&o?o.p(t,s):(o.d(1),o=r(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&b(e)}}}function Tr(t){let e,n;const r=new Pr({});return{c(){e=C("span"),it(r.$$.fragment),S(e,"class","txtMsg svelte-12nht46"),S(e,"id","isTypingSpan")},m(t,o){v(t,e,o),at(r,e,null),n=!0},i(t){n||(nt(r.$$.fragment,t),n=!0)},o(t){rt(r.$$.fragment,t),n=!1},d(t){t&&b(e),ct(r)}}}function _r(t){let e,n,r,o,i,a,c,l,u;function p(t,e){return t[3].pri==t[4].name&&null!=t[3].sec?Er:null==t[3].sec||null==t[3].pri?Sr:Br}let h=p(t),f=h(t),d=t[5],m=[];for(let e=0;e<d.length;e+=1)m[e]=Nr(Ar(t,d,e));let y=t[2]&&Tr();return{c(){e=C("div"),f.c(),n=P(),r=C("div");for(let t=0;t<m.length;t+=1)m[t].c();o=P(),i=C("article"),y&&y.c(),a=P(),c=C("input"),S(i,"class","odaMsg svelte-12nht46"),S(i,"id","isTyping"),S(r,"class","scrollable svelte-12nht46"),S(c,"id","user-msg"),S(c,"placeholder","Type Here"),S(c,"class","svelte-12nht46"),S(e,"id","chat"),S(e,"class","container-fluid svelte-12nht46")},m(p,h,d){v(p,e,h),f.m(e,null),g(e,n),g(e,r);for(let t=0;t<m.length;t+=1)m[t].m(r,null);g(r,o),g(r,i),y&&y.m(i,null),t[13](r),g(e,a),g(e,c),$(c,t[1]),l=!0,d&&s(u),u=[B(c,"input",t[14]),B(c,"keyup",t[7]),B(c,"keydown",t[15])]},p(t,[s]){if(h===(h=p(t))&&f?f.p(t,s):(f.d(1),f=h(t),f&&(f.c(),f.m(e,n))),48&s){let e;for(d=t[5],e=0;e<d.length;e+=1){const n=Ar(t,d,e);m[e]?m[e].p(n,s):(m[e]=Nr(n),m[e].c(),m[e].m(r,o))}for(;e<m.length;e+=1)m[e].d(1);m.length=d.length}t[2]?y?4&s&&nt(y,1):(y=Tr(),y.c(),nt(y,1),y.m(i,null)):y&&(tt(),rt(y,1,1,()=>{y=null}),et()),2&s&&c.value!==t[1]&&$(c,t[1])},i(t){l||(nt(y),l=!0)},o(t){rt(y),l=!1},d(n){n&&b(e),f.d(),w(m,n),y&&y.d(),t[13](null),s(u)}}}function Mr(t,e,n){let r,o,s,i,a,c,u;l(t,Un,t=>n(3,r=t)),l(t,Rn,t=>n(4,o=t)),l(t,Ln,t=>n(5,s=t)),l(t,Mn,t=>n(10,i=t));let p=!1;r.pri==o.name&&0==r.numMoves&&null==r.sec&&screen.width>=800&&s.push({name:"System",msg:"Please share Game Password '"+r.id+"' with other player"});let h=r.id,f={};var d;function m(){null==u&&""==u||(f.name=o.name,f.msg=u,f.room=h,i.emit("chat message",f),n(1,u=""))}d=()=>{c=a&&a.offsetHeight+a.scrollTop>a.scrollHeight-20},j().$$.before_update.push(d),function(t){j().$$.after_update.push(t)}(()=>{c&&a.scrollTo(0,a.scrollHeight)}),i.on("typing",t=>{n(2,p=!0)}),i.on("no-typing",t=>{n(2,p=!1)});return[a,u,p,r,o,s,m,function(){""==u?i.emit("no-typing",h):i.emit("typing",h)},c,f,i,void 0,h,function(t){D[t?"unshift":"push"](()=>{n(0,a=t)})},function(){u=this.value,n(1,u)},t=>13===t.which&&m()]}class Rr extends pt{constructor(t){super(),ut(this,t,Mr,_r,a,{})}}function Or(t,e,n){const r=t.slice();return r[40]=e[n],r}function Ir(t,e,n){const r=t.slice();return r[37]=e[n],r}function jr(t){let e,n,r,o,s,i,a,c=t[2].id+"";return{c(){e=C("div"),n=C("h5"),r=x("Please share Game Password '"),o=x(c),s=x("' with other player"),N(n,"text-align","center"),N(n,"margin-top","50%"),S(e,"id","popUp"),S(e,"class","container-fluid svelte-12fbbq6")},m(t,i){v(t,e,i),g(e,n),g(n,r),g(n,o),g(n,s),a=!0},p(t,e){(!a||4&e[0])&&c!==(c=t[2].id+"")&&F(o,c)},i(t){a||(G(()=>{i||(i=st(e,Gn,{y:-200,duration:1e3},!0)),i.run(1)}),a=!0)},o(t){i||(i=st(e,Gn,{y:-200,duration:1e3},!1)),i.run(0),a=!1},d(t){t&&b(e),t&&i&&i.end()}}}function qr(t){let e;return{c(){e=C("div"),S(e,"class","checker reda svelte-12fbbq6")},m(t,n){v(t,e,n)},d(t){t&&b(e)}}}function Dr(t){let e;return{c(){e=C("div"),S(e,"class","checker blacka svelte-12fbbq6")},m(t,n){v(t,e,n)},d(t){t&&b(e)}}}function Ur(t){let e,n=(t[37]%2!=0&&t[40]%2==0||t[37]%2==0&&t[40]%2!=0)&&function(t){let e,n,r,o;function s(...e){return t[34](t[37],t[40],...e)}return{c(){e=k("rect"),S(e,"width",t[1]),S(e,"height",t[1]),N(e,"fill","brown"),S(e,"x",n=t[40]*t[1]),S(e,"y",r=t[37]*t[1])},m(t,n,r){v(t,e,n),r&&o(),o=B(e,"click",s)},p(o,s){t=o,2&s[0]&&S(e,"width",t[1]),2&s[0]&&S(e,"height",t[1]),2&s[0]&&n!==(n=t[40]*t[1])&&S(e,"x",n),2&s[0]&&r!==(r=t[37]*t[1])&&S(e,"y",r)},d(t){t&&b(e),o()}}}(t);return{c(){n&&n.c(),e=A()},m(t,r){n&&n.m(t,r),v(t,e,r)},p(t,e){(t[37]%2!=0&&t[40]%2==0||t[37]%2==0&&t[40]%2!=0)&&n.p(t,e)},d(t){n&&n.d(t),t&&b(e)}}}function Lr(t){let e,n,r,o,s,i,a,c,l,p,h;function f(...e){return t[33](t[37],t[40],...e)}return{c(){e=k("rect"),o=k("circle"),S(e,"width",t[1]),S(e,"height",t[1]),N(e,"fill","brown"),S(e,"x",n=t[40]*t[1]),S(e,"y",r=t[37]*t[1]),S(o,"class",s=u(t[4].getSide(t[37],t[40]))+" svelte-12fbbq6"),S(o,"id",i=t[4].getId(t[37],t[40])),S(o,"cx",a=t[5][t[4].getId(t[37],t[40])].y),S(o,"cy",c=t[5][t[4].getId(t[37],t[40])].x),S(o,"r",t[6]),S(o,"stroke","white"),S(o,"stroke-width",l=2*t[4].getPiece(t[37],t[40]).stack),S(o,"fill",p=t[4].getSide(t[37],t[40]))},m(t,n,r){v(t,e,n),v(t,o,n),r&&h(),h=B(o,"click",f)},p(h,f){t=h,2&f[0]&&S(e,"width",t[1]),2&f[0]&&S(e,"height",t[1]),2&f[0]&&n!==(n=t[40]*t[1])&&S(e,"x",n),2&f[0]&&r!==(r=t[37]*t[1])&&S(e,"y",r),16&f[0]&&s!==(s=u(t[4].getSide(t[37],t[40]))+" svelte-12fbbq6")&&S(o,"class",s),16&f[0]&&i!==(i=t[4].getId(t[37],t[40]))&&S(o,"id",i),48&f[0]&&a!==(a=t[5][t[4].getId(t[37],t[40])].y)&&S(o,"cx",a),48&f[0]&&c!==(c=t[5][t[4].getId(t[37],t[40])].x)&&S(o,"cy",c),64&f[0]&&S(o,"r",t[6]),16&f[0]&&l!==(l=2*t[4].getPiece(t[37],t[40]).stack)&&S(o,"stroke-width",l),16&f[0]&&p!==(p=t[4].getSide(t[37],t[40]))&&S(o,"fill",p)},d(t){t&&b(e),t&&b(o),h()}}}function Hr(t){let e,n,r;function o(t,r){return(null==e||16&r[0])&&(e=!t[4].isEmpty(t[37],t[40])),e?Lr:((null==n||16&r[0])&&(n=!!t[4].isEmpty(t[37],t[40])),n?Ur:void 0)}let s=o(t,[-1]),i=s&&s(t);return{c(){i&&i.c(),r=A()},m(t,e){i&&i.m(t,e),v(t,r,e)},p(t,e){s===(s=o(t,e))&&i?i.p(t,e):(i&&i.d(1),i=s&&s(t),i&&(i.c(),i.m(r.parentNode,r)))},d(t){i&&i.d(t),t&&b(r)}}}function zr(t){let e,n=t[9],r=[];for(let e=0;e<n.length;e+=1)r[e]=Hr(Or(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=A()},m(t,n){for(let e=0;e<r.length;e+=1)r[e].m(t,n);v(t,e,n)},p(t,o){if(3698&o[0]){let s;for(n=t[9],s=0;s<n.length;s+=1){const i=Or(t,n,s);r[s]?r[s].p(i,o):(r[s]=Hr(i),r[s].c(),r[s].m(e.parentNode,e))}for(;s<r.length;s+=1)r[s].d(1);r.length=n.length}},d(t){w(r,t),t&&b(e)}}}function Gr(t){let e,n,r,o,i,a,c,l,u,p=t[2].rangeMoves+"";return{c(){e=C("div"),n=C("h2"),r=x("Game State at Move: "),o=x(p),i=P(),a=C("input"),S(n,"id","rangeBar"),S(n,"class","svelte-12fbbq6"),S(a,"class","custom-range svelte-12fbbq6"),a.disabled=c=!t[2].paused,S(a,"type","range"),S(a,"min","0"),S(a,"max",l=t[2].numMoves),S(a,"step","1"),S(e,"id","state"),S(e,"class","svelte-12fbbq6")},m(c,l,p){v(c,e,l),g(e,n),g(n,r),g(n,o),g(e,i),g(e,a),$(a,t[2].rangeMoves),p&&s(u),u=[B(a,"change",t[12]),B(a,"change",t[35]),B(a,"input",t[35])]},p(t,e){4&e[0]&&p!==(p=t[2].rangeMoves+"")&&F(o,p),4&e[0]&&c!==(c=!t[2].paused)&&(a.disabled=c),4&e[0]&&l!==(l=t[2].numMoves)&&S(a,"max",l),4&e[0]&&$(a,t[2].rangeMoves)},d(t){t&&b(e),s(u)}}}function Jr(e){let n,r,o;return{c(){n=C("button"),n.textContent="Start Game",r=x("\\"),S(n,"class","btn btn-success pause svelte-12fbbq6")},m(t,s,i){v(t,n,s),v(t,r,s),i&&o(),o=B(n,"click",e[14])},p:t,d(t){t&&b(n),t&&b(r),o()}}}function Xr(e){let n,r,o,i;return{c(){n=C("button"),n.textContent="Switch Turn",r=P(),o=C("button"),o.textContent="Save Game",S(n,"class","btn btn-info switch svelte-12fbbq6"),S(o,"class","btn btn-primary save svelte-12fbbq6")},m(t,a,c){v(t,n,a),v(t,r,a),v(t,o,a),c&&s(i),i=[B(n,"click",e[13]),B(o,"click",e[36])]},p:t,d(t){t&&b(n),t&&b(r),t&&b(o),s(i)}}}function Wr(t){let e,n,r,o,s,i,a,c,l,u,p,h,f,d,m,y,B,E,$,N=t[2].numMoves+"",T=t[2].pri==t[3].name&&null==t[2].sec&&t[7]<800&&0==t[2].numMoves&&jr(t);function _(t,e){return"black"==t[2].currPlayer?Dr:"red"==t[2].currPlayer?qr:void 0}let M=_(t),R=M&&M(t),O=t[7]>800&&function(t){let e,n,r,o=t[2].timer+"";return{c(){e=C("h2"),n=x("Timer: "),r=x(o),S(e,"id","time"),S(e,"class","svelte-12fbbq6")},m(t,o){v(t,e,o),g(e,n),g(e,r)},p(t,e){4&e[0]&&o!==(o=t[2].timer+"")&&F(r,o)},d(t){t&&b(e)}}}(t),I=t[9],j=[];for(let e=0;e<I.length;e+=1)j[e]=zr(Ir(t,I,e));let q=t[7]<=800&&function(t){let e,n,r,o=t[2].timer+"";return{c(){e=C("h1"),n=x("Timer: "),r=x(o),S(e,"id","time"),S(e,"class","svelte-12fbbq6")},m(t,o){v(t,e,o),g(e,n),g(e,r)},p(t,e){4&e[0]&&o!==(o=t[2].timer+"")&&F(r,o)},d(t){t&&b(e)}}}(t),D=t[2].finished&&Gr(t),U=t[2].paused&&t[2].side==t[2].currPlayer&&null!=t[2].pri&&null!=t[2].sec&&Jr(t),L=t[2].side==t[2].currPlayer&&t[2].numMoves>0&&Xr(t);return{c(){T&&T.c(),e=P(),n=C("h2"),n.textContent="Current Player:",r=P(),R&&R.c(),o=P(),s=C("h2"),i=x("Moves: "),a=x(N),c=P(),O&&O.c(),l=P(),u=C("div"),p=k("svg");for(let t=0;t<j.length;t+=1)j[t].c();var t,g;h=k("use"),f=k("svg"),d=P(),q&&q.c(),m=P(),D&&D.c(),y=P(),U&&U.c(),B=P(),L&&L.c(),E=A(),S(n,"id","player"),S(n,"class","svelte-12fbbq6"),S(s,"id","moves"),S(s,"class","svelte-12fbbq6"),S(h,"id","use"),t="xlink:href",g="#24",h.setAttributeNS("http://www.w3.org/1999/xlink",t,g),S(p,"id","hover"),S(p,"class","svelte-12fbbq6"),S(u,"id","board"),S(u,"class","svelte-12fbbq6")},m(t,b){T&&T.m(t,b),v(t,e,b),v(t,n,b),v(t,r,b),R&&R.m(t,b),v(t,o,b),v(t,s,b),g(s,i),g(s,a),v(t,c,b),O&&O.m(t,b),v(t,l,b),v(t,u,b),g(u,p);for(let t=0;t<j.length;t+=1)j[t].m(p,null);g(p,h),g(p,f),v(t,d,b),q&&q.m(t,b),v(t,m,b),D&&D.m(t,b),v(t,y,b),U&&U.m(t,b),v(t,B,b),L&&L.m(t,b),v(t,E,b),$=!0},p(t,n){if(t[2].pri==t[3].name&&null==t[2].sec&&t[7]<800&&0==t[2].numMoves?T?(T.p(t,n),12&n[0]&&nt(T,1)):(T=jr(t),T.c(),nt(T,1),T.m(e.parentNode,e)):T&&(tt(),rt(T,1,1,()=>{T=null}),et()),M!==(M=_(t))&&(R&&R.d(1),R=M&&M(t),R&&(R.c(),R.m(o.parentNode,o))),(!$||4&n[0])&&N!==(N=t[2].numMoves+"")&&F(a,N),t[7]>800&&O.p(t,n),3698&n[0]){let e;for(I=t[9],e=0;e<I.length;e+=1){const r=Ir(t,I,e);j[e]?j[e].p(r,n):(j[e]=zr(r),j[e].c(),j[e].m(p,h))}for(;e<j.length;e+=1)j[e].d(1);j.length=I.length}t[7]<=800&&q.p(t,n),t[2].finished?D?D.p(t,n):(D=Gr(t),D.c(),D.m(y.parentNode,y)):D&&(D.d(1),D=null),t[2].paused&&t[2].side==t[2].currPlayer&&null!=t[2].pri&&null!=t[2].sec?U?U.p(t,n):(U=Jr(t),U.c(),U.m(B.parentNode,B)):U&&(U.d(1),U=null),t[2].side==t[2].currPlayer&&t[2].numMoves>0?L?L.p(t,n):(L=Xr(t),L.c(),L.m(E.parentNode,E)):L&&(L.d(1),L=null)},i(t){$||(nt(T),$=!0)},o(t){rt(T),$=!1},d(t){T&&T.d(t),t&&b(e),t&&b(n),t&&b(r),R&&R.d(t),t&&b(o),t&&b(s),t&&b(c),O&&O.d(t),t&&b(l),t&&b(u),w(j,t),t&&b(d),q&&q.d(t),t&&b(m),D&&D.d(t),t&&b(y),U&&U.d(t),t&&b(B),L&&L.d(t),t&&b(E)}}}function Yr(e,n,r){let o,s,i,a,u,p,h,f,d=t,m=()=>(d(),d=c(g,t=>r(6,f=t)),g);l(e,Un,t=>r(2,o=t)),l(e,Rn,t=>r(3,s=t)),l(e,Mn,t=>r(25,i=t)),l(e,qn,t=>r(4,a=t)),l(e,Dn,t=>r(26,u=t)),l(e,Ln,t=>r(27,p=t)),e.$$.on_destroy.push(()=>d()),o.pri==s.name&&null==o.currPlayer&&null==o.sec&&Un.update(t=>(t.currPlayer=0==Math.floor(2*Math.random())?"red":"black",t));let y,g,v=null,b=null,w=o.time,C=!1,k=screen.width;m();const x=kr([]);l(e,x,t=>r(5,h=t));let P,A,B,S,F=o.numMoves;i.emit("set-username",s.name),i.emit("join-room",o.id,s.name),screen.width<=800?(B=800/(screen.width-12.5),P=Math.floor((screen.width-10)/8),screen.width>=500?m(g=kr(25)):m(g=kr(12.5)),A=8*P,y=screen.width):(screen.height>=800?(B=1,m(g=kr(30)),P=100):(P=10*Math.floor(screen.height/100),B=1e3/(10*P),m(g=kr(25))),A=8*P,y=.8*(screen.width-800),S=.2*(screen.width-800)-40),i.on("piece-move",async t=>{if(console.log(t),null!=t.remove){let e=await a.getPieceFromId(t.id);await a.removePiece(e)}let e=await a.getPieceFromId(t.id);await a.otherPlayerMove(e,t.xDiff,t.yDiff),await qn.set(a),u.push(a.saveBoardState()),await _(),await Un.update(e=>(e.numMoves=t.num,e.rangeMoves=t.range,e))}),document.documentElement.style.setProperty("--chat-width",y+"px"),document.documentElement.style.setProperty("--board-height",A+"px"),document.documentElement.style.setProperty("--btn-width",S+"px"),_();let $=setInterval(N,1e3);function N(){null!=v&&O(v),o.rangeMoves==o.numMoves&&0==o.paused&&(o.timer>0?Un.update(t=>(t.timer-=1,t.secondsPlayed+=1,t)):(clearInterval($),Un.update(t=>(t.currPlayer="red"==t.currPlayer?"black":"red",t.timer=t.time,t.secondsPlayed+=1,t)),v=null,b=null,C=!1,$=setInterval(N,1e3)))}function T(t){let e=t.xPos,n=t.yPos,r=a.getId(e,n);x.update(t=>(t[r].x=(e+e+1)*(50/B),t[r].y=(n+n+1)*(50/B),t))}function _(){for(let t=0;t<8;t++)for(let e=0;e<8;e++)if(!a.isEmpty(t,e)){let n=a.getId(t,e);x.update(r=>(r[n]={},r[n].x=(t+t+1)*(50/B),r[n].y=(e+e+1)*(50/B),r))}}function M(t,e,n){if(console.log(t+", "+e),o.currPlayer==o.side&&0==C&&o.rangeMoves==o.numMoves&&0==o.paused&&null!=o.sec){let r,i,c=document.getElementById(a.getId(t,e));if("black"==a.getSide(t,e)&&s.name==o.sec){for(r=document.getElementsByClassName("black"),i=0;i<r.length;++i)r[i].setAttribute("style","fill:black");c.setAttribute("style","fill:grey")}if("red"==a.getSide(t,e)&&s.name==o.pri){for(r=document.getElementsByClassName("red"),i=0;i<r.length;++i)r[i].setAttribute("style","fill:red");c.setAttribute("style","fill:pink")}let l=n.target||event.target;document.getElementById("use").setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","#"+l.id),v=a.getPiece(t,e)}}function R(t,e){if(console.log(t+", "+e),a.isEmpty(t,e)&&null!=v&&o.rangeMoves==o.numMoves){b=new Nn(t,e,"E");let n=a.doMove(v,b);if(console.log(n.move),qn.set(a),console.log(a),n.move){Un.update(t=>(t.numMoves+=1,t.rangeMoves+=1,t)),C=!0;let r={id:a.getId(t,e),xDiff:v.getPosition().xPos-b.xPos,yDiff:v.getPosition().yPos-b.yPos,remove:n.id,num:o.numMoves,range:o.rangeMoves,room:o.id};i.emit("piece-move",r),T(b),u.push(a.saveBoardState()),v=a.getPiece(b.xPos,b.yPos)}}}function O(t){let e=t.getPosition().xPos,n=t.getPosition().yPos,r=document.getElementById(a.getId(e,n));"black"==a.getSide(e,n)&&r.setAttribute("style","fill:grey"),"red"==a.getSide(e,n)&&r.setAttribute("style","fill:pink")}function I(t){if(o.side==o.currPlayer&&o.numMoves>0){clearInterval($);let e={func:"saveGame",gameID:o.id,gameHistory:JSON.stringify(u),chatHistory:JSON.stringify(p),pri:o.pri==s.name,sec:o.sec==s.name,minutes:Math.floor(o.secondsPlayed/60),currPlayer:o.currPlayer,auto:t,saved:!1};t?$=setInterval(N,1e3):(i.emit("saveGame",e),On.set(0))}}setInterval((function(){o.numMoves>F&&(I(!0),F=o.numMoves)}),3e5);return[g,P,o,s,a,h,f,k,x,[0,1,2,3,4,5,6,7],M,R,function(){qn.set(new _n(u[o.rangeMoves],null)),_()},function(){if(o.side==o.currPlayer){let t,e;if(clearInterval($),"black"==o.currPlayer)for(t=document.getElementsByClassName("black"),e=0;e<t.length;++e)t[e].setAttribute("style","fill:black");if("red"==o.currPlayer)for(t=document.getElementsByClassName("red"),e=0;e<t.length;++e)t[e].setAttribute("style","fill:red");Un.update(t=>(t.currPlayer="red"==t.currPlayer?"black":"red",t.timer=w,t)),i.emit("current-player",{player:o.currPlayer,room:o.id}),v=null,b=null,C=!1,$=setInterval(N,1e3)}},function(){o.side==o.currPlayer&&(Un.update(t=>(t.paused=!t.paused,t)),i.emit("paused",{paused:o.paused,room:o.id}))},I,v,b,C,y,A,B,S,F,$,i,u,p,w,N,T,_,O,(t,e)=>M(t,e,event),(t,e)=>R(t,e),function(){o.rangeMoves=E(this.value),Un.set(o)},()=>I(!1)]}class Vr extends pt{constructor(t){super(),ut(this,t,Yr,Wr,a,{},[-1,-1])}}function Kr(e){let n,r,o,i,a,c,l;return{c(){n=C("div"),r=C("table"),o=C("tr"),i=C("td"),i.innerHTML='<i class="fa fa-qrcode svelte-nu81iu"></i> \n                <span class="svelte-nu81iu">Game</span>',a=P(),c=C("td"),c.innerHTML='<i class="fa fa-comments svelte-nu81iu"></i> \n                <span class="svelte-nu81iu">Chat</span>',S(i,"class","tabIndex"),S(i,"align","center"),S(c,"class","tabIndex"),S(c,"align","center"),S(o,"height","50"),S(r,"id","sidebar-inner-mob"),S(r,"cellpadding","10"),S(r,"class","svelte-nu81iu"),S(n,"id","sidebar-outer-mob"),S(n,"class","svelte-nu81iu")},m(t,u,p){v(t,n,u),g(n,r),g(r,o),g(o,i),g(o,a),g(o,c),p&&s(l),l=[B(i,"click",e[1]),B(c,"click",e[2])]},p:t,i:t,o:t,d(t){t&&b(n),s(l)}}}function Zr(t){function e(t){In.set(t)}return[e,()=>e(0),()=>e(1)]}class Qr extends pt{constructor(t){super(),ut(this,t,Zr,Kr,a,{})}}function to(t,e,n){let r,o,s,i,a;return l(t,Mn,t=>n(0,r=t)),l(t,Un,t=>n(1,o=t)),l(t,Rn,t=>n(2,s=t)),l(t,Ln,t=>n(3,i=t)),l(t,Dn,t=>n(4,a=t)),r.on("chat message",t=>{console.log("Received: "+t.msg),Ln.update(e=>(e.push(t),e))}),r.on("second-user",t=>{null==o.sec&&null!=o.currPlayer&&(console.log("Received second player"),Un.update(e=>(e.sec=t,e)),r.emit("current-player",{player:o.currPlayer,room:o.id}),r.emit("first-user",{room:o.id,name:s.name}),screen.width<800?In.set(0):i[0].msg.includes(o.id)&&Ln.set([]))}),r.on("first-user",t=>{null==o.pri&&null!=o.currPlayer&&(console.log("Received first player"),Un.update(e=>(e.pri=t,e)),r.emit("current-player",{player:o.currPlayer,room:o.id}),screen.width<800?In.set(0):i[0].msg.includes(o.id)&&Ln.set([]))}),r.on("current-player",t=>{console.log("Received current player"),Un.update(e=>(e.timer=e.time,e.currPlayer=t,e)),console.log(o.currPlayer)}),r.on("paused",t=>{Un.update(e=>(e.paused=t,e))}),r.on("saveGame",t=>{let e={func:"saveGame",gameID:o.id,gameHistory:JSON.stringify(a),chatHistory:JSON.stringify(i),pri:o.pri==s.name,sec:o.sec==s.name,minutes:Math.floor(o.secondsPlayed/60),currPlayer:o.currPlayer,auto:t.auto,saved:!0};r.emit("saveGame",e),t.auto||On.set(0)}),[]}class eo extends pt{constructor(t){super(),ut(this,t,to,null,a,{})}}function no(t){let e;const n=new Rr({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function ro(t){let e;const n=new Vr({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function oo(t){let e,n,r,o;const s=new eo({});let i=t[1]>800&&function(t){let e,n;const r=new Vr({}),o=new Rr({});return{c(){it(r.$$.fragment),e=P(),it(o.$$.fragment)},m(t,s){at(r,t,s),v(t,e,s),at(o,t,s),n=!0},i(t){n||(nt(r.$$.fragment,t),nt(o.$$.fragment,t),n=!0)},o(t){rt(r.$$.fragment,t),rt(o.$$.fragment,t),n=!1},d(t){ct(r,t),t&&b(e),ct(o,t)}}}(),a=t[1]<=800&&function(t){let e,n,r,o;const s=[ro,no],i=[];function a(t,e){return 0==t[0]?0:1==t[0]?1:-1}~(e=a(t))&&(n=i[e]=s[e](t));const c=new Qr({});return{c(){n&&n.c(),r=P(),it(c.$$.fragment)},m(t,n){~e&&i[e].m(t,n),v(t,r,n),at(c,t,n),o=!0},p(t,o){let c=e;e=a(t),e!==c&&(n&&(tt(),rt(i[c],1,1,()=>{i[c]=null}),et()),~e?(n=i[e],n||(n=i[e]=s[e](t),n.c()),nt(n,1),n.m(r.parentNode,r)):n=null)},i(t){o||(nt(n),nt(c.$$.fragment,t),o=!0)},o(t){rt(n),rt(c.$$.fragment,t),o=!1},d(t){~e&&i[e].d(t),t&&b(r),ct(c,t)}}}(t);return{c(){it(s.$$.fragment),e=P(),i&&i.c(),n=P(),a&&a.c(),r=A()},m(t,c){at(s,t,c),v(t,e,c),i&&i.m(t,c),v(t,n,c),a&&a.m(t,c),v(t,r,c),o=!0},p(t,[e]){t[1]<=800&&a.p(t,e)},i(t){o||(nt(s.$$.fragment,t),nt(i),nt(a),o=!0)},o(t){rt(s.$$.fragment,t),rt(i),rt(a),o=!1},d(t){ct(s,t),t&&b(e),i&&i.d(t),t&&b(n),a&&a.d(t),t&&b(r)}}}function so(t,e,n){let r;l(t,In,t=>n(0,r=t));let o=screen.width;return[r,o]}class io extends pt{constructor(t){super(),ut(this,t,so,oo,a,{})}}class ao{constructor(t){this.isAuth=!0,this.name=t.name,this.email=t.email,this.picture=null==t.picture?"https://source.unsplash.com/900x900/":t.picture,this.wins=t.wins,this.draws=t.draws,this.losses=t.losses,this.gamesPlayed=t.gamesPlayed,this.leastMoves=t.leastMoves,this.mostMoves=t.mostMoves,this.totalMoves=t.totalMoves,this.avgMovesPerGame=t.avgMovesPerGame,this.leastTimePlayed=t.leastTimePlayed,this.mostTimePlayed=t.mostTimePlayed,this.totalTimePlayed=t.totalTimePlayed,this.avgTimePlayPerGame=t.avgTimePlayPerGame,this.totalPoints=t.totalPoints}}function co(t){let e,n,r,o,i,a,c,l,u,p,h,f,d,m;return{c(){e=C("input"),n=P(),r=C("input"),o=P(),i=C("input"),a=P(),c=C("input"),l=P(),u=C("button"),u.textContent="Sign Up",p=P(),h=C("h5"),f=x("Already have an Account? "),d=C("span"),d.textContent="Sign In",S(e,"id","Name"),S(e,"placeholder","Display Name"),S(e,"class","svelte-1ky7wjy"),S(r,"id","Email"),S(r,"placeholder","Email"),S(r,"class","svelte-1ky7wjy"),S(i,"id","Password"),S(i,"placeholder","Password"),S(i,"class","svelte-1ky7wjy"),S(c,"id","confirmPassword"),S(c,"placeholder","Confirm Password"),S(c,"class","svelte-1ky7wjy"),S(u,"class","btn btn-success svelte-1ky7wjy"),S(d,"class","svelte-1ky7wjy"),S(h,"class","svelte-1ky7wjy")},m(y,b,w){v(y,e,b),$(e,t[1]),v(y,n,b),v(y,r,b),$(r,t[0]),v(y,o,b),v(y,i,b),$(i,t[2]),v(y,a,b),v(y,c,b),$(c,t[3]),v(y,l,b),v(y,u,b),v(y,p,b),v(y,h,b),g(h,f),g(h,d),w&&s(m),m=[B(e,"input",t[15]),B(r,"input",t[16]),B(i,"input",t[17]),B(c,"input",t[18]),B(u,"click",t[7]),B(d,"click",t[19])]},p(t,n){2&n&&e.value!==t[1]&&$(e,t[1]),1&n&&r.value!==t[0]&&$(r,t[0]),4&n&&i.value!==t[2]&&$(i,t[2]),8&n&&c.value!==t[3]&&$(c,t[3])},d(t){t&&b(e),t&&b(n),t&&b(r),t&&b(o),t&&b(i),t&&b(a),t&&b(c),t&&b(l),t&&b(u),t&&b(p),t&&b(h),s(m)}}}function lo(t){let e,n,r,o,i,a,c,l,u,p,h,f;return{c(){e=C("input"),n=P(),r=C("input"),o=P(),i=C("button"),i.textContent="Log In",a=P(),c=C("h5"),l=x("Don't have an Account? "),u=C("span"),u.textContent="Sign Up",p=P(),h=C("hr"),S(e,"id","logEmail"),S(e,"placeholder","Email"),S(e,"class","svelte-1ky7wjy"),S(r,"id","logPassword"),S(r,"placeholder","Password"),S(r,"class","svelte-1ky7wjy"),S(i,"class","btn btn-success svelte-1ky7wjy"),S(u,"class","svelte-1ky7wjy"),S(c,"class","svelte-1ky7wjy")},m(d,m,y){v(d,e,m),$(e,t[4]),v(d,n,m),v(d,r,m),$(r,t[5]),v(d,o,m),v(d,i,m),v(d,a,m),v(d,c,m),g(c,l),g(c,u),v(d,p,m),v(d,h,m),y&&s(f),f=[B(e,"input",t[12]),B(r,"input",t[13]),B(i,"click",t[8]),B(u,"click",t[14])]},p(t,n){16&n&&e.value!==t[4]&&$(e,t[4]),32&n&&r.value!==t[5]&&$(r,t[5])},d(t){t&&b(e),t&&b(n),t&&b(r),t&&b(o),t&&b(i),t&&b(a),t&&b(c),t&&b(p),t&&b(h),s(f)}}}function uo(e){let n,r,o,s,i,a;function c(t,e){return t[6]?lo:co}let l=c(e),u=l(e);return{c(){n=C("div"),r=C("h3"),r.textContent="Welcome To Checkas.io",o=P(),u.c(),s=P(),i=C("img"),S(r,"class","svelte-1ky7wjy"),S(n,"id","entry"),S(n,"class","container svelte-1ky7wjy"),S(i,"id","back-image"),S(i,"alt","checker"),i.src!==(a="./images/checkers.jpg")&&S(i,"src","./images/checkers.jpg"),S(i,"class","svelte-1ky7wjy")},m(t,e){v(t,n,e),g(n,r),g(n,o),u.m(n,null),v(t,s,e),v(t,i,e)},p(t,[e]){l===(l=c(t))&&u?u.p(t,e):(u.d(1),u=l(t),u&&(u.c(),u.m(n,null)))},i:t,o:t,d(t){t&&b(n),u.d(),t&&b(s),t&&b(i)}}}function po(t,e,n){let r,o,s,i,a,c,l,u=!0;function p(){Hn(l).then(t=>{console.log(t),"SUCCESS"==t.msg?console.log("Verify Email"):console.log(t.err)}).catch(t=>{console.log(t)})}function h(){Hn(l).then(t=>{if(null!=t.msg){let e=t.msg;e.email=a,Rn.set(new ao(e)),n(0,r=""),n(1,o=""),n(2,s=""),n(3,i=""),n(4,a=""),n(5,c="")}else console.log(t.err)}).catch(t=>{console.log(t)})}return[r,o,s,i,a,c,u,function(){null!=r&&null!=o&&null!=s&&null!=i&&s==i&&(l={func:"signUp",email:r,name:o,password:s},Hn(l).then(t=>{console.log(t),"SUCCESS"==t.msg?(l.func="createUser",p()):console.log(t.err)}).catch(t=>{console.log(t)}))},function(){null!=a&&null!=c&&(l={func:"signIn",email:a,password:c},Hn(l).then(t=>{null!=t.msg&&t.msg?(l.func="retrieveUser",h()):null==t.msg||t.msg?console.log(t.err):console.log("Unverified Email")}).catch(t=>{console.log(t)}))},l,p,h,function(){a=this.value,n(4,a)},function(){c=this.value,n(5,c)},()=>n(6,u=!u),function(){o=this.value,n(1,o)},function(){r=this.value,n(0,r)},function(){s=this.value,n(2,s)},function(){i=this.value,n(3,i)},()=>n(6,u=!u)]}class ho extends pt{constructor(t){super(),ut(this,t,po,uo,a,{})}}function fo(e){let n;const r=new ho({});return{c(){it(r.$$.fragment)},m(t,e){at(r,t,e),n=!0},p:t,i(t){n||(nt(r.$$.fragment,t),n=!0)},o(t){rt(r.$$.fragment,t),n=!1},d(t){ct(r,t)}}}function mo(t){let e,n,r,o=0==t[1]&&yo(),s=1==t[1]&&go();return{c(){o&&o.c(),e=P(),s&&s.c(),n=A()},m(t,i){o&&o.m(t,i),v(t,e,i),s&&s.m(t,i),v(t,n,i),r=!0},p(t,r){0==t[1]?o?2&r&&nt(o,1):(o=yo(),o.c(),nt(o,1),o.m(e.parentNode,e)):o&&(tt(),rt(o,1,1,()=>{o=null}),et()),1==t[1]?s?2&r&&nt(s,1):(s=go(),s.c(),nt(s,1),s.m(n.parentNode,n)):s&&(tt(),rt(s,1,1,()=>{s=null}),et())},i(t){r||(nt(o),nt(s),r=!0)},o(t){rt(o),rt(s),r=!1},d(t){o&&o.d(t),t&&b(e),s&&s.d(t),t&&b(n)}}}function yo(t){let e;const n=new wr({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function go(t){let e;const n=new io({});return{c(){it(n.$$.fragment)},m(t,r){at(n,t,r),e=!0},i(t){e||(nt(n.$$.fragment,t),e=!0)},o(t){rt(n.$$.fragment,t),e=!1},d(t){ct(n,t)}}}function vo(t){let e,n,r,o;const s=[mo,fo],i=[];function a(t,e){return null!=t[0]&&t[0].isAuth?0:1}return e=a(t),n=i[e]=s[e](t),{c(){n.c(),r=A()},m(t,n){i[e].m(t,n),v(t,r,n),o=!0},p(t,[o]){let c=e;e=a(t),e===c?i[e].p(t,o):(tt(),rt(i[c],1,1,()=>{i[c]=null}),et(),n=i[e],n||(n=i[e]=s[e](t),n.c()),nt(n,1),n.m(r.parentNode,r))},i(t){o||(nt(n),o=!0)},o(t){rt(n),o=!1},d(t){i[e].d(t),t&&b(r)}}}function bo(t,e,n){let r,o;return l(t,Rn,t=>n(0,r=t)),l(t,On,t=>n(1,o=t)),[r,o]}return new class extends pt{constructor(t){super(),ut(this,t,bo,vo,a,{})}}({target:document.body})}();
=======

(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
    }

    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */

    var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];

    var parseuri = function parseuri(str) {
        var src = str,
            b = str.indexOf('['),
            e = str.indexOf(']');

        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }

        var m = re.exec(str || ''),
            uri = {},
            i = 14;

        while (i--) {
            uri[parts[i]] = m[i] || '';
        }

        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }

        return uri;
    };

    /**
     * Helpers.
     */

    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'weeks':
        case 'week':
        case 'w':
          return n * w;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
      }
      return ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
    }

    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     */

    function setup(env) {
    	createDebug.debug = createDebug;
    	createDebug.default = createDebug;
    	createDebug.coerce = coerce;
    	createDebug.disable = disable;
    	createDebug.enable = enable;
    	createDebug.enabled = enabled;
    	createDebug.humanize = ms;

    	Object.keys(env).forEach(key => {
    		createDebug[key] = env[key];
    	});

    	/**
    	* Active `debug` instances.
    	*/
    	createDebug.instances = [];

    	/**
    	* The currently active debug mode names, and names to skip.
    	*/

    	createDebug.names = [];
    	createDebug.skips = [];

    	/**
    	* Map of special "%n" handling functions, for the debug "format" argument.
    	*
    	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
    	*/
    	createDebug.formatters = {};

    	/**
    	* Selects a color for a debug namespace
    	* @param {String} namespace The namespace string for the for the debug instance to be colored
    	* @return {Number|String} An ANSI color code for the given namespace
    	* @api private
    	*/
    	function selectColor(namespace) {
    		let hash = 0;

    		for (let i = 0; i < namespace.length; i++) {
    			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
    			hash |= 0; // Convert to 32bit integer
    		}

    		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    	}
    	createDebug.selectColor = selectColor;

    	/**
    	* Create a debugger with the given `namespace`.
    	*
    	* @param {String} namespace
    	* @return {Function}
    	* @api public
    	*/
    	function createDebug(namespace) {
    		let prevTime;

    		function debug(...args) {
    			// Disabled?
    			if (!debug.enabled) {
    				return;
    			}

    			const self = debug;

    			// Set `diff` timestamp
    			const curr = Number(new Date());
    			const ms = curr - (prevTime || curr);
    			self.diff = ms;
    			self.prev = prevTime;
    			self.curr = curr;
    			prevTime = curr;

    			args[0] = createDebug.coerce(args[0]);

    			if (typeof args[0] !== 'string') {
    				// Anything else let's inspect with %O
    				args.unshift('%O');
    			}

    			// Apply any `formatters` transformations
    			let index = 0;
    			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
    				// If we encounter an escaped % then don't increase the array index
    				if (match === '%%') {
    					return match;
    				}
    				index++;
    				const formatter = createDebug.formatters[format];
    				if (typeof formatter === 'function') {
    					const val = args[index];
    					match = formatter.call(self, val);

    					// Now we need to remove `args[index]` since it's inlined in the `format`
    					args.splice(index, 1);
    					index--;
    				}
    				return match;
    			});

    			// Apply env-specific formatting (colors, etc.)
    			createDebug.formatArgs.call(self, args);

    			const logFn = self.log || createDebug.log;
    			logFn.apply(self, args);
    		}

    		debug.namespace = namespace;
    		debug.enabled = createDebug.enabled(namespace);
    		debug.useColors = createDebug.useColors();
    		debug.color = selectColor(namespace);
    		debug.destroy = destroy;
    		debug.extend = extend;
    		// Debug.formatArgs = formatArgs;
    		// debug.rawLog = rawLog;

    		// env-specific initialization logic for debug instances
    		if (typeof createDebug.init === 'function') {
    			createDebug.init(debug);
    		}

    		createDebug.instances.push(debug);

    		return debug;
    	}

    	function destroy() {
    		const index = createDebug.instances.indexOf(this);
    		if (index !== -1) {
    			createDebug.instances.splice(index, 1);
    			return true;
    		}
    		return false;
    	}

    	function extend(namespace, delimiter) {
    		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    		newDebug.log = this.log;
    		return newDebug;
    	}

    	/**
    	* Enables a debug mode by namespaces. This can include modes
    	* separated by a colon and wildcards.
    	*
    	* @param {String} namespaces
    	* @api public
    	*/
    	function enable(namespaces) {
    		createDebug.save(namespaces);

    		createDebug.names = [];
    		createDebug.skips = [];

    		let i;
    		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    		const len = split.length;

    		for (i = 0; i < len; i++) {
    			if (!split[i]) {
    				// ignore empty strings
    				continue;
    			}

    			namespaces = split[i].replace(/\*/g, '.*?');

    			if (namespaces[0] === '-') {
    				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    			} else {
    				createDebug.names.push(new RegExp('^' + namespaces + '$'));
    			}
    		}

    		for (i = 0; i < createDebug.instances.length; i++) {
    			const instance = createDebug.instances[i];
    			instance.enabled = createDebug.enabled(instance.namespace);
    		}
    	}

    	/**
    	* Disable debug output.
    	*
    	* @return {String} namespaces
    	* @api public
    	*/
    	function disable() {
    		const namespaces = [
    			...createDebug.names.map(toNamespace),
    			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
    		].join(',');
    		createDebug.enable('');
    		return namespaces;
    	}

    	/**
    	* Returns true if the given mode name is enabled, false otherwise.
    	*
    	* @param {String} name
    	* @return {Boolean}
    	* @api public
    	*/
    	function enabled(name) {
    		if (name[name.length - 1] === '*') {
    			return true;
    		}

    		let i;
    		let len;

    		for (i = 0, len = createDebug.skips.length; i < len; i++) {
    			if (createDebug.skips[i].test(name)) {
    				return false;
    			}
    		}

    		for (i = 0, len = createDebug.names.length; i < len; i++) {
    			if (createDebug.names[i].test(name)) {
    				return true;
    			}
    		}

    		return false;
    	}

    	/**
    	* Convert regexp to namespace
    	*
    	* @param {RegExp} regxep
    	* @return {String} namespace
    	* @api private
    	*/
    	function toNamespace(regexp) {
    		return regexp.toString()
    			.substring(2, regexp.toString().length - 2)
    			.replace(/\.\*\?$/, '*');
    	}

    	/**
    	* Coerce `val`.
    	*
    	* @param {Mixed} val
    	* @return {Mixed}
    	* @api private
    	*/
    	function coerce(val) {
    		if (val instanceof Error) {
    			return val.stack || val.message;
    		}
    		return val;
    	}

    	createDebug.enable(createDebug.load());

    	return createDebug;
    }

    var common = setup;

    var browser = createCommonjsModule(function (module, exports) {
    /* eslint-env browser */

    /**
     * This is the web browser implementation of `debug()`.
     */

    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();

    /**
     * Colors.
     */

    exports.colors = [
    	'#0000CC',
    	'#0000FF',
    	'#0033CC',
    	'#0033FF',
    	'#0066CC',
    	'#0066FF',
    	'#0099CC',
    	'#0099FF',
    	'#00CC00',
    	'#00CC33',
    	'#00CC66',
    	'#00CC99',
    	'#00CCCC',
    	'#00CCFF',
    	'#3300CC',
    	'#3300FF',
    	'#3333CC',
    	'#3333FF',
    	'#3366CC',
    	'#3366FF',
    	'#3399CC',
    	'#3399FF',
    	'#33CC00',
    	'#33CC33',
    	'#33CC66',
    	'#33CC99',
    	'#33CCCC',
    	'#33CCFF',
    	'#6600CC',
    	'#6600FF',
    	'#6633CC',
    	'#6633FF',
    	'#66CC00',
    	'#66CC33',
    	'#9900CC',
    	'#9900FF',
    	'#9933CC',
    	'#9933FF',
    	'#99CC00',
    	'#99CC33',
    	'#CC0000',
    	'#CC0033',
    	'#CC0066',
    	'#CC0099',
    	'#CC00CC',
    	'#CC00FF',
    	'#CC3300',
    	'#CC3333',
    	'#CC3366',
    	'#CC3399',
    	'#CC33CC',
    	'#CC33FF',
    	'#CC6600',
    	'#CC6633',
    	'#CC9900',
    	'#CC9933',
    	'#CCCC00',
    	'#CCCC33',
    	'#FF0000',
    	'#FF0033',
    	'#FF0066',
    	'#FF0099',
    	'#FF00CC',
    	'#FF00FF',
    	'#FF3300',
    	'#FF3333',
    	'#FF3366',
    	'#FF3399',
    	'#FF33CC',
    	'#FF33FF',
    	'#FF6600',
    	'#FF6633',
    	'#FF9900',
    	'#FF9933',
    	'#FFCC00',
    	'#FFCC33'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    // eslint-disable-next-line complexity
    function useColors() {
    	// NB: In an Electron preload script, document will be defined but not fully
    	// initialized. Since we know we're in Chrome, we'll just detect this case
    	// explicitly
    	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    		return true;
    	}

    	// Internet Explorer and Edge do not support colors.
    	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    		return false;
    	}

    	// Is webkit? http://stackoverflow.com/a/16459606/376773
    	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    		// Is firebug? http://stackoverflow.com/a/398120/376773
    		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    		// Is firefox >= v31?
    		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    		// Double check webkit in userAgent just in case we are in a worker
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
    	args[0] = (this.useColors ? '%c' : '') +
    		this.namespace +
    		(this.useColors ? ' %c' : ' ') +
    		args[0] +
    		(this.useColors ? '%c ' : ' ') +
    		'+' + module.exports.humanize(this.diff);

    	if (!this.useColors) {
    		return;
    	}

    	const c = 'color: ' + this.color;
    	args.splice(1, 0, c, 'color: inherit');

    	// The final "%c" is somewhat tricky, because there could be other
    	// arguments passed either before or after the %c, so we need to
    	// figure out the correct index to insert the CSS into
    	let index = 0;
    	let lastC = 0;
    	args[0].replace(/%[a-zA-Z%]/g, match => {
    		if (match === '%%') {
    			return;
    		}
    		index++;
    		if (match === '%c') {
    			// We only are interested in the *last* %c
    			// (the user may have provided their own)
    			lastC = index;
    		}
    	});

    	args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */
    function log(...args) {
    	// This hackery is required for IE8/9, where
    	// the `console.log` function doesn't have 'apply'
    	return typeof console === 'object' &&
    		console.log &&
    		console.log(...args);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */
    function save(namespaces) {
    	try {
    		if (namespaces) {
    			exports.storage.setItem('debug', namespaces);
    		} else {
    			exports.storage.removeItem('debug');
    		}
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */
    function load() {
    	let r;
    	try {
    		r = exports.storage.getItem('debug');
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}

    	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    	if (!r && typeof process !== 'undefined' && 'env' in process) {
    		r = process.env.DEBUG;
    	}

    	return r;
    }

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
    	try {
    		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    		// The Browser also has localStorage in the global context.
    		return localStorage;
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    module.exports = common(exports);

    const {formatters} = module.exports;

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    formatters.j = function (v) {
    	try {
    		return JSON.stringify(v);
    	} catch (error) {
    		return '[UnexpectedJSONParseError]: ' + error.message;
    	}
    };
    });
    var browser_1 = browser.log;
    var browser_2 = browser.formatArgs;
    var browser_3 = browser.save;
    var browser_4 = browser.load;
    var browser_5 = browser.useColors;
    var browser_6 = browser.storage;
    var browser_7 = browser.colors;

    /**
     * Module dependencies.
     */


    var debug = browser('socket.io-client:url');

    /**
     * Module exports.
     */

    var url_1 = url;

    /**
     * URL parser.
     *
     * @param {String} url
     * @param {Object} An object meant to mimic window.location.
     *                 Defaults to window.location.
     * @api public
     */

    function url (uri, loc) {
      var obj = uri;

      // default to window.location
      loc = loc || (typeof location !== 'undefined' && location);
      if (null == uri) uri = loc.protocol + '//' + loc.host;

      // relative path support
      if ('string' === typeof uri) {
        if ('/' === uri.charAt(0)) {
          if ('/' === uri.charAt(1)) {
            uri = loc.protocol + uri;
          } else {
            uri = loc.host + uri;
          }
        }

        if (!/^(https?|wss?):\/\//.test(uri)) {
          debug('protocol-less url %s', uri);
          if ('undefined' !== typeof loc) {
            uri = loc.protocol + '//' + uri;
          } else {
            uri = 'https://' + uri;
          }
        }

        // parse
        debug('parse %s', uri);
        obj = parseuri(uri);
      }

      // make sure we treat `localhost:80` and `localhost` equally
      if (!obj.port) {
        if (/^(http|ws)$/.test(obj.protocol)) {
          obj.port = '80';
        } else if (/^(http|ws)s$/.test(obj.protocol)) {
          obj.port = '443';
        }
      }

      obj.path = obj.path || '/';

      var ipv6 = obj.host.indexOf(':') !== -1;
      var host = ipv6 ? '[' + obj.host + ']' : obj.host;

      // define unique id
      obj.id = obj.protocol + '://' + host + ':' + obj.port;
      // define href
      obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

      return obj;
    }

    /**
     * Helpers.
     */

    var s$1 = 1000;
    var m$1 = s$1 * 60;
    var h$1 = m$1 * 60;
    var d$1 = h$1 * 24;
    var y$1 = d$1 * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms$1 = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse$1(val);
      } else if (type === 'number' && isNaN(val) === false) {
        return options.long ? fmtLong$1(val) : fmtShort$1(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse$1(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y$1;
        case 'days':
        case 'day':
        case 'd':
          return n * d$1;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h$1;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m$1;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s$1;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort$1(ms) {
      if (ms >= d$1) {
        return Math.round(ms / d$1) + 'd';
      }
      if (ms >= h$1) {
        return Math.round(ms / h$1) + 'h';
      }
      if (ms >= m$1) {
        return Math.round(ms / m$1) + 'm';
      }
      if (ms >= s$1) {
        return Math.round(ms / s$1) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong$1(ms) {
      return plural$1(ms, d$1, 'day') ||
        plural$1(ms, h$1, 'hour') ||
        plural$1(ms, m$1, 'minute') ||
        plural$1(ms, s$1, 'second') ||
        ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural$1(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + ' ' + name;
      }
      return Math.ceil(ms / n) + ' ' + name + 's';
    }

    var debug$1 = createCommonjsModule(function (module, exports) {
    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = ms$1;

    /**
     * Active `debug` instances.
     */
    exports.instances = [];

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    exports.formatters = {};

    /**
     * Select a color.
     * @param {String} namespace
     * @return {Number}
     * @api private
     */

    function selectColor(namespace) {
      var hash = 0, i;

      for (i in namespace) {
        hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {

      var prevTime;

      function debug() {
        // disabled?
        if (!debug.enabled) return;

        var self = debug;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);
      debug.destroy = destroy;

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      exports.instances.push(debug);

      return debug;
    }

    function destroy () {
      var index = exports.instances.indexOf(this);
      if (index !== -1) {
        exports.instances.splice(index, 1);
        return true;
      } else {
        return false;
      }
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      exports.names = [];
      exports.skips = [];

      var i;
      var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
      var len = split.length;

      for (i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }

      for (i = 0; i < exports.instances.length; i++) {
        var instance = exports.instances[i];
        instance.enabled = exports.enabled(instance.namespace);
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      if (name[name.length - 1] === '*') {
        return true;
      }
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    });
    var debug_1 = debug$1.coerce;
    var debug_2 = debug$1.disable;
    var debug_3 = debug$1.enable;
    var debug_4 = debug$1.enabled;
    var debug_5 = debug$1.humanize;
    var debug_6 = debug$1.instances;
    var debug_7 = debug$1.names;
    var debug_8 = debug$1.skips;
    var debug_9 = debug$1.formatters;

    var browser$1 = createCommonjsModule(function (module, exports) {
    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = debug$1;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
      '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
      '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
      '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
      '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
      '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
      '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
      '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
      '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
      '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
      '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
        return true;
      }

      // Internet Explorer and Edge do not support colors.
      if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }

      // is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
      return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
        // double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return '[UnexpectedJSONParseError]: ' + err.message;
      }
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return;

      var c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit');

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch(e) {}

      // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
      if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
      }

      return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {}
    }
    });
    var browser_1$1 = browser$1.log;
    var browser_2$1 = browser$1.formatArgs;
    var browser_3$1 = browser$1.save;
    var browser_4$1 = browser$1.load;
    var browser_5$1 = browser$1.useColors;
    var browser_6$1 = browser$1.storage;
    var browser_7$1 = browser$1.colors;

    var componentEmitter = createCommonjsModule(function (module) {
    /**
     * Expose `Emitter`.
     */

    {
      module.exports = Emitter;
    }

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    });

    var toString = {}.toString;

    var isarray = Array.isArray || function (arr) {
      return toString.call(arr) == '[object Array]';
    };

    var isBuffer = isBuf;

    var withNativeBuffer = typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function';
    var withNativeArrayBuffer = typeof ArrayBuffer === 'function';

    var isView = function (obj) {
      return typeof ArrayBuffer.isView === 'function' ? ArrayBuffer.isView(obj) : (obj.buffer instanceof ArrayBuffer);
    };

    /**
     * Returns true if obj is a buffer or an arraybuffer.
     *
     * @api private
     */

    function isBuf(obj) {
      return (withNativeBuffer && Buffer.isBuffer(obj)) ||
              (withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)));
    }

    /*global Blob,File*/

    /**
     * Module requirements
     */



    var toString$1 = Object.prototype.toString;
    var withNativeBlob = typeof Blob === 'function' || (typeof Blob !== 'undefined' && toString$1.call(Blob) === '[object BlobConstructor]');
    var withNativeFile = typeof File === 'function' || (typeof File !== 'undefined' && toString$1.call(File) === '[object FileConstructor]');

    /**
     * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
     * Anything with blobs or files should be fed through removeBlobs before coming
     * here.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @api public
     */

    var deconstructPacket = function(packet) {
      var buffers = [];
      var packetData = packet.data;
      var pack = packet;
      pack.data = _deconstructPacket(packetData, buffers);
      pack.attachments = buffers.length; // number of binary 'attachments'
      return {packet: pack, buffers: buffers};
    };

    function _deconstructPacket(data, buffers) {
      if (!data) return data;

      if (isBuffer(data)) {
        var placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
      } else if (isarray(data)) {
        var newData = new Array(data.length);
        for (var i = 0; i < data.length; i++) {
          newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
      } else if (typeof data === 'object' && !(data instanceof Date)) {
        var newData = {};
        for (var key in data) {
          newData[key] = _deconstructPacket(data[key], buffers);
        }
        return newData;
      }
      return data;
    }

    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @api public
     */

    var reconstructPacket = function(packet, buffers) {
      packet.data = _reconstructPacket(packet.data, buffers);
      packet.attachments = undefined; // no longer useful
      return packet;
    };

    function _reconstructPacket(data, buffers) {
      if (!data) return data;

      if (data && data._placeholder) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
      } else if (isarray(data)) {
        for (var i = 0; i < data.length; i++) {
          data[i] = _reconstructPacket(data[i], buffers);
        }
      } else if (typeof data === 'object') {
        for (var key in data) {
          data[key] = _reconstructPacket(data[key], buffers);
        }
      }

      return data;
    }

    /**
     * Asynchronously removes Blobs or Files from data via
     * FileReader's readAsArrayBuffer method. Used before encoding
     * data as msgpack. Calls callback with the blobless data.
     *
     * @param {Object} data
     * @param {Function} callback
     * @api private
     */

    var removeBlobs = function(data, callback) {
      function _removeBlobs(obj, curKey, containingObject) {
        if (!obj) return obj;

        // convert any blob
        if ((withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File)) {
          pendingBlobs++;

          // async filereader
          var fileReader = new FileReader();
          fileReader.onload = function() { // this.result == arraybuffer
            if (containingObject) {
              containingObject[curKey] = this.result;
            }
            else {
              bloblessData = this.result;
            }

            // if nothing pending its callback time
            if(! --pendingBlobs) {
              callback(bloblessData);
            }
          };

          fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
        } else if (isarray(obj)) { // handle array
          for (var i = 0; i < obj.length; i++) {
            _removeBlobs(obj[i], i, obj);
          }
        } else if (typeof obj === 'object' && !isBuffer(obj)) { // and object
          for (var key in obj) {
            _removeBlobs(obj[key], key, obj);
          }
        }
      }

      var pendingBlobs = 0;
      var bloblessData = data;
      _removeBlobs(bloblessData);
      if (!pendingBlobs) {
        callback(bloblessData);
      }
    };

    var binary = {
    	deconstructPacket: deconstructPacket,
    	reconstructPacket: reconstructPacket,
    	removeBlobs: removeBlobs
    };

    var socket_ioParser = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */

    var debug = browser$1('socket.io-parser');





    /**
     * Protocol version.
     *
     * @api public
     */

    exports.protocol = 4;

    /**
     * Packet types.
     *
     * @api public
     */

    exports.types = [
      'CONNECT',
      'DISCONNECT',
      'EVENT',
      'ACK',
      'ERROR',
      'BINARY_EVENT',
      'BINARY_ACK'
    ];

    /**
     * Packet type `connect`.
     *
     * @api public
     */

    exports.CONNECT = 0;

    /**
     * Packet type `disconnect`.
     *
     * @api public
     */

    exports.DISCONNECT = 1;

    /**
     * Packet type `event`.
     *
     * @api public
     */

    exports.EVENT = 2;

    /**
     * Packet type `ack`.
     *
     * @api public
     */

    exports.ACK = 3;

    /**
     * Packet type `error`.
     *
     * @api public
     */

    exports.ERROR = 4;

    /**
     * Packet type 'binary event'
     *
     * @api public
     */

    exports.BINARY_EVENT = 5;

    /**
     * Packet type `binary ack`. For acks with binary arguments.
     *
     * @api public
     */

    exports.BINARY_ACK = 6;

    /**
     * Encoder constructor.
     *
     * @api public
     */

    exports.Encoder = Encoder;

    /**
     * Decoder constructor.
     *
     * @api public
     */

    exports.Decoder = Decoder;

    /**
     * A socket.io Encoder instance
     *
     * @api public
     */

    function Encoder() {}

    var ERROR_PACKET = exports.ERROR + '"encode error"';

    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     * @param {Function} callback - function to handle encodings (likely engine.write)
     * @return Calls callback with Array of encodings
     * @api public
     */

    Encoder.prototype.encode = function(obj, callback){
      debug('encoding packet %j', obj);

      if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
        encodeAsBinary(obj, callback);
      } else {
        var encoding = encodeAsString(obj);
        callback([encoding]);
      }
    };

    /**
     * Encode packet as string.
     *
     * @param {Object} packet
     * @return {String} encoded
     * @api private
     */

    function encodeAsString(obj) {

      // first is type
      var str = '' + obj.type;

      // attachments if we have them
      if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
        str += obj.attachments + '-';
      }

      // if we have a namespace other than `/`
      // we append it followed by a comma `,`
      if (obj.nsp && '/' !== obj.nsp) {
        str += obj.nsp + ',';
      }

      // immediately followed by the id
      if (null != obj.id) {
        str += obj.id;
      }

      // json data
      if (null != obj.data) {
        var payload = tryStringify(obj.data);
        if (payload !== false) {
          str += payload;
        } else {
          return ERROR_PACKET;
        }
      }

      debug('encoded %j as %s', obj, str);
      return str;
    }

    function tryStringify(str) {
      try {
        return JSON.stringify(str);
      } catch(e){
        return false;
      }
    }

    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     *
     * @param {Object} packet
     * @return {Buffer} encoded
     * @api private
     */

    function encodeAsBinary(obj, callback) {

      function writeEncoding(bloblessData) {
        var deconstruction = binary.deconstructPacket(bloblessData);
        var pack = encodeAsString(deconstruction.packet);
        var buffers = deconstruction.buffers;

        buffers.unshift(pack); // add packet info to beginning of data list
        callback(buffers); // write all the buffers
      }

      binary.removeBlobs(obj, writeEncoding);
    }

    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     * @api public
     */

    function Decoder() {
      this.reconstructor = null;
    }

    /**
     * Mix in `Emitter` with Decoder.
     */

    componentEmitter(Decoder.prototype);

    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     * @return {Object} packet
     * @api public
     */

    Decoder.prototype.add = function(obj) {
      var packet;
      if (typeof obj === 'string') {
        packet = decodeString(obj);
        if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
          this.reconstructor = new BinaryReconstructor(packet);

          // no attachments, labeled binary but no binary data to follow
          if (this.reconstructor.reconPack.attachments === 0) {
            this.emit('decoded', packet);
          }
        } else { // non-binary full packet
          this.emit('decoded', packet);
        }
      } else if (isBuffer(obj) || obj.base64) { // raw binary data
        if (!this.reconstructor) {
          throw new Error('got binary data when not reconstructing a packet');
        } else {
          packet = this.reconstructor.takeBinaryData(obj);
          if (packet) { // received final buffer
            this.reconstructor = null;
            this.emit('decoded', packet);
          }
        }
      } else {
        throw new Error('Unknown type: ' + obj);
      }
    };

    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     * @api private
     */

    function decodeString(str) {
      var i = 0;
      // look up type
      var p = {
        type: Number(str.charAt(0))
      };

      if (null == exports.types[p.type]) {
        return error('unknown packet type ' + p.type);
      }

      // look up attachments if type binary
      if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
        var buf = '';
        while (str.charAt(++i) !== '-') {
          buf += str.charAt(i);
          if (i == str.length) break;
        }
        if (buf != Number(buf) || str.charAt(i) !== '-') {
          throw new Error('Illegal attachments');
        }
        p.attachments = Number(buf);
      }

      // look up namespace (if any)
      if ('/' === str.charAt(i + 1)) {
        p.nsp = '';
        while (++i) {
          var c = str.charAt(i);
          if (',' === c) break;
          p.nsp += c;
          if (i === str.length) break;
        }
      } else {
        p.nsp = '/';
      }

      // look up id
      var next = str.charAt(i + 1);
      if ('' !== next && Number(next) == next) {
        p.id = '';
        while (++i) {
          var c = str.charAt(i);
          if (null == c || Number(c) != c) {
            --i;
            break;
          }
          p.id += str.charAt(i);
          if (i === str.length) break;
        }
        p.id = Number(p.id);
      }

      // look up json data
      if (str.charAt(++i)) {
        var payload = tryParse(str.substr(i));
        var isPayloadValid = payload !== false && (p.type === exports.ERROR || isarray(payload));
        if (isPayloadValid) {
          p.data = payload;
        } else {
          return error('invalid payload');
        }
      }

      debug('decoded %s as %j', str, p);
      return p;
    }

    function tryParse(str) {
      try {
        return JSON.parse(str);
      } catch(e){
        return false;
      }
    }

    /**
     * Deallocates a parser's resources
     *
     * @api public
     */

    Decoder.prototype.destroy = function() {
      if (this.reconstructor) {
        this.reconstructor.finishedReconstruction();
      }
    };

    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     * @api private
     */

    function BinaryReconstructor(packet) {
      this.reconPack = packet;
      this.buffers = [];
    }

    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     * @api private
     */

    BinaryReconstructor.prototype.takeBinaryData = function(binData) {
      this.buffers.push(binData);
      if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
        var packet = binary.reconstructPacket(this.reconPack, this.buffers);
        this.finishedReconstruction();
        return packet;
      }
      return null;
    };

    /**
     * Cleans up binary packet reconstruction variables.
     *
     * @api private
     */

    BinaryReconstructor.prototype.finishedReconstruction = function() {
      this.reconPack = null;
      this.buffers = [];
    };

    function error(msg) {
      return {
        type: exports.ERROR,
        data: 'parser error: ' + msg
      };
    }
    });
    var socket_ioParser_1 = socket_ioParser.protocol;
    var socket_ioParser_2 = socket_ioParser.types;
    var socket_ioParser_3 = socket_ioParser.CONNECT;
    var socket_ioParser_4 = socket_ioParser.DISCONNECT;
    var socket_ioParser_5 = socket_ioParser.EVENT;
    var socket_ioParser_6 = socket_ioParser.ACK;
    var socket_ioParser_7 = socket_ioParser.ERROR;
    var socket_ioParser_8 = socket_ioParser.BINARY_EVENT;
    var socket_ioParser_9 = socket_ioParser.BINARY_ACK;
    var socket_ioParser_10 = socket_ioParser.Encoder;
    var socket_ioParser_11 = socket_ioParser.Decoder;

    var hasCors = createCommonjsModule(function (module) {
    /**
     * Module exports.
     *
     * Logic borrowed from Modernizr:
     *
     *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
     */

    try {
      module.exports = typeof XMLHttpRequest !== 'undefined' &&
        'withCredentials' in new XMLHttpRequest();
    } catch (err) {
      // if XMLHttp support is disabled in IE then it will throw
      // when trying to create
      module.exports = false;
    }
    });

    var globalThis_browser = (function () {
      if (typeof self !== 'undefined') {
        return self;
      } else if (typeof window !== 'undefined') {
        return window;
      } else {
        return Function('return this')(); // eslint-disable-line no-new-func
      }
    })();

    // browser shim for xmlhttprequest module




    var xmlhttprequest = function (opts) {
      var xdomain = opts.xdomain;

      // scheme must be same when usign XDomainRequest
      // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
      var xscheme = opts.xscheme;

      // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
      // https://github.com/Automattic/engine.io-client/pull/217
      var enablesXDR = opts.enablesXDR;

      // XMLHttpRequest can be disabled on IE
      try {
        if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCors)) {
          return new XMLHttpRequest();
        }
      } catch (e) { }

      // Use XDomainRequest for IE8 if enablesXDR is true
      // because loading bar keeps flashing when using jsonp-polling
      // https://github.com/yujiosaka/socke.io-ie8-loading-example
      try {
        if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
          return new XDomainRequest();
        }
      } catch (e) { }

      if (!xdomain) {
        try {
          return new globalThis_browser[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
        } catch (e) { }
      }
    };

    /**
     * Gets the keys for an object.
     *
     * @return {Array} keys
     * @api private
     */

    var keys = Object.keys || function keys (obj){
      var arr = [];
      var has = Object.prototype.hasOwnProperty;

      for (var i in obj) {
        if (has.call(obj, i)) {
          arr.push(i);
        }
      }
      return arr;
    };

    /* global Blob File */

    /*
     * Module requirements.
     */



    var toString$2 = Object.prototype.toString;
    var withNativeBlob$1 = typeof Blob === 'function' ||
                            typeof Blob !== 'undefined' && toString$2.call(Blob) === '[object BlobConstructor]';
    var withNativeFile$1 = typeof File === 'function' ||
                            typeof File !== 'undefined' && toString$2.call(File) === '[object FileConstructor]';

    /**
     * Module exports.
     */

    var hasBinary2 = hasBinary;

    /**
     * Checks for binary data.
     *
     * Supports Buffer, ArrayBuffer, Blob and File.
     *
     * @param {Object} anything
     * @api public
     */

    function hasBinary (obj) {
      if (!obj || typeof obj !== 'object') {
        return false;
      }

      if (isarray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (hasBinary(obj[i])) {
            return true;
          }
        }
        return false;
      }

      if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
        (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
        (withNativeBlob$1 && obj instanceof Blob) ||
        (withNativeFile$1 && obj instanceof File)
      ) {
        return true;
      }

      // see: https://github.com/Automattic/has-binary/pull/4
      if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
          return true;
        }
      }

      return false;
    }

    /**
     * An abstraction for slicing an arraybuffer even when
     * ArrayBuffer.prototype.slice is not supported
     *
     * @api public
     */

    var arraybuffer_slice = function(arraybuffer, start, end) {
      var bytes = arraybuffer.byteLength;
      start = start || 0;
      end = end || bytes;

      if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

      if (start < 0) { start += bytes; }
      if (end < 0) { end += bytes; }
      if (end > bytes) { end = bytes; }

      if (start >= bytes || start >= end || bytes === 0) {
        return new ArrayBuffer(0);
      }

      var abv = new Uint8Array(arraybuffer);
      var result = new Uint8Array(end - start);
      for (var i = start, ii = 0; i < end; i++, ii++) {
        result[ii] = abv[i];
      }
      return result.buffer;
    };

    var after_1 = after;

    function after(count, callback, err_cb) {
        var bail = false;
        err_cb = err_cb || noop$1;
        proxy.count = count;

        return (count === 0) ? callback() : proxy

        function proxy(err, result) {
            if (proxy.count <= 0) {
                throw new Error('after called too many times')
            }
            --proxy.count;

            // after first error, rest are passed to err_cb
            if (err) {
                bail = true;
                callback(err);
                // future error callbacks will go to error handler
                callback = err_cb;
            } else if (proxy.count === 0 && !bail) {
                callback(null, result);
            }
        }
    }

    function noop$1() {}

    /*! https://mths.be/utf8js v2.1.2 by @mathias */

    var stringFromCharCode = String.fromCharCode;

    // Taken from https://mths.be/punycode
    function ucs2decode(string) {
    	var output = [];
    	var counter = 0;
    	var length = string.length;
    	var value;
    	var extra;
    	while (counter < length) {
    		value = string.charCodeAt(counter++);
    		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
    			// high surrogate, and there is a next character
    			extra = string.charCodeAt(counter++);
    			if ((extra & 0xFC00) == 0xDC00) { // low surrogate
    				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
    			} else {
    				// unmatched surrogate; only append this code unit, in case the next
    				// code unit is the high surrogate of a surrogate pair
    				output.push(value);
    				counter--;
    			}
    		} else {
    			output.push(value);
    		}
    	}
    	return output;
    }

    // Taken from https://mths.be/punycode
    function ucs2encode(array) {
    	var length = array.length;
    	var index = -1;
    	var value;
    	var output = '';
    	while (++index < length) {
    		value = array[index];
    		if (value > 0xFFFF) {
    			value -= 0x10000;
    			output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
    			value = 0xDC00 | value & 0x3FF;
    		}
    		output += stringFromCharCode(value);
    	}
    	return output;
    }

    function checkScalarValue(codePoint, strict) {
    	if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
    		if (strict) {
    			throw Error(
    				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
    				' is not a scalar value'
    			);
    		}
    		return false;
    	}
    	return true;
    }
    /*--------------------------------------------------------------------------*/

    function createByte(codePoint, shift) {
    	return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
    }

    function encodeCodePoint(codePoint, strict) {
    	if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
    		return stringFromCharCode(codePoint);
    	}
    	var symbol = '';
    	if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
    		symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    	}
    	else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
    		if (!checkScalarValue(codePoint, strict)) {
    			codePoint = 0xFFFD;
    		}
    		symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
    		symbol += createByte(codePoint, 6);
    	}
    	else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
    		symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
    		symbol += createByte(codePoint, 12);
    		symbol += createByte(codePoint, 6);
    	}
    	symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    	return symbol;
    }

    function utf8encode(string, opts) {
    	opts = opts || {};
    	var strict = false !== opts.strict;

    	var codePoints = ucs2decode(string);
    	var length = codePoints.length;
    	var index = -1;
    	var codePoint;
    	var byteString = '';
    	while (++index < length) {
    		codePoint = codePoints[index];
    		byteString += encodeCodePoint(codePoint, strict);
    	}
    	return byteString;
    }

    /*--------------------------------------------------------------------------*/

    function readContinuationByte() {
    	if (byteIndex >= byteCount) {
    		throw Error('Invalid byte index');
    	}

    	var continuationByte = byteArray[byteIndex] & 0xFF;
    	byteIndex++;

    	if ((continuationByte & 0xC0) == 0x80) {
    		return continuationByte & 0x3F;
    	}

    	// If we end up here, it’s not a continuation byte
    	throw Error('Invalid continuation byte');
    }

    function decodeSymbol(strict) {
    	var byte1;
    	var byte2;
    	var byte3;
    	var byte4;
    	var codePoint;

    	if (byteIndex > byteCount) {
    		throw Error('Invalid byte index');
    	}

    	if (byteIndex == byteCount) {
    		return false;
    	}

    	// Read first byte
    	byte1 = byteArray[byteIndex] & 0xFF;
    	byteIndex++;

    	// 1-byte sequence (no continuation bytes)
    	if ((byte1 & 0x80) == 0) {
    		return byte1;
    	}

    	// 2-byte sequence
    	if ((byte1 & 0xE0) == 0xC0) {
    		byte2 = readContinuationByte();
    		codePoint = ((byte1 & 0x1F) << 6) | byte2;
    		if (codePoint >= 0x80) {
    			return codePoint;
    		} else {
    			throw Error('Invalid continuation byte');
    		}
    	}

    	// 3-byte sequence (may include unpaired surrogates)
    	if ((byte1 & 0xF0) == 0xE0) {
    		byte2 = readContinuationByte();
    		byte3 = readContinuationByte();
    		codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
    		if (codePoint >= 0x0800) {
    			return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
    		} else {
    			throw Error('Invalid continuation byte');
    		}
    	}

    	// 4-byte sequence
    	if ((byte1 & 0xF8) == 0xF0) {
    		byte2 = readContinuationByte();
    		byte3 = readContinuationByte();
    		byte4 = readContinuationByte();
    		codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
    			(byte3 << 0x06) | byte4;
    		if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
    			return codePoint;
    		}
    	}

    	throw Error('Invalid UTF-8 detected');
    }

    var byteArray;
    var byteCount;
    var byteIndex;
    function utf8decode(byteString, opts) {
    	opts = opts || {};
    	var strict = false !== opts.strict;

    	byteArray = ucs2decode(byteString);
    	byteCount = byteArray.length;
    	byteIndex = 0;
    	var codePoints = [];
    	var tmp;
    	while ((tmp = decodeSymbol(strict)) !== false) {
    		codePoints.push(tmp);
    	}
    	return ucs2encode(codePoints);
    }

    var utf8 = {
    	version: '2.1.2',
    	encode: utf8encode,
    	decode: utf8decode
    };

    var base64Arraybuffer = createCommonjsModule(function (module, exports) {
    /*
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */
    (function(){

      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

      // Use a lookup table to find the index.
      var lookup = new Uint8Array(256);
      for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
      }

      exports.encode = function(arraybuffer) {
        var bytes = new Uint8Array(arraybuffer),
        i, len = bytes.length, base64 = "";

        for (i = 0; i < len; i+=3) {
          base64 += chars[bytes[i] >> 2];
          base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
          base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
          base64 += chars[bytes[i + 2] & 63];
        }

        if ((len % 3) === 2) {
          base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + "==";
        }

        return base64;
      };

      exports.decode =  function(base64) {
        var bufferLength = base64.length * 0.75,
        len = base64.length, i, p = 0,
        encoded1, encoded2, encoded3, encoded4;

        if (base64[base64.length - 1] === "=") {
          bufferLength--;
          if (base64[base64.length - 2] === "=") {
            bufferLength--;
          }
        }

        var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i+=4) {
          encoded1 = lookup[base64.charCodeAt(i)];
          encoded2 = lookup[base64.charCodeAt(i+1)];
          encoded3 = lookup[base64.charCodeAt(i+2)];
          encoded4 = lookup[base64.charCodeAt(i+3)];

          bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
          bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
          bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        return arraybuffer;
      };
    })();
    });
    var base64Arraybuffer_1 = base64Arraybuffer.encode;
    var base64Arraybuffer_2 = base64Arraybuffer.decode;

    /**
     * Create a blob builder even when vendor prefixes exist
     */

    var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
      typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
      typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
      typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
      false;

    /**
     * Check if Blob constructor is supported
     */

    var blobSupported = (function() {
      try {
        var a = new Blob(['hi']);
        return a.size === 2;
      } catch(e) {
        return false;
      }
    })();

    /**
     * Check if Blob constructor supports ArrayBufferViews
     * Fails in Safari 6, so we need to map to ArrayBuffers there.
     */

    var blobSupportsArrayBufferView = blobSupported && (function() {
      try {
        var b = new Blob([new Uint8Array([1,2])]);
        return b.size === 2;
      } catch(e) {
        return false;
      }
    })();

    /**
     * Check if BlobBuilder is supported
     */

    var blobBuilderSupported = BlobBuilder
      && BlobBuilder.prototype.append
      && BlobBuilder.prototype.getBlob;

    /**
     * Helper function that maps ArrayBufferViews to ArrayBuffers
     * Used by BlobBuilder constructor and old browsers that didn't
     * support it in the Blob constructor.
     */

    function mapArrayBufferViews(ary) {
      return ary.map(function(chunk) {
        if (chunk.buffer instanceof ArrayBuffer) {
          var buf = chunk.buffer;

          // if this is a subarray, make a copy so we only
          // include the subarray region from the underlying buffer
          if (chunk.byteLength !== buf.byteLength) {
            var copy = new Uint8Array(chunk.byteLength);
            copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
            buf = copy.buffer;
          }

          return buf;
        }

        return chunk;
      });
    }

    function BlobBuilderConstructor(ary, options) {
      options = options || {};

      var bb = new BlobBuilder();
      mapArrayBufferViews(ary).forEach(function(part) {
        bb.append(part);
      });

      return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
    }
    function BlobConstructor(ary, options) {
      return new Blob(mapArrayBufferViews(ary), options || {});
    }
    if (typeof Blob !== 'undefined') {
      BlobBuilderConstructor.prototype = Blob.prototype;
      BlobConstructor.prototype = Blob.prototype;
    }

    var blob = (function() {
      if (blobSupported) {
        return blobSupportsArrayBufferView ? Blob : BlobConstructor;
      } else if (blobBuilderSupported) {
        return BlobBuilderConstructor;
      } else {
        return undefined;
      }
    })();

    var browser$2 = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */







    var base64encoder;
    if (typeof ArrayBuffer !== 'undefined') {
      base64encoder = base64Arraybuffer;
    }

    /**
     * Check if we are running an android browser. That requires us to use
     * ArrayBuffer with polling transports...
     *
     * http://ghinda.net/jpeg-blob-ajax-android/
     */

    var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

    /**
     * Check if we are running in PhantomJS.
     * Uploading a Blob with PhantomJS does not work correctly, as reported here:
     * https://github.com/ariya/phantomjs/issues/11395
     * @type boolean
     */
    var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

    /**
     * When true, avoids using Blobs to encode payloads.
     * @type boolean
     */
    var dontSendBlobs = isAndroid || isPhantomJS;

    /**
     * Current protocol version.
     */

    exports.protocol = 3;

    /**
     * Packet types.
     */

    var packets = exports.packets = {
        open:     0    // non-ws
      , close:    1    // non-ws
      , ping:     2
      , pong:     3
      , message:  4
      , upgrade:  5
      , noop:     6
    };

    var packetslist = keys(packets);

    /**
     * Premade error packet.
     */

    var err = { type: 'error', data: 'parser error' };

    /**
     * Create a blob api even for blob builder when vendor prefixes exist
     */



    /**
     * Encodes a packet.
     *
     *     <packet type id> [ <data> ]
     *
     * Example:
     *
     *     5hello world
     *     3
     *     4
     *
     * Binary is encoded in an identical principle
     *
     * @api private
     */

    exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
      if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = false;
      }

      if (typeof utf8encode === 'function') {
        callback = utf8encode;
        utf8encode = null;
      }

      var data = (packet.data === undefined)
        ? undefined
        : packet.data.buffer || packet.data;

      if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
        return encodeArrayBuffer(packet, supportsBinary, callback);
      } else if (typeof blob !== 'undefined' && data instanceof blob) {
        return encodeBlob(packet, supportsBinary, callback);
      }

      // might be an object with { base64: true, data: dataAsBase64String }
      if (data && data.base64) {
        return encodeBase64Object(packet, callback);
      }

      // Sending data as a utf-8 string
      var encoded = packets[packet.type];

      // data fragment is optional
      if (undefined !== packet.data) {
        encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
      }

      return callback('' + encoded);

    };

    function encodeBase64Object(packet, callback) {
      // packet data is an object { base64: true, data: dataAsBase64String }
      var message = 'b' + exports.packets[packet.type] + packet.data.data;
      return callback(message);
    }

    /**
     * Encode packet helpers for binary types
     */

    function encodeArrayBuffer(packet, supportsBinary, callback) {
      if (!supportsBinary) {
        return exports.encodeBase64Packet(packet, callback);
      }

      var data = packet.data;
      var contentArray = new Uint8Array(data);
      var resultBuffer = new Uint8Array(1 + data.byteLength);

      resultBuffer[0] = packets[packet.type];
      for (var i = 0; i < contentArray.length; i++) {
        resultBuffer[i+1] = contentArray[i];
      }

      return callback(resultBuffer.buffer);
    }

    function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
      if (!supportsBinary) {
        return exports.encodeBase64Packet(packet, callback);
      }

      var fr = new FileReader();
      fr.onload = function() {
        exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
      };
      return fr.readAsArrayBuffer(packet.data);
    }

    function encodeBlob(packet, supportsBinary, callback) {
      if (!supportsBinary) {
        return exports.encodeBase64Packet(packet, callback);
      }

      if (dontSendBlobs) {
        return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
      }

      var length = new Uint8Array(1);
      length[0] = packets[packet.type];
      var blob$1 = new blob([length.buffer, packet.data]);

      return callback(blob$1);
    }

    /**
     * Encodes a packet with binary data in a base64 string
     *
     * @param {Object} packet, has `type` and `data`
     * @return {String} base64 encoded message
     */

    exports.encodeBase64Packet = function(packet, callback) {
      var message = 'b' + exports.packets[packet.type];
      if (typeof blob !== 'undefined' && packet.data instanceof blob) {
        var fr = new FileReader();
        fr.onload = function() {
          var b64 = fr.result.split(',')[1];
          callback(message + b64);
        };
        return fr.readAsDataURL(packet.data);
      }

      var b64data;
      try {
        b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
      } catch (e) {
        // iPhone Safari doesn't let you apply with typed arrays
        var typed = new Uint8Array(packet.data);
        var basic = new Array(typed.length);
        for (var i = 0; i < typed.length; i++) {
          basic[i] = typed[i];
        }
        b64data = String.fromCharCode.apply(null, basic);
      }
      message += btoa(b64data);
      return callback(message);
    };

    /**
     * Decodes a packet. Changes format to Blob if requested.
     *
     * @return {Object} with `type` and `data` (if any)
     * @api private
     */

    exports.decodePacket = function (data, binaryType, utf8decode) {
      if (data === undefined) {
        return err;
      }
      // String data
      if (typeof data === 'string') {
        if (data.charAt(0) === 'b') {
          return exports.decodeBase64Packet(data.substr(1), binaryType);
        }

        if (utf8decode) {
          data = tryDecode(data);
          if (data === false) {
            return err;
          }
        }
        var type = data.charAt(0);

        if (Number(type) != type || !packetslist[type]) {
          return err;
        }

        if (data.length > 1) {
          return { type: packetslist[type], data: data.substring(1) };
        } else {
          return { type: packetslist[type] };
        }
      }

      var asArray = new Uint8Array(data);
      var type = asArray[0];
      var rest = arraybuffer_slice(data, 1);
      if (blob && binaryType === 'blob') {
        rest = new blob([rest]);
      }
      return { type: packetslist[type], data: rest };
    };

    function tryDecode(data) {
      try {
        data = utf8.decode(data, { strict: false });
      } catch (e) {
        return false;
      }
      return data;
    }

    /**
     * Decodes a packet encoded in a base64 string
     *
     * @param {String} base64 encoded message
     * @return {Object} with `type` and `data` (if any)
     */

    exports.decodeBase64Packet = function(msg, binaryType) {
      var type = packetslist[msg.charAt(0)];
      if (!base64encoder) {
        return { type: type, data: { base64: true, data: msg.substr(1) } };
      }

      var data = base64encoder.decode(msg.substr(1));

      if (binaryType === 'blob' && blob) {
        data = new blob([data]);
      }

      return { type: type, data: data };
    };

    /**
     * Encodes multiple messages (payload).
     *
     *     <length>:data
     *
     * Example:
     *
     *     11:hello world2:hi
     *
     * If any contents are binary, they will be encoded as base64 strings. Base64
     * encoded strings are marked with a b before the length specifier
     *
     * @param {Array} packets
     * @api private
     */

    exports.encodePayload = function (packets, supportsBinary, callback) {
      if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = null;
      }

      var isBinary = hasBinary2(packets);

      if (supportsBinary && isBinary) {
        if (blob && !dontSendBlobs) {
          return exports.encodePayloadAsBlob(packets, callback);
        }

        return exports.encodePayloadAsArrayBuffer(packets, callback);
      }

      if (!packets.length) {
        return callback('0:');
      }

      function setLengthHeader(message) {
        return message.length + ':' + message;
      }

      function encodeOne(packet, doneCallback) {
        exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
          doneCallback(null, setLengthHeader(message));
        });
      }

      map(packets, encodeOne, function(err, results) {
        return callback(results.join(''));
      });
    };

    /**
     * Async array map using after
     */

    function map(ary, each, done) {
      var result = new Array(ary.length);
      var next = after_1(ary.length, done);

      var eachWithIndex = function(i, el, cb) {
        each(el, function(error, msg) {
          result[i] = msg;
          cb(error, result);
        });
      };

      for (var i = 0; i < ary.length; i++) {
        eachWithIndex(i, ary[i], next);
      }
    }

    /*
     * Decodes data when a payload is maybe expected. Possible binary contents are
     * decoded from their base64 representation
     *
     * @param {String} data, callback method
     * @api public
     */

    exports.decodePayload = function (data, binaryType, callback) {
      if (typeof data !== 'string') {
        return exports.decodePayloadAsBinary(data, binaryType, callback);
      }

      if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
      }

      var packet;
      if (data === '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      var length = '', n, msg;

      for (var i = 0, l = data.length; i < l; i++) {
        var chr = data.charAt(i);

        if (chr !== ':') {
          length += chr;
          continue;
        }

        if (length === '' || (length != (n = Number(length)))) {
          // parser error - ignoring payload
          return callback(err, 0, 1);
        }

        msg = data.substr(i + 1, n);

        if (length != msg.length) {
          // parser error - ignoring payload
          return callback(err, 0, 1);
        }

        if (msg.length) {
          packet = exports.decodePacket(msg, binaryType, false);

          if (err.type === packet.type && err.data === packet.data) {
            // parser error in individual packet - ignoring payload
            return callback(err, 0, 1);
          }

          var ret = callback(packet, i + n, l);
          if (false === ret) return;
        }

        // advance cursor
        i += n;
        length = '';
      }

      if (length !== '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

    };

    /**
     * Encodes multiple messages (payload) as binary.
     *
     * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
     * 255><data>
     *
     * Example:
     * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
     *
     * @param {Array} packets
     * @return {ArrayBuffer} encoded payload
     * @api private
     */

    exports.encodePayloadAsArrayBuffer = function(packets, callback) {
      if (!packets.length) {
        return callback(new ArrayBuffer(0));
      }

      function encodeOne(packet, doneCallback) {
        exports.encodePacket(packet, true, true, function(data) {
          return doneCallback(null, data);
        });
      }

      map(packets, encodeOne, function(err, encodedPackets) {
        var totalLength = encodedPackets.reduce(function(acc, p) {
          var len;
          if (typeof p === 'string'){
            len = p.length;
          } else {
            len = p.byteLength;
          }
          return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
        }, 0);

        var resultArray = new Uint8Array(totalLength);

        var bufferIndex = 0;
        encodedPackets.forEach(function(p) {
          var isString = typeof p === 'string';
          var ab = p;
          if (isString) {
            var view = new Uint8Array(p.length);
            for (var i = 0; i < p.length; i++) {
              view[i] = p.charCodeAt(i);
            }
            ab = view.buffer;
          }

          if (isString) { // not true binary
            resultArray[bufferIndex++] = 0;
          } else { // true binary
            resultArray[bufferIndex++] = 1;
          }

          var lenStr = ab.byteLength.toString();
          for (var i = 0; i < lenStr.length; i++) {
            resultArray[bufferIndex++] = parseInt(lenStr[i]);
          }
          resultArray[bufferIndex++] = 255;

          var view = new Uint8Array(ab);
          for (var i = 0; i < view.length; i++) {
            resultArray[bufferIndex++] = view[i];
          }
        });

        return callback(resultArray.buffer);
      });
    };

    /**
     * Encode as Blob
     */

    exports.encodePayloadAsBlob = function(packets, callback) {
      function encodeOne(packet, doneCallback) {
        exports.encodePacket(packet, true, true, function(encoded) {
          var binaryIdentifier = new Uint8Array(1);
          binaryIdentifier[0] = 1;
          if (typeof encoded === 'string') {
            var view = new Uint8Array(encoded.length);
            for (var i = 0; i < encoded.length; i++) {
              view[i] = encoded.charCodeAt(i);
            }
            encoded = view.buffer;
            binaryIdentifier[0] = 0;
          }

          var len = (encoded instanceof ArrayBuffer)
            ? encoded.byteLength
            : encoded.size;

          var lenStr = len.toString();
          var lengthAry = new Uint8Array(lenStr.length + 1);
          for (var i = 0; i < lenStr.length; i++) {
            lengthAry[i] = parseInt(lenStr[i]);
          }
          lengthAry[lenStr.length] = 255;

          if (blob) {
            var blob$1 = new blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
            doneCallback(null, blob$1);
          }
        });
      }

      map(packets, encodeOne, function(err, results) {
        return callback(new blob(results));
      });
    };

    /*
     * Decodes data when a payload is maybe expected. Strings are decoded by
     * interpreting each byte as a key code for entries marked to start with 0. See
     * description of encodePayloadAsBinary
     *
     * @param {ArrayBuffer} data, callback method
     * @api public
     */

    exports.decodePayloadAsBinary = function (data, binaryType, callback) {
      if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
      }

      var bufferTail = data;
      var buffers = [];

      while (bufferTail.byteLength > 0) {
        var tailArray = new Uint8Array(bufferTail);
        var isString = tailArray[0] === 0;
        var msgLength = '';

        for (var i = 1; ; i++) {
          if (tailArray[i] === 255) break;

          // 310 = char length of Number.MAX_VALUE
          if (msgLength.length > 310) {
            return callback(err, 0, 1);
          }

          msgLength += tailArray[i];
        }

        bufferTail = arraybuffer_slice(bufferTail, 2 + msgLength.length);
        msgLength = parseInt(msgLength);

        var msg = arraybuffer_slice(bufferTail, 0, msgLength);
        if (isString) {
          try {
            msg = String.fromCharCode.apply(null, new Uint8Array(msg));
          } catch (e) {
            // iPhone Safari doesn't let you apply to typed arrays
            var typed = new Uint8Array(msg);
            msg = '';
            for (var i = 0; i < typed.length; i++) {
              msg += String.fromCharCode(typed[i]);
            }
          }
        }

        buffers.push(msg);
        bufferTail = arraybuffer_slice(bufferTail, msgLength);
      }

      var total = buffers.length;
      buffers.forEach(function(buffer, i) {
        callback(exports.decodePacket(buffer, binaryType, true), i, total);
      });
    };
    });
    var browser_1$2 = browser$2.protocol;
    var browser_2$2 = browser$2.packets;
    var browser_3$2 = browser$2.encodePacket;
    var browser_4$2 = browser$2.encodeBase64Packet;
    var browser_5$2 = browser$2.decodePacket;
    var browser_6$2 = browser$2.decodeBase64Packet;
    var browser_7$2 = browser$2.encodePayload;
    var browser_8 = browser$2.decodePayload;
    var browser_9 = browser$2.encodePayloadAsArrayBuffer;
    var browser_10 = browser$2.encodePayloadAsBlob;
    var browser_11 = browser$2.decodePayloadAsBinary;

    var componentEmitter$1 = createCommonjsModule(function (module) {
    /**
     * Expose `Emitter`.
     */

    {
      module.exports = Emitter;
    }

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    });

    /**
     * Module dependencies.
     */




    /**
     * Module exports.
     */

    var transport = Transport;

    /**
     * Transport abstract constructor.
     *
     * @param {Object} options.
     * @api private
     */

    function Transport (opts) {
      this.path = opts.path;
      this.hostname = opts.hostname;
      this.port = opts.port;
      this.secure = opts.secure;
      this.query = opts.query;
      this.timestampParam = opts.timestampParam;
      this.timestampRequests = opts.timestampRequests;
      this.readyState = '';
      this.agent = opts.agent || false;
      this.socket = opts.socket;
      this.enablesXDR = opts.enablesXDR;
      this.withCredentials = opts.withCredentials;

      // SSL options for Node.js client
      this.pfx = opts.pfx;
      this.key = opts.key;
      this.passphrase = opts.passphrase;
      this.cert = opts.cert;
      this.ca = opts.ca;
      this.ciphers = opts.ciphers;
      this.rejectUnauthorized = opts.rejectUnauthorized;
      this.forceNode = opts.forceNode;

      // results of ReactNative environment detection
      this.isReactNative = opts.isReactNative;

      // other options for Node.js client
      this.extraHeaders = opts.extraHeaders;
      this.localAddress = opts.localAddress;
    }

    /**
     * Mix in `Emitter`.
     */

    componentEmitter$1(Transport.prototype);

    /**
     * Emits an error.
     *
     * @param {String} str
     * @return {Transport} for chaining
     * @api public
     */

    Transport.prototype.onError = function (msg, desc) {
      var err = new Error(msg);
      err.type = 'TransportError';
      err.description = desc;
      this.emit('error', err);
      return this;
    };

    /**
     * Opens the transport.
     *
     * @api public
     */

    Transport.prototype.open = function () {
      if ('closed' === this.readyState || '' === this.readyState) {
        this.readyState = 'opening';
        this.doOpen();
      }

      return this;
    };

    /**
     * Closes the transport.
     *
     * @api private
     */

    Transport.prototype.close = function () {
      if ('opening' === this.readyState || 'open' === this.readyState) {
        this.doClose();
        this.onClose();
      }

      return this;
    };

    /**
     * Sends multiple packets.
     *
     * @param {Array} packets
     * @api private
     */

    Transport.prototype.send = function (packets) {
      if ('open' === this.readyState) {
        this.write(packets);
      } else {
        throw new Error('Transport not open');
      }
    };

    /**
     * Called upon open
     *
     * @api private
     */

    Transport.prototype.onOpen = function () {
      this.readyState = 'open';
      this.writable = true;
      this.emit('open');
    };

    /**
     * Called with data.
     *
     * @param {String} data
     * @api private
     */

    Transport.prototype.onData = function (data) {
      var packet = browser$2.decodePacket(data, this.socket.binaryType);
      this.onPacket(packet);
    };

    /**
     * Called with a decoded packet.
     */

    Transport.prototype.onPacket = function (packet) {
      this.emit('packet', packet);
    };

    /**
     * Called upon close.
     *
     * @api private
     */

    Transport.prototype.onClose = function () {
      this.readyState = 'closed';
      this.emit('close');
    };

    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */

    var encode = function (obj) {
      var str = '';

      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (str.length) str += '&';
          str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
        }
      }

      return str;
    };

    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */

    var decode = function(qs){
      var qry = {};
      var pairs = qs.split('&');
      for (var i = 0, l = pairs.length; i < l; i++) {
        var pair = pairs[i].split('=');
        qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      return qry;
    };

    var parseqs = {
    	encode: encode,
    	decode: decode
    };

    var componentInherit = function(a, b){
      var fn = function(){};
      fn.prototype = b.prototype;
      a.prototype = new fn;
      a.prototype.constructor = a;
    };

    var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
      , length = 64
      , map = {}
      , seed = 0
      , i = 0
      , prev;

    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode$1(num) {
      var encoded = '';

      do {
        encoded = alphabet[num % length] + encoded;
        num = Math.floor(num / length);
      } while (num > 0);

      return encoded;
    }

    /**
     * Return the integer value specified by the given string.
     *
     * @param {String} str The string to convert.
     * @returns {Number} The integer value represented by the string.
     * @api public
     */
    function decode$1(str) {
      var decoded = 0;

      for (i = 0; i < str.length; i++) {
        decoded = decoded * length + map[str.charAt(i)];
      }

      return decoded;
    }

    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
      var now = encode$1(+new Date());

      if (now !== prev) return seed = 0, prev = now;
      return now +'.'+ encode$1(seed++);
    }

    //
    // Map each character to its index.
    //
    for (; i < length; i++) map[alphabet[i]] = i;

    //
    // Expose the `yeast`, `encode` and `decode` functions.
    //
    yeast.encode = encode$1;
    yeast.decode = decode$1;
    var yeast_1 = yeast;

    /**
     * Helpers.
     */

    var s$2 = 1000;
    var m$2 = s$2 * 60;
    var h$2 = m$2 * 60;
    var d$2 = h$2 * 24;
    var w$1 = d$2 * 7;
    var y$2 = d$2 * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms$2 = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse$2(val);
      } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong$2(val) : fmtShort$2(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse$2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y$2;
        case 'weeks':
        case 'week':
        case 'w':
          return n * w$1;
        case 'days':
        case 'day':
        case 'd':
          return n * d$2;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h$2;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m$2;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s$2;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort$2(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d$2) {
        return Math.round(ms / d$2) + 'd';
      }
      if (msAbs >= h$2) {
        return Math.round(ms / h$2) + 'h';
      }
      if (msAbs >= m$2) {
        return Math.round(ms / m$2) + 'm';
      }
      if (msAbs >= s$2) {
        return Math.round(ms / s$2) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong$2(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d$2) {
        return plural$2(ms, msAbs, d$2, 'day');
      }
      if (msAbs >= h$2) {
        return plural$2(ms, msAbs, h$2, 'hour');
      }
      if (msAbs >= m$2) {
        return plural$2(ms, msAbs, m$2, 'minute');
      }
      if (msAbs >= s$2) {
        return plural$2(ms, msAbs, s$2, 'second');
      }
      return ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural$2(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
    }

    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     */

    function setup$1(env) {
    	createDebug.debug = createDebug;
    	createDebug.default = createDebug;
    	createDebug.coerce = coerce;
    	createDebug.disable = disable;
    	createDebug.enable = enable;
    	createDebug.enabled = enabled;
    	createDebug.humanize = ms$2;

    	Object.keys(env).forEach(key => {
    		createDebug[key] = env[key];
    	});

    	/**
    	* Active `debug` instances.
    	*/
    	createDebug.instances = [];

    	/**
    	* The currently active debug mode names, and names to skip.
    	*/

    	createDebug.names = [];
    	createDebug.skips = [];

    	/**
    	* Map of special "%n" handling functions, for the debug "format" argument.
    	*
    	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
    	*/
    	createDebug.formatters = {};

    	/**
    	* Selects a color for a debug namespace
    	* @param {String} namespace The namespace string for the for the debug instance to be colored
    	* @return {Number|String} An ANSI color code for the given namespace
    	* @api private
    	*/
    	function selectColor(namespace) {
    		let hash = 0;

    		for (let i = 0; i < namespace.length; i++) {
    			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
    			hash |= 0; // Convert to 32bit integer
    		}

    		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    	}
    	createDebug.selectColor = selectColor;

    	/**
    	* Create a debugger with the given `namespace`.
    	*
    	* @param {String} namespace
    	* @return {Function}
    	* @api public
    	*/
    	function createDebug(namespace) {
    		let prevTime;

    		function debug(...args) {
    			// Disabled?
    			if (!debug.enabled) {
    				return;
    			}

    			const self = debug;

    			// Set `diff` timestamp
    			const curr = Number(new Date());
    			const ms = curr - (prevTime || curr);
    			self.diff = ms;
    			self.prev = prevTime;
    			self.curr = curr;
    			prevTime = curr;

    			args[0] = createDebug.coerce(args[0]);

    			if (typeof args[0] !== 'string') {
    				// Anything else let's inspect with %O
    				args.unshift('%O');
    			}

    			// Apply any `formatters` transformations
    			let index = 0;
    			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
    				// If we encounter an escaped % then don't increase the array index
    				if (match === '%%') {
    					return match;
    				}
    				index++;
    				const formatter = createDebug.formatters[format];
    				if (typeof formatter === 'function') {
    					const val = args[index];
    					match = formatter.call(self, val);

    					// Now we need to remove `args[index]` since it's inlined in the `format`
    					args.splice(index, 1);
    					index--;
    				}
    				return match;
    			});

    			// Apply env-specific formatting (colors, etc.)
    			createDebug.formatArgs.call(self, args);

    			const logFn = self.log || createDebug.log;
    			logFn.apply(self, args);
    		}

    		debug.namespace = namespace;
    		debug.enabled = createDebug.enabled(namespace);
    		debug.useColors = createDebug.useColors();
    		debug.color = selectColor(namespace);
    		debug.destroy = destroy;
    		debug.extend = extend;
    		// Debug.formatArgs = formatArgs;
    		// debug.rawLog = rawLog;

    		// env-specific initialization logic for debug instances
    		if (typeof createDebug.init === 'function') {
    			createDebug.init(debug);
    		}

    		createDebug.instances.push(debug);

    		return debug;
    	}

    	function destroy() {
    		const index = createDebug.instances.indexOf(this);
    		if (index !== -1) {
    			createDebug.instances.splice(index, 1);
    			return true;
    		}
    		return false;
    	}

    	function extend(namespace, delimiter) {
    		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    		newDebug.log = this.log;
    		return newDebug;
    	}

    	/**
    	* Enables a debug mode by namespaces. This can include modes
    	* separated by a colon and wildcards.
    	*
    	* @param {String} namespaces
    	* @api public
    	*/
    	function enable(namespaces) {
    		createDebug.save(namespaces);

    		createDebug.names = [];
    		createDebug.skips = [];

    		let i;
    		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    		const len = split.length;

    		for (i = 0; i < len; i++) {
    			if (!split[i]) {
    				// ignore empty strings
    				continue;
    			}

    			namespaces = split[i].replace(/\*/g, '.*?');

    			if (namespaces[0] === '-') {
    				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    			} else {
    				createDebug.names.push(new RegExp('^' + namespaces + '$'));
    			}
    		}

    		for (i = 0; i < createDebug.instances.length; i++) {
    			const instance = createDebug.instances[i];
    			instance.enabled = createDebug.enabled(instance.namespace);
    		}
    	}

    	/**
    	* Disable debug output.
    	*
    	* @return {String} namespaces
    	* @api public
    	*/
    	function disable() {
    		const namespaces = [
    			...createDebug.names.map(toNamespace),
    			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
    		].join(',');
    		createDebug.enable('');
    		return namespaces;
    	}

    	/**
    	* Returns true if the given mode name is enabled, false otherwise.
    	*
    	* @param {String} name
    	* @return {Boolean}
    	* @api public
    	*/
    	function enabled(name) {
    		if (name[name.length - 1] === '*') {
    			return true;
    		}

    		let i;
    		let len;

    		for (i = 0, len = createDebug.skips.length; i < len; i++) {
    			if (createDebug.skips[i].test(name)) {
    				return false;
    			}
    		}

    		for (i = 0, len = createDebug.names.length; i < len; i++) {
    			if (createDebug.names[i].test(name)) {
    				return true;
    			}
    		}

    		return false;
    	}

    	/**
    	* Convert regexp to namespace
    	*
    	* @param {RegExp} regxep
    	* @return {String} namespace
    	* @api private
    	*/
    	function toNamespace(regexp) {
    		return regexp.toString()
    			.substring(2, regexp.toString().length - 2)
    			.replace(/\.\*\?$/, '*');
    	}

    	/**
    	* Coerce `val`.
    	*
    	* @param {Mixed} val
    	* @return {Mixed}
    	* @api private
    	*/
    	function coerce(val) {
    		if (val instanceof Error) {
    			return val.stack || val.message;
    		}
    		return val;
    	}

    	createDebug.enable(createDebug.load());

    	return createDebug;
    }

    var common$1 = setup$1;

    var browser$3 = createCommonjsModule(function (module, exports) {
    /* eslint-env browser */

    /**
     * This is the web browser implementation of `debug()`.
     */

    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();

    /**
     * Colors.
     */

    exports.colors = [
    	'#0000CC',
    	'#0000FF',
    	'#0033CC',
    	'#0033FF',
    	'#0066CC',
    	'#0066FF',
    	'#0099CC',
    	'#0099FF',
    	'#00CC00',
    	'#00CC33',
    	'#00CC66',
    	'#00CC99',
    	'#00CCCC',
    	'#00CCFF',
    	'#3300CC',
    	'#3300FF',
    	'#3333CC',
    	'#3333FF',
    	'#3366CC',
    	'#3366FF',
    	'#3399CC',
    	'#3399FF',
    	'#33CC00',
    	'#33CC33',
    	'#33CC66',
    	'#33CC99',
    	'#33CCCC',
    	'#33CCFF',
    	'#6600CC',
    	'#6600FF',
    	'#6633CC',
    	'#6633FF',
    	'#66CC00',
    	'#66CC33',
    	'#9900CC',
    	'#9900FF',
    	'#9933CC',
    	'#9933FF',
    	'#99CC00',
    	'#99CC33',
    	'#CC0000',
    	'#CC0033',
    	'#CC0066',
    	'#CC0099',
    	'#CC00CC',
    	'#CC00FF',
    	'#CC3300',
    	'#CC3333',
    	'#CC3366',
    	'#CC3399',
    	'#CC33CC',
    	'#CC33FF',
    	'#CC6600',
    	'#CC6633',
    	'#CC9900',
    	'#CC9933',
    	'#CCCC00',
    	'#CCCC33',
    	'#FF0000',
    	'#FF0033',
    	'#FF0066',
    	'#FF0099',
    	'#FF00CC',
    	'#FF00FF',
    	'#FF3300',
    	'#FF3333',
    	'#FF3366',
    	'#FF3399',
    	'#FF33CC',
    	'#FF33FF',
    	'#FF6600',
    	'#FF6633',
    	'#FF9900',
    	'#FF9933',
    	'#FFCC00',
    	'#FFCC33'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    // eslint-disable-next-line complexity
    function useColors() {
    	// NB: In an Electron preload script, document will be defined but not fully
    	// initialized. Since we know we're in Chrome, we'll just detect this case
    	// explicitly
    	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    		return true;
    	}

    	// Internet Explorer and Edge do not support colors.
    	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    		return false;
    	}

    	// Is webkit? http://stackoverflow.com/a/16459606/376773
    	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    		// Is firebug? http://stackoverflow.com/a/398120/376773
    		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    		// Is firefox >= v31?
    		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    		// Double check webkit in userAgent just in case we are in a worker
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
    	args[0] = (this.useColors ? '%c' : '') +
    		this.namespace +
    		(this.useColors ? ' %c' : ' ') +
    		args[0] +
    		(this.useColors ? '%c ' : ' ') +
    		'+' + module.exports.humanize(this.diff);

    	if (!this.useColors) {
    		return;
    	}

    	const c = 'color: ' + this.color;
    	args.splice(1, 0, c, 'color: inherit');

    	// The final "%c" is somewhat tricky, because there could be other
    	// arguments passed either before or after the %c, so we need to
    	// figure out the correct index to insert the CSS into
    	let index = 0;
    	let lastC = 0;
    	args[0].replace(/%[a-zA-Z%]/g, match => {
    		if (match === '%%') {
    			return;
    		}
    		index++;
    		if (match === '%c') {
    			// We only are interested in the *last* %c
    			// (the user may have provided their own)
    			lastC = index;
    		}
    	});

    	args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */
    function log(...args) {
    	// This hackery is required for IE8/9, where
    	// the `console.log` function doesn't have 'apply'
    	return typeof console === 'object' &&
    		console.log &&
    		console.log(...args);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */
    function save(namespaces) {
    	try {
    		if (namespaces) {
    			exports.storage.setItem('debug', namespaces);
    		} else {
    			exports.storage.removeItem('debug');
    		}
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */
    function load() {
    	let r;
    	try {
    		r = exports.storage.getItem('debug');
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}

    	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    	if (!r && typeof process !== 'undefined' && 'env' in process) {
    		r = process.env.DEBUG;
    	}

    	return r;
    }

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
    	try {
    		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    		// The Browser also has localStorage in the global context.
    		return localStorage;
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    module.exports = common$1(exports);

    const {formatters} = module.exports;

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    formatters.j = function (v) {
    	try {
    		return JSON.stringify(v);
    	} catch (error) {
    		return '[UnexpectedJSONParseError]: ' + error.message;
    	}
    };
    });
    var browser_1$3 = browser$3.log;
    var browser_2$3 = browser$3.formatArgs;
    var browser_3$3 = browser$3.save;
    var browser_4$3 = browser$3.load;
    var browser_5$3 = browser$3.useColors;
    var browser_6$3 = browser$3.storage;
    var browser_7$3 = browser$3.colors;

    /**
     * Module dependencies.
     */






    var debug$2 = browser$3('engine.io-client:polling');

    /**
     * Module exports.
     */

    var polling = Polling;

    /**
     * Is XHR2 supported?
     */

    var hasXHR2 = (function () {
      var XMLHttpRequest = xmlhttprequest;
      var xhr = new XMLHttpRequest({ xdomain: false });
      return null != xhr.responseType;
    })();

    /**
     * Polling interface.
     *
     * @param {Object} opts
     * @api private
     */

    function Polling (opts) {
      var forceBase64 = (opts && opts.forceBase64);
      if (!hasXHR2 || forceBase64) {
        this.supportsBinary = false;
      }
      transport.call(this, opts);
    }

    /**
     * Inherits from Transport.
     */

    componentInherit(Polling, transport);

    /**
     * Transport name.
     */

    Polling.prototype.name = 'polling';

    /**
     * Opens the socket (triggers polling). We write a PING message to determine
     * when the transport is open.
     *
     * @api private
     */

    Polling.prototype.doOpen = function () {
      this.poll();
    };

    /**
     * Pauses polling.
     *
     * @param {Function} callback upon buffers are flushed and transport is paused
     * @api private
     */

    Polling.prototype.pause = function (onPause) {
      var self = this;

      this.readyState = 'pausing';

      function pause () {
        debug$2('paused');
        self.readyState = 'paused';
        onPause();
      }

      if (this.polling || !this.writable) {
        var total = 0;

        if (this.polling) {
          debug$2('we are currently polling - waiting to pause');
          total++;
          this.once('pollComplete', function () {
            debug$2('pre-pause polling complete');
            --total || pause();
          });
        }

        if (!this.writable) {
          debug$2('we are currently writing - waiting to pause');
          total++;
          this.once('drain', function () {
            debug$2('pre-pause writing complete');
            --total || pause();
          });
        }
      } else {
        pause();
      }
    };

    /**
     * Starts polling cycle.
     *
     * @api public
     */

    Polling.prototype.poll = function () {
      debug$2('polling');
      this.polling = true;
      this.doPoll();
      this.emit('poll');
    };

    /**
     * Overloads onData to detect payloads.
     *
     * @api private
     */

    Polling.prototype.onData = function (data) {
      var self = this;
      debug$2('polling got data %s', data);
      var callback = function (packet, index, total) {
        // if its the first message we consider the transport open
        if ('opening' === self.readyState) {
          self.onOpen();
        }

        // if its a close packet, we close the ongoing requests
        if ('close' === packet.type) {
          self.onClose();
          return false;
        }

        // otherwise bypass onData and handle the message
        self.onPacket(packet);
      };

      // decode payload
      browser$2.decodePayload(data, this.socket.binaryType, callback);

      // if an event did not trigger closing
      if ('closed' !== this.readyState) {
        // if we got data we're not polling
        this.polling = false;
        this.emit('pollComplete');

        if ('open' === this.readyState) {
          this.poll();
        } else {
          debug$2('ignoring poll - transport state "%s"', this.readyState);
        }
      }
    };

    /**
     * For polling, send a close packet.
     *
     * @api private
     */

    Polling.prototype.doClose = function () {
      var self = this;

      function close () {
        debug$2('writing close packet');
        self.write([{ type: 'close' }]);
      }

      if ('open' === this.readyState) {
        debug$2('transport open - closing');
        close();
      } else {
        // in case we're trying to close while
        // handshaking is in progress (GH-164)
        debug$2('transport not open - deferring close');
        this.once('open', close);
      }
    };

    /**
     * Writes a packets payload.
     *
     * @param {Array} data packets
     * @param {Function} drain callback
     * @api private
     */

    Polling.prototype.write = function (packets) {
      var self = this;
      this.writable = false;
      var callbackfn = function () {
        self.writable = true;
        self.emit('drain');
      };

      browser$2.encodePayload(packets, this.supportsBinary, function (data) {
        self.doWrite(data, callbackfn);
      });
    };

    /**
     * Generates uri for connection.
     *
     * @api private
     */

    Polling.prototype.uri = function () {
      var query = this.query || {};
      var schema = this.secure ? 'https' : 'http';
      var port = '';

      // cache busting is forced
      if (false !== this.timestampRequests) {
        query[this.timestampParam] = yeast_1();
      }

      if (!this.supportsBinary && !query.sid) {
        query.b64 = 1;
      }

      query = parseqs.encode(query);

      // avoid port if default for schema
      if (this.port && (('https' === schema && Number(this.port) !== 443) ||
         ('http' === schema && Number(this.port) !== 80))) {
        port = ':' + this.port;
      }

      // prepend ? to query
      if (query.length) {
        query = '?' + query;
      }

      var ipv6 = this.hostname.indexOf(':') !== -1;
      return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
    };

    /* global attachEvent */

    /**
     * Module requirements.
     */





    var debug$3 = browser$3('engine.io-client:polling-xhr');


    /**
     * Module exports.
     */

    var pollingXhr = XHR;
    var Request_1 = Request;

    /**
     * Empty function
     */

    function empty$1 () {}

    /**
     * XHR Polling constructor.
     *
     * @param {Object} opts
     * @api public
     */

    function XHR (opts) {
      polling.call(this, opts);
      this.requestTimeout = opts.requestTimeout;
      this.extraHeaders = opts.extraHeaders;

      if (typeof location !== 'undefined') {
        var isSSL = 'https:' === location.protocol;
        var port = location.port;

        // some user agents have empty `location.port`
        if (!port) {
          port = isSSL ? 443 : 80;
        }

        this.xd = (typeof location !== 'undefined' && opts.hostname !== location.hostname) ||
          port !== opts.port;
        this.xs = opts.secure !== isSSL;
      }
    }

    /**
     * Inherits from Polling.
     */

    componentInherit(XHR, polling);

    /**
     * XHR supports binary
     */

    XHR.prototype.supportsBinary = true;

    /**
     * Creates a request.
     *
     * @param {String} method
     * @api private
     */

    XHR.prototype.request = function (opts) {
      opts = opts || {};
      opts.uri = this.uri();
      opts.xd = this.xd;
      opts.xs = this.xs;
      opts.agent = this.agent || false;
      opts.supportsBinary = this.supportsBinary;
      opts.enablesXDR = this.enablesXDR;
      opts.withCredentials = this.withCredentials;

      // SSL options for Node.js client
      opts.pfx = this.pfx;
      opts.key = this.key;
      opts.passphrase = this.passphrase;
      opts.cert = this.cert;
      opts.ca = this.ca;
      opts.ciphers = this.ciphers;
      opts.rejectUnauthorized = this.rejectUnauthorized;
      opts.requestTimeout = this.requestTimeout;

      // other options for Node.js client
      opts.extraHeaders = this.extraHeaders;

      return new Request(opts);
    };

    /**
     * Sends data.
     *
     * @param {String} data to send.
     * @param {Function} called upon flush.
     * @api private
     */

    XHR.prototype.doWrite = function (data, fn) {
      var isBinary = typeof data !== 'string' && data !== undefined;
      var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
      var self = this;
      req.on('success', fn);
      req.on('error', function (err) {
        self.onError('xhr post error', err);
      });
      this.sendXhr = req;
    };

    /**
     * Starts a poll cycle.
     *
     * @api private
     */

    XHR.prototype.doPoll = function () {
      debug$3('xhr poll');
      var req = this.request();
      var self = this;
      req.on('data', function (data) {
        self.onData(data);
      });
      req.on('error', function (err) {
        self.onError('xhr poll error', err);
      });
      this.pollXhr = req;
    };

    /**
     * Request constructor
     *
     * @param {Object} options
     * @api public
     */

    function Request (opts) {
      this.method = opts.method || 'GET';
      this.uri = opts.uri;
      this.xd = !!opts.xd;
      this.xs = !!opts.xs;
      this.async = false !== opts.async;
      this.data = undefined !== opts.data ? opts.data : null;
      this.agent = opts.agent;
      this.isBinary = opts.isBinary;
      this.supportsBinary = opts.supportsBinary;
      this.enablesXDR = opts.enablesXDR;
      this.withCredentials = opts.withCredentials;
      this.requestTimeout = opts.requestTimeout;

      // SSL options for Node.js client
      this.pfx = opts.pfx;
      this.key = opts.key;
      this.passphrase = opts.passphrase;
      this.cert = opts.cert;
      this.ca = opts.ca;
      this.ciphers = opts.ciphers;
      this.rejectUnauthorized = opts.rejectUnauthorized;

      // other options for Node.js client
      this.extraHeaders = opts.extraHeaders;

      this.create();
    }

    /**
     * Mix in `Emitter`.
     */

    componentEmitter$1(Request.prototype);

    /**
     * Creates the XHR object and sends the request.
     *
     * @api private
     */

    Request.prototype.create = function () {
      var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

      // SSL options for Node.js client
      opts.pfx = this.pfx;
      opts.key = this.key;
      opts.passphrase = this.passphrase;
      opts.cert = this.cert;
      opts.ca = this.ca;
      opts.ciphers = this.ciphers;
      opts.rejectUnauthorized = this.rejectUnauthorized;

      var xhr = this.xhr = new xmlhttprequest(opts);
      var self = this;

      try {
        debug$3('xhr open %s: %s', this.method, this.uri);
        xhr.open(this.method, this.uri, this.async);
        try {
          if (this.extraHeaders) {
            xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
            for (var i in this.extraHeaders) {
              if (this.extraHeaders.hasOwnProperty(i)) {
                xhr.setRequestHeader(i, this.extraHeaders[i]);
              }
            }
          }
        } catch (e) {}

        if ('POST' === this.method) {
          try {
            if (this.isBinary) {
              xhr.setRequestHeader('Content-type', 'application/octet-stream');
            } else {
              xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
            }
          } catch (e) {}
        }

        try {
          xhr.setRequestHeader('Accept', '*/*');
        } catch (e) {}

        // ie6 check
        if ('withCredentials' in xhr) {
          xhr.withCredentials = this.withCredentials;
        }

        if (this.requestTimeout) {
          xhr.timeout = this.requestTimeout;
        }

        if (this.hasXDR()) {
          xhr.onload = function () {
            self.onLoad();
          };
          xhr.onerror = function () {
            self.onError(xhr.responseText);
          };
        } else {
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 2) {
              try {
                var contentType = xhr.getResponseHeader('Content-Type');
                if (self.supportsBinary && contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
                  xhr.responseType = 'arraybuffer';
                }
              } catch (e) {}
            }
            if (4 !== xhr.readyState) return;
            if (200 === xhr.status || 1223 === xhr.status) {
              self.onLoad();
            } else {
              // make sure the `error` event handler that's user-set
              // does not throw in the same tick and gets caught here
              setTimeout(function () {
                self.onError(typeof xhr.status === 'number' ? xhr.status : 0);
              }, 0);
            }
          };
        }

        debug$3('xhr data %s', this.data);
        xhr.send(this.data);
      } catch (e) {
        // Need to defer since .create() is called directly fhrom the constructor
        // and thus the 'error' event can only be only bound *after* this exception
        // occurs.  Therefore, also, we cannot throw here at all.
        setTimeout(function () {
          self.onError(e);
        }, 0);
        return;
      }

      if (typeof document !== 'undefined') {
        this.index = Request.requestsCount++;
        Request.requests[this.index] = this;
      }
    };

    /**
     * Called upon successful response.
     *
     * @api private
     */

    Request.prototype.onSuccess = function () {
      this.emit('success');
      this.cleanup();
    };

    /**
     * Called if we have data.
     *
     * @api private
     */

    Request.prototype.onData = function (data) {
      this.emit('data', data);
      this.onSuccess();
    };

    /**
     * Called upon error.
     *
     * @api private
     */

    Request.prototype.onError = function (err) {
      this.emit('error', err);
      this.cleanup(true);
    };

    /**
     * Cleans up house.
     *
     * @api private
     */

    Request.prototype.cleanup = function (fromError) {
      if ('undefined' === typeof this.xhr || null === this.xhr) {
        return;
      }
      // xmlhttprequest
      if (this.hasXDR()) {
        this.xhr.onload = this.xhr.onerror = empty$1;
      } else {
        this.xhr.onreadystatechange = empty$1;
      }

      if (fromError) {
        try {
          this.xhr.abort();
        } catch (e) {}
      }

      if (typeof document !== 'undefined') {
        delete Request.requests[this.index];
      }

      this.xhr = null;
    };

    /**
     * Called upon load.
     *
     * @api private
     */

    Request.prototype.onLoad = function () {
      var data;
      try {
        var contentType;
        try {
          contentType = this.xhr.getResponseHeader('Content-Type');
        } catch (e) {}
        if (contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
          data = this.xhr.response || this.xhr.responseText;
        } else {
          data = this.xhr.responseText;
        }
      } catch (e) {
        this.onError(e);
      }
      if (null != data) {
        this.onData(data);
      }
    };

    /**
     * Check if it has XDomainRequest.
     *
     * @api private
     */

    Request.prototype.hasXDR = function () {
      return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
    };

    /**
     * Aborts the request.
     *
     * @api public
     */

    Request.prototype.abort = function () {
      this.cleanup();
    };

    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */

    Request.requestsCount = 0;
    Request.requests = {};

    if (typeof document !== 'undefined') {
      if (typeof attachEvent === 'function') {
        attachEvent('onunload', unloadHandler);
      } else if (typeof addEventListener === 'function') {
        var terminationEvent = 'onpagehide' in globalThis_browser ? 'pagehide' : 'unload';
        addEventListener(terminationEvent, unloadHandler, false);
      }
    }

    function unloadHandler () {
      for (var i in Request.requests) {
        if (Request.requests.hasOwnProperty(i)) {
          Request.requests[i].abort();
        }
      }
    }
    pollingXhr.Request = Request_1;

    /**
     * Module requirements.
     */





    /**
     * Module exports.
     */

    var pollingJsonp = JSONPPolling;

    /**
     * Cached regular expressions.
     */

    var rNewline = /\n/g;
    var rEscapedNewline = /\\n/g;

    /**
     * Global JSONP callbacks.
     */

    var callbacks;

    /**
     * Noop.
     */

    function empty$2 () { }

    /**
     * JSONP Polling constructor.
     *
     * @param {Object} opts.
     * @api public
     */

    function JSONPPolling (opts) {
      polling.call(this, opts);

      this.query = this.query || {};

      // define global callbacks array if not present
      // we do this here (lazily) to avoid unneeded global pollution
      if (!callbacks) {
        // we need to consider multiple engines in the same page
        callbacks = globalThis_browser.___eio = (globalThis_browser.___eio || []);
      }

      // callback identifier
      this.index = callbacks.length;

      // add callback to jsonp global
      var self = this;
      callbacks.push(function (msg) {
        self.onData(msg);
      });

      // append to query string
      this.query.j = this.index;

      // prevent spurious errors from being emitted when the window is unloaded
      if (typeof addEventListener === 'function') {
        addEventListener('beforeunload', function () {
          if (self.script) self.script.onerror = empty$2;
        }, false);
      }
    }

    /**
     * Inherits from Polling.
     */

    componentInherit(JSONPPolling, polling);

    /*
     * JSONP only supports binary as base64 encoded strings
     */

    JSONPPolling.prototype.supportsBinary = false;

    /**
     * Closes the socket.
     *
     * @api private
     */

    JSONPPolling.prototype.doClose = function () {
      if (this.script) {
        this.script.parentNode.removeChild(this.script);
        this.script = null;
      }

      if (this.form) {
        this.form.parentNode.removeChild(this.form);
        this.form = null;
        this.iframe = null;
      }

      polling.prototype.doClose.call(this);
    };

    /**
     * Starts a poll cycle.
     *
     * @api private
     */

    JSONPPolling.prototype.doPoll = function () {
      var self = this;
      var script = document.createElement('script');

      if (this.script) {
        this.script.parentNode.removeChild(this.script);
        this.script = null;
      }

      script.async = true;
      script.src = this.uri();
      script.onerror = function (e) {
        self.onError('jsonp poll error', e);
      };

      var insertAt = document.getElementsByTagName('script')[0];
      if (insertAt) {
        insertAt.parentNode.insertBefore(script, insertAt);
      } else {
        (document.head || document.body).appendChild(script);
      }
      this.script = script;

      var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

      if (isUAgecko) {
        setTimeout(function () {
          var iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          document.body.removeChild(iframe);
        }, 100);
      }
    };

    /**
     * Writes with a hidden iframe.
     *
     * @param {String} data to send
     * @param {Function} called upon flush.
     * @api private
     */

    JSONPPolling.prototype.doWrite = function (data, fn) {
      var self = this;

      if (!this.form) {
        var form = document.createElement('form');
        var area = document.createElement('textarea');
        var id = this.iframeId = 'eio_iframe_' + this.index;
        var iframe;

        form.className = 'socketio';
        form.style.position = 'absolute';
        form.style.top = '-1000px';
        form.style.left = '-1000px';
        form.target = id;
        form.method = 'POST';
        form.setAttribute('accept-charset', 'utf-8');
        area.name = 'd';
        form.appendChild(area);
        document.body.appendChild(form);

        this.form = form;
        this.area = area;
      }

      this.form.action = this.uri();

      function complete () {
        initIframe();
        fn();
      }

      function initIframe () {
        if (self.iframe) {
          try {
            self.form.removeChild(self.iframe);
          } catch (e) {
            self.onError('jsonp polling iframe removal error', e);
          }
        }

        try {
          // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
          var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
          iframe = document.createElement(html);
        } catch (e) {
          iframe = document.createElement('iframe');
          iframe.name = self.iframeId;
          iframe.src = 'javascript:0';
        }

        iframe.id = self.iframeId;

        self.form.appendChild(iframe);
        self.iframe = iframe;
      }

      initIframe();

      // escape \n to prevent it from being converted into \r\n by some UAs
      // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
      data = data.replace(rEscapedNewline, '\\\n');
      this.area.value = data.replace(rNewline, '\\n');

      try {
        this.form.submit();
      } catch (e) {}

      if (this.iframe.attachEvent) {
        this.iframe.onreadystatechange = function () {
          if (self.iframe.readyState === 'complete') {
            complete();
          }
        };
      } else {
        this.iframe.onload = complete;
      }
    };

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _nodeResolve_empty
    });

    var require$$1 = getCjsExportFromNamespace(_nodeResolve_empty$1);

    /**
     * Module dependencies.
     */






    var debug$4 = browser$3('engine.io-client:websocket');

    var BrowserWebSocket, NodeWebSocket;

    if (typeof WebSocket !== 'undefined') {
      BrowserWebSocket = WebSocket;
    } else if (typeof self !== 'undefined') {
      BrowserWebSocket = self.WebSocket || self.MozWebSocket;
    }

    if (typeof window === 'undefined') {
      try {
        NodeWebSocket = require$$1;
      } catch (e) { }
    }

    /**
     * Get either the `WebSocket` or `MozWebSocket` globals
     * in the browser or try to resolve WebSocket-compatible
     * interface exposed by `ws` for Node-like environment.
     */

    var WebSocketImpl = BrowserWebSocket || NodeWebSocket;

    /**
     * Module exports.
     */

    var websocket = WS;

    /**
     * WebSocket transport constructor.
     *
     * @api {Object} connection options
     * @api public
     */

    function WS (opts) {
      var forceBase64 = (opts && opts.forceBase64);
      if (forceBase64) {
        this.supportsBinary = false;
      }
      this.perMessageDeflate = opts.perMessageDeflate;
      this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
      this.protocols = opts.protocols;
      if (!this.usingBrowserWebSocket) {
        WebSocketImpl = NodeWebSocket;
      }
      transport.call(this, opts);
    }

    /**
     * Inherits from Transport.
     */

    componentInherit(WS, transport);

    /**
     * Transport name.
     *
     * @api public
     */

    WS.prototype.name = 'websocket';

    /*
     * WebSockets support binary
     */

    WS.prototype.supportsBinary = true;

    /**
     * Opens socket.
     *
     * @api private
     */

    WS.prototype.doOpen = function () {
      if (!this.check()) {
        // let probe timeout
        return;
      }

      var uri = this.uri();
      var protocols = this.protocols;
      var opts = {
        agent: this.agent,
        perMessageDeflate: this.perMessageDeflate
      };

      // SSL options for Node.js client
      opts.pfx = this.pfx;
      opts.key = this.key;
      opts.passphrase = this.passphrase;
      opts.cert = this.cert;
      opts.ca = this.ca;
      opts.ciphers = this.ciphers;
      opts.rejectUnauthorized = this.rejectUnauthorized;
      if (this.extraHeaders) {
        opts.headers = this.extraHeaders;
      }
      if (this.localAddress) {
        opts.localAddress = this.localAddress;
      }

      try {
        this.ws =
          this.usingBrowserWebSocket && !this.isReactNative
            ? protocols
              ? new WebSocketImpl(uri, protocols)
              : new WebSocketImpl(uri)
            : new WebSocketImpl(uri, protocols, opts);
      } catch (err) {
        return this.emit('error', err);
      }

      if (this.ws.binaryType === undefined) {
        this.supportsBinary = false;
      }

      if (this.ws.supports && this.ws.supports.binary) {
        this.supportsBinary = true;
        this.ws.binaryType = 'nodebuffer';
      } else {
        this.ws.binaryType = 'arraybuffer';
      }

      this.addEventListeners();
    };

    /**
     * Adds event listeners to the socket
     *
     * @api private
     */

    WS.prototype.addEventListeners = function () {
      var self = this;

      this.ws.onopen = function () {
        self.onOpen();
      };
      this.ws.onclose = function () {
        self.onClose();
      };
      this.ws.onmessage = function (ev) {
        self.onData(ev.data);
      };
      this.ws.onerror = function (e) {
        self.onError('websocket error', e);
      };
    };

    /**
     * Writes data to socket.
     *
     * @param {Array} array of packets.
     * @api private
     */

    WS.prototype.write = function (packets) {
      var self = this;
      this.writable = false;

      // encodePacket efficient as it uses WS framing
      // no need for encodePayload
      var total = packets.length;
      for (var i = 0, l = total; i < l; i++) {
        (function (packet) {
          browser$2.encodePacket(packet, self.supportsBinary, function (data) {
            if (!self.usingBrowserWebSocket) {
              // always create a new object (GH-437)
              var opts = {};
              if (packet.options) {
                opts.compress = packet.options.compress;
              }

              if (self.perMessageDeflate) {
                var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
                if (len < self.perMessageDeflate.threshold) {
                  opts.compress = false;
                }
              }
            }

            // Sometimes the websocket has already been closed but the browser didn't
            // have a chance of informing us about it yet, in that case send will
            // throw an error
            try {
              if (self.usingBrowserWebSocket) {
                // TypeError is thrown when passing the second argument on Safari
                self.ws.send(data);
              } else {
                self.ws.send(data, opts);
              }
            } catch (e) {
              debug$4('websocket closed before onclose event');
            }

            --total || done();
          });
        })(packets[i]);
      }

      function done () {
        self.emit('flush');

        // fake drain
        // defer to next tick to allow Socket to clear writeBuffer
        setTimeout(function () {
          self.writable = true;
          self.emit('drain');
        }, 0);
      }
    };

    /**
     * Called upon close
     *
     * @api private
     */

    WS.prototype.onClose = function () {
      transport.prototype.onClose.call(this);
    };

    /**
     * Closes socket.
     *
     * @api private
     */

    WS.prototype.doClose = function () {
      if (typeof this.ws !== 'undefined') {
        this.ws.close();
      }
    };

    /**
     * Generates uri for connection.
     *
     * @api private
     */

    WS.prototype.uri = function () {
      var query = this.query || {};
      var schema = this.secure ? 'wss' : 'ws';
      var port = '';

      // avoid port if default for schema
      if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
        ('ws' === schema && Number(this.port) !== 80))) {
        port = ':' + this.port;
      }

      // append timestamp to URI
      if (this.timestampRequests) {
        query[this.timestampParam] = yeast_1();
      }

      // communicate binary support capabilities
      if (!this.supportsBinary) {
        query.b64 = 1;
      }

      query = parseqs.encode(query);

      // prepend ? to query
      if (query.length) {
        query = '?' + query;
      }

      var ipv6 = this.hostname.indexOf(':') !== -1;
      return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
    };

    /**
     * Feature detection for WebSocket.
     *
     * @return {Boolean} whether this transport is available.
     * @api public
     */

    WS.prototype.check = function () {
      return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
    };

    /**
     * Module dependencies
     */






    /**
     * Export transports.
     */

    var polling_1 = polling$1;
    var websocket_1 = websocket;

    /**
     * Polling transport polymorphic constructor.
     * Decides on xhr vs jsonp based on feature detection.
     *
     * @api private
     */

    function polling$1 (opts) {
      var xhr;
      var xd = false;
      var xs = false;
      var jsonp = false !== opts.jsonp;

      if (typeof location !== 'undefined') {
        var isSSL = 'https:' === location.protocol;
        var port = location.port;

        // some user agents have empty `location.port`
        if (!port) {
          port = isSSL ? 443 : 80;
        }

        xd = opts.hostname !== location.hostname || port !== opts.port;
        xs = opts.secure !== isSSL;
      }

      opts.xdomain = xd;
      opts.xscheme = xs;
      xhr = new xmlhttprequest(opts);

      if ('open' in xhr && !opts.forceJSONP) {
        return new pollingXhr(opts);
      } else {
        if (!jsonp) throw new Error('JSONP disabled');
        return new pollingJsonp(opts);
      }
    }

    var transports = {
    	polling: polling_1,
    	websocket: websocket_1
    };

    var indexOf = [].indexOf;

    var indexof = function(arr, obj){
      if (indexOf) return arr.indexOf(obj);
      for (var i = 0; i < arr.length; ++i) {
        if (arr[i] === obj) return i;
      }
      return -1;
    };

    /**
     * Module dependencies.
     */



    var debug$5 = browser$3('engine.io-client:socket');





    /**
     * Module exports.
     */

    var socket = Socket;

    /**
     * Socket constructor.
     *
     * @param {String|Object} uri or options
     * @param {Object} options
     * @api public
     */

    function Socket (uri, opts) {
      if (!(this instanceof Socket)) return new Socket(uri, opts);

      opts = opts || {};

      if (uri && 'object' === typeof uri) {
        opts = uri;
        uri = null;
      }

      if (uri) {
        uri = parseuri(uri);
        opts.hostname = uri.host;
        opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
        opts.port = uri.port;
        if (uri.query) opts.query = uri.query;
      } else if (opts.host) {
        opts.hostname = parseuri(opts.host).host;
      }

      this.secure = null != opts.secure ? opts.secure
        : (typeof location !== 'undefined' && 'https:' === location.protocol);

      if (opts.hostname && !opts.port) {
        // if no port is specified manually, use the protocol default
        opts.port = this.secure ? '443' : '80';
      }

      this.agent = opts.agent || false;
      this.hostname = opts.hostname ||
        (typeof location !== 'undefined' ? location.hostname : 'localhost');
      this.port = opts.port || (typeof location !== 'undefined' && location.port
          ? location.port
          : (this.secure ? 443 : 80));
      this.query = opts.query || {};
      if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
      this.upgrade = false !== opts.upgrade;
      this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
      this.forceJSONP = !!opts.forceJSONP;
      this.jsonp = false !== opts.jsonp;
      this.forceBase64 = !!opts.forceBase64;
      this.enablesXDR = !!opts.enablesXDR;
      this.withCredentials = false !== opts.withCredentials;
      this.timestampParam = opts.timestampParam || 't';
      this.timestampRequests = opts.timestampRequests;
      this.transports = opts.transports || ['polling', 'websocket'];
      this.transportOptions = opts.transportOptions || {};
      this.readyState = '';
      this.writeBuffer = [];
      this.prevBufferLen = 0;
      this.policyPort = opts.policyPort || 843;
      this.rememberUpgrade = opts.rememberUpgrade || false;
      this.binaryType = null;
      this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
      this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

      if (true === this.perMessageDeflate) this.perMessageDeflate = {};
      if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
        this.perMessageDeflate.threshold = 1024;
      }

      // SSL options for Node.js client
      this.pfx = opts.pfx || null;
      this.key = opts.key || null;
      this.passphrase = opts.passphrase || null;
      this.cert = opts.cert || null;
      this.ca = opts.ca || null;
      this.ciphers = opts.ciphers || null;
      this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
      this.forceNode = !!opts.forceNode;

      // detect ReactNative environment
      this.isReactNative = (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative');

      // other options for Node.js or ReactNative client
      if (typeof self === 'undefined' || this.isReactNative) {
        if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
          this.extraHeaders = opts.extraHeaders;
        }

        if (opts.localAddress) {
          this.localAddress = opts.localAddress;
        }
      }

      // set on handshake
      this.id = null;
      this.upgrades = null;
      this.pingInterval = null;
      this.pingTimeout = null;

      // set on heartbeat
      this.pingIntervalTimer = null;
      this.pingTimeoutTimer = null;

      this.open();
    }

    Socket.priorWebsocketSuccess = false;

    /**
     * Mix in `Emitter`.
     */

    componentEmitter$1(Socket.prototype);

    /**
     * Protocol version.
     *
     * @api public
     */

    Socket.protocol = browser$2.protocol; // this is an int

    /**
     * Expose deps for legacy compatibility
     * and standalone browser access.
     */

    Socket.Socket = Socket;
    Socket.Transport = transport;
    Socket.transports = transports;
    Socket.parser = browser$2;

    /**
     * Creates transport of the given type.
     *
     * @param {String} transport name
     * @return {Transport}
     * @api private
     */

    Socket.prototype.createTransport = function (name) {
      debug$5('creating transport "%s"', name);
      var query = clone(this.query);

      // append engine.io protocol identifier
      query.EIO = browser$2.protocol;

      // transport name
      query.transport = name;

      // per-transport options
      var options = this.transportOptions[name] || {};

      // session id if we already have one
      if (this.id) query.sid = this.id;

      var transport = new transports[name]({
        query: query,
        socket: this,
        agent: options.agent || this.agent,
        hostname: options.hostname || this.hostname,
        port: options.port || this.port,
        secure: options.secure || this.secure,
        path: options.path || this.path,
        forceJSONP: options.forceJSONP || this.forceJSONP,
        jsonp: options.jsonp || this.jsonp,
        forceBase64: options.forceBase64 || this.forceBase64,
        enablesXDR: options.enablesXDR || this.enablesXDR,
        withCredentials: options.withCredentials || this.withCredentials,
        timestampRequests: options.timestampRequests || this.timestampRequests,
        timestampParam: options.timestampParam || this.timestampParam,
        policyPort: options.policyPort || this.policyPort,
        pfx: options.pfx || this.pfx,
        key: options.key || this.key,
        passphrase: options.passphrase || this.passphrase,
        cert: options.cert || this.cert,
        ca: options.ca || this.ca,
        ciphers: options.ciphers || this.ciphers,
        rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
        perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
        extraHeaders: options.extraHeaders || this.extraHeaders,
        forceNode: options.forceNode || this.forceNode,
        localAddress: options.localAddress || this.localAddress,
        requestTimeout: options.requestTimeout || this.requestTimeout,
        protocols: options.protocols || void (0),
        isReactNative: this.isReactNative
      });

      return transport;
    };

    function clone (obj) {
      var o = {};
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          o[i] = obj[i];
        }
      }
      return o;
    }

    /**
     * Initializes transport to use and starts probe.
     *
     * @api private
     */
    Socket.prototype.open = function () {
      var transport;
      if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
        transport = 'websocket';
      } else if (0 === this.transports.length) {
        // Emit error on next tick so it can be listened to
        var self = this;
        setTimeout(function () {
          self.emit('error', 'No transports available');
        }, 0);
        return;
      } else {
        transport = this.transports[0];
      }
      this.readyState = 'opening';

      // Retry with the next transport if the transport is disabled (jsonp: false)
      try {
        transport = this.createTransport(transport);
      } catch (e) {
        this.transports.shift();
        this.open();
        return;
      }

      transport.open();
      this.setTransport(transport);
    };

    /**
     * Sets the current transport. Disables the existing one (if any).
     *
     * @api private
     */

    Socket.prototype.setTransport = function (transport) {
      debug$5('setting transport %s', transport.name);
      var self = this;

      if (this.transport) {
        debug$5('clearing existing transport %s', this.transport.name);
        this.transport.removeAllListeners();
      }

      // set up transport
      this.transport = transport;

      // set up transport listeners
      transport
      .on('drain', function () {
        self.onDrain();
      })
      .on('packet', function (packet) {
        self.onPacket(packet);
      })
      .on('error', function (e) {
        self.onError(e);
      })
      .on('close', function () {
        self.onClose('transport close');
      });
    };

    /**
     * Probes a transport.
     *
     * @param {String} transport name
     * @api private
     */

    Socket.prototype.probe = function (name) {
      debug$5('probing transport "%s"', name);
      var transport = this.createTransport(name, { probe: 1 });
      var failed = false;
      var self = this;

      Socket.priorWebsocketSuccess = false;

      function onTransportOpen () {
        if (self.onlyBinaryUpgrades) {
          var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
          failed = failed || upgradeLosesBinary;
        }
        if (failed) return;

        debug$5('probe transport "%s" opened', name);
        transport.send([{ type: 'ping', data: 'probe' }]);
        transport.once('packet', function (msg) {
          if (failed) return;
          if ('pong' === msg.type && 'probe' === msg.data) {
            debug$5('probe transport "%s" pong', name);
            self.upgrading = true;
            self.emit('upgrading', transport);
            if (!transport) return;
            Socket.priorWebsocketSuccess = 'websocket' === transport.name;

            debug$5('pausing current transport "%s"', self.transport.name);
            self.transport.pause(function () {
              if (failed) return;
              if ('closed' === self.readyState) return;
              debug$5('changing transport and sending upgrade packet');

              cleanup();

              self.setTransport(transport);
              transport.send([{ type: 'upgrade' }]);
              self.emit('upgrade', transport);
              transport = null;
              self.upgrading = false;
              self.flush();
            });
          } else {
            debug$5('probe transport "%s" failed', name);
            var err = new Error('probe error');
            err.transport = transport.name;
            self.emit('upgradeError', err);
          }
        });
      }

      function freezeTransport () {
        if (failed) return;

        // Any callback called by transport should be ignored since now
        failed = true;

        cleanup();

        transport.close();
        transport = null;
      }

      // Handle any error that happens while probing
      function onerror (err) {
        var error = new Error('probe error: ' + err);
        error.transport = transport.name;

        freezeTransport();

        debug$5('probe transport "%s" failed because of error: %s', name, err);

        self.emit('upgradeError', error);
      }

      function onTransportClose () {
        onerror('transport closed');
      }

      // When the socket is closed while we're probing
      function onclose () {
        onerror('socket closed');
      }

      // When the socket is upgraded while we're probing
      function onupgrade (to) {
        if (transport && to.name !== transport.name) {
          debug$5('"%s" works - aborting "%s"', to.name, transport.name);
          freezeTransport();
        }
      }

      // Remove all listeners on the transport and on self
      function cleanup () {
        transport.removeListener('open', onTransportOpen);
        transport.removeListener('error', onerror);
        transport.removeListener('close', onTransportClose);
        self.removeListener('close', onclose);
        self.removeListener('upgrading', onupgrade);
      }

      transport.once('open', onTransportOpen);
      transport.once('error', onerror);
      transport.once('close', onTransportClose);

      this.once('close', onclose);
      this.once('upgrading', onupgrade);

      transport.open();
    };

    /**
     * Called when connection is deemed open.
     *
     * @api public
     */

    Socket.prototype.onOpen = function () {
      debug$5('socket open');
      this.readyState = 'open';
      Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
      this.emit('open');
      this.flush();

      // we check for `readyState` in case an `open`
      // listener already closed the socket
      if ('open' === this.readyState && this.upgrade && this.transport.pause) {
        debug$5('starting upgrade probes');
        for (var i = 0, l = this.upgrades.length; i < l; i++) {
          this.probe(this.upgrades[i]);
        }
      }
    };

    /**
     * Handles a packet.
     *
     * @api private
     */

    Socket.prototype.onPacket = function (packet) {
      if ('opening' === this.readyState || 'open' === this.readyState ||
          'closing' === this.readyState) {
        debug$5('socket receive: type "%s", data "%s"', packet.type, packet.data);

        this.emit('packet', packet);

        // Socket is live - any packet counts
        this.emit('heartbeat');

        switch (packet.type) {
          case 'open':
            this.onHandshake(JSON.parse(packet.data));
            break;

          case 'pong':
            this.setPing();
            this.emit('pong');
            break;

          case 'error':
            var err = new Error('server error');
            err.code = packet.data;
            this.onError(err);
            break;

          case 'message':
            this.emit('data', packet.data);
            this.emit('message', packet.data);
            break;
        }
      } else {
        debug$5('packet received with socket readyState "%s"', this.readyState);
      }
    };

    /**
     * Called upon handshake completion.
     *
     * @param {Object} handshake obj
     * @api private
     */

    Socket.prototype.onHandshake = function (data) {
      this.emit('handshake', data);
      this.id = data.sid;
      this.transport.query.sid = data.sid;
      this.upgrades = this.filterUpgrades(data.upgrades);
      this.pingInterval = data.pingInterval;
      this.pingTimeout = data.pingTimeout;
      this.onOpen();
      // In case open handler closes socket
      if ('closed' === this.readyState) return;
      this.setPing();

      // Prolong liveness of socket on heartbeat
      this.removeListener('heartbeat', this.onHeartbeat);
      this.on('heartbeat', this.onHeartbeat);
    };

    /**
     * Resets ping timeout.
     *
     * @api private
     */

    Socket.prototype.onHeartbeat = function (timeout) {
      clearTimeout(this.pingTimeoutTimer);
      var self = this;
      self.pingTimeoutTimer = setTimeout(function () {
        if ('closed' === self.readyState) return;
        self.onClose('ping timeout');
      }, timeout || (self.pingInterval + self.pingTimeout));
    };

    /**
     * Pings server every `this.pingInterval` and expects response
     * within `this.pingTimeout` or closes connection.
     *
     * @api private
     */

    Socket.prototype.setPing = function () {
      var self = this;
      clearTimeout(self.pingIntervalTimer);
      self.pingIntervalTimer = setTimeout(function () {
        debug$5('writing ping packet - expecting pong within %sms', self.pingTimeout);
        self.ping();
        self.onHeartbeat(self.pingTimeout);
      }, self.pingInterval);
    };

    /**
    * Sends a ping packet.
    *
    * @api private
    */

    Socket.prototype.ping = function () {
      var self = this;
      this.sendPacket('ping', function () {
        self.emit('ping');
      });
    };

    /**
     * Called on `drain` event
     *
     * @api private
     */

    Socket.prototype.onDrain = function () {
      this.writeBuffer.splice(0, this.prevBufferLen);

      // setting prevBufferLen = 0 is very important
      // for example, when upgrading, upgrade packet is sent over,
      // and a nonzero prevBufferLen could cause problems on `drain`
      this.prevBufferLen = 0;

      if (0 === this.writeBuffer.length) {
        this.emit('drain');
      } else {
        this.flush();
      }
    };

    /**
     * Flush write buffers.
     *
     * @api private
     */

    Socket.prototype.flush = function () {
      if ('closed' !== this.readyState && this.transport.writable &&
        !this.upgrading && this.writeBuffer.length) {
        debug$5('flushing %d packets in socket', this.writeBuffer.length);
        this.transport.send(this.writeBuffer);
        // keep track of current length of writeBuffer
        // splice writeBuffer and callbackBuffer on `drain`
        this.prevBufferLen = this.writeBuffer.length;
        this.emit('flush');
      }
    };

    /**
     * Sends a message.
     *
     * @param {String} message.
     * @param {Function} callback function.
     * @param {Object} options.
     * @return {Socket} for chaining.
     * @api public
     */

    Socket.prototype.write =
    Socket.prototype.send = function (msg, options, fn) {
      this.sendPacket('message', msg, options, fn);
      return this;
    };

    /**
     * Sends a packet.
     *
     * @param {String} packet type.
     * @param {String} data.
     * @param {Object} options.
     * @param {Function} callback function.
     * @api private
     */

    Socket.prototype.sendPacket = function (type, data, options, fn) {
      if ('function' === typeof data) {
        fn = data;
        data = undefined;
      }

      if ('function' === typeof options) {
        fn = options;
        options = null;
      }

      if ('closing' === this.readyState || 'closed' === this.readyState) {
        return;
      }

      options = options || {};
      options.compress = false !== options.compress;

      var packet = {
        type: type,
        data: data,
        options: options
      };
      this.emit('packetCreate', packet);
      this.writeBuffer.push(packet);
      if (fn) this.once('flush', fn);
      this.flush();
    };

    /**
     * Closes the connection.
     *
     * @api private
     */

    Socket.prototype.close = function () {
      if ('opening' === this.readyState || 'open' === this.readyState) {
        this.readyState = 'closing';

        var self = this;

        if (this.writeBuffer.length) {
          this.once('drain', function () {
            if (this.upgrading) {
              waitForUpgrade();
            } else {
              close();
            }
          });
        } else if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      }

      function close () {
        self.onClose('forced close');
        debug$5('socket closing - telling transport to close');
        self.transport.close();
      }

      function cleanupAndClose () {
        self.removeListener('upgrade', cleanupAndClose);
        self.removeListener('upgradeError', cleanupAndClose);
        close();
      }

      function waitForUpgrade () {
        // wait for upgrade to finish since we can't send packets while pausing a transport
        self.once('upgrade', cleanupAndClose);
        self.once('upgradeError', cleanupAndClose);
      }

      return this;
    };

    /**
     * Called upon transport error
     *
     * @api private
     */

    Socket.prototype.onError = function (err) {
      debug$5('socket error %j', err);
      Socket.priorWebsocketSuccess = false;
      this.emit('error', err);
      this.onClose('transport error', err);
    };

    /**
     * Called upon transport close.
     *
     * @api private
     */

    Socket.prototype.onClose = function (reason, desc) {
      if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
        debug$5('socket close with reason: "%s"', reason);
        var self = this;

        // clear timers
        clearTimeout(this.pingIntervalTimer);
        clearTimeout(this.pingTimeoutTimer);

        // stop event from firing again for transport
        this.transport.removeAllListeners('close');

        // ensure transport won't stay open
        this.transport.close();

        // ignore further transport communication
        this.transport.removeAllListeners();

        // set ready state
        this.readyState = 'closed';

        // clear session id
        this.id = null;

        // emit close event
        this.emit('close', reason, desc);

        // clean buffers after, so users can still
        // grab the buffers on `close` event
        self.writeBuffer = [];
        self.prevBufferLen = 0;
      }
    };

    /**
     * Filters upgrades, returning only those matching client transports.
     *
     * @param {Array} server upgrades
     * @api private
     *
     */

    Socket.prototype.filterUpgrades = function (upgrades) {
      var filteredUpgrades = [];
      for (var i = 0, j = upgrades.length; i < j; i++) {
        if (~indexof(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
      }
      return filteredUpgrades;
    };

    var lib = socket;

    /**
     * Exports parser
     *
     * @api public
     *
     */
    var parser = browser$2;
    lib.parser = parser;

    var toArray_1 = toArray;

    function toArray(list, index) {
        var array = [];

        index = index || 0;

        for (var i = index || 0; i < list.length; i++) {
            array[i - index] = list[i];
        }

        return array
    }

    /**
     * Module exports.
     */

    var on_1 = on;

    /**
     * Helper for subscriptions.
     *
     * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
     * @param {String} event name
     * @param {Function} callback
     * @api public
     */

    function on (obj, ev, fn) {
      obj.on(ev, fn);
      return {
        destroy: function () {
          obj.removeListener(ev, fn);
        }
      };
    }

    /**
     * Slice reference.
     */

    var slice = [].slice;

    /**
     * Bind `obj` to `fn`.
     *
     * @param {Object} obj
     * @param {Function|String} fn or string
     * @return {Function}
     * @api public
     */

    var componentBind = function(obj, fn){
      if ('string' == typeof fn) fn = obj[fn];
      if ('function' != typeof fn) throw new Error('bind() requires a function');
      var args = slice.call(arguments, 2);
      return function(){
        return fn.apply(obj, args.concat(slice.call(arguments)));
      }
    };

    var socket$1 = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */






    var debug = browser('socket.io-client:socket');



    /**
     * Module exports.
     */

    module.exports = exports = Socket;

    /**
     * Internal events (blacklisted).
     * These events can't be emitted by the user.
     *
     * @api private
     */

    var events = {
      connect: 1,
      connect_error: 1,
      connect_timeout: 1,
      connecting: 1,
      disconnect: 1,
      error: 1,
      reconnect: 1,
      reconnect_attempt: 1,
      reconnect_failed: 1,
      reconnect_error: 1,
      reconnecting: 1,
      ping: 1,
      pong: 1
    };

    /**
     * Shortcut to `Emitter#emit`.
     */

    var emit = componentEmitter.prototype.emit;

    /**
     * `Socket` constructor.
     *
     * @api public
     */

    function Socket (io, nsp, opts) {
      this.io = io;
      this.nsp = nsp;
      this.json = this; // compat
      this.ids = 0;
      this.acks = {};
      this.receiveBuffer = [];
      this.sendBuffer = [];
      this.connected = false;
      this.disconnected = true;
      this.flags = {};
      if (opts && opts.query) {
        this.query = opts.query;
      }
      if (this.io.autoConnect) this.open();
    }

    /**
     * Mix in `Emitter`.
     */

    componentEmitter(Socket.prototype);

    /**
     * Subscribe to open, close and packet events
     *
     * @api private
     */

    Socket.prototype.subEvents = function () {
      if (this.subs) return;

      var io = this.io;
      this.subs = [
        on_1(io, 'open', componentBind(this, 'onopen')),
        on_1(io, 'packet', componentBind(this, 'onpacket')),
        on_1(io, 'close', componentBind(this, 'onclose'))
      ];
    };

    /**
     * "Opens" the socket.
     *
     * @api public
     */

    Socket.prototype.open =
    Socket.prototype.connect = function () {
      if (this.connected) return this;

      this.subEvents();
      this.io.open(); // ensure open
      if ('open' === this.io.readyState) this.onopen();
      this.emit('connecting');
      return this;
    };

    /**
     * Sends a `message` event.
     *
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.send = function () {
      var args = toArray_1(arguments);
      args.unshift('message');
      this.emit.apply(this, args);
      return this;
    };

    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @param {String} event name
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.emit = function (ev) {
      if (events.hasOwnProperty(ev)) {
        emit.apply(this, arguments);
        return this;
      }

      var args = toArray_1(arguments);
      var packet = {
        type: (this.flags.binary !== undefined ? this.flags.binary : hasBinary2(args)) ? socket_ioParser.BINARY_EVENT : socket_ioParser.EVENT,
        data: args
      };

      packet.options = {};
      packet.options.compress = !this.flags || false !== this.flags.compress;

      // event ack callback
      if ('function' === typeof args[args.length - 1]) {
        debug('emitting packet with ack id %d', this.ids);
        this.acks[this.ids] = args.pop();
        packet.id = this.ids++;
      }

      if (this.connected) {
        this.packet(packet);
      } else {
        this.sendBuffer.push(packet);
      }

      this.flags = {};

      return this;
    };

    /**
     * Sends a packet.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.packet = function (packet) {
      packet.nsp = this.nsp;
      this.io.packet(packet);
    };

    /**
     * Called upon engine `open`.
     *
     * @api private
     */

    Socket.prototype.onopen = function () {
      debug('transport is open - connecting');

      // write connect packet if necessary
      if ('/' !== this.nsp) {
        if (this.query) {
          var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
          debug('sending connect packet with query %s', query);
          this.packet({type: socket_ioParser.CONNECT, query: query});
        } else {
          this.packet({type: socket_ioParser.CONNECT});
        }
      }
    };

    /**
     * Called upon engine `close`.
     *
     * @param {String} reason
     * @api private
     */

    Socket.prototype.onclose = function (reason) {
      debug('close (%s)', reason);
      this.connected = false;
      this.disconnected = true;
      delete this.id;
      this.emit('disconnect', reason);
    };

    /**
     * Called with socket packet.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onpacket = function (packet) {
      var sameNamespace = packet.nsp === this.nsp;
      var rootNamespaceError = packet.type === socket_ioParser.ERROR && packet.nsp === '/';

      if (!sameNamespace && !rootNamespaceError) return;

      switch (packet.type) {
        case socket_ioParser.CONNECT:
          this.onconnect();
          break;

        case socket_ioParser.EVENT:
          this.onevent(packet);
          break;

        case socket_ioParser.BINARY_EVENT:
          this.onevent(packet);
          break;

        case socket_ioParser.ACK:
          this.onack(packet);
          break;

        case socket_ioParser.BINARY_ACK:
          this.onack(packet);
          break;

        case socket_ioParser.DISCONNECT:
          this.ondisconnect();
          break;

        case socket_ioParser.ERROR:
          this.emit('error', packet.data);
          break;
      }
    };

    /**
     * Called upon a server event.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onevent = function (packet) {
      var args = packet.data || [];
      debug('emitting event %j', args);

      if (null != packet.id) {
        debug('attaching ack callback to event');
        args.push(this.ack(packet.id));
      }

      if (this.connected) {
        emit.apply(this, args);
      } else {
        this.receiveBuffer.push(args);
      }
    };

    /**
     * Produces an ack callback to emit with an event.
     *
     * @api private
     */

    Socket.prototype.ack = function (id) {
      var self = this;
      var sent = false;
      return function () {
        // prevent double callbacks
        if (sent) return;
        sent = true;
        var args = toArray_1(arguments);
        debug('sending ack %j', args);

        self.packet({
          type: hasBinary2(args) ? socket_ioParser.BINARY_ACK : socket_ioParser.ACK,
          id: id,
          data: args
        });
      };
    };

    /**
     * Called upon a server acknowlegement.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onack = function (packet) {
      var ack = this.acks[packet.id];
      if ('function' === typeof ack) {
        debug('calling ack %s with %j', packet.id, packet.data);
        ack.apply(this, packet.data);
        delete this.acks[packet.id];
      } else {
        debug('bad ack %s', packet.id);
      }
    };

    /**
     * Called upon server connect.
     *
     * @api private
     */

    Socket.prototype.onconnect = function () {
      this.connected = true;
      this.disconnected = false;
      this.emit('connect');
      this.emitBuffered();
    };

    /**
     * Emit buffered events (received and emitted).
     *
     * @api private
     */

    Socket.prototype.emitBuffered = function () {
      var i;
      for (i = 0; i < this.receiveBuffer.length; i++) {
        emit.apply(this, this.receiveBuffer[i]);
      }
      this.receiveBuffer = [];

      for (i = 0; i < this.sendBuffer.length; i++) {
        this.packet(this.sendBuffer[i]);
      }
      this.sendBuffer = [];
    };

    /**
     * Called upon server disconnect.
     *
     * @api private
     */

    Socket.prototype.ondisconnect = function () {
      debug('server disconnect (%s)', this.nsp);
      this.destroy();
      this.onclose('io server disconnect');
    };

    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @api private.
     */

    Socket.prototype.destroy = function () {
      if (this.subs) {
        // clean subscriptions to avoid reconnections
        for (var i = 0; i < this.subs.length; i++) {
          this.subs[i].destroy();
        }
        this.subs = null;
      }

      this.io.destroy(this);
    };

    /**
     * Disconnects the socket manually.
     *
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.close =
    Socket.prototype.disconnect = function () {
      if (this.connected) {
        debug('performing disconnect (%s)', this.nsp);
        this.packet({ type: socket_ioParser.DISCONNECT });
      }

      // remove socket from pool
      this.destroy();

      if (this.connected) {
        // fire events
        this.onclose('io client disconnect');
      }
      return this;
    };

    /**
     * Sets the compress flag.
     *
     * @param {Boolean} if `true`, compresses the sending data
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.compress = function (compress) {
      this.flags.compress = compress;
      return this;
    };

    /**
     * Sets the binary flag
     *
     * @param {Boolean} whether the emitted data contains binary
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.binary = function (binary) {
      this.flags.binary = binary;
      return this;
    };
    });

    /**
     * Expose `Backoff`.
     */

    var backo2 = Backoff;

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */

    function Backoff(opts) {
      opts = opts || {};
      this.ms = opts.min || 100;
      this.max = opts.max || 10000;
      this.factor = opts.factor || 2;
      this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
      this.attempts = 0;
    }

    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */

    Backoff.prototype.duration = function(){
      var ms = this.ms * Math.pow(this.factor, this.attempts++);
      if (this.jitter) {
        var rand =  Math.random();
        var deviation = Math.floor(rand * this.jitter * ms);
        ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
      }
      return Math.min(ms, this.max) | 0;
    };

    /**
     * Reset the number of attempts.
     *
     * @api public
     */

    Backoff.prototype.reset = function(){
      this.attempts = 0;
    };

    /**
     * Set the minimum duration
     *
     * @api public
     */

    Backoff.prototype.setMin = function(min){
      this.ms = min;
    };

    /**
     * Set the maximum duration
     *
     * @api public
     */

    Backoff.prototype.setMax = function(max){
      this.max = max;
    };

    /**
     * Set the jitter
     *
     * @api public
     */

    Backoff.prototype.setJitter = function(jitter){
      this.jitter = jitter;
    };

    /**
     * Module dependencies.
     */







    var debug$6 = browser('socket.io-client:manager');



    /**
     * IE6+ hasOwnProperty
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Module exports
     */

    var manager = Manager;

    /**
     * `Manager` constructor.
     *
     * @param {String} engine instance or engine uri/opts
     * @param {Object} options
     * @api public
     */

    function Manager (uri, opts) {
      if (!(this instanceof Manager)) return new Manager(uri, opts);
      if (uri && ('object' === typeof uri)) {
        opts = uri;
        uri = undefined;
      }
      opts = opts || {};

      opts.path = opts.path || '/socket.io';
      this.nsps = {};
      this.subs = [];
      this.opts = opts;
      this.reconnection(opts.reconnection !== false);
      this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
      this.reconnectionDelay(opts.reconnectionDelay || 1000);
      this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
      this.randomizationFactor(opts.randomizationFactor || 0.5);
      this.backoff = new backo2({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor()
      });
      this.timeout(null == opts.timeout ? 20000 : opts.timeout);
      this.readyState = 'closed';
      this.uri = uri;
      this.connecting = [];
      this.lastPing = null;
      this.encoding = false;
      this.packetBuffer = [];
      var _parser = opts.parser || socket_ioParser;
      this.encoder = new _parser.Encoder();
      this.decoder = new _parser.Decoder();
      this.autoConnect = opts.autoConnect !== false;
      if (this.autoConnect) this.open();
    }

    /**
     * Propagate given event to sockets and emit on `this`
     *
     * @api private
     */

    Manager.prototype.emitAll = function () {
      this.emit.apply(this, arguments);
      for (var nsp in this.nsps) {
        if (has.call(this.nsps, nsp)) {
          this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
        }
      }
    };

    /**
     * Update `socket.id` of all sockets
     *
     * @api private
     */

    Manager.prototype.updateSocketIds = function () {
      for (var nsp in this.nsps) {
        if (has.call(this.nsps, nsp)) {
          this.nsps[nsp].id = this.generateId(nsp);
        }
      }
    };

    /**
     * generate `socket.id` for the given `nsp`
     *
     * @param {String} nsp
     * @return {String}
     * @api private
     */

    Manager.prototype.generateId = function (nsp) {
      return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
    };

    /**
     * Mix in `Emitter`.
     */

    componentEmitter(Manager.prototype);

    /**
     * Sets the `reconnection` config.
     *
     * @param {Boolean} true/false if it should automatically reconnect
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnection = function (v) {
      if (!arguments.length) return this._reconnection;
      this._reconnection = !!v;
      return this;
    };

    /**
     * Sets the reconnection attempts config.
     *
     * @param {Number} max reconnection attempts before giving up
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionAttempts = function (v) {
      if (!arguments.length) return this._reconnectionAttempts;
      this._reconnectionAttempts = v;
      return this;
    };

    /**
     * Sets the delay between reconnections.
     *
     * @param {Number} delay
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionDelay = function (v) {
      if (!arguments.length) return this._reconnectionDelay;
      this._reconnectionDelay = v;
      this.backoff && this.backoff.setMin(v);
      return this;
    };

    Manager.prototype.randomizationFactor = function (v) {
      if (!arguments.length) return this._randomizationFactor;
      this._randomizationFactor = v;
      this.backoff && this.backoff.setJitter(v);
      return this;
    };

    /**
     * Sets the maximum delay between reconnections.
     *
     * @param {Number} delay
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionDelayMax = function (v) {
      if (!arguments.length) return this._reconnectionDelayMax;
      this._reconnectionDelayMax = v;
      this.backoff && this.backoff.setMax(v);
      return this;
    };

    /**
     * Sets the connection timeout. `false` to disable
     *
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.timeout = function (v) {
      if (!arguments.length) return this._timeout;
      this._timeout = v;
      return this;
    };

    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @api private
     */

    Manager.prototype.maybeReconnectOnOpen = function () {
      // Only try to reconnect if it's the first time we're connecting
      if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
        // keeps reconnection from firing twice for the same reconnection loop
        this.reconnect();
      }
    };

    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} optional, callback
     * @return {Manager} self
     * @api public
     */

    Manager.prototype.open =
    Manager.prototype.connect = function (fn, opts) {
      debug$6('readyState %s', this.readyState);
      if (~this.readyState.indexOf('open')) return this;

      debug$6('opening %s', this.uri);
      this.engine = lib(this.uri, this.opts);
      var socket = this.engine;
      var self = this;
      this.readyState = 'opening';
      this.skipReconnect = false;

      // emit `open`
      var openSub = on_1(socket, 'open', function () {
        self.onopen();
        fn && fn();
      });

      // emit `connect_error`
      var errorSub = on_1(socket, 'error', function (data) {
        debug$6('connect_error');
        self.cleanup();
        self.readyState = 'closed';
        self.emitAll('connect_error', data);
        if (fn) {
          var err = new Error('Connection error');
          err.data = data;
          fn(err);
        } else {
          // Only do this if there is no fn to handle the error
          self.maybeReconnectOnOpen();
        }
      });

      // emit `connect_timeout`
      if (false !== this._timeout) {
        var timeout = this._timeout;
        debug$6('connect attempt will timeout after %d', timeout);

        // set timer
        var timer = setTimeout(function () {
          debug$6('connect attempt timed out after %d', timeout);
          openSub.destroy();
          socket.close();
          socket.emit('error', 'timeout');
          self.emitAll('connect_timeout', timeout);
        }, timeout);

        this.subs.push({
          destroy: function () {
            clearTimeout(timer);
          }
        });
      }

      this.subs.push(openSub);
      this.subs.push(errorSub);

      return this;
    };

    /**
     * Called upon transport open.
     *
     * @api private
     */

    Manager.prototype.onopen = function () {
      debug$6('open');

      // clear old subs
      this.cleanup();

      // mark as open
      this.readyState = 'open';
      this.emit('open');

      // add new subs
      var socket = this.engine;
      this.subs.push(on_1(socket, 'data', componentBind(this, 'ondata')));
      this.subs.push(on_1(socket, 'ping', componentBind(this, 'onping')));
      this.subs.push(on_1(socket, 'pong', componentBind(this, 'onpong')));
      this.subs.push(on_1(socket, 'error', componentBind(this, 'onerror')));
      this.subs.push(on_1(socket, 'close', componentBind(this, 'onclose')));
      this.subs.push(on_1(this.decoder, 'decoded', componentBind(this, 'ondecoded')));
    };

    /**
     * Called upon a ping.
     *
     * @api private
     */

    Manager.prototype.onping = function () {
      this.lastPing = new Date();
      this.emitAll('ping');
    };

    /**
     * Called upon a packet.
     *
     * @api private
     */

    Manager.prototype.onpong = function () {
      this.emitAll('pong', new Date() - this.lastPing);
    };

    /**
     * Called with data.
     *
     * @api private
     */

    Manager.prototype.ondata = function (data) {
      this.decoder.add(data);
    };

    /**
     * Called when parser fully decodes a packet.
     *
     * @api private
     */

    Manager.prototype.ondecoded = function (packet) {
      this.emit('packet', packet);
    };

    /**
     * Called upon socket error.
     *
     * @api private
     */

    Manager.prototype.onerror = function (err) {
      debug$6('error', err);
      this.emitAll('error', err);
    };

    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @api public
     */

    Manager.prototype.socket = function (nsp, opts) {
      var socket = this.nsps[nsp];
      if (!socket) {
        socket = new socket$1(this, nsp, opts);
        this.nsps[nsp] = socket;
        var self = this;
        socket.on('connecting', onConnecting);
        socket.on('connect', function () {
          socket.id = self.generateId(nsp);
        });

        if (this.autoConnect) {
          // manually call here since connecting event is fired before listening
          onConnecting();
        }
      }

      function onConnecting () {
        if (!~indexof(self.connecting, socket)) {
          self.connecting.push(socket);
        }
      }

      return socket;
    };

    /**
     * Called upon a socket close.
     *
     * @param {Socket} socket
     */

    Manager.prototype.destroy = function (socket) {
      var index = indexof(this.connecting, socket);
      if (~index) this.connecting.splice(index, 1);
      if (this.connecting.length) return;

      this.close();
    };

    /**
     * Writes a packet.
     *
     * @param {Object} packet
     * @api private
     */

    Manager.prototype.packet = function (packet) {
      debug$6('writing packet %j', packet);
      var self = this;
      if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

      if (!self.encoding) {
        // encode, then write to engine with result
        self.encoding = true;
        this.encoder.encode(packet, function (encodedPackets) {
          for (var i = 0; i < encodedPackets.length; i++) {
            self.engine.write(encodedPackets[i], packet.options);
          }
          self.encoding = false;
          self.processPacketQueue();
        });
      } else { // add packet to the queue
        self.packetBuffer.push(packet);
      }
    };

    /**
     * If packet buffer is non-empty, begins encoding the
     * next packet in line.
     *
     * @api private
     */

    Manager.prototype.processPacketQueue = function () {
      if (this.packetBuffer.length > 0 && !this.encoding) {
        var pack = this.packetBuffer.shift();
        this.packet(pack);
      }
    };

    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @api private
     */

    Manager.prototype.cleanup = function () {
      debug$6('cleanup');

      var subsLength = this.subs.length;
      for (var i = 0; i < subsLength; i++) {
        var sub = this.subs.shift();
        sub.destroy();
      }

      this.packetBuffer = [];
      this.encoding = false;
      this.lastPing = null;

      this.decoder.destroy();
    };

    /**
     * Close the current socket.
     *
     * @api private
     */

    Manager.prototype.close =
    Manager.prototype.disconnect = function () {
      debug$6('disconnect');
      this.skipReconnect = true;
      this.reconnecting = false;
      if ('opening' === this.readyState) {
        // `onclose` will not fire because
        // an open event never happened
        this.cleanup();
      }
      this.backoff.reset();
      this.readyState = 'closed';
      if (this.engine) this.engine.close();
    };

    /**
     * Called upon engine close.
     *
     * @api private
     */

    Manager.prototype.onclose = function (reason) {
      debug$6('onclose');

      this.cleanup();
      this.backoff.reset();
      this.readyState = 'closed';
      this.emit('close', reason);

      if (this._reconnection && !this.skipReconnect) {
        this.reconnect();
      }
    };

    /**
     * Attempt a reconnection.
     *
     * @api private
     */

    Manager.prototype.reconnect = function () {
      if (this.reconnecting || this.skipReconnect) return this;

      var self = this;

      if (this.backoff.attempts >= this._reconnectionAttempts) {
        debug$6('reconnect failed');
        this.backoff.reset();
        this.emitAll('reconnect_failed');
        this.reconnecting = false;
      } else {
        var delay = this.backoff.duration();
        debug$6('will wait %dms before reconnect attempt', delay);

        this.reconnecting = true;
        var timer = setTimeout(function () {
          if (self.skipReconnect) return;

          debug$6('attempting reconnect');
          self.emitAll('reconnect_attempt', self.backoff.attempts);
          self.emitAll('reconnecting', self.backoff.attempts);

          // check again for the case socket closed in above events
          if (self.skipReconnect) return;

          self.open(function (err) {
            if (err) {
              debug$6('reconnect attempt error');
              self.reconnecting = false;
              self.reconnect();
              self.emitAll('reconnect_error', err.data);
            } else {
              debug$6('reconnect success');
              self.onreconnect();
            }
          });
        }, delay);

        this.subs.push({
          destroy: function () {
            clearTimeout(timer);
          }
        });
      }
    };

    /**
     * Called upon successful reconnect.
     *
     * @api private
     */

    Manager.prototype.onreconnect = function () {
      var attempt = this.backoff.attempts;
      this.reconnecting = false;
      this.backoff.reset();
      this.updateSocketIds();
      this.emitAll('reconnect', attempt);
    };

    var lib$1 = createCommonjsModule(function (module, exports) {
    /**
     * Module dependencies.
     */




    var debug = browser('socket.io-client');

    /**
     * Module exports.
     */

    module.exports = exports = lookup;

    /**
     * Managers cache.
     */

    var cache = exports.managers = {};

    /**
     * Looks up an existing `Manager` for multiplexing.
     * If the user summons:
     *
     *   `io('http://localhost/a');`
     *   `io('http://localhost/b');`
     *
     * We reuse the existing instance based on same scheme/port/host,
     * and we initialize sockets for each namespace.
     *
     * @api public
     */

    function lookup (uri, opts) {
      if (typeof uri === 'object') {
        opts = uri;
        uri = undefined;
      }

      opts = opts || {};

      var parsed = url_1(uri);
      var source = parsed.source;
      var id = parsed.id;
      var path = parsed.path;
      var sameNamespace = cache[id] && path in cache[id].nsps;
      var newConnection = opts.forceNew || opts['force new connection'] ||
                          false === opts.multiplex || sameNamespace;

      var io;

      if (newConnection) {
        debug('ignoring socket cache for %s', source);
        io = manager(source, opts);
      } else {
        if (!cache[id]) {
          debug('new io instance for %s', source);
          cache[id] = manager(source, opts);
        }
        io = cache[id];
      }
      if (parsed.query && !opts.query) {
        opts.query = parsed.query;
      }
      return io.socket(parsed.path, opts);
    }

    /**
     * Protocol version.
     *
     * @api public
     */

    exports.protocol = socket_ioParser.protocol;

    /**
     * `connect`.
     *
     * @param {String} uri
     * @api public
     */

    exports.connect = lookup;

    /**
     * Expose constructors for standalone build.
     *
     * @api public
     */

    exports.Manager = manager;
    exports.Socket = socket$1;
    });
    var lib_1 = lib$1.managers;
    var lib_2 = lib$1.protocol;
    var lib_3 = lib$1.connect;
    var lib_4 = lib$1.Manager;
    var lib_5 = lib$1.Socket;

    class Position {

        constructor(xPos, yPos, empty) {
            this.xPos = xPos;
            this.yPos = yPos;

            if(empty == 'E')
                this.isEmpty = true;
            else 
                this.isEmpty = false;
        }
    }

    class Piece {

        constructor(xPos, yPos, side, id, stack) {

            this.id = id;
            this.positon = new Position(xPos, yPos, side);
            this.side = side;

            if(stack != null)
                this.stack = stack;
            else
                this.stack = 1;
        }

        getPosition() {
            return this.positon;
        }

        setPosition(xPos, yPos) {
            this.positon = new Position(xPos, yPos, null);
        }

        incrementStack() {
            this.stack = 2;
        }
    }

    class Board {

        constructor(state, inverted) {

            if(state == null && !inverted) {

                this.board = [];

                let i, j, k = 0;

                for(i = 0; i < 8; i++) {

                    this.board[i] = [];
                
                    for(j = 0; j < 8; j++) {
                
                        let even = (i % 2 == 0) && (j % 2 == 0);
                        let odd = (i % 2 != 0) && (j % 2 != 0);
                
                        if(even || odd || i == 3 || i == 4) {
                        
                            this.board[i][j] = null;

                        } else  {

                            if(0 <= i && i <= 2)
                                this.board[i][j] = new Piece(i, j, "black", k, null);
                                
                            else 
                                this.board[i][j] = new Piece(i, j, "red", k, null);

                            k++;
                        }
                    }
                }

            } else if(state != null && inverted == null) {

                this.board = [];

                let i, j;

                for(i = 0; i < 8; i++) {

                    this.board[i] = [];

                    for(j = 0; j < 8; j++) {

                        if(state[i][j] != null) {
                            this.board[i][j] = new Piece(i, j, state[i][j].side, state[i][j].id, state[i][j].stack);
                        } else {
                            this.board[i][j] = null;
                        }
                    }
                }

            } else if(state == null && inverted) {

                this.board = [];

                let i, j, k = 23;

                for(i = 0; i < 8; i++) {

                    this.board[i] = [];

                    for(j = 0; j < 8; j++) {

                        let even = (i % 2 == 0) && (j % 2 == 0);
                        let odd = (i % 2 != 0) && (j % 2 != 0);
                
                        if(even || odd || i == 3 || i == 4) {
                        
                            this.board[i][j] = null;

                        } else  {

                            if(0 <= i && i <= 2)
                                this.board[i][j] = new Piece(i, j, "red", k, null);
                                
                            else 
                                this.board[i][j] = new Piece(i, j, "black", k, null);

                            k--;
                        }
                    }
                }
            }
        }

        saveBoardState() {

    		let state = [];
    		let i, j;

    		for(i = 0; i < 8; i++) {
    			state[i] = [];
    			for(j = 0; j < 8; j++) {
                    if(this.board[i][j] != null) {
                        state[i][j] = {};
                        state[i][j].stack = this.board[i][j].stack;
                        state[i][j].side = this.board[i][j].side;
                        state[i][j].id = this.board[i][j].id;
                    }
    				else {
                        state[i][j] = null;
                    }
    			}
    		}

    		return state;
    	}


        takePiece(piece, currPos, yDiff, nextPos) {

            let isTaken = false;
    /*
            if(piece.side == 'U' && piece.stack == 1) {

                let xPiece = currPos.xPos + 1;
                let yPiece = null;

                if(yDiff < 0)
                    yPiece = currPos.yPos - 1;
                if(yDiff > 0)
                    yPiece = currPos.yPos + 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }

            if(piece.side == 'D' && piece.stack == 1) {

                let xPiece = currPos.xPos - 1;
                let yPiece = null;

                if(yDiff < 0)
                    yPiece = currPos.yPos + 1;
                if(yDiff > 0)
                    yPiece = currPos.yPos - 1;

                if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                    this.board[xPiece][yPiece] = null;
                    isTaken = true;
                }
            }

            if(piece.stack > 1) {
    */
                let xPiece = null;
                let yPiece = null;

                if(nextPos.xPos < currPos.xPos && nextPos.yPos < currPos.yPos) {

                    xPiece = currPos.xPos - 1;
                    yPiece = currPos.yPos - 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }

                if(nextPos.xPos < currPos.xPos && nextPos.yPos > currPos.yPos) {

                    xPiece = currPos.xPos - 1;
                    yPiece = currPos.yPos + 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }

                if(nextPos.xPos > currPos.xPos && nextPos.yPos < currPos.yPos) {

                    xPiece = currPos.xPos + 1;
                    yPiece = currPos.yPos - 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }

                if(nextPos.xPos > currPos.xPos && nextPos.yPos > currPos.yPos) {

                    xPiece = currPos.xPos + 1;
                    yPiece = currPos.yPos + 1;

                    if(this.board[xPiece][yPiece] != null && this.board[xPiece][yPiece].side != piece.side) {
                        this.board[xPiece][yPiece] = null;
                        isTaken = true;
                    }
                }
            //}

            return isTaken;
        }


        isMoveLegal(piece, nextPos) {

            let name, priPlayer, secPlayer;

            currUser.update(state => {
                name = state.name;
                return state;
            });
            
            gamePref.update(state => {
                priPlayer = state.pri;
                secPlayer = state.sec;
                return state
            });

            let legal = false;

            let currPos = piece.getPosition();

            /* if(piece.side == "black" && nextPos.isEmpty) {

                let xDiff = nextPos.xPos - currPos.xPos;

                let yDiff = nextPos.yPos - currPos.yPos;

                if(piece.stack == 1) {

                    let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == 1;

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq)
                        legal = true;

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                        legal = true;
                    }

                } else {

                    let oneSq = (xDiff == 1 || xDiff == -1) && (yDiff == 1 || yDiff == -1);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq)
                        legal = true;

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                        legal = true;
                    }
                }
            } */

            console.log(nextPos.isEmpty);

            console.log("red: " + piece.side == "red");
            console.log("black: " + piece.side == "black");

            if(piece.side == "red" && nextPos.isEmpty && name == priPlayer) {

                console.log(currPos.xPos + ", " + currPos.yPos + " --> " + nextPos.xPos + ", " + nextPos.yPos);

                let xDiff = currPos.xPos - nextPos.xPos;

                let yDiff = currPos.yPos - nextPos.yPos;

                if(piece.stack == 1) {

                    //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

                    let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == 1;

                    //console.log(oneSq);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq) {
                        //console.log(nextPos.xPos + ", " + nextPos.yPos);
                        legal = true;
                    }

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) 
                        legal = true;

                } else {

                    let oneSq = (xDiff == 1 || xDiff == -1) && (yDiff == 1 || yDiff == -1);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq)
                        legal = true;

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) 
                        legal = true;
                }
            }

            if(piece.side == "black" && nextPos.isEmpty && name == secPlayer) {

                //console.log(currPos.xPos + ", " + currPos.yPos + " --> " + nextPos.xPos + ", " + nextPos.yPos);

                let xDiff = currPos.xPos - nextPos.xPos;

                let yDiff = currPos.yPos - nextPos.yPos;

                if(piece.stack == 1) {

                    //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

                    let oneSq = (yDiff == 1 || yDiff == -1) && xDiff == 1;

                    //console.log(oneSq);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq) {
                        //console.log(nextPos.xPos + ", " + nextPos.yPos);
                        legal = true;
                    }

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) {
                        //console.log(nextPos.xPos + ", " + nextPos.yPos);
                        legal = true;
                    }
                        

                } else {

                    let oneSq = (xDiff == 1 || xDiff == -1) && (yDiff == 1 || yDiff == -1);

                    let twoSq = (xDiff == 2 || xDiff == -2) && (yDiff == 2 || yDiff == -2);

                    if(oneSq)
                        legal = true;

                    if(twoSq && this.takePiece(piece, currPos, yDiff, nextPos)) 
                        legal = true;
                }
            }

            return legal;
        }


        doMove(piece, nextPos) {

            let name, priPlayer, secPlayer;

            currUser.update(state => {
                name = state.name;
                return state;
            });
            
            gamePref.update(state => {
                priPlayer = state.pri;
                secPlayer = state.sec;
                return state
            });

            let moved = false, remove = null;

            if(this.isMoveLegal(piece, nextPos)) {

                remove = this.scanBoard(piece, nextPos);

                let newPiece = new Piece(nextPos.xPos, nextPos.yPos, piece.side, piece.id, piece.stack);

                if(name == priPlayer) {

                    if(nextPos.xPos == 0 && newPiece.side == "red" && newPiece.stack == 1) 
                        newPiece.incrementStack();
                } 
                
                if(name == secPlayer) {

                    if(nextPos.xPos == 0 && newPiece.side == "black" && newPiece.stack == 1) 
                        newPiece.incrementStack();
                }

                this.board[nextPos.xPos][nextPos.yPos] = newPiece;
                
                let currPos = piece.getPosition(); 

                this.board[currPos.xPos][currPos.yPos] = null;

                moved = true;
            }

            return { move: moved, id: remove };
        } 

        scanBoard(piece, nextPos) {

            let i, j;

            let remove = null;

            for(i = 0; i < 8; i++) {
                for(j = 0; j < 8; j++) {
                    if(this.board[i][j] != null && this.board[i][j].id != piece.id && this.board[i][j].side == piece.side) {
                        if(this.checkPiece(this.board[i][j], piece, nextPos)) {
                            remove = piece.id;
                            break;
                        }
                    }
                }
            }

            return remove;
        }


        checkPiece(currPiece, piece, nextPos) {

            //console.log(currPiece.id);

            let autoRemove = false;

            let xNext = nextPos.xPos;
            let yNext = nextPos.yPos;

            let xPos = currPiece.getPosition().xPos;
            let yPos = currPiece.getPosition().yPos;

            if(0 <= xPos - 2 && 0 <= yPos - 2 && xPos - 2 <= 7 && yPos - 2 <= 7) {
                //console.log("Upper Left");
                if(this.board[xPos - 1][yPos - 1] != null && this.board[xPos - 1][yPos - 1].side != piece.side && this.board[xPos - 2][yPos - 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Upper Left");
                }
            }

            if(0 <= xPos + 2 && 0 <= yPos + 2 && xPos + 2 <= 7 && yPos + 2 <= 7) {
                //console.log("Lower Right");
                if(autoRemove == false && this.board[xPos + 1][yPos + 1] != null && this.board[xPos + 1][yPos + 1].side != piece.side && this.board[xPos + 2][yPos + 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Lower Right");
                }
            }

            if(0 <= xPos - 2 && 0 <= yPos + 2 && xPos - 2 <= 7 && yPos + 2 <= 7) {
                //console.log("Upper Right");
                if(autoRemove == false && this.board[xPos - 1][yPos + 1] != null && this.board[xPos - 1][yPos + 1].side != piece.side && this.board[xPos - 2][yPos + 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Upper Right");
                }
            }

            if(0 <= xPos + 2 && 0 <= yPos - 2 && xPos + 2 <= 7 && yPos - 2 <= 7) {
                //console.log("Lower Left");
                if(autoRemove == false && this.board[xPos + 1][yPos - 1] != null && this.board[xPos + 1][yPos - 1].side != piece.side && this.board[xPos + 2][yPos - 2] == null) {
                    this.board[xPos][yPos] = null;
                    autoRemove = true;
                    //console.log("Lower Left");
                }
            }

            return autoRemove;
        }


        removePiece(piece) {
            let xPos = piece.getPosition().xPos;
            let yPos = piece.getPosition().yPos;

            this.board[xPos][yPos] = null;
        }


        otherPlayerMove(piece, xDiff, yDiff) {

            let name, priPlayer, secPlayer;

            currUser.update(state => {
                name = state.name;
                return state;
            });
            
            gamePref.update(state => {
                priPlayer = state.pri;
                secPlayer = state.sec;
                return state
            });

            let xPos = piece.getPosition().xPos;
            let yPos = piece.getPosition().yPos;

            let nextPosX = xPos + xDiff;
            let nextPosY = yPos + yDiff;

            //console.log(xPos + ", " + yPos + " --> " + nextPosX+ ", " + nextPosY);
            //console.log("xDiff:" + xDiff + ", yDiff:" + yDiff);

            let newPiece = new Piece(nextPosX, nextPosY, piece.side, piece.id, piece.stack);

            if(name == priPlayer) {

                if(nextPosX == 0 && newPiece.side == "red" && newPiece.stack == 1) 
                    newPiece.incrementStack();
            } 
            
            if(name == secPlayer) {

                if(nextPosX == 0 && newPiece.side == "black" && newPiece.stack == 1) 
                    newPiece.incrementStack();
            }

            this.board[nextPosX][nextPosY] = newPiece;

            if(xDiff == 2 && yDiff == 2) {

                nextPosX = xPos + (xDiff / 2);
                nextPosY = yPos + (yDiff / 2);

                this.board[nextPosX][nextPosY] = null;
            }

            this.board[xPos][yPos] = null;
        }


        isEmpty(xpos, ypos) {

            if(this.board[xpos][ypos] != null)
                return false;
            else
                return true;
        }

        getId(i, j) {
            return this.board[i][j].id;
        }

        getSide(i, j) {

            return this.board[i][j].side;
        }

        getPiece(i, j) {
            
            if(this.board[i][j] != null)
                return this.board[i][j];

        }

        getPieceFromId(id) {

            let i, j;

            let piece;

            for(i = 0; i < 8; i++) {
                for(j = 0; j < 8; j++) {
                    if(this.board[i][j] != null) {
                        if(this.board[i][j].id == id) {
                            piece = this.board[i][j];
                            break;
                        }
                    }
                }
            }

            return piece;
        }

        getBoard() {
            return this.board;
        }

    }

    window.onload = async function() {

        if (sessionStorage.getItem('idx') != null) {

            const indexes = await JSON.parse(sessionStorage.getItem('idx'));
            
            await currUser.set(indexes.user);

            await gameBoard.set(new Board(indexes.board.board, null));

            await gameHistory.set(indexes.history);

            await gamePref.set(indexes.pref);

            await gameChat.set(indexes.chat);

            await gameTab.set(indexes.tab);

            await userGames.set(indexes.games);

            await page.set(indexes.page);

            sessionStorage.removeItem('idx');
        }
    };

    const currSocket = writable(lib$1("https://checkerio-server.herokuapp.com/"));

    const currUser = writable(null);

    const page = writable(0);

    const gameTab = writable(0);

    const userGames = writable([]);

    const gameBoard = writable(null);

    const gameHistory = writable([]);

    const gamePref = writable(null);

    const gameChat = writable([]);

    window.onbeforeunload = async function() {

        const indexes = {};

        await currUser.update(state => {
            indexes.user = state;
            return state;
        });

        await page.update(state => {
            indexes.page = state;
            return state;
        });

        await gameTab.update(state => {
            indexes.tab = state;
            return state;
        });

        await gameBoard.update(state => {
            indexes.board = state;
            return state;
        });

        await gameHistory.update(state => {
            indexes.history = state;
            return state;
        });

        await gamePref.update(state => {
            indexes.pref = state;
            return state;
        });

        await gameChat.update(state => {
            indexes.chat = state;
            return state;
        });

        await userGames.update(state => {
            indexes.games = state;
            return state;
        });

        await sessionStorage.setItem('idx', JSON.stringify(indexes));
    };

    function invokeFunction(load) {
        return new Promise((resolve, reject) => {

            const url = "https://us-central1-checker-io.cloudfunctions.net/" + load.func;
            load = new URLSearchParams(load).toString();

            fetch(url, {
                method: 'post',
                body: load,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                'Access-Control-Allow-Origin' : '*'
            })
            .then(res => 
                res.json()
            )
            .then(json => {
                resolve(json);
            })
            .catch(err => 
                reject(err)
            );
        });
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/Components/gameList.svelte generated by Svelte v3.22.2 */

    const { console: console_1 } = globals;
    const file = "src/Components/gameList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (90:0) {:else}
    function create_else_block(ctx) {
    	let h50;
    	let t1;
    	let t2;
    	let h51;
    	let t4;
    	let each1_anchor;
    	let each_value_1 = /*$userGames*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*$userGames*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h50 = element("h5");
    			h50.textContent = "On-Going Games";
    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			h51 = element("h5");
    			h51.textContent = "Finished Games";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    			attr_dev(h50, "class", "svelte-4eh53h");
    			add_location(h50, file, 90, 4, 3106);
    			attr_dev(h51, "class", "svelte-4eh53h");
    			add_location(h51, file, 97, 4, 3362);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h50, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, h51, anchor);
    			insert_dev(target, t4, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resumeGame, $userGames*/ 3) {
    				each_value_1 = /*$userGames*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*reviewGame, $userGames*/ 5) {
    				each_value = /*$userGames*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h50);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h51);
    			if (detaching) detach_dev(t4);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(90:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:0) {#if $userGames.length == 0}
    function create_if_block(ctx) {
    	let h50;
    	let t1;
    	let h51;

    	const block = {
    		c: function create() {
    			h50 = element("h5");
    			h50.textContent = "There are no games to view";
    			t1 = space();
    			h51 = element("h5");
    			h51.textContent = "Create or Join a Game";
    			attr_dev(h50, "id", "empty");
    			attr_dev(h50, "class", "svelte-4eh53h");
    			add_location(h50, file, 87, 4, 3012);
    			attr_dev(h51, "class", "svelte-4eh53h");
    			add_location(h51, file, 88, 4, 3063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h50, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h51, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h50);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h51);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(87:0) {#if $userGames.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (93:8) {#if !game.finished}
    function create_if_block_2(ctx) {
    	let button;
    	let t0_value = /*game*/ ctx[8].priPlayer + "";
    	let t0;
    	let t1;
    	let t2_value = /*game*/ ctx[8].secPlayer + "";
    	let t2;
    	let t3;
    	let t4_value = /*game*/ ctx[8].date + "";
    	let t4;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*game*/ ctx[8], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" vs. ");
    			t2 = text(t2_value);
    			t3 = text(" - ");
    			t4 = text(t4_value);
    			attr_dev(button, "class", "btn btn-warning svelte-4eh53h");
    			add_location(button, file, 93, 12, 3202);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, t4);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$userGames*/ 1 && t0_value !== (t0_value = /*game*/ ctx[8].priPlayer + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$userGames*/ 1 && t2_value !== (t2_value = /*game*/ ctx[8].secPlayer + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$userGames*/ 1 && t4_value !== (t4_value = /*game*/ ctx[8].date + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(93:8) {#if !game.finished}",
    		ctx
    	});

    	return block;
    }

    // (92:4) {#each $userGames as game}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*game*/ ctx[8].finished && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*game*/ ctx[8].finished) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(92:4) {#each $userGames as game}",
    		ctx
    	});

    	return block;
    }

    // (100:8) {#if game.finished}
    function create_if_block_1(ctx) {
    	let button;
    	let t0_value = /*game*/ ctx[8].priPlayer + "";
    	let t0;
    	let t1;
    	let t2_value = /*game*/ ctx[8].secPlayer + "";
    	let t2;
    	let t3;
    	let t4_value = /*game*/ ctx[8].date + "";
    	let t4;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[7](/*game*/ ctx[8], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" vs. ");
    			t2 = text(t2_value);
    			t3 = text(" - ");
    			t4 = text(t4_value);
    			attr_dev(button, "class", "btn btn-light svelte-4eh53h");
    			add_location(button, file, 100, 12, 3457);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, t4);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$userGames*/ 1 && t0_value !== (t0_value = /*game*/ ctx[8].priPlayer + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$userGames*/ 1 && t2_value !== (t2_value = /*game*/ ctx[8].secPlayer + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$userGames*/ 1 && t4_value !== (t4_value = /*game*/ ctx[8].date + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(100:8) {#if game.finished}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#each $userGames as game}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*game*/ ctx[8].finished && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*game*/ ctx[8].finished) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(99:4) {#each $userGames as game}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$userGames*/ ctx[0].length == 0) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $currUser;
    	let $gameHistory;
    	let $gameBoard;
    	let $userGames;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(3, $currUser = $$value));
    	validate_store(gameHistory, "gameHistory");
    	component_subscribe($$self, gameHistory, $$value => $$invalidate(4, $gameHistory = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(5, $gameBoard = $$value));
    	validate_store(userGames, "userGames");
    	component_subscribe($$self, userGames, $$value => $$invalidate(0, $userGames = $$value));

    	function resumeGame(game) {
    		if (game.priGameHistory.length > 0 || game.secGameHistory.length > 0) {
    			let gameStates = game.priEmail == $currUser.email
    			? game.priGameHistory
    			: game.secGameHistory;

    			console.log(gameStates[gameStates.length - 1]);
    			gameBoard.set(new Board(gameStates[gameStates.length - 1], null));
    			$gameHistory.set(gameStates);
    		} else {
    			if (game.priEmail == $currUser.email) {
    				gameBoard.set(new Board(null, false));
    				$gameHistory.push($gameBoard.saveBoardState());
    			}

    			if (game.secEmail == $currUser.email) {
    				gameBoard.set(new Board(null, true));
    				$gameHistory.push($gameBoard.saveBoardState());
    			}
    		}

    		gameChat.set(game.chatHistory);

    		gamePref.update(state => {
    			state = {};
    			state.id = game.id;
    			state.time = game.time;
    			state.timer = game.time;
    			state.pri = game.priPlayer;
    			state.sec = game.secPlayer;
    			state.currPlayer = game.currPlayer;

    			state.numMoves = game.priEmail == $currUser.email
    			? game.priGameHistory.length
    			: game.secGameHistory.length;

    			state.rangeMoves = game.priEmail == $currUser.email
    			? game.priGameHistory.length
    			: game.secGameHistory.length;

    			state.paused = true;
    			state.finished = false;
    			state.side = game.priEmail == $currUser.email ? "red" : "black";
    			state.secondsPlayed = game.minutesPlayed * 60;
    			return state;
    		});

    		page.set(1);
    		gameTab.set(0);
    	}

    	function reviewGame(game) {
    		let gameStates = game.priEmail == $currUser.email
    		? game.priGameHistory
    		: game.secGameHistory;

    		gameBoard.set(new Board(gameStates[gameStates.length - 1], null));
    		$gameHistory.set(gameStates);
    		gameChat.set(game.chatHistory);

    		gamePref.update(state => {
    			state = {};
    			state.id = game.id;
    			state.time = game.time;
    			state.timer = game.time;
    			state.pri = game.priPlayer;
    			state.sec = game.secPlayer;
    			state.currPlayer = game.currPlayer;

    			state.numMoves = game.priEmail == $currUser.email
    			? game.priGameHistory.length
    			: game.secGameHistory.length;

    			state.rangeMoves = game.priEmail == $currUser.email
    			? game.priGameHistory.length
    			: game.secGameHistory.length;

    			state.paused = false;
    			state.finished = true;
    			state.side = game.priEmail == $currUser.email ? "red" : "black";
    			state.secondsPlayed = game.minutesPlayed * 60;
    			return state;
    		});

    		page.set(1);
    		gameTab.set(0);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<GameList> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameList", $$slots, []);
    	const click_handler = game => resumeGame(game);
    	const click_handler_1 = game => reviewGame(game);

    	$$self.$capture_state = () => ({
    		userGames,
    		gamePref,
    		page,
    		gameTab,
    		currUser,
    		gameBoard,
    		gameHistory,
    		gameChat,
    		Board,
    		resumeGame,
    		reviewGame,
    		$currUser,
    		$gameHistory,
    		$gameBoard,
    		$userGames
    	});

    	return [
    		$userGames,
    		resumeGame,
    		reviewGame,
    		$currUser,
    		$gameHistory,
    		$gameBoard,
    		click_handler,
    		click_handler_1
    	];
    }

    class GameList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameList",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/Components/settings.svelte generated by Svelte v3.22.2 */

    const { console: console_1$1 } = globals;
    const file$1 = "src/Components/settings.svelte";

    function create_fragment$1(ctx) {
    	let h3;
    	let t1;
    	let h50;
    	let t3;
    	let h6;
    	let t4;
    	let span;
    	let t5_value = /*$currUser*/ ctx[6].email + "";
    	let t5;
    	let t6;
    	let img;
    	let img_src_value;
    	let t7;
    	let div0;
    	let input0;
    	let t8;
    	let label;
    	let t9;
    	let t10;
    	let p;
    	let t12;
    	let div3;
    	let div2;
    	let div1;
    	let t14;
    	let input1;
    	let t15;
    	let input2;
    	let t16;
    	let button0;
    	let t18;
    	let h51;
    	let t20;
    	let div6;
    	let div5;
    	let div4;
    	let t22;
    	let input3;
    	let t23;
    	let div9;
    	let div8;
    	let div7;
    	let t25;
    	let input4;
    	let t26;
    	let button1;
    	let dispose;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Settings";
    			t1 = space();
    			h50 = element("h5");
    			h50.textContent = "Profile";
    			t3 = space();
    			h6 = element("h6");
    			t4 = text("Account ID: ");
    			span = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			img = element("img");
    			t7 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t8 = space();
    			label = element("label");
    			t9 = text(/*imageLabel*/ ctx[5]);
    			t10 = space();
    			p = element("p");
    			p.textContent = "Image size should be less than 1MB";
    			t12 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "Display Name:";
    			t14 = space();
    			input1 = element("input");
    			t15 = space();
    			input2 = element("input");
    			t16 = space();
    			button0 = element("button");
    			button0.textContent = "Update Profile";
    			t18 = space();
    			h51 = element("h5");
    			h51.textContent = "Reset Password";
    			t20 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div4.textContent = "Old Password:";
    			t22 = space();
    			input3 = element("input");
    			t23 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div7.textContent = "New Password:";
    			t25 = space();
    			input4 = element("input");
    			t26 = space();
    			button1 = element("button");
    			button1.textContent = "Reset";
    			attr_dev(h3, "class", "svelte-5d476");
    			add_location(h3, file$1, 90, 0, 2452);
    			add_location(h50, file$1, 92, 0, 2471);
    			add_location(span, file$1, 94, 43, 2532);
    			set_style(h6, "text-align", "center");
    			add_location(h6, file$1, 94, 0, 2489);
    			set_style(img, "float", "left");
    			attr_dev(img, "alt", "propic");
    			if (img.src !== (img_src_value = /*Picture*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-5d476");
    			add_location(img, file$1, 96, 0, 2569);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", "image/jpeg");
    			attr_dev(input0, "class", "custom-file-input");
    			attr_dev(input0, "id", "customFile");
    			add_location(input0, file$1, 99, 4, 2679);
    			attr_dev(label, "class", "custom-file-label");
    			attr_dev(label, "for", "customFile");
    			add_location(label, file$1, 100, 4, 2786);
    			attr_dev(div0, "id", "propic");
    			attr_dev(div0, "class", "custom-file input-group svelte-5d476");
    			add_location(div0, file$1, 98, 0, 2625);
    			set_style(p, "float", "right");
    			add_location(p, file$1, 103, 0, 2865);
    			attr_dev(div1, "class", "input-group-text");
    			add_location(div1, file$1, 107, 8, 3005);
    			attr_dev(div2, "class", "input-group-prepend");
    			add_location(div2, file$1, 106, 4, 2963);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "inlineFormInputGroup");
    			attr_dev(input1, "placeholder", /*Name*/ ctx[0]);
    			add_location(input1, file$1, 109, 4, 3070);
    			attr_dev(div3, "class", "input-group mb-2 svelte-5d476");
    			add_location(div3, file$1, 105, 0, 2928);
    			attr_dev(input2, "id", "authPass");
    			attr_dev(input2, "placeholder", "Account Password");
    			attr_dev(input2, "class", "svelte-5d476");
    			add_location(input2, file$1, 112, 0, 3186);
    			attr_dev(button0, "class", "btn btn-success svelte-5d476");
    			add_location(button0, file$1, 114, 0, 3269);
    			set_style(h51, "margin-top", "60px");
    			add_location(h51, file$1, 116, 0, 3353);
    			attr_dev(div4, "class", "input-group-text");
    			add_location(div4, file$1, 120, 8, 3480);
    			attr_dev(div5, "class", "input-group-prepend");
    			add_location(div5, file$1, 119, 4, 3438);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "inlineFormInputGroup");
    			attr_dev(input3, "placeholder", "Account Password");
    			add_location(input3, file$1, 122, 4, 3545);
    			attr_dev(div6, "class", "input-group mb-2 svelte-5d476");
    			add_location(div6, file$1, 118, 0, 3403);
    			attr_dev(div7, "class", "input-group-text");
    			add_location(div7, file$1, 127, 8, 3755);
    			attr_dev(div8, "class", "input-group-prepend");
    			add_location(div8, file$1, 126, 4, 3713);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "inlineFormInputGroup");
    			attr_dev(input4, "placeholder", "New Password");
    			add_location(input4, file$1, 129, 4, 3820);
    			attr_dev(div9, "class", "input-group mb-2 svelte-5d476");
    			add_location(div9, file$1, 125, 0, 3678);
    			attr_dev(button1, "class", "btn btn-success svelte-5d476");
    			add_location(button1, file$1, 132, 0, 3949);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h50, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t4);
    			append_dev(h6, span);
    			append_dev(span, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input0);
    			append_dev(div0, t8);
    			append_dev(div0, label);
    			append_dev(label, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div3, t14);
    			append_dev(div3, input1);
    			set_input_value(input1, /*Name*/ ctx[0]);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*authPassword*/ ctx[2]);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, h51, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div6, t22);
    			append_dev(div6, input3);
    			set_input_value(input3, /*oldPassword*/ ctx[3]);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div9, t25);
    			append_dev(div9, input4);
    			set_input_value(input4, /*newPassword*/ ctx[4]);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, button1, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "change", /*upload*/ ctx[7], false, false, false),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    				listen_dev(button0, "click", /*updateProfile*/ ctx[8], false, false, false),
    				listen_dev(input3, "input", /*input3_input_handler*/ ctx[13]),
    				listen_dev(input4, "input", /*input4_input_handler*/ ctx[14]),
    				listen_dev(button1, "click", /*resetPassword*/ ctx[9], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currUser*/ 64 && t5_value !== (t5_value = /*$currUser*/ ctx[6].email + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*Picture*/ 2 && img.src !== (img_src_value = /*Picture*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*imageLabel*/ 32) set_data_dev(t9, /*imageLabel*/ ctx[5]);

    			if (dirty & /*Name*/ 1) {
    				attr_dev(input1, "placeholder", /*Name*/ ctx[0]);
    			}

    			if (dirty & /*Name*/ 1 && input1.value !== /*Name*/ ctx[0]) {
    				set_input_value(input1, /*Name*/ ctx[0]);
    			}

    			if (dirty & /*authPassword*/ 4 && input2.value !== /*authPassword*/ ctx[2]) {
    				set_input_value(input2, /*authPassword*/ ctx[2]);
    			}

    			if (dirty & /*oldPassword*/ 8 && input3.value !== /*oldPassword*/ ctx[3]) {
    				set_input_value(input3, /*oldPassword*/ ctx[3]);
    			}

    			if (dirty & /*newPassword*/ 16 && input4.value !== /*newPassword*/ ctx[4]) {
    				set_input_value(input4, /*newPassword*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h50);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h6);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(h51);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $currUser;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(6, $currUser = $$value));
    	let Name = $currUser.name;
    	let Picture = $currUser.picture;
    	let authPassword;
    	let oldPassword, newPassword;
    	let imageLabel = "Choose Profile Photo";
    	let request;

    	function upload() {
    		if (e.target.files[0].size <= 1000000 && e.target.files[0].type == "image/jpeg") {
    			var reader = new FileReader();

    			reader.onload = function (e) {
    				$$invalidate(1, Picture = e.target.result);

    				currUser.update(state => {
    					state.picture = e.target.result;
    					return state;
    				});
    			};

    			reader.readAsDataURL(e.target.files[0]);
    			$$invalidate(5, imageLabel = e.target.files[0].name);
    		}
    	}

    	function updateProfile() {
    		if (Name != null && authPassword != null) {
    			request = {
    				func: "updateProfile",
    				name: Name,
    				picture: Picture.includes("unsplash") ? null : Picture,
    				password: authPassword,
    				email: $currUser.email
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg != null) {
    					console.log(response.msg);
    					$$invalidate(2, authPassword = "");

    					currUser.update(state => {
    						state.name = Name;
    						return state;
    					});
    				} else {
    					console.log(response.err);
    				}
    			}).catch(error => {
    				console.log(error);
    			});
    		}
    	}

    	function resetPassword() {
    		if (oldPassword != null && newPassword != null && oldPassword != newPassword) {
    			request = {
    				func: "resetPassword",
    				email: $currUser.email,
    				password: oldPassword,
    				newPass: newPassword
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg != null) {
    					console.log(response.msg);
    					($$invalidate(3, oldPassword = ""), $$invalidate(4, newPassword = ""));
    				} else {
    					console.log(response.err);
    				}
    			}).catch(error => {
    				console.log(error);
    			});
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Settings", $$slots, []);

    	function input1_input_handler() {
    		Name = this.value;
    		$$invalidate(0, Name);
    	}

    	function input2_input_handler() {
    		authPassword = this.value;
    		$$invalidate(2, authPassword);
    	}

    	function input3_input_handler() {
    		oldPassword = this.value;
    		$$invalidate(3, oldPassword);
    	}

    	function input4_input_handler() {
    		newPassword = this.value;
    		$$invalidate(4, newPassword);
    	}

    	$$self.$capture_state = () => ({
    		currUser,
    		invokeFunction,
    		Name,
    		Picture,
    		authPassword,
    		oldPassword,
    		newPassword,
    		imageLabel,
    		request,
    		upload,
    		updateProfile,
    		resetPassword,
    		$currUser
    	});

    	$$self.$inject_state = $$props => {
    		if ("Name" in $$props) $$invalidate(0, Name = $$props.Name);
    		if ("Picture" in $$props) $$invalidate(1, Picture = $$props.Picture);
    		if ("authPassword" in $$props) $$invalidate(2, authPassword = $$props.authPassword);
    		if ("oldPassword" in $$props) $$invalidate(3, oldPassword = $$props.oldPassword);
    		if ("newPassword" in $$props) $$invalidate(4, newPassword = $$props.newPassword);
    		if ("imageLabel" in $$props) $$invalidate(5, imageLabel = $$props.imageLabel);
    		if ("request" in $$props) request = $$props.request;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Name,
    		Picture,
    		authPassword,
    		oldPassword,
    		newPassword,
    		imageLabel,
    		$currUser,
    		upload,
    		updateProfile,
    		resetPassword,
    		request,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Components/gamePref.svelte generated by Svelte v3.22.2 */

    const { console: console_1$2 } = globals;
    const file$2 = "src/Components/gamePref.svelte";

    function create_fragment$2(ctx) {
    	let h5;
    	let t1;
    	let h6;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let input;
    	let t6;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Game Preferences";
    			t1 = space();
    			h6 = element("h6");
    			t2 = text("Time Per Turn: ");
    			t3 = text(/*Time*/ ctx[0]);
    			t4 = text(" seconds");
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			button = element("button");
    			button.textContent = "Create";
    			attr_dev(h5, "class", "svelte-ygik97");
    			add_location(h5, file$2, 64, 0, 1701);
    			attr_dev(h6, "class", "svelte-ygik97");
    			add_location(h6, file$2, 66, 0, 1728);
    			attr_dev(input, "class", "custom-range");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "15");
    			attr_dev(input, "max", "60");
    			attr_dev(input, "step", "1");
    			add_location(input, file$2, 67, 0, 1767);
    			attr_dev(button, "class", "btn btn-primary svelte-ygik97");
    			add_location(button, file$2, 69, 0, 1857);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t2);
    			append_dev(h6, t3);
    			append_dev(h6, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*Time*/ ctx[0]);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, button, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[6]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[6]),
    				listen_dev(button, "click", /*createGame*/ ctx[1], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Time*/ 1) set_data_dev(t3, /*Time*/ ctx[0]);

    			if (dirty & /*Time*/ 1) {
    				set_input_value(input, /*Time*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h6);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $gameHistory;
    	let $gameBoard;
    	let $currUser;
    	validate_store(gameHistory, "gameHistory");
    	component_subscribe($$self, gameHistory, $$value => $$invalidate(3, $gameHistory = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(4, $gameBoard = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(5, $currUser = $$value));
    	let Time = 15;
    	let request;

    	function createGame() {
    		gameBoard.set(new Board(null, false));
    		$gameHistory.push($gameBoard.saveBoardState());

    		gamePref.update(state => {
    			state = {};
    			state.time = Time;
    			state.timer = Time;
    			state.pri = $currUser.name;
    			state.sec = null;
    			state.currPlayer = null;
    			state.numMoves = 0;
    			state.rangeMoves = 0;
    			state.paused = true;
    			state.finished = false;
    			state.side = "red";
    			state.secondsPlayed = 0;
    			return state;
    		});

    		request = {
    			func: "createGame",
    			email: $currUser.email,
    			name: $currUser.name,
    			time: Time,
    			date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
    		};

    		console.log(request);

    		invokeFunction(request).then(response => {
    			console.log(response);

    			if (response.msg != null) {
    				console.log(response.msg);

    				gamePref.update(state => {
    					state.id = response.msg;
    					return state;
    				});

    				page.set(1);
    				gameTab.set(0);
    			} else {
    				console.log(response.err);
    			}
    		}).catch(error => {
    			console.log(error);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<GamePref> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GamePref", $$slots, []);

    	function input_change_input_handler() {
    		Time = to_number(this.value);
    		$$invalidate(0, Time);
    	}

    	$$self.$capture_state = () => ({
    		currUser,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		page,
    		gameTab,
    		invokeFunction,
    		Board,
    		Time,
    		request,
    		createGame,
    		$gameHistory,
    		$gameBoard,
    		$currUser
    	});

    	$$self.$inject_state = $$props => {
    		if ("Time" in $$props) $$invalidate(0, Time = $$props.Time);
    		if ("request" in $$props) request = $$props.request;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Time,
    		createGame,
    		request,
    		$gameHistory,
    		$gameBoard,
    		$currUser,
    		input_change_input_handler
    	];
    }

    class GamePref extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GamePref",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Components/gamePass.svelte generated by Svelte v3.22.2 */

    const { console: console_1$3 } = globals;
    const file$3 = "src/Components/gamePass.svelte";

    function create_fragment$3(ctx) {
    	let h5;
    	let t1;
    	let input;
    	let t2;
    	let button0;
    	let t4;
    	let hr;
    	let t5;
    	let button1;
    	let dispose;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Game Password";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "Join";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Find A Random Game";
    			attr_dev(h5, "class", "svelte-uoxtb0");
    			add_location(h5, file$3, 64, 0, 2122);
    			attr_dev(input, "placeholder", "Game Password");
    			attr_dev(input, "class", "svelte-uoxtb0");
    			add_location(input, file$3, 66, 0, 2148);
    			attr_dev(button0, "class", "btn btn-primary svelte-uoxtb0");
    			set_style(button0, "margin-bottom", "30px");
    			add_location(button0, file$3, 68, 0, 2216);
    			add_location(hr, file$3, 70, 0, 2315);
    			attr_dev(button1, "class", "btn btn-primary svelte-uoxtb0");
    			add_location(button1, file$3, 72, 0, 2324);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*gamePassword*/ ctx[0]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button1, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    				listen_dev(button0, "click", /*joinGame*/ ctx[1], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*gamePassword*/ 1 && input.value !== /*gamePassword*/ ctx[0]) {
    				set_input_value(input, /*gamePassword*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $currUser;
    	let $gameHistory;
    	let $gameBoard;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(3, $currUser = $$value));
    	validate_store(gameHistory, "gameHistory");
    	component_subscribe($$self, gameHistory, $$value => $$invalidate(4, $gameHistory = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(5, $gameBoard = $$value));
    	let gamePassword;
    	let request;

    	function joinGame() {
    		if (gamePassword != null) {
    			request = {
    				func: "joinGame",
    				gameID: gamePassword,
    				email: $currUser.email,
    				name: $currUser.name
    			};

    			invokeFunction(request).then(response => {
    				if (response.msg != null) {
    					console.log(response.msg);
    					let game = response.msg;

    					if (game.priEmail != $currUser.email) {
    						gameBoard.set(new Board(null, true));
    						$gameHistory.push($gameBoard.saveBoardState());

    						gamePref.update(state => {
    							state = {};
    							state.time = game.time;
    							state.timer = game.time;
    							state.id = gamePassword;
    							state.pri = game.priPlayer;
    							state.sec = game.secPlayer;
    							state.currPlayer = null;
    							state.numMoves = 0;
    							state.rangeMoves = 0;
    							state.paused = true;
    							state.finished = false;
    							state.side = "black";
    							state.secondsPlayed = 0;
    							return state;
    						});

    						page.set(1);
    						gameTab.set(0);
    					} else {
    						console.log("Same Player");
    					}
    				} else {
    					console.log(response.err);
    				}
    			}).catch(error => {
    				console.log(error);
    			});
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<GamePass> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GamePass", $$slots, []);

    	function input_input_handler() {
    		gamePassword = this.value;
    		$$invalidate(0, gamePassword);
    	}

    	$$self.$capture_state = () => ({
    		invokeFunction,
    		currSocket,
    		currUser,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		page,
    		gameTab,
    		Board,
    		gamePassword,
    		request,
    		joinGame,
    		$currUser,
    		$gameHistory,
    		$gameBoard
    	});

    	$$self.$inject_state = $$props => {
    		if ("gamePassword" in $$props) $$invalidate(0, gamePassword = $$props.gamePassword);
    		if ("request" in $$props) request = $$props.request;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gamePassword,
    		joinGame,
    		request,
    		$currUser,
    		$gameHistory,
    		$gameBoard,
    		input_input_handler
    	];
    }

    class GamePass extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GamePass",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Pages/dashBoard.svelte generated by Svelte v3.22.2 */

    const { console: console_1$4 } = globals;
    const file$4 = "src/Pages/dashBoard.svelte";

    // (96:0) {#if popUp}
    function create_if_block_4(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let div_transition;
    	let current;
    	let if_block0 = /*screenWidth*/ ctx[6] < 800 && create_if_block_7(ctx);
    	let if_block1 = /*gamePrefView*/ ctx[4] && create_if_block_6(ctx);
    	let if_block2 = /*gamePassView*/ ctx[5] && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "id", "popUp");
    			attr_dev(div, "class", "container-fluid svelte-9xhgok");
    			add_location(div, file$4, 96, 4, 2385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*screenWidth*/ ctx[6] < 800) if_block0.p(ctx, dirty);

    			if (/*gamePrefView*/ ctx[4]) {
    				if (if_block1) {
    					if (dirty & /*gamePrefView*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*gamePassView*/ ctx[5]) {
    				if (if_block2) {
    					if (dirty & /*gamePassView*/ 32) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -200, duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -200, duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(96:0) {#if popUp}",
    		ctx
    	});

    	return block;
    }

    // (98:8) {#if screenWidth < 800}
    function create_if_block_7(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Close";
    			attr_dev(button, "class", "btn btn-danger svelte-9xhgok");
    			add_location(button, file$4, 98, 12, 2513);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*closeNav*/ ctx[7], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(98:8) {#if screenWidth < 800}",
    		ctx
    	});

    	return block;
    }

    // (102:8) {#if gamePrefView}
    function create_if_block_6(ctx) {
    	let current;
    	const prefs = new GamePref({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(prefs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(prefs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prefs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prefs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(prefs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(102:8) {#if gamePrefView}",
    		ctx
    	});

    	return block;
    }

    // (106:8) {#if gamePassView}
    function create_if_block_5(ctx) {
    	let current;
    	const pass = new GamePass({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pass.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pass, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pass.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pass.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pass, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(106:8) {#if gamePassView}",
    		ctx
    	});

    	return block;
    }

    // (141:0) {#if viewRightSlide}
    function create_if_block$1(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let div_transition;
    	let current;
    	let if_block0 = /*screenWidth*/ ctx[6] < 800 && create_if_block_3(ctx);
    	let if_block1 = /*gamesView*/ ctx[1] && create_if_block_2$1(ctx);
    	let if_block2 = /*settingsView*/ ctx[2] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "id", "rightSlide");
    			attr_dev(div, "class", "container-fluid svelte-9xhgok");
    			add_location(div, file$4, 141, 4, 3399);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*screenWidth*/ ctx[6] < 800) if_block0.p(ctx, dirty);

    			if (/*gamesView*/ ctx[1]) {
    				if (if_block1) {
    					if (dirty & /*gamesView*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*settingsView*/ ctx[2]) {
    				if (if_block2) {
    					if (dirty & /*settingsView*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: 200, duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: 200, duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(141:0) {#if viewRightSlide}",
    		ctx
    	});

    	return block;
    }

    // (143:8) {#if screenWidth < 800}
    function create_if_block_3(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Back";
    			attr_dev(button, "class", "btn btn-danger svelte-9xhgok");
    			add_location(button, file$4, 143, 12, 3531);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*closeNav*/ ctx[7], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(143:8) {#if screenWidth < 800}",
    		ctx
    	});

    	return block;
    }

    // (147:8) {#if gamesView}
    function create_if_block_2$1(ctx) {
    	let current;
    	const list = new GameList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(list.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(list, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(list, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(147:8) {#if gamesView}",
    		ctx
    	});

    	return block;
    }

    // (151:8) {#if settingsView}
    function create_if_block_1$1(ctx) {
    	let current;
    	const settings = new Settings({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(settings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(settings, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(151:8) {#if settingsView}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t0;
    	let div;
    	let h1;
    	let t2;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let button2;
    	let t8;
    	let button3;
    	let t10;
    	let button4;
    	let t12;
    	let button5;
    	let t14;
    	let if_block1_anchor;
    	let current;
    	let dispose;
    	let if_block0 = /*popUp*/ ctx[3] && create_if_block_4(ctx);
    	let if_block1 = /*viewRightSlide*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Dashboard";
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "Create Game";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Join Game";
    			t6 = space();
    			button2 = element("button");
    			button2.textContent = "View Games";
    			t8 = space();
    			button3 = element("button");
    			button3.textContent = "Leadership Board \n    ";
    			t10 = text(">\n\n    ");
    			button4 = element("button");
    			button4.textContent = "Tutorial";
    			t12 = space();
    			button5 = element("button");
    			button5.textContent = "Settings";
    			t14 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(h1, "class", "svelte-9xhgok");
    			add_location(h1, file$4, 113, 4, 2787);
    			attr_dev(button0, "class", "circles btn btn-info svelte-9xhgok");
    			add_location(button0, file$4, 115, 4, 2811);
    			attr_dev(button1, "class", "circles btn btn-info svelte-9xhgok");
    			add_location(button1, file$4, 119, 4, 2913);
    			attr_dev(button2, "class", "circles btn btn-info svelte-9xhgok");
    			add_location(button2, file$4, 123, 4, 3013);
    			attr_dev(button3, "class", "circles btn btn-info svelte-9xhgok");
    			add_location(button3, file$4, 127, 4, 3112);
    			attr_dev(button4, "class", "circles btn btn-info svelte-9xhgok");
    			add_location(button4, file$4, 131, 4, 3196);
    			attr_dev(button5, "class", "circles btn btn-info svelte-9xhgok");
    			add_location(button5, file$4, 135, 4, 3271);
    			attr_dev(div, "id", "backpurple");
    			attr_dev(div, "class", "svelte-9xhgok");
    			add_location(div, file$4, 111, 0, 2738);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t2);
    			append_dev(div, button0);
    			append_dev(div, t4);
    			append_dev(div, button1);
    			append_dev(div, t6);
    			append_dev(div, button2);
    			append_dev(div, t8);
    			append_dev(div, button3);
    			append_dev(div, t10);
    			append_dev(div, button4);
    			append_dev(div, t12);
    			append_dev(div, button5);
    			insert_dev(target, t14, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*popGamePref*/ ctx[8], false, false, false),
    				listen_dev(button1, "click", /*popGamePass*/ ctx[9], false, false, false),
    				listen_dev(button2, "click", /*viewGames*/ ctx[10], false, false, false),
    				listen_dev(button5, "click", /*viewSettings*/ ctx[11], false, false, false),
    				listen_dev(div, "click", /*closeNav*/ ctx[7], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*popUp*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*popUp*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*viewRightSlide*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*viewRightSlide*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t14);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $currUser;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(14, $currUser = $$value));
    	let request;
    	let viewRightSlide = false, viewLeftSlide = false;
    	let gamesView = false, settingsView = false;
    	let popUp = false;
    	let gamePrefView = false, gamePassView = false;
    	let screenWidth = screen.width;

    	function closeNav() {
    		($$invalidate(0, viewRightSlide = false), viewLeftSlide = false);
    		($$invalidate(1, gamesView = false), $$invalidate(2, settingsView = false));
    		$$invalidate(3, popUp = false);
    		($$invalidate(4, gamePrefView = false), $$invalidate(5, gamePassView = false));
    	}

    	function popGamePref() {
    		closeNav();

    		setTimeout(
    			() => {
    				$$invalidate(3, popUp = true);
    			},
    			1
    		);

    		setTimeout(
    			() => {
    				$$invalidate(4, gamePrefView = true);
    			},
    			2
    		);
    	}

    	function popGamePass() {
    		closeNav();

    		setTimeout(
    			() => {
    				$$invalidate(3, popUp = true);
    			},
    			1
    		);

    		setTimeout(
    			() => {
    				$$invalidate(5, gamePassView = true);
    			},
    			2
    		);
    	}

    	function viewGames() {
    		closeNav();

    		setTimeout(
    			() => {
    				$$invalidate(0, viewRightSlide = true);
    			},
    			1
    		);

    		request = {
    			func: "retrieveUserGames",
    			email: $currUser.email
    		};

    		invokeFunction(request).then(response => {
    			console.log(response);

    			if (response.msg != null) {
    				let games = response.msg;

    				userGames.update(state => {
    					state = [];

    					for (let i = 0; i < games.length; i++) {
    						if (games[i].finished) state.push(games[i]); else state.unshift(games[i]);
    					}

    					return state;
    				});

    				setTimeout(
    					() => {
    						$$invalidate(1, gamesView = true);
    					},
    					1
    				);
    			} else {
    				console.log(response.err);
    			}
    		}).catch(error => {
    			console.log(error);
    		});
    	}

    	function viewSettings() {
    		closeNav();

    		setTimeout(
    			() => {
    				$$invalidate(0, viewRightSlide = true);
    			},
    			1
    		);

    		setTimeout(
    			() => {
    				$$invalidate(2, settingsView = true);
    			},
    			1
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<DashBoard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DashBoard", $$slots, []);

    	$$self.$capture_state = () => ({
    		currUser,
    		page,
    		userGames,
    		invokeFunction,
    		fly,
    		List: GameList,
    		Settings,
    		Prefs: GamePref,
    		Pass: GamePass,
    		request,
    		viewRightSlide,
    		viewLeftSlide,
    		gamesView,
    		settingsView,
    		popUp,
    		gamePrefView,
    		gamePassView,
    		screenWidth,
    		closeNav,
    		popGamePref,
    		popGamePass,
    		viewGames,
    		viewSettings,
    		$currUser
    	});

    	$$self.$inject_state = $$props => {
    		if ("request" in $$props) request = $$props.request;
    		if ("viewRightSlide" in $$props) $$invalidate(0, viewRightSlide = $$props.viewRightSlide);
    		if ("viewLeftSlide" in $$props) viewLeftSlide = $$props.viewLeftSlide;
    		if ("gamesView" in $$props) $$invalidate(1, gamesView = $$props.gamesView);
    		if ("settingsView" in $$props) $$invalidate(2, settingsView = $$props.settingsView);
    		if ("popUp" in $$props) $$invalidate(3, popUp = $$props.popUp);
    		if ("gamePrefView" in $$props) $$invalidate(4, gamePrefView = $$props.gamePrefView);
    		if ("gamePassView" in $$props) $$invalidate(5, gamePassView = $$props.gamePassView);
    		if ("screenWidth" in $$props) $$invalidate(6, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		viewRightSlide,
    		gamesView,
    		settingsView,
    		popUp,
    		gamePrefView,
    		gamePassView,
    		screenWidth,
    		closeNav,
    		popGamePref,
    		popGamePass,
    		viewGames,
    		viewSettings
    	];
    }

    class DashBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashBoard",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value)
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled)
                        task = null;
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* src/Components/typeIndicator.svelte generated by Svelte v3.22.2 */

    const file$5 = "src/Components/typeIndicator.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let g;
    	let circle0;
    	let circle1;
    	let circle2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "class", "dot svelte-16rctq0");
    			attr_dev(circle0, "cx", "3");
    			attr_dev(circle0, "cy", "3");
    			attr_dev(circle0, "r", "3");
    			add_location(circle0, file$5, 2, 2, 134);
    			attr_dev(circle1, "class", "dot svelte-16rctq0");
    			attr_dev(circle1, "cx", "12");
    			attr_dev(circle1, "cy", "3");
    			attr_dev(circle1, "r", "3");
    			add_location(circle1, file$5, 3, 2, 179);
    			attr_dev(circle2, "class", "dot svelte-16rctq0");
    			attr_dev(circle2, "cx", "21");
    			attr_dev(circle2, "cy", "3");
    			attr_dev(circle2, "r", "3");
    			add_location(circle2, file$5, 4, 2, 225);
    			add_location(g, file$5, 1, 1, 128);
    			attr_dev(svg, "id", "typing_bubble");
    			attr_dev(svg, "data-name", "typing bubble");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "6");
    			attr_dev(svg, "viewBox", "0 0 24 6");
    			add_location(svg, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, circle0);
    			append_dev(g, circle1);
    			append_dev(g, circle2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TypeIndicator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TypeIndicator", $$slots, []);
    	return [];
    }

    class TypeIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TypeIndicator",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Components/gameChat.svelte generated by Svelte v3.22.2 */
    const file$6 = "src/Components/gameChat.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (63:4) {:else}
    function create_else_block_1(ctx) {
    	let h4;
    	let t_value = /*$gamePref*/ ctx[3].pri + "";
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(t_value);
    			set_style(h4, "text-align", "center");
    			attr_dev(h4, "class", "svelte-12nht46");
    			add_location(h4, file$6, 63, 8, 1871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gamePref*/ 8 && t_value !== (t_value = /*$gamePref*/ ctx[3].pri + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(63:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (61:36) 
    function create_if_block_3$1(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Waiting for other player";
    			attr_dev(h4, "class", "blinking svelte-12nht46");
    			set_style(h4, "text-align", "center");
    			add_location(h4, file$6, 61, 8, 1772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(61:36) ",
    		ctx
    	});

    	return block;
    }

    // (59:1) {#if $gamePref.pri == $currUser.name && $gamePref.sec != null}
    function create_if_block_2$2(ctx) {
    	let h4;
    	let t_value = /*$gamePref*/ ctx[3].sec + "";
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(t_value);
    			set_style(h4, "text-align", "center");
    			attr_dev(h4, "class", "svelte-12nht46");
    			add_location(h4, file$6, 59, 8, 1674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gamePref*/ 8 && t_value !== (t_value = /*$gamePref*/ ctx[3].sec + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(59:1) {#if $gamePref.pri == $currUser.name && $gamePref.sec != null}",
    		ctx
    	});

    	return block;
    }

    // (73:12) {:else}
    function create_else_block$1(ctx) {
    	let article;
    	let span;
    	let t_value = /*mesage*/ ctx[16].msg + "";
    	let t;

    	const block = {
    		c: function create() {
    			article = element("article");
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "txtMsg svelte-12nht46");
    			add_location(span, file$6, 74, 20, 2282);
    			attr_dev(article, "class", "odaMsg svelte-12nht46");
    			add_location(article, file$6, 73, 16, 2236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameChat*/ 32 && t_value !== (t_value = /*mesage*/ ctx[16].msg + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(73:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:12) {#if mesage.name == $currUser.name}
    function create_if_block_1$2(ctx) {
    	let article;
    	let span;
    	let t_value = /*mesage*/ ctx[16].msg + "";
    	let t;

    	const block = {
    		c: function create() {
    			article = element("article");
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "txtMsg svelte-12nht46");
    			add_location(span, file$6, 70, 20, 2129);
    			attr_dev(article, "class", "myMsg svelte-12nht46");
    			add_location(article, file$6, 69, 16, 2084);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameChat*/ 32 && t_value !== (t_value = /*mesage*/ ctx[16].msg + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(69:12) {#if mesage.name == $currUser.name}",
    		ctx
    	});

    	return block;
    }

    // (68:8) {#each $gameChat as mesage}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*mesage*/ ctx[16].name == /*$currUser*/ ctx[4].name) return create_if_block_1$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(68:8) {#each $gameChat as mesage}",
    		ctx
    	});

    	return block;
    }

    // (80:12) {#if isTyping}
    function create_if_block$2(ctx) {
    	let span;
    	let current;
    	const indicator = new TypeIndicator({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(indicator.$$.fragment);
    			attr_dev(span, "class", "txtMsg svelte-12nht46");
    			attr_dev(span, "id", "isTypingSpan");
    			add_location(span, file$6, 80, 16, 2480);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(indicator, span, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(indicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(indicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(indicator);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(80:12) {#if isTyping}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let article;
    	let t2;
    	let input;
    	let current;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$gamePref*/ ctx[3].pri == /*$currUser*/ ctx[4].name && /*$gamePref*/ ctx[3].sec != null) return create_if_block_2$2;
    		if (/*$gamePref*/ ctx[3].sec == null) return create_if_block_3$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let each_value = /*$gameChat*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block1 = /*isTyping*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if_block0.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			article = element("article");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			input = element("input");
    			attr_dev(article, "class", "odaMsg svelte-12nht46");
    			attr_dev(article, "id", "isTyping");
    			add_location(article, file$6, 78, 8, 2396);
    			attr_dev(div0, "class", "scrollable svelte-12nht46");
    			add_location(div0, file$6, 66, 4, 1940);
    			attr_dev(input, "id", "user-msg");
    			attr_dev(input, "placeholder", "Type Here");
    			attr_dev(input, "class", "svelte-12nht46");
    			add_location(input, file$6, 85, 4, 2597);
    			attr_dev(div1, "id", "chat");
    			attr_dev(div1, "class", "container-fluid svelte-12nht46");
    			add_location(div1, file$6, 57, 0, 1560);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div1, anchor);
    			if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t1);
    			append_dev(div0, article);
    			if (if_block1) if_block1.m(article, null);
    			/*div0_binding*/ ctx[13](div0);
    			append_dev(div1, t2);
    			append_dev(div1, input);
    			set_input_value(input, /*message*/ ctx[1]);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[14]),
    				listen_dev(input, "keyup", /*inputStatus*/ ctx[7], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler*/ ctx[15], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			}

    			if (dirty & /*$gameChat, $currUser*/ 48) {
    				each_value = /*$gameChat*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*isTyping*/ ctx[2]) {
    				if (if_block1) {
    					if (dirty & /*isTyping*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(article, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*message*/ 2 && input.value !== /*message*/ ctx[1]) {
    				set_input_value(input, /*message*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			/*div0_binding*/ ctx[13](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $gamePref;
    	let $currUser;
    	let $gameChat;
    	let $currSocket;
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(3, $gamePref = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(4, $currUser = $$value));
    	validate_store(gameChat, "gameChat");
    	component_subscribe($$self, gameChat, $$value => $$invalidate(5, $gameChat = $$value));
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(10, $currSocket = $$value));
    	let div, autoscroll;
    	let message;
    	let isTyping = false;

    	if ($gamePref.pri == $currUser.name && $gameChat.length == 0 && $gamePref.sec == null && screen.width >= 800) $gameChat.push({
    		name: "System",
    		msg: "Please share Game Password '" + $gamePref.id + "' with other player"
    	});

    	let socket;
    	let room = $gamePref.id;
    	let currMsg = {};

    	beforeUpdate(() => {
    		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
    	});

    	afterUpdate(() => {
    		if (autoscroll) div.scrollTo(0, div.scrollHeight);
    	});

    	$currSocket.on("typing", room => {
    		$$invalidate(2, isTyping = true);
    	});

    	$currSocket.on("no-typing", room => {
    		$$invalidate(2, isTyping = false);
    	});

    	function sendMsg() {
    		if (message != null || message != "") {
    			currMsg.name = $currUser.name;
    			currMsg.msg = message;
    			currMsg.room = room;
    			$currSocket.emit("chat message", currMsg);

    			//msgs.push(currMsg);
    			$$invalidate(1, message = "");
    		}
    	}

    	function inputStatus() {
    		if (message == "") {
    			$currSocket.emit("no-typing", room);
    		} else {
    			$currSocket.emit("typing", room);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameChat> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameChat", $$slots, []);

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, div = $$value);
    		});
    	}

    	function input_input_handler() {
    		message = this.value;
    		$$invalidate(1, message);
    	}

    	const keydown_handler = event => event.which === 13 && sendMsg();

    	$$self.$capture_state = () => ({
    		currSocket,
    		currUser,
    		gamePref,
    		gameChat,
    		invokeFunction,
    		beforeUpdate,
    		afterUpdate,
    		Indicator: TypeIndicator,
    		div,
    		autoscroll,
    		message,
    		isTyping,
    		socket,
    		room,
    		currMsg,
    		sendMsg,
    		inputStatus,
    		$gamePref,
    		$currUser,
    		$gameChat,
    		$currSocket
    	});

    	$$self.$inject_state = $$props => {
    		if ("div" in $$props) $$invalidate(0, div = $$props.div);
    		if ("autoscroll" in $$props) autoscroll = $$props.autoscroll;
    		if ("message" in $$props) $$invalidate(1, message = $$props.message);
    		if ("isTyping" in $$props) $$invalidate(2, isTyping = $$props.isTyping);
    		if ("socket" in $$props) socket = $$props.socket;
    		if ("room" in $$props) room = $$props.room;
    		if ("currMsg" in $$props) currMsg = $$props.currMsg;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		div,
    		message,
    		isTyping,
    		$gamePref,
    		$currUser,
    		$gameChat,
    		sendMsg,
    		inputStatus,
    		autoscroll,
    		currMsg,
    		$currSocket,
    		socket,
    		room,
    		div0_binding,
    		input_input_handler,
    		keydown_handler
    	];
    }

    class GameChat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameChat",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Components/gameBoard.svelte generated by Svelte v3.22.2 */

    const { console: console_1$5 } = globals;

    const file$7 = "src/Components/gameBoard.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (372:0) {#if $gamePref.pri == $currUser.name && $gamePref.sec == null && screenWidth < 800}
    function create_if_block_10(ctx) {
    	let div;
    	let h5;
    	let t0;
    	let t1_value = /*$gamePref*/ ctx[2].id + "";
    	let t1;
    	let t2;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			t0 = text("Please share Game Password '");
    			t1 = text(t1_value);
    			t2 = text("' with other player");
    			set_style(h5, "text-align", "center");
    			set_style(h5, "margin-top", "50%");
    			add_location(h5, file$7, 373, 2, 10171);
    			attr_dev(div, "id", "popUp");
    			attr_dev(div, "class", "container-fluid svelte-12fbbq6");
    			add_location(div, file$7, 372, 1, 10085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    			append_dev(h5, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*$gamePref*/ 4) && t1_value !== (t1_value = /*$gamePref*/ ctx[2].id + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -200, duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -200, duration: 1000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(372:0) {#if $gamePref.pri == $currUser.name && $gamePref.sec == null && screenWidth < 800}",
    		ctx
    	});

    	return block;
    }

    // (382:40) 
    function create_if_block_9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "checker reda svelte-12fbbq6");
    			add_location(div, file$7, 382, 1, 10456);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(382:40) ",
    		ctx
    	});

    	return block;
    }

    // (380:0) {#if $gamePref.currPlayer == "black"}
    function create_if_block_8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "checker blacka svelte-12fbbq6");
    			add_location(div, file$7, 380, 1, 10379);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(380:0) {#if $gamePref.currPlayer == \\\"black\\\"}",
    		ctx
    	});

    	return block;
    }

    // (388:0) {#if screenWidth > 800}
    function create_if_block_7$1(ctx) {
    	let h2;
    	let t0;
    	let t1_value = /*$gamePref*/ ctx[2].timer + "";
    	let t1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text("Timer: ");
    			t1 = text(t1_value);
    			attr_dev(h2, "id", "time");
    			attr_dev(h2, "class", "svelte-12fbbq6");
    			add_location(h2, file$7, 388, 1, 10570);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$gamePref*/ 4 && t1_value !== (t1_value = /*$gamePref*/ ctx[2].timer + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(388:0) {#if screenWidth > 800}",
    		ctx
    	});

    	return block;
    }

    // (399:39) 
    function create_if_block_5$1(ctx) {
    	let if_block_anchor;
    	let if_block = (/*i*/ ctx[36] % 2 != 0 && /*j*/ ctx[39] % 2 == 0 || /*i*/ ctx[36] % 2 == 0 && /*j*/ ctx[39] % 2 != 0) && create_if_block_6$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[36] % 2 != 0 && /*j*/ ctx[39] % 2 == 0 || /*i*/ ctx[36] % 2 == 0 && /*j*/ ctx[39] % 2 != 0) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(399:39) ",
    		ctx
    	});

    	return block;
    }

    // (396:4) {#if !$gameBoard.isEmpty(i, j)}
    function create_if_block_4$1(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let circle;
    	let circle_class_value;
    	let circle_id_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_stroke_width_value;
    	let circle_fill_value;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[32](/*i*/ ctx[36], /*j*/ ctx[39], ...args);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			circle = svg_element("circle");
    			attr_dev(rect, "width", /*squareSize*/ ctx[1]);
    			attr_dev(rect, "height", /*squareSize*/ ctx[1]);
    			set_style(rect, "fill", "brown");
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[39] * /*squareSize*/ ctx[1]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[36] * /*squareSize*/ ctx[1]);
    			add_location(rect, file$7, 396, 5, 10744);
    			attr_dev(circle, "class", circle_class_value = "" + (null_to_empty(/*$gameBoard*/ ctx[4].getSide(/*i*/ ctx[36], /*j*/ ctx[39])) + " svelte-12fbbq6"));
    			attr_dev(circle, "id", circle_id_value = /*$gameBoard*/ ctx[4].getId(/*i*/ ctx[36], /*j*/ ctx[39]));
    			attr_dev(circle, "cx", circle_cx_value = /*$cirPos*/ ctx[5][/*$gameBoard*/ ctx[4].getId(/*i*/ ctx[36], /*j*/ ctx[39])].y);
    			attr_dev(circle, "cy", circle_cy_value = /*$cirPos*/ ctx[5][/*$gameBoard*/ ctx[4].getId(/*i*/ ctx[36], /*j*/ ctx[39])].x);
    			attr_dev(circle, "r", /*$size*/ ctx[6]);
    			attr_dev(circle, "stroke", "white");
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*$gameBoard*/ ctx[4].getPiece(/*i*/ ctx[36], /*j*/ ctx[39]).stack * 2);
    			attr_dev(circle, "fill", circle_fill_value = /*$gameBoard*/ ctx[4].getSide(/*i*/ ctx[36], /*j*/ ctx[39]));
    			add_location(circle, file$7, 397, 5, 10862);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, rect, anchor);
    			insert_dev(target, circle, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(circle, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*squareSize*/ 2) {
    				attr_dev(rect, "width", /*squareSize*/ ctx[1]);
    			}

    			if (dirty[0] & /*squareSize*/ 2) {
    				attr_dev(rect, "height", /*squareSize*/ ctx[1]);
    			}

    			if (dirty[0] & /*squareSize*/ 2 && rect_x_value !== (rect_x_value = /*j*/ ctx[39] * /*squareSize*/ ctx[1])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*squareSize*/ 2 && rect_y_value !== (rect_y_value = /*i*/ ctx[36] * /*squareSize*/ ctx[1])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty[0] & /*$gameBoard*/ 16 && circle_class_value !== (circle_class_value = "" + (null_to_empty(/*$gameBoard*/ ctx[4].getSide(/*i*/ ctx[36], /*j*/ ctx[39])) + " svelte-12fbbq6"))) {
    				attr_dev(circle, "class", circle_class_value);
    			}

    			if (dirty[0] & /*$gameBoard*/ 16 && circle_id_value !== (circle_id_value = /*$gameBoard*/ ctx[4].getId(/*i*/ ctx[36], /*j*/ ctx[39]))) {
    				attr_dev(circle, "id", circle_id_value);
    			}

    			if (dirty[0] & /*$cirPos, $gameBoard*/ 48 && circle_cx_value !== (circle_cx_value = /*$cirPos*/ ctx[5][/*$gameBoard*/ ctx[4].getId(/*i*/ ctx[36], /*j*/ ctx[39])].y)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty[0] & /*$cirPos, $gameBoard*/ 48 && circle_cy_value !== (circle_cy_value = /*$cirPos*/ ctx[5][/*$gameBoard*/ ctx[4].getId(/*i*/ ctx[36], /*j*/ ctx[39])].x)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty[0] & /*$size*/ 64) {
    				attr_dev(circle, "r", /*$size*/ ctx[6]);
    			}

    			if (dirty[0] & /*$gameBoard*/ 16 && circle_stroke_width_value !== (circle_stroke_width_value = /*$gameBoard*/ ctx[4].getPiece(/*i*/ ctx[36], /*j*/ ctx[39]).stack * 2)) {
    				attr_dev(circle, "stroke-width", circle_stroke_width_value);
    			}

    			if (dirty[0] & /*$gameBoard*/ 16 && circle_fill_value !== (circle_fill_value = /*$gameBoard*/ ctx[4].getSide(/*i*/ ctx[36], /*j*/ ctx[39]))) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			if (detaching) detach_dev(circle);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(396:4) {#if !$gameBoard.isEmpty(i, j)}",
    		ctx
    	});

    	return block;
    }

    // (400:20) {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}
    function create_if_block_6$1(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[33](/*i*/ ctx[36], /*j*/ ctx[39], ...args);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "width", /*squareSize*/ ctx[1]);
    			attr_dev(rect, "height", /*squareSize*/ ctx[1]);
    			set_style(rect, "fill", "brown");
    			attr_dev(rect, "x", rect_x_value = /*j*/ ctx[39] * /*squareSize*/ ctx[1]);
    			attr_dev(rect, "y", rect_y_value = /*i*/ ctx[36] * /*squareSize*/ ctx[1]);
    			add_location(rect, file$7, 400, 24, 11323);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, rect, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(rect, "click", click_handler_1, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*squareSize*/ 2) {
    				attr_dev(rect, "width", /*squareSize*/ ctx[1]);
    			}

    			if (dirty[0] & /*squareSize*/ 2) {
    				attr_dev(rect, "height", /*squareSize*/ ctx[1]);
    			}

    			if (dirty[0] & /*squareSize*/ 2 && rect_x_value !== (rect_x_value = /*j*/ ctx[39] * /*squareSize*/ ctx[1])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*squareSize*/ 2 && rect_y_value !== (rect_y_value = /*i*/ ctx[36] * /*squareSize*/ ctx[1])) {
    				attr_dev(rect, "y", rect_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(400:20) {#if (i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)}",
    		ctx
    	});

    	return block;
    }

    // (395:3) {#each squares as j}
    function create_each_block_1$1(ctx) {
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*$gameBoard*/ 16) show_if = !!!/*$gameBoard*/ ctx[4].isEmpty(/*i*/ ctx[36], /*j*/ ctx[39]);
    		if (show_if) return create_if_block_4$1;
    		if (show_if_1 == null || dirty[0] & /*$gameBoard*/ 16) show_if_1 = !!/*$gameBoard*/ ctx[4].isEmpty(/*i*/ ctx[36], /*j*/ ctx[39]);
    		if (show_if_1) return create_if_block_5$1;
    	}

    	let current_block_type = select_block_type_1(ctx, [-1]);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(395:3) {#each squares as j}",
    		ctx
    	});

    	return block;
    }

    // (394:2) {#each squares as i}
    function create_each_block$2(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*squares*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$gameBoard, squares, $cirPos, $size, setCurrPos, squareSize, setNextPos*/ 3698) {
    				each_value_1 = /*squares*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(394:2) {#each squares as i}",
    		ctx
    	});

    	return block;
    }

    // (410:0) {#if screenWidth <= 800}
    function create_if_block_3$2(ctx) {
    	let h1;
    	let t0;
    	let t1_value = /*$gamePref*/ ctx[2].timer + "";
    	let t1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Timer: ");
    			t1 = text(t1_value);
    			attr_dev(h1, "id", "time");
    			attr_dev(h1, "class", "svelte-12fbbq6");
    			add_location(h1, file$7, 410, 1, 11606);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$gamePref*/ 4 && t1_value !== (t1_value = /*$gamePref*/ ctx[2].timer + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(410:0) {#if screenWidth <= 800}",
    		ctx
    	});

    	return block;
    }

    // (414:0) {#if $gamePref.finished}
    function create_if_block_2$3(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1_value = /*$gamePref*/ ctx[2].rangeMoves + "";
    	let t1;
    	let t2;
    	let input;
    	let input_disabled_value;
    	let input_max_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text("Game State at Move: ");
    			t1 = text(t1_value);
    			t2 = space();
    			input = element("input");
    			attr_dev(h2, "id", "rangeBar");
    			attr_dev(h2, "class", "svelte-12fbbq6");
    			add_location(h2, file$7, 415, 2, 11702);
    			attr_dev(input, "class", "custom-range svelte-12fbbq6");
    			input.disabled = input_disabled_value = !/*$gamePref*/ ctx[2].paused;
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", input_max_value = /*$gamePref*/ ctx[2].numMoves);
    			attr_dev(input, "step", "1");
    			add_location(input, file$7, 416, 2, 11770);
    			attr_dev(div, "id", "state");
    			attr_dev(div, "class", "svelte-12fbbq6");
    			add_location(div, file$7, 414, 1, 11683);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(div, t2);
    			append_dev(div, input);
    			set_input_value(input, /*$gamePref*/ ctx[2].rangeMoves);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "change", /*viewBoardHistory*/ ctx[12], false, false, false),
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[34]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[34])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$gamePref*/ 4 && t1_value !== (t1_value = /*$gamePref*/ ctx[2].rangeMoves + "")) set_data_dev(t1, t1_value);

    			if (dirty[0] & /*$gamePref*/ 4 && input_disabled_value !== (input_disabled_value = !/*$gamePref*/ ctx[2].paused)) {
    				prop_dev(input, "disabled", input_disabled_value);
    			}

    			if (dirty[0] & /*$gamePref*/ 4 && input_max_value !== (input_max_value = /*$gamePref*/ ctx[2].numMoves)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*$gamePref*/ 4) {
    				set_input_value(input, /*$gamePref*/ ctx[2].rangeMoves);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(414:0) {#if $gamePref.finished}",
    		ctx
    	});

    	return block;
    }

    // (421:0) {#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer}
    function create_if_block_1$3(ctx) {
    	let button;
    	let t1;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start Game";
    			t1 = text("\\");
    			attr_dev(button, "class", "btn btn-success pause svelte-12fbbq6");
    			add_location(button, file$7, 421, 4, 12037);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*startGame*/ ctx[14], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(421:0) {#if $gamePref.paused && $gamePref.side == $gamePref.currPlayer}",
    		ctx
    	});

    	return block;
    }

    // (425:0) {#if $gamePref.side == $gamePref.currPlayer}
    function create_if_block$3(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Switch Turn";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Save Game";
    			attr_dev(button0, "class", "btn btn-info switch svelte-12fbbq6");
    			add_location(button0, file$7, 425, 1, 12172);
    			attr_dev(button1, "class", "btn btn-primary save svelte-12fbbq6");
    			add_location(button1, file$7, 427, 1, 12258);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*switchPlayer*/ ctx[13], false, false, false),
    				listen_dev(button1, "click", /*click_handler_2*/ ctx[35], false, false, false)
    			];
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(425:0) {#if $gamePref.side == $gamePref.currPlayer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let t0;
    	let h20;
    	let t2;
    	let t3;
    	let h21;
    	let t4;
    	let t5_value = /*$gamePref*/ ctx[2].numMoves + "";
    	let t5;
    	let t6;
    	let t7;
    	let div;
    	let svg1;
    	let use;
    	let svg0;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let if_block6_anchor;
    	let current;
    	let if_block0 = /*$gamePref*/ ctx[2].pri == /*$currUser*/ ctx[3].name && /*$gamePref*/ ctx[2].sec == null && /*screenWidth*/ ctx[7] < 800 && create_if_block_10(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*$gamePref*/ ctx[2].currPlayer == "black") return create_if_block_8;
    		if (/*$gamePref*/ ctx[2].currPlayer == "red") return create_if_block_9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	let if_block2 = /*screenWidth*/ ctx[7] > 800 && create_if_block_7$1(ctx);
    	let each_value = /*squares*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let if_block3 = /*screenWidth*/ ctx[7] <= 800 && create_if_block_3$2(ctx);
    	let if_block4 = /*$gamePref*/ ctx[2].finished && create_if_block_2$3(ctx);
    	let if_block5 = /*$gamePref*/ ctx[2].paused && /*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer && create_if_block_1$3(ctx);
    	let if_block6 = /*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = "Current Player:";
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			h21 = element("h2");
    			t4 = text("Moves: ");
    			t5 = text(t5_value);
    			t6 = space();
    			if (if_block2) if_block2.c();
    			t7 = space();
    			div = element("div");
    			svg1 = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			use = svg_element("use");
    			svg0 = svg_element("svg");
    			t8 = space();
    			if (if_block3) if_block3.c();
    			t9 = space();
    			if (if_block4) if_block4.c();
    			t10 = space();
    			if (if_block5) if_block5.c();
    			t11 = space();
    			if (if_block6) if_block6.c();
    			if_block6_anchor = empty();
    			attr_dev(h20, "id", "player");
    			attr_dev(h20, "class", "svelte-12fbbq6");
    			add_location(h20, file$7, 377, 0, 10302);
    			attr_dev(h21, "id", "moves");
    			attr_dev(h21, "class", "svelte-12fbbq6");
    			add_location(h21, file$7, 385, 0, 10496);
    			attr_dev(use, "id", "use");
    			xlink_attr(use, "xlink:href", "#24");
    			add_location(use, file$7, 405, 2, 11531);
    			add_location(svg0, file$7, 406, 1, 11566);
    			attr_dev(svg1, "id", "hover");
    			attr_dev(svg1, "class", "svelte-12fbbq6");
    			add_location(svg1, file$7, 392, 1, 10639);
    			attr_dev(div, "id", "board");
    			attr_dev(div, "class", "svelte-12fbbq6");
    			add_location(div, file$7, 391, 0, 10621);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h21, anchor);
    			append_dev(h21, t4);
    			append_dev(h21, t5);
    			insert_dev(target, t6, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg1, null);
    			}

    			append_dev(svg1, use);
    			append_dev(svg1, svg0);
    			insert_dev(target, t8, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t9, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t10, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t11, anchor);
    			if (if_block6) if_block6.m(target, anchor);
    			insert_dev(target, if_block6_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$gamePref*/ ctx[2].pri == /*$currUser*/ ctx[3].name && /*$gamePref*/ ctx[2].sec == null && /*screenWidth*/ ctx[7] < 800) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*$gamePref, $currUser*/ 12) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			}

    			if ((!current || dirty[0] & /*$gamePref*/ 4) && t5_value !== (t5_value = /*$gamePref*/ ctx[2].numMoves + "")) set_data_dev(t5, t5_value);
    			if (/*screenWidth*/ ctx[7] > 800) if_block2.p(ctx, dirty);

    			if (dirty[0] & /*squares, $gameBoard, $cirPos, $size, setCurrPos, squareSize, setNextPos*/ 3698) {
    				each_value = /*squares*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg1, use);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*screenWidth*/ ctx[7] <= 800) if_block3.p(ctx, dirty);

    			if (/*$gamePref*/ ctx[2].finished) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$3(ctx);
    					if_block4.c();
    					if_block4.m(t10.parentNode, t10);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*$gamePref*/ ctx[2].paused && /*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1$3(ctx);
    					if_block5.c();
    					if_block5.m(t11.parentNode, t11);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*$gamePref*/ ctx[2].side == /*$gamePref*/ ctx[2].currPlayer) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block$3(ctx);
    					if_block6.c();
    					if_block6.m(if_block6_anchor.parentNode, if_block6_anchor);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t2);

    			if (if_block1) {
    				if_block1.d(detaching);
    			}

    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t6);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t8);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t9);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t10);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(t11);
    			if (if_block6) if_block6.d(detaching);
    			if (detaching) detach_dev(if_block6_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $gamePref;
    	let $currUser;
    	let $currSocket;
    	let $gameBoard;
    	let $gameHistory;
    	let $gameChat;
    	let $cirPos;

    	let $size,
    		$$unsubscribe_size = noop,
    		$$subscribe_size = () => ($$unsubscribe_size(), $$unsubscribe_size = subscribe(size, $$value => $$invalidate(6, $size = $$value)), size);

    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(2, $gamePref = $$value));
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(3, $currUser = $$value));
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(24, $currSocket = $$value));
    	validate_store(gameBoard, "gameBoard");
    	component_subscribe($$self, gameBoard, $$value => $$invalidate(4, $gameBoard = $$value));
    	validate_store(gameHistory, "gameHistory");
    	component_subscribe($$self, gameHistory, $$value => $$invalidate(25, $gameHistory = $$value));
    	validate_store(gameChat, "gameChat");
    	component_subscribe($$self, gameChat, $$value => $$invalidate(26, $gameChat = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_size());

    	if ($gamePref.pri == $currUser.name && $gamePref.currPlayer == null) {
    		gamePref.update(state => {
    			state.currPlayer = Math.floor(Math.random() * 2) == 0 ? "red" : "black";
    			return state;
    		});
    	}

    	let currPos = null, nextPos = null;
    	let clockTime = $gamePref.time, lockedPiece = false;
    	let screenWidth = screen.width, remWidth;
    	let size;
    	validate_store(size, "size");
    	$$subscribe_size();
    	const cirPos = spring([]);
    	validate_store(cirPos, "cirPos");
    	component_subscribe($$self, cirPos, value => $$invalidate(5, $cirPos = value));
    	let squares = [0, 1, 2, 3, 4, 5, 6, 7];
    	let squareSize, boardHeight, factor, btnWidth;
    	$currSocket.emit("set-username", $currUser.name);
    	$currSocket.emit("join-room", $gamePref.id, $currUser.name);

    	if (screen.width <= 800) {
    		factor = 800 / (screen.width - 12.5);
    		squareSize = Math.floor((screen.width - 10) / 8);
    		if (screen.width >= 500) $$subscribe_size(size = spring(25)); else $$subscribe_size(size = spring(12.5));
    		boardHeight = squareSize * 8;
    		remWidth = screen.width;
    	} else {
    		if (screen.height >= 800) {
    			factor = 1;
    			$$subscribe_size(size = spring(30));
    			squareSize = 100;
    		} else {
    			squareSize = 10 * Math.floor(screen.height / 100);
    			factor = 1000 / (squareSize * 10);
    			$$subscribe_size(size = spring(25));
    		}

    		boardHeight = squareSize * 8;
    		remWidth = 0.8 * (screen.width - 800);
    		btnWidth = 0.2 * (screen.width - 800) - 40;
    	}

    	$currSocket.on("piece-move", async data => {
    		console.log(data);

    		if (data.remove != null) {
    			let piece = await $gameBoard.getPieceFromId(data.id);
    			await $gameBoard.removePiece(piece);
    		}

    		let piece = await $gameBoard.getPieceFromId(data.id);
    		await $gameBoard.otherPlayerMove(piece, data.xDiff, data.yDiff);
    		await gameBoard.set($gameBoard);
    		$gameHistory.push($gameBoard.saveBoardState());
    		await setCirclePositions();

    		await gamePref.update(state => {
    			state.numMoves = data.num;
    			state.rangeMoves = data.range;
    			return state;
    		});
    	});

    	document.documentElement.style.setProperty("--chat-width", remWidth + "px");
    	document.documentElement.style.setProperty("--board-height", boardHeight + "px");
    	document.documentElement.style.setProperty("--btn-width", btnWidth + "px");
    	setCirclePositions();
    	let timeInterval = setInterval(countDown, 1000);

    	function countDown() {
    		if (currPos != null) highlightCircle(currPos);

    		if ($gamePref.rangeMoves == $gamePref.numMoves && $gamePref.paused == false) {
    			//console.log($gamePref.timer);
    			if ($gamePref.timer > 0) {
    				gamePref.update(state => {
    					state.timer -= 1;
    					state.secondsPlayed += 1;
    					return state;
    				});
    			} else {
    				clearInterval(timeInterval);

    				gamePref.update(state => {
    					state.currPlayer = state.currPlayer == "red" ? "black" : "red";
    					state.timer = state.time;
    					state.secondsPlayed += 1;
    					return state;
    				});

    				(currPos = null, nextPos = null);
    				lockedPiece = false;
    				timeInterval = setInterval(countDown, 1000);
    			}
    		}
    	}

    	function updateCirclePositions(nextPos) {
    		let i = nextPos.xPos, j = nextPos.yPos;
    		let id = $gameBoard.getId(i, j);

    		cirPos.update(state => {
    			state[id].x = (i + i + 1) * (50 / factor);
    			state[id].y = (j + j + 1) * (50 / factor);
    			return state;
    		});
    	}

    	function setCirclePositions() {
    		for (let i = 0; i < 8; i++) {
    			for (let j = 0; j < 8; j++) {
    				if (!$gameBoard.isEmpty(i, j)) {
    					let id = $gameBoard.getId(i, j);

    					cirPos.update(state => {
    						state[id] = {};
    						state[id].x = (i + i + 1) * (50 / factor);
    						state[id].y = (j + j + 1) * (50 / factor);

    						/* if($gamePref.pri == $currUser.name)
        state[id].s = $gameBoard.getSide(i, j) == "black" ? 0 : 1;
    else 
        state[id].s = $gameBoard.getSide(i, j) == "red" ? 0 : 1; */
    						return state;
    					});
    				}
    			}
    		}
    	}

    	function setCurrPos(i, j, evt) {
    		console.log(i + ", " + j);

    		if ($gamePref.currPlayer == $gamePref.side && lockedPiece == false && $gamePref.rangeMoves == $gamePref.numMoves && $gamePref.paused == false && $gamePref.sec != null) {
    			let litCircle = document.getElementById($gameBoard.getId(i, j));
    			let allCircles, index;

    			if ($gameBoard.getSide(i, j) == "black" && $currUser.name == $gamePref.sec) {
    				allCircles = document.getElementsByClassName("black");
    				for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:black");
    				litCircle.setAttribute("style", "fill:grey");
    			}

    			if ($gameBoard.getSide(i, j) == "red" && $currUser.name == $gamePref.pri) {
    				allCircles = document.getElementsByClassName("red");
    				for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:red");
    				litCircle.setAttribute("style", "fill:pink");
    			}

    			let newtarget = evt.target || event.target;
    			let topmost = document.getElementById("use");
    			topmost.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + newtarget.id);
    			currPos = $gameBoard.getPiece(i, j);
    		}
    	} //let pos = currPos.getPosition();
    	//console.log(pos.xPos + ", " + pos.yPos);

    	function setNextPos(i, j) {
    		console.log(i + ", " + j);

    		if ($gameBoard.isEmpty(i, j) && currPos != null && $gamePref.rangeMoves == $gamePref.numMoves) {
    			nextPos = new Position(i, j, "E");
    			let res = $gameBoard.doMove(currPos, nextPos);
    			console.log(res.move);
    			gameBoard.set($gameBoard);
    			console.log($gameBoard);

    			if (res.move) {
    				gamePref.update(state => {
    					state.numMoves += 1;
    					state.rangeMoves += 1;
    					return state;
    				});

    				lockedPiece = true;

    				let pieceInfo = {
    					id: $gameBoard.getId(i, j),
    					xDiff: currPos.getPosition().xPos - nextPos.xPos,
    					yDiff: currPos.getPosition().yPos - nextPos.yPos,
    					remove: res.id,
    					num: $gamePref.numMoves,
    					range: $gamePref.rangeMoves,
    					room: $gamePref.id
    				};

    				$currSocket.emit("piece-move", pieceInfo);
    				updateCirclePositions(nextPos);
    				$gameHistory.push($gameBoard.saveBoardState());
    				currPos = $gameBoard.getPiece(nextPos.xPos, nextPos.yPos);
    			}
    		}
    	}

    	function viewBoardHistory() {
    		gameBoard.set(new Board($gameHistory[$gamePref.rangeMoves], null));
    		setCirclePositions();
    	}

    	function highlightCircle(currPos) {
    		let i = currPos.getPosition().xPos, j = currPos.getPosition().yPos;
    		let litCircle = document.getElementById($gameBoard.getId(i, j));
    		if ($gameBoard.getSide(i, j) == "black") litCircle.setAttribute("style", "fill:grey");
    		if ($gameBoard.getSide(i, j) == "red") litCircle.setAttribute("style", "fill:pink");
    	}

    	function switchPlayer() {
    		if ($gamePref.side == $gamePref.currPlayer) {
    			clearInterval(timeInterval);
    			let allCircles, index;

    			if ($gamePref.currPlayer == "black") {
    				allCircles = document.getElementsByClassName("black");
    				for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:black");
    			}

    			if ($gamePref.currPlayer == "red") {
    				allCircles = document.getElementsByClassName("red");
    				for (index = 0; index < allCircles.length; ++index) allCircles[index].setAttribute("style", "fill:red");
    			}

    			gamePref.update(state => {
    				state.currPlayer = state.currPlayer == "red" ? "black" : "red";
    				state.timer = clockTime;
    				return state;
    			});

    			$currSocket.emit("current-player", {
    				player: $gamePref.currPlayer,
    				room: $gamePref.id
    			});

    			(currPos = null, nextPos = null);
    			lockedPiece = false;
    			timeInterval = setInterval(countDown, 1000);
    		}
    	}

    	function startGame() {
    		if ($gamePref.side == $gamePref.currPlayer) {
    			gamePref.update(state => {
    				state.paused = !state.paused;
    				return state;
    			});

    			$currSocket.emit("paused", {
    				paused: $gamePref.paused,
    				room: $gamePref.id
    			});
    		}
    	}

    	setInterval(
    		function () {
    			if ($gamePref.secondsPlayed > $gamePref.timer) saveGame(true);
    		},
    		300000
    	);

    	function saveGame(auto) {
    		if ($gamePref.side == $gamePref.currPlayer) {
    			clearInterval(timeInterval);

    			let request = {
    				func: "saveGame",
    				gameID: $gamePref.id,
    				gameHistory: $gameHistory,
    				chatHistory: $gameChat,
    				pri: $gamePref.pri == $currUser.name ? true : false,
    				sec: $gamePref.sec == $currUser.name ? true : false,
    				minutes: Math.floor($gamePref.secondsPlayed / 60),
    				currPlayer: $gamePref.currPlayer
    			};

    			invokeFunction(request).then(response => {
    				console.log(response);

    				if (response.msg != null || response.msg == "SUCCESS") {
    					if (auto == false) page.set(0);
    					if (auto) timeInterval = setInterval(countDown, 1000);
    				} else {
    					console.log(response.err);
    				}
    			}).catch(error => {
    				console.log(error);
    			});
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<GameBoard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameBoard", $$slots, []);
    	const click_handler = (i, j) => setCurrPos(i, j, event);
    	const click_handler_1 = (i, j) => setNextPos(i, j);

    	function input_change_input_handler() {
    		$gamePref.rangeMoves = to_number(this.value);
    		gamePref.set($gamePref);
    	}

    	const click_handler_2 = () => saveGame(false);

    	$$self.$capture_state = () => ({
    		Position,
    		Board,
    		spring,
    		writable,
    		invokeFunction,
    		fly,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		currSocket,
    		currUser,
    		gameChat,
    		page,
    		currPos,
    		nextPos,
    		clockTime,
    		lockedPiece,
    		screenWidth,
    		remWidth,
    		size,
    		cirPos,
    		squares,
    		squareSize,
    		boardHeight,
    		factor,
    		btnWidth,
    		timeInterval,
    		countDown,
    		updateCirclePositions,
    		setCirclePositions,
    		setCurrPos,
    		setNextPos,
    		viewBoardHistory,
    		highlightCircle,
    		switchPlayer,
    		startGame,
    		saveGame,
    		$gamePref,
    		$currUser,
    		$currSocket,
    		$gameBoard,
    		$gameHistory,
    		$gameChat,
    		$cirPos,
    		$size
    	});

    	$$self.$inject_state = $$props => {
    		if ("currPos" in $$props) currPos = $$props.currPos;
    		if ("nextPos" in $$props) nextPos = $$props.nextPos;
    		if ("clockTime" in $$props) clockTime = $$props.clockTime;
    		if ("lockedPiece" in $$props) lockedPiece = $$props.lockedPiece;
    		if ("screenWidth" in $$props) $$invalidate(7, screenWidth = $$props.screenWidth);
    		if ("remWidth" in $$props) remWidth = $$props.remWidth;
    		if ("size" in $$props) $$subscribe_size($$invalidate(0, size = $$props.size));
    		if ("squares" in $$props) $$invalidate(9, squares = $$props.squares);
    		if ("squareSize" in $$props) $$invalidate(1, squareSize = $$props.squareSize);
    		if ("boardHeight" in $$props) boardHeight = $$props.boardHeight;
    		if ("factor" in $$props) factor = $$props.factor;
    		if ("btnWidth" in $$props) btnWidth = $$props.btnWidth;
    		if ("timeInterval" in $$props) timeInterval = $$props.timeInterval;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		squareSize,
    		$gamePref,
    		$currUser,
    		$gameBoard,
    		$cirPos,
    		$size,
    		screenWidth,
    		cirPos,
    		squares,
    		setCurrPos,
    		setNextPos,
    		viewBoardHistory,
    		switchPlayer,
    		startGame,
    		saveGame,
    		currPos,
    		nextPos,
    		lockedPiece,
    		remWidth,
    		boardHeight,
    		factor,
    		btnWidth,
    		timeInterval,
    		$currSocket,
    		$gameHistory,
    		$gameChat,
    		clockTime,
    		countDown,
    		updateCirclePositions,
    		setCirclePositions,
    		highlightCircle,
    		click_handler,
    		click_handler_1,
    		input_change_input_handler,
    		click_handler_2
    	];
    }

    class GameBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameBoard",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Components/navBar.svelte generated by Svelte v3.22.2 */
    const file$8 = "src/Components/navBar.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let table;
    	let tr;
    	let td0;
    	let i0;
    	let t0;
    	let span0;
    	let t2;
    	let td1;
    	let i1;
    	let t3;
    	let span1;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			i0 = element("i");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "Game";
    			t2 = space();
    			td1 = element("td");
    			i1 = element("i");
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "Chat";
    			attr_dev(i0, "class", "fa fa-qrcode svelte-nu81iu");
    			add_location(i0, file$8, 13, 16, 334);
    			attr_dev(span0, "class", "svelte-nu81iu");
    			add_location(span0, file$8, 14, 16, 379);
    			attr_dev(td0, "class", "tabIndex");
    			attr_dev(td0, "align", "center");
    			add_location(td0, file$8, 12, 12, 248);
    			attr_dev(i1, "class", "fa fa-comments svelte-nu81iu");
    			add_location(i1, file$8, 17, 16, 513);
    			attr_dev(span1, "class", "svelte-nu81iu");
    			add_location(span1, file$8, 18, 16, 560);
    			attr_dev(td1, "class", "tabIndex");
    			attr_dev(td1, "align", "center");
    			add_location(td1, file$8, 16, 12, 427);
    			attr_dev(tr, "height", "50");
    			add_location(tr, file$8, 11, 8, 219);
    			attr_dev(table, "id", "sidebar-inner-mob");
    			attr_dev(table, "cellpadding", "10");
    			attr_dev(table, "class", "svelte-nu81iu");
    			add_location(table, file$8, 10, 4, 163);
    			attr_dev(div, "id", "sidebar-outer-mob");
    			attr_dev(div, "class", "svelte-nu81iu");
    			add_location(div, file$8, 9, 0, 130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(td0, i0);
    			append_dev(td0, t0);
    			append_dev(td0, span0);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, i1);
    			append_dev(td1, t3);
    			append_dev(td1, span1);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(td0, "click", /*click_handler*/ ctx[1], false, false, false),
    				listen_dev(td1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    			];
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	function switchTabs(tab) {
    		gameTab.set(tab);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NavBar", $$slots, []);
    	const click_handler = () => switchTabs(0);
    	const click_handler_1 = () => switchTabs(1);
    	$$self.$capture_state = () => ({ gameTab, switchTabs });
    	return [switchTabs, click_handler, click_handler_1];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/Components/socketRecv.svelte generated by Svelte v3.22.2 */

    const { console: console_1$6 } = globals;

    function create_fragment$9(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $currSocket;
    	let $gamePref;
    	validate_store(currSocket, "currSocket");
    	component_subscribe($$self, currSocket, $$value => $$invalidate(0, $currSocket = $$value));
    	validate_store(gamePref, "gamePref");
    	component_subscribe($$self, gamePref, $$value => $$invalidate(1, $gamePref = $$value));

    	$currSocket.on("chat message", data => {
    		console.log("Received: " + data.msg);

    		gameChat.update(state => {
    			state.push(data);
    			return state;
    		});
    	});

    	$currSocket.on("second-user", data => {
    		if ($gamePref.sec == null && $gamePref.currPlayer != null) {
    			console.log("Received other username");

    			gamePref.update(state => {
    				state.sec = data;
    				return state;
    			});

    			$currSocket.emit("current-player", {
    				player: $gamePref.currPlayer,
    				room: $gamePref.id
    			});

    			gameChat.set([]);
    			if (screen.width < 800) gameTab.set(0);
    		}
    	});

    	$currSocket.on("current-player", data => {
    		console.log("Received current player");

    		gamePref.update(state => {
    			state.timer = state.time;
    			state.currPlayer = data;
    			return state;
    		});

    		console.log($gamePref.currPlayer);
    	});

    	$currSocket.on("paused", data => {
    		gamePref.update(state => {
    			state.paused = data;
    			return state;
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<SocketRecv> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SocketRecv", $$slots, []);

    	$$self.$capture_state = () => ({
    		gamePref,
    		gameBoard,
    		currSocket,
    		gameHistory,
    		gameChat,
    		gameTab,
    		$currSocket,
    		$gamePref
    	});

    	return [];
    }

    class SocketRecv extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SocketRecv",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Pages/gamePlay.svelte generated by Svelte v3.22.2 */

    // (18:0) {#if screenWidth > 800}
    function create_if_block_3$3(ctx) {
    	let t;
    	let current;
    	const game = new GameBoard({ $$inline: true });
    	const chat = new GameChat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(game.$$.fragment);
    			t = space();
    			create_component(chat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(game, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(chat, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(game, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(chat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(18:0) {#if screenWidth > 800}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if screenWidth <= 800}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_if_block_2$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$gameTab*/ ctx[0] == 0) return 0;
    		if (/*$gameTab*/ ctx[0] == 1) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const nav = new NavBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(nav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t);
    			destroy_component(nav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(23:0) {#if screenWidth <= 800}",
    		ctx
    	});

    	return block;
    }

    // (27:25) 
    function create_if_block_2$4(ctx) {
    	let current;
    	const chat = new GameChat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chat, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(27:25) ",
    		ctx
    	});

    	return block;
    }

    // (25:1) {#if $gameTab == 0}
    function create_if_block_1$4(ctx) {
    	let current;
    	const game = new GameBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(game.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(game, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(game, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(25:1) {#if $gameTab == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	const socket = new SocketRecv({ $$inline: true });
    	let if_block0 = /*screenWidth*/ ctx[1] > 800 && create_if_block_3$3(ctx);
    	let if_block1 = /*screenWidth*/ ctx[1] <= 800 && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			create_component(socket.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(socket, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*screenWidth*/ ctx[1] <= 800) if_block1.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(socket.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(socket.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(socket, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $gameTab;
    	validate_store(gameTab, "gameTab");
    	component_subscribe($$self, gameTab, $$value => $$invalidate(0, $gameTab = $$value));
    	let screenWidth = screen.width;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GamePlay> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GamePlay", $$slots, []);

    	$$self.$capture_state = () => ({
    		Position,
    		Board,
    		spring,
    		writable,
    		invokeFunction,
    		gameBoard,
    		gameHistory,
    		gamePref,
    		currSocket,
    		currUser,
    		gameChat,
    		gameTab,
    		Chat: GameChat,
    		Game: GameBoard,
    		Nav: NavBar,
    		Socket: SocketRecv,
    		screenWidth,
    		$gameTab
    	});

    	$$self.$inject_state = $$props => {
    		if ("screenWidth" in $$props) $$invalidate(1, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$gameTab, screenWidth];
    }

    class GamePlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GamePlay",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    class User {

        constructor(data) {
            this.isAuth = true;
            
            this.name = data.name;
            this.email = data.email;
            this.picture = data.picture == null ? 'https://source.unsplash.com/900x900/' : data.picture;
            this.wins = data.wins;
            this.draws = data.draws;
            this.losses = data.losses;
            this.gamesPlayed = data.gamesPlayed;        this.leastMoves = data.leastMoves;
            this.mostMoves = data.mostMoves;
            this.totalMoves = data.totalMoves;
            this.avgMovesPerGame = data.avgMovesPerGame;
            this.leastTimePlayed = data.leastTimePlayed;
            this.mostTimePlayed = data.mostTimePlayed;
            this.totalTimePlayed = data.totalTimePlayed;
            this.avgTimePlayPerGame = data.avgTimePlayPerGame;
            this.totalPoints = data.totalPoints;
        }
    }

    /* src/Pages/entry.svelte generated by Svelte v3.22.2 */

    const { console: console_1$7 } = globals;
    const file$9 = "src/Pages/entry.svelte";

    // (190:4) {:else}
    function create_else_block$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div1_onload_value;
    	let t0;
    	let input0;
    	let t1;
    	let input1;
    	let t2;
    	let input2;
    	let t3;
    	let input3;
    	let t4;
    	let br0;
    	let button0;
    	let t6;
    	let hr;
    	let t7;
    	let div3;
    	let h5;
    	let t8;
    	let br1;
    	let button1;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			input1 = element("input");
    			t2 = space();
    			input2 = element("input");
    			t3 = space();
    			input3 = element("input");
    			t4 = space();
    			br0 = element("br");
    			button0 = element("button");
    			button0.textContent = "Sign Up";
    			t6 = space();
    			hr = element("hr");
    			t7 = space();
    			div3 = element("div");
    			h5 = element("h5");
    			t8 = text("Already have an Account? ");
    			br1 = element("br");
    			button1 = element("button");
    			button1.textContent = "Sign In";
    			attr_dev(div0, "class", "loader svelte-isfeg9");
    			add_location(div0, file$9, 192, 16, 5622);
    			attr_dev(div1, "id", "signup-loader");
    			attr_dev(div1, "onload", div1_onload_value = stopLoading());
    			attr_dev(div1, "class", "loader-container svelte-isfeg9");
    			add_location(div1, file$9, 191, 12, 5531);
    			attr_dev(input0, "name", "Name");
    			attr_dev(input0, "id", "Name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Display Name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-isfeg9");
    			add_location(input0, file$9, 195, 16, 5748);
    			attr_dev(input1, "name", "Email");
    			attr_dev(input1, "id", "Email");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Email");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-isfeg9");
    			add_location(input1, file$9, 196, 16, 5863);
    			attr_dev(input2, "name", "Password");
    			attr_dev(input2, "id", "Password");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "placeholder", "Password");
    			input2.required = true;
    			attr_dev(input2, "class", "svelte-isfeg9");
    			add_location(input2, file$9, 197, 16, 5974);
    			attr_dev(input3, "name", "confirmPassword");
    			attr_dev(input3, "id", "confirmPassword");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "placeholder", "Confirm Password");
    			input3.required = true;
    			attr_dev(input3, "class", "svelte-isfeg9");
    			add_location(input3, file$9, 198, 16, 6101);
    			add_location(br0, file$9, 199, 16, 6287);
    			attr_dev(button0, "id", "signup-btn");
    			attr_dev(button0, "class", "btn btn-success svelte-isfeg9");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$9, 199, 21, 6292);
    			attr_dev(div2, "id", "signup-div");
    			add_location(div2, file$9, 190, 8, 5497);
    			set_style(hr, "border", "1px solid green");
    			add_location(hr, file$9, 202, 8, 6444);
    			add_location(br1, file$9, 204, 41, 6565);
    			attr_dev(button1, "class", "login-signup svelte-isfeg9");
    			add_location(button1, file$9, 204, 46, 6570);
    			attr_dev(h5, "class", "svelte-isfeg9");
    			add_location(h5, file$9, 204, 12, 6536);
    			attr_dev(div3, "class", "no-cred-sign-signup svelte-isfeg9");
    			add_location(div3, file$9, 203, 8, 6490);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div2, t0);
    			append_dev(div2, input0);
    			set_input_value(input0, /*Name*/ ctx[1]);
    			append_dev(div2, t1);
    			append_dev(div2, input1);
    			set_input_value(input1, /*Email*/ ctx[0]);
    			append_dev(div2, t2);
    			append_dev(div2, input2);
    			set_input_value(input2, /*Password*/ ctx[2]);
    			append_dev(div2, t3);
    			append_dev(div2, input3);
    			set_input_value(input3, /*confirmPassword*/ ctx[3]);
    			append_dev(div2, t4);
    			append_dev(div2, br0);
    			append_dev(div2, button0);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h5);
    			append_dev(h5, t8);
    			append_dev(h5, br1);
    			append_dev(h5, button1);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[16]),
    				listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[17]),
    				listen_dev(input2, "input", /*input2_input_handler*/ ctx[18]),
    				listen_dev(input3, "input", /*input3_input_handler*/ ctx[19]),
    				listen_dev(input3, "change", /*matchesPassword*/ ctx[9], false, false, false),
    				listen_dev(button0, "click", /*signUp*/ ctx[7], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[20], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Name*/ 2 && input0.value !== /*Name*/ ctx[1]) {
    				set_input_value(input0, /*Name*/ ctx[1]);
    			}

    			if (dirty & /*Email*/ 1 && input1.value !== /*Email*/ ctx[0]) {
    				set_input_value(input1, /*Email*/ ctx[0]);
    			}

    			if (dirty & /*Password*/ 4 && input2.value !== /*Password*/ ctx[2]) {
    				set_input_value(input2, /*Password*/ ctx[2]);
    			}

    			if (dirty & /*confirmPassword*/ 8 && input3.value !== /*confirmPassword*/ ctx[3]) {
    				set_input_value(input3, /*confirmPassword*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div3);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(190:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (174:4) {#if logPage}
    function create_if_block$5(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let form;
    	let input0;
    	let br0;
    	let t1;
    	let input1;
    	let br1;
    	let t2;
    	let br2;
    	let a;
    	let t4;
    	let h50;
    	let button0;
    	let t6;
    	let hr;
    	let t7;
    	let div3;
    	let h51;
    	let t8;
    	let br3;
    	let button1;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			form = element("form");
    			input0 = element("input");
    			br0 = element("br");
    			t1 = space();
    			input1 = element("input");
    			br1 = element("br");
    			t2 = space();
    			br2 = element("br");
    			a = element("a");
    			a.textContent = "Forgot Password?";
    			t4 = space();
    			h50 = element("h5");
    			button0 = element("button");
    			button0.textContent = "Log In";
    			t6 = space();
    			hr = element("hr");
    			t7 = space();
    			div3 = element("div");
    			h51 = element("h5");
    			t8 = text("Don't have an Account? ");
    			br3 = element("br");
    			button1 = element("button");
    			button1.textContent = "Sign Up";
    			attr_dev(div0, "class", "loader svelte-isfeg9");
    			add_location(div0, file$9, 176, 16, 4626);
    			attr_dev(div1, "id", "signin-loader");
    			attr_dev(div1, "class", "loader-container svelte-isfeg9");
    			add_location(div1, file$9, 175, 8, 4559);
    			attr_dev(input0, "name", "logEmail");
    			attr_dev(input0, "id", "logEmail");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Email");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-isfeg9");
    			add_location(input0, file$9, 179, 16, 4741);
    			add_location(br0, file$9, 179, 119, 4844);
    			attr_dev(input1, "name", "logPassword");
    			attr_dev(input1, "id", "logPassword");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-isfeg9");
    			add_location(input1, file$9, 180, 16, 4866);
    			add_location(br1, file$9, 180, 135, 4985);
    			add_location(br2, file$9, 181, 16, 5007);
    			attr_dev(a, "id", "forgotPassword");
    			attr_dev(a, "href", "");
    			attr_dev(a, "class", "svelte-isfeg9");
    			add_location(a, file$9, 181, 21, 5012);
    			attr_dev(button0, "class", "btn btn-success svelte-isfeg9");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$9, 182, 20, 5085);
    			attr_dev(h50, "class", "svelte-isfeg9");
    			add_location(h50, file$9, 182, 16, 5081);
    			attr_dev(form, "name", "login-form");
    			attr_dev(form, "id", "login-form");
    			attr_dev(form, "class", "svelte-isfeg9");
    			add_location(form, file$9, 178, 12, 4684);
    			attr_dev(div2, "id", "login-div");
    			attr_dev(div2, "class", "svelte-isfeg9");
    			add_location(div2, file$9, 174, 8, 4530);
    			set_style(hr, "border", "1px solid green");
    			add_location(hr, file$9, 185, 8, 5215);
    			add_location(br3, file$9, 187, 35, 5351);
    			attr_dev(button1, "class", "login-signup svelte-isfeg9");
    			attr_dev(button1, "id", "signupBtn");
    			add_location(button1, file$9, 187, 40, 5356);
    			attr_dev(h51, "class", "svelte-isfeg9");
    			add_location(h51, file$9, 187, 8, 5324);
    			attr_dev(div3, "class", "no-cred-sign-signup svelte-isfeg9");
    			attr_dev(div3, "id", "no-Acct-signup");
    			add_location(div3, file$9, 186, 8, 5261);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div2, t0);
    			append_dev(div2, form);
    			append_dev(form, input0);
    			set_input_value(input0, /*logEmail*/ ctx[4]);
    			append_dev(form, br0);
    			append_dev(form, t1);
    			append_dev(form, input1);
    			set_input_value(input1, /*logPassword*/ ctx[5]);
    			append_dev(form, br1);
    			append_dev(form, t2);
    			append_dev(form, br2);
    			append_dev(form, a);
    			append_dev(form, t4);
    			append_dev(form, h50);
    			append_dev(h50, button0);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h51);
    			append_dev(h51, t8);
    			append_dev(h51, br3);
    			append_dev(h51, button1);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    				listen_dev(button0, "click", /*signIn*/ ctx[8], false, false, false),
    				listen_dev(button1, "click", /*click_handler*/ ctx[15], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*logEmail*/ 16 && input0.value !== /*logEmail*/ ctx[4]) {
    				set_input_value(input0, /*logEmail*/ ctx[4]);
    			}

    			if (dirty & /*logPassword*/ 32 && input1.value !== /*logPassword*/ ctx[5]) {
    				set_input_value(input1, /*logPassword*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div3);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(174:4) {#if logPage}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div1;
    	let div0;
    	let h3;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;

    	function select_block_type(ctx, dirty) {
    		if (/*logPage*/ ctx[6]) return create_if_block$5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Checkas.io";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			img = element("img");
    			attr_dev(h3, "class", "svelte-isfeg9");
    			add_location(h3, file$9, 172, 4, 4484);
    			attr_dev(div0, "id", "entry");
    			attr_dev(div0, "class", "container svelte-isfeg9");
    			add_location(div0, file$9, 171, 0, 4445);
    			attr_dev(img, "id", "back-image");
    			attr_dev(img, "alt", "checker");
    			if (img.src !== (img_src_value = "./images/checkers.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-isfeg9");
    			add_location(img, file$9, 208, 0, 6694);
    			attr_dev(div1, "class", "background svelte-isfeg9");
    			add_location(div1, file$9, 170, 0, 4420);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(div0, t1);
    			if_block.m(div0, null);
    			append_dev(div1, t2);
    			append_dev(div1, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function validateSigin() {
    	return true;
    }

    function validateSignUp() {
    	return true;
    }

    function validateSignInEmail() {
    	
    }

    function validateSignInPassword() {
    	
    }

    function validateSignUpName() {
    	
    }

    function validateSignUpEmail() {
    	
    }

    function validateSignUppassWord() {
    	
    }

    function validateSignUpconPassword() {
    	
    }

    function loading() {
    	window.$(".loader-container").attr("style", "display: flex");
    }

    function stopLoading() {
    	window.$(".loader-container").attr("style", "display: none");
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let Email, Name, Password, confirmPassword;
    	let logEmail, logPassword;
    	let request;
    	let logPage = true;

    	function signUp() {
    		{
    			console.log("In sign up");
    			loading();

    			if (Email != null && Name != null && Password != null && confirmPassword != null && Password == confirmPassword) {
    				request = {
    					func: "signUp",
    					email: Email,
    					name: Name,
    					password: Password
    				};

    				console.log("Sending sign up request");

    				invokeFunction(request).then(response => {
    					console.log(response);

    					if (response.msg == "SUCCESS") {
    						request.func = "createUser";
    						createUser();
    					} else {
    						console.log(response.err);
    					}

    					console.log("stoping loading sign");
    					stopLoading();
    				}).catch(err => {
    					console.log(err);
    					stopLoading();
    				});
    			}
    		}
    	}

    	function createUser() {
    		invokeFunction(request).then(response => {
    			console.log(response);

    			if (response.msg == "SUCCESS") {
    				console.log("Verify Email");
    			} else {
    				console.log(response.err);
    			}
    		}).catch(err => {
    			console.log(err);
    		});
    	}

    	function signIn() {
    		{
    			console.log("In sign in");
    			loading();

    			if (logEmail != null && logPassword != null) {
    				request = {
    					func: "signIn",
    					email: logEmail,
    					password: logPassword
    				};

    				invokeFunction(request).then(response => {
    					if (response.msg != null && response.msg) {
    						request.func = "retrieveUser";
    						retrieveUser();
    					} else if (response.msg != null && !response.msg) {
    						console.log("Unverified Email");
    					} else {
    						console.log(response.err);
    					}

    					console.log("stoping loading sign");
    					stopLoading();
    				}).catch(err => {
    					console.log(err);
    				});
    			}
    		}
    	}

    	function retrieveUser() {
    		invokeFunction(request).then(response => {
    			//console.log(response);
    			if (response.msg != null) {
    				let data = response.msg;
    				data.email = logEmail;
    				currUser.set(new User(data));
    				($$invalidate(0, Email = ""), $$invalidate(1, Name = ""), $$invalidate(2, Password = ""), $$invalidate(3, confirmPassword = ""));
    				($$invalidate(4, logEmail = ""), $$invalidate(5, logPassword = ""));
    			} else {
    				console.log(response.err);
    			}
    		}).catch(err => {
    			console.log(err);
    		});
    	}

    	function matchesPassword() {
    		if (Password != confirmPassword) {
    			console.log("passwords must match");
    		} else {
    			console.log("passwords match");
    		}
    	}

    	window.$(document).ready(function () {
    		document.getElementById("signin-loader").addEventListener("load", stopLoading());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<Entry> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Entry", $$slots, []);

    	function input0_input_handler() {
    		logEmail = this.value;
    		$$invalidate(4, logEmail);
    	}

    	function input1_input_handler() {
    		logPassword = this.value;
    		$$invalidate(5, logPassword);
    	}

    	const click_handler = () => $$invalidate(6, logPage = !logPage);

    	function input0_input_handler_1() {
    		Name = this.value;
    		$$invalidate(1, Name);
    	}

    	function input1_input_handler_1() {
    		Email = this.value;
    		$$invalidate(0, Email);
    	}

    	function input2_input_handler() {
    		Password = this.value;
    		$$invalidate(2, Password);
    	}

    	function input3_input_handler() {
    		confirmPassword = this.value;
    		$$invalidate(3, confirmPassword);
    	}

    	const click_handler_1 = () => $$invalidate(6, logPage = !logPage);

    	$$self.$capture_state = () => ({
    		currUser,
    		page,
    		invokeFunction,
    		User,
    		Email,
    		Name,
    		Password,
    		confirmPassword,
    		logEmail,
    		logPassword,
    		request,
    		logPage,
    		signUp,
    		createUser,
    		signIn,
    		retrieveUser,
    		matchesPassword,
    		validateSigin,
    		validateSignUp,
    		validateSignInEmail,
    		validateSignInPassword,
    		validateSignUpName,
    		validateSignUpEmail,
    		validateSignUppassWord,
    		validateSignUpconPassword,
    		loading,
    		stopLoading
    	});

    	$$self.$inject_state = $$props => {
    		if ("Email" in $$props) $$invalidate(0, Email = $$props.Email);
    		if ("Name" in $$props) $$invalidate(1, Name = $$props.Name);
    		if ("Password" in $$props) $$invalidate(2, Password = $$props.Password);
    		if ("confirmPassword" in $$props) $$invalidate(3, confirmPassword = $$props.confirmPassword);
    		if ("logEmail" in $$props) $$invalidate(4, logEmail = $$props.logEmail);
    		if ("logPassword" in $$props) $$invalidate(5, logPassword = $$props.logPassword);
    		if ("request" in $$props) request = $$props.request;
    		if ("logPage" in $$props) $$invalidate(6, logPage = $$props.logPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Email,
    		Name,
    		Password,
    		confirmPassword,
    		logEmail,
    		logPassword,
    		logPage,
    		signUp,
    		signIn,
    		matchesPassword,
    		request,
    		createUser,
    		retrieveUser,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		click_handler_1
    	];
    }

    class Entry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Entry",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.22.2 */

    // (17:0) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const entry = new Entry({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(entry.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entry, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entry.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entry.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entry, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(17:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if $currUser != null && $currUser.isAuth}
    function create_if_block$6(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*$page*/ ctx[1] == 0 && create_if_block_2$5(ctx);
    	let if_block1 = /*$page*/ ctx[1] == 1 && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$page*/ ctx[1] == 0) {
    				if (if_block0) {
    					if (dirty & /*$page*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$page*/ ctx[1] == 1) {
    				if (if_block1) {
    					if (dirty & /*$page*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(8:0) {#if $currUser != null && $currUser.isAuth}",
    		ctx
    	});

    	return block;
    }

    // (10:1) {#if $page == 0}
    function create_if_block_2$5(ctx) {
    	let current;
    	const dash = new DashBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dash.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dash, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dash.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dash.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dash, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(10:1) {#if $page == 0}",
    		ctx
    	});

    	return block;
    }

    // (14:1) {#if $page == 1}
    function create_if_block_1$5(ctx) {
    	let current;
    	const play = new GamePlay({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(play.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(play, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(play.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(play.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(play, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(14:1) {#if $page == 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$currUser*/ ctx[0] != null && /*$currUser*/ ctx[0].isAuth) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $currUser;
    	let $page;
    	validate_store(currUser, "currUser");
    	component_subscribe($$self, currUser, $$value => $$invalidate(0, $currUser = $$value));
    	validate_store(page, "page");
    	component_subscribe($$self, page, $$value => $$invalidate(1, $page = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Dash: DashBoard,
    		Play: GamePlay,
    		Entry,
    		currUser,
    		page,
    		$currUser,
    		$page
    	});

    	return [$currUser, $page];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
>>>>>>> e62c91d46b41ed59e85ac09eb85a62cbf3160da4
//# sourceMappingURL=bundle.js.map
