import OBR from '@owlbear-rodeo/sdk';
import createAction from './action';
import createContextItem from './context';
import ID from '../constants/id.constants';
import handleTokenMove from './helpers/handleTokenMove';
import rangeDefaults from './range-band-defaults.json';
import removeRangeBands from './removeRangeBands';

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

   OBR.tool.createMode({
      id: `${ID}/select`,
      icons: [{
         icon: '/hand-back-right.svg',
         label: 'Move',
         filter: {
            activeTools: [`${ID}/range-tool`],
         },
      }],
      preventDrag: { dragging: true },
      cursors: [
         {
            cursor: 'pointer',
            filter: {
               target: [{ key: 'layer', value: 'CHARACTER' }],
            },
         },
         {
            cursor: 'move',
         },
      ],
   });
}

export default async () => {
   createTool();
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
