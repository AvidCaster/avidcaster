import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { cloneDeep as ldDeepClone } from 'lodash-es';

import { YTChatPayload } from './ytchat.model';

export const MAX_CHAT_MESSAGES_LENGTH = 40;

export const defaultYTChatMessage = (): YTChatPayload => {
  const text = _('CHAT.DEFAULT_MESSAGE');

  return ldDeepClone({
    donation: '$100.00',
    authorName: 'Mike Tyson',
    authorImage: './assets/images/misc/avatar-default.png',
    authorBadge: './assets/images/misc/avatar-default.png',
    message: {
      html: text,
      length: text.length,
    },
  });
};

export const YTCHAT_JS_FILE_NAME = 'ytchat.extension.js';
export const YTCHAT_CSS_FILE_NAME = 'ytchat.extension.css';
