/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { OperatorFunction } from 'rxjs';

export enum ChatMessageHosts {
  youtube = 'youtube',
  twitch = 'twitch',
}

export type ChatMessage = {
  host?: ChatMessageHosts;
  author?: string;
  avatarUrl?: string;
  badgeUrl?: string;
  message?: string;
  html?: string;
  donation?: string;
  membership?: string;
  messageType?: string;
};

export type ChatDirection = 'avidcaster-chat-north-bound' | 'avidcaster-chat-south-bound';
export type ChatAction = 'chat' | 'ping' | 'pong' | 'iframe';

export type ChatMessageData = {
  tagName: string;
  html: string;
};

export type ChatMessageEvent = {
  type: ChatDirection;
  action: ChatAction;
  host: ChatMessageHosts;
  payload: ChatMessageData;
};

export type BufferDebounce = <T>(time: number) => OperatorFunction<T, T[]>;
export type BufferThrottle = <T>(time: number) => OperatorFunction<T, T[]>;
