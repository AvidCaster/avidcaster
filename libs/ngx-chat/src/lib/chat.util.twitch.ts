/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { tryGet } from '@fullerstack/agx-util';
import * as $ from 'jquery';

import { CHAT_TWITCH_DEFAULT_AVATAR } from './chat.default';
import { ChatMessage, ChatMessageData } from './chat.model';

const getAuthor = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('[data-a-target="chat-message-username"]');
    return el.text().replace(/ +/g, ' ').trim();
  }, '');
};

const getAvatarUrl = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('[data-a-target="chat-badge"]').find('img').first();
    return el.attr('src').replace('/1', '/3').replace('/2', '/3').replace(/ +/g, ' ').trim();
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
    const mention = $obj.find('[data-a-target="chat-message-mention"]').text();
    const text = $obj.find('[data-a-target="chat-message-text"]').text();
    return `${mention} ${text}`.replace(/ +/g, ' ').trim();
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
    messageType: 'text-message',
  };
};

export const parseTwitchChat = (chat: ChatMessageData): ChatMessage | undefined => {
  let parsed = {} as ChatMessage;
  let el = $($.parseHTML(chat.html));
  switch (chat.tagName) {
    case 'div':
      parsed = parseCommonElements(el);
      break;
    default:
      console.log('unknown tagName', chat.tagName);
      break;
  }
  el = undefined;
  return parsed;
};
