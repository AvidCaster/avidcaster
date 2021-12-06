/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { unescape as ldUnescape } from 'lodash-es';

import { ChatMessageData } from '../../../ngx-chat/src';
import { ChatMessage } from '../../../ngx-chat/src/lib/chat.model';

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

  el.querySelectorAll(`${selector} font`).forEach(function (node) {
    node.replaceWith(node?.textContent);
  });

  const delList = el.querySelectorAll(`${selector} > :not(img)`);
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
    ? image[0].src?.replace('s32', 's256').replace('s64', 's256').replace(/ +/g, ' ').trim()
    : undefined;
  return imgUrl;
};

/**
 * Get the message text for the element
 * @param el element to parse
 * @returns text only string
 */
const getMessageHtml = (el: Element, selector: string): string => {
  return '';
  const elem = el.querySelector(selector).cloneNode(true) as Element;

  elem.querySelectorAll(`${selector} [data-a-target="chat-message-text"]`).forEach(function (item) {
    item.replaceWith(item.textContent);
  });

  const images = el.querySelectorAll(`${selector} [data-test-selector="emote-button"]`);
  images.forEach(function (item) {
    const img = item.querySelector('img');
    img ? item.replaceWith(`<img src="${img.src}" />`) : item.remove();
  });

  const delList = el.querySelectorAll(`${selector} anything-else`);
  delList.forEach(function (item) {
    item.parentNode.removeChild(item);
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
const parseCommonElements = (el: Element): ChatMessage => {
  const author = getText(el, '[data-test-selector="message-username"]');
  const message = getText(el, '[data-a-target="chat-message-text"]');
  const avatarUrl = getImage(el, '[data-a-target="chat-badge]');
  // const badgeUrl = getImage(el, '#chat-badges .yt-live-chat-author-badge-renderer img');
  return { message, author, avatarUrl };
};

/**
 * Parse the element to get the message info (type text-message)
 * @param el element to parse
 * @returns message info
 */
const parseTextMessage = (el: Element): ChatMessage => {
  const params = parseCommonElements(el);
  const html = getMessageHtml(el, '[data-a-target="chat-line-message-body"]');

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
const parsePaidMessage = (el: Element): ChatMessage => {
  const params = parseCommonElements(el);
  const html = getMessageHtml(el, '#message');
  const donation = getDonationAmount(el);

  return {
    ...params,
    html,
    donation,
    messageType: 'paid-message',
  };
};

/**
 * Parse the element to get the message info (type paid-sticker)
 * @param el element to parse
 * @returns message info
 */
const parsePaidSticker = (el: Element): ChatMessage => {
  const params = parseCommonElements(el);
  const donation = getDonationAmount(el);

  return {
    ...params,
    donation,
    messageType: 'paid-sticker',
  };
};

/**
 * Parse the element to get the message info (type membership-item)
 * @param el element to parse
 * @returns message info
 */
const parseMembershipItem = (el: Element): ChatMessage => {
  const params = parseCommonElements(el);
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
    donation,
    messageType: 'membership-item',
  };
};

export const parseTwitchChat = (chat: ChatMessageData): ChatMessage | undefined => {
  const el = document.createElement('div');
  el.innerHTML = chat.html;
  switch (chat.tagName) {
    case 'div':
      return parseTextMessage(el);
  }
  return {} as ChatMessage;
};
