/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Observable, buffer, debounceTime, throttleTime } from 'rxjs';

import { ChatSupportedSites } from '../chat.default';
import { BufferDebounce, BufferThrottle } from '../chat.model';

export const isSiteSupported = (site: string): boolean => {
  return Object.keys(ChatSupportedSites).includes(site);
};

export const includesEmoji = (str: string): boolean => {
  const EmojiRegexExp =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

  return EmojiRegexExp.test(str);
};

export const bufferDebounce: BufferDebounce = (time) => (source) =>
  new Observable((observer) =>
    source.pipe(buffer(source.pipe(debounceTime(time)))).subscribe({
      next(x) {
        observer.next(x);
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      },
    })
  );

export const bufferThrottle: BufferThrottle = (time) => (source) =>
  new Observable((observer) =>
    source.pipe(buffer(source.pipe(throttleTime(time)))).subscribe({
      next(x) {
        observer.next(x);
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      },
    })
  );
