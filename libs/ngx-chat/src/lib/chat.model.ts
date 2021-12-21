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

export enum ChatMessageDirection {
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
  type: ChatMessageDirection;
  host: ChatHosts;
  streamId: string;
  action: ChatUpstreamAction | ChatDownstreamAction;
  payload: ChatMessageData;
}

export enum ChatMessageFilter {}

export interface ChatState {
  signature: string;
  isLtR: boolean;
  audioEnabled: boolean;
  fireworksEnabled: boolean;
  fireworksPlay: boolean;
  keywords: string[];
  primaryFilterOption: ChatMessagePrimaryFilterType;
  secondaryFilterOption: ChatMessageSecondaryFilterType;
  chatListOption: ChatMessageListFilterType;
  ffEnabled: boolean;
  autoScrollEnabled: boolean;
  iframePaused: boolean;
  isDarkTheme: boolean;
  chatVerticalPosition: number;
  chatHorizontalPosition: number;
  demoEnabled: boolean;
}

export enum ChatMessagePrimaryFilterType {
  None = 'none',
  MiniumWordOne = 'atLeastOneWord',
  MiniumWordTwo = 'atLeastTwoWords',
  MiniumWordThree = 'atLeastThreeWords',
  StartWithQ = 'startWithQ',
  StartWithA = 'startWithA',
  StartWithFrom = 'startWithFrom',
}

export enum ChatMessageSecondaryFilterType {
  None = 'none',
  Host = 'host',
  Author = 'author',
  FilterBy = 'filterBy',
  FilterOut = 'filterOut',
  Highlight = 'highlight',
}

export type ChatMessageListFilterType = 'common' | 'donation' | 'membership';
