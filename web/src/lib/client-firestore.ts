import { getClientDb } from "@/lib/firebase";
import type { User } from "@/types";

type PostCategory = "news" | "activity_review";

interface PublicPostItem {
    id: string;
    slug: string;
    title: string;
    category: string;
    tags: string[];
    excerpt: string;
    cover_image_url: string | null;
    published_at_display: string;
}

interface PublicPostResult {
    posts: PublicPostItem[];
    total: number;
    totalPages: number;
}

function toDate(value: unknown): Date | null {
    if (!value) return null;
    if (typeof value === "object" && value !== null && "toDate" in value) {
        try {
            const d = (value as { toDate: () => Date }).toDate();
            return Number.isNaN(d.getTime()) ? null : d;
        } catch {
            return null;
        }
    }
    if (typeof value === "string") {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    if (typeof value === "object" && value !== null) {
        const sec =
            typeof (value as { seconds?: unknown }).seconds === "number"
                ? ((value as { seconds: number }).seconds as number)
                : typeof (value as { _seconds?: unknown })._seconds === "number"
                    ? ((value as { _seconds: number })._seconds as number)
                    : null;
        if (sec != null) {
            const d = new Date(sec * 1000);
            return Number.isNaN(d.getTime()) ? null : d;
        }
    }
    return null;
}

export async function getPublicPosts(options: {
    category: PostCategory;
    page: number;
    perPage: number;
    tag?: string;
}): Promise<PublicPostResult> {
    const { collection, getCountFromServer, getDocs, limit, orderBy, query, startAfter, where } =
        await import("firebase/firestore");
    const db = await getClientDb();

    const safePage = Math.max(1, options.page);
    const safePerPage = Math.min(50, Math.max(1, options.perPage));

    const constraints: Parameters<typeof query>[1][] = [
        where("status", "==", "published"),
        where("category", "==", options.category),
    ];
    if (options.tag) {
        constraints.push(where("tags", "array-contains", options.tag));
    }

    const baseQuery = query(collection(db, "posts"), ...constraints);
    const countSnapshot = await getCountFromServer(baseQuery);
    const total = countSnapshot.data().count;

    let pageQuery = query(baseQuery, orderBy("published_at", "desc"), limit(safePerPage));

    if (safePage > 1) {
        const offsetSize = (safePage - 1) * safePerPage;
        const offsetSnapshot = await getDocs(
            query(baseQuery, orderBy("published_at", "desc"), limit(offsetSize)),
        );
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        if (lastDoc) {
            pageQuery = query(
                baseQuery,
                orderBy("published_at", "desc"),
                startAfter(lastDoc),
                limit(safePerPage),
            );
        }
    }

    const snapshot = await getDocs(pageQuery);
    const posts = snapshot.docs.map((doc) => {
        const data = doc.data() as Record<string, unknown>;
        const publishedAt = toDate(data.published_at);
        const markdown = typeof data.content_markdown === "string" ? data.content_markdown : "";
        return {
            id: doc.id,
            slug: typeof data.slug === "string" ? data.slug : doc.id,
            title: typeof data.title === "string" ? data.title : "(未命名)",
            category: typeof data.category === "string" ? data.category : "",
            cover_image_url:
                typeof data.cover_image_url === "string" && data.cover_image_url.length > 0
                    ? data.cover_image_url
                    : null,
            tags: Array.isArray(data.tags) ? data.tags.map((t) => String(t)) : [],
            excerpt: markdown.substring(0, 120).replace(/[#*_>\-\[\]`]/g, ""),
            published_at_display: publishedAt
                ? publishedAt.toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
                : "—",
        };
    });

    return {
        posts,
        total,
        totalPages: Math.max(1, Math.ceil(total / safePerPage)),
    };
}

export interface ClubOption {
    id: string;
    name: string;
    category: string;
    category_code?: string;
}

export async function getActiveClubs(category?: string): Promise<ClubOption[]> {
    const { collection, getDocs, query, where } = await import("firebase/firestore");
    const db = await getClientDb();

    const clauses: Parameters<typeof query>[1][] = [where("is_active", "==", true)];
    if (category) clauses.push(where("category", "==", category));

    const snapshot = await getDocs(query(collection(db, "clubs"), ...clauses));
    return snapshot.docs
        .map((doc) => {
            const data = doc.data() as Record<string, unknown>;
            return {
                id: doc.id,
                name: typeof data.name === "string" ? data.name : doc.id,
                category: typeof data.category === "string" ? data.category : "",
                category_code:
                    typeof data.category_code === "string" ? data.category_code : undefined,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
}

export interface ProfileUser extends Pick<
    User,
    "display_name" | "club_id" | "position_title" | "department_grade" | "profile_completed"
> {
    club_name?: string;
    club_category?: string;
}

export async function getProfileUser(uid: string): Promise<ProfileUser | null> {
    const { doc, getDoc } = await import("firebase/firestore");
    const db = await getClientDb();
    const userSnap = await getDoc(doc(db, "users", uid));
    if (!userSnap.exists()) return null;

    const userData = userSnap.data() as Record<string, unknown>;
    const profile: ProfileUser = {
        display_name: typeof userData.display_name === "string" ? userData.display_name : "",
        club_id: typeof userData.club_id === "string" ? userData.club_id : "",
        position_title:
            typeof userData.position_title === "string" ? userData.position_title : undefined,
        department_grade:
            typeof userData.department_grade === "string" ? userData.department_grade : undefined,
        profile_completed:
            typeof userData.profile_completed === "boolean" ? userData.profile_completed : undefined,
    };

    if (profile.club_id) {
        const clubSnap = await getDoc(doc(db, "clubs", profile.club_id));
        if (clubSnap.exists()) {
            const clubData = clubSnap.data() as Record<string, unknown>;
            profile.club_name =
                typeof clubData.name === "string" ? clubData.name : undefined;
            profile.club_category =
                typeof clubData.category === "string" ? clubData.category : undefined;
        }
    }

    return profile;
}

export async function saveProfileUser(params: {
    uid: string;
    email: string;
    displayName: string;
    clubId: string;
    positionTitle?: string;
    departmentGrade?: string;
    profileCompleted?: boolean;
}): Promise<void> {
    const { doc, getDoc, setDoc, updateDoc } = await import("firebase/firestore");
    const db = await getClientDb();
    const ref = doc(db, "users", params.uid);
    const existing = await getDoc(ref);

    const commonPatch = {
        display_name: params.displayName,
        club_id: params.clubId,
        position_title: params.positionTitle ?? "",
        department_grade: params.departmentGrade ?? "",
        profile_completed: params.profileCompleted !== false,
    };

    if (existing.exists()) {
        await updateDoc(ref, commonPatch);
        return;
    }

    await setDoc(ref, {
        uid: params.uid,
        email: params.email,
        role: "club_member",
        ...commonPatch,
    });
}
