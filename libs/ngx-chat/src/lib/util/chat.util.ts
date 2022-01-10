/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DeepReadonly } from 'ts-essentials';

import { CHAT_MANAGER_ADMIN_URL, ChatSupportedSites } from '../chat.default';
import {
  ChatMessageItem,
  ChatMessageKeywordsFilterType,
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

export const searchByPrimaryFilter = (
  chat: ChatMessageItem,
  state: DeepReadonly<ChatState>
): ChatMessageItem | undefined => {
  if (!chat || !chat?.message) {
    return undefined;
  }

  if (!state?.primaryFilter) {
    return chat;
  }

  switch (state.primaryFilter as ChatMessagePrimaryFilterType) {
    case 'atLeastOneWord': {
      return chat?.message?.split(' ')?.length >= 1 ? chat : undefined;
    }
    case 'atLeastTwoWords': {
      return chat?.message?.split(' ').length >= 2 ? chat : undefined;
    }
    case 'atLeastThreeWords': {
      return chat?.message.split(' ')?.length >= 3 ? chat : undefined;
    }
    case 'startsWithQ': {
      return chat?.message?.toUpperCase().startsWith('Q:')
        ? chat
        : chat?.message?.toUpperCase().startsWith('QA:')
        ? chat
        : undefined;
    }
    case 'startsWithA': {
      return chat?.message?.toUpperCase().startsWith('A:') ? chat : undefined;
    }
    case 'startsWithFrom': {
      return chat?.message?.toUpperCase().startsWith('FROM:')
        ? chat
        : chat?.message?.toUpperCase().startsWith('HELLO FROM')
        ? chat
        : undefined;
    }
    case 'none':
    default:
      break;
  }
  return chat;
};

export const searchByKeywords = (
  chat: ChatMessageItem,
  state: DeepReadonly<ChatState>
): ChatMessageItem | undefined => {
  if (!chat || !chat?.message) {
    return undefined;
  }

  if (state?.keywords?.length < 1) {
    return chat;
  }

  if (!state?.keywordsFilter) {
    return chat;
  }

  switch (state.keywordsFilter as ChatMessageKeywordsFilterType) {
    case 'host': {
      return state.keywords
        .map((k) => k.toLowerCase())
        ?.some((word) => chat?.host?.toLowerCase() === word)
        ? chat
        : undefined;
    }
    case 'author': {
      return state.keywords
        .map((k) => k.toLowerCase())
        ?.some((word) => chat?.author?.toLowerCase().includes(word))
        ? chat
        : undefined;
    }
    case 'filterBy': {
      return state.keywords
        .map((k) => k.toLowerCase())
        ?.some((word) => chat?.message?.toLowerCase().includes(word))
        ? chat
        : undefined;
    }
    case 'filterOut': {
      return !state.keywords
        .map((k) => k.toLowerCase())
        ?.some((word) => chat?.message?.toLowerCase().includes(word))
        ? chat
        : undefined;
    }
    case 'highlight': {
      if (
        state.keywords
          .map((k) => k.toLowerCase())
          ?.some((word) => chat?.message?.toLowerCase().includes(word))
      ) {
        chat.highlighted = true;
      } else {
        chat.highlighted = false;
      }
      return chat;
    }
    case 'none':
    default:
      break;
  }
  return chat;
};

/**
 * Open a window to the chat manager screen
 * @param targetWindow window object
 * @param width width of the window
 * @param height high of the window
 */
export const openManagerAdmin = (
  targetWindow: Window,
  width = 1280,
  height = 720,
  top = 100,
  left = 100
): Window => {
  const restrictedAttrs =
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no';
  return targetWindow.open(
    CHAT_MANAGER_ADMIN_URL,
    '_blank',
    `${restrictedAttrs}, width=${width},height=${height},left=${left},top=${top}`
  );
};

export const storageBroadcast = (storageObj: Storage, key: string, value: string): void => {
  storageObj?.setItem(key, value);
  storageObj?.removeItem(key);
};
