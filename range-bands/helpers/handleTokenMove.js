import ID from '../../constants/id.constants';
import createRangeBands from "../createRangeBands";

let snapshot = [];

function updateSnapshot(characters) {
   snapshot = characters;
}

export default function handleTokenMove(items) {
   const characters = items.filter(item => item.layer === 'CHARACTER');

   if (!snapshot.length) {
      return updateSnapshot(characters);
   }

   const changed = characters.find(char => {
      const oldChar = snapshot.find(snap => snap.id === char.id);
      return char.position.x !== oldChar.position.x
         || char.position.y !== oldChar.position.y;
   });

   if (changed && changed.metadata[`${ID}/show-range`]) {
      updateSnapshot(characters);
      createRangeBands([changed]);
   }
}