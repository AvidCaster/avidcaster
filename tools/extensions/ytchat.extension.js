var clickable = [
  'yt-live-chat-text-message-renderer',
  'yt-live-chat-paid-message-renderer',
  'yt-live-chat-membership-item-renderer',
  'yt-live-chat-paid-sticker-renderer',
];

$('yt-live-chat-app').append(
  '<iframe id="avidcaster-iframe" src="https://embed.net:80/ytchat/overlay"></iframe>'
);

$('body')
  .unbind('click')
  .on('click', clickable.join(','), function () {
    // Skip deleted messages
    if ($(this)[0].hasAttribute('is-deleted')) {
      $(this).addClass('avidcaster-deleted');
      return;
    }

    // Mark this comment as shown
    $(this).addClass('shown-comment');
    var clicked = $(this).clone();

    //  Properties to send to remote window:
    var data = { type: 'ytchat-data', message: '', authorName: '', authorImg: '', donation: '' };

    // Get the author name
    clicked.find('#author-name #tooltip.hidden').remove();
    data.authorName = clicked.find('#author-name').text();

    // Get author avatar image
    data.authorImg = clicked.find('#img').attr('src').replace('s32', 's256').replace('s64', 's256');

    // Clean up the message and extract it as html
    clicked.find('#message').children().not('img').remove();
    clicked.find('#message img').each(function () {
      var emojiName = $(this)[0].getAttribute('alt');
      if (emojiName) {
        $(this)[0].replaceWith(' ' + emojiName + ' ');
      }
    });
    data.message = clicked.find('#message').html();

    // Get the donation
    data.donation = (
      clicked.find('#purchase-amount') || clicked.find('#purchase-amount-chip')
    ).html();

    // post the data to the remote window
    document.getElementById('avidcaster-iframe').contentWindow.postMessage(data, '*');
  });
