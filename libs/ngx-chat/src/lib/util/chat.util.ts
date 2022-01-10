/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DeepReadonly } from 'ts-essentials';

import {
  CHAT_DASHBOARD_DEFAULT_HEIGHT,
  CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET,
  CHAT_DASHBOARD_DEFAULT_WIDTH,
  CHAT_OVERLAY_SCREEN_URL,
  ChatSupportedSites,
} from '../chat.default';
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
 * Open a window to the chat overlay screen
 * @param targetWindow window object
 * @param width width of the window
 * @param height high of the window
 */
export const openOverlayWindowScreen = (
  targetWindow: Window,
  width = 1280,
  height = 720,
  top = 100,
  left = 100
): Window => {
  return targetWindow.open(
    CHAT_OVERLAY_SCREEN_URL,
    '_blank',
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width},height=${height},left=${left},top=${top}`
  );
};

/**
 * Resize and center the chat overlay screen
 * @param winDow Window object
 */
export const getDashboardCoordinates = (
  winDow: Window
): { width: number; height: number; top: number; left: number } => {
  // coordinates of the chat dashboard
  let top = 0;
  let left = 0;

  // we take all the width up to the default chat width
  let width = CHAT_DASHBOARD_DEFAULT_WIDTH;
  if (winDow.screen.availWidth <= CHAT_DASHBOARD_DEFAULT_WIDTH) {
    width = winDow.screen.availWidth;
  } else {
    left = winDow.screen.availWidth / 2 - winDow.top.outerWidth / 2;
  }

  // we take all the height up to the default chat height minus the header (offset)
  let height = CHAT_DASHBOARD_DEFAULT_HEIGHT;
  if (winDow.screen.availHeight <= CHAT_DASHBOARD_DEFAULT_HEIGHT) {
    height = winDow.screen.availHeight - CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET;
    top = CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET * 2;
  } else {
    top =
      winDow.top.screen.availHeight / 2 -
      winDow.top.outerHeight / 2 +
      CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET;
  }

  return {
    width,
    height,
    top,
    left,
  };
};

export const storageBroadcast = (storageObj: Storage, key: string, value: string): void => {
  storageObj?.setItem(key, value);
  storageObj?.removeItem(key);
};
