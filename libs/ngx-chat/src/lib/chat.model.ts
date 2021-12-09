/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/**
 * Layout config declaration
 */
export interface ChatConfig {
  logState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export type ChatMessageHosts = 'youtube' | 'twitch';

export interface ChatMessageHostReady {
  host?: ChatMessageHosts;
  ready: boolean;
}

export enum ChatMessageDownstreamAction {
  pong = 'pong',
  chat = 'chat',
  ready = 'ready',
}

export enum ChatMessageUpstreamAction {
  iframe = 'iframe',
  ping = 'ping',
  observe = 'observe',
}

export enum ChatMessageDirection {
  NorthBound = 'avidcaster-chat-north-bound',
  SouthBound = 'avidcaster-chat-south-bound',
}

export interface ChatMessage {
  host?: ChatMessageHosts;
  author?: string;
  avatarUrl?: string;
  badgeUrl?: string;
  message?: string;
  html?: string;
  donation?: string;
  membership?: string;
  messageType?: string;
}

export interface ChatMessageItem extends ChatMessage {
  timestamp?: number;
  prefix?: string;
  streamId?: string;
  viewed?: boolean;
}

export interface ChatMessageData {
  tagName: string;
  html: string;
}

export interface ChatMessageEvent {
  type: ChatMessageDirection;
  host: ChatMessageHosts;
  streamId: string;
  action: ChatMessageUpstreamAction | ChatMessageDownstreamAction;
  payload: ChatMessageData;
}

export enum ChatMessageFilter {}

export interface ChatState {
  signature: string;
  isLtR: boolean;
  tags: string[];
  audioEnabled: boolean;
  audioPlay: boolean;
  fireworksEnabled: boolean;
  fireworksPlay: boolean;
  words: string[];
  wordsAction: string;
}
