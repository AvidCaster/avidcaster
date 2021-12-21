import { tryGet } from '@fullerstack/agx-util';
import Dexie, { liveQuery } from 'dexie';

import { CHAT_DEFAULT_PREFIX } from '../chat.default';
import {
  ChatMessageItem,
  ChatMessageItemsIndexedQueryType,
  ChatMessageListFilterType,
  ChatMessageType,
} from '../chat.model';

export class ChatDB extends Dexie {
  tableName = 'messages';

  constructor() {
    super('AvidCasterChatDB');
    this.version(4).stores({
      [this.tableName]: '++id, messageType, prefix, author',
    });
  }

  get chatTable() {
    return this.table(this.tableName);
  }

  getMessage(chat: ChatMessageItemsIndexedQueryType) {
    return this.chatTable.get(chat);
  }

  addMessage(chat: ChatMessageItem) {
    this.transaction('rw', this.chatTable, async () => {
      await this.chatTable.add(chat);
    });
  }

  /**
   * Update a chat message in the chat table
   * @param chat chat to update
   */
  updateMessage(chat: ChatMessageItem) {
    return this.transaction('rw', this.chatTable, async () => {
      await this.chatTable.update(chat.id, chat);
    });
  }

  deleteMessage(chat: ChatMessageItem) {
    this.transaction('rw', this.chatTable, async () => {
      await this.chatTable.delete(chat.id);
    });
  }

  deleteMessages(chatIds: number[]) {
    this.transaction('rw', this.chatTable, async () => {
      chatIds.map(async (id) => await this.chatTable.delete(id));
    });
  }

  async pruneMessageTable(messageType: ChatMessageType, listSize: number, offset = 25) {
    const count = await this.chatTable.where('messageType').equals(messageType).count();
    if (count >= listSize + offset) {
      this.transaction('rw', this.chatTable, async () => {
        await this.chatTable
          .orderBy(':id')
          .filter((chat) => {
            if (chat.prefix === CHAT_DEFAULT_PREFIX) {
              return false;
            }
            return chat.messageType === messageType;
          })
          .reverse()
          .offset(listSize)
          .delete();
      });
    }
  }

  async resetDatabase(welcomeChat: ChatMessageItem) {
    tryGet(async () => {
      await this.transaction('rw', this.tableName, () => {
        this.chatTable.clear();
        this.addMessage(welcomeChat);
      });
    });
  }

  chatLiveQuery(messageType: ChatMessageListFilterType, includeGreeting = true) {
    if (messageType !== 'common') {
      return liveQuery(() =>
        this.chatTable
          .orderBy(':id')
          .filter((chat) => {
            if (includeGreeting && chat.prefix === CHAT_DEFAULT_PREFIX) {
              return true;
            }
            return chat.messageType === messageType;
          })
          .reverse()
          .toArray()
      );
    }
    return liveQuery(() => this.chatTable.orderBy(':id').reverse().toArray());
  }
}

export const chatDatabaseInstance = new ChatDB();
