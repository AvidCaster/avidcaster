import { ChatSupportedSites } from './chat.default';

export const isSiteSupported = (site: string): boolean => {
  return Object.keys(ChatSupportedSites).includes(site);
};
