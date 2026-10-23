import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { UnifiedRecord } from '../types/conversation';
import { ImportBatchLog } from '../types/envelope';
import { RouteCategory } from '../types/routing';
import { ReviewState } from '../types/conversation';

export interface UserOverrideRecord {
  record_key: string; // `${source_type}:${source_id}`
  source_type: 'call' | 'meeting';
  source_id: string;
  manual_routes: RouteCategory[];
  primary_manual_route: RouteCategory;
  manager_notes: string;
  review_state: ReviewState;
  updated_at: string;
}

interface RevenueInboxDB extends DBSchema {
  records: {
    key: string; // `${source_type}:${source_id}`
    value: UnifiedRecord;
    indexes: {
      'by-type': string;
      'by-ref': string;
      'by-revision': number;
    };
  };
  import_history: {
    key: string;
    value: ImportBatchLog;
    indexes: {
      'by-date': string;
    };
  };
  user_overrides: {
    key: string; // `${source_type}:${source_id}`
    value: UserOverrideRecord;
  };
}

const DB_NAME = 'RevenueIntelligenceInboxDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<RevenueInboxDB>> | null = null;

export function getDatabase(): Promise<IDBPDatabase<RevenueInboxDB>> {
  if (!dbPromise) {
    dbPromise = openDB<RevenueInboxDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('records')) {
          const recordStore = db.createObjectStore('records', { keyPath: 'storage_key' as any });
          recordStore.createIndex('by-type', 'source_type');
          recordStore.createIndex('by-ref', 'record_ref');
          recordStore.createIndex('by-revision', 'applied_revision');
        }

        if (!db.objectStoreNames.contains('import_history')) {
          const importStore = db.createObjectStore('import_history', { keyPath: 'id' });
          importStore.createIndex('by-date', 'imported_at');
        }

        if (!db.objectStoreNames.contains('user_overrides')) {
          db.createObjectStore('user_overrides', { keyPath: 'record_key' });
        }
      },
    });
  }
  return dbPromise;
}

export function getRecordKey(source_type: string, source_id: string): string {
  return `${source_type}:${source_id}`;
}

export async function getAllRecords(): Promise<UnifiedRecord[]> {
  const db = await getDatabase();
  return db.getAll('records');
}

export async function getRecordByKey(key: string): Promise<UnifiedRecord | undefined> {
  const db = await getDatabase();
  return db.get('records', key);
}

export async function putRecord(record: UnifiedRecord): Promise<void> {
  const db = await getDatabase();
  const storageRecord = {
    ...record,
    storage_key: getRecordKey(record.source_type, record.source_id),
  };
  await db.put('records', storageRecord as any);
}

export async function putRecordsBatch(records: UnifiedRecord[]): Promise<void> {
  const db = await getDatabase();
  const tx = db.transaction('records', 'readwrite');
  for (const record of records) {
    const storageRecord = {
      ...record,
      storage_key: getRecordKey(record.source_type, record.source_id),
    };
    await tx.store.put(storageRecord as any);
  }
  await tx.done;
}

export async function getImportHistory(): Promise<ImportBatchLog[]> {
  const db = await getDatabase();
  return db.getAll('import_history');
}

export async function addImportHistory(log: ImportBatchLog): Promise<void> {
  const db = await getDatabase();
  await db.put('import_history', log);
}

export async function getUserOverrides(): Promise<Map<string, UserOverrideRecord>> {
  const db = await getDatabase();
  const overrides = await db.getAll('user_overrides');
  const map = new Map<string, UserOverrideRecord>();
  overrides.forEach((o) => map.set(o.record_key, o));
  return map;
}

export async function saveUserOverride(override: UserOverrideRecord): Promise<void> {
  const db = await getDatabase();
  await db.put('user_overrides', override);
}

export async function clearAllDatabase(): Promise<void> {
  const db = await getDatabase();
  const tx = db.transaction(['records', 'import_history', 'user_overrides'], 'readwrite');
  await tx.objectStore('records').clear();
  await tx.objectStore('import_history').clear();
  await tx.objectStore('user_overrides').clear();
  await tx.done;
}
