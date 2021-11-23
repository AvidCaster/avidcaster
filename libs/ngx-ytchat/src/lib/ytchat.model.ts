/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export const YTCHAT_STORAGE_KEY = 'ytchat';
export const YTCHAT_URL_FULLSCREEN = '/chat/youtube/overlay';

/**
 * Layout config declaration
 */
export interface YTChatConfig {
  logState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export interface YTChatState {
  logger: boolean;
}

export interface YTChatState {
  signature: string;
}

export interface YTChatPayload {
  donation?: string;
  authorName?: string;
  authorImage?: string;
  authorBadge?: string;
  message?: string;
  membership?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export type YTChatMessageDataType =
  | 'avidcaster-overlay-north-bound'
  | 'avidcaster-overlay-south-bound';
export type YTChatMessageAction =
  | 'append-script'
  | 'append-style'
  | 'declutter'
  | 'reclutter'
  | 'highlight-words'
  | 'filtered-words'
  | 'fullscreen'
  | 'navigate'
  | 'yt-chat';

export interface YTChatMessageData {
  type: YTChatMessageDataType;
  action: YTChatMessageAction;
  payload?: YTChatPayload;
}
