import { createClient } from "redis";

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_HOST, // KOREKSI: Wajib REDIS_HOST sesuai kriteria submission
      },
    });

    this._client.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond, // Otomatis expired dalam 1 jam
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error("Cache tidak ditemukan");
    return result;
  }

  // KOREKSI: Gunakan async/await agar penanganan di controller konsisten
  async delete(key) {
    await this._client.del(key);
  }
}

// Lakukan instansiasi sekali di sini (Singleton Pattern) agar koneksi client tidak dibuat berulang-ulang
export default new CacheService();
