import { YTChatInfo } from './ytchat.model';

const getBackgroundColor = (el: HTMLElement) => {
  return getComputedStyle(el).backgroundColor;
};

const parseCommonElements = (el: HTMLElement) => {
  const author = el.querySelector('#author-name')?.textContent ?? undefined;
  const authorType = el.getAttribute('author-type') ?? undefined;
  const message = el.querySelector('#message')?.textContent ?? undefined;
  const avatarImage = el.querySelector('#img') as HTMLImageElement | null;
  const avatarUrl = avatarImage ? avatarImage.src : undefined;

  return { message, author, authorType, avatarUrl };
};

const parseTextMessage = (el: HTMLElement) => {
  const params = parseCommonElements(el);

  const html = el.querySelector('#message')?.innerHTML;

  return {
    ...params,
    html,
    messageType: 'text-message',
  };
};

const parsePaidMessage = (el: HTMLElement) => {
  const params = parseCommonElements(el);

  const html = el.querySelector('#message')?.innerHTML;
  const subText = el.querySelector('#purchase-amount')?.textContent ?? undefined;
  const card = el.querySelector('#card > #header') as HTMLElement | null;
  const backgroundColor = (card && getBackgroundColor(card)) ?? undefined;

  return {
    ...params,
    html,
    backgroundColor,
    subText,
    messageType: 'paid-message',
  };
};

const parsePaidSticker = (el: HTMLElement) => {
  const params = parseCommonElements(el);

  const subText = el.querySelector('#purchase-amount-chip')?.textContent ?? '';
  const card = el.querySelector('#card') as HTMLElement | null;
  const backgroundColor = (card && getBackgroundColor(card)) ?? undefined;
  const stickerImage = el.querySelector('#sticker > #img') as HTMLImageElement | null;
  const stickerUrl = stickerImage ? stickerImage.src : undefined;

  return {
    ...params,
    stickerUrl,
    backgroundColor,
    subText,
    messageType: 'paid-sticker',
  };
};

const parseMembershipItem = (el: HTMLElement) => {
  const params = parseCommonElements(el);

  let html = el.querySelector('#message')?.innerHTML;
  let subText = undefined;
  if (html) {
    // milestone chat
    subText = el.querySelector('#header-primary-text')?.textContent ?? undefined;
  } else {
    html = el.querySelector('#header-subtext')?.textContent ?? undefined;
  }
  const card = el.querySelector('#card > #header') as HTMLElement | null;
  const backgroundColor = (card && getBackgroundColor(card)) ?? undefined;

  return {
    ...params,
    html,
    backgroundColor,
    subText,
    messageType: 'membership-item',
  };
};

export const parseChat = (el: HTMLElement, tagName: string): YTChatInfo | undefined => {
  switch (tagName) {
    case 'yt-live-chat-text-message-renderer':
      return parseTextMessage(el);
    case 'yt-live-chat-paid-message-renderer':
      return parsePaidMessage(el);
    case 'yt-live-chat-paid-sticker-renderer':
      return parsePaidSticker(el);
    case 'yt-live-chat-membership-item-renderer':
      return parseMembershipItem(el);
  }
  return undefined;
};
