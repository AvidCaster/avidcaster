import { cloneDeep as ldDeepClone } from 'lodash-es';

import { YtChatMessage } from './ytchat.model';

export const MAX_CHAT_MESSAGES_LENGTH = 180;

export const defaultYtChatMessage = (): YtChatMessage => {
  return ldDeepClone({
    donation: '$100.00',
    authorName: 'Mike Tyson',
    authorImg: './assets/images/misc/avatar-default.png',
    message:
      "Lorem Ipsum is simply dummy 😘 text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  });
};
