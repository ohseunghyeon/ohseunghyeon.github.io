(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{249:function(e,t,a){"use strict";a.r(t);var r=a(0),i=a.n(r),n=a(42),s=(a(251),a(253)),o=a(254),l=a.n(o),d=a(55),c=function(){var e=s.data,t=e.site.siteMetadata,a=t.author,r=t.social;return i.a.createElement("div",{style:{display:"flex",marginBottom:Object(d.a)(2.5)}},i.a.createElement(l.a,{fixed:e.avatar.childImageSharp.fixed,alt:a,style:{marginRight:Object(d.a)(.5),marginBottom:0,minWidth:50,borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),i.a.createElement("p",{style:{display:"flex",flexDirection:"column"}},i.a.createElement("span",null,"Code, Lazy, Cat."),i.a.createElement("a",{href:"https://github.com/"+r.github,target:"_blank",rel:"noopener noreferrer"},a)))},u=a(242),f=a(241),p=a(243),g=(a(9),a(5),a(2),a(15),function(){var e=i.a.createRef();return Object(r.useEffect)((function(){var t=document.createElement("script"),a={src:"https://utteranc.es/client.js",repo:"ohseunghyeon/ohseunghyeon.github.io",async:!0,"issue-term":"pathname",crossorigin:"anonymous"};Object.keys(a).forEach((function(e){t.setAttribute(e,a[e])})),e.current.appendChild(t)}),[e]),i.a.createElement("div",{ref:e})});a.d(t,"pageQuery",(function(){return h}));var m=function(e){var t,a;function r(){return e.apply(this,arguments)||this}return a=e,(t=r).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a,r.prototype.render=function(){var e=this.props.data.markdownRemark,t=this.props.data.site.siteMetadata.title,a=this.props.pageContext,r=a.previous,s=a.next;return i.a.createElement(u.a,{location:this.props.location,title:t},i.a.createElement(f.a,{title:e.frontmatter.title,description:e.frontmatter.description||e.excerpt}),i.a.createElement("article",null,i.a.createElement("header",null,i.a.createElement("h1",{style:{marginTop:Object(d.a)(2),marginBottom:0}},e.frontmatter.title),i.a.createElement(p.a,{date:e.frontmatter.date,timeToRead:e.timeToRead,category:e.frontmatter.category,isInPost:!0})),i.a.createElement("section",{dangerouslySetInnerHTML:{__html:e.html}}),i.a.createElement("hr",{style:{marginBottom:Object(d.a)(1)}}),i.a.createElement("footer",null,i.a.createElement(c,null))),i.a.createElement("nav",null,i.a.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},i.a.createElement("li",null,r&&i.a.createElement(n.Link,{to:r.fields.slug,rel:"prev"},"← ",r.frontmatter.title)),i.a.createElement("li",null,s&&i.a.createElement(n.Link,{to:s.fields.slug,rel:"next"},s.frontmatter.title," →")))),i.a.createElement(g,null))},r}(i.a.Component),h=(t.default=m,"1906704608")},251:function(e,t,a){"use strict";a(252)("fixed",(function(e){return function(){return e(this,"tt","","")}}))},252:function(e,t,a){var r=a(1),i=a(12),n=a(47),s=/"/g,o=function(e,t,a,r){var i=String(n(e)),o="<"+t;return""!==a&&(o+=" "+a+'="'+String(r).replace(s,"&quot;")+'"'),o+">"+i+"</"+t+">"};e.exports=function(e,t){var a={};a[e]=t(o),r(r.P+r.F*i((function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3})),"String",a)}},253:function(e){e.exports=JSON.parse('{"data":{"avatar":{"childImageSharp":{"fixed":{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsSAAALEgHS3X78AAABhklEQVQ4y42U6U4CQRCEeUd9G30b5Scaw3+DCYmESEBCCJecEjnkCAoqCp+UzWS5dqWTyfb29FR3T9VuiCBbLref/8VXFjoabDqFXg/e3nzBggE3Dw0GUCpBIgH5PHx9efs7wMEdutVqwc0NnJ5AsQgfH/s5RwPKKhW4vIDrK+s24C5DBwGcv1jY+3gM7faquwKk0+Zvdrk38i6Qn2n0ZBKyWbi78wr6dujs8xNGI2g24enJYp2OESOQ2QweHy3nIKALSBK6L4E0GjCZQKFgIGJWe+/vFq/V9q9pDzCXswObJvD53HyBaNR4HMpl+PkJ6FDLjffyAsOhx7AOigT5WvU6vL6ahHY0GdrSkgN8ePB8CVnW7XoxmYC05wofvEMlqLpYzGTM12giQ0VEhMgRaZKO8p6fjSR9mlsdyvr99Sd2D6mUFbi9hUgEolGIxaBaNRDpMRy2fKlBBf4AXYdiVUubOtTtWGV38Yc0eX7mSWeN4wF+f3tC9ftJaN/laEQ1oA5FzjrvF8Yj2iYSn3e6AAAAAElFTkSuQmCC","width":50,"height":50,"src":"/static/79f86cb870b95b8d92f7a5cf407e7ad4/352e5/profile-pic.png","srcSet":"/static/79f86cb870b95b8d92f7a5cf407e7ad4/352e5/profile-pic.png 1x,\\n/static/79f86cb870b95b8d92f7a5cf407e7ad4/aae31/profile-pic.png 1.5x,\\n/static/79f86cb870b95b8d92f7a5cf407e7ad4/47c2b/profile-pic.png 2x"}}},"site":{"siteMetadata":{"author":"Oh SeungHyeon","social":{"github":"ohseunghyeon"}}}}}')},254:function(e,t,a){"use strict";a(9),a(5),a(2),a(57),a(165),a(251);var r=a(25);t.__esModule=!0,t.default=void 0;var i,n=r(a(89)),s=r(a(88)),o=r(a(163)),l=r(a(164)),d=r(a(0)),c=r(a(48)),u=function(e){var t=(0,l.default)({},e),a=t.resolutions,r=t.sizes,i=t.critical;return a&&(t.fixed=a,delete t.resolutions),r&&(t.fluid=r,delete t.sizes),i&&(t.loading="eager"),t.fluid&&(t.fluid=E([].concat(t.fluid))),t.fixed&&(t.fixed=E([].concat(t.fixed))),t},f=function(e){var t=e.fluid,a=e.fixed;return(t&&t[0]||a&&a[0]).src},p=Object.create({}),g=function(e){var t=u(e),a=f(t);return p[a]||!1},m="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,h="undefined"!=typeof window,b=h&&window.IntersectionObserver,y=new WeakMap;function S(e){return e.map((function(e){var t=e.src,a=e.srcSet,r=e.srcSetWebp,i=e.media,n=e.sizes;return d.default.createElement(d.default.Fragment,{key:t},r&&d.default.createElement("source",{type:"image/webp",media:i,srcSet:r,sizes:n}),d.default.createElement("source",{media:i,srcSet:a,sizes:n}))}))}function E(e){var t=[],a=[];return e.forEach((function(e){return(e.media?t:a).push(e)})),[].concat(t,a)}function v(e){return e.map((function(e){var t=e.src,a=e.media,r=e.tracedSVG;return d.default.createElement("source",{key:t,media:a,srcSet:r})}))}function w(e){return e.map((function(e){var t=e.src,a=e.media,r=e.base64;return d.default.createElement("source",{key:t,media:a,srcSet:r})}))}function L(e,t){var a=e.srcSet,r=e.srcSetWebp,i=e.media,n=e.sizes;return"<source "+(t?"type='image/webp' ":"")+(i?'media="'+i+'" ':"")+'srcset="'+(t?r:a)+'" '+(n?'sizes="'+n+'" ':"")+"/>"}var C=function(e,t){var a=(void 0===i&&"undefined"!=typeof window&&window.IntersectionObserver&&(i=new window.IntersectionObserver((function(e){e.forEach((function(e){if(y.has(e.target)){var t=y.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(i.unobserve(e.target),y.delete(e.target),t())}}))}),{rootMargin:"200px"})),i);return a&&(a.observe(e),y.set(e,t)),function(){a.unobserve(e),y.delete(e)}},A=function(e){var t=e.src?'src="'+e.src+'" ':'src="" ',a=e.sizes?'sizes="'+e.sizes+'" ':"",r=e.srcSet?'srcset="'+e.srcSet+'" ':"",i=e.title?'title="'+e.title+'" ':"",n=e.alt?'alt="'+e.alt+'" ':'alt="" ',s=e.width?'width="'+e.width+'" ':"",o=e.height?'height="'+e.height+'" ':"",l=e.crossOrigin?'crossorigin="'+e.crossOrigin+'" ':"",d=e.loading?'loading="'+e.loading+'" ':"",c=e.draggable?'draggable="'+e.draggable+'" ':"";return"<picture>"+e.imageVariants.map((function(e){return(e.srcSetWebp?L(e,!0):"")+L(e)})).join("")+"<img "+d+s+o+a+r+t+n+i+l+c+'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'},O=function(e){var t=e.src,a=e.imageVariants,r=e.generateSources,i=e.spreadProps,n=d.default.createElement(R,(0,l.default)({src:t},i));return a.length>1?d.default.createElement("picture",null,r(a),n):n},R=d.default.forwardRef((function(e,t){var a=e.sizes,r=e.srcSet,i=e.src,n=e.style,s=e.onLoad,c=e.onError,u=e.loading,f=e.draggable,p=(0,o.default)(e,["sizes","srcSet","src","style","onLoad","onError","loading","draggable"]);return d.default.createElement("img",(0,l.default)({sizes:a,srcSet:r,src:i},p,{onLoad:s,onError:c,ref:t,loading:u,draggable:f,style:(0,l.default)({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},n)}))}));R.propTypes={style:c.default.object,onError:c.default.func,onLoad:c.default.func};var I=function(e){function t(t){var a;(a=e.call(this,t)||this).seenBefore=h&&g(t),a.isCritical="eager"===t.loading||t.critical,a.addNoScript=!(a.isCritical&&!t.fadeIn),a.useIOSupport=!m&&b&&!a.isCritical&&!a.seenBefore;var r=a.isCritical||h&&(m||!a.useIOSupport);return a.state={isVisible:r,imgLoaded:!1,imgCached:!1,fadeIn:!a.seenBefore&&t.fadeIn},a.imageRef=d.default.createRef(),a.handleImageLoaded=a.handleImageLoaded.bind((0,n.default)(a)),a.handleRef=a.handleRef.bind((0,n.default)(a)),a}(0,s.default)(t,e);var a=t.prototype;return a.componentDidMount=function(){if(this.state.isVisible&&"function"==typeof this.props.onStartLoad&&this.props.onStartLoad({wasCached:g(this.props)}),this.isCritical){var e=this.imageRef.current;e&&e.complete&&this.handleImageLoaded()}},a.componentWillUnmount=function(){this.cleanUpListeners&&this.cleanUpListeners()},a.handleRef=function(e){var t=this;this.useIOSupport&&e&&(this.cleanUpListeners=C(e,(function(){var e=g(t.props);t.state.isVisible||"function"!=typeof t.props.onStartLoad||t.props.onStartLoad({wasCached:e}),t.setState({isVisible:!0},(function(){return t.setState({imgLoaded:e,imgCached:!!t.imageRef.current.currentSrc})}))})))},a.handleImageLoaded=function(){var e,t,a;e=this.props,t=u(e),a=f(t),p[a]=!0,this.setState({imgLoaded:!0}),this.props.onLoad&&this.props.onLoad()},a.render=function(){var e=u(this.props),t=e.title,a=e.alt,r=e.className,i=e.style,n=void 0===i?{}:i,s=e.imgStyle,o=void 0===s?{}:s,c=e.placeholderStyle,f=void 0===c?{}:c,p=e.placeholderClassName,g=e.fluid,m=e.fixed,h=e.backgroundColor,b=e.durationFadeIn,y=e.Tag,E=e.itemProp,L=e.loading,C=e.draggable,I=!1===this.state.fadeIn||this.state.imgLoaded,x=!0===this.state.fadeIn&&!this.state.imgCached,V=(0,l.default)({opacity:I?1:0,transition:x?"opacity "+b+"ms":"none"},o),j="boolean"==typeof h?"lightgray":h,z={transitionDelay:b+"ms"},k=(0,l.default)({opacity:this.state.imgLoaded?0:1},x&&z,{},o,{},f),B={title:t,alt:this.state.isVisible?"":a,style:k,className:p};if(g){var T=g,W=T[0];return d.default.createElement(y,{className:(r||"")+" gatsby-image-wrapper",style:(0,l.default)({position:"relative",overflow:"hidden"},n),ref:this.handleRef,key:"fluid-"+JSON.stringify(W.srcSet)},d.default.createElement(y,{style:{width:"100%",paddingBottom:100/W.aspectRatio+"%"}}),j&&d.default.createElement(y,{title:t,style:(0,l.default)({backgroundColor:j,position:"absolute",top:0,bottom:0,opacity:this.state.imgLoaded?0:1,right:0,left:0},x&&z)}),W.base64&&d.default.createElement(O,{src:W.base64,spreadProps:B,imageVariants:T,generateSources:w}),W.tracedSVG&&d.default.createElement(O,{src:W.tracedSVG,spreadProps:B,imageVariants:T,generateSources:v}),this.state.isVisible&&d.default.createElement("picture",null,S(T),d.default.createElement(R,{alt:a,title:t,sizes:W.sizes,src:W.src,crossOrigin:this.props.crossOrigin,srcSet:W.srcSet,style:V,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:E,loading:L,draggable:C})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:A((0,l.default)({alt:a,title:t,loading:L},W,{imageVariants:T}))}}))}if(m){var N=m,M=N[0],G=(0,l.default)({position:"relative",overflow:"hidden",display:"inline-block",width:M.width,height:M.height},n);return"inherit"===n.display&&delete G.display,d.default.createElement(y,{className:(r||"")+" gatsby-image-wrapper",style:G,ref:this.handleRef,key:"fixed-"+JSON.stringify(M.srcSet)},j&&d.default.createElement(y,{title:t,style:(0,l.default)({backgroundColor:j,width:M.width,opacity:this.state.imgLoaded?0:1,height:M.height},x&&z)}),M.base64&&d.default.createElement(O,{src:M.base64,spreadProps:B,imageVariants:N,generateSources:w}),M.tracedSVG&&d.default.createElement(O,{src:M.tracedSVG,spreadProps:B,imageVariants:N,generateSources:v}),this.state.isVisible&&d.default.createElement("picture",null,S(N),d.default.createElement(R,{alt:a,title:t,width:M.width,height:M.height,sizes:M.sizes,src:M.src,crossOrigin:this.props.crossOrigin,srcSet:M.srcSet,style:V,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:E,loading:L,draggable:C})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:A((0,l.default)({alt:a,title:t,loading:L},M,{imageVariants:N}))}}))}return null},t}(d.default.Component);I.defaultProps={fadeIn:!0,durationFadeIn:500,alt:"",Tag:"div",loading:"lazy"};var x=c.default.shape({width:c.default.number.isRequired,height:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string}),V=c.default.shape({aspectRatio:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,sizes:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string});I.propTypes={resolutions:x,sizes:V,fixed:c.default.oneOfType([x,c.default.arrayOf(x)]),fluid:c.default.oneOfType([V,c.default.arrayOf(V)]),fadeIn:c.default.bool,durationFadeIn:c.default.number,title:c.default.string,alt:c.default.string,className:c.default.oneOfType([c.default.string,c.default.object]),critical:c.default.bool,crossOrigin:c.default.oneOfType([c.default.string,c.default.bool]),style:c.default.object,imgStyle:c.default.object,placeholderStyle:c.default.object,placeholderClassName:c.default.string,backgroundColor:c.default.oneOfType([c.default.string,c.default.bool]),onLoad:c.default.func,onError:c.default.func,onStartLoad:c.default.func,Tag:c.default.string,itemProp:c.default.string,loading:c.default.oneOf(["auto","lazy","eager"]),draggable:c.default.bool};var j=I;t.default=j}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-e204351b640cedcff3de.js.map