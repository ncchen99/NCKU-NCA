import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { Form, FormResponse } from "@/types";

const COLLECTION = "forms";
const RESPONSES_SUB = "responses";

export async function getForm(formId: string): Promise<Form | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection(COLLECTION).doc(formId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Form;
  } catch (error) {
    throw new Error(
      `Failed to get form "${formId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getOpenForms(): Promise<Form[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(COLLECTION)
      .where("status", "==", "open")
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Form
    );
  } catch (error) {
    throw new Error(
      `Failed to get open forms: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getAllForms(
  options?: { status?: string; formType?: string }
): Promise<Form[]> {
  try {
    const db = getAdminDb();
    let query = db.collection(COLLECTION) as FirebaseFirestore.Query;

    if (options?.status) {
      query = query.where("status", "==", options.status);
    }
    if (options?.formType) {
      query = query.where("form_type", "==", options.formType);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Form
    );
  } catch (error) {
    throw new Error(
      `Failed to get all forms: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function createForm(
  data: Omit<Form, "id" | "created_at">
): Promise<string> {
  try {
    const db = getAdminDb();
    const docRef = await db.collection(COLLECTION).add({
      ...data,
      created_at: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(
      `Failed to create form: ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function updateForm(
  formId: string,
  data: Partial<Form>
): Promise<void> {
  try {
    const db = getAdminDb();
    const { id: _id, ...updateData } = data;
    await db.collection(COLLECTION).doc(formId).update(updateData);
  } catch (error) {
    throw new Error(
      `Failed to update form "${formId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function deleteForm(formId: string): Promise<void> {
  try {
    const db = getAdminDb();
    await db.collection(COLLECTION).doc(formId).delete();
  } catch (error) {
    throw new Error(
      `Failed to delete form "${formId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

/* ─── Form Responses (sub-collection) ─── */

export async function getFormResponses(
  formId: string
): Promise<FormResponse[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(COLLECTION)
      .doc(formId)
      .collection(RESPONSES_SUB)
      .orderBy("submitted_at", "desc")
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as FormResponse
    );
  } catch (error) {
    throw new Error(
      `Failed to get responses for form "${formId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function getFormResponseByClub(
  formId: string,
  clubId: string
): Promise<FormResponse | null> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(COLLECTION)
      .doc(formId)
      .collection(RESPONSES_SUB)
      .where("club_id", "==", clubId)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as FormResponse;
  } catch (error) {
    throw new Error(
      `Failed to get response for club "${clubId}" in form "${formId}": ${error instanceof Error ? error.message : error}`
    );
  }
}

export async function submitFormResponse(
  formId: string,
  data: Omit<FormResponse, "id" | "submitted_at" | "is_duplicate_attempt">
): Promise<string> {
  try {
    const db = getAdminDb();
    const responsesRef = db
      .collection(COLLECTION)
      .doc(formId)
      .collection(RESPONSES_SUB);

    return await db.runTransaction(async (tx) => {
      const existing = await tx.get(
        responsesRef.where("club_id", "==", data.club_id).limit(1)
      );

      if (!existing.empty) {
        const dupRef = responsesRef.doc();
        tx.set(dupRef, {
          ...data,
          submitted_at: FieldValue.serverTimestamp(),
          is_duplicate_attempt: true,
        });
        return dupRef.id;
      }

      const newRef = responsesRef.doc();
      tx.set(newRef, {
        ...data,
        submitted_at: FieldValue.serverTimestamp(),
        is_duplicate_attempt: false,
      });
      return newRef.id;
    });
  } catch (error) {
    throw new Error(
      `Failed to submit response for form "${formId}": ${error instanceof Error ? error.message : error}`
    );
  }
}
