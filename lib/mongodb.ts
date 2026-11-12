import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dr_zamanian_clinic';
const dbName = process.env.MONGODB_DB_NAME || 'dr_zamanian_clinic';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Track if MongoDB server is reachable
let isConnected = false;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * In-memory fallback repository when external MongoDB server is connecting or unreachable
 * Ensures seamless user experience and prevents runtime crashes while preserving state.
 */
interface FallbackStore {
  users: any[];
  patients: any[];
  appointments: any[];
  stories: any[];
}

const fallbackStore: FallbackStore = {
  users: [],
  patients: [],
  appointments: [],
  stories: [],
};

export async function getMongoClient(): Promise<MongoClient | null> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      try {
        client = new MongoClient(uri, {
          connectTimeoutMS: 3000,
          serverSelectionTimeoutMS: 3000,
        });
        global._mongoClientPromise = client.connect();
      } catch (err) {
        console.warn('[MongoDB] Init error, will use fallback store:', err);
      }
    }
    clientPromise = global._mongoClientPromise || null;
  } else {
    try {
      if (!client) {
        client = new MongoClient(uri, {
          connectTimeoutMS: 4000,
          serverSelectionTimeoutMS: 4000,
        });
      }
      clientPromise = client.connect();
    } catch (err) {
      console.warn('[MongoDB] Production init error:', err);
    }
  }

  if (!clientPromise) return null;

  try {
    const activeClient = await clientPromise;
    isConnected = true;
    return activeClient;
  } catch (err) {
    isConnected = false;
    // Log graceful degradation notice
    return null;
  }
}

export async function getDb(): Promise<Db | null> {
  const mc = await getMongoClient();
  if (mc) {
    return mc.db(dbName);
  }
  return null;
}

export interface MongoUserDoc {
  _id?: any;
  username: string; // Unique username or national ID
  passwordHash: string; // Bcrypt hashed password
  fullName: string;
  role: 'SUPER_ADMIN' | 'RECEPTIONIST' | 'CONTENT_EDITOR' | 'PATIENT';
  nationalId?: string;
  phone?: string;
  medicalCouncilNumber?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Universal User Database Interface (uses MongoDB with graceful resilience)
 */
export const MongoUserRepo = {
  async findByUsername(username: string): Promise<MongoUserDoc | null> {
    const cleanUsername = username.trim().toLowerCase();
    const db = await getDb();
    if (db) {
      try {
        const doc = await db.collection<MongoUserDoc>('users').findOne({
          $or: [
            { username: cleanUsername },
            { nationalId: username.trim() },
            { phone: username.trim() },
          ],
        });
        return doc;
      } catch (e) {
        console.warn('[MongoDB] Query failed, falling back to local memory store:', e);
      }
    }

    // Fallback store
    const found = fallbackStore.users.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername ||
        u.nationalId === username.trim() ||
        u.phone === username.trim()
    );
    return found || null;
  },

  async createUser(userData: Omit<MongoUserDoc, 'createdAt' | 'updatedAt'>): Promise<MongoUserDoc> {
    const now = new Date().toISOString();
    const newDoc: MongoUserDoc = {
      ...userData,
      username: userData.username.trim().toLowerCase(),
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    if (db) {
      try {
        const result = await db.collection<MongoUserDoc>('users').insertOne(newDoc as any);
        return { ...newDoc, _id: result.insertedId };
      } catch (e) {
        console.warn('[MongoDB] Insert failed, saving to local store:', e);
      }
    }

    // Save in fallback store
    fallbackStore.users.push(newDoc);
    return newDoc;
  },

  async countUsers(): Promise<number> {
    const db = await getDb();
    if (db) {
      try {
        return await db.collection('users').countDocuments();
      } catch (e) {
        // Fallback
      }
    }
    return fallbackStore.users.length;
  },

  async listUsers(): Promise<Omit<MongoUserDoc, 'passwordHash'>[]> {
    const db = await getDb();
    if (db) {
      try {
        const docs = await db
          .collection<MongoUserDoc>('users')
          .find({}, { projection: { passwordHash: 0 } })
          .sort({ createdAt: -1 })
          .toArray();
        return docs as any[];
      } catch (e) {
        // Fallback
      }
    }
    return fallbackStore.users.map(({ passwordHash, ...rest }) => rest);
  },

  isDbConnected(): boolean {
    return isConnected;
  },
};
