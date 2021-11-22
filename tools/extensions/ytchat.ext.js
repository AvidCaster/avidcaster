// if we are in a pop out, open the chat in new tab as this is chat admin page
////////////////////////////////////////////////////////////////////////////////
if (window.opener && window.opener !== window) {
  // we are in a popup, open the chat in new tab and close the popup
  window.open(window.location.href, '_blank');
  window.close();
}

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

// detect insertions into container, and invoke the callback
function selectOnInsertion(containerSelector, tag, callback) {
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
function openFullscreen(element) {
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
function closeFullscreen() {
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
function toggleFullscreen(fullscreen) {
  var element = document.documentElement;
  fullscreen ? openFullscreen(element) : closeFullscreen();
}

// open link in new tab
function navigate(link) {
  window.open(link, '_blank');
}

// clean up clutters from the page so messages show better
function declutter() {
  // hide poll messages
  $('#contents yt-live-chat-poll-renderer').addClass('avidcaster-hide');

  // hide pinned messages
  $('#visible-banners yt-live-chat-banner-header-renderer')
    .closest('#visible-banners')
    .addClass('avidcaster-hide');

  // hide subscriber messages
  $('#card.yt-live-chat-viewer-engagement-message-renderer')
    .closest('#card')
    .addClass('avidcaster-hide');

  // hide subscriber only messages
  $('#container .yt-live-chat-restricted-participation-renderer')
    .closest('#input-panel')
    .addClass('avidcaster-hide');

  // hide say something messages
  $('#container .yt-live-chat-message-input-renderer')
    .closest('#input-panel')
    .addClass('avidcaster-hide');
}

// show the page as it was, to negate the effect of the prior clean up
function reclutter() {
  // show poll messages
  $('#contents yt-live-chat-poll-renderer').removeClass('avidcaster-hide');

  // show pinned messages
  $('#visible-banners yt-live-chat-banner-header-renderer')
    .closest('#visible-banners')
    .removeClass('avidcaster-hide');

  // show subscriber messages
  $('#card.yt-live-chat-viewer-engagement-message-renderer')
    .closest('#card')
    .removeClass('avidcaster-hide');

  // show subscriber only messages
  $('#container .yt-live-chat-restricted-participation-renderer')
    .closest('#input-panel')
    .removeClass('avidcaster-hide');

  // show say something messages
  $('#container .yt-live-chat-message-input-renderer')
    .closest('#input-panel')
    .removeClass('avidcaster-hide');
}

// get author name from the clicked element
function getAuthorName(element) {
  element.find('#author-name #tooltip.hidden').remove();
  var authorName = element.find('#author-name').text();
  return authorName;
}

// get author image from the clicked element
function getAuthorImage(element) {
  var authorImage = element.find('#img').attr('src').replace('s32', 's256').replace('s64', 's256');
  return authorImage;
}

// get author badge from the clicked element
function getAuthorBadge(element) {
  var authorBadge = element
    .find('#chat-badges .yt-live-chat-author-badge-renderer img')
    .attr('src');
  return authorBadge;
}

// get the message from the clicked element
function getMessage(element) {
  // Clean up the message and extract it as html
  element.find('#message hidden').remove();
  element.find('#message font').contents().unwrap();
  element.find('#message').children().not('img').remove();
  element.find('#message').children().removeClass();

  var message = element.find('#message').html();
  return message;
}

// get the membership from the clicked element
function getMembership(element) {
  var membership = element.find('.yt-live-chat-membership-item-renderer #header-subtext').html();
  return membership;
}

// get donation amount from the clicked element
function getDonationAmount(element) {
  var donationAmount = element.find('#purchase-amount').text();
  if (!donationAmount) {
    donationAmount = element.find('#purchase-amount-chip').text();
  }
  return donationAmount?.replace(/\s\s+/g, ' ').trim();
}

// post message to iframe
function postMessageSouthBound(data) {
  // post the data to the remote window
  data = { type: 'avidcaster-overlay-south-bound', action: 'yt-chat', payload: data };
  document.getElementById('avidcaster-iframe').contentWindow.postMessage(data, '*');
}

// clickable tags we are interested in
var clickable = [
  'yt-live-chat-text-message-renderer',
  'yt-live-chat-paid-message-renderer',
  'yt-live-chat-membership-item-renderer',
  'yt-live-chat-paid-sticker-renderer',
];

////// actions //////
var highlightedWords = [];

// if we are in a pop out, open the chat in new tab
////////////////////////////////////////////////////////////////////////////////
if (window.opener && window.opener !== window) {
  // we are in a popup, open the chat in new tab and close the popup
  window.open(window.location.href, '_blank');
  window.close();
}

// if &prod=false is passed in the URL, use official website
////////////////////////////////////////////////////////////////////////////////
var isProd = getUrlParameter('prod') === 'false' ? false : true;

// listen for clicked elements and send data to iframe
///////////////////////////////////////////////////////////////////////////////
$('body')
  .off('click')
  .on('click', clickable.join(','), function () {
    // Skip deleted messages
    if ($(this)[0].hasAttribute('is-deleted')) {
      $(this).addClass('avidcaster-deleted');
      return;
    }

    // Mark this comment as shown
    $(this).addClass('avidcaster-dispatched');
    // Mark nested comments as shown
    $(this).find('yt-live-chat-paid-message-renderer').addClass('avidcaster-dispatched');

    var clicked = $(this).clone();

    //  Properties to send to remote window:
    var data = {
      message: '',
      authorName: '',
      authorImage: '',
      donation: '',
      membership: '',
    };

    // Get the author name
    data.authorName = getAuthorName(clicked);

    // Get author image image
    data.authorImage = getAuthorImage(clicked);

    // Get author badge
    data.authorBadge = getAuthorBadge(clicked);

    // Get the message
    data.message = getMessage(clicked);

    // Get the membership
    data.membership = getMembership(clicked);

    // Get the donation
    data.donation = getDonationAmount(clicked);

    // Post the data to the remote window
    postMessageSouthBound(data);
  });

// listen to incoming actions by the remote window
///////////////////////////////////////////////////////////////////////////////
window.addEventListener(
  'message',
  (event) => {
    if (event.data.type === 'avidcaster-overlay-north-bound') {
      switch (event.data.action) {
        case 'navigate':
          navigate(event.data.payload.url);
          break;
        case 'fullscreen':
          toggleFullscreen(event.data.payload.fullscreen);
          break;
        case 'declutter':
          declutter();
          break;
        case 'reclutter':
          reclutter();
          break;
        case 'highlight-words':
          highlightedWords = (event.data.payload.words || [])
            .map((word) => word.trim().toLowerCase())
            .filter((word) => word.length > 0);
        default:
          break;
      }
    }
  },
  false
);

// listen to dom changes, and highlight the new comments if selected keywords are found
////////////////////////////////////////////////////////////////////////////////
selectOnInsertion(
  '.yt-live-chat-item-list-renderer#items',
  'yt-live-chat-text-message-renderer',
  function (element) {
    // Check for highlight words
    var chatWords = $(element)
      .find('#message')
      .text()
      .toLowerCase()
      .replace(/\s\s+/g, ' ')
      .trim()
      .split(' ');
    var highlights = chatWords.filter((value) => highlightedWords.includes(value));
    if (highlights.length > 0) {
      $(element).addClass('avidcaster-highlighted');
    }
  }
);
