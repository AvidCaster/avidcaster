import { YTChatInfo } from './ytchat.model';

/**
 * Check if string contains emoji
 * @param str string with possible emoji
 * @returns true if the string contains emoji
 */
export const hasEmoji = (str: string): boolean => {
  const EmojiRegexExp =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

  return EmojiRegexExp.test(str);
};

/**
 * Get the text for the element
 * @param el element to parse
 * @returns text string
 */
const getText = (el: HTMLElement, selector: string): string => {
  el = el.cloneNode(true) as HTMLElement;
  const delList = el.querySelectorAll(`${selector} > :not(some-fake-element)`);
  delList.forEach(function (item) {
    item.parentNode.removeChild(item);
  });

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
  el = el.cloneNode(true) as HTMLElement;
  const messageHtml = el.querySelector(selector)?.innerHTML;
  return messageHtml;
};

/**
 * Get the author avatar from the element
 * @param el element to parse
 * @returns author avatar
 */
const getImage = (el: HTMLElement, selector: string): string => {
  el = el.cloneNode(true) as HTMLElement;
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
  el = el.cloneNode(true) as HTMLElement;
  const card = el.querySelector(selector) as HTMLElement | null;
  const backgroundColor = (card && getComputedStyle(card).backgroundColor) ?? undefined;
  return backgroundColor;
};

/**
 * Get the message text for the element
 * @param el element to parse
 * @returns text only string
 */
const getMessageHtml = (el: HTMLElement): string => {
  el = el.cloneNode(true) as HTMLElement;

  const delList = el.querySelectorAll('#message > :not(img):not(a)');
  delList.forEach(function (item) {
    item.parentNode.removeChild(item);
  });

  el.querySelectorAll('#message a').forEach(function (item) {
    const href = item.getAttribute('href');
    item.replaceWith(`(${href})`);
  });

  el.querySelectorAll('#message img').forEach(function (node) {
    const alt = node.getAttribute('alt').replace(/ /g, ' ').trim();
    if (alt && hasEmoji(alt)) {
      node.replaceWith(alt);
    } else {
      const src = node.getAttribute('src');
      node.replaceWith(`<img src="${src}">`);
    }
  });

  const message = el
    .querySelector('#message')
    .innerHTML.replace(/(?:\r\n|\r|\n)/g, '')
    .replace(/ /g, ' ')
    .trim();

  return message;
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
  const html = getMessageHtml(el);

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
  const html = getMessageHtml(el);
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
  let html = getMessageHtml(el);
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
