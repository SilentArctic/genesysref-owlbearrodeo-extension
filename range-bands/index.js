import OBR from '@owlbear-rodeo/sdk';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import createMode from './mode';
import createAction from './action';
import createContextItem from './context';
import ID from '../constants/id.constants';
import handleTokenMove from './helpers/handleTokenMove';
import rangeDefaults from './range-band-defaults.json';
import removeRangeBands from './removeRangeBands';

dayjs.extend(relativeTime);

function createTool() {
   OBR.tool.create({
      id: `${ID}/range-tool`,
      icons: [{
         icon: '/gr-target.png',
         label: 'GenesysRef Range Bands',
      }],
      shortcut: 'ctrl + B',
      defaultMetadata: rangeDefaults,
   });
}

export default async () => {
   createTool();
   // createMode();
   createAction();
   createContextItem();

   /* reset range-bands on scene load */
   const characters = await OBR.scene.items
      .getItems(item => item.layer === 'CHARACTER' && item.metadata[`${ID}/show-range`]);
   removeRangeBands(characters);
   OBR.scene.items.updateItems(characters, chars => {
      chars.forEach(char => char.metadata[`${ID}/show-range`] = false);
   });

   /* move range-bands with token */
   OBR.scene.items.onChange(handleTokenMove);
};
