$('body').on(
  'click',
  'yt-live-chat-text-message-renderer,yt-live-chat-paid-message-renderer,yt-live-chat-membership-item-renderer,yt-live-chat-paid-sticker-renderer',
  function () {
    var chatname = $(this).find('#author-name').html();
    var chatmessage = $(this).find('#message').html();
    var chatimg = $(this).find('#img').attr('src');
    var chatdonation = $(this).find('#purchase-amount').html();
    var chipdonation = $(this).find('#purchase-amount-chip').html();
    var chatmember = $(this).find('#header-subtext').html();
    chatimg = chatimg.replace('32', '128');
    chatimg = chatimg.replace('64', '128');
    var hasDonation;
    if (chatdonation) {
      hasDonation = '<div class="donation">' + chatdonation + '</div>';
    } else if (chipdonation) {
      hasDonation = '<div class="donation sticker">' + chipdonation + '</div>';
      chatmessage = '';
    } else {
      hasDonation = '';
    }
    var newMember;
    if (chatmember) {
      newMember = 'newmember';
    } else {
      newMember = '';
      chatmember = '';
    }

    document.getElementById('foobar').contentWindow.postMessage(
      {
        chatimg,
        newMember,
        chatmessage,
        chatmember,
        hasDonation,
        type: 'ytchat-data',
      },
      '*'
    );

    next();
  }
);

$('body').on('click', '.btn-clear', function () {
  $('.hl-c-cont')
    .addClass('fadeout')
    .delay(300)
    .queue(function () {
      $('.hl-c-cont').remove().dequeue();
    });
});

$('body').append(
  '<button class="btn-clear">CLEAR</button> <iframe id="foobar" src="https://embed.net:80/ytchat/overlay"> </iframe>'
);
