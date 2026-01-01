import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30 saniye timeout (artırıldı)
      socketTimeoutMS: 60000, // 60 saniye socket timeout (artırıldı)
      connectTimeoutMS: 30000, // 30 saniye bağlantı timeout (artırıldı)
      maxPoolSize: 10, // Maksimum bağlantı sayısı
      minPoolSize: 1, // Minimum bağlantı sayısı
      retryWrites: true, // Yazma işlemlerini tekrar dene
      retryReads: true, // Okuma işlemlerini tekrar dene
      // TLS/SSL ayarları
      tls: true,
      tlsAllowInvalidCertificates: true, // Sadece development için
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log('✅ MongoDB bağlantısı başarılı');
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      console.error('❌ MongoDB bağlantı hatası:', error.message);
      if (error.reason) {
        console.error('   Replica Set durumu:', error.reason.type);
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;