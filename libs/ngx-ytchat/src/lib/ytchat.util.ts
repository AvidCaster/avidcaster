import * as $ from 'jquery';

import { YTChatInfo } from './ytchat.model';

/**
 * Given a YouTube chat html string, it returns the author name
 * @param chat Youtube chat string (html)
 * @returns author name string
 */
export const ytGetAuthorName = ($obj: JQuery<Node[]>): string => {
  $obj.find('#author-name #tooltip.hidden').remove();
  const authorName = $obj.find('#author-name').text();
  return (authorName || '').replace(/\s\s+/g, ' ').trim();
};

/**
 * Given a YouTube chat html string, it returns the author image url
 * @param chat Youtube chat string (html)
 * @returns author image url string
 */
export const ytGetAuthorImage = ($obj: JQuery<Node[]>): string => {
  const authorImage = $obj.find('#img').attr('src').replace('s32', 's256').replace('s64', 's256');
  return (authorImage || '').replace(/\s\s+/g, ' ').trim();
};

/**
 * Given a YouTube chat html string, it returns the message
 * @param chat Youtube chat string (html)
 * @returns message string
 */
export const ytGetMessage = ($obj: JQuery<Node[]>): string => {
  // Clean up the message and extract it as html
  $obj.find('#message hidden').remove();
  $obj.find('#message font').contents().unwrap();
  $obj.find('#message').children().not('img').remove();
  $obj.find('#message').children().removeClass();

  $obj.find('#message img').each(function () {
    const src = $(this).attr('src');
    $(this).replaceWith(`<img src="${src}">`);
  });

  const message = $obj.find('#message').html();
  return (message || '').replace(/\s\s+/g, ' ').trim();
};

/**
 * Given a YouTube chat html string, it returns the donation amount
 * @param chat Youtube chat string (html)
 * @returns donation string
 */
export const ytGetDonationAmount = ($obj: JQuery<Node[]>): string => {
  let donationAmount = $obj.find('#purchase-amount').text();
  if (!donationAmount) {
    donationAmount = $obj.find('#purchase-amount-chip').text();
  }
  return (donationAmount || '').replace(/\s\s+/g, ' ').trim();
};

// get the membership from the clicked element
export const ytGetMembership = ($obj: JQuery<Node[]>): string => {
  const primaryText = $obj
    .find('.yt-live-chat-membership-item-renderer #header-primary-text')
    .html();
  const secondaryText = $obj.find('.yt-live-chat-membership-item-renderer #header-subtext').html();

  if (primaryText && secondaryText) {
    return (primaryText + ' ' + secondaryText).replace(/\s\s+/g, ' ').trim();
  }

  return (primaryText || secondaryText || '').replace(/\s\s+/g, ' ').trim();
};

export const ytGetMessageInfo = (chat: string): YTChatInfo => {
  const $obj = $($.parseHTML(chat));
  const data: YTChatInfo = {};
  data.authorName = ytGetAuthorName($obj);
  data.authorImage = ytGetAuthorImage($obj);
  data.message = ytGetMessage($obj);
  data.donation = ytGetDonationAmount($obj);
  data.membership = ytGetMembership($obj);
  return data;
};
