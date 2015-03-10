module nemesis {
    import nemesis = nemesis;

    var _canvas;

   /**
    * The canvas element on the page.
    * Will retrieve any element with a nemesis attribute or just the first canvas element on the page.
    */
    export function canvas() {
       return _canvas;
    }

    var initCanvas = () => {
       var elements = document.getElementsByTagName('canvas');

       if(elements.length == 0) {
          logger.logError('No canvas elements found.');
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
