import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reader-store-bNjKnc8J.js
var starterManuscript = `# The pier

The tide had come in wrong.

[[plate:portrait]]

He kept the bow, and the city kept the rest.
`;
var memory = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
var useReader = create()(persist((set) => ({
	theme: "paper",
	size: "md",
	mode: "bunko",
	face: "newsreader",
	width: "book",
	savedIds: [],
	skippedIds: [],
	openedIds: [],
	novels: [],
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
		{
			id: "pier",
			title: "The Pier That Remembers",
			body: "",
			status: "published",
			when: ""
		},
		{
			id: "letter",
			title: "A Letter with No Address",
			body: "",
			status: "published",
			when: ""
		},
		{
			id: "alley",
			title: "The alley",
			body: "He has not found them yet.",
			status: "draft",
			when: ""
		}
	],
	pay: "free",
	listens: 0,
	setTheme: (theme) => set({ theme }),
	setSize: (size) => set({ size }),
	setMode: (mode) => set({ mode }),
	setFace: (face) => set({ face }),
	setWidth: (width) => set({ width }),
	saveBook: (id) => set((state) => ({ savedIds: state.savedIds.includes(id) ? state.savedIds : [id, ...state.savedIds] })),
	unsaveBook: (id) => set((state) => ({ savedIds: state.savedIds.filter((item) => item !== id) })),
	skipBook: (id) => set((state) => ({ skippedIds: [id, ...state.skippedIds.filter((item) => item !== id)].slice(0, 12) })),
	unskipBook: (id) => set((state) => ({ skippedIds: state.skippedIds.filter((item) => item !== id) })),
	markOpened: (id) => set((state) => ({ openedIds: state.openedIds.includes(id) ? state.openedIds : [...state.openedIds, id] })),
	createNovel: () => {
		const id = `novel-${Date.now()}`;
		set((state) => ({ novels: [{
			id,
			title: "Untitled volume",
			hook: "",
			genre: "Fantasy",
			tropes: [],
			chapters: [{
				id: "ch-1",
				title: "Chapter One",
				body: ""
			}],
			plates: []
		}, ...state.novels] }));
		return id;
	},
	patchNovel: (id, patch) => set((state) => ({ novels: state.novels.map((novel) => novel.id === id ? {
		...novel,
		...patch
	} : novel) })),
	addChapter: (novelId) => {
		const id = `ch-${Date.now()}`;
		set((state) => ({ novels: state.novels.map((novel) => novel.id === novelId ? {
			...novel,
			chapters: [...novel.chapters, {
				id,
				title: `Chapter ${novel.chapters.length + 1}`,
				body: ""
			}]
		} : novel) }));
		return id;
	},
	importChapters: (novelId, incoming) => set((state) => ({ novels: state.novels.map((novel) => {
		if (novel.id !== novelId || !incoming.length) return novel;
		const blank = novel.chapters.every((chapter) => !chapter.body.trim());
		const made = incoming.map((item, index) => ({
			id: `ch-${Date.now()}-${index}`,
			title: item.title || `Chapter ${index + 1}`,
			body: item.body
		}));
		return {
			...novel,
			chapters: blank ? made : [...novel.chapters, ...made]
		};
	}) })),
	patchChapter: (novelId, chapterId, patch) => set((state) => ({ novels: state.novels.map((novel) => novel.id === novelId ? {
		...novel,
		chapters: novel.chapters.map((chapter) => chapter.id === chapterId ? {
			...chapter,
			...patch
		} : chapter)
	} : novel) })),
	addPlate: (novelId, plate) => set((state) => ({ novels: state.novels.map((novel) => novel.id === novelId ? {
		...novel,
		plates: [...novel.plates, plate]
	} : novel) })),
	removePlate: (novelId, plateId) => set((state) => ({ novels: state.novels.map((novel) => novel.id === novelId ? {
		...novel,
		plates: novel.plates.filter((plate) => plate.id !== plateId)
	} : novel) })),
	setAnchor: (anchor, chapterTitle, progress) => set((state) => state.anchor === anchor && state.chapterTitle === chapterTitle && state.progress === progress ? state : {
		anchor,
		chapterTitle,
		progress
	}),
	toggleDogear: (anchor) => set((state) => ({ dogears: state.dogears.includes(anchor) ? state.dogears.filter((item) => item !== anchor) : [...state.dogears, anchor] })),
	togglePlate: (id) => set((state) => ({ savedPlates: state.savedPlates.includes(id) ? state.savedPlates.filter((item) => item !== id) : [...state.savedPlates, id] })),
	addNote: (anchor, text) => set((state) => ({ notes: [...state.notes.filter((note) => note.anchor !== anchor), {
		anchor,
		text
	}] })),
	setBookmark: (anchor) => set({ bookmark: anchor }),
	setSealed: (sealed) => set({ sealed }),
	setOffline: (offline) => set({ offline }),
	setImportedTitle: (importedTitle) => set({ importedTitle }),
	setFinished: (finished) => set({ finished }),
	setManuscript: (manuscript) => set({ manuscript }),
	setPassedLine: (passedLine) => set({ passedLine }),
	setOwn: (ownTitle, ownBlocks) => set({
		ownTitle,
		ownBlocks
	}),
	setQuiet: (quiet) => set({ quiet }),
	setRate: (rate) => set({ rate }),
	addReaction: (key, emoji) => set((state) => ({ reactions: state.reactions.some((item) => item.key === key && item.emoji === emoji) ? state.reactions.filter((item) => !(item.key === key && item.emoji === emoji)) : [...state.reactions, {
		key,
		emoji
	}] })),
	addComment: (chapter, text) => set((state) => ({ comments: [...state.comments, {
		chapter,
		text
	}] })),
	addDraft: (title) => set((state) => ({ drafts: [...state.drafts, {
		id: `d-${state.drafts.length + 1}`,
		title,
		body: "",
		status: "draft",
		when: ""
	}] })),
	setDraft: (id, patch) => set((state) => ({ drafts: state.drafts.map((item) => item.id === id ? {
		...item,
		...patch
	} : item) })),
	setPay: (pay) => set({ pay }),
	bumpListens: () => set((state) => ({ listens: state.listens + 1 })),
	reset: () => set({
		anchor: 0,
		chapterTitle: "Salt & Second Chances",
		progress: 0
	})
}), {
	name: "lightnov-reader",
	storage: createJSONStorage(() => typeof window === "undefined" ? memory : localStorage),
	partialize: (state) => ({
		theme: state.theme,
		size: state.size,
		mode: state.mode,
		face: state.face,
		width: state.width,
		savedIds: state.savedIds,
		skippedIds: state.skippedIds,
		openedIds: state.openedIds,
		novels: state.novels,
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
		listens: state.listens
	})
}));
//#endregion
export { useReader as t };
