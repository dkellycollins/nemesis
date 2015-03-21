module nemesis {

    var _canvas;
    /*var _loadPromise = new Promise(function(resolve, reject) {
        nemesis.on("init", function() {
            var canvas = initCanvas();
            _canvas = canvas;
            resolve(canvas);
        });
    });*/

   /**
    * The canvas element on the page.
    * Will retrieve any element with a nemesis attribute or just the first canvas element on the page.
    */
    export function canvas() {
       return _canvas;
    }

    /*export function onLoad(callback: (canvas: any) => void): void {
        _loadPromise.then(callback, null);
    }*/

    var initCanvas = () => {
       var elements = document.getElementsByTagName('canvas');

       if(elements.length == 0) {
          //logger.logError('No canvas elements found.');
       } else {
          for(var i = 0; i < elements.length; i++) {
             if(elements[i].hasAttribute('nemesis')) {
                _canvas = elements[i];
                break;
             }
          }
          _canvas = _canvas || elements[0];

          //Fullscreen option must be handled here
          if(_canvas.getAttribute("fullscreen") == "true") {
             _canvas.height = window.innerHeight;
             _canvas.width = window.innerWidth;
          }
       }
    };

    nemesis.on("init", initCanvas);
}
