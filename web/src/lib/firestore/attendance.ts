import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { AttendanceEvent, AttendanceRecord } from "@/types";

const COLLECTION = "attendance_events";
const RECORDS_SUB = "records";

export async function getAttendanceEvent(
  eventId: string
): Promise<AttendanceEvent | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection(COLLECTION).doc(eventId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as AttendanceEvent;
  } catch (error) {
    throw new Error(
      `Failed to get attendance event "${eventId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getOpenAttendanceEvents(): Promise<AttendanceEvent[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(COLLECTION)
      .where("status", "==", "open")
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as AttendanceEvent
    );
  } catch (error) {
    throw new Error(
      `Failed to get open attendance events: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getAllAttendanceEvents(): Promise<AttendanceEvent[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("opens_at", "desc")
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as AttendanceEvent
    );
  } catch (error) {
    throw new Error(
      `Failed to get all attendance events: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function createAttendanceEvent(
  data: Omit<AttendanceEvent, "id">
): Promise<string> {
  try {
    const db = getAdminDb();
    const docRef = await db.collection(COLLECTION).add(data);
    return docRef.id;
  } catch (error) {
    throw new Error(
      `Failed to create attendance event: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function updateAttendanceEvent(
  eventId: string,
  data: Partial<AttendanceEvent>
): Promise<void> {
  try {
    const db = getAdminDb();
    const { id: _id, ...updateData } = data;
    await db.collection(COLLECTION).doc(eventId).update(updateData);
  } catch (error) {
    throw new Error(
      `Failed to update attendance event "${eventId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

/* ─── Attendance Records (sub-collection) ─── */

export async function getAttendanceRecords(
  eventId: string
): Promise<AttendanceRecord[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(COLLECTION)
      .doc(eventId)
      .collection(RECORDS_SUB)
      .orderBy("checked_in_at", "desc")
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as AttendanceRecord
    );
  } catch (error) {
    throw new Error(
      `Failed to get attendance records for event "${eventId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function checkIn(
  eventId: string,
  data: Omit<AttendanceRecord, "id" | "checked_in_at" | "is_duplicate_attempt">
): Promise<string> {
  try {
    const db = getAdminDb();
    const recordsRef = db
      .collection(COLLECTION)
      .doc(eventId)
      .collection(RECORDS_SUB);

    return await db.runTransaction(async (tx) => {
      const existing = await tx.get(
        recordsRef.where("club_id", "==", data.club_id).limit(1)
      );

      if (!existing.empty) {
        const dupRef = recordsRef.doc();
        tx.set(dupRef, {
          ...data,
          checked_in_at: FieldValue.serverTimestamp(),
          is_duplicate_attempt: true,
        });
        return dupRef.id;
      }

      const newRef = recordsRef.doc();
      tx.set(newRef, {
        ...data,
        checked_in_at: FieldValue.serverTimestamp(),
        is_duplicate_attempt: false,
      });
      return newRef.id;
    });
  } catch (error) {
    throw new Error(
      `Failed to check in for event "${eventId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getAttendanceStats(
  eventId: string
): Promise<{ total: number; checkedIn: number }> {
  try {
    const db = getAdminDb();
    const eventDoc = await db.collection(COLLECTION).doc(eventId).get();
    if (!eventDoc.exists) {
      throw new Error(`Attendance event "${eventId}" not found`);
    }

    const event = eventDoc.data() as AttendanceEvent;
    const total = event.expected_clubs.length;

    const recordsSnapshot = await db
      .collection(COLLECTION)
      .doc(eventId)
      .collection(RECORDS_SUB)
      .where("is_duplicate_attempt", "==", false)
      .count()
      .get();
    const checkedIn = recordsSnapshot.data().count;

    return { total, checkedIn };
  } catch (error) {
    throw new Error(
      `Failed to get attendance stats for event "${eventId}": ${error instanceof Error ? error.message : error}`
    );
  }
}
