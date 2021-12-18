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
  ChatMessageItem,
  ChatMessageListFilterType,
  ChatMessagePrimaryFilterType,
  ChatMessageSecondaryFilterType,
  ChatMessageType,
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

export const CHAT_DEFAULT_PREFIX = 'avidcaster';

/**
 * Default configuration - Layout module
 */
const WelcomeChat: ChatMessageItem = {
  author: 'AvidCaster',
  message: 'Welcome to AvidCaster chat overlay!',
  html: 'Welcome to AvidCaster chat overlay!',
  avatarUrl: CHAT_DEFAULT_LOGO,
  messageType: ChatMessageType.Common,
  streamId: CHAT_DEFAULT_PREFIX,
  prefix: CHAT_DEFAULT_PREFIX,
};

export const welcomeChat = (): ChatMessageItem => {
  return ldDeepClone(WelcomeChat);
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

export const ChatSecondaryFilterOptions = {
  [ChatMessageSecondaryFilterType.None]: _('FILTER.NONE'),
  [ChatMessageSecondaryFilterType.Host]: _('FILTER.HOST'),
  [ChatMessageSecondaryFilterType.Author]: _('FILTER.AUTHOR'),
  [ChatMessageSecondaryFilterType.FilterBy]: _('FILTER.BY'),
  [ChatMessageSecondaryFilterType.FilterOut]: _('FILTER.OUT'),
  [ChatMessageSecondaryFilterType.Highlight]: _('FILTER.HIGHLIGHT'),
};

export const ChatListFilterOptions = {
  [ChatMessageType.Common]: _('CHAT.FILTER_LIST.COMMON'),
  [ChatMessageType.Donation]: _('CHAT.FILTER_LIST.DONATION'),
  [ChatMessageType.Membership]: _('CHAT.FILTER_LIST.MEMBERSHIP'),
};

// chat display limit (visible / scrollable)
export const CHAT_MESSAGE_LIST_DISPLAY_LIMIT = 50;
// chat buffer, to keep
export const CHAT_MESSAGE_LIST_BUFFER_SIZE = 100;
// extra buffer offset, allow buffer size to grow before trimming it
export const CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE = 25;

// chat position slider max value
export const CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE = 220;

// default mid-level chat vertical position
export const CHAT_VERTICAL_POSITION_MID_LEVEL_DEFAULT_VALUE =
  CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE / 2;

const DefaultChatState: ChatState = {
  signature: '',
  isLtR: true,
  audioEnabled: false,
  fireworksEnabled: true,
  fireworksPlay: false,
  keywords: [],
  chatListOption: ChatMessageListFilterType.Common,
  primaryFilterOption: ChatMessagePrimaryFilterType.None,
  secondaryFilterOption: ChatMessageSecondaryFilterType.None,
  ffEnabled: false,
  autoScrollEnabled: true,
  iframePaused: false,
  isDarkTheme: false,
  chatVerticalPosition: CHAT_VERTICAL_POSITION_MID_LEVEL_DEFAULT_VALUE,
};

export const defaultChatState = (): ChatState => {
  return ldDeepClone(DefaultChatState);
};
