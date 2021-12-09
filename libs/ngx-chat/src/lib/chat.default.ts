/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { cloneDeep as ldDeepClone } from 'lodash-es';

import { ChatConfig, ChatMessageFilterType, ChatMessageItem, ChatState } from './chat.model';

/**
 * Default configuration - Layout module
 */
const DefaultChatConfig: ChatConfig = {
  logState: false,
};

export const defaultChatConfig = (): ChatConfig => {
  return ldDeepClone(DefaultChatConfig);
};

export const ChatSupportedSites = {
  youtube: {
    observer: {
      container: '#item-list.yt-live-chat-renderer',
      selectors: [
        'yt-live-chat-text-message-renderer',
        'yt-live-chat-paid-message-renderer',
        'yt-live-chat-membership-item-renderer',
        'yt-live-chat-paid-sticker-renderer',
      ],
    },
    iframe: {
      container: 'yt-live-chat-app',
    },
  },
  twitch: {
    observer: {
      container: '.simplebar-content .chat-scrollable-area__message-container',
      selectors: ['div'],
    },
    iframe: {
      container: '.stream-chat',
    },
  },
};

export const CHAT_IFRAME_URL = '/chat/iframe';
export const CHAT_OVERLAY_SCREEN_URL = '/chat/overlay/screen';
export const CHAT_URL_FULLSCREEN_LIST = [CHAT_IFRAME_URL, CHAT_OVERLAY_SCREEN_URL];

export const CHAT_STORAGE_KEY = 'avidcaster-chat-message';
export const CHAT_STORAGE_KEY_OVERLAY_REQUEST = `${CHAT_STORAGE_KEY}-overlay-request`;
export const CHAT_STORAGE_KEY_OVERLAY_RESPONSE = `${CHAT_STORAGE_KEY}-overlay-response`;

export const CHAT_YOUTUBE_DEFAULT_AVATAR = './assets/images/misc/avatar-default-youtube.png';
export const CHAT_TWITCH_DEFAULT_AVATAR = './assets/images/misc/avatar-default-twitch.png';
export const CHAT_DEFAULT_AVATAR = './assets/images/misc/avatar-default-red.png';

export const CHAT_STATE_STORAGE_KEY = 'avidcaster-chat-state';

const DefaultChatState = {
  signature: '',
  isLtR: true,
  tags: [],
  audioEnabled: false,
  audioPlay: false,
  fireworksEnabled: true,
  fireworksPlay: false,
  words: [],
  wordsAction: '',
};

export const defaultChatState = (): ChatState => {
  return ldDeepClone(DefaultChatState);
};

/**
 * Default configuration - Layout module
 */
const DefaultChatTest: ChatMessageItem = {
  author: 'Mike Tyson',
  message: 'My dog loves lives loves his bag, same one since puppy',
  html: 'My dog loves lives loves his bag, same one since puppy',
  avatarUrl: CHAT_YOUTUBE_DEFAULT_AVATAR,
  badgeUrl: '',
  donation: '$100',
  messageType: 'text-message',
  host: 'youtube',
  streamId: 'NfG9ApM_yTE',
  timestamp: 1639013100520,
  prefix: 'NfG9ApM_yTE',
};

export const defaultChatTest = (): ChatMessageItem => {
  return ldDeepClone(DefaultChatTest);
};

export const ChatFilterOptions = {
  [ChatMessageFilterType.None]: _('FILTER.NONE'),
  [ChatMessageFilterType.Host]: _('FILTER.HOST'),
  [ChatMessageFilterType.Author]: _('FILTER.AUTHOR'),
  [ChatMessageFilterType.Donation]: _('FILTER.DONATION'),
  [ChatMessageFilterType.FilterBy]: _('FILTER.BY'),
  [ChatMessageFilterType.FilterOut]: _('FILTER.OUT'),
  [ChatMessageFilterType.Highlight]: _('FILTER.HIGHLIGHT'),
};
