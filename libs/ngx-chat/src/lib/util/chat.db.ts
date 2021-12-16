import { tryGet } from '@fullerstack/agx-util';
import Dexie, { liveQuery } from 'dexie';

import { ChatMessageItem, ChatMessageListFilterType, ChatMessageType } from '../chat.model';

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
          .filter((chat) => chat.messageType === messageType)
          .reverse()
          .offset(listSize)
          .delete();
      });
    }
  }

  async resetDatabase() {
    tryGet(async () => {
      await this.transaction('rw', this.tableName, () => {
        this.chatTable.clear();
      });
    });
  }

  chatLiveQuery(messageType: ChatMessageListFilterType) {
    if (messageType !== ChatMessageListFilterType.Common) {
      return liveQuery(() =>
        this.chatTable
          .orderBy(':id')
          .filter((chat) => chat.messageType === messageType)
          .toArray()
      );
    }
    return liveQuery(() => this.chatTable.orderBy(':id').toArray());
  }
}

export const chatDatabaseInstance = new ChatDB();
