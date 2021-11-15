/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export const YTCHAT_STORAGE_KEY = 'chat';
export const YTCHAT_URL = '/chat';

/**
 * Layout config declaration
 */
export interface YtchatConfig {
  logState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}
