import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { cloneDeep as ldDeepClone } from 'lodash-es';

import { YTChatConfig, YTChatObserver, YTChatPayload } from './ytchat.model';

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

export const defaultYTChatMessage = (): YTChatPayload => {
  const message = _('CHAT.DEFAULT_MESSAGE');

  return ldDeepClone({
    donation: '$100.00',
    authorName: 'Mike Tyson',
    authorImage: './assets/images/misc/avatar-default.png',
    authorBadge: './assets/images/misc/avatar-default.png',
    message,
    membership: '',
  });
};

export const YTCHAT_JS_FILE_NAME = 'ytchat.ext.js';
export const YTCHAT_CSS_FILE_NAME = 'ytchat.ext.css';

export const YTCHAT_JS_MIN_FILE_NAME = 'ytchat.ext.min.js';
export const YTCHAT_CSS_MIN_FILE_NAME = 'ytchat.ext.min.css';

export const YTChatObserverDefault: YTChatObserver = {
  container: '.yt-live-chat-item-list-renderer#items',
  selectors: [
    'yt-live-chat-text-message-renderer',
    'yt-live-chat-paid-message-renderer',
    'yt-live-chat-membership-item-renderer',
    'yt-live-chat-paid-sticker-renderer',
  ],
};

export const YTChatIframeContainer = 'yt-live-chat-app';
