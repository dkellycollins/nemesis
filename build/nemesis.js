define("util/logger",["require","exports"],function(e,t){var n=function(){function e(){}return e.prototype.log=function(e){console.log(e)},e}();return n}),define("nemesis",["require","exports","util/logger"],function(e,t,n){var r=e("json!config.json"),i=function(){function e(){}return e.config=function(e){return!e||(this._config=e),this._config||{}},e}(),i;return function(e){e.config(r),e.LOGGER=new n,e.config().canvasId?e.CANVAS=document.getElementById(e.config().canvasId):e.CANVAS=document.getElementsByTagName("canvas")[0],e.GL=e.CANVAS.getContext("experimental-webgl",{antialias:!0}),e.config().fullscreeen&&(e.CANVAS.width=window.innerWidth,e.CANVAS.height=window.innerHeight),e.LOGGER.log("nemesis started.")}(i||(i={})),i});