/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export type ChatMessage = {
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
export type ChatSupportedHosts = 'youtube' | 'twitch';

export type ChatMessageData = {
  tagName: string;
  html: string;
};

export type ChatMessageEvent = {
  type: ChatDirection;
  action: ChatAction;
  host: ChatSupportedHosts;
  payload: ChatMessageData;
};
