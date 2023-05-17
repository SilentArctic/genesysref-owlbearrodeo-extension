import OBR from '@owlbear-rodeo/sdk';
import ID from '../constants/id.constants';

export default function createMode() {
   OBR.tool.createMode({
      id: `${ID}/range-mode-one`,
      icons: [
         {
            icon: '/gr-target.png',
            label: 'Target One',
            filter: {
               activeTools: [`${ID}/range-tool`],
            },
         },
      ],
   });
   OBR.tool.createMode({
      id: `${ID}/range-mode-all`,
      icons: [
         {
            icon: '/art.png',
            label: 'Target All',
            filter: {
               activeTools: [`${ID}/range-tool`],
            },
         },
      ],
   });
}
