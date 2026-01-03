import { NewDownloadHistoryItem } from '@main/types/db';

export class PendingQueue {
  private items: Record<number, NewDownloadHistoryItem> = {};
  private head = 0;
  private tail = 0;

  get size(): number {
    return this.tail - this.head;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  enqueue(value: NewDownloadHistoryItem): void {
    this.items[this.tail] = value;
    this.tail++;
  }

  dequeue(): NewDownloadHistoryItem {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }

    const value = this.items[this.head];
    delete this.items[this.head];
    this.head++;

    return value;
  }

  clear(): void {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }

  toArray(): NewDownloadHistoryItem[] {
    const result: NewDownloadHistoryItem[] = [];
    for (let i = this.head; i < this.tail; i++) {
      result.push(this.items[i]);
    }
    return result;
  }

  remove(downloadId: string): NewDownloadHistoryItem | null {
    if (this.isEmpty()) return null;

    let writeIndex = this.head;
    let removedItem: NewDownloadHistoryItem | null = null;

    for (let readIndex = this.head; readIndex < this.tail; readIndex++) {
      const item = this.items[readIndex];

      if (!removedItem && item.id === downloadId) {
        removedItem = item;
        delete this.items[readIndex];
        continue;
      }

      if (writeIndex !== readIndex) {
        this.items[writeIndex] = item;
        delete this.items[readIndex];
      }

      writeIndex++;
    }

    if (removedItem) {
      this.tail--;
    }

    return removedItem;
  }

  removeAll() {
    const items = this.toArray();
    this.clear();
    return items;
  }
}
