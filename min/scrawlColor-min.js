/*! scrawl-canvas 2015-06-28 */
if(window.scrawl&&window.scrawl.modules&&!window.scrawl.contains(window.scrawl.modules,"color"))var scrawl=function(a){"use strict";return a.newColor=function(b){return a.makeColor(b)},a.makeColor=function(b){return new a.Color(b)},a.Color=function(b){return b=a.safeObject(b),a.Base.call(this,b),this.set(b),a.xt(b.color)&&this.convert(b.color),b.random&&this.generateRandomColor(b),this.checkValues(),a.design[this.name]=this,a.pushUnique(a.designnames,this.name),this},a.Color.prototype=Object.create(a.Base.prototype),a.Color.prototype.type="Color",a.Color.prototype.classname="designnames",a.d.Color={r:0,g:0,b:0,a:1,rShift:0,gShift:0,bShift:0,aShift:0,rMax:255,gMax:255,bMax:255,aMax:1,rMin:0,gMin:0,bMin:0,aMin:0,rBounce:!1,gBounce:!1,bBounce:!1,aBounce:!1,autoUpdate:!1},a.mergeInto(a.d.Color,a.d.Base),a.Color.prototype.get=function(b){return a.xt(b)?"random"===b?(this.generateRandomColor(),this.get()):a.Base.prototype.get.call(this,b):"rgba("+(this.r||0)+", "+(this.g||0)+", "+(this.b||0)+", "+(this.a||1)+")"},a.Color.prototype.clone=function(b){var c=this.parse(),d=a.mergeOver(c,a.isa(b,"obj")?b:{}),e=a.makeColor(d);return b=a.safeObject(b),a.xt(b.random)&&b.random&&(delete e.r,delete e.g,delete e.b,delete e.a,e.generateRandomColor(b)),e},a.Color.prototype.getData=function(){return this.get("autoUpdate")&&this.update(),this.checkValues(),this.get()},a.Color.prototype.generateRandomColor=function(b){var c=this.get("rMax"),d=this.get("gMax"),e=this.get("bMax"),f=this.get("aMax"),g=this.get("rMin"),h=this.get("gMin"),i=this.get("bMin"),j=this.get("aMin");return b=a.safeObject(b),this.r=b.r||Math.round(Math.random()*(c-g)+g),this.g=b.g||Math.round(Math.random()*(d-h)+h),this.b=b.b||Math.round(Math.random()*(e-i)+i),this.a=b.a||Math.random()*(f-j)+j,this.checkValues(),this},a.Color.prototype.checkValues=function(){var a=Math.floor(this.r)||0,b=Math.floor(this.g)||0,c=Math.floor(this.b)||0,d=this.a||1;return a=a>255?255:0>a?0:a,b=b>255?255:0>b?0:b,c=c>255?255:0>c?0:c,d=d>1?1:0>d?0:d,this.r=a,this.g=b,this.b=c,this.a=d,this},a.Color.prototype.set=function(b){return a.Base.prototype.set.call(this,b),b=a.safeObject(b),b.random&&this.generateRandomColor(b),this.checkValues(),this},a.Color.prototype.update=function(){var b,c,d,e,f,g,h,i,j,k=["r","g","b","a"];for(e=[],f=[],b=0,c=k.length;c>b;b++)d=this.get(k[b]),g=this.get(k[b]+"Shift"),h=this.get(k[b]+"Min"),i=this.get(k[b]+"Max"),j=this.get(k[b]+"Bounce"),a.isBetween(d+g,i,h,!0)||(j?g=-g:(d=d>(i+h)/2?i:h,g=0)),e[b]=d+g,f[b]=g;return this.r=e[0],this.g=e[1],this.b=e[2],this.a=e[3],this.rShift=f[0],this.gShift=f[1],this.bShift=f[2],this.aShift=f[3],this},a.Color.prototype.setDelta=function(b){return b=a.isa(b,"obj")?b:{},a.Base.prototype.set.call(this,{r:(this.r||0)+(b.r||0),g:(this.g||0)+(b.g||0),b:(this.b||0)+(b.b||0),a:(this.a||1)+(b.a||0)}),this.checkValues(),this},a.Color.prototype.convert=function(b){console.log(b);var c,d,e,f,g;if(b=a.isa(b,"str")?b:"",b.length>0){if(b.toLowerCase(),c=0,d=0,e=0,f=1,"#"===b[0])b.length<5?(c=this.toDecimal(b[1]+b[1]),d=this.toDecimal(b[2]+b[2]),e=this.toDecimal(b[3]+b[3])):b.length<8&&(c=this.toDecimal(b[1]+b[2]),d=this.toDecimal(b[3]+b[4]),e=this.toDecimal(b[5]+b[6]));else if(/rgb\(/.test(b))g=b.match(/([0-9.]+\b)/g),/%/.test(b)?(c=Math.round(g[0]/100*255),d=Math.round(g[1]/100*255),e=Math.round(g[2]/100*255)):(c=Math.round(g[0]),d=Math.round(g[1]),e=Math.round(g[2]));else if(/rgba\(/.test(b))g=b.match(/([0-9.]+\b)/g),c=g[0],d=g[1],e=g[2],f=g[3];else switch(b){case"green":c=0,d=128,e=0;break;case"silver":c=192,d=192,e=192;break;case"lime":c=0,d=255,e=0;break;case"gray":c=128,d=128,e=128;break;case"grey":c=128,d=128,e=128;break;case"olive":c=128,d=128,e=0;break;case"white":c=255,d=255,e=255;break;case"yellow":c=255,d=255,e=0;break;case"maroon":c=128,d=0,e=0;break;case"navy":c=0,d=0,e=128;break;case"red":c=255,d=0,e=0;break;case"blue":c=0,d=0,e=255;break;case"purple":c=128,d=0,e=128;break;case"teal":c=0,d=128,e=128;break;case"fuchsia":c=255,d=0,e=255;break;case"aqua":c=0,d=255,e=255;break;default:c=0,d=0,e=0}this.r=c,this.g=d,this.b=e,this.a=f,this.checkValues()}return this},a.Color.prototype.toHex=function(a){return a.toString(16)},a.Color.prototype.toDecimal=function(a){return parseInt(a,16)},a.Color.prototype.remove=function(){return delete a.dsn[this.name],delete a.design[this.name],a.removeItem(a.designnames,this.name),!0},a}(scrawl);