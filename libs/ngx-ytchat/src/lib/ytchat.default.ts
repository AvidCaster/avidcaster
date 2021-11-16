import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { cloneDeep as ldDeepClone } from 'lodash-es';

import { YtChatMessage } from './ytchat.model';

export const MAX_CHAT_MESSAGES_LENGTH = 40;

export const defaultYtChatMessage = (): YtChatMessage => {
  const text = _('CHAT.DEFAULT_MESSAGE');

  return ldDeepClone({
    donation: '$100.00',
    authorName: 'Mike Tyson',
    authorImg: './assets/images/misc/avatar-default.png',
    message: {
      html: text,
      length: text.length,
    },
  });
};
