//******************************************************************************
// use jquery, and initialize the canvas
//******************************************************************************
   $(document).ready(function () {
      initialize();
   });

//******************************************************************************
// INIT THE CANVAS
//******************************************************************************
   function initialize() {
        // create 'canvas' variable that represents our canvas element (which has the id "theCanvas")
        //get the canvas' 2d drawing context
        var canvas = document.getElementById("theCanvas");
        var theCanvasContext = canvas.getContext("2d");

        //choose the stroke color
        theCanvasContext.strokeStyle = 'Black';

        //******************************************************************************
        //  CONFIGURE FOR TOUCH DEVICES
        // if it is a touch device, the DOM will have ontouchstart
        //******************************************************************************
        var isTouchDevice = 'ontouchstart' in document.documentElement;

        if (isTouchDevice) {
           // if touch device, track user touches
           var drawer = {
              isDrawing: false,
              // for the initial touch, start a path and set drawing to true
              touchstart: function (touchEvent) {
                //
                 theCanvasContext.beginPath();
                 theCanvasContext.moveTo(touchEvent.x, touchEvent.y);
                 this.isDrawing = true;
              },
              // while the touch moves, create lines between touch events
              touchmove: function (touchEvent) {
                 if (this.isDrawing) {
                   //create a point at the touch event and draw line from previous point to this new touch event
                    theCanvasContext.lineTo(touchEvent.x, touchEvent.y);
                    // draw that path ^
                    theCanvasContext.stroke();
                 }
              },
              // when the touch ends, close the path and set drawing to false
              touchend: function (touchEvent) {
                 if (this.isDrawing) {
                    this.touchmove(touchEvent);
                    this.isDrawing = false;
                 }
              }
           };

           // create a function to pass touch events and coordinates to drawer
           function draw(event) {

              // get the touch coordinates.  Using the first touch in case of multi-touch
              var coors = {
                 x: event.targetTouches[0].pageX,
                 y: event.targetTouches[0].pageY
              };

              // Now we need to get the offset of the canvas location
              var obj = canvas;

              if (obj.offsetParent) {
                 // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
                 do {
                    coors.x -= obj.offsetLeft;
                    coors.y -= obj.offsetTop;
                 }
         // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
         // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
                 while ((obj = obj.offsetParent) != null);
              }

              // pass the coordinates to the appropriate handler
              drawer[event.type](coors);
           }

           // attach the touchstart, touchmove, touchend event listeners.
           canvas.addEventListener('touchstart', draw, false);
           canvas.addEventListener('touchmove', draw, false);
           canvas.addEventListener('touchend', draw, false);

           // prevent elastic scrolling
           canvas.addEventListener('touchmove', function (event) {
              event.preventDefault();
           }, false);
        }
        //******************************************************************************
        //  CONFIGURE FOR NON-TOUCH DEVICES
        // if it's not touch, its a regular device presumably with click functionality
        //******************************************************************************
        else {
           // start drawing when the mousedown event fires, and attach handlers to
           // draw a line to wherever the mouse moves to
           $("#theCanvas").mousedown(function (mouseEvent) {
              var position = getPos(mouseEvent, canvas);

              theCanvasContext.moveTo(position.X, position.Y);
              theCanvasContext.beginPath();

              // attach event handlers
              $(this).mousemove(function (mouseEvent) {
                 drawLine(mouseEvent, canvas, theCanvasContext);
              }).mouseup(function (mouseEvent) {
                 finishDrawing(mouseEvent, canvas, theCanvasContext);
              }).mouseout(function (mouseEvent) {
                 finishDrawing(mouseEvent, canvas, theCanvasContext);
              });
           });
        }
   }


   //******************************************************************************
   // GET MOUSE POSITION
   //******************************************************************************

   // works out the X, Y position of the click inside the canvas from the X, Y position on the page
   function getPos(mouseEvent, canvas) {
      var x, y;
      if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
         x = mouseEvent.pageX;
         y = mouseEvent.pageY;
      } else {
         x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
         y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      return { X: x - canvas.offsetLeft, Y: y - canvas.offsetTop };
   }




   //******************************************************************************
   // DRAW A LINE
   //******************************************************************************


   // draws a line to the x and y coordinates of the mouse event inside
   // the specified element using the specified context
   function drawLine(mouseEvent, canvas, theCanvasContext) {

      var position = getPos(mouseEvent, canvas);

      theCanvasContext.lineTo(position.X, position.Y);
      theCanvasContext.stroke();
   }

   // draws a line from the last coordiantes in the path to the finishing
   // coordinates and unbind any event handlers which need to be preceded
   // by the mouse down event
   function finishDrawing(mouseEvent, canvas, theCanvasContext) {
      // draw the line to the finishing coordinates
      drawLine(mouseEvent, canvas, theCanvasContext);

      theCanvasContext.closePath();

      // unbind any events which could draw
      $(canvas).unbind("mousemove")
                  .unbind("mouseup")
                  .unbind("mouseout");
   }


// var drawingApp = (function () {
//
//         var x = new Array();
//         var y = new Array();
//         var drag = new Array();
//         var paint;
//
//
//         // this makes 'canvas' equal the canvas we created
//         // get context allows us to alter the canvas area's properties and access 2d canvas methods
//         function init(){
//           canvas = document.getElementById('canvasArea')
//           context = canvas.getContext("2d");
//         }
//
//         function appendClick(xclick, yclick, clickDrag)
//         {
//           x.push(xclick);
//           y.push(yclick);
//           drag.push(clickDrag);
//         }
//
//         // take in a mouse down event! from the canvas element called canvas(it's what we just declared above)
//         $('#context').mousedown(function (e){
//           // get the posisiton of the mouse in terms of the canvas
//           // e.pageX is the x-position of the mouse
//           // x will then equal the distance fromt he edge of the canvase since
//           // this.offsetLeft is the distance between this canvas and the parent (which is the screen)
//           var x = e.pageX - this.offsetLeft;
//           var y = e.pageY - this.offsetTop;
//
//           //allow to paint on the canvas
//           paint = true;
//
//           // add the x and y mouse down positions as a 'click'
//           appendClick(x, y);
//
//           // redraw the convas according to the click
//           redraw();
//         });
//
//         $('#context').mousemove(function(e){
//           // if painting is allowed on the canvas and the mouse is moving,
//           // we want to have lines painted on the canvas
//           // therefore, ass to the x, y, and clickDrag arrays
//           if (paint){
//             appendClick(x,y);
//             redraw();
//           }
//         });
//
//         $('#context').mouseup(function(e){
//           // if the user isn't clicking on anything we want the app to do nothing!
//           paint = false;
//         });
//
//         $('#context').mouseleave(function(e){
//           // if you leave the canvas we also want it to do nothing
//           paint = false;
//         });
//
//         // to redraw the canvas
//         function redraw(){
//           //clear the canvas
//           context.clearRect(0, 0, context.canvas.width, context.canvas.height);
//           //set the color
//           context.strokeStyle = "#df4b26";
//           //the type of corner created, when two lines meet
//           context.lineJoin = "round";
//           //width of the line created
//           context.lineWidth = 5;
//
//           //get the mouse positions in the x, y, and drags and draw that!
//           for(var i=0; i < x.length; i++) {
//             //start a path
//             context.beginPath();
//
//             //if there was a a drag (and i is one or greater than 1 becuase drag(0) cannot be then move the context path to the previous drag point
//             if(drag[i] && i){
//               context.moveTo(x[i-1], y[i-1]);
//              }else{
//                context.moveTo(x[i]-1, y[i]);
//              }
//              context.lineTo(x[i], y[i]);
//              context.closePath();
//              context.stroke();
//           }
//         }
// });
