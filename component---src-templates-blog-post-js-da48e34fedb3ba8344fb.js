(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{198:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",function(){return u});a(18);var r=a(0),n=a.n(r),i=a(204),o=a(210),s=a(207),l=a(208),d=a(202);var c=function(e){var t,a;function r(){return e.apply(this,arguments)||this}return a=e,(t=r).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a,r.prototype.render=function(){var e=this.props.data.markdownRemark,t=this.props.data.site.siteMetadata.title,a=this.props.pageContext,r=a.previous,c=a.next;return n.a.createElement(s.a,{location:this.props.location,title:t},n.a.createElement(l.a,{title:e.frontmatter.title,description:e.frontmatter.description||e.excerpt}),n.a.createElement("article",null,n.a.createElement("header",null,n.a.createElement("h1",{style:{marginTop:Object(d.a)(1),marginBottom:0}},e.frontmatter.title),n.a.createElement("p",{style:Object.assign({},Object(d.b)(-.2),{display:"block",marginBottom:Object(d.a)(1)})},e.frontmatter.date)),n.a.createElement("section",{dangerouslySetInnerHTML:{__html:e.html}}),n.a.createElement("hr",{style:{marginBottom:Object(d.a)(1)}}),n.a.createElement("footer",null,n.a.createElement(o.a,null))),n.a.createElement("nav",null,n.a.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},n.a.createElement("li",null,r&&n.a.createElement(i.a,{to:r.fields.slug,rel:"prev"},"← ",r.frontmatter.title)),n.a.createElement("li",null,c&&n.a.createElement(i.a,{to:c.fields.slug,rel:"next"},c.frontmatter.title," →")))))},r}(n.a.Component);t.default=c;var u="3654438753"},202:function(e,t,a){"use strict";a.d(t,"a",function(){return l}),a.d(t,"b",function(){return d});var r=a(214),n=a.n(r),i=a(215),o=a.n(i);o.a.overrideThemeStyles=function(){return{"a:hover":{textDecoration:"none"},"a.gatsby-resp-image-link":{boxShadow:"none",textDecoration:"none"}}},o.a.bodyFontFamily=["NanumGothic"],o.a.aFontFamily=["NanumGothic"];var s=new n.a(o.a);var l=s.rhythm,d=s.scale},203:function(e,t,a){var r;e.exports=(r=a(205))&&r.default||r},204:function(e,t,a){"use strict";var r=a(0),n=a.n(r),i=a(66),o=a.n(i);a.d(t,"a",function(){return o.a});a(203),a(9).default.enqueue,n.a.createContext({})},205:function(e,t,a){"use strict";a.r(t);a(18);var r=a(0),n=a.n(r),i=a(94);t.default=function(e){var t=e.location,a=e.pageResources;return a?n.a.createElement(i.a,Object.assign({location:t,pageResources:a},a.json)):null}},206:function(e,t,a){"use strict";a(211)("fixed",function(e){return function(){return e(this,"tt","","")}})},207:function(e,t,a){"use strict";a(18);var r=a(0),n=a.n(r),i=a(204),o=a(202);t.a=function(e){var t,a=e.location,r=e.title,s=e.children;return t="/"===a.pathname?n.a.createElement("h1",{style:Object.assign({},Object(o.b)(1.5),{marginBottom:Object(o.a)(1.5),marginTop:0})},n.a.createElement(i.a,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},r)):n.a.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",marginTop:0}},n.a.createElement(i.a,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},r)),n.a.createElement("div",{style:{marginLeft:"auto",marginRight:"auto",maxWidth:Object(o.a)(24),padding:Object(o.a)(1.5)+" "+Object(o.a)(.75)}},n.a.createElement("header",null,t),n.a.createElement("main",null,s),n.a.createElement("footer",{style:{marginTop:"4.375rem",paddingTop:"1.75rem"}},n.a.createElement("a",{href:"https://github.com/ohseunghyeon",target:"_blank",rel:"noopener noreferrer"},"github")))}},208:function(e,t,a){"use strict";var r=a(209),n=a(0),i=a.n(n),o=a(216),s=a.n(o);function l(e){var t=e.description,a=e.lang,n=e.meta,o=e.title,l=r.data.site,d=t||l.siteMetadata.description;return i.a.createElement(s.a,{htmlAttributes:{lang:a},title:o,titleTemplate:"%s | "+l.siteMetadata.title,meta:[{name:"description",content:d},{property:"og:title",content:o},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:l.siteMetadata.author},{name:"twitter:title",content:o},{name:"twitter:description",content:d}].concat(n)})}l.defaultProps={lang:"en",meta:[],description:""},t.a=l},209:function(e){e.exports={data:{site:{siteMetadata:{title:"Lazy Nyaong",description:"Code, Cat, Lazy",author:"Oh SeungHyeon"}}}}},210:function(e,t,a){"use strict";a(206);var r=a(212),n=a(0),i=a.n(n),o=a(213),s=a.n(o),l=a(202);t.a=function(){var e=r.data,t=e.site.siteMetadata,a=t.author,n=t.social;return i.a.createElement("div",{style:{display:"flex",marginBottom:Object(l.a)(2.5)}},i.a.createElement(s.a,{fixed:e.avatar.childImageSharp.fixed,alt:a,style:{marginRight:Object(l.a)(.5),marginBottom:0,minWidth:50,borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),i.a.createElement("p",{style:{maxWidth:"180px"}},"Code, be Lazy, be a cat."," ",i.a.createElement("a",{href:"https://github.com/"+n.github,target:"_blank",rel:"noopener noreferrer"},a)))}},211:function(e,t,a){var r=a(1),n=a(7),i=a(32),o=/"/g,s=function(e,t,a,r){var n=String(i(e)),s="<"+t;return""!==a&&(s+=" "+a+'="'+String(r).replace(o,"&quot;")+'"'),s+">"+n+"</"+t+">"};e.exports=function(e,t){var a={};a[e]=t(s),r(r.P+r.F*n(function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3}),"String",a)}},212:function(e){e.exports={data:{avatar:{childImageSharp:{fixed:{base64:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsSAAALEgHS3X78AAABhklEQVQ4y42U6U4CQRCEeUd9G30b5Scaw3+DCYmESEBCCJecEjnkCAoqCp+UzWS5dqWTyfb29FR3T9VuiCBbLref/8VXFjoabDqFXg/e3nzBggE3Dw0GUCpBIgH5PHx9efs7wMEdutVqwc0NnJ5AsQgfH/s5RwPKKhW4vIDrK+s24C5DBwGcv1jY+3gM7faquwKk0+Zvdrk38i6Qn2n0ZBKyWbi78wr6dujs8xNGI2g24enJYp2OESOQ2QweHy3nIKALSBK6L4E0GjCZQKFgIGJWe+/vFq/V9q9pDzCXswObJvD53HyBaNR4HMpl+PkJ6FDLjffyAsOhx7AOigT5WvU6vL6ahHY0GdrSkgN8ePB8CVnW7XoxmYC05wofvEMlqLpYzGTM12giQ0VEhMgRaZKO8p6fjSR9mlsdyvr99Sd2D6mUFbi9hUgEolGIxaBaNRDpMRy2fKlBBf4AXYdiVUubOtTtWGV38Yc0eX7mSWeN4wF+f3tC9ftJaN/laEQ1oA5FzjrvF8Yj2iYSn3e6AAAAAElFTkSuQmCC",width:50,height:50,src:"/static/79f86cb870b95b8d92f7a5cf407e7ad4/352e5/profile-pic.png",srcSet:"/static/79f86cb870b95b8d92f7a5cf407e7ad4/352e5/profile-pic.png 1x,\n/static/79f86cb870b95b8d92f7a5cf407e7ad4/aae31/profile-pic.png 1.5x,\n/static/79f86cb870b95b8d92f7a5cf407e7ad4/47c2b/profile-pic.png 2x"}}},site:{siteMetadata:{author:"Oh SeungHyeon",social:{github:"ohseunghyeon"}}}}}},213:function(e,t,a){"use strict";a(29),a(30),a(13),a(92),a(133),a(206);var r=a(14);t.__esModule=!0,t.default=void 0;var n,i=r(a(68)),o=r(a(71)),s=r(a(136)),l=r(a(137)),d=r(a(0)),c=r(a(52)),u=function(e){var t=(0,l.default)({},e),a=t.resolutions,r=t.sizes,n=t.critical;return a&&(t.fixed=a,delete t.resolutions),r&&(t.fluid=r,delete t.sizes),n&&(t.loading="eager"),t.fluid&&(t.fluid=S([].concat(t.fluid))),t.fixed&&(t.fixed=S([].concat(t.fixed))),t},f=function(e){var t=e.fluid,a=e.fixed;return(t&&t[0]||a&&a[0]).src},p=Object.create({}),g=function(e){var t=u(e),a=f(t);return p[a]||!1},m="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,h="undefined"!=typeof window,b=h&&window.IntersectionObserver,y=new WeakMap;function v(e){return e.map(function(e){var t=e.src,a=e.srcSet,r=e.srcSetWebp,n=e.media,i=e.sizes;return d.default.createElement(d.default.Fragment,{key:t},r&&d.default.createElement("source",{type:"image/webp",media:n,srcSet:r,sizes:i}),d.default.createElement("source",{media:n,srcSet:a,sizes:i}))})}function S(e){var t=[],a=[];return e.forEach(function(e){return(e.media?t:a).push(e)}),t.concat(a)}function E(e){return e.map(function(e){var t=e.src,a=e.media,r=e.tracedSVG;return d.default.createElement("source",{key:t,media:a,srcSet:r})})}function w(e){return e.map(function(e){var t=e.src,a=e.media,r=e.base64;return d.default.createElement("source",{key:t,media:a,srcSet:r})})}function O(e,t){var a=e.srcSet,r=e.srcSetWebp,n=e.media,i=e.sizes;return"<source "+(t?"type='image/webp' ":"")+(n?'media="'+n+'" ':"")+'srcset="'+(t?r:a)+'" '+(i?'sizes="'+i+'" ':"")+"/>"}var L=function(e,t){var a=(void 0===n&&"undefined"!=typeof window&&window.IntersectionObserver&&(n=new window.IntersectionObserver(function(e){e.forEach(function(e){if(y.has(e.target)){var t=y.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(n.unobserve(e.target),y.delete(e.target),t())}})},{rootMargin:"200px"})),n);return a&&(a.observe(e),y.set(e,t)),function(){a.unobserve(e),y.delete(e)}},x=function(e){var t=e.src?'src="'+e.src+'" ':'src="" ',a=e.sizes?'sizes="'+e.sizes+'" ':"",r=e.srcSet?'srcset="'+e.srcSet+'" ':"",n=e.title?'title="'+e.title+'" ':"",i=e.alt?'alt="'+e.alt+'" ':'alt="" ',o=e.width?'width="'+e.width+'" ':"",s=e.height?'height="'+e.height+'" ':"",l=e.crossOrigin?'crossorigin="'+e.crossOrigin+'" ':"",d=e.loading?'loading="'+e.loading+'" ':"",c=e.draggable?'draggable="'+e.draggable+'" ':"";return"<picture>"+e.imageVariants.map(function(e){return(e.srcSetWebp?O(e,!0):"")+O(e)}).join("")+"<img "+d+o+s+a+r+t+i+n+l+c+'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'},A=function(e){var t=e.src,a=e.imageVariants,r=e.generateSources,n=e.spreadProps,i=d.default.createElement(C,(0,l.default)({src:t},n));return a.length>1?d.default.createElement("picture",null,r(a),i):i},C=d.default.forwardRef(function(e,t){var a=e.sizes,r=e.srcSet,n=e.src,i=e.style,o=e.onLoad,c=e.onError,u=e.loading,f=e.draggable,p=(0,s.default)(e,["sizes","srcSet","src","style","onLoad","onError","loading","draggable"]);return d.default.createElement("img",(0,l.default)({sizes:a,srcSet:r,src:n},p,{onLoad:o,onError:c,ref:t,loading:u,draggable:f,style:(0,l.default)({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},i)}))});C.propTypes={style:c.default.object,onError:c.default.func,onLoad:c.default.func};var R=function(e){function t(t){var a;(a=e.call(this,t)||this).seenBefore=h&&g(t),a.addNoScript=!(t.critical&&!t.fadeIn),a.useIOSupport=!m&&b&&!t.critical&&!a.seenBefore;var r=t.critical||"eager"==t.loading||h&&(m||!a.useIOSupport);return a.state={isVisible:r,imgLoaded:!1,imgCached:!1,fadeIn:!a.seenBefore&&t.fadeIn},a.imageRef=d.default.createRef(),a.handleImageLoaded=a.handleImageLoaded.bind((0,o.default)((0,o.default)(a))),a.handleRef=a.handleRef.bind((0,o.default)((0,o.default)(a))),a}(0,i.default)(t,e);var a=t.prototype;return a.componentDidMount=function(){if(this.state.isVisible&&"function"==typeof this.props.onStartLoad&&this.props.onStartLoad({wasCached:g(this.props)}),this.props.critical){var e=this.imageRef.current;e&&e.complete&&this.handleImageLoaded()}},a.componentWillUnmount=function(){this.cleanUpListeners&&this.cleanUpListeners()},a.handleRef=function(e){var t=this;this.useIOSupport&&e&&(this.cleanUpListeners=L(e,function(){var e=g(t.props);t.state.isVisible||"function"!=typeof t.props.onStartLoad||t.props.onStartLoad({wasCached:e}),t.setState({isVisible:!0},function(){return t.setState({imgLoaded:e,imgCached:!!t.imageRef.current.currentSrc})})}))},a.handleImageLoaded=function(){var e,t,a;e=this.props,t=u(e),a=f(t),p[a]=!0,this.setState({imgLoaded:!0}),this.props.onLoad&&this.props.onLoad()},a.render=function(){var e=u(this.props),t=e.title,a=e.alt,r=e.className,n=e.style,i=void 0===n?{}:n,o=e.imgStyle,s=void 0===o?{}:o,c=e.placeholderStyle,f=void 0===c?{}:c,p=e.placeholderClassName,g=e.fluid,m=e.fixed,h=e.backgroundColor,b=e.durationFadeIn,y=e.Tag,S=e.itemProp,O=e.loading,L=e.draggable,R=!1===this.state.fadeIn||this.state.imgLoaded,j=!0===this.state.fadeIn&&!this.state.imgCached,I=(0,l.default)({opacity:R?1:0,transition:j?"opacity "+b+"ms":"none"},s),V="boolean"==typeof h?"lightgray":h,z={transitionDelay:b+"ms"},T=(0,l.default)({opacity:this.state.imgLoaded?0:1},j&&z,s,f),k={title:t,alt:this.state.isVisible?"":a,style:T,className:p};if(g){var B=g,M=B[0];return d.default.createElement(y,{className:(r||"")+" gatsby-image-wrapper",style:(0,l.default)({position:"relative",overflow:"hidden"},i),ref:this.handleRef,key:"fluid-"+JSON.stringify(M.srcSet)},d.default.createElement(y,{style:{width:"100%",paddingBottom:100/M.aspectRatio+"%"}}),V&&d.default.createElement(y,{title:t,style:(0,l.default)({backgroundColor:V,position:"absolute",top:0,bottom:0,opacity:this.state.imgLoaded?0:1,right:0,left:0},j&&z)}),M.base64&&d.default.createElement(A,{src:M.base64,spreadProps:k,imageVariants:B,generateSources:w}),M.tracedSVG&&d.default.createElement(A,{src:M.tracedSVG,spreadProps:k,imageVariants:B,generateSources:E}),this.state.isVisible&&d.default.createElement("picture",null,v(B),d.default.createElement(C,{alt:a,title:t,sizes:M.sizes,src:M.src,crossOrigin:this.props.crossOrigin,srcSet:M.srcSet,style:I,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:O,draggable:L})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:x((0,l.default)({alt:a,title:t,loading:O},M,{imageVariants:B}))}}))}if(m){var W=m,F=W[0],N=(0,l.default)({position:"relative",overflow:"hidden",display:"inline-block",width:F.width,height:F.height},i);return"inherit"===i.display&&delete N.display,d.default.createElement(y,{className:(r||"")+" gatsby-image-wrapper",style:N,ref:this.handleRef,key:"fixed-"+JSON.stringify(F.srcSet)},V&&d.default.createElement(y,{title:t,style:(0,l.default)({backgroundColor:V,width:F.width,opacity:this.state.imgLoaded?0:1,height:F.height},j&&z)}),F.base64&&d.default.createElement(A,{src:F.base64,spreadProps:k,imageVariants:W,generateSources:w}),F.tracedSVG&&d.default.createElement(A,{src:F.tracedSVG,spreadProps:k,imageVariants:W,generateSources:E}),this.state.isVisible&&d.default.createElement("picture",null,v(W),d.default.createElement(C,{alt:a,title:t,width:F.width,height:F.height,sizes:F.sizes,src:F.src,crossOrigin:this.props.crossOrigin,srcSet:F.srcSet,style:I,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:O,draggable:L})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:x((0,l.default)({alt:a,title:t,loading:O},F,{imageVariants:W}))}}))}return null},t}(d.default.Component);R.defaultProps={fadeIn:!0,durationFadeIn:500,alt:"",Tag:"div",loading:"lazy"};var j=c.default.shape({width:c.default.number.isRequired,height:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string}),I=c.default.shape({aspectRatio:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,sizes:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string});R.propTypes={resolutions:j,sizes:I,fixed:c.default.oneOfType([j,c.default.arrayOf(j)]),fluid:c.default.oneOfType([I,c.default.arrayOf(I)]),fadeIn:c.default.bool,durationFadeIn:c.default.number,title:c.default.string,alt:c.default.string,className:c.default.oneOfType([c.default.string,c.default.object]),critical:c.default.bool,crossOrigin:c.default.oneOfType([c.default.string,c.default.bool]),style:c.default.object,imgStyle:c.default.object,placeholderStyle:c.default.object,placeholderClassName:c.default.string,backgroundColor:c.default.oneOfType([c.default.string,c.default.bool]),onLoad:c.default.func,onError:c.default.func,onStartLoad:c.default.func,Tag:c.default.string,itemProp:c.default.string,loading:c.default.oneOf(["auto","lazy","eager"]),draggable:c.default.bool};var V=R;t.default=V}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-da48e34fedb3ba8344fb.js.map