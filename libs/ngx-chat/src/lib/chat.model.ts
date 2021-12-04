/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

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
export type ChatAction = 'chat-new' | 'ping-down' | 'ping-up';

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
