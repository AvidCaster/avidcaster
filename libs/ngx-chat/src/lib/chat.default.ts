/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

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
  },
  twitch: {
    observer: {
      container: '[data-test-selector="chat-scrollable-area__message-container"]',
      selectors: ['div'],
    },
  },
};

// , '.user-notice-line--highlighted'

export const CHAT_URL_FULLSCREEN = '/chat/monitor';

export const CHAT_STORAGE_KEY = 'avidcaster-chat';
