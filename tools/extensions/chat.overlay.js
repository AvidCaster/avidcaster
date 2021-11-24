var AC_WordsAction = 'highlight';
var AC_WordsList = [];

// if we are in popup
function AC_InPopup() {
  return window.self !== window.top;
}

// reopen popup in new tab
function AC_OpenInTab() {
  if (AC_InPopup()) {
    window.open(window.location.href, '_blank');
    window.close();
  }
}

// get url parameters from URL
function AC_GetUrlParameter(sParam) {
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

// detect insertions into container, and invoke the callback
function AC_SelectOnInsertion(containerSelector, tag, callback) {
  var insertionObserver = function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        for (var i = 0, len = mutation.addedNodes.length; i < len; i++) {
          if (mutation.addedNodes[i].tagName === tag.toUpperCase()) {
            callback(mutation.addedNodes[i]);
          }
        }
      }
    });
  };

  var target = document.querySelectorAll(containerSelector)[0];
  var config = { childList: true, subtree: true };
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(insertionObserver);
  observer.observe(target, config);
}

// open fullscreen on element
function AC_OpenFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen();
  }
}

/* Close fullscreen on full page */
function AC_CloseFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

// go fullscreen on the full web page
function AC_ToggleFullscreen(fullscreen) {
  var element = document.documentElement;
  fullscreen ? AC_OpenFullscreen(element) : AC_CloseFullscreen();
}

// open link in new tab
function AC_Navigate(link) {
  window.open(link, '_blank');
}

function AC_GetDomainName(domain) {
  return window.location.hostname.split('.').slice(-2).join('.').split('.')[0].toLowerCase();
}

// append script to body
function AC_AppendScript(src) {
  var s = document.createElement('script');
  s.src = src;
  s.type = 'text/javascript';
  document.body.appendChild(s);
}

// add style to head
function AC_AppendStyle(src) {
  var s = document.createElement('link');
  s.href = src;
  s.rel = 'stylesheet';
  s.type = 'text/css';
  document.head.appendChild(s);
}

// listen to incoming actions by the remote window (avidcaster)
function AC_ListenToChild() {
  window.addEventListener(
    'message',
    (event) => {
      if (event.data.type === 'avidcaster-overlay-north-bound') {
        switch (event.data.action) {
          case 'append-script':
            AC_AppendScript(event.data.payload.url);
            break;
          case 'append-style':
            AC_AppendStyle(event.data.payload.url);
            break;
          case 'navigate':
            AC_Navigate(event.data.payload.url);
            break;
          case 'fullscreen':
            AC_ToggleFullscreen(event.data.payload.fullscreen);
            break;
          case 'process-words':
            AC_WordsAction = event.data.payload.action;
            AC_WordsList = (event.data.payload.words || [])
              .map((word) => word.trim().toLowerCase())
              .filter((word) => word.length > 0);
          default:
            break;
        }
      }
    },
    false
  );
}

// insert iframe - if &prod=false is NOT passed in the URL, use official website
function AC_InsertIframe() {
  if (!$('#avidcaster-iframe').length) {
    var isProd = AC_GetUrlParameter('prod') === 'false' ? false : true;
    var site = isProd ? 'avidcaster.net' : 'avidcaster.dev:80';
    var target = AC_GetDomainName() || 'youtube';
    switch (target) {
      case 'youtube':
        var iframe = `<iframe id="avidcaster-iframe" src="https://${site}/chat/${target}/overlay"></iframe>`;
        $('yt-live-chat-app').append(iframe);
        break;
      case 'twitch':
        console.log('Twitch not supported yet');
        break;
      case 'facebook':
        console.log('Facebook not supported yet');
        break;
      default:
        break;
    }
  }
}

// inject jquery into dom
function AC_InjectJquery() {
  window?.jQuery ||
    AC_AppendScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js');
}

// invoke functions below this line ONLY
////////////////////////////////////////////////////////////////////////////////

// if we are in a popup, reopen in new tab
AC_OpenInTab();

setTimeout(function () {
  // inject jquery into dom
  AC_InjectJquery();

  // listen to incoming actions by the remote window (avidcaster)
  AC_ListenToChild();

  // insert iframe, allowing for jquery to load
  AC_InsertIframe();
}, 500);
