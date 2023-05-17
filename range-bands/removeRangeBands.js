import OBR from "@owlbear-rodeo/sdk";
import ID from '../constants/id.constants';

export default function removeRangeBands(characters) {
   characters.forEach(async character => {
      const items = await OBR.scene.items.getItems(item => item.metadata[`${ID}/range-band-anchor`] === character.id);

      if (items.length) {
         await OBR.scene.items.deleteItems(items.map(item => item.id));
      }
   });
}
