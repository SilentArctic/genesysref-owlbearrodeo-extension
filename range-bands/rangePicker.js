import OBR from '@owlbear-rodeo/sdk';
import ID from '../constants/id.constants';
import createRangeBands from './createRangeBands';
import rangeDefaults from './range-band-defaults.json';

const styles = {
   checkbox: `width: 100%; display: flex; justify-content: space-between; margin-bottom: 8px`,
   label: `
      display: flex;
      justify-content: space-between;
      text-align: center;
      color: white;
      text-transform: capitalize;
      font-size: 12px;
   `,
   range: 'width: 100%; margin-bottom: 8px',
   reset: 'width: 100%',
};

const options = {
   scale: { min: 0, max: 2, step: 0.1 },
   opacity: { min: 0, max: 1, step: 0.1 },
   engaged: { min: 0, max: 10, step: 1 },
   short: { min: 0, max: 40, step: 2 },
   medium: { min: 0, max: 80, step: 5 },
   long: { min: 0, max: 160, step: 10 },
   extreme: { min: 0, max: 320, step: 20 },
};

const updateRange = ({ target: { id, value } }, newMetadata) => {
   newMetadata = {
      ...newMetadata,
      [id]: Number(value),
   };
   OBR.tool.setMetadata(`${ID}/range-tool`, newMetadata);
};

const updateCheckbox = ({ target: { id, checked } }, newMetadata) => {
   newMetadata = {
      ...newMetadata,
      [id]: Boolean(checked),
   };
   OBR.tool.setMetadata(`${ID}/range-tool`, newMetadata);
};

const updateEnabledCheckbox = ({ target: { id, checked } }, newMetadata) => {
   newMetadata = {
      ...newMetadata,
      enabled: {
         ...newMetadata.enabled,
         [id.split('-')[1]]: Boolean(checked),
      },
   };
   OBR.tool.setMetadata(`${ID}/range-tool`, newMetadata);
};

function createSlider(id, metadata, canToggle) {
   return `
      <label for="enabled-${id}" style="${styles.label}">
         <span style="display: flex; align-items: center">
            ${canToggle
               ?  metadata.enabled[id]
                  ? `<input id="enabled-${id}" type="checkbox" style="margin: 0; margin-right: 3px" checked />`
                  : `<input id="enabled-${id}" type="checkbox" style="margin: 0; margin-right: 3px" />`
            : ''}
            ${id}
         </span>
         <span>[${metadata[id]}]</span>
      </label>
      <input
         id="${id}"
         type="range"
         style="${styles.range}"
         min="${options[id].min}"
         max="${options[id].max}"
         step="${options[id].step}"
         value="${metadata[id]}"
      />
   `;
}

function createSliders(metadata) {
   document.querySelector('#app').innerHTML = `
      <div>
         <div style="${styles.checkbox}">
            <label for="greyscale" style="${styles.label}">Greyscale</label>
            ${metadata.greyscale
               ? '<input id="greyscale" type="checkbox" checked />'
               : '<input id="greyscale" type="checkbox" />'
            }
         </div>
         ${createSlider('scale', metadata)}
         ${createSlider('opacity', metadata)}
         <hr style="margin-top: 0px" />
         ${createSlider('engaged', metadata, 'canToggle')}
         ${createSlider('short', metadata, 'canToggle')}
         ${createSlider('medium', metadata, 'canToggle')}
         ${createSlider('long', metadata, 'canToggle')}
         ${createSlider('extreme', metadata, 'canToggle')}
         <button id="reset" type="button" style="${styles.reset}">Reset</button>
      </div>
   `;
}

function setupTool(element, metadata) {
   if (!element) return;

   /* new variable  */
   let newMetadata = { ...metadata };

   const refreshBands = async () => {
      const newMetadata = await OBR.tool.getMetadata(`${ID}/range-tool`);
      createSliders(newMetadata);
      setupTool(document.querySelector('#reset'), newMetadata);
      for (const range of Object.keys(newMetadata)) {
         setupTool(document.querySelector(`#${range}`), newMetadata);
         setupTool(document.querySelector(`#enabled-${range}`), newMetadata);
      }

      const charactersWithBands = await OBR.scene.items.getItems(item => item.layer === 'CHARACTER' && item.metadata[`${ID}/show-range`]);
      createRangeBands(charactersWithBands);
   };

   if (element.type === 'button') {
      element.addEventListener('click', async () => {
         OBR.tool.setMetadata(`${ID}/range-tool`, rangeDefaults);
         await refreshBands();
      });
   } else {
      element.addEventListener('change', async e => {
         if (e.target.id.includes('enabled')) {
            updateEnabledCheckbox(e, newMetadata);
         } else if (e.target.type === 'checkbox') {
            updateCheckbox(e, newMetadata);
         } else {
            updateRange(e, newMetadata);
         }
         await refreshBands();
      });
   }
}

OBR.onReady(async () => {
   /* get current values */
   const metadata = await OBR.tool.getMetadata(`${ID}/range-tool`);

   createSliders(metadata);
   setupTool(document.querySelector('#reset'), metadata);

   const { enabled, ...metadataOptions } = metadata;
   for (const range of Object.keys(metadataOptions)) {
      setupTool(document.querySelector(`#${range}`), metadata);
      setupTool(document.querySelector(`#enabled-${range}`), metadata);
   }
});
