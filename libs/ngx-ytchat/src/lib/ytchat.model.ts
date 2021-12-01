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

export interface YTChatInfo {
  donation?: string;
  authorName?: string;
  authorImage?: string;
  message?: string;
  membership?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export type YTChatMessageDataType = 'avidcaster-chat-north-bound' | 'avidcaster-chat-south-bound';
export type YTChatMessageAction = 'fullscreen' | 'navigate' | 'observe';
export type YTChatWordAction = 'highlight' | 'filter';

export interface YTChatMessageData {
  type: YTChatMessageDataType;
  action: YTChatMessageAction;
  payload?: any;
}

export interface YTChatObserver {
  container: string;
  selectors: string[];
}
