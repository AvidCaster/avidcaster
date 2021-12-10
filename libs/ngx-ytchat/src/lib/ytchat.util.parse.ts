/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { unescape as ldUnescape } from 'lodash-es';

import { YTChatInfo } from './ytchat.model';

/**
 * Check if string contains emoji
 * @param str string with possible emoji
 * @returns true if the string contains emoji
 */
export const hasEmoji = (str: string): boolean => {
  const EmojiRegexExp =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

  return EmojiRegexExp.test(str);
};

/**
 * Get the inner text for the element (nested: <div>price is<span>$1.9</span></div>) => $1.9 (unwrap)
 * @param el element to parse
 * @returns text string
 */
const getInnerText = (el: Element, selector: string): string => {
  el = el.cloneNode(true) as Element;

  const text = el.querySelector(selector)?.textContent?.replace(/ +/g, ' ').trim() ?? undefined;
  return text;
};

/**
 * Get the top level text for the element
 * @param el element to parse
 * @returns text string
 */
const getText = (el: Element, selector: string): string => {
  el = el.cloneNode(true) as Element;

  const delList = el.querySelectorAll(`${selector} > del-all-inner-elements`);
  delList.forEach(function (item) {
    item.parentNode.removeChild(item);
  });

  const text = el.querySelector(selector)?.textContent?.replace(/ +/g, ' ').trim() ?? undefined;
  return text;
};

/**
 * Get the message html from the element
 * @param el element to parse
 * @returns message html
 */
const getHtml = (el: Element, selector: string): string => {
  el = el.cloneNode(true) as Element;
  const messageHtml = el.querySelector(selector)?.innerHTML;
  return ldUnescape(messageHtml);
};

/**
 * Get the author avatar from the element
 * @param el element to parse
 * @returns author avatar
 */
const getImage = (el: Element, selector: string): string => {
  el = el.cloneNode(true) as Element;
  const image = el.querySelector(selector) as HTMLImageElement | null;
  const imgUrl = image
    ? image.src?.replace('s32', 's256').replace('s64', 's256').replace(/ +/g, ' ').trim()
    : undefined;
  return imgUrl;
};

/**
 * Get the message background color from the element
 * @param el element to parse
 * @returns message card background color
 */
const getBackgroundColor = (el: Element, selector: string): string => {
  el = el.cloneNode(true) as Element;
  const card = el.querySelector(selector) as Element | null;
  const backgroundColor = card ? getComputedStyle(card).backgroundColor : undefined;
  return backgroundColor;
};

/**
 * Get the message text for the element
 * @param el element to parse
 * @returns text only string
 */
const getMessageHtml = (el: Element, selector: string): string => {
  el = el.cloneNode(true) as Element;

  el.querySelectorAll(`${selector} font`).forEach(function (item) {
    item.replaceWith(item.textContent);
  });

  const delList = el.querySelectorAll(`${selector}  > :not(img)`);
  delList.forEach(function (item) {
    item.parentNode.removeChild(item);
  });

  el.querySelectorAll(`${selector} img`).forEach(function (node) {
    const alt = node.getAttribute('alt').replace(/ +/g, ' ').trim();
    if (alt && hasEmoji(alt)) {
      node.replaceWith(alt);
    } else {
      const src = node.getAttribute('src');
      node.replaceWith(`<img src="${src}">`);
    }
  });

  const message = getHtml(el, selector);

  return message.replace(/ +/g, ' ').trim();
};

/**
 * Get the donation text for the element
 * @param el element to parse
 * @returns donation amount
 */
const getDonationAmount = (el: Element): string => {
  let amount = getInnerText(el, '#purchase-amount');
  if (!amount) {
    amount = getInnerText(el, '#purchase-amount-chip');
  }
  return amount.replace(/ +/g, ' ').trim();
};

/**
 * Get the common data from the element
 * @param el element to parse
 * @returns common info
 */
const parseCommonElements = (el: Element): YTChatInfo => {
  const author = getText(el, '#author-name');
  const authorType = getText(el, 'author-type');
  const message = getText(el, '#message');
  const avatarUrl = getImage(el, '#img');
  return { message, author, authorType, avatarUrl };
};

/**
 * Parse the element to get the message info (type text-message)
 * @param el element to parse
 * @returns message info
 */
const parseTextMessage = (el: Element): YTChatInfo => {
  const params = parseCommonElements(el);
  const html = getMessageHtml(el, '#message');

  return {
    ...params,
    html,
    messageType: 'text-message',
  };
};

/**
 * Parse the element to get the message info (type paid-message)
 * @param el element to parse
 * @returns message info
 */
const parsePaidMessage = (el: Element): YTChatInfo => {
  const params = parseCommonElements(el);
  const html = getMessageHtml(el, '#message');
  const donation = getDonationAmount(el);
  const backgroundColor = getBackgroundColor(el, '#card > #header');

  return {
    ...params,
    html,
    backgroundColor,
    donation,
    messageType: 'paid-message',
  };
};

/**
 * Parse the element to get the message info (type paid-sticker)
 * @param el element to parse
 * @returns message info
 */
const parsePaidSticker = (el: Element): YTChatInfo => {
  const params = parseCommonElements(el);
  const donation = getDonationAmount(el);
  const backgroundColor = getBackgroundColor(el, '#card');
  const stickerUrl = getImage(el, '#sticker > #img');

  return {
    ...params,
    stickerUrl,
    backgroundColor,
    donation,
    messageType: 'paid-sticker',
  };
};

/**
 * Parse the element to get the message info (type membership-item)
 * @param el element to parse
 * @returns message info
 */
const parseMembershipItem = (el: Element): YTChatInfo => {
  const params = parseCommonElements(el);
  const backgroundColor = getBackgroundColor(el, '#card > #header');
  let html = getMessageHtml(el, '#message');
  let donation = undefined;
  if (html) {
    // milestone chat
    donation = getText(el, '#header-primary-text');
  } else {
    html = getHtml(el, '#header-subtext');
  }

  return {
    ...params,
    html,
    backgroundColor,
    donation,
    messageType: 'membership-item',
  };
};

export const parseChat = (el: Element, tagName: string): YTChatInfo | undefined => {
  switch (tagName) {
    case 'yt-live-chat-text-message-renderer':
      return parseTextMessage(el);
    case 'yt-live-chat-paid-message-renderer':
      return parsePaidMessage(el);
    case 'yt-live-chat-paid-sticker-renderer':
      return parsePaidSticker(el);
    case 'yt-live-chat-membership-item-renderer':
      return parseMembershipItem(el);
  }
  return {} as YTChatInfo;
};
