import OBR from '@owlbear-rodeo/sdk';
import ID from '../constants/id.constants';
import removeRangeBands from './removeRangeBands';

export default function action() {
   OBR.tool.createAction({
      id: `${ID}/range-action`,
      icons: [{
         icon: '/settings-sliders.png',
         label: 'Range Band Settings',
         filter: {
            activeTools: [`${ID}/range-tool`],
         },
      }],
      onClick(_, elementId) {
         OBR.popover.open({
            id: `${ID}/range-picker`,
            height: 360,
            width: 200,
            url: '/range-bands/range-picker.html',
            anchorElementId: elementId,
            anchorOrigin: {
               horizontal: 'CENTER',
               vertical: 'BOTTOM',
            },
            transformOrigin: {
               horizontal: 'CENTER',
               vertical: 'TOP',
            },
         });
      },
   });

   OBR.tool.createAction({
      id: `${ID}/remove-all-ranges`,
      icons: [{
         icon: '/gr-target-x.png',
         label: 'Remove All Range Bands',
         filter: {
            activeTools: [`${ID}/range-tool`],
         },
      }],
      async onClick() {
         const characters = await OBR.scene.items.getItems(item => item.layer === 'CHARACTER');

         await OBR.scene.items.updateItems(characters, chars => {
            for (const character of chars) {
               character.metadata[`${ID}/show-range`] = false;
            }
         });

         removeRangeBands(characters);
      },
   });
}
