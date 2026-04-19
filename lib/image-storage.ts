// lib/image-storage.ts

export type StoredImage = {
  id: string;
  dataUrl: string;
  createdAt: string;
};

const DB_NAME = "beauty-record-pwa-db";
const DB_VERSION = 1;
const STORE_NAME = "record-images";

function isBrowser() {
  return typeof window !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("Browser environment only"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function createImageId() {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function saveImageFile(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  const id = createImageId();

  const image: StoredImage = {
    id,
    dataUrl,
    createdAt: new Date().toISOString(),
  };

  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(image);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getImageById(id: string): Promise<StoredImage | null> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve((request.result as StoredImage | undefined) ?? null);
    };
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getImagesByIds(ids: string[]): Promise<StoredImage[]> {
  const results = await Promise.all(ids.map((id) => getImageById(id)));
  return results.filter((item): item is StoredImage => item !== null);
}

export async function deleteImageById(id: string): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteImagesByIds(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await Promise.all(ids.map((id) => deleteImageById(id)));
}
