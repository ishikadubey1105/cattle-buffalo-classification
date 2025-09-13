var yt=Object.defineProperty;var He=e=>{throw TypeError(e)};var wt=(e,t,s)=>t in e?yt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var m=(e,t,s)=>wt(e,typeof t!="symbol"?t+"":t,s),Ie=(e,t,s)=>t.has(e)||He("Cannot "+s);var o=(e,t,s)=>(Ie(e,t,"read from private field"),s?s.call(e):t.get(e)),g=(e,t,s)=>t.has(e)?He("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),h=(e,t,s,r)=>(Ie(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),b=(e,t,s)=>(Ie(e,t,"access private method"),s);var Be=(e,t,s,r)=>({set _(a){h(e,t,a,s)},get _(){return o(e,t,r)}});var Ue=(e,t,s)=>(r,a)=>{let i=-1;return n(0);async function n(l){if(l<=i)throw new Error("next() called multiple times");i=l;let c,d=!1,u;if(e[l]?(u=e[l][0][0],r.req.routeIndex=l):u=l===e.length&&a||void 0,u)try{c=await u(r,()=>n(l+1))}catch(f){if(f instanceof Error&&t)r.error=f,c=await t(f,r),d=!0;else throw f}else r.finalized===!1&&s&&(c=await s(r));return c&&(r.finalized===!1||d)&&(r.res=c),r}},Tt=Symbol(),Rt=async(e,t=Object.create(null))=>{const{all:s=!1,dot:r=!1}=t,i=(e instanceof it?e.raw.headers:e.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?At(e,{all:s,dot:r}):{}};async function At(e,t){const s=await e.formData();return s?Ct(s,t):{}}function Ct(e,t){const s=Object.create(null);return e.forEach((r,a)=>{t.all||a.endsWith("[]")?Nt(s,a,r):s[a]=r}),t.dot&&Object.entries(s).forEach(([r,a])=>{r.includes(".")&&(Ot(s,r,a),delete s[r])}),s}var Nt=(e,t,s)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(s):e[t]=[e[t],s]:t.endsWith("[]")?e[t]=[s]:e[t]=s},Ot=(e,t,s)=>{let r=e;const a=t.split(".");a.forEach((i,n)=>{n===a.length-1?r[i]=s:((!r[i]||typeof r[i]!="object"||Array.isArray(r[i])||r[i]instanceof File)&&(r[i]=Object.create(null)),r=r[i])})},et=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},St=e=>{const{groups:t,path:s}=It(e),r=et(s);return jt(r,t)},It=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(s,r)=>{const a=`@${r}`;return t.push([a,s]),a}),{groups:t,path:e}},jt=(e,t)=>{for(let s=t.length-1;s>=0;s--){const[r]=t[s];for(let a=e.length-1;a>=0;a--)if(e[a].includes(r)){e[a]=e[a].replace(r,t[s][1]);break}}return e},we={},Dt=(e,t)=>{if(e==="*")return"*";const s=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const r=`${e}#${t}`;return we[r]||(s[2]?we[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,s[1],new RegExp(`^${s[2]}(?=/${t})`)]:[e,s[1],new RegExp(`^${s[2]}$`)]:we[r]=[e,s[1],!0]),we[r]}return null},Le=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},Mt=e=>Le(e,decodeURI),tt=e=>{const t=e.url,s=t.indexOf("/",t.indexOf(":")+4);let r=s;for(;r<t.length;r++){const a=t.charCodeAt(r);if(a===37){const i=t.indexOf("?",r),n=t.slice(s,i===-1?void 0:i);return Mt(n.includes("%25")?n.replace(/%25/g,"%2525"):n)}else if(a===63)break}return t.slice(s,r)},Pt=e=>{const t=tt(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},se=(e,t,...s)=>(s.length&&(t=se(t,...s)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),st=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),s=[];let r="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))r+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){s.length===0&&r===""?s.push("/"):s.push(r);const i=a.replace("?","");r+="/"+i,s.push(r)}else r+="/"+a}),s.filter((a,i,n)=>n.indexOf(a)===i)},je=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?Le(e,at):e):e,rt=(e,t,s)=>{let r;if(!s&&t&&!/[%+]/.test(t)){let n=e.indexOf(`?${t}`,8);for(n===-1&&(n=e.indexOf(`&${t}`,8));n!==-1;){const l=e.charCodeAt(n+t.length+1);if(l===61){const c=n+t.length+2,d=e.indexOf("&",c);return je(e.slice(c,d===-1?void 0:d))}else if(l==38||isNaN(l))return"";n=e.indexOf(`&${t}`,n+1)}if(r=/[%+]/.test(e),!r)return}const a={};r??(r=/[%+]/.test(e));let i=e.indexOf("?",8);for(;i!==-1;){const n=e.indexOf("&",i+1);let l=e.indexOf("=",i);l>n&&n!==-1&&(l=-1);let c=e.slice(i+1,l===-1?n===-1?void 0:n:l);if(r&&(c=je(c)),i=n,c==="")continue;let d;l===-1?d="":(d=e.slice(l+1,n===-1?void 0:n),r&&(d=je(d))),s?(a[c]&&Array.isArray(a[c])||(a[c]=[]),a[c].push(d)):a[c]??(a[c]=d)}return t?a[t]:a},Lt=rt,Ft=(e,t)=>rt(e,t,!0),at=decodeURIComponent,$e=e=>Le(e,at),ie,N,B,nt,ot,Me,$,Ke,it=(Ke=class{constructor(e,t="/",s=[[]]){g(this,B);m(this,"raw");g(this,ie);g(this,N);m(this,"routeIndex",0);m(this,"path");m(this,"bodyCache",{});g(this,$,e=>{const{bodyCache:t,raw:s}=this,r=t[e];if(r)return r;const a=Object.keys(t)[0];return a?t[a].then(i=>(a==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=s[e]()});this.raw=e,this.path=t,h(this,N,s),h(this,ie,{})}param(e){return e?b(this,B,nt).call(this,e):b(this,B,ot).call(this)}query(e){return Lt(this.url,e)}queries(e){return Ft(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((s,r)=>{t[r]=s}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Rt(this,e))}json(){return o(this,$).call(this,"text").then(e=>JSON.parse(e))}text(){return o(this,$).call(this,"text")}arrayBuffer(){return o(this,$).call(this,"arrayBuffer")}blob(){return o(this,$).call(this,"blob")}formData(){return o(this,$).call(this,"formData")}addValidatedData(e,t){o(this,ie)[e]=t}valid(e){return o(this,ie)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Tt](){return o(this,N)}get matchedRoutes(){return o(this,N)[0].map(([[,e]])=>e)}get routePath(){return o(this,N)[0].map(([[,e]])=>e)[this.routeIndex].path}},ie=new WeakMap,N=new WeakMap,B=new WeakSet,nt=function(e){const t=o(this,N)[0][this.routeIndex][1][e],s=b(this,B,Me).call(this,t);return s?/\%/.test(s)?$e(s):s:void 0},ot=function(){const e={},t=Object.keys(o(this,N)[0][this.routeIndex][1]);for(const s of t){const r=b(this,B,Me).call(this,o(this,N)[0][this.routeIndex][1][s]);r&&typeof r=="string"&&(e[s]=/\%/.test(r)?$e(r):r)}return e},Me=function(e){return o(this,N)[1]?o(this,N)[1][e]:e},$=new WeakMap,Ke),Ht={Stringify:1},ct=async(e,t,s,r,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const i=e.callbacks;return i!=null&&i.length?(a?a[0]+=e:a=[e],Promise.all(i.map(l=>l({phase:t,buffer:a,context:r}))).then(l=>Promise.all(l.filter(Boolean).map(c=>ct(c,t,!1,r,a))).then(()=>a[0]))):Promise.resolve(e)},Bt="text/plain; charset=UTF-8",De=(e,t)=>({"Content-Type":e,...t}),be,Ee,P,ne,L,A,xe,oe,ce,W,_e,ve,G,re,ze,Ut=(ze=class{constructor(e,t){g(this,G);g(this,be);g(this,Ee);m(this,"env",{});g(this,P);m(this,"finalized",!1);m(this,"error");g(this,ne);g(this,L);g(this,A);g(this,xe);g(this,oe);g(this,ce);g(this,W);g(this,_e);g(this,ve);m(this,"render",(...e)=>(o(this,oe)??h(this,oe,t=>this.html(t)),o(this,oe).call(this,...e)));m(this,"setLayout",e=>h(this,xe,e));m(this,"getLayout",()=>o(this,xe));m(this,"setRenderer",e=>{h(this,oe,e)});m(this,"header",(e,t,s)=>{this.finalized&&h(this,A,new Response(o(this,A).body,o(this,A)));const r=o(this,A)?o(this,A).headers:o(this,W)??h(this,W,new Headers);t===void 0?r.delete(e):s!=null&&s.append?r.append(e,t):r.set(e,t)});m(this,"status",e=>{h(this,ne,e)});m(this,"set",(e,t)=>{o(this,P)??h(this,P,new Map),o(this,P).set(e,t)});m(this,"get",e=>o(this,P)?o(this,P).get(e):void 0);m(this,"newResponse",(...e)=>b(this,G,re).call(this,...e));m(this,"body",(e,t,s)=>b(this,G,re).call(this,e,t,s));m(this,"text",(e,t,s)=>!o(this,W)&&!o(this,ne)&&!t&&!s&&!this.finalized?new Response(e):b(this,G,re).call(this,e,t,De(Bt,s)));m(this,"json",(e,t,s)=>b(this,G,re).call(this,JSON.stringify(e),t,De("application/json",s)));m(this,"html",(e,t,s)=>{const r=a=>b(this,G,re).call(this,a,t,De("text/html; charset=UTF-8",s));return typeof e=="object"?ct(e,Ht.Stringify,!1,{}).then(r):r(e)});m(this,"redirect",(e,t)=>{const s=String(e);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,t??302)});m(this,"notFound",()=>(o(this,ce)??h(this,ce,()=>new Response),o(this,ce).call(this,this)));h(this,be,e),t&&(h(this,L,t.executionCtx),this.env=t.env,h(this,ce,t.notFoundHandler),h(this,ve,t.path),h(this,_e,t.matchResult))}get req(){return o(this,Ee)??h(this,Ee,new it(o(this,be),o(this,ve),o(this,_e))),o(this,Ee)}get event(){if(o(this,L)&&"respondWith"in o(this,L))return o(this,L);throw Error("This context has no FetchEvent")}get executionCtx(){if(o(this,L))return o(this,L);throw Error("This context has no ExecutionContext")}get res(){return o(this,A)||h(this,A,new Response(null,{headers:o(this,W)??h(this,W,new Headers)}))}set res(e){if(o(this,A)&&e){e=new Response(e.body,e);for(const[t,s]of o(this,A).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const r=o(this,A).headers.getSetCookie();e.headers.delete("set-cookie");for(const a of r)e.headers.append("set-cookie",a)}else e.headers.set(t,s)}h(this,A,e),this.finalized=!0}get var(){return o(this,P)?Object.fromEntries(o(this,P)):{}}},be=new WeakMap,Ee=new WeakMap,P=new WeakMap,ne=new WeakMap,L=new WeakMap,A=new WeakMap,xe=new WeakMap,oe=new WeakMap,ce=new WeakMap,W=new WeakMap,_e=new WeakMap,ve=new WeakMap,G=new WeakSet,re=function(e,t,s){const r=o(this,A)?new Headers(o(this,A).headers):o(this,W)??new Headers;if(typeof t=="object"&&"headers"in t){const i=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[n,l]of i)n.toLowerCase()==="set-cookie"?r.append(n,l):r.set(n,l)}if(s)for(const[i,n]of Object.entries(s))if(typeof n=="string")r.set(i,n);else{r.delete(i);for(const l of n)r.append(i,l)}const a=typeof t=="number"?t:(t==null?void 0:t.status)??o(this,ne);return new Response(e,{status:a,headers:r})},ze),v="ALL",$t="all",Gt=["get","post","put","delete","options","patch"],lt="Can not add a route since the matcher is already built.",dt=class extends Error{},kt="__COMPOSED_HANDLER",qt=e=>e.text("404 Not Found",404),Ge=(e,t)=>{if("getResponse"in e){const s=e.getResponse();return t.newResponse(s.body,s)}return console.error(e),t.text("Internal Server Error",500)},O,y,ft,S,X,Te,Re,Xe,ut=(Xe=class{constructor(t={}){g(this,y);m(this,"get");m(this,"post");m(this,"put");m(this,"delete");m(this,"options");m(this,"patch");m(this,"all");m(this,"on");m(this,"use");m(this,"router");m(this,"getPath");m(this,"_basePath","/");g(this,O,"/");m(this,"routes",[]);g(this,S,qt);m(this,"errorHandler",Ge);m(this,"onError",t=>(this.errorHandler=t,this));m(this,"notFound",t=>(h(this,S,t),this));m(this,"fetch",(t,...s)=>b(this,y,Re).call(this,t,s[1],s[0],t.method));m(this,"request",(t,s,r,a)=>t instanceof Request?this.fetch(s?new Request(t,s):t,r,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${se("/",t)}`,s),r,a)));m(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(b(this,y,Re).call(this,t.request,t,void 0,t.request.method))})});[...Gt,$t].forEach(i=>{this[i]=(n,...l)=>(typeof n=="string"?h(this,O,n):b(this,y,X).call(this,i,o(this,O),n),l.forEach(c=>{b(this,y,X).call(this,i,o(this,O),c)}),this)}),this.on=(i,n,...l)=>{for(const c of[n].flat()){h(this,O,c);for(const d of[i].flat())l.map(u=>{b(this,y,X).call(this,d.toUpperCase(),o(this,O),u)})}return this},this.use=(i,...n)=>(typeof i=="string"?h(this,O,i):(h(this,O,"*"),n.unshift(i)),n.forEach(l=>{b(this,y,X).call(this,v,o(this,O),l)}),this);const{strict:r,...a}=t;Object.assign(this,a),this.getPath=r??!0?t.getPath??tt:Pt}route(t,s){const r=this.basePath(t);return s.routes.map(a=>{var n;let i;s.errorHandler===Ge?i=a.handler:(i=async(l,c)=>(await Ue([],s.errorHandler)(l,()=>a.handler(l,c))).res,i[kt]=a.handler),b(n=r,y,X).call(n,a.method,a.path,i)}),this}basePath(t){const s=b(this,y,ft).call(this);return s._basePath=se(this._basePath,t),s}mount(t,s,r){let a,i;r&&(typeof r=="function"?i=r:(i=r.optionHandler,r.replaceRequest===!1?a=c=>c:a=r.replaceRequest));const n=i?c=>{const d=i(c);return Array.isArray(d)?d:[d]}:c=>{let d;try{d=c.executionCtx}catch{}return[c.env,d]};a||(a=(()=>{const c=se(this._basePath,t),d=c==="/"?0:c.length;return u=>{const f=new URL(u.url);return f.pathname=f.pathname.slice(d)||"/",new Request(f,u)}})());const l=async(c,d)=>{const u=await s(a(c.req.raw),...n(c));if(u)return u;await d()};return b(this,y,X).call(this,v,se(t,"*"),l),this}},O=new WeakMap,y=new WeakSet,ft=function(){const t=new ut({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,h(t,S,o(this,S)),t.routes=this.routes,t},S=new WeakMap,X=function(t,s,r){t=t.toUpperCase(),s=se(this._basePath,s);const a={basePath:this._basePath,path:s,method:t,handler:r};this.router.add(t,s,[r,a]),this.routes.push(a)},Te=function(t,s){if(t instanceof Error)return this.errorHandler(t,s);throw t},Re=function(t,s,r,a){if(a==="HEAD")return(async()=>new Response(null,await b(this,y,Re).call(this,t,s,r,"GET")))();const i=this.getPath(t,{env:r}),n=this.router.match(a,i),l=new Ut(t,{path:i,matchResult:n,env:r,executionCtx:s,notFoundHandler:o(this,S)});if(n[0].length===1){let d;try{d=n[0][0][0][0](l,async()=>{l.res=await o(this,S).call(this,l)})}catch(u){return b(this,y,Te).call(this,u,l)}return d instanceof Promise?d.then(u=>u||(l.finalized?l.res:o(this,S).call(this,l))).catch(u=>b(this,y,Te).call(this,u,l)):d??o(this,S).call(this,l)}const c=Ue(n[0],this.errorHandler,o(this,S));return(async()=>{try{const d=await c(l);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return b(this,y,Te).call(this,d,l)}})()},Xe),Ce="[^/]+",pe=".*",ge="(?:|/.*)",ae=Symbol(),Kt=new Set(".\\+*[^]$()");function zt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===pe||e===ge?1:t===pe||t===ge?-1:e===Ce?1:t===Ce?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Y,J,I,Ve,Pe=(Ve=class{constructor(){g(this,Y);g(this,J);g(this,I,Object.create(null))}insert(t,s,r,a,i){if(t.length===0){if(o(this,Y)!==void 0)throw ae;if(i)return;h(this,Y,s);return}const[n,...l]=t,c=n==="*"?l.length===0?["","",pe]:["","",Ce]:n==="/*"?["","",ge]:n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(c){const u=c[1];let f=c[2]||Ce;if(u&&c[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw ae;if(d=o(this,I)[f],!d){if(Object.keys(o(this,I)).some(p=>p!==pe&&p!==ge))throw ae;if(i)return;d=o(this,I)[f]=new Pe,u!==""&&h(d,J,a.varIndex++)}!i&&u!==""&&r.push([u,o(d,J)])}else if(d=o(this,I)[n],!d){if(Object.keys(o(this,I)).some(u=>u.length>1&&u!==pe&&u!==ge))throw ae;if(i)return;d=o(this,I)[n]=new Pe}d.insert(l,s,r,a,i)}buildRegExpStr(){const s=Object.keys(o(this,I)).sort(zt).map(r=>{const a=o(this,I)[r];return(typeof o(a,J)=="number"?`(${r})@${o(a,J)}`:Kt.has(r)?`\\${r}`:r)+a.buildRegExpStr()});return typeof o(this,Y)=="number"&&s.unshift(`#${o(this,Y)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},Y=new WeakMap,J=new WeakMap,I=new WeakMap,Ve),Ne,ye,We,Xt=(We=class{constructor(){g(this,Ne,{varIndex:0});g(this,ye,new Pe)}insert(e,t,s){const r=[],a=[];for(let n=0;;){let l=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const d=`@\\${n}`;return a[n]=[d,c],n++,l=!0,d}),!l)break}const i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let n=a.length-1;n>=0;n--){const[l]=a[n];for(let c=i.length-1;c>=0;c--)if(i[c].indexOf(l)!==-1){i[c]=i[c].replace(l,a[n][1]);break}}return o(this,ye).insert(i,t,r,o(this,Ne),s),r}buildRegExp(){let e=o(this,ye).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const s=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,i,n)=>i!==void 0?(s[++t]=Number(i),"$()"):(n!==void 0&&(r[Number(n)]=++t),"")),[new RegExp(`^${e}`),s,r]}},Ne=new WeakMap,ye=new WeakMap,We),ht=[],Vt=[/^$/,[],Object.create(null)],Ae=Object.create(null);function mt(e){return Ae[e]??(Ae[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function Wt(){Ae=Object.create(null)}function Yt(e){var d;const t=new Xt,s=[];if(e.length===0)return Vt;const r=e.map(u=>[!/\*|\/:/.test(u[0]),...u]).sort(([u,f],[p,_])=>u?1:p?-1:f.length-_.length),a=Object.create(null);for(let u=0,f=-1,p=r.length;u<p;u++){const[_,C,E]=r[u];_?a[C]=[E.map(([R])=>[R,Object.create(null)]),ht]:f++;let x;try{x=t.insert(C,f,_)}catch(R){throw R===ae?new dt(C):R}_||(s[f]=E.map(([R,ee])=>{const fe=Object.create(null);for(ee-=1;ee>=0;ee--){const[D,Oe]=x[ee];fe[D]=Oe}return[R,fe]}))}const[i,n,l]=t.buildRegExp();for(let u=0,f=s.length;u<f;u++)for(let p=0,_=s[u].length;p<_;p++){const C=(d=s[u][p])==null?void 0:d[1];if(!C)continue;const E=Object.keys(C);for(let x=0,R=E.length;x<R;x++)C[E[x]]=l[C[E[x]]]}const c=[];for(const u in n)c[u]=s[n[u]];return[i,c,a]}function te(e,t){if(e){for(const s of Object.keys(e).sort((r,a)=>a.length-r.length))if(mt(s).test(t))return[...e[s]]}}var k,q,de,pt,gt,Ye,Jt=(Ye=class{constructor(){g(this,de);m(this,"name","RegExpRouter");g(this,k);g(this,q);h(this,k,{[v]:Object.create(null)}),h(this,q,{[v]:Object.create(null)})}add(e,t,s){var l;const r=o(this,k),a=o(this,q);if(!r||!a)throw new Error(lt);r[e]||[r,a].forEach(c=>{c[e]=Object.create(null),Object.keys(c[v]).forEach(d=>{c[e][d]=[...c[v][d]]})}),t==="/*"&&(t="*");const i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=mt(t);e===v?Object.keys(r).forEach(d=>{var u;(u=r[d])[t]||(u[t]=te(r[d],t)||te(r[v],t)||[])}):(l=r[e])[t]||(l[t]=te(r[e],t)||te(r[v],t)||[]),Object.keys(r).forEach(d=>{(e===v||e===d)&&Object.keys(r[d]).forEach(u=>{c.test(u)&&r[d][u].push([s,i])})}),Object.keys(a).forEach(d=>{(e===v||e===d)&&Object.keys(a[d]).forEach(u=>c.test(u)&&a[d][u].push([s,i]))});return}const n=st(t)||[t];for(let c=0,d=n.length;c<d;c++){const u=n[c];Object.keys(a).forEach(f=>{var p;(e===v||e===f)&&((p=a[f])[u]||(p[u]=[...te(r[f],u)||te(r[v],u)||[]]),a[f][u].push([s,i-d+c+1]))})}}match(e,t){Wt();const s=b(this,de,pt).call(this);return this.match=(r,a)=>{const i=s[r]||s[v],n=i[2][a];if(n)return n;const l=a.match(i[0]);if(!l)return[[],ht];const c=l.indexOf("",1);return[i[1][c],l]},this.match(e,t)}},k=new WeakMap,q=new WeakMap,de=new WeakSet,pt=function(){const e=Object.create(null);return Object.keys(o(this,q)).concat(Object.keys(o(this,k))).forEach(t=>{e[t]||(e[t]=b(this,de,gt).call(this,t))}),h(this,k,h(this,q,void 0)),e},gt=function(e){const t=[];let s=e===v;return[o(this,k),o(this,q)].forEach(r=>{const a=r[e]?Object.keys(r[e]).map(i=>[i,r[e][i]]):[];a.length!==0?(s||(s=!0),t.push(...a)):e!==v&&t.push(...Object.keys(r[v]).map(i=>[i,r[v][i]]))}),s?Yt(t):null},Ye),K,F,Je,Qt=(Je=class{constructor(e){m(this,"name","SmartRouter");g(this,K,[]);g(this,F,[]);h(this,K,e.routers)}add(e,t,s){if(!o(this,F))throw new Error(lt);o(this,F).push([e,t,s])}match(e,t){if(!o(this,F))throw new Error("Fatal error");const s=o(this,K),r=o(this,F),a=s.length;let i=0,n;for(;i<a;i++){const l=s[i];try{for(let c=0,d=r.length;c<d;c++)l.add(...r[c]);n=l.match(e,t)}catch(c){if(c instanceof dt)continue;throw c}this.match=l.match.bind(l),h(this,K,[l]),h(this,F,void 0);break}if(i===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,n}get activeRouter(){if(o(this,F)||o(this,K).length!==1)throw new Error("No active router has been determined yet.");return o(this,K)[0]}},K=new WeakMap,F=new WeakMap,Je),me=Object.create(null),z,T,Q,le,w,H,V,Qe,bt=(Qe=class{constructor(e,t,s){g(this,H);g(this,z);g(this,T);g(this,Q);g(this,le,0);g(this,w,me);if(h(this,T,s||Object.create(null)),h(this,z,[]),e&&t){const r=Object.create(null);r[e]={handler:t,possibleKeys:[],score:0},h(this,z,[r])}h(this,Q,[])}insert(e,t,s){h(this,le,++Be(this,le)._);let r=this;const a=St(t),i=[];for(let n=0,l=a.length;n<l;n++){const c=a[n],d=a[n+1],u=Dt(c,d),f=Array.isArray(u)?u[0]:c;if(f in o(r,T)){r=o(r,T)[f],u&&i.push(u[1]);continue}o(r,T)[f]=new bt,u&&(o(r,Q).push(u),i.push(u[1])),r=o(r,T)[f]}return o(r,z).push({[e]:{handler:s,possibleKeys:i.filter((n,l,c)=>c.indexOf(n)===l),score:o(this,le)}}),r}search(e,t){var l;const s=[];h(this,w,me);let a=[this];const i=et(t),n=[];for(let c=0,d=i.length;c<d;c++){const u=i[c],f=c===d-1,p=[];for(let _=0,C=a.length;_<C;_++){const E=a[_],x=o(E,T)[u];x&&(h(x,w,o(E,w)),f?(o(x,T)["*"]&&s.push(...b(this,H,V).call(this,o(x,T)["*"],e,o(E,w))),s.push(...b(this,H,V).call(this,x,e,o(E,w)))):p.push(x));for(let R=0,ee=o(E,Q).length;R<ee;R++){const fe=o(E,Q)[R],D=o(E,w)===me?{}:{...o(E,w)};if(fe==="*"){const U=o(E,T)["*"];U&&(s.push(...b(this,H,V).call(this,U,e,o(E,w))),h(U,w,D),p.push(U));continue}const[Oe,Fe,he]=fe;if(!u&&!(he instanceof RegExp))continue;const M=o(E,T)[Oe],vt=i.slice(c).join("/");if(he instanceof RegExp){const U=he.exec(vt);if(U){if(D[Fe]=U[0],s.push(...b(this,H,V).call(this,M,e,o(E,w),D)),Object.keys(o(M,T)).length){h(M,w,D);const Se=((l=U[0].match(/\//))==null?void 0:l.length)??0;(n[Se]||(n[Se]=[])).push(M)}continue}}(he===!0||he.test(u))&&(D[Fe]=u,f?(s.push(...b(this,H,V).call(this,M,e,D,o(E,w))),o(M,T)["*"]&&s.push(...b(this,H,V).call(this,o(M,T)["*"],e,D,o(E,w)))):(h(M,w,D),p.push(M)))}}a=p.concat(n.shift()??[])}return s.length>1&&s.sort((c,d)=>c.score-d.score),[s.map(({handler:c,params:d})=>[c,d])]}},z=new WeakMap,T=new WeakMap,Q=new WeakMap,le=new WeakMap,w=new WeakMap,H=new WeakSet,V=function(e,t,s,r){const a=[];for(let i=0,n=o(e,z).length;i<n;i++){const l=o(e,z)[i],c=l[t]||l[v],d={};if(c!==void 0&&(c.params=Object.create(null),a.push(c),s!==me||r&&r!==me))for(let u=0,f=c.possibleKeys.length;u<f;u++){const p=c.possibleKeys[u],_=d[c.score];c.params[p]=r!=null&&r[p]&&!_?r[p]:s[p]??(r==null?void 0:r[p]),d[c.score]=!0}}return a},Qe),Z,Ze,Zt=(Ze=class{constructor(){m(this,"name","TrieRouter");g(this,Z);h(this,Z,new bt)}add(e,t,s){const r=st(t);if(r){for(let a=0,i=r.length;a<i;a++)o(this,Z).insert(e,r[a],s);return}o(this,Z).insert(e,t,s)}match(e,t){return o(this,Z).search(e,t)}},Z=new WeakMap,Ze),Et=class extends ut{constructor(e={}){super(e),this.router=e.router??new Qt({routers:[new Jt,new Zt]})}},es=e=>{const s={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},r=(i=>typeof i=="string"?i==="*"?()=>i:n=>i===n?n:null:typeof i=="function"?i:n=>i.includes(n)?n:null)(s.origin),a=(i=>typeof i=="function"?i:Array.isArray(i)?()=>i:()=>[])(s.allowMethods);return async function(n,l){var u;function c(f,p){n.res.headers.set(f,p)}const d=await r(n.req.header("origin")||"",n);if(d&&c("Access-Control-Allow-Origin",d),s.origin!=="*"){const f=n.req.header("Vary");f?c("Vary",f):c("Vary","Origin")}if(s.credentials&&c("Access-Control-Allow-Credentials","true"),(u=s.exposeHeaders)!=null&&u.length&&c("Access-Control-Expose-Headers",s.exposeHeaders.join(",")),n.req.method==="OPTIONS"){s.maxAge!=null&&c("Access-Control-Max-Age",s.maxAge.toString());const f=await a(n.req.header("origin")||"",n);f.length&&c("Access-Control-Allow-Methods",f.join(","));let p=s.allowHeaders;if(!(p!=null&&p.length)){const _=n.req.header("Access-Control-Request-Headers");_&&(p=_.split(/\s*,\s*/))}return p!=null&&p.length&&(c("Access-Control-Allow-Headers",p.join(",")),n.res.headers.append("Vary","Access-Control-Request-Headers")),n.res.headers.delete("Content-Length"),n.res.headers.delete("Content-Type"),new Response(null,{headers:n.res.headers,status:204,statusText:"No Content"})}await l()}},ts=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,ke=(e,t=rs)=>{const s=/\.([a-zA-Z0-9]+?)$/,r=e.match(s);if(!r)return;let a=t[r[1]];return a&&a.startsWith("text")&&(a+="; charset=utf-8"),a},ss={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},rs=ss,as=(...e)=>{let t=e.filter(a=>a!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const s=t.split("/"),r=[];for(const a of s)a===".."&&r.length>0&&r.at(-1)!==".."?r.pop():a!=="."&&r.push(a);return r.join("/")||"."},xt={br:".br",zstd:".zst",gzip:".gz"},is=Object.keys(xt),ns="index.html",os=e=>{const t=e.root??"./",s=e.path,r=e.join??as;return async(a,i)=>{var u,f,p,_;if(a.finalized)return i();let n;if(e.path)n=e.path;else try{if(n=decodeURIComponent(a.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(n))throw new Error}catch{return await((u=e.onNotFound)==null?void 0:u.call(e,a.req.path,a)),i()}let l=r(t,!s&&e.rewriteRequestPath?e.rewriteRequestPath(n):n);e.isDir&&await e.isDir(l)&&(l=r(l,ns));const c=e.getContent;let d=await c(l,a);if(d instanceof Response)return a.newResponse(d.body,d);if(d){const C=e.mimes&&ke(l,e.mimes)||ke(l);if(a.header("Content-Type",C||"application/octet-stream"),e.precompressed&&(!C||ts.test(C))){const E=new Set((f=a.req.header("Accept-Encoding"))==null?void 0:f.split(",").map(x=>x.trim()));for(const x of is){if(!E.has(x))continue;const R=await c(l+xt[x],a);if(R){d=R,a.header("Content-Encoding",x),a.header("Vary","Accept-Encoding",{append:!0});break}}}return await((p=e.onFound)==null?void 0:p.call(e,l,a)),a.body(d)}await((_=e.onNotFound)==null?void 0:_.call(e,l,a)),await i()}},cs=async(e,t)=>{let s;t&&t.manifest?typeof t.manifest=="string"?s=JSON.parse(t.manifest):s=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?s=JSON.parse(__STATIC_CONTENT_MANIFEST):s=__STATIC_CONTENT_MANIFEST;let r;t&&t.namespace?r=t.namespace:r=__STATIC_CONTENT;const a=s[e]||e;if(!a)return null;const i=await r.get(a,{type:"stream"});return i||null},ls=e=>async function(s,r){return os({...e,getContent:async i=>cs(i,{manifest:e.manifest,namespace:e.namespace?e.namespace:s.env?s.env.__STATIC_CONTENT:void 0})})(s,r)},ds=e=>ls(e);const j=new Et;j.use("*",es({origin:["*"],allowHeaders:["Content-Type","Authorization"],allowMethods:["GET","POST","PUT","DELETE","OPTIONS"]}));j.use("/static/*",ds({root:"./public"}));const ue=async e=>{await e.prepare(`CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_number TEXT UNIQUE NOT NULL,
    name TEXT,
    species TEXT NOT NULL CHECK (species IN ('cattle', 'buffalo')),
    breed TEXT,
    age_months INTEGER,
    sex TEXT CHECK (sex IN ('male', 'female')),
    owner_name TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run(),await e.prepare(`CREATE TABLE IF NOT EXISTS body_measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id INTEGER NOT NULL,
    body_length REAL,
    height_at_withers REAL,
    chest_width REAL,
    chest_depth REAL,
    chest_girth REAL,
    rump_length REAL,
    rump_width REAL,
    pin_bone_width REAL,
    thurl_width REAL,
    rump_angle REAL,
    foot_angle REAL,
    rear_leg_set REAL,
    frame_score REAL,
    capacity_score REAL,
    feet_legs_score REAL,
    dairy_character_score REAL,
    image_url TEXT,
    image_width INTEGER,
    image_height INTEGER,
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
  )`).run(),await e.prepare(`CREATE TABLE IF NOT EXISTS classification_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id INTEGER NOT NULL,
    measurement_id INTEGER NOT NULL,
    frame_score INTEGER CHECK (frame_score >= 0 AND frame_score <= 100),
    dairy_capacity_score INTEGER CHECK (dairy_capacity_score >= 0 AND dairy_capacity_score <= 100),
    feet_legs_score INTEGER CHECK (feet_legs_score >= 0 AND feet_legs_score <= 100),
    mammary_system_score INTEGER CHECK (mammary_system_score >= 0 AND mammary_system_score <= 100),
    overall_grade TEXT CHECK (overall_grade IN ('Excellent', 'Very Good', 'Good', 'Fair', 'Poor')),
    final_score INTEGER CHECK (final_score >= 0 AND final_score <= 100),
    measurement_confidence REAL,
    classification_confidence REAL,
    reviewed_by TEXT,
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    bpa_sync_status TEXT DEFAULT 'pending' CHECK (bpa_sync_status IN ('pending', 'synced', 'failed')),
    bpa_reference_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
    FOREIGN KEY (measurement_id) REFERENCES body_measurements(id) ON DELETE CASCADE
  )`).run()};j.get("/api/animals",async e=>{var s;const{env:t}=e;try{await ue(t.DB);const r=await t.DB.prepare(`
      SELECT a.*, 
             COUNT(cr.id) as classification_count,
             MAX(cr.final_score) as best_score,
             MAX(cr.created_at) as last_classification
      FROM animals a
      LEFT JOIN classification_results cr ON a.id = cr.animal_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `).all();return e.json({success:!0,data:r.results,count:((s=r.results)==null?void 0:s.length)||0})}catch(r){return e.json({success:!1,error:"Failed to fetch animals",details:r.message},500)}});j.get("/api/animals/:id",async e=>{const{env:t}=e,s=e.req.param("id");try{await ue(t.DB);const r=await t.DB.prepare(`
      SELECT * FROM animals WHERE id = ?
    `).bind(s).first();if(!r)return e.json({success:!1,error:"Animal not found"},404);const a=await t.DB.prepare(`
      SELECT * FROM body_measurements WHERE animal_id = ? ORDER BY created_at DESC
    `).bind(s).all(),i=await t.DB.prepare(`
      SELECT * FROM classification_results WHERE animal_id = ? ORDER BY created_at DESC
    `).bind(s).all();return e.json({success:!0,data:{animal:r,measurements:a.results||[],classifications:i.results||[]}})}catch(r){return e.json({success:!1,error:"Failed to fetch animal details",details:r.message},500)}});j.post("/api/animals",async e=>{const{env:t}=e;try{await ue(t.DB);const s=await e.req.json(),{tag_number:r,name:a,species:i,breed:n,age_months:l,sex:c,owner_name:d,location:u}=s;if(!r||!i)return e.json({success:!1,error:"Tag number and species are required"},400);const f=await t.DB.prepare(`
      INSERT INTO animals (tag_number, name, species, breed, age_months, sex, owner_name, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(r,a,i,n,l,c,d,u).run();return e.json({success:!0,data:{id:f.meta.last_row_id,...s}})}catch(s){return e.json({success:!1,error:"Failed to create animal record",details:s.message},500)}});j.post("/api/analyze-image",async e=>{const{env:t}=e;try{const s=await e.req.json(),{image_data:r,animal_id:a}=s;if(!r||!a)return e.json({success:!1,error:"Image data and animal ID are required"},400);const i={body_length:Math.random()*50+150,height_at_withers:Math.random()*30+120,chest_width:Math.random()*15+40,chest_depth:Math.random()*20+60,chest_girth:Math.random()*50+180,rump_length:Math.random()*15+45,rump_width:Math.random()*15+40,pin_bone_width:Math.random()*5+15,thurl_width:Math.random()*15+35,rump_angle:Math.random()*15+15,foot_angle:Math.random()*15+35,rear_leg_set:Math.random()*10+10,confidence_score:Math.random()*.3+.7},n=(i.body_length/200+i.height_at_withers/150)*50,l=(i.chest_width/55+i.chest_depth/80)*50,c=100-Math.abs(i.foot_angle-42.5)/42.5*20,d=i.confidence_score*100,u=await t.DB.prepare(`
      INSERT INTO body_measurements (
        animal_id, body_length, height_at_withers, chest_width, chest_depth, chest_girth,
        rump_length, rump_width, pin_bone_width, thurl_width, rump_angle, foot_angle,
        rear_leg_set, frame_score, capacity_score, feet_legs_score, dairy_character_score,
        confidence_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(a,...Object.values(i),n,l,c,d).run();return e.json({success:!0,data:{measurement_id:u.meta.last_row_id,measurements:{...i,frame_score:n,capacity_score:l,feet_legs_score:c,dairy_character_score:d}}})}catch(s){return e.json({success:!1,error:"Failed to analyze image",details:s.message},500)}});j.post("/api/classify/:measurementId",async e=>{const{env:t}=e,s=e.req.param("measurementId");try{await ue(t.DB);const r=await t.DB.prepare(`
      SELECT bm.*, a.species, a.breed 
      FROM body_measurements bm 
      JOIN animals a ON bm.animal_id = a.id 
      WHERE bm.id = ?
    `).bind(s).first();if(!r)return e.json({success:!1,error:"Measurement not found"},404);const a={frame_score:Math.round(r.frame_score||75),dairy_capacity_score:Math.round(r.capacity_score||75),feet_legs_score:Math.round(r.feet_legs_score||75),mammary_system_score:Math.round(r.dairy_character_score||75)},i=Math.round((a.frame_score+a.dairy_capacity_score+a.feet_legs_score+a.mammary_system_score)/4);let n="Poor";i>=90?n="Excellent":i>=80?n="Very Good":i>=70?n="Good":i>=60&&(n="Fair");const l=await t.DB.prepare(`
      INSERT INTO classification_results (
        animal_id, measurement_id, frame_score, dairy_capacity_score, 
        feet_legs_score, mammary_system_score, overall_grade, final_score,
        measurement_confidence, classification_confidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(r.animal_id,s,a.frame_score,a.dairy_capacity_score,a.feet_legs_score,a.mammary_system_score,n,i,r.confidence_score,r.confidence_score*.95).run();return e.json({success:!0,data:{classification_id:l.meta.last_row_id,...a,overall_grade:n,final_score:i,confidence:r.confidence_score*.95}})}catch(r){return e.json({success:!1,error:"Failed to generate classification",details:r.message},500)}});j.get("/api/bpa/export/:animalId",async e=>{const{env:t}=e,s=e.req.param("animalId");try{await ue(t.DB);const r=await t.DB.prepare(`
      SELECT 
        a.tag_number, a.name, a.species, a.breed, a.age_months, a.sex,
        a.owner_name, a.location,
        cr.frame_score, cr.dairy_capacity_score, cr.feet_legs_score,
        cr.mammary_system_score, cr.overall_grade, cr.final_score,
        cr.classification_confidence, cr.created_at as classification_date
      FROM animals a
      JOIN classification_results cr ON a.id = cr.animal_id
      WHERE a.id = ? AND cr.review_status = 'approved'
      ORDER BY cr.created_at DESC
      LIMIT 1
    `).bind(s).first();if(!r)return e.json({success:!1,error:"No approved classification found for this animal"},404);const a={animalDetails:{tagNumber:r.tag_number,animalName:r.name,species:r.species,breed:r.breed,age:r.age_months,sex:r.sex,ownerName:r.owner_name,location:r.location},classificationScores:{frameScore:r.frame_score,dairyCapacityScore:r.dairy_capacity_score,feetLegsScore:r.feet_legs_score,mammarySystemScore:r.mammary_system_score,overallGrade:r.overall_grade,finalScore:r.final_score},metadata:{classificationDate:r.classification_date,confidence:r.classification_confidence,systemVersion:"ATC-AI-v1.0",exportDate:new Date().toISOString()}};return e.json({success:!0,data:a})}catch(r){return e.json({success:!1,error:"Failed to export BPA data",details:r.message},500)}});j.get("/api/dashboard/stats",async e=>{const{env:t}=e;try{await ue(t.DB);const s=await t.DB.prepare(`
      SELECT COUNT(*) as count FROM animals
    `).first(),r=await t.DB.prepare(`
      SELECT COUNT(*) as count FROM classification_results
    `).first(),a=await t.DB.prepare(`
      SELECT COUNT(*) as count FROM classification_results WHERE review_status = 'pending'
    `).first(),i=await t.DB.prepare(`
      SELECT overall_grade, COUNT(*) as count 
      FROM classification_results 
      GROUP BY overall_grade
    `).all();return e.json({success:!0,data:{totalAnimals:(s==null?void 0:s.count)||0,totalClassifications:(r==null?void 0:r.count)||0,pendingReviews:(a==null?void 0:a.count)||0,gradeDistribution:i.results||[]}})}catch(s){return e.json({success:!1,error:"Failed to fetch dashboard stats",details:s.message},500)}});j.get("/",e=>e.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Animal Type Classification System - Cattle & Buffalo AI Assessment</title>
        <meta name="description" content="AI-powered Animal Type Classification system for cattle and buffaloes under Rashtriya Gokul Mission">
        <script src="https://cdn.tailwindcss.com"><\/script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div id="app">
            <!-- Navigation -->
            <nav class="bg-green-600 text-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center">
                            <i class="fas fa-cow text-2xl mr-3"></i>
                            <div>
                                <h1 class="text-xl font-bold">Animal Type Classification System</h1>
                                <p class="text-sm text-green-100">Rashtriya Gokul Mission - AI Assessment</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span class="bg-green-700 px-3 py-1 rounded-full text-sm">Field Version</span>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Dashboard Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-cow text-3xl text-blue-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Total Animals</p>
                                <p class="text-2xl font-bold text-gray-900" id="total-animals">-</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-brain text-3xl text-green-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">AI Classifications</p>
                                <p class="text-2xl font-bold text-gray-900" id="total-classifications">-</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-clock text-3xl text-yellow-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Pending Reviews</p>
                                <p class="text-2xl font-bold text-gray-900" id="pending-reviews">-</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-star text-3xl text-purple-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Excellent Grade</p>
                                <p class="text-2xl font-bold text-gray-900" id="excellent-count">-</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Interface Tabs -->
                <div class="bg-white rounded-lg shadow">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex">
                            <button class="tab-button active" data-tab="classify">
                                <i class="fas fa-camera mr-2"></i>New Classification
                            </button>
                            <button class="tab-button" data-tab="animals">
                                <i class="fas fa-list mr-2"></i>Animal Records
                            </button>
                            <button class="tab-button" data-tab="results">
                                <i class="fas fa-chart-bar mr-2"></i>Results
                            </button>
                            <button class="tab-button" data-tab="bpa">
                                <i class="fas fa-sync mr-2"></i>BPA Integration
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- New Classification Tab -->
                        <div id="tab-classify" class="tab-content">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">AI-Powered Animal Classification</h2>
                            
                            <!-- Animal Registration Form -->
                            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 class="text-lg font-semibold mb-4">1. Animal Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Tag Number *</label>
                                        <input type="text" id="tag-number" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Animal Name</label>
                                        <input type="text" id="animal-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                                        <select id="species" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="">Select Species</option>
                                            <option value="cattle">Cattle</option>
                                            <option value="buffalo">Buffalo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                                        <select id="breed" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="">Select Breed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Age (months)</label>
                                        <input type="number" id="age-months" min="12" max="180" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                                        <select id="sex" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="">Select Sex</option>
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                                        <input type="text" id="owner-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input type="text" id="location" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                </div>
                            </div>

                            <!-- Image Upload Section -->
                            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 class="text-lg font-semibold mb-4">2. Animal Image Analysis</h3>
                                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                                    <p class="text-lg text-gray-600 mb-2">Upload Animal Image for AI Analysis</p>
                                    <p class="text-sm text-gray-500 mb-4">Supported formats: JPG, PNG, WEBP (Max 10MB)</p>
                                    <input type="file" id="image-upload" accept="image/*" class="hidden">
                                    <button onclick="document.getElementById('image-upload').click()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                                        <i class="fas fa-camera mr-2"></i>Choose Image
                                    </button>
                                    <div id="image-preview" class="mt-4 hidden">
                                        <img id="preview-img" class="max-h-64 mx-auto rounded-lg border">
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex space-x-4">
                                <button id="register-animal-btn" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                    <i class="fas fa-plus mr-2"></i>Register Animal
                                </button>
                                <button id="analyze-image-btn" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50" disabled>
                                    <i class="fas fa-brain mr-2"></i>Analyze Image with AI
                                </button>
                                <button id="generate-classification-btn" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50" disabled>
                                    <i class="fas fa-star mr-2"></i>Generate Classification
                                </button>
                            </div>

                            <!-- Results Display -->
                            <div id="analysis-results" class="mt-8 hidden">
                                <!-- Results will be displayed here -->
                            </div>
                        </div>

                        <!-- Animal Records Tab -->
                        <div id="tab-animals" class="tab-content hidden">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Animal Records</h2>
                            <div id="animals-list">
                                <!-- Animals list will be loaded here -->
                            </div>
                        </div>

                        <!-- Results Tab -->
                        <div id="tab-results" class="tab-content hidden">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Classification Results</h2>
                            <div id="results-list">
                                <!-- Classification results will be loaded here -->
                            </div>
                        </div>

                        <!-- BPA Integration Tab -->
                        <div id="tab-bpa" class="tab-content hidden">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Bharat Pashudhan App Integration</h2>
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <i class="fas fa-info-circle text-blue-500 text-xl mr-3"></i>
                                    <h3 class="text-lg font-semibold text-blue-900">BPA Data Export</h3>
                                </div>
                                <p class="text-blue-800 mb-4">Export approved classification data in BPA-compatible format for seamless integration.</p>
                                <div id="bpa-export-section">
                                    <!-- BPA export interface will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Modal -->
        <div id="loading-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-lg p-8 text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-green-600 mb-4"></i>
                <p class="text-lg font-semibold">Processing...</p>
                <p class="text-gray-600" id="loading-text">Please wait while AI analyzes the image</p>
            </div>
        </div>

        <script src="/static/app.js"><\/script>
    </body>
    </html>
  `));const qe=new Et,us=Object.assign({"/src/index.tsx":j});let _t=!1;for(const[,e]of Object.entries(us))e&&(qe.all("*",t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),qe.notFound(t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),_t=!0);if(!_t)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");export{qe as default};
