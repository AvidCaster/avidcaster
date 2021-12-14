import Dexie from 'dexie';

import { ChatMessageItem, ChatMessageType } from '../chat.model';

export class ChatDB extends Dexie {
  constructor() {
    super('AvidCasterChatDB');
    this.version(3).stores({
      [ChatMessageType.Common]: '++id',
      [ChatMessageType.Donation]: '++id',
      [ChatMessageType.Membership]: '++id',
    });
  }

  /**
   * Add a new chat message to the specific table
   * @param chat chat message item
   */
  async addMessage(chat: ChatMessageItem, tableType = ChatMessageType.Common) {
    await this.table(tableType).add(chat);
  }

  /**
   * Update a chat message in the specified table
   * @param chat chat to update
   */
  async updateMessage(chat: ChatMessageItem, tableType = ChatMessageType.Common) {
    await this.table(tableType).add(chat);
  }

  async deleteMessage(chat: ChatMessageItem, tableType = ChatMessageType.Common) {
    await this.table(tableType).delete(chat?.id);
  }

  async deleteMessages(ids: number[], tableType = ChatMessageType.Common) {
    ids?.map(async (id) => await this.table(tableType).delete(id));
  }

  async pruneMessageTable(listSize: number, tableType: ChatMessageType, offset = 25) {
    const count = await chatDb.table(tableType).count();
    if (count >= listSize + offset) {
      const chats = await chatDb
        .table(tableType)
        .orderBy(':id')
        .reverse()
        .offset(listSize)
        .toArray();
      chats?.map(async (chat) => await chatDb.table(tableType).delete(chat.id));
    }
  }

  async resetDatabase() {
    await chatDb.transaction(
      'rw',
      ChatMessageType.Common,
      ChatMessageType.Donation,
      ChatMessageType.Membership,
      () => {
        this.table(ChatMessageType.Common).clear();
        this.table(ChatMessageType.Donation).clear();
        this.table(ChatMessageType.Membership).clear();
      }
    );
  }

  liveQuery(tableType: ChatMessageType, limit: number) {
    return this.table(tableType).limit(limit).toArray();
  }
}

export const chatDb = new ChatDB();
