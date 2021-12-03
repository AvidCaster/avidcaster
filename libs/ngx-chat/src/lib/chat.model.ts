export type ChatMessage = {
  author?: string;
  avatarUrl?: string;
  badgeUrl?: string;
  message?: string;
  html?: string;
  donation?: string;
};

export type ChatDirection = 'avidcaster-chat-north-bound' | 'avidcaster-chat-south-bound';
