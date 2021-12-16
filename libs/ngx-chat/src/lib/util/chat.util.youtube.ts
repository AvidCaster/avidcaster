/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { tryGet } from '@fullerstack/agx-util';
import * as $ from 'jquery';

import { CHAT_YOUTUBE_DEFAULT_AVATAR } from '../chat.default';
import { ChatMessage, ChatMessageEvent, ChatMessageItem, ChatMessageType } from '../chat.model';
import { includesEmoji } from './chat.util';

const getAuthor = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('#author-name');
    el.find('#tooltip.hidden').remove();
    return el.text().replace(/ +/g, ' ').trim();
  }, '');
};

const getAvatarUrl = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('#img');
    return el
      .attr('src')
      .replace('=s32', '=s256')
      .replace('=s64', '=s256')
      .replace(/ +/g, ' ')
      .trim();
  }, CHAT_YOUTUBE_DEFAULT_AVATAR);
};

const getBadgeUrl = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    const el = $obj.find('#chat-badges .yt-live-chat-author-badge-renderer');
    const avatarUrl = el.find('img').attr('src') || '';
    return avatarUrl.replace(/ +/g, ' ').trim();
  }, '');
};

const getMessageHtml = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    let el = $obj.find('#message').clone();

    el.find('hidden').remove();
    el.find('font').contents().unwrap();
    el.find('img').each(function () {
      const alt = $(this).attr('alt').replace(/ +/g, ' ').trim();
      if (alt && includesEmoji(alt)) {
        $(this).replaceWith(alt);
      } else {
        $(this).replaceWith('');
      }
    });

    el.children().remove();

    const html = el.html();

    el = undefined;
    return html.replace(/ +/g, ' ').trim();
  }, '');
};

const getMessageText = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    let el = $obj.find('#message').clone();

    el.find('font').contents().unwrap();
    el.children().remove();

    const text = el.text() || '';

    el = undefined;
    return text.replace(/ +/g, ' ').trim();
  }, '');
};

const getPurchaseAmount = ($obj: JQuery<Node[]>): string => {
  return tryGet(() => {
    let amount = $obj.find('#purchase-amount').text();
    if (!amount) {
      amount = $obj.find('#purchase-amount-chip').text();
    }
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

const parsePaidMessage = (el: JQuery<Node[]>): ChatMessage => {
  const params = parseCommonElements(el);
  params.messageType = ChatMessageType.Donation;
  return params;
};

const parsePaidSticker = (el: JQuery<Node[]>): ChatMessage => {
  const params = parseCommonElements(el);
  params.messageType = ChatMessageType.Donation;
  return params;
};

const parseMembershipItem = (el: JQuery<Node[]>): ChatMessage => {
  const params = parseCommonElements(el);
  if (params.html && !params.donation) {
    // milestone chat
    params.membership = tryGet(
      () => el.find('#header-primary-text').text().replace(/ +/g, ' ').trim(),
      ''
    );
  } else {
    params.html = tryGet(() => el.find('#header-subtext').html().replace(/ +/g, ' ').trim(), '');
  }

  params.messageType = ChatMessageType.Membership;
  return params;
};

export const parseYouTubeChat = (event: ChatMessageEvent): ChatMessageItem | undefined => {
  let parsed = {} as ChatMessageItem;
  let el = $($.parseHTML(event?.payload.html));
  switch (event?.payload.tagName) {
    case 'yt-live-chat-text-message-renderer':
      parsed = parseCommonElements(el);
      break;
    case 'yt-live-chat-paid-message-renderer':
      parsed = parsePaidMessage(el);
      break;
    case 'yt-live-chat-paid-sticker-renderer':
      parsed = parsePaidSticker(el);
      break;
    case 'yt-live-chat-membership-item-renderer':
      parsed = parseMembershipItem(el);
      break;
    default:
      break;
  }
  el = undefined;
  return { ...parsed, host: event?.host };
};
