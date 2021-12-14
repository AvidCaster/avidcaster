import Dexie from 'dexie';

import { welcomeChat } from '../chat.default';
import { ChatDbTableType, ChatMessageItem } from '../chat.model';

export class ChatDB extends Dexie {
  constructor() {
    super('AvidCasterChatDB');
    this.version(3).stores({
      message: '++id',
      donation: '++id',
      membership: '++id',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await chatDb.table('message').add(welcomeChat());
  }

  async addMessage(chat: ChatMessageItem) {
    if (chat.donation) {
      return await this.table('donation').add(chat);
    } else if (chat.membership) {
      return await this.table('membership').add(chat);
    }
    return await this.table('message').add(chat);
  }

  async updateMessage(chat: ChatMessageItem) {
    if (chat.donation) {
      return await this.table('donation').update(chat.id, chat);
    } else if (chat.membership) {
      return await this.table('membership').update(chat.id, chat);
    }
    return await this.table('message').update(chat.id, chat);
  }

  async deleteMessage(chat: ChatMessageItem) {
    if (chat.donation) {
      return await this.table('donation').add(chat?.id);
    } else if (chat.membership) {
      return await this.table('membership').add(chat?.id);
    }
    return await this.table('message').add(chat?.id);
  }

  async deleteMessages(tableType: ChatDbTableType, ids: number[]) {
    let tableName = 'message';
    switch (tableType) {
      case ChatDbTableType.Donation:
        tableName = 'donation';
        break;
      case ChatDbTableType.Membership:
        tableName = 'membership';
        break;
    }

    ids?.map(async (id) => await this.table(tableName).delete(id));
  }

  async pruneMessageTable(tableType: ChatDbTableType, listSize: number, offset = 25) {
    let tableName = 'message';
    switch (tableType) {
      case ChatDbTableType.Donation:
        tableName = 'donation';
        break;
      case ChatDbTableType.Membership:
        tableName = 'membership';
        break;
    }
    const count = await chatDb.table(tableName).count();
    if (count >= listSize + offset) {
      const chats = await chatDb
        .table(tableName)
        .orderBy(':id')
        .reverse()
        .offset(listSize)
        .toArray();
      chats?.map(async (chat) => await chatDb.table(tableName).delete(chat.id));
    }
  }

  async resetDatabase() {
    await chatDb.transaction('rw', 'messageTable', 'messageLists', () => {
      this.table('message').clear();
      this.table('donation').clear();
      this.table('membership').clear();
      this.populate();
    });
  }
}

export const chatDb = new ChatDB();
