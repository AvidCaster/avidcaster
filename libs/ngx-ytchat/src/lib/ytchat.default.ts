import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { cloneDeep as ldDeepClone } from 'lodash-es';

import { YTChatConfig, YTChatInfo, YTChatObserver } from './ytchat.model';

export const MAX_CHAT_MESSAGES_LENGTH = 40;

/**
 * Default configuration - YTChat module
 */
const DefaultYTChatConfig: YTChatConfig = {
  logState: false,
};

export const defaultYTChatConfig = (): YTChatConfig => {
  return ldDeepClone(DefaultYTChatConfig);
};

export const defaultYTChatMessage = (): YTChatInfo => {
  const html = _('CHAT.DEFAULT_MESSAGE');

  return ldDeepClone({
    author: 'Mike Tyson',
    avatarUrl: './assets/images/misc/avatar-default.png',
    html,
    purchaseAmount: '$100.00',
  });
};

export const YTCHAT_JS_FILE_NAME = 'ytchat.ext.js';
export const YTCHAT_CSS_FILE_NAME = 'ytchat.ext.css';

export const YTCHAT_JS_MIN_FILE_NAME = 'ytchat.ext.min.js';
export const YTCHAT_CSS_MIN_FILE_NAME = 'ytchat.ext.min.css';

export const YTChatObserverDefault: YTChatObserver = {
  container: '#item-list.yt-live-chat-renderer',
  selectors: [
    'yt-live-chat-text-message-renderer',
    'yt-live-chat-paid-message-renderer',
    'yt-live-chat-membership-item-renderer',
    'yt-live-chat-paid-sticker-renderer',
  ],
};

export const YTChatIframeContainer = 'yt-live-chat-app';
