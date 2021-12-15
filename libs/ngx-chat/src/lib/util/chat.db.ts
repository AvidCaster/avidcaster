import { tryGet } from '@fullerstack/agx-util';
import Dexie from 'dexie';

import { ChatMessageItem, ChatMessageType } from '../chat.model';

export class ChatDB extends Dexie {
  tableName = 'messages';

  constructor() {
    super('AvidCasterChatDB');
    this.version(3).stores({
      [this.tableName]: '++id, messageType',
    });
  }

  get chatTable() {
    return this.table(this.tableName);
  }

  /**
   * Add a new chat message to the chat table
   * @param chat chat message item
   */
  async addMessage(chat: ChatMessageItem) {
    await this.chatTable.add(chat);
  }

  /**
   * Update a chat message in the chat table
   * @param chat chat to update
   */
  updateMessage(chat: ChatMessageItem) {
    tryGet(async () => await this.chatTable.update(chat.id, chat));
  }

  deleteMessage(chat: ChatMessageItem) {
    tryGet(async () => await this.chatTable.delete(chat?.id));
  }

  deleteMessages(chatIds: number[]) {
    tryGet(() => chatIds.map(async (id) => await this.chatTable.delete(id)));
  }

  async pruneMessageTable(messageType: ChatMessageType, listSize: number, offset = 25) {
    tryGet(async () => {
      const count = await this.chatTable.where('messageType').equals(messageType).count();
      if (count >= listSize + offset) {
        await chatDb.chatTable
          .orderBy(':id')
          .filter((chat) => chat.messageType === messageType)
          .reverse()
          .offset(listSize)
          .delete();
      }
    });
  }

  async resetDatabase() {
    tryGet(async () => {
      await chatDb.transaction('rw', this.tableName, () => {
        this.chatTable.clear();
      });
    });
  }

  chatLiveQuery(chatType: ChatMessageType, limit: number) {
    return this.chatTable.where('messageType').equals(chatType).limit(limit).toArray();
  }
}

export const chatDb = new ChatDB();
