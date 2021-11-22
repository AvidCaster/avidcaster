// get url parameters from URL
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
}

// append script to body
function appendScript(src) {
  var s = document.createElement('script');
  s.src = src;
  s.type = 'text/javascript';
  document.body.appendChild(s);
}

// add style to head
function appendStyle(src) {
  var s = document.createElement('link');
  s.href = src;
  s.rel = 'stylesheet';
  s.type = 'text/css';
  document.head.appendChild(s);
}

// if we are in a pop out, open the chat in new tab as this is chat admin page
////////////////////////////////////////////////////////////////////////////////
if (window.opener && window.opener !== window) {
  // we are in a popup, open the chat in new tab and close the popup
  window.open(window.location.href, '_blank');
  window.close();
}

// inject jquery into dom
appendScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js');

// listen to incoming actions by the remote window (avidcaster)
///////////////////////////////////////////////////////////////////////////////
window.addEventListener(
  'message',
  (event) => {
    if (event.data.type === 'avidcaster-overlay-north-bound') {
      switch (event.data.action) {
        case 'append-script':
          appendScript(event.data.payload.url);
          break;
        case 'append-style':
          appendStyle(event.data.payload.url);
          break;
        default:
          break;
      }
    }
  },
  false
);

// if &prod=false is passed in the URL, use official website
////////////////////////////////////////////////////////////////////////////////
var isProd = getUrlParameter('prod') === 'false' ? false : true;
var targetSite = isProd ? 'avidcaster.net' : 'avidcaster.dev:80/';
setTimeout(function () {
  $('yt-live-chat-app').append(
    '<iframe id="avidcaster-iframe" src="https://' + targetSite + '/ytchat/overlay"></iframe>'
  );
}, 1000);
