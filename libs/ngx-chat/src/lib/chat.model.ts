/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { OperatorFunction } from 'rxjs';

export type ChatMessageHosts = 'youtube' | 'twitch';

export enum ChatMessageDownstreamAction {
  pong = 'pong',
  chat = 'chat',
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

export type BufferDebounce = <T>(time: number) => OperatorFunction<T, T[]>;
export type BufferThrottle = <T>(time: number) => OperatorFunction<T, T[]>;
