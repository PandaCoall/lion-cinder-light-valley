import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { starterManuscript } from "@/data/held";
import type { Block } from "@/data/volume";

export type ThemeName = "paper" | "sepia" | "night";
export type TypeSize = "sm" | "md" | "lg";
export type ReadMode = "bunko" | "scroll";
export type FaceName = "newsreader" | "literata" | "fraunces";

export type Note = { anchor: number; text: string };
export type Reaction = { key: string; emoji: string };
export type ChapterNote = { chapter: string; text: string };
export type Draft = { id: string; title: string; body: string; status: "draft" | "scheduled" | "published"; when: string };
export type PayMode = "free" | "intro" | "subscription";

type ReaderState = {
  theme: ThemeName;
  size: TypeSize;
  mode: ReadMode;
  face: FaceName;
  anchor: number;
  chapterTitle: string;
  progress: number;
  dogears: number[];
  savedPlates: string[];
  notes: Note[];
  bookmark: number | null;
  sealed: boolean;
  offline: boolean;
  importedTitle: string | null;
  finished: boolean;
  manuscript: string;
  passedLine: string;
  ownTitle: string | null;
  ownBlocks: Block[];
  quiet: boolean;
  rate: number;
  reactions: Reaction[];
  comments: ChapterNote[];
  drafts: Draft[];
  pay: PayMode;
  listens: number;
  setTheme: (theme: ThemeName) => void;
  setSize: (size: TypeSize) => void;
  setMode: (mode: ReadMode) => void;
  setFace: (face: FaceName) => void;
  setAnchor: (anchor: number, chapterTitle: string, progress: number) => void;
  toggleDogear: (anchor: number) => void;
  togglePlate: (id: string) => void;
  addNote: (anchor: number, text: string) => void;
  setBookmark: (anchor: number) => void;
  setSealed: (sealed: boolean) => void;
  setOffline: (offline: boolean) => void;
  setImportedTitle: (title: string | null) => void;
  setFinished: (finished: boolean) => void;
  setManuscript: (manuscript: string) => void;
  setPassedLine: (passedLine: string) => void;
  setOwn: (title: string, blocks: Block[]) => void;
  setQuiet: (quiet: boolean) => void;
  setRate: (rate: number) => void;
  addReaction: (key: string, emoji: string) => void;
  addComment: (chapter: string, text: string) => void;
  addDraft: (title: string) => void;
  setDraft: (id: string, patch: Partial<Draft>) => void;
  setPay: (pay: PayMode) => void;
  bumpListens: () => void;
  reset: () => void;
};

const memory = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useReader = create<ReaderState>()(
  persist(
    (set) => ({
      theme: "paper",
      size: "md",
      mode: "bunko",
      face: "newsreader",
      anchor: 0,
      chapterTitle: "Salt & Second Chances",
      progress: 0,
      dogears: [],
      savedPlates: [],
      notes: [],
      bookmark: null,
      sealed: true,
      offline: false,
      importedTitle: null,
      finished: false,
      manuscript: starterManuscript,
      passedLine: "",
      ownTitle: null,
      ownBlocks: [],
      quiet: false,
      rate: 1,
      reactions: [],
      comments: [],
      drafts: [
        { id: "pier", title: "The Pier That Remembers", body: "", status: "published", when: "" },
        { id: "letter", title: "A Letter with No Address", body: "", status: "published", when: "" },
        { id: "alley", title: "The alley", body: "He has not found them yet.", status: "draft", when: "" },
      ],
      pay: "free",
      listens: 0,
      setTheme: (theme) => set({ theme }),
      setSize: (size) => set({ size }),
      setMode: (mode) => set({ mode }),
      setFace: (face) => set({ face }),
      setAnchor: (anchor, chapterTitle, progress) =>
        set((state) =>
          state.anchor === anchor &&
          state.chapterTitle === chapterTitle &&
          state.progress === progress
            ? state
            : { anchor, chapterTitle, progress },
        ),
      toggleDogear: (anchor) =>
        set((state) => ({
          dogears: state.dogears.includes(anchor)
            ? state.dogears.filter((item) => item !== anchor)
            : [...state.dogears, anchor],
        })),
      togglePlate: (id) =>
        set((state) => ({
          savedPlates: state.savedPlates.includes(id)
            ? state.savedPlates.filter((item) => item !== id)
            : [...state.savedPlates, id],
        })),
      addNote: (anchor, text) =>
        set((state) => ({
          notes: [...state.notes.filter((note) => note.anchor !== anchor), { anchor, text }],
        })),
      setBookmark: (anchor) => set({ bookmark: anchor }),
      setSealed: (sealed) => set({ sealed }),
      setOffline: (offline) => set({ offline }),
      setImportedTitle: (importedTitle) => set({ importedTitle }),
      setFinished: (finished) => set({ finished }),
      setManuscript: (manuscript) => set({ manuscript }),
      setPassedLine: (passedLine) => set({ passedLine }),
      setOwn: (ownTitle, ownBlocks) => set({ ownTitle, ownBlocks }),
      setQuiet: (quiet) => set({ quiet }),
      setRate: (rate) => set({ rate }),
      addReaction: (key, emoji) =>
        set((state) => ({
          reactions: state.reactions.some((item) => item.key === key && item.emoji === emoji)
            ? state.reactions.filter((item) => !(item.key === key && item.emoji === emoji))
            : [...state.reactions, { key, emoji }],
        })),
      addComment: (chapter, text) => set((state) => ({ comments: [...state.comments, { chapter, text }] })),
      addDraft: (title) =>
        set((state) => ({
          drafts: [...state.drafts, { id: `d-${state.drafts.length + 1}`, title, body: "", status: "draft", when: "" }],
        })),
      setDraft: (id, patch) =>
        set((state) => ({
          drafts: state.drafts.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),
      setPay: (pay) => set({ pay }),
      bumpListens: () => set((state) => ({ listens: state.listens + 1 })),
      reset: () =>
        set({ anchor: 0, chapterTitle: "Salt & Second Chances", progress: 0 }),
    }),
    {
      name: "lightnov-reader",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memory : localStorage,
      ),
      partialize: (state) => ({
        theme: state.theme,
        size: state.size,
        mode: state.mode,
        face: state.face,
        anchor: state.anchor,
        chapterTitle: state.chapterTitle,
        progress: state.progress,
        dogears: state.dogears,
        savedPlates: state.savedPlates,
        notes: state.notes,
        bookmark: state.bookmark,
        sealed: state.sealed,
        offline: state.offline,
        importedTitle: state.importedTitle,
        finished: state.finished,
        manuscript: state.manuscript,
        passedLine: state.passedLine,
        ownTitle: state.ownTitle,
        ownBlocks: state.ownBlocks,
        quiet: state.quiet,
        rate: state.rate,
        reactions: state.reactions,
        comments: state.comments,
        drafts: state.drafts,
        pay: state.pay,
        listens: state.listens,
      }),
    },
  ),
);
