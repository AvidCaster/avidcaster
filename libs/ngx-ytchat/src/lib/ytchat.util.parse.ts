import { YTChatInfo } from './ytchat.model';

/**
 * Get the text for the element
 * @param el element to parse
 * @returns text string
 */
const getText = (el: HTMLElement, selector: string): string => {
  const author =
    el.querySelector(selector)?.textContent?.replace(/\s\s+/g, ' ').trim() ?? undefined;
  return author;
};

/**
 * Get the message html from the element
 * @param el element to parse
 * @returns message html
 */
const getHtml = (el: HTMLElement, selector: string): string => {
  const messageHtml = el.querySelector(selector)?.innerHTML;
  return messageHtml;
};

/**
 * Get the author avatar from the element
 * @param el element to parse
 * @returns author avatar
 */
const getImage = (el: HTMLElement, selector: string): string => {
  const image = el.querySelector(selector) as HTMLImageElement | null;
  const imgUrl = image
    ? image.src?.replace('s32', 's256').replace('s64', 's256').replace(/\s\s+/g, ' ').trim()
    : undefined;
  return imgUrl;
};

/**
 * Get the message background color from the element
 * @param el element to parse
 * @returns message card background color
 */
const getBackgroundColor = (el: HTMLElement, selector: string): string => {
  const card = el.querySelector(selector) as HTMLElement | null;
  const backgroundColor = (card && getComputedStyle(card).backgroundColor) ?? undefined;
  return backgroundColor;
};

/**
 * Get the common data from the element
 * @param el element to parse
 * @returns common info
 */
const parseCommonElements = (el: HTMLElement): YTChatInfo => {
  const author = getText(el, '#author-name');
  const authorType = getText(el, 'author-type');
  const message = getText(el, '#message');
  const avatarUrl = getImage(el, '#img');
  return { message, author, authorType, avatarUrl };
};

/**
 * Parse the element to get the message info (type text-message)
 * @param el element to parse
 * @returns message info
 */
const parseTextMessage = (el: HTMLElement): YTChatInfo => {
  const params = parseCommonElements(el);
  const html = getHtml(el, '#message');

  return {
    ...params,
    html,
    messageType: 'text-message',
  };
};

/**
 * Parse the element to get the message info (type paid-message)
 * @param el element to parse
 * @returns message info
 */
const parsePaidMessage = (el: HTMLElement): YTChatInfo => {
  const params = parseCommonElements(el);
  const html = getHtml(el, '#message');
  const donation = getText(el, '#donation-amount-chip');
  const backgroundColor = getBackgroundColor(el, '#card > #header');

  return {
    ...params,
    html,
    backgroundColor,
    donation,
    messageType: 'paid-message',
  };
};

/**
 * Parse the element to get the message info (type paid-sticker)
 * @param el element to parse
 * @returns message info
 */
const parsePaidSticker = (el: HTMLElement): YTChatInfo => {
  const params = parseCommonElements(el);
  const donation = getText(el, '#purchase-amount-chip');
  const backgroundColor = getBackgroundColor(el, '#card');
  const stickerUrl = getImage(el, '#sticker > #img');

  return {
    ...params,
    stickerUrl,
    backgroundColor,
    donation,
    messageType: 'paid-sticker',
  };
};

/**
 * Parse the element to get the message info (type membership-item)
 * @param el element to parse
 * @returns message info
 */
const parseMembershipItem = (el: HTMLElement): YTChatInfo => {
  const params = parseCommonElements(el);
  const backgroundColor = getBackgroundColor(el, '#card > #header');
  let html = getHtml(el, '#message');
  let donation = undefined;
  if (html) {
    // milestone chat
    donation = getText(el, '#header-primary-text');
  } else {
    html = getText(el, '#header-subtext');
  }

  return {
    ...params,
    html,
    backgroundColor,
    donation,
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
  return {} as YTChatInfo;
};
