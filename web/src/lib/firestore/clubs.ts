import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { Club } from "@/types";

const COLLECTION = "clubs";

export async function getClub(id: string): Promise<Club | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Club;
  } catch (error) {
    throw new Error(
      `Failed to get club "${id}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getAllClubs(
  options?: { category?: string; isActive?: boolean }
): Promise<Club[]> {
  try {
    const db = getAdminDb();
    let query = db.collection(COLLECTION) as FirebaseFirestore.Query;

    if (options?.category) {
      query = query.where("category", "==", options.category);
    }
    if (options?.isActive !== undefined) {
      query = query.where("is_active", "==", options.isActive);
    }

    const snapshot = await query.get();
    const result = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Club
    );

    // Sort in memory to avoid requiring composite indexes for equality + sort
    return result.sort((a, b) => (a.name || "").localeCompare(b.name || "", "zh-Hant"));
  } catch (error) {
    throw new Error(
      `Failed to get all clubs: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function importClubs(
  clubs: Omit<Club, "imported_at">[]
): Promise<{ created: number; updated: number }> {
  try {
    const db = getAdminDb();
    const batch = db.batch();
    let created = 0;
    let updated = 0;

    for (const club of clubs) {
      const { id, ...data } = club;
      const ref = db.collection(COLLECTION).doc(id);
      const existing = await ref.get();

      if (existing.exists) {
        batch.update(ref, {
          ...data,
          imported_at: FieldValue.serverTimestamp(),
        });
        updated++;
      } else {
        batch.set(ref, {
          ...data,
          imported_at: FieldValue.serverTimestamp(),
        });
        created++;
      }
    }

    await batch.commit();
    return { created, updated };
  } catch (error) {
    throw new Error(
      `Failed to import clubs: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function updateClub(
  id: string,
  data: Partial<Club>
): Promise<void> {
  try {
    const db = getAdminDb();
    const { id: _id, ...updateData } = data;
    await db.collection(COLLECTION).doc(id).update(updateData);
  } catch (error) {
    throw new Error(
      `Failed to update club "${id}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getClubsByIds(ids: string[]): Promise<Club[]> {
  if (ids.length === 0) return [];

  try {
    const db = getAdminDb();
    // Firestore 'in' queries support max 30 items per batch
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 30) {
      chunks.push(ids.slice(i, i + 30));
    }

    const results: Club[] = [];
    for (const chunk of chunks) {
      const snapshot = await db
        .collection(COLLECTION)
        .where("__name__", "in", chunk)
        .get();
      results.push(
        ...snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Club
        )
      );
    }
    return results;
  } catch (error) {
    throw new Error(
      `Failed to get clubs by IDs: ${error instanceof Error ? error.message : error}`
    );
  }
}
