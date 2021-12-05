/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChatMessageHosts } from './chat.model';

export const ChatSupportedSites = {
  [ChatMessageHosts.youtube]: {
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
  [ChatMessageHosts.twitch]: {
    observer: {
      container: '.simplebar-content .chat-scrollable-area__message-container',
      selectors: ['div'],
    },
    iframe: {
      container: '[data-test-selector="chat-room-component-layout"]',
    },
  },
};

export const CHAT_URL_FULLSCREEN = '/chat/monitor/iframe';

export const CHAT_STORAGE_KEY = 'avidcaster-chat';
