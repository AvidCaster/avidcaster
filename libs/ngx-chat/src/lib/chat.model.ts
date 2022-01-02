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

export type ChatHosts = 'youtube' | 'twitch';

export interface ChatHostReady {
  host?: ChatHosts;
  ready: boolean;
}

export enum ChatDownstreamAction {
  pong = 'pong',
  chat = 'chat',
  ready = 'ready',
}

export enum ChatUpstreamAction {
  iframe = 'iframe',
  ping = 'ping',
  observe = 'observe',
}

export enum ChatScreenDirection {
  NorthBound = 'avidcaster-chat-north-bound',
  SouthBound = 'avidcaster-chat-south-bound',
}

export enum ChatMessageType {
  Common = 'common',
  Donation = 'donation',
  Membership = 'membership',
}

export interface ChatMessage {
  host?: ChatHosts;
  author?: string;
  avatarUrl?: string;
  badgeUrl?: string;
  message?: string;
  html?: string;
  donation?: string;
  membership?: string;
  messageType?: ChatMessageType;
}

export interface ChatMessageItem extends ChatMessage {
  id?: number;
  timestamp?: number;
  prefix?: string;
  streamId?: string;
  viewed?: boolean;
  highlighted?: boolean;
}

export interface ChatMessageItemsIndexedQueryType {
  id?: number;
  messageType?: ChatMessageType;
  prefix?: string;
  author?: string;
}

export interface ChatMessageData {
  tagName: string;
  html: string;
}

export interface ChatMessageEvent {
  type: ChatScreenDirection;
  host: ChatHosts;
  streamId: string;
  action: ChatUpstreamAction | ChatDownstreamAction;
  payload: ChatMessageData;
}

export interface ChatState {
  signature: string;
  isLtR: boolean;
  audioEnabled: boolean;
  fireworksEnabled: boolean;
  keywords: string[];
  primaryFilter: ChatMessagePrimaryFilterType;
  keywordsFilter: ChatMessageKeywordsFilterType;
  listFilter: ChatMessageListFilterType;
  fastForwardMode: boolean;
  autoScrollMode: boolean;
  iframePaused: boolean;
  isDarkTheme: boolean;
  chatVerticalPosition: number;
  chatHorizontalPosition: number;
  demoMode: boolean;
  backgroundColor: string;
  performanceMode: boolean;
}

export type ChatMessagePrimaryFilterType =
  | 'none'
  | 'atLeastOneWord'
  | 'atLeastTwoWords'
  | 'atLeastThreeWords'
  | 'startsWithQ'
  | 'startsWithA'
  | 'startsWithFrom';

export type ChatMessageKeywordsFilterType =
  | 'none'
  | 'host'
  | 'author'
  | 'filterBy'
  | 'filterOut'
  | 'highlight';

export type ChatMessageListFilterType = 'common' | 'donation' | 'membership';
