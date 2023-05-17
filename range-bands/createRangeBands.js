import OBR, { buildShape } from '@owlbear-rodeo/sdk';
import ID from '../constants/id.constants';

const colors = greyscale => ({
   engaged: greyscale ? 'grey' : 'red',
   short: greyscale ? 'black' : 'orange',
   medium: greyscale ? 'grey' : 'green',
   long: greyscale ? 'black' : 'blue',
   extreme: greyscale ? 'grey' : 'white',
});

const createBand = (range, metadata, character) => {
   const band = buildShape()
      .width(metadata[range] * 50 * metadata.scale)
      .height(metadata[range] * 50 * metadata.scale)
      .shapeType('CIRCLE')
      .style({
         fillColor: colors(metadata.greyscale)[range],
         fillOpacity: metadata.opacity,
         strokeColor: 'black',
         strokeOpacity: 1,
         strokeWidth: 15,
         strokeDash: [1],
      })
      .build();
   band.metadata[`${ID}/range-band-name`] = range;
   band.locked = true;
   band.position = character.position;
   band.metadata[`${ID}/range-band-anchor`] = character.id;
   return band;
};

function checkExistingBandsHaveAllEnabledRanges(bandTypes, metadata) {
   const ranges = Object.keys(metadata.enabled);
   const enabledRanges = ranges.filter(range => metadata.enabled[range]);
   const shouldAdd = [];
   const shouldRemove = [];

   bandTypes.forEach(band => {
      if (enabledRanges.includes(band)) return;
      else shouldRemove.push(band);
   });
   enabledRanges.forEach(range => {
      if (bandTypes.includes(range)) return;
      else shouldAdd.push(range);
   });

   return { shouldAdd, shouldRemove };
}

export default function createRangeBands(characters) {
   characters.forEach(async character => {
      const existingRangeBands = await OBR.scene.items.getItems(item => item.metadata[`${ID}/range-band-anchor`] === character.id);

      if (existingRangeBands.length) {
         const metadata = await OBR.tool.getMetadata(`${ID}/range-tool`);
         const bandTypes = existingRangeBands.map(band => band.metadata[`${ID}/range-band-name`]);
         const {shouldAdd, shouldRemove} = checkExistingBandsHaveAllEnabledRanges(bandTypes, metadata);


         await OBR.scene.items.updateItems(existingRangeBands, bands => {
            for (const band of bands) {
               const bandRange = band.metadata[`${ID}/range-band-name`];
               band.position = character.position;
               band.style = {
                  ...band.style,
                  fillColor: colors(metadata.greyscale)[bandRange],
                  fillOpacity: metadata.opacity,
               };
               band.height = metadata[bandRange] * 50 * metadata.scale;
               band.width = metadata[bandRange] * 50 * metadata.scale;
            }
         });

         if (shouldAdd.length) {
            const newBands = [];
            shouldAdd.forEach(range => {
               newBands.push(createBand(range, metadata, character));
            });
            OBR.scene.items.addItems(newBands);
         }

         if (shouldRemove.length) {
            const bandsToRemove = await OBR.scene.items.getItems(item => item.metadata[`${ID}/range-band-anchor`] === character.id && shouldRemove.includes(item.metadata[`${ID}/range-band-name`]));
            OBR.scene.items.deleteItems(bandsToRemove.map(band => band.id));
         }
      } else {
         const metadata = await OBR.tool.getMetadata(`${ID}/range-tool`);

         const bands = [
            ...(metadata.enabled.extreme ? [createBand('extreme', metadata, character)] : []),
            ...(metadata.enabled.long ? [createBand('long', metadata, character)] : []),
            ...(metadata.enabled.medium ? [createBand('medium', metadata, character)] : []),
            ...(metadata.enabled.short ? [createBand('short', metadata, character)] : []),
            ...(metadata.enabled.engaged ? [createBand('engaged', metadata, character)] : []),
         ];
         OBR.scene.items.addItems(bands);
      }
   });
}
