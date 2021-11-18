/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export const YTCHAT_STORAGE_KEY = 'ytchat';
export const YTCHAT_URL = '/ytchat';

/**
 * Layout config declaration
 */
export interface YtChatConfig {
  logState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export interface YtChatMessage {
  donation?: string;
  authorName?: string;
  authorImage?: string;
  authorBadge?: string;
  message?: {
    html: string;
    length: number;
  };
}
