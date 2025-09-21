// Shortlist & Application Tracker utilities
// Persisted in localStorage (and optionally mirrored to IndexedDB via offlineStorage)

export type ApplicationStatus = "interested" | "applied" | "interview" | "offer" | "rejected";

export interface DocumentChecklist {
  resume: boolean;
  idProof: boolean;
  collegeLetter: boolean;
  cgpaSheet: boolean;
  sop: boolean;
}

export interface TrackedInternship {
  internshipId: string;
  title: string;
  organization: string;
  deadlineISO?: string | null;
  status: ApplicationStatus;
  notes?: string;
  documents: DocumentChecklist;
  updatedAt: number;
}

const STORAGE_KEY_PREFIX = "pmis-shortlist-";

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export class ShortlistTracker {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId || "guest";
  }

  private loadAll(): Record<string, TrackedInternship> {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(getStorageKey(this.userId));
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      // Validate the structure
      if (typeof parsed !== 'object' || parsed === null) return {};
      return parsed as Record<string, TrackedInternship>;
    } catch (error) {
      console.warn('Failed to load tracked internships:', error);
      return {};
    }
  }

  private saveAll(map: Record<string, TrackedInternship>) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(getStorageKey(this.userId), JSON.stringify(map));
    } catch (error) {
      console.warn('Failed to save tracked internships:', error);
    }
  }

  list(): TrackedInternship[] {
    const map = this.loadAll();
    return Object.values(map).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  get(internshipId: string): TrackedInternship | undefined {
    const map = this.loadAll();
    return map[internshipId];
  }

  toggleSave(entry: Omit<TrackedInternship, "updatedAt">): TrackedInternship | undefined {
    if (!entry.internshipId || !entry.title || !entry.organization) {
      console.warn('Invalid entry for toggleSave:', entry);
      return undefined;
    }
    
    const map = this.loadAll();
    if (map[entry.internshipId]) {
      // remove
      delete map[entry.internshipId];
      this.saveAll(map);
      return undefined;
    }
    const toSave: TrackedInternship = { ...entry, updatedAt: Date.now() };
    map[entry.internshipId] = toSave;
    this.saveAll(map);
    return toSave;
  }

  upsert(update: TrackedInternship) {
    const map = this.loadAll();
    map[update.internshipId] = { ...update, updatedAt: Date.now() };
    this.saveAll(map);
  }

  updateStatus(internshipId: string, status: ApplicationStatus) {
    const map = this.loadAll();
    if (!map[internshipId]) return;
    map[internshipId].status = status;
    map[internshipId].updatedAt = Date.now();
    this.saveAll(map);
  }

  updateDocuments(internshipId: string, documents: Partial<DocumentChecklist>) {
    const map = this.loadAll();
    if (!map[internshipId]) return;
    map[internshipId].documents = { ...map[internshipId].documents, ...documents };
    map[internshipId].updatedAt = Date.now();
    this.saveAll(map);
  }

  updateNotes(internshipId: string, notes: string) {
    const map = this.loadAll();
    if (!map[internshipId]) return;
    map[internshipId].notes = notes;
    map[internshipId].updatedAt = Date.now();
    this.saveAll(map);
  }

  isSaved(internshipId: string): boolean {
    const map = this.loadAll();
    return Boolean(map[internshipId]);
  }
}

export function getDefaultChecklist(): DocumentChecklist {
  return {
    resume: false,
    idProof: false,
    collegeLetter: false,
    cgpaSheet: false,
    sop: false,
  };
}


