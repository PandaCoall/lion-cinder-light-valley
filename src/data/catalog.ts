import type { Block } from "@/data/volume";
import { blocks } from "@/data/volume";

export const genres = ["Fantasy", "Romance", "Mystery", "Tragedy"] as const;

export const tropes = [
  "Villainess",
  "Slow Burn",
  "Competent",
  "Possessive",
  "Second Chance",
  "Mystery",
  "Harem",
  "Cheating",
  "Love Triangle",
  "Tragedy",
] as const;

export type StoryCard = {
  id: string;
  title: string;
  hook: string;
  genre: (typeof genres)[number];
  tropes: string[];
  rating: string;
  excerpt: string;
  cover: string;
  audio: string;
};

export const stories: StoryCard[] = [
  {
    id: "salt",
    title: "Salt & Second Chances",
    hook: "He drowned on a Tuesday. The harbor gave the lantern back.",
    tropes: ["Second Chance", "Slow Burn", "Mystery", "Competent"],
    genre: "Fantasy",
    rating: "4.8",
    excerpt: "The tide had come in wrong. Lioren Hale knew the sound of a correct tide.",
    cover: "/plates/cover.jpg",
    audio: "He drowned on a Tuesday. The harbor gave the lantern back, and with it every promise the city never finished.",
  },
  {
    id: "errand",
    title: "The Letter’s Errand",
    hook: "One letter. No name. The city moves when he looks away.",
    tropes: ["Possessive", "Mystery", "Slow Burn"],
    genre: "Mystery",
    rating: "4.6",
    excerpt: "The wax was warm. Under his thumb the seal acknowledged him.",
    cover: "/plates/keeper.jpg",
    audio: "One letter. No name on it. The streets do not hold still.",
  },
  {
    id: "shirt",
    title: "A Shirt Left Folded",
    hook: "She folds it again because he said he would come back.",
    tropes: ["Tragedy", "Second Chance", "Love Triangle"],
    genre: "Tragedy",
    rating: "4.4",
    excerpt: "The shirt was not dirty. She folded it anyway.",
    cover: "/plates/street.jpg",
    audio: "The shirt was not dirty. She folded it because someone had promised to return.",
  },
];

export const previews: Record<string, { title: string; blocks: Block[] }> = {
  errand: {
    title: "The Letter’s Errand",
    blocks: [
      { kind: "chapter", id: "errand", kicker: "Scene", title: "No address" },
      {
        kind: "p",
        drop: true,
        text: "The wax was warm. Under his thumb the seal gave, not breaking, just acknowledging him, the way a door acknowledges a key it has decided to trust.",
      },
      {
        kind: "plate",
        id: "errand-keeper",
        src: "/plates/keeper.jpg",
        alt: "A keeper in a lighthouse doorway holds an unaddressed letter.",
        caption: "No name on the seal.",
      },
      {
        kind: "p",
        text: "“If I knew who it was for,” she said, “I would not need someone who can hear the endings that got lost.” The glass eye tracked a wave that was not in the room.",
      },
      { kind: "end" },
    ],
  },
  shirt: {
    title: "A Shirt Left Folded",
    blocks: [
      { kind: "chapter", id: "shirt", kicker: "Scene", title: "The last fold" },
      {
        kind: "p",
        drop: true,
        text: "The shirt was not dirty. She folded it anyway, because the person it belonged to had said he would return, and she had decided to believe him one more night.",
      },
      {
        kind: "plate",
        id: "shirt-street",
        src: "/plates/street.jpg",
        alt: "A flooded night street and a lit window.",
        caption: "The window stayed lit.",
      },
      {
        kind: "p",
        text: "Two promises pulled at the same sleeve. She kept folding. The city, rude as ever, kept both of them possible.",
      },
      { kind: "end" },
    ],
  },
};

export function findStory(id: string) {
  return stories.find((story) => story.id === id);
}

export function sampleSpeech(id: string, half: boolean): string {
  let text = "";
  if (id === "salt") {
    const start = blocks.findIndex((block) => block.kind === "chapter" && block.id === "pier");
    const end = blocks.findIndex((block, index) => index > start && block.kind === "chapter");
    text = speechFrom(blocks.slice(start, end < 0 ? undefined : end));
  } else {
    const preview = previews[id];
    text = preview ? speechFrom(preview.blocks) : (stories.find((story) => story.id === id)?.audio ?? "");
  }
  const words = text.split(/\s+/).filter(Boolean);
  const taken = half ? words.slice(0, Math.max(1, Math.ceil(words.length / 2))) : words;
  return taken.join(" ").slice(0, 1400);
}

function speechFrom(source: Block[]): string {
  return source
    .flatMap((block) => {
      if (block.kind === "chapter") return [block.title];
      if (block.kind === "p") return [block.text];
      return [];
    })
    .join(" ");
}

export function filterStories(query: string, want: string[], avoid: string[], genre: string) {
  const q = query.trim().toLowerCase();
  return stories.filter((story) => {
    if (genre && story.genre !== genre) return false;
    if (!want.every((trope) => story.tropes.includes(trope))) return false;
    if (avoid.some((trope) => story.tropes.includes(trope))) return false;
    if (!q) return true;
    return [story.title, story.hook, story.excerpt, story.genre, ...story.tropes]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}

export const retention = [
  { label: "Chapter 1 to 2", value: 71 },
  { label: "Finish the sample", value: 44 },
  { label: "Come back next day", value: 28 },
  { label: "Open from an illustration", value: 36 },
];

export const recapBank = [
  {
    from: 1,
    ask: "Who is Lioren?",
    answer: "Lioren Hale, nineteen, lamplighter’s apprentice. He drowned on a Tuesday and woke on the pier still holding the lantern.",
  },
  {
    from: 1,
    ask: "What is a thread?",
    answer: "An unfinished promise. It rises out of the water when the tide comes in wrong, and it looks for anyone still carrying a light.",
  },
  {
    from: 2,
    ask: "Who is Maris?",
    answer: "Maris Quell, former keeper. One eye is glass and holds a small green sea. She pours tea for the unfinished and kept a letter with no address.",
  },
  {
    from: 2,
    ask: "Catch me up",
    answer: "Lioren woke after drowning, followed a thread to the lighthouse, and took one unaddressed letter from Maris. The city between tides is where he has to deliver it. He has not found the recipient.",
  },
];
