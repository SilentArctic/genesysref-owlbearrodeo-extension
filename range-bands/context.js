import OBR from '@owlbear-rodeo/sdk';
import ID from '../constants/id.constants';
import createRangeBands from './createRangeBands';
import removeRangeBands from './removeRangeBands';

export default function createContextItem() {
   OBR.contextMenu.create({
      id: `${ID}/range-context-item`,
      icons: [
         {
            icon: '/gr-target-x.png',
            label: 'Remove Range Bands',
            filter: {
               every: [
                  { key: 'layer', value: 'CHARACTER' },
                  { key: ['metadata', `${ID}/show-range`], value: true },
               ],
            },
         },
         {
            icon: '/gr-target.png',
            label: 'Range Bands',
            filter: {
               every: [{ key: 'layer', value: 'CHARACTER' }],
            },
         },
      ],
      shortcut: 'B',
      async onClick(context) {
         const metadata = await OBR.tool.getMetadata(`${ID}/range-tool`);

         if (!metadata) {
            OBR.notification.show('Default range sizes not set. Please activate the GenesysRef Range Bands tool (on the left sidebar, or ctrl + B) to initialize default range sizes.', 'WARNING');
            return;
         }

         if (context.items[0].metadata[`${ID}/show-range`]) {
            /* remove range bands */
            await removeRangeBands(context.items);
            OBR.scene.items.updateItems(context.items, items => {
               for (const item of items) {
                  item.metadata[`${ID}/show-range`] = false;
               }
            });
         } else {
            /* create range bands */
            await createRangeBands(context.items);
            OBR.scene.items.updateItems(context.items, items => {
               for (const item of items) {
                  item.metadata[`${ID}/show-range`] = true;
               }
            });
         }
      },
   });
}
