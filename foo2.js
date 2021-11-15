$('body')
  .unbind('click')
  .on(
    'click',
    'yt-live-chat-text-message-renderer,yt-live-chat-paid-message-renderer,yt-live-chat-membership-item-renderer,yt-live-chat-paid-sticker-renderer',
    function () {
      // Don't show deleted messages
      if ($(this)[0].hasAttribute('is-deleted')) {
        console.log('Not showing deleted message');
        return;
      }

      // Mark this comment as shown
      $(this).addClass('shown-comment');

      //  Properties to send to remote window:
      //  message
      //  authorName
      //  authorImg
      //  badges
      //  donation
      //  sticker
      //  membership

      var data = { type: 'ytchat-data' };

      data.message = $(this).find('#message').html();

      $(this).find('#author-name #tooltip.hidden').remove();
      data.authorName = $(this).find('#author-name').text();

      data.authorImg = $(this).find('#img').attr('src').replace('32', '128');

      data.badges = '';
      if ($(this).find('#chat-badges .yt-live-chat-author-badge-renderer img').length > 0) {
        data.badges = $(this)
          .find('#chat-badges .yt-live-chat-author-badge-renderer img')
          .parent()
          .html();
      }

      data.donation = $(this).find('#purchase-amount').html();

      data.sticker = $(this).find('.yt-live-chat-paid-sticker-renderer #img').attr('src');

      // Donation amounts for stickers use a different id than regular superchats
      if (data.sticker) {
        data.donation = $(this).find('#purchase-amount-chip').html();
      }

      data.membership = $(this)
        .find('.yt-live-chat-membership-item-renderer #header-subtext')
        .html();

      document.getElementById('avidcaster-iframe').contentWindow.postMessage(data, '*');
    }
  );

$('yt-live-chat-app').append('<button class="btn-clear">CLEAR</button>');
$('yt-live-chat-app').append(
  '<iframe id="avidcaster-iframe" src="https://embed.net:80/ytchat/overlay"></iframe>'
);
