/*! scrawl-canvas 2014-11-01 */
if(window.scrawl&&window.scrawl.modules&&!window.scrawl.contains(window.scrawl.modules,"imageload"))var scrawl=function(a){"use strict";return a.getImagesByClass=function(b,c){if(b){var d,e=[],f=document.getElementsByClassName(b);if(f.length>0){for(var g=f.length;g>0;g--)d=a.newImage({element:f[g-1],removeImageFromDOM:a.xtGet([c,!0])}),e.push(d.name);return e}}return console.log('my.getImagesByClass() failed to find any <img> elements of class="'+b+'" on the page'),!1},a.getImageById=function(b,c){if(b){var d=a.newImage({element:document.getElementById(b),removeImageFromDOM:a.xtGet([c,!0])});return d.name}return console.log('my.getImagesByClass() failed to find any <img> elements of class="'+classtag+'" on the page'),!1},a}(scrawl);