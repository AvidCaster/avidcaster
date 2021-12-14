/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { tryGet } from '@fullerstack/agx-util';
import * as $ from 'jquery';

import { CHAT_TWITCH_DEFAULT_AVATAR } from '../chat.default';
import { ChatMessage, ChatMessageEvent, ChatMessageItem, ChatMessageType } from '../chat.model';

const getAuthor = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('[data-a-target="chat-message-username"]');
    return el.text().replace(/ +/g, ' ').trim();
  }, '');
};

const getAvatarUrl = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('[data-a-target="chat-badge"]').find('img').first();
    return el.attr('src').replace(/1$/, '3').replace(/2$/, '3').replace(/ +/g, ' ').trim();
  }, CHAT_TWITCH_DEFAULT_AVATAR);
};

const getBadgeUrl = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('[data-a-target="chat-badge"]').find('img').last();
    return el.attr('src').replace('/1', '/3').replace('/2', '/3').replace(/ +/g, ' ').trim();
  }, '');
};

const getMessageHtml = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    let el = $obj.find('[data-test-selector="chat-line-message-body"]').clone();
    el.find('[data-a-target="chat-message-mention"]').contents().unwrap();
    el.find('[data-a-target="chat-message-text"]').contents().unwrap();
    el.find('[data-test-selector="emote-button"]').each(function () {
      const src = $(this)
        .find('img')
        .attr('src')
        .replace('/1.0', '/3.0')
        .replace(/ +/g, ' ')
        .trim();

      if (src) {
        $(this).replaceWith(`<img src="${src}" />`);
      } else {
        $(this).remove();
      }
    });

    el.children().not('img').remove();

    const html = el.html();

    el = undefined;
    return html.replace(/ +/g, ' ').trim();
  }, '');
};

const getMessageText = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const mention = $obj.find('[data-a-target="chat-message-mention"]').text();
    const text = $obj.find('[data-a-target="chat-message-text"]').text();
    return `${mention} ${text}`.replace(/ +/g, ' ').trim();
  }, '');
};

const getPurchaseAmount = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    // not working yet
    const amount = $obj.find('[data-a-target="chat-message-purchase-amount"]').text();
    return amount.replace(/ +/g, ' ').trim();
  }, '');
};

const parseCommonElements = (el: JQuery<Node[]>): ChatMessage => {
  return {
    author: getAuthor(el),
    message: getMessageText(el),
    html: getMessageHtml(el),
    avatarUrl: getAvatarUrl(el),
    badgeUrl: getBadgeUrl(el),
    donation: getPurchaseAmount(el),
    messageType: ChatMessageType.Common,
  };
};

export const parseTwitchChat = (event: ChatMessageEvent): ChatMessageItem | undefined => {
  let parsed = {} as ChatMessage;
  let el = $($.parseHTML(event?.payload?.html));
  switch (event?.payload.tagName) {
    case 'div':
      parsed = parseCommonElements(el);
      break;
    default:
      console.log('unknown tagName', event?.payload.tagName);
      break;
  }
  el = undefined;
  return { ...parsed, host: event?.host };
};
