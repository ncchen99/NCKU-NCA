import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { DepositRecord } from "@/types";

const COLLECTION = "deposit_records";

export async function getDepositRecord(
  id: string
): Promise<DepositRecord | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as DepositRecord;
  } catch (error) {
    throw new Error(
      `Failed to get deposit record "${id}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getDepositRecords(
  options?: { status?: string; clubId?: string }
): Promise<DepositRecord[]> {
  try {
    const db = getAdminDb();
    let query = db.collection(COLLECTION) as FirebaseFirestore.Query;

    if (options?.status) {
      query = query.where("status", "==", options.status);
    }
    if (options?.clubId) {
      query = query.where("club_id", "==", options.clubId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as DepositRecord
    );
  } catch (error) {
    throw new Error(
      `Failed to get deposit records: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function createDepositRecord(
  data: Omit<DepositRecord, "id">
): Promise<string> {
  try {
    const db = getAdminDb();
    const docRef = await db.collection(COLLECTION).add(data);
    return docRef.id;
  } catch (error) {
    throw new Error(
      `Failed to create deposit record: ${error instanceof Error ? error.message : error}`
    );
  }
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ["paid"],
  paid: ["returned"],
};

export async function updateDepositStatus(
  id: string,
  newStatus: "paid" | "returned",
  adminUid: string
): Promise<void> {
  try {
    const db = getAdminDb();
    const docRef = db.collection(COLLECTION).doc(id);

    await db.runTransaction(async (tx) => {
      const doc = await tx.get(docRef);
      if (!doc.exists) {
        throw new Error(`Deposit record "${id}" not found`);
      }

      const current = doc.data()!;
      const allowed = VALID_TRANSITIONS[current.status] ?? [];
      if (!allowed.includes(newStatus)) {
        throw new Error(
          `Invalid status transition: ${current.status} → ${newStatus}`
        );
      }

      const update: Record<string, unknown> = {
        status: newStatus,
        updated_by: adminUid,
      };

      if (newStatus === "paid") {
        update.paid_at = FieldValue.serverTimestamp();
      } else if (newStatus === "returned") {
        update.returned_at = FieldValue.serverTimestamp();
      }

      tx.update(docRef, update);
    });
  } catch (error) {
    throw new Error(
      `Failed to update deposit status "${id}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function batchUpdateDepositStatus(
  ids: string[],
  newStatus: "paid" | "returned",
  adminUid: string
): Promise<void> {
  if (ids.length === 0) return;

  try {
    const db = getAdminDb();
    const batch = db.batch();

    for (const id of ids) {
      const docRef = db.collection(COLLECTION).doc(id);
      const update: Record<string, unknown> = {
        status: newStatus,
        updated_by: adminUid,
      };

      if (newStatus === "paid") {
        update.paid_at = FieldValue.serverTimestamp();
      } else if (newStatus === "returned") {
        update.returned_at = FieldValue.serverTimestamp();
      }

      batch.update(docRef, update);
    }

    await batch.commit();
  } catch (error) {
    throw new Error(
      `Failed to batch update deposit statuses: ${error instanceof Error ? error.message : error}`
    );
  }
}
