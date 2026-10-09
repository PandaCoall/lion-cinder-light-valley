export type AudiobookCue = { text: string; at: number };
export type AudiobookChapter = { id: string; title: string; lines: AudiobookCue[] };
export type Audiobook = { src: string; chapters: AudiobookChapter[] };

export const audiobooks: Record<string, Audiobook> = {
  "salt": {
    "src": "/audio/salt.mp3",
    "chapters": [
      {
        "id": "pier",
        "title": "The Pier That Remembers",
        "lines": [
          {
            "text": "The Pier That Remembers",
            "at": 0.12
          },
          {
            "text": "The tide had come in wrong.",
            "at": 3.41
          },
          {
            "text": "Lioren Hale knew the sound of a correct tide: a long hush, then the knock of water against pilings, polite as a neighbor. What climbed the pier tonight was not polite. It arrived already listening.",
            "at": 5.87
          },
          {
            "text": "He stood at the last plank with the brass lantern low, so the flame would not blind him to the dark beyond it. Salt had crusted the cuff of his coat. His hair — black, except for the pale streak the storm had left at his temple — stuck to his cheek and would not be reasoned with.",
            "at": 19.6
          },
          {
            "text": "Three nights ago he had drowned.",
            "at": 37.11
          },
          {
            "text": "He was reasonably sure of that. He remembered the mast coming down, the rope burning his palm, the harbor tilting until the sky was a lid. He remembered the cold deciding, very calmly, that he was finished. He did not remember climbing out. He only remembered waking on these boards with the lantern already lit in his hand, as if someone had trusted him with it and then thought better of staying to explain.",
            "at": 39.9
          },
          {
            "text": "“Right,” he said to the water. “If this is the afterlife, it has a maintenance problem.”",
            "at": 66.54
          },
          {
            "text": "The water answered by showing him a thread.",
            "at": 72.8
          },
          {
            "text": "It rose between two waves, thin as a harp string, the color of a window left on in a house you no longer live in. Then another. Then a loose handful, drifting up from the black and snagging on the air. They did not glow so much as remember glowing.",
            "at": 76.26
          },
          {
            "text": "Lioren crouched. The nearest thread trembled when his breath touched it. Up close it was not light. It was a sentence that had lost its ending — he could not read it, but he could feel the shape of the unfinished part, the way you feel a name on the tip of your tongue.",
            "at": 92.82
          },
          {
            "text": "A boy on a boat. A promise to come back before the lamps were lit. He hadn’t.",
            "at": 109.56
          },
          {
            "text": "Lioren pulled his hand away before he touched it. The thread leaned after his fingers anyway, hopeful and rude.",
            "at": 115.24
          },
          {
            "text": "“Don’t,” he said. “I don’t work here.”",
            "at": 123.28
          },
          {
            "text": "The pier disagreed. Every third plank had a nail that sang when he stepped back, a small bright note, as if the wood were taking attendance. His boot, his boot, his boot. When he stopped, the nails finished the bar without him.",
            "at": 126.44
          },
          {
            "text": "From the city came the ordinary sounds: a cart, a laugh cut short, the iron clock on Harbor Street trying to strike and getting stuck between ten and eleven, the way it had since he was small. Mirelle still existed. That should have been a comfort. It felt like a trick. The clock had been stuck between ten and eleven on the night he drowned, too.",
            "at": 141.54
          },
          {
            "text": "He lifted the lantern. Down the curve of the quay, windows burned in the stacked houses — fish-smokers, net-menders, the tea room that pretended not to water its wine. All of them looked a half-inch to the left of where he remembered. As if the whole city had been set back down by someone who was mostly, but not entirely, paying attention.",
            "at": 163.31
          },
          {
            "text": "A thread brushed his wrist. This one was warmer. A woman folding a shirt that wasn’t dirty, refolding it, because the person it belonged to had said he’d return for it and she had decided to believe him one more night. The feeling sat in Lioren’s chest like a swallowed stone.",
            "at": 185.49
          },
          {
            "text": "“I can’t deliver that,” he whispered. “I don’t know where he went. I don’t know where I went.”",
            "at": 203.9
          },
          {
            "text": "The lantern flame bent sideways, toward the lighthouse, though there was no wind at that height. The glass was fogged with salt. Inside, the flame was the same amber as the streak in his hair, which he tried not to find ominous and failed.",
            "at": 209.84
          },
          {
            "text": "He had been a lamplighter’s apprentice before the storm. Not a chosen one. Not a saint. Someone who knew which streets went dark first and which shopkeepers paid in bread instead of coin. The lantern in his hand was the old pattern, the one Maris Quell had retired because the hinge stuck.",
            "at": 225.45
          },
          {
            "text": "Maris had been gone for six years. Walked into a fog with a sack of unsent letters and did not walk out. Lioren had carried the wreath himself, and felt, even then, that the story was too tidy. Tidy stories left threads.",
            "at": 243.88
          },
          {
            "text": "The lighthouse at the end of the southern arm was lit.",
            "at": 259.46
          },
          {
            "text": "It should not have been. The harbor master had shuttered it the week after the wreath. Lioren looked at the water, at the undone promises rising out of it like a second, worse tide.",
            "at": 263.45
          },
          {
            "text": "“If I follow the light,” he told them, “and this is a trick, I am going to be extremely unpleasant about it.”",
            "at": 275.31
          },
          {
            "text": "A thread — the boy’s, he thought — tied itself in a small, ridiculous bow around his lantern ring. It did not tighten. It waited.",
            "at": 282.65
          },
          {
            "text": "Lioren sighed, which felt like a very alive thing to do, and started toward the southern arm.",
            "at": 291.73
          },
          {
            "text": "Behind him, the pier nails sang the rest of the melody to an empty dock. Ahead, the lighthouse opened one eye.",
            "at": 298.42
          }
        ]
      },
      {
        "id": "letter",
        "title": "A Letter with No Address",
        "lines": [
          {
            "text": "A Letter with No Address",
            "at": 306.47
          },
          {
            "text": "Maris Quell was not a ghost, or if she was, she had opinions about tea.",
            "at": 309.76
          },
          {
            "text": "She stood in the lighthouse door with the storm-lamp unhooded, silver hair coiled so tightly it looked structural, oilskin shedding water it had not earned tonight. One of her eyes was the eye Lioren remembered: dark, judging the angle of your shoulders before she judged your excuse. The other was glass, and the tide moved inside it — a green miniature sea, complete with a moon the size of a seed.",
            "at": 315.29
          },
          {
            "text": "“You’re late,” Maris said.",
            "at": 341.31
          },
          {
            "text": "“I’m dead,” Lioren said.",
            "at": 343.8
          },
          {
            "text": "“You’re late and damp. Wipe your feet. The dead are not exempt from the mat.”",
            "at": 346.38
          },
          {
            "text": "The mat said WELCOME in letters that had given up. Lioren wiped his feet. The bow of thread on his lantern ring brightened, once, like a dog recognizing a house.",
            "at": 351.79
          },
          {
            "text": "Inside, the lighthouse was exactly one room too large. Stairs went up. A kettle went on without anyone touching it, which Lioren decided to file under later. Maps of Mirelle papered the curved wall, but the streets on them did not hold still. A lane near the fish market crept a finger-width toward the door when he was not looking directly at it.",
            "at": 363.35
          },
          {
            "text": "“You drowned on a Tuesday,” Maris said, pouring. The tea smelled like orange peel and nail iron. “The city filed you under lost cargo. I filed you under unfinished.”",
            "at": 385.68
          },
          {
            "text": "“That’s not better.”",
            "at": 397.45
          },
          {
            "text": "“It is more accurate.” She set the cup down where his hands would be once they stopped pretending they were not shaking. “Drink. Then look at me and tell me what you saw on the pier.”",
            "at": 399.53
          },
          {
            "text": "He told her. The threads. The boy. The shirt. The way the city sat a half-inch wrong, like a tooth.",
            "at": 410.99
          },
          {
            "text": "Maris nodded as if this were a weather report. “Those are the leavings. People make promises here the way other towns make smoke. Most of them burn off. Some of them sink. When the tide comes in wrong — and it will, more often now — the sunk ones rise. They look for anyone still carrying a light.”",
            "at": 417.88
          },
          {
            "text": "“I didn’t volunteer.”",
            "at": 437.59
          },
          {
            "text": "“You kept the lantern when the water took everything else. That is a kind of volunteering. Annoying, I know.” The glass eye tracked a wave that was not in the room. “I walked into the fog because someone had to carry the letters that have no address. I got as far as the threshold. The threshold has been rude about letting me finish.”",
            "at": 439.85
          },
          {
            "text": "She drew a letter from inside the oilskin. Ordinary paper, salt-warped, sealed with vermillion wax and no name.",
            "at": 460.48
          },
          {
            "text": "“One letter,” Maris said. “Not a quest. Not a destiny. A delivery. You walk the city between tides — you will know it, it looks like Mirelle seen through a wet window — and you find the person this belongs to. They will not look like they are waiting. They never do.”",
            "at": 468.64
          },
          {
            "text": "“And if I say no?”",
            "at": 485.4
          },
          {
            "text": "“Then the threads will keep tying bows on you until you look festive and useless. And I will still be here, pouring tea for no one, which I have been doing for six years and do not recommend.”",
            "at": 487.64
          },
          {
            "text": "Lioren turned the letter over. The wax was warm. Under his thumb the seal gave, not breaking, just acknowledging him, the way the pier nails had.",
            "at": 499.9
          },
          {
            "text": "“Who is it for?”",
            "at": 510.51
          },
          {
            "text": "“If I knew that, I would not need someone who can hear the endings that got lost.” Her real eye softened by approximately one degree, which for Maris was a speech. “You were a good apprentice. You noticed which streets went dark first. Do that again. The dark ones are where the letter will pull.”",
            "at": 512.67
          },
          {
            "text": "Outside, the clock on Harbor Street struck the half-hour it had been failing to reach. The sound came in bent.",
            "at": 531.0
          },
          {
            "text": "He put the letter inside his coat, against the pocket where he used to keep spare wick.",
            "at": 538.29
          },
          {
            "text": "“If I find them,” he said, “and they don’t want it?”",
            "at": 543.95
          },
          {
            "text": "“Then you will have done the rarer thing,” Maris said. “You will have offered an ending. Most people only offer more middle.”",
            "at": 547.86
          },
          {
            "text": "He left the lighthouse with the tea still hot in his mouth and the city rearranging itself ahead of his boots. Netmender’s Row now ran knee-deep in clear water. The doors stood open. Paper lamps burned in rooms where the furniture drifted in slow circles. A child on a balcony waved with the automatic courtesy of a dream. Lioren waved back.",
            "at": 555.27
          },
          {
            "text": "The thread-bow tugged toward an alley that had not existed at noon, where a single window stayed lit and a shirt, somewhere, was being folded for the last unnecessary time.",
            "at": 578.28
          },
          {
            "text": "“All right,” he told the letter, the lantern, the tide. “We do one. Then we renegotiate my being dead.”",
            "at": 590.01
          },
          {
            "text": "The alley accepted this as terms.",
            "at": 597.12
          },
          {
            "text": "Behind him, the lighthouse eye turned, keeping him in its small green moon until the corner took him. Ahead, Mirelle waited with its sleeves rolled, full of promises that had forgotten how to end, and one apprentice with a stuck hinge and a light.",
            "at": 600.06
          }
        ]
      }
    ]
  },
  "errand": {
    "src": "/audio/errand.mp3",
    "chapters": [
      {
        "id": "errand",
        "title": "No address",
        "lines": [
          {
            "text": "No address",
            "at": 0.12
          },
          {
            "text": "The wax was warm. Under his thumb the seal gave, not breaking, just acknowledging him, the way a door acknowledges a key it has decided to trust.",
            "at": 2.23
          },
          {
            "text": "“If I knew who it was for,” she said, “I would not need someone who can hear the endings that got lost.” The glass eye tracked a wave that was not in the room.",
            "at": 11.99
          }
        ]
      }
    ]
  },
  "shirt": {
    "src": "/audio/shirt.mp3",
    "chapters": [
      {
        "id": "shirt",
        "title": "The last fold",
        "lines": [
          {
            "text": "The last fold",
            "at": 0.12
          },
          {
            "text": "The shirt was not dirty. She folded it anyway, because the person it belonged to had said he would return, and she had decided to believe him one more night.",
            "at": 2.36
          },
          {
            "text": "Two promises pulled at the same sleeve. She kept folding. The city, rude as ever, kept both of them possible.",
            "at": 13.17
          }
        ]
      }
    ]
  }
};
