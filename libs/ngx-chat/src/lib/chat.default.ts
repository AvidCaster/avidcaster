/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { cloneDeep as ldDeepClone } from 'lodash-es';

import {
  ChatConfig,
  ChatMessageFilterType,
  ChatMessageItem,
  ChatMessagePrimaryFilterType,
  ChatState,
} from './chat.model';

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

export const CHAT_DB_MESSAGE_KEY = 'messages';

export const CHAT_STORAGE_KEY_PREFIX = 'avidcaster-chat';
export const CHAT_STORAGE_BROADCAST_KEY_PREFIX = `${CHAT_STORAGE_KEY_PREFIX}-broadcast`;
export const CHAT_STORAGE_MESSAGE_HEARTBEAT_KEY = `${CHAT_STORAGE_BROADCAST_KEY_PREFIX}-heartbeat`;
export const CHAT_STORAGE_OVERLAY_REQUEST_KEY = `${CHAT_STORAGE_BROADCAST_KEY_PREFIX}-overlay-request`;
export const CHAT_STORAGE_OVERLAY_RESPONSE_KEY = `${CHAT_STORAGE_BROADCAST_KEY_PREFIX}-overlay-response`;
export const CHAT_STORAGE_STATE_KEY = `${CHAT_STORAGE_KEY_PREFIX}-storage-state`;

export const CHAT_YOUTUBE_DEFAULT_AVATAR = './assets/images/misc/avatar-default-youtube.png';
export const CHAT_TWITCH_DEFAULT_AVATAR = './assets/images/misc/avatar-default-twitch.png';
export const CHAT_DEFAULT_AVATAR = './assets/images/misc/avatar-default-red.png';
export const CHAT_DEFAULT_LOGO = './assets/images/misc/avidcaster-chat-x128.png';

const DefaultChatState = {
  signature: '',
  isLtR: true,
  audioEnabled: false,
  fireworksEnabled: true,
  fireworksPlay: false,
  keywords: [],
  filterOption: '',
  primaryFilterOption: '',
  ffEnabled: false,
  autoScrollEnabled: true,
  iframePaused: false,
};

export const defaultChatState = (): ChatState => {
  return ldDeepClone(DefaultChatState);
};

/**
 * Default configuration - Layout module
 */
const DefaultChatTest: ChatMessageItem = {
  id: '1234334455',
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

/**
 * Default configuration - Layout module
 */
const WelcomeChat: ChatMessageItem = {
  author: 'AvidCaster',
  message: 'Welcome to AvidCaster chat overlay!',
  html: 'Welcome to AvidCaster chat overlay!',
  avatarUrl: CHAT_DEFAULT_LOGO,
  messageType: 'welcome-message',
  streamId: 'avidcaster',
  prefix: 'avidcaster',
};

export const welcomeChat = (): ChatMessageItem => {
  return ldDeepClone(WelcomeChat);
};

export const ChatFilterOptions = {
  [ChatMessageFilterType.None]: _('FILTER.NONE'),
  [ChatMessageFilterType.Host]: _('FILTER.HOST'),
  [ChatMessageFilterType.Author]: _('FILTER.AUTHOR'),
  [ChatMessageFilterType.Donation]: _('FILTER.DONATION'),
  [ChatMessageFilterType.Membership]: _('FILTER.MEMBERSHIP'),
  [ChatMessageFilterType.FilterBy]: _('FILTER.BY'),
  [ChatMessageFilterType.FilterOut]: _('FILTER.OUT'),
  [ChatMessageFilterType.Highlight]: _('FILTER.HIGHLIGHT'),
};

export const ChatPrimaryFilterOptions = {
  [ChatMessagePrimaryFilterType.None]: _('FILTER.NONE'),
  [ChatMessagePrimaryFilterType.MiniumWordOne]: _('FILTER.MINIUM_WORD_ONE'),
  [ChatMessagePrimaryFilterType.MiniumWordTwo]: _('FILTER.MINIUM_WORD_TWO'),
  [ChatMessagePrimaryFilterType.MiniumWordThree]: _('FILTER.MINIUM_WORD_THREE'),
  [ChatMessagePrimaryFilterType.StartWithQ]: _('FILTER.START_WITH_Q'),
  [ChatMessagePrimaryFilterType.StartWithA]: _('FILTER.START_WITH_A'),
  [ChatMessagePrimaryFilterType.StartWithFrom]: _('FILTER.START_WITH_FROM'),
};

// chat buffer to display
export const CHAT_MESSAGE_LIST_BUFFER_SIZE = 50;
// extra buffer not to display but to delay delete
export const CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE = 25;
