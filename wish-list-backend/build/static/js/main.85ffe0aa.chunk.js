(this["webpackJsonpwish-list-frontend"]=this["webpackJsonpwish-list-frontend"]||[]).push([[0],{50:function(e,t,n){},56:function(e,t,n){"use strict";n.r(t);var c=n(1),r=n(25),i=n.n(r),a=n(0),s=n(9),j=n(26),u=n(2),l=n(11),d=n.n(l),o="http://localhost:3003/api/wishes/",b=function(){return d.a.get(o).then((function(e){return e.data}))},h=function(e){return d.a.post(o,e)},O=function(e,t){return d.a.put("".concat(o,"/").concat(e),t)},x=function(e){return d.a.delete("".concat(o,"/").concat(e))},f=(n(50),function(e){return Object(c.jsxs)("form",{onSubmit:e.addWish,children:[Object(c.jsxs)("div",{children:[Object(c.jsx)("h2",{className:"main-title",children:"Add wish"}),"name:","\xa0",Object(c.jsx)("input",{value:e.nameHolder,onChange:e.nameHandler}),Object(c.jsx)("br",{}),"description:","\xa0",Object(c.jsx)("input",{value:e.descriptionHolder,onChange:e.descriptionHandler}),Object(c.jsx)("br",{}),"url:","\xa0",Object(c.jsx)("input",{value:e.urlHolder,onChange:e.urlHandler})]}),Object(c.jsx)("div",{children:Object(c.jsx)("button",{type:"submit",children:"Add"})})]})}),p=function(e){return Object(c.jsx)("div",{className:"display",children:e.text})},m=function(e,t,n,r){return Object(c.jsxs)("tr",{className:1===e.taken?"taken-row":"untaken-row",children:[Object(c.jsx)("td",{children:e.name}),Object(c.jsx)("td",{onMouseOver:function(){return r(e.description)},children:e.description}),Object(c.jsx)("td",{className:"url",children:Object(c.jsx)("a",{href:e.url,target:"_blank",children:e.url})}),Object(c.jsx)("td",{children:Object(c.jsx)("button",{onClick:function(){return t(e.id)},children:n})})]})},v=function(){var e=Object(a.useState)([]),t=Object(s.a)(e,2),n=t[0],r=t[1];Object(a.useEffect)((function(){console.log("note: effect is run only after rendering"),b().then((function(e){return r(e)}))}),[]);var i=function(e){var t=n.filter((function(t){return t.id!==e}));r(t),x(e)},l=Object(a.useState)(""),d=Object(s.a)(l,2),o=d[0],v=d[1],k=Object(a.useState)(""),g=Object(s.a)(k,2),H=g[0],w=g[1],N=Object(a.useState)(""),S=Object(s.a)(N,2),y=S[0],C=S[1],A=function(e){r(n.map((function(t){return function(t){return t.id===e&&(t.taken=1-t.taken,O(e,t)),t}(t)})))},D=Object(a.useState)(""),E=Object(s.a)(D,2),J=E[0],T=E[1],W=Object(a.useState)(""),B=Object(s.a)(W,2),F=B[0],I=B[1],L=function(e){clearTimeout(F),T(e),I(setTimeout((function(){return T("")}),1e4))};return Object(c.jsx)(j.a,{children:Object(c.jsxs)("div",{children:[Object(c.jsx)(u.c,{children:Object(c.jsx)(u.a,{path:"/admin",children:Object(c.jsx)(f,{addWish:function(e){var t,c,i,a,s;e.preventDefault(),h((t=o,c=H,i=y,a=0,{key:s,id:s,name:t,description:c,url:i,taken:a})).then((function(e){return r(n.concat(e.data))})),console.log("latest wish not for console?",n),v(""),w(""),C("")},nameHolder:o,nameHandler:function(e){return v(e.target.value)},descriptionHandler:function(e){return w(e.target.value)},descriptionHolder:H,urlHandler:function(e){return C(e.target.value)},urlHolder:y})})}),Object(c.jsx)("h1",{className:"main-title",children:"Christmas wish list 2020"}),Object(c.jsxs)("table",{className:"the-table",children:[Object(c.jsx)("thead",{children:Object(c.jsxs)("tr",{children:[Object(c.jsx)("th",{children:"Name"}),Object(c.jsx)("th",{children:"Description"}),Object(c.jsx)("th",{children:"URL"}),Object(c.jsx)("th",{children:"Function"})]})}),Object(c.jsx)("tbody",{children:Object(c.jsxs)(u.c,{children:[Object(c.jsx)(u.a,{path:"/admin",children:n.map((function(e){return m(e,i,"delete",T)}))}),Object(c.jsx)(u.a,{path:"/",children:n.map((function(e){return m(e,A,0===e.taken?"take":"untake",L)}))})]})})]}),Object(c.jsxs)(u.c,{children:[Object(c.jsx)(u.a,{path:"/admin"}),Object(c.jsx)(u.a,{path:"/",children:Object(c.jsx)(p,{text:J})})]})]})})};i.a.render(Object(c.jsx)(v,{}),document.getElementById("root"))}},[[56,1,2]]]);
//# sourceMappingURL=main.85ffe0aa.chunk.js.map