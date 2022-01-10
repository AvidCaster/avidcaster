/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { cloneDeep as ldDeepClone } from 'lodash-es';

import { ChatConfig, ChatMessageItem, ChatMessageType, ChatState } from './chat.model';

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
export const CHAT_MANAGER_ADMIN_URL = '/chat/manager/admin';
export const CHAT_URL_FULLSCREEN_LIST = [CHAT_IFRAME_URL, CHAT_MANAGER_ADMIN_URL];

export const CHAT_STORAGE_KEY_PREFIX = 'avidcaster-chat';
export const CHAT_STORAGE_BROADCAST_KEY_PREFIX = `${CHAT_STORAGE_KEY_PREFIX}-broadcast`;
export const CHAT_STORAGE_MESSAGE_HEARTBEAT_KEY = `${CHAT_STORAGE_BROADCAST_KEY_PREFIX}-heartbeat`;
export const CHAT_STORAGE_MANAGER_IFRAME_REQUEST_KEY = `${CHAT_STORAGE_BROADCAST_KEY_PREFIX}-iframe-request`;
export const CHAT_STORAGE_MANAGER_ADMIN_RESPONSE_KEY = `${CHAT_STORAGE_BROADCAST_KEY_PREFIX}-admin-response`;
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
  message: 'Welcome to AvidCaster Chat Manager Admin!',
  html: 'Welcome to AvidCaster Chat Manager Admin!',
  avatarUrl: CHAT_DEFAULT_LOGO,
  messageType: ChatMessageType.Common,
  streamId: CHAT_DEFAULT_PREFIX,
  prefix: CHAT_DEFAULT_PREFIX,
};

export const welcomeChat = (): ChatMessageItem => {
  return ldDeepClone(WelcomeChat);
};

export const ChatPrimaryFilterOptions = {
  none: _('FILTER.NONE'),
  atLeastOneWord: _('FILTER.MINIUM_WORD_ONE'),
  atLeastTwoWords: _('FILTER.MINIUM_WORD_TWO'),
  atLeastThreeWords: _('FILTER.MINIUM_WORD_THREE'),
  startsWithQ: _('FILTER.START_WITH_Q'),
  startsWithA: _('FILTER.START_WITH_A'),
  startsWithFrom: _('FILTER.START_WITH_FROM'),
};

export const ChatKeywordsFilterOptions = {
  none: _('FILTER.NONE'),
  host: _('FILTER.HOST'),
  author: _('FILTER.AUTHOR'),
  filterBy: _('FILTER.BY'),
  filterOut: _('FILTER.OUT'),
  highlight: _('FILTER.HIGHLIGHT'),
};

export const ChatListFilterOptions = {
  common: _('CHAT.FILTER_LIST.COMMON'),
  donation: _('CHAT.FILTER_LIST.DONATION'),
  membership: _('CHAT.FILTER_LIST.MEMBERSHIP'),
};

// chat display limit (visible / scrollable)
export const CHAT_MESSAGE_LIST_DISPLAY_LIMIT = 50;
// chat buffer, to keep
export const CHAT_MESSAGE_LIST_BUFFER_SIZE = 100;
// extra buffer offset, allow buffer size to grow before trimming it
export const CHAT_MESSAGE_LIST_BUFFER_OFFSET_SIZE = 25;

// chat vertical position slider max value
export const CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE = 220;

// default vertical mid-level chat vertical position
export const CHAT_VERTICAL_POSITION_MID_LEVEL_DEFAULT_VALUE =
  CHAT_VERTICAL_POSITION_SLIDER_MAX_VALUE / 2;

// chat position slider max value
export const CHAT_HORIZONTAL_POSITION_SLIDER_MAX_VALUE = 300;

// default horizontal position
export const CHAT_HORIZONTAL_POSITION_MID_LEVEL_DEFAULT_VALUE = 1;

// default background color
export const CHAT_BACKGROUND_COLOR_DEFAULT_VALUE = '#000000';

const DefaultChatState: ChatState = {
  signature: '',
  isLtR: true,
  audioEnabled: false,
  fireworksEnabled: true,
  keywords: [],
  listFilter: 'common',
  keywordsFilter: 'none',
  primaryFilter: 'none',
  fastForwardMode: false,
  autoScrollMode: true,
  iframePaused: false,
  isDarkTheme: false,
  chatVerticalPosition: CHAT_VERTICAL_POSITION_MID_LEVEL_DEFAULT_VALUE,
  chatHorizontalPosition: CHAT_HORIZONTAL_POSITION_MID_LEVEL_DEFAULT_VALUE,
  demoMode: false,
  backgroundColor: CHAT_BACKGROUND_COLOR_DEFAULT_VALUE,
  performanceMode: true,
};

export const defaultChatState = (): ChatState => {
  return ldDeepClone(DefaultChatState);
};

const DefaultHostColor = {
  youtube: 'warn',
  twitch: 'info',
  default: 'accent',
};

export const defaultHostColor = (): { [id: string]: string } => {
  return ldDeepClone(DefaultHostColor);
};

export const CHAT_DASHBOARD_DEFAULT_WIDTH = 1920;
export const CHAT_DASHBOARD_DEFAULT_HEIGHT = 1080;
export const CHAT_DASHBOARD_DEFAULT_TOP = 20; // pixels
export const CHAT_DASHBOARD_DEFAULT_LEFT = 20; // pixels
export const CHAT_DASHBOARD_DEFAULT_HEIGHT_OFFSET = 20; // pixels
