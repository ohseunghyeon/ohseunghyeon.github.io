(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{dzFB:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n),o=a("Wbzz"),l=a("vOnD"),i=a("p3AD");var c=Object(l.a)(o.Link).withConfig({displayName:"PostFrontmatter__CategoryLink",componentId:"sc-16zmhqv-0"})(['opacity:0.75;::before{content:" • ";}br{display:none;}@media screen and (max-width:768px){::before{display:none;}br{display:inline;}}']);t.a=function(e){var t,a,n=e.date,o=e.timeToRead,l=e.category,m=e.isInPost,s=function(e){var t=e.children;return m?r.a.createElement("p",{style:Object.assign({},Object(i.b)(-.2),{display:"block",marginBottom:Object(i.a)(1)})}," ",t):r.a.createElement("small",null,t)};return r.a.createElement(s,null,n," • "+(t=o,(a=Math.round(t/5))>5?new Array(Math.round(a/Math.E)).fill("🍱").join("")+" "+t+" min read":new Array(a||1).fill("☕️").join("")+" "+t+" min read"),l&&r.a.createElement(c,{to:"/"+l},r.a.createElement("br",null),l))}},kwyN:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",(function(){return d}));var n=a("q1tI"),r=a.n(n),o=a("Wbzz"),l=a("7oih"),i=a("9CUm"),c=a("ooDn"),m=a("dzFB"),s=a("p3AD");t.default=function(e){var t=e.data,a=e.location,n=e.pageContext,d=t.site.siteMetadata.title,u=t.allMarkdownRemark.edges,p=n.category.slice(2,-1);return r.a.createElement(l.a,{location:a,title:d},r.a.createElement(i.a,{title:p}),r.a.createElement(c.a,{title:p}),u.map((function(e){var t=e.node,a=t.frontmatter.title||t.fields.slug;return r.a.createElement("article",{key:t.fields.slug},r.a.createElement("header",null,r.a.createElement("h3",{style:{marginBottom:Object(s.a)(1/4)}},r.a.createElement(o.Link,{style:{boxShadow:"none"},to:t.fields.slug},a)),r.a.createElement(m.a,{date:t.frontmatter.date,timeToRead:t.timeToRead})),r.a.createElement("section",null,r.a.createElement("p",{dangerouslySetInnerHTML:{__html:t.frontmatter.description||t.excerpt}})))})))};var d="2861549404"},ooDn:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n);t.a=function(e){var t=e.title;return r.a.createElement("h2",{style:{textTransform:"uppercase",borderBottom:"0"}},t)}}}]);
//# sourceMappingURL=component---src-templates-category-page-js-75903418f104fef60dff.js.map