/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CHAT_OVERLAY_SCREEN_URL, ChatSupportedSites } from '../chat.default';
import { ChatMessageFilterType, ChatMessageItem, ChatState } from '../chat.model';

export const isSiteSupported = (site: string): boolean => {
  return Object.keys(ChatSupportedSites).includes(site);
};

export const includesEmoji = (str: string): boolean => {
  const EmojiRegexExp =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

  return EmojiRegexExp.test(str);
};

/**
 * Give a chat message item, return it if it matches the filters, or return undefined
 * @param chat incoming chat message
 * @param state chat state
 * @returns chat message item or undefined
 */
export const filterChatMessageItem = (
  chat: ChatMessageItem,
  state: ChatState
): ChatMessageItem | undefined => {
  switch (ChatMessageFilterType[state.filterOption]) {
    case ChatMessageFilterType.Host: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat.host.toLowerCase() === word.toLowerCase())
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.Author: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat.author.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.Donation: {
      return chat?.donation ? chat : undefined;
    }
    case ChatMessageFilterType.Membership: {
      return chat?.membership ? chat : undefined;
    }
    case ChatMessageFilterType.FilterBy: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat.message.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.FilterOut: {
      return state.keywords.length < 1
        ? chat
        : !state.keywords?.some((word) => chat.message.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.Highlight: {
      if (state.keywords?.some((word) => chat.message.includes(word))) {
        chat.highlighted = true;
      } else {
        chat.highlighted = false;
      }
      return chat;
    }
    case ChatMessageFilterType.None:
    default:
      break;
  }
  return chat;
};

/**
 * Open a window to the chat overlay screen
 * @param targetWindow window object
 * @param width width of the window
 * @param height high of the window
 */
export const openOverlayWindowScreen = (
  targetWindow: Window,
  width = '1280',
  height = '720'
): void => {
  targetWindow.open(
    CHAT_OVERLAY_SCREEN_URL,
    '_blank',
    `width=${width},height=${height},left=100,top=100`
  );
};
