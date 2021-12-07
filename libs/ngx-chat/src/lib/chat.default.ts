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

export const CHAT_URL_FULLSCREEN_LIST = ['/chat/iframe', '/chat/overlay/screen'];

export const CHAT_STORAGE_KEY = 'avidcaster-chat';
export const CHAT_STORAGE_KEY_OVERLAY_REQUEST = `${CHAT_STORAGE_KEY}-overlay-request`;
export const CHAT_STORAGE_KEY_OVERLAY_RESPONSE = `${CHAT_STORAGE_KEY}-overlay-response`;

export const CHAT_YOUTUBE_DEFAULT_AVATAR = './assets/images/misc/avatar-default-youtube.png';
export const CHAT_TWITCH_DEFAULT_AVATAR = './assets/images/misc/avatar-default-twitch.png';
export const CHAT_DEFAULT_AVATAR = './assets/images/misc/avatar-default-red.png';
