export type Block =
  | { kind: "title" }
  | { kind: "chapter"; id: string; kicker: string; title: string }
  | { kind: "p"; text: string; drop?: boolean }
  | { kind: "ornament" }
  | { kind: "plate"; id: string; src: string; alt: string; caption: string; bind?: string; insert?: boolean }
  | { kind: "end" }
  | { kind: "imprint" }
  | { kind: "insert" }
  | { kind: "afterword" }
  | { kind: "cast" }
  | { kind: "colophon" };

export const book = {
  title: "Salt & Second Chances",
  volume: "Volume I",
  subtitle: "The pier that remembers",
  blurb:
    "Three nights ago Lioren Hale drowned. The harbor gave him back his lantern, and with it every promise the city never finished.",
  imprint: "LightNov",
};

export const glossary = [
  {
    term: "Mirelle",
    blurb: "The harbor city. After a wrong tide it sits a half-inch off from the one you remember.",
    from: "pier" as const,
  },
  {
    term: "thread",
    blurb: "An unfinished promise. It rises out of the water and looks for anyone still carrying a light.",
    from: "pier" as const,
  },
  {
    term: "lighthouse",
    blurb: "Shuttered after Maris walked into the fog. It is lit anyway.",
    from: "pier" as const,
  },
];

export const codex = [
  {
    group: "Person",
    name: "Lioren Hale",
    title: "Apprentice",
    relation: "Woke holding Maris’s old lantern",
    ability: "Hears the endings that got lost",
    faction: "The unfinished",
    plate: "portrait",
    body: "Nineteen. Lamplighter’s apprentice. Drowned on a Tuesday and woke holding the old lantern.",
    from: "pier" as const,
  },
  {
    group: "Place",
    name: "The southern pier",
    title: "Last planks",
    relation: "Where he woke",
    ability: "The nails sing when he steps",
    faction: "Harbor",
    plate: "cover",
    body: "Last planks of the harbor. The nails sing when he steps on them.",
    from: "pier" as const,
  },
  {
    group: "Event",
    name: "The wrong tide",
    title: "Not a polite knock",
    relation: "Raises sunk promises",
    ability: "Looks for anyone still carrying a light",
    faction: "The harbor",
    plate: "cover",
    body: "Not the polite knock of water. It arrives already listening, and the sunk promises rise.",
    from: "pier" as const,
  },
  {
    group: "Person",
    name: "Maris Quell",
    title: "Former keeper",
    relation: "Kept the letter Lioren now carries",
    ability: "One glass eye holds a green sea",
    faction: "The lighthouse",
    plate: "keeper",
    body: "Former keeper. One glass eye holds a green sea. She pours tea for the unfinished.",
    from: "letter" as const,
  },
  {
    group: "Place",
    name: "Netmender’s Row",
    title: "Between tides",
    relation: "The road the letter pulls toward",
    ability: "Runs knee-deep, doors open",
    faction: "Mirelle",
    plate: "street",
    body: "Between tides it runs knee-deep, doors open, furniture drifting.",
    from: "letter" as const,
  },
];

export const cast = [
  { name: "Lioren Hale", role: "Apprentice", plate: "portrait" },
  { name: "Maris Quell", role: "Keeper", plate: "keeper" },
  { name: "The pier", role: "Where he woke", plate: "cover" },
  { name: "Netmender’s Row", role: "Between tides", plate: "street" },
];

export const chapters = [
  { id: "pier", kicker: "Chapter One", title: "The Pier That Remembers" },
  { id: "letter", kicker: "Chapter Two", title: "A Letter with No Address" },
] as const;

export const blocks: Block[] = [
  { kind: "insert" },
  {
    kind: "plate",
    id: "cover",
    src: "/plates/cover.jpg",
    alt: "Lioren Hale stands at the end of a night pier with a brass lantern, amber threads rising from the water toward a lit city and a lighthouse.",
    caption: "Color insert I. The southern pier.",
    insert: true,
  },
  {
    kind: "plate",
    id: "portrait-insert",
    src: "/plates/portrait.jpg",
    alt: "Close portrait of Lioren in his navy coat, lantern light on his face, a thin amber thread tied in a bow on the lantern.",
    caption: "Color insert II. The bow on the lantern.",
    insert: true,
  },
  {
    kind: "plate",
    id: "keeper-insert",
    src: "/plates/keeper.jpg",
    alt: "Maris Quell in the lighthouse doorway, one glass eye full of a tiny green sea, holding a letter sealed in vermillion wax.",
    caption: "Color insert III. The keeper and the letter.",
    insert: true,
  },
  {
    kind: "plate",
    id: "street-insert",
    src: "/plates/street.jpg",
    alt: "Lioren wades a flooded night street with his lantern, chairs drifting in lit rooms, a vermillion door ahead.",
    caption: "Color insert IV. Netmender’s Row.",
    insert: true,
  },
  { kind: "imprint" },
  { kind: "title" },
  { kind: "chapter", id: "pier", kicker: "Chapter One", title: "The Pier That Remembers" },
  {
    kind: "p",
    drop: true,
    text: "The tide had come in wrong.",
  },
  {
    kind: "p",
    text: "Lioren Hale knew the sound of a correct tide: a long hush, then the knock of water against pilings, polite as a neighbor. What climbed the pier tonight was not polite. It arrived already listening.",
  },
  {
    kind: "p",
    text: "He stood at the last plank with the brass lantern low, so the flame would not blind him to the dark beyond it. Salt had crusted the cuff of his coat. His hair — black, except for the pale streak the storm had left at his temple — stuck to his cheek and would not be reasoned with.",
  },
  {
    kind: "p",
    text: "Three nights ago he had drowned.",
  },
  {
    kind: "p",
    text: "He was reasonably sure of that. He remembered the mast coming down, the rope burning his palm, the harbor tilting until the sky was a lid. He remembered the cold deciding, very calmly, that he was finished. He did not remember climbing out. He only remembered waking on these boards with the lantern already lit in his hand, as if someone had trusted him with it and then thought better of staying to explain.",
  },
  {
    kind: "p",
    text: "“Right,” he said to the water. “If this is the afterlife, it has a maintenance problem.”",
  },
  {
    kind: "p",
    text: "The water answered by showing him a thread.",
  },
  {
    kind: "p",
    text: "It rose between two waves, thin as a harp string, the color of a window left on in a house you no longer live in. Then another. Then a loose handful, drifting up from the black and snagging on the air. They did not glow so much as remember glowing.",
  },
  {
    kind: "p",
    text: "Lioren crouched. The nearest thread trembled when his breath touched it. Up close it was not light. It was a sentence that had lost its ending — he could not read it, but he could feel the shape of the unfinished part, the way you feel a name on the tip of your tongue.",
  },
  {
    kind: "p",
    text: "A boy on a boat. A promise to come back before the lamps were lit. He hadn’t.",
  },
  {
    kind: "p",
    text: "Lioren pulled his hand away before he touched it. The thread leaned after his fingers anyway, hopeful and rude.",
  },
  {
    kind: "p",
    text: "“Don’t,” he said. “I don’t work here.”",
  },
  { kind: "ornament" },
  {
    kind: "p",
    text: "The pier disagreed. Every third plank had a nail that sang when he stepped back, a small bright note, as if the wood were taking attendance. His boot, his boot, his boot. When he stopped, the nails finished the bar without him.",
  },
  {
    kind: "p",
    text: "From the city came the ordinary sounds: a cart, a laugh cut short, the iron clock on Harbor Street trying to strike and getting stuck between ten and eleven, the way it had since he was small. Mirelle still existed. That should have been a comfort. It felt like a trick. The clock had been stuck between ten and eleven on the night he drowned, too.",
  },
  {
    kind: "p",
    text: "He lifted the lantern. Down the curve of the quay, windows burned in the stacked houses — fish-smokers, net-menders, the tea room that pretended not to water its wine. All of them looked a half-inch to the left of where he remembered. As if the whole city had been set back down by someone who was mostly, but not entirely, paying attention.",
  },
  {
    kind: "p",
    text: "A thread brushed his wrist. This one was warmer. A woman folding a shirt that wasn’t dirty, refolding it, because the person it belonged to had said he’d return for it and she had decided to believe him one more night. The feeling sat in Lioren’s chest like a swallowed stone.",
  },
  {
    kind: "p",
    text: "“I can’t deliver that,” he whispered. “I don’t know where he went. I don’t know where I went.”",
  },
  {
    kind: "p",
    text: "The lantern flame bent sideways, toward the lighthouse, though there was no wind at that height. The glass was fogged with salt. Inside, the flame was the same amber as the streak in his hair, which he tried not to find ominous and failed.",
  },
  {
    kind: "p",
    text: "He had been a lamplighter’s apprentice before the storm. Not a chosen one. Not a saint. Someone who knew which streets went dark first and which shopkeepers paid in bread instead of coin. The lantern in his hand was the old pattern, the one Maris Quell had retired because the hinge stuck.",
  },
  {
    kind: "p",
    text: "Maris had been gone for six years. Walked into a fog with a sack of unsent letters and did not walk out. Lioren had carried the wreath himself, and felt, even then, that the story was too tidy. Tidy stories left threads.",
  },
  {
    kind: "p",
    text: "The lighthouse at the end of the southern arm was lit.",
  },
  {
    kind: "p",
    text: "It should not have been. The harbor master had shuttered it the week after the wreath. Lioren looked at the water, at the undone promises rising out of it like a second, worse tide.",
  },
  {
    kind: "p",
    text: "“If I follow the light,” he told them, “and this is a trick, I am going to be extremely unpleasant about it.”",
  },
  {
    kind: "p",
    text: "A thread — the boy’s, he thought — tied itself in a small, ridiculous bow around his lantern ring. It did not tighten. It waited.",
  },
  {
    kind: "plate",
    id: "portrait",
    src: "/plates/portrait.jpg",
    alt: "Close portrait of Lioren in his navy coat, lantern light on his face, a thin amber thread tied in a bow on the lantern.",
    caption: "The thread made a bow of itself, and waited.",
    bind: "tied itself in a small, ridiculous bow",
  },
  {
    kind: "p",
    text: "Lioren sighed, which felt like a very alive thing to do, and started toward the southern arm.",
  },
  {
    kind: "p",
    text: "Behind him, the pier nails sang the rest of the melody to an empty dock. Ahead, the lighthouse opened one eye.",
  },
  { kind: "chapter", id: "letter", kicker: "Chapter Two", title: "A Letter with No Address" },
  {
    kind: "p",
    drop: true,
    text: "Maris Quell was not a ghost, or if she was, she had opinions about tea.",
  },
  {
    kind: "p",
    text: "She stood in the lighthouse door with the storm-lamp unhooded, silver hair coiled so tightly it looked structural, oilskin shedding water it had not earned tonight. One of her eyes was the eye Lioren remembered: dark, judging the angle of your shoulders before she judged your excuse. The other was glass, and the tide moved inside it — a green miniature sea, complete with a moon the size of a seed.",
  },
  {
    kind: "p",
    text: "“You’re late,” Maris said.",
  },
  {
    kind: "p",
    text: "“I’m dead,” Lioren said.",
  },
  {
    kind: "p",
    text: "“You’re late and damp. Wipe your feet. The dead are not exempt from the mat.”",
  },
  {
    kind: "p",
    text: "The mat said WELCOME in letters that had given up. Lioren wiped his feet. The bow of thread on his lantern ring brightened, once, like a dog recognizing a house.",
  },
  {
    kind: "p",
    text: "Inside, the lighthouse was exactly one room too large. Stairs went up. A kettle went on without anyone touching it, which Lioren decided to file under later. Maps of Mirelle papered the curved wall, but the streets on them did not hold still. A lane near the fish market crept a finger-width toward the door when he was not looking directly at it.",
  },
  {
    kind: "p",
    text: "“You drowned on a Tuesday,” Maris said, pouring. The tea smelled like orange peel and nail iron. “The city filed you under lost cargo. I filed you under unfinished.”",
  },
  {
    kind: "p",
    text: "“That’s not better.”",
  },
  {
    kind: "p",
    text: "“It is more accurate.” She set the cup down where his hands would be once they stopped pretending they were not shaking. “Drink. Then look at me and tell me what you saw on the pier.”",
  },
  {
    kind: "p",
    text: "He told her. The threads. The boy. The shirt. The way the city sat a half-inch wrong, like a tooth.",
  },
  {
    kind: "p",
    text: "Maris nodded as if this were a weather report. “Those are the leavings. People make promises here the way other towns make smoke. Most of them burn off. Some of them sink. When the tide comes in wrong — and it will, more often now — the sunk ones rise. They look for anyone still carrying a light.”",
  },
  {
    kind: "p",
    text: "“I didn’t volunteer.”",
  },
  {
    kind: "p",
    text: "“You kept the lantern when the water took everything else. That is a kind of volunteering. Annoying, I know.” The glass eye tracked a wave that was not in the room. “I walked into the fog because someone had to carry the letters that have no address. I got as far as the threshold. The threshold has been rude about letting me finish.”",
  },
  {
    kind: "p",
    text: "She drew a letter from inside the oilskin. Ordinary paper, salt-warped, sealed with vermillion wax and no name.",
  },
  {
    kind: "plate",
    id: "keeper",
    src: "/plates/keeper.jpg",
    alt: "Maris Quell in the lighthouse doorway, one glass eye full of a tiny green sea, holding a letter sealed in vermillion wax.",
    caption: "Maris Quell, still pouring for the unfinished.",
    bind: "She drew a letter from inside the oilskin.",
  },
  {
    kind: "p",
    text: "“One letter,” Maris said. “Not a quest. Not a destiny. A delivery. You walk the city between tides — you will know it, it looks like Mirelle seen through a wet window — and you find the person this belongs to. They will not look like they are waiting. They never do.”",
  },
  {
    kind: "p",
    text: "“And if I say no?”",
  },
  {
    kind: "p",
    text: "“Then the threads will keep tying bows on you until you look festive and useless. And I will still be here, pouring tea for no one, which I have been doing for six years and do not recommend.”",
  },
  {
    kind: "p",
    text: "Lioren turned the letter over. The wax was warm. Under his thumb the seal gave, not breaking, just acknowledging him, the way the pier nails had.",
  },
  {
    kind: "p",
    text: "“Who is it for?”",
  },
  {
    kind: "p",
    text: "“If I knew that, I would not need someone who can hear the endings that got lost.” Her real eye softened by approximately one degree, which for Maris was a speech. “You were a good apprentice. You noticed which streets went dark first. Do that again. The dark ones are where the letter will pull.”",
  },
  {
    kind: "p",
    text: "Outside, the clock on Harbor Street struck the half-hour it had been failing to reach. The sound came in bent.",
  },
  {
    kind: "p",
    text: "He put the letter inside his coat, against the pocket where he used to keep spare wick.",
  },
  {
    kind: "p",
    text: "“If I find them,” he said, “and they don’t want it?”",
  },
  {
    kind: "p",
    text: "“Then you will have done the rarer thing,” Maris said. “You will have offered an ending. Most people only offer more middle.”",
  },
  { kind: "ornament" },
  {
    kind: "p",
    text: "He left the lighthouse with the tea still hot in his mouth and the city rearranging itself ahead of his boots. Netmender’s Row now ran knee-deep in clear water. The doors stood open. Paper lamps burned in rooms where the furniture drifted in slow circles. A child on a balcony waved with the automatic courtesy of a dream. Lioren waved back.",
  },
  {
    kind: "plate",
    id: "street",
    src: "/plates/street.jpg",
    alt: "Lioren wades a flooded night street with his lantern, chairs drifting in lit rooms, a vermillion door ahead.",
    caption: "Netmender’s Row, between tides.",
    bind: "Netmender’s Row now ran knee-deep",
  },
  {
    kind: "p",
    text: "The thread-bow tugged toward an alley that had not existed at noon, where a single window stayed lit and a shirt, somewhere, was being folded for the last unnecessary time.",
  },
  {
    kind: "p",
    text: "“All right,” he told the letter, the lantern, the tide. “We do one. Then we renegotiate my being dead.”",
  },
  {
    kind: "p",
    text: "The alley accepted this as terms.",
  },
  {
    kind: "p",
    text: "Behind him, the lighthouse eye turned, keeping him in its small green moon until the corner took him. Ahead, Mirelle waited with its sleeves rolled, full of promises that had forgotten how to end, and one apprentice with a stuck hinge and a light.",
  },
  { kind: "afterword" },
  {
    kind: "plate",
    id: "omake",
    src: "/plates/portrait.jpg",
    alt: "Lioren, lantern lit, the thread still tied at the ring.",
    caption: "Omake. He kept the bow.",
  },
  { kind: "cast" },
  { kind: "colophon" },
  { kind: "end" },
];
