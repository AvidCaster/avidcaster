// if we are in a pop out, open the chat in new tab
if (window.opener && window.opener !== window) {
  // we are in a popup, open the chat in new tab and close the popup
  window.open(window.location.href, '_blank');
  window.close();
}

// get url parameters from URL
var getUrlParameter = function getUrlParameter(sParam) {
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
};

// if &prod=false is passed in the URL, use official website
var isProd = getUrlParameter('prod') === 'false' ? false : true;

var targetSite = isProd ? 'avidcaster.net' : 'avidcaster.dev:80/';

$('yt-live-chat-app').append(
  '<iframe id="avidcaster-iframe" src="https://' + targetSite + '/ytchat/overlay"></iframe>'
);

var clickable = [
  'yt-live-chat-text-message-renderer',
  'yt-live-chat-paid-message-renderer',
  'yt-live-chat-membership-item-renderer',
  'yt-live-chat-paid-sticker-renderer',
];

$('body')
  .unbind('click')
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
      type: '',
      message: '',
      authorName: '',
      authorImg: '',
      donation: '',
    };

    // Get the author name
    clicked.find('#author-name #tooltip.hidden').remove();
    data.authorName = clicked.find('#author-name').text();

    // Get author avatar image
    data.authorImg = clicked.find('#img').attr('src').replace('s32', 's256').replace('s64', 's256');

    // Clean up the message and extract it as html
    clicked.find('#message hidden').remove();
    clicked.find('#message').children().not('img').remove();
    clicked.find('#message').children().removeClass();

    data.message = {
      html: clicked.find('#message').html(),
      length: clicked.find('#message').text().length + clicked.find('#message').children().length,
    };

    // Get the donation
    data.donation = (
      clicked.find('#purchase-amount') || clicked.find('#purchase-amount-chip')
    ).text();

    // post the data to the remote window
    data.type = 'ytchat-data-south';
    document.getElementById('avidcaster-iframe').contentWindow.postMessage(data, '*');
  });

function cleanUp() {
  // remove poll messages
  $('#contents yt-live-chat-poll-renderer').addClass('avidcaster-hide');

  // remove pinned messages
  $('#visible-banners yt-live-chat-banner-header-renderer')
    .closest('#visible-banners')
    .addClass('avidcaster-hide');
}

function showAll() {
  // remove poll messages
  $('#contents yt-live-chat-poll-renderer').removeClass('avidcaster-hide');

  // remove pinned messages
  $('#visible-banners yt-live-chat-banner-header-renderer')
    .closest('#visible-banners')
    .removeClass('avidcaster-hide');
}

// listen to incoming actions by the remote window
window.addEventListener(
  'message',
  (event) => {
    if (event.data.type === 'ytchat-data-north') {
      switch (event.data.action) {
        case 'clean-up':
          cleanUp();
          break;
        case 'show-all':
          showAll();
        default:
          break;
      }
    }
  },
  false
);
