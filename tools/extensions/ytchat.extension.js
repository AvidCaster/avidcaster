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

function cleanUp() {
  // remove poll messages
  $('#contents yt-live-chat-poll-renderer').addClass('avidcaster-hide');

  // remove pinned messages
  $('#visible-banners yt-live-chat-banner-header-renderer')
    .closest('#visible-banners')
    .addClass('avidcaster-hide');

  // remove subscriber messages
  $('#card.yt-live-chat-viewer-engagement-message-renderer')
    .closest('#card')
    .addClass('avidcaster-hide');
}

function showAll() {
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
  element.find('#message').children().not('img').remove();
  element.find('#message').children().removeClass();

  var message = {
    html: element.find('#message').html(),
    length: element.find('#message').text().length + element.find('#message').children().length,
  };

  return message;
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
  data.type = 'ytchat-data-south';
  document.getElementById('avidcaster-iframe').contentWindow.postMessage(data, '*');
}

var clickable = [
  'yt-live-chat-text-message-renderer',
  'yt-live-chat-paid-message-renderer',
  'yt-live-chat-membership-item-renderer',
  'yt-live-chat-paid-sticker-renderer',
];

////// actions //////

// if &prod=false is passed in the URL, use official website
////////////////////////////////////////////////////////////////////////////////
var isProd = getUrlParameter('prod') === 'false' ? false : true;
var targetSite = isProd ? 'avidcaster.net' : 'avidcaster.dev:80/';
$('yt-live-chat-app').append(
  '<iframe id="avidcaster-iframe" src="https://' + targetSite + '/ytchat/overlay"></iframe>'
);

// if we are in a pop out, open the chat in new tab
////////////////////////////////////////////////////////////////////////////////
if (window.opener && window.opener !== window) {
  // we are in a popup, open the chat in new tab and close the popup
  window.open(window.location.href, '_blank');
  window.close();
}

// listen for clicked elements and send data to iframe
///////////////////////////////////////////////////////////////////////////////
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
      authorImage: '',
      donation: '',
    };

    // Get the author name
    data.authorName = getAuthorName(clicked);

    // Get author image image
    data.authorImage = getAuthorImage(clicked);

    // Get author badge
    data.authorBadge = getAuthorBadge(clicked);

    // Get the message
    data.message = getMessage(clicked);

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
