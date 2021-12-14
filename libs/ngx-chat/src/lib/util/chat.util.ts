/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CHAT_OVERLAY_SCREEN_URL, ChatSupportedSites } from '../chat.default';
import {
  ChatMessageFilterType,
  ChatMessageItem,
  ChatMessagePrimaryFilterType,
  ChatState,
} from '../chat.model';

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
  if (!chat || !chat?.message) {
    return undefined;
  }

  switch (ChatMessageFilterType[state.filterOption]) {
    case ChatMessageFilterType.Host: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat?.host.toLowerCase() === word.toLowerCase())
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.Author: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat?.author.includes(word))
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
        : state.keywords?.some((word) => chat?.message.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.FilterOut: {
      return state.keywords.length < 1
        ? chat
        : !state.keywords?.some((word) => chat?.message.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.Highlight: {
      if (state.keywords?.some((word) => chat?.message.includes(word))) {
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
 * Give a chat message item (iframe), return it if it matches the filters, or return undefined
 * @param chat incoming chat message
 * @param state chat state
 * @returns chat message item or undefined
 */
export const primaryFilterChatMessageItem = (
  chat: ChatMessageItem,
  state: ChatState
): ChatMessageItem | undefined => {
  if (!chat || !chat?.message) {
    return undefined;
  }

  switch (ChatMessagePrimaryFilterType[state.primaryFilterOption]) {
    case ChatMessagePrimaryFilterType.MiniumWordOne: {
      return chat?.message?.split(' ')?.length >= 1 ? chat : undefined;
    }
    case ChatMessagePrimaryFilterType.MiniumWordTwo: {
      return chat?.message?.split(' ').length >= 2 ? chat : undefined;
    }
    case ChatMessagePrimaryFilterType.MiniumWordThree: {
      return chat?.message.split(' ')?.length >= 3 ? chat : undefined;
    }
    case ChatMessagePrimaryFilterType.StartWithQ: {
      return chat?.message?.toUpperCase().startsWith('Q:')
        ? chat
        : chat?.message?.toUpperCase().startsWith('QA:')
        ? chat
        : undefined;
    }
    case ChatMessagePrimaryFilterType.StartWithA: {
      return chat?.message?.toUpperCase().startsWith('A:') ? chat : undefined;
    }
    case ChatMessagePrimaryFilterType.StartWithFrom: {
      return chat?.message?.toUpperCase().startsWith('FROM:')
        ? chat
        : chat?.message?.toUpperCase().startsWith('HELLO FROM')
        ? chat
        : undefined;
    }
    case ChatMessageFilterType.None:
    default:
      break;
  }
  return chat;
};

// export const getIndexedDbDocKey = (state: ChatState): string => {
//   switch (ChatMessageFilterType[state.filterOption]) {
//     case ChatMessageFilterType.Donation:
//       return ChatDbCollectionType.Donation;
//     case ChatMessageFilterType.Membership:
//       return ChatDbCollectionType.Membership;
//     default:
//       break;
//   }
//   return ChatDbCollectionType.Regular;
// };

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

export const storageBroadcast = (storageObj: Storage, key: string, value: string): void => {
  storageObj?.setItem(key, value);
  storageObj?.removeItem(key);
};
