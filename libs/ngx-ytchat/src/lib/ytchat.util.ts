import * as $ from 'jquery';

import { YTChatInfo } from './ytchat.model';

/**
 * Given a YouTube chat html string, it returns the author name
 * @param chat Youtube chat string (html)
 * @returns author name string
 */
export const ytGetAuthorName = (chat: string): string => {
  const $obj = $($.parseHTML(chat));

  $obj.find('#author-name #tooltip.hidden').remove();
  const authorName = $obj.find('#author-name').text();
  return authorName || '';
};

/**
 * Given a YouTube chat html string, it returns the author image url
 * @param chat Youtube chat string (html)
 * @returns author image url string
 */
export const ytGetAuthorImage = (chat: string): string => {
  const $obj = $($.parseHTML(chat));

  const authorImage = $obj.find('#img').attr('src').replace('s32', 's256').replace('s64', 's256');
  return authorImage || '';
};

/**
 * Given a YouTube chat html string, it returns the message
 * @param chat Youtube chat string (html)
 * @returns message string
 */
export const ytGetMessage = (chat: string): string => {
  const $obj = $($.parseHTML(chat));

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
  return message || '';
};

/**
 * Given a YouTube chat html string, it returns the donation amount
 * @param chat Youtube chat string (html)
 * @returns donation string
 */
export const ytGetDonationAmount = (chat: string): string => {
  const $obj = $($.parseHTML(chat));

  let donationAmount = $obj.find('#purchase-amount').text();
  if (!donationAmount) {
    donationAmount = $obj.find('#purchase-amount-chip').text();
  }
  return donationAmount?.replace(/\s\s+/g, ' ').trim() || '';
};

// get the membership from the clicked element
export const ytGetMembership = (chat: string): string => {
  const $obj = $($.parseHTML(chat));

  const primaryText = $obj
    .find('.yt-live-chat-membership-item-renderer #header-primary-text')
    .html();
  const secondaryText = $obj.find('.yt-live-chat-membership-item-renderer #header-subtext').html();

  if (primaryText && secondaryText) {
    return primaryText + ' ' + secondaryText;
  }

  return primaryText || secondaryText || '';
};

export const ytGetMessageInfo = (chat: string): YTChatInfo => {
  const data: YTChatInfo = {};
  data.authorName = ytGetAuthorName(chat);
  data.authorImage = ytGetAuthorImage(chat);
  data.message = ytGetMessage(chat);
  data.donationAmount = ytGetDonationAmount(chat);
  data.membership = ytGetMembership(chat);
  return data;
};
