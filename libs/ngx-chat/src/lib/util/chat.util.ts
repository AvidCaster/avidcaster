/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DeepReadonly } from 'ts-essentials';

import { CHAT_OVERLAY_SCREEN_URL, ChatSupportedSites } from '../chat.default';
import {
  ChatMessageItem,
  ChatMessagePrimaryFilterType,
  ChatMessageSecondaryFilterType,
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
export const secondaryChatFilter = (
  chat: ChatMessageItem,
  state: DeepReadonly<ChatState>
): ChatMessageItem | undefined => {
  if (!(chat || chat?.html || chat?.message)) {
    return undefined;
  }

  switch (ChatMessageSecondaryFilterType[state.secondaryFilterOption]) {
    case ChatMessageSecondaryFilterType.Host: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat?.host.toLowerCase() === word.toLowerCase())
        ? chat
        : undefined;
    }
    case ChatMessageSecondaryFilterType.Author: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat?.author.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageSecondaryFilterType.FilterBy: {
      return state.keywords.length < 1
        ? chat
        : state.keywords?.some((word) => chat?.message.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageSecondaryFilterType.FilterOut: {
      return state.keywords.length < 1
        ? chat
        : !state.keywords?.some((word) => chat?.message.includes(word))
        ? chat
        : undefined;
    }
    case ChatMessageSecondaryFilterType.Highlight: {
      if (state.keywords?.some((word) => chat?.message.includes(word))) {
        chat.highlighted = true;
      } else {
        chat.highlighted = false;
      }
      return chat;
    }
    case ChatMessageSecondaryFilterType.None:
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
export const primaryChatFilter = (
  chat: ChatMessageItem,
  state: DeepReadonly<ChatState>
): ChatMessageItem | undefined => {
  if (!(chat || chat?.html || chat?.message)) {
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
    case ChatMessagePrimaryFilterType.None:
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

export const storageBroadcast = (storageObj: Storage, key: string, value: string): void => {
  storageObj?.setItem(key, value);
  storageObj?.removeItem(key);
};
