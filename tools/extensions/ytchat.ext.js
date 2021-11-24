// clickable chat selectors we are interested in
var AC_ClickableChats = [
  'yt-live-chat-text-message-renderer',
  'yt-live-chat-paid-message-renderer',
  'yt-live-chat-membership-item-renderer',
  'yt-live-chat-paid-sticker-renderer',
];

// clean up clutters from the page so messages show better
function AC_Declutter() {
  // hide poll messages
  $('#contents yt-live-chat-poll-renderer').addClass('avidcaster-hidden');

  // hide pinned messages
  $('#visible-banners yt-live-chat-banner-header-renderer')
    .closest('#visible-banners')
    .addClass('avidcaster-hidden');

  // hide subscriber messages
  $('#card.yt-live-chat-viewer-engagement-message-renderer')
    .closest('#card')
    .addClass('avidcaster-hidden');

  // hide subscriber only messages
  $('#container .yt-live-chat-restricted-participation-renderer')
    .closest('#input-panel')
    .addClass('avidcaster-hidden');

  // hide say something messages
  $('#container .yt-live-chat-message-input-renderer')
    .closest('#input-panel')
    .addClass('avidcaster-hidden');
}

// show the page as it was, to negate the effect of the prior clean up
function AC_Reclutter() {
  // show poll messages
  $('#contents yt-live-chat-poll-renderer').removeClass('avidcaster-hidden');

  // show pinned messages
  $('#visible-banners yt-live-chat-banner-header-renderer')
    .closest('#visible-banners')
    .removeClass('avidcaster-hidden');

  // show subscriber messages
  $('#card.yt-live-chat-viewer-engagement-message-renderer')
    .closest('#card')
    .removeClass('avidcaster-hidden');

  // show subscriber only messages
  $('#container .yt-live-chat-restricted-participation-renderer')
    .closest('#input-panel')
    .removeClass('avidcaster-hidden');

  // show say something messages
  $('#container .yt-live-chat-message-input-renderer')
    .closest('#input-panel')
    .removeClass('avidcaster-hidden');
}

// get author name from the clicked element
function AC_GetAuthorName(element) {
  element.find('#author-name #tooltip.hidden').remove();
  var authorName = element.find('#author-name').text();
  return authorName;
}

// get author image from the clicked element
function AC_GetAuthorImage(element) {
  var authorImage = element.find('#img').attr('src').replace('s32', 's256').replace('s64', 's256');
  return authorImage;
}

// get author badge from the clicked element
function AC_GetAuthorBadge(element) {
  var authorBadge = element
    .find('#chat-badges .yt-live-chat-author-badge-renderer img')
    .attr('src');
  return authorBadge;
}

// get the message from the clicked element
function AC_GetMessage(element) {
  // Clean up the message and extract it as html
  element.find('#message hidden').remove();
  element.find('#message font').contents().unwrap();
  element.find('#message').children().not('img').remove();
  element.find('#message').children().removeClass();

  var message = element.find('#message').html();
  return message;
}

// get the membership from the clicked element
function AC_GetMembership(element) {
  var primaryText = element
    .find('.yt-live-chat-membership-item-renderer #header-primary-text')
    .html();
  var secondaryText = element.find('.yt-live-chat-membership-item-renderer #header-subtext').html();

  if (primaryText && secondaryText) {
    return primaryText + ' ' + secondaryText;
  }

  if (primaryText) {
    return primaryText;
  }

  if (secondaryText) {
    return secondaryText;
  }
}

// get donation amount from the clicked element
function AC_GetDonationAmount(element) {
  var donationAmount = element.find('#purchase-amount').text();
  if (!donationAmount) {
    donationAmount = element.find('#purchase-amount-chip').text();
  }
  return donationAmount?.replace(/\s\s+/g, ' ').trim();
}

// post message to iframe
function AC_PostMessageSouthBound(data) {
  // post the data to the remote window
  data = { type: 'avidcaster-overlay-south-bound', action: 'yt-chat', payload: data };
  document.getElementById('avidcaster-iframe').contentWindow.postMessage(data, '*');
}

// this is a admin, chat overlay, not seen by anyone but the admin, prevent jumping around
function AC_DisableHotLinks(element) {
  element.addClass('avidcaster-unclickable');
}

// listen for clicked elements and send data to iframe
function AC_ListenForClicks() {
  $('body')
    .off('click')
    .on('click', AC_ClickableChats.join(','), function () {
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
      data.authorName = AC_GetAuthorName(clicked);

      // Get author image image
      data.authorImage = AC_GetAuthorImage(clicked);

      // Get the message
      data.message = AC_GetMessage(clicked);

      // Get the membership
      data.membership = AC_GetMembership(clicked);

      // Get the donation
      data.donation = AC_GetDonationAmount(clicked);

      // Post the data to the remote window
      AC_PostMessageSouthBound(data);
    });
}

// listen to incoming actions by the parent window
function AC_ListenToParent() {
  window.addEventListener(
    'message',
    (event) => {
      if (event.data.type === 'avidcaster-overlay-north-bound') {
        switch (event.data.action) {
          case 'declutter':
            AC_Declutter();
            break;
          case 'reclutter':
            AC_Reclutter();
            break;
          default:
            break;
        }
      }
    },
    false
  );
}

// listen to dom changes, and highlight the new comments if selected keywords are found
function AC_ListenForNewChat() {
  AC_SelectOnInsertion(
    '.yt-live-chat-item-list-renderer#items',
    'yt-live-chat-text-message-renderer',
    function (element) {
      AC_DisableHotLinks($('#message > a'));

      if (AC_WordsList.length) {
        var chatWords = $(element)
          .find('#message')
          .text()
          .toLowerCase()
          .replace(/\s\s+/g, ' ')
          .trim()
          .split(' ');
        var match = chatWords.filter((value) => AC_WordsList.includes(value)).length > 0;
        switch (AC_WordsAction) {
          case 'highlight':
            if (match) {
              $(element).addClass('avidcaster-highlighted');
              // console.log(AC_WordsAction, AC_WordsList);
            }
            break;
          case 'filter':
            if (!match) {
              $(element).addClass('avidcaster-filtered');
              // console.log(AC_WordsAction, AC_WordsList);
            }
            break;
          default:
            break;
        }
      }
    }
  );
}

// invoke functions below this line ONLY
////////////////////////////////////////////////////////////////////////////////

// disable hotlinks in admin view
AC_DisableHotLinks($('#message > a'));

// listen for clicks on chat items
AC_ListenForClicks();

// listen for incoming actions by the parent window
AC_ListenToParent();

// listen for new comments
AC_ListenForNewChat();
