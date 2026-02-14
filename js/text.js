// text.js — All scene text. Use CONFIG for personalization.
const SCENE_TEXT = {
  0: {
    // Title — no dialogue, just elements
  },
  1: {
    blocks: [
      { type: 'header', content: 'CASE FILE #0214\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCONFIDENTIAL — VALENTINE\'S DIVISION\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSUBJECT: {{recipientName}}\nSTATUS: Active Investigation\nDATE: February 14th\nCLASSIFICATION: URGENT — GIFT AT LARGE' },
      { type: 'body', content: 'INCIDENT REPORT\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAt approximately {{timeOfDay}}, an anonymous party left a message. A gift has been secreted somewhere on the Clarkson University campus. The recipient has not been identified — until now.\n\nYOU have been selected to lead this investigation.' },
      { type: 'body', content: 'YOUR MISSION\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFollow the clues.\nVisit each location.\nUncover the truth.\n\nThe gift awaits. But only for the detective clever enough to find it.' },
      { type: 'body', content: 'SIGNED,\n{{senderName}}\nChief of Valentine Operations (probably)\n\n[Redacted for reasons of ~mystery~]' }
    ]
  },
  2: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 1 ]\nThe Quad. February 14th. Overcast.' },
      { type: 'body', content: 'You arrive at the heart of campus. The snow is fresh. The air is cold. Your breath fogs in the pixel-art air.\n\nSomething catches your eye: a note, left on a bench.' },
      { type: 'clue', content: 'You pick it up. It reads:\n\n"Where pages turn and silence wins,\nwhere students chase their might-have-beens —\ngo there next. The clue begins."' },
      { type: 'case-note', content: 'CASE NOTE: Obviously the library. You\'re a brilliant detective. Obviously.' }
    ]
  },
  3: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 2 ]\nThe Library. Snell Hall. Quiet.' },
      { type: 'body', content: 'Rows of books. The smell of old paper (you imagine it). You scan the shelves.\n\nThere — on a study carrel. A bookmark. No, a note.' },
      { type: 'clue', content: '"Where Knights fight and crowds cheer loud,\nwhere winter games break through the cloud —\nthat\'s your next stop. Make us proud."' },
      { type: 'case-note', content: 'CASE NOTE: Cheel Arena. The Golden Knight knows all. Obviously.' }
    ]
  },
  4: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 3 ]\nCheel Arena. Home of the Golden Knights.' },
      { type: 'body', content: 'The ice gleams. The stands are empty. It\'s just you and the echoes of a thousand games.\n\nOn a seat, row 7: a single note.' },
      { type: 'clue', content: '"Where coffee steams and ideas brew,\nwhere friends meet up and skies look blue —\nhead there next. The trail leads you."' },
      { type: 'case-note', content: 'CASE NOTE: The Student Center café. Or anywhere with coffee. You\'ve earned one.' }
    ]
  },
  5: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — ENTRY 4 ]\nThe Student Center. The café. Warm.' },
      { type: 'body', content: 'Coffee. Cocoa. The buzz of conversation. You find a table by the window.\n\nThere\'s a note. And maybe a heart doodled in the corner.' },
      { type: 'clue', content: '"Where the river runs and cold winds blow,\nwhere the last clue waits — you\'ll know.\nThe gift is close. Just one more go."' },
      { type: 'case-note', content: 'CASE NOTE: The river. The bridge. The end of the trail. Your pulse quickens. (Detective instinct. Obviously.)' }
    ]
  },
  6: {
    blocks: [
      { type: 'location', content: '[ LOCATION LOG — FINAL ENTRY ]\nThe River. The bridge. Evening.' },
      { type: 'body', content: 'You walk to the water\'s edge. The snow crunches underfoot. The river flows, dark and quiet.\n\nOn the bench: one last envelope. Your name on it.' },
      { type: 'body', content: 'You open it.' },
      { type: 'clue', content: '"The gift was never lost.\nIt was always yours.\n\nSomeone who cares about you — a lot — left it right here. Not because you had to solve puzzles. But because you\'re worth a little adventure. And a little mystery. And a little extra thought."' },
      { type: 'clue', content: '"Happy Valentine\'s, detective.\nYou solved it. You always do."' },
      { type: 'case-note', content: 'CASE NOTE: Case closed. With a smile.' }
    ]
  },
  7: {
    // No blocks — QR reveal handled separately
  }
};

function interpolate(str) {
  return str
    .replace(/\{\{recipientName\}\}/g, CONFIG.recipientName)
    .replace(/\{\{senderName\}\}/g, CONFIG.senderName)
    .replace(/\{\{timeOfDay\}\}/g, CONFIG.timeOfDay);
}

function getBlock(sceneId, blockIndex) {
  const scene = SCENE_TEXT[sceneId];
  if (!scene || !scene.blocks || blockIndex >= scene.blocks.length) return null;
  const block = scene.blocks[blockIndex];
  return { ...block, content: interpolate(block.content) };
}

function getBlockCount(sceneId) {
  const scene = SCENE_TEXT[sceneId];
  return scene && scene.blocks ? scene.blocks.length : 0;
}
