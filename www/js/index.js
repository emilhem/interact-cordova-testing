/*!

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org/>

*/
var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },

  receivedEvent: function(event) {
    if(event === 'deviceready') {
      var pagesParent = document.getElementById('pages');
      var pages = pagesParent.children;
      var tb = document.getElementById('toolbar');
      console.log(pages);
      pages[0].style.display = 'block';
      for (var i = 0; i < pages.length; i++) {
        tb.innerHTML += '<a href="#page-' + i + '">Demo ' + i + '</a> ';
      }

      var links = tb.children;

      for (var i = 0; i < links.length; i++) {
        links[i].onclick = function(ev) {
          ev.preventDefault();
          for (var j = 0; j < pages.length; j++) {
            pages[j].style.display = 'none';
          }
          pages[parseInt(this.attributes.href.value.substr(6), 10)].style.display = 'block';
        }
      }

      /* BEGIN: part taken from http://interactjs.io/ DEMOS */
      // target elements with the "draggable" class
      interact('.draggable')
        .draggable({
          // enable inertial throwing
          inertia: true,
          // keep the element within the area of it's parent
          restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          // enable autoScroll
          autoScroll: true,

          // call this function on every dragmove event
          onmove: dragMoveListener,
          // call this function on every dragend event
          onend: function (event) {
            var textEl = event.target.querySelector('p');

            textEl && (textEl.textContent =
              'moved a distance of '
              + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                           Math.pow(event.pageY - event.y0, 2) | 0))
                  .toFixed(2) + 'px');
          }
        });

      function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }

      // this is used later in the resizing and gesture demos
      window.dragMoveListener = dragMoveListener;

      interact('.dropzone').dropzone({
        // only accept elements matching this CSS selector
        accept: '#yes-drop',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.75,

        // listen for drop related events:

        ondropactivate: function (event) {
          // add active dropzone feedback
          event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
          var draggableElement = event.relatedTarget,
              dropzoneElement = event.target;

          // feedback the possibility of a drop
          dropzoneElement.classList.add('drop-target');
          draggableElement.classList.add('can-drop');
          draggableElement.textContent = 'Dragged in';
        },
        ondragleave: function (event) {
          // remove the drop feedback style
          event.target.classList.remove('drop-target');
          event.relatedTarget.classList.remove('can-drop');
          event.relatedTarget.textContent = 'Dragged out';
        },
        ondrop: function (event) {
          event.relatedTarget.textContent = 'Dropped';
        },
        ondropdeactivate: function (event) {
          // remove active dropzone feedback
          event.target.classList.remove('drop-active');
          event.target.classList.remove('drop-target');
        }
      });

      var element = document.getElementById('grid-snap'),
          x = 0, y = 0;

      interact(element)
        .draggable({
          snap: {
            targets: [
              interact.createSnapGrid({ x: 30, y: 30 })
            ],
            range: Infinity,
            relativePoints: [ { x: 0, y: 0 } ]
          },
          inertia: true,
          restrict: {
            restriction: element.parentNode,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
            endOnly: true
          }
        })
        .on('dragmove', function (event) {
          x += event.dx;
          y += event.dy;

          event.target.style.webkitTransform =
          event.target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';
        });

      interact('.resize-drag')
        .draggable({
          onmove: window.dragMoveListener,
          restrict: {
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
        })
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          // keep the edges inside the parent
          restrictEdges: {
            outer: 'parent',
            endOnly: true,
          },

          // minimum size
          restrictSize: {
            min: { width: 100, height: 50 },
          },

          inertia: true,
        })
        .on('resizemove', function (event) {
          var target = event.target,
              x = (parseFloat(target.getAttribute('data-x')) || 0),
              y = (parseFloat(target.getAttribute('data-y')) || 0);

          // update the element's style
          target.style.width  = event.rect.width + 'px';
          target.style.height = event.rect.height + 'px';

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.webkitTransform = target.style.transform =
              'translate(' + x + 'px,' + y + 'px)';

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
          target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        });

      var angle = 0;

      interact('#rotate-area').gesturable({
        onmove: function (event) {
          var arrow = document.getElementById('arrow');

          angle += event.da;

          arrow.style.webkitTransform =
          arrow.style.transform =
            'rotate(' + angle + 'deg)';

          document.getElementById('angle-info').innerHTML =
            angle.toFixed(2) + '&deg;';
        }
      });

      var scale = 1,
          gestureArea = document.getElementById('gesture-area'),
          scaleElement = document.getElementById('scale-element'),
          resetTimeout;

      interact(gestureArea)
        .gesturable({
          onstart: function (event) {
            clearTimeout(resetTimeout);
            scaleElement.classList.remove('reset');
          },
          onmove: function (event) {
            scale = scale * (1 + event.ds);

            scaleElement.style.webkitTransform =
            scaleElement.style.transform =
              'scale(' + scale + ')';

            dragMoveListener(event);
          },
          onend: function (event) {
            resetTimeout = setTimeout(reset, 1000);
            scaleElement.classList.add('reset');
          }
        })
        .draggable({ onmove: dragMoveListener });

      function reset () {
        scale = 1;
        scaleElement.style.webkitTransform =
        scaleElement.style.transform =
          'scale(1)';
      }


      interact('.tap-target')
        .on('tap', function (event) {
          event.currentTarget.classList.toggle('switch-bg');
          event.preventDefault();
        })
        .on('doubletap', function (event) {
          event.currentTarget.classList.toggle('large');
          event.currentTarget.classList.remove('rotate');
          event.preventDefault();
        })
        .on('hold', function (event) {
          event.currentTarget.classList.toggle('rotate');
          event.currentTarget.classList.remove('large');
        });

      /* END: part taken from http://interactjs.io/ DEMOS */
    }
  }
};

app.initialize();
