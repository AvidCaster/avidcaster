// add javascript to body
function addScript(src) {
  var s = document.createElement('script');
  s.src = src;
  s.type = 'text/javascript';
  document.body.appendChild(s);
}

// add css to head
function addStyle(src) {
  var s = document.createElement('link');
  s.href = src;
  s.rel = 'stylesheet';
  s.type = 'text/css';
  document.head.appendChild(s);
}

// listen to incoming actions by the remote window (avidcaster)
///////////////////////////////////////////////////////////////////////////////
window.addEventListener(
  'message',
  (event) => {
    if (event.data.type === 'avidcaster-overlay-north-bound') {
      switch (event.data.action) {
        case 'insert-js':
          addScript(event.data.payload.url);
          break;
        case 'insert-css':
          addStyle(event.data.payload.url);
          break;
        default:
          break;
      }
    }
  },
  false
);
