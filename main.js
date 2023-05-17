import OBR from '@owlbear-rodeo/sdk';
import initRangeBands from './range-bands';
import './style.css'

/* GenesysRef Rodeo */
const app = document.querySelector('#app');

const source = 'https://genesysref.netlify.app/rodeo';

app.innerHTML = `
   <iframe src="${source}" style="height: calc(100vh - 5px); width: 100%; border: none" />
`;

OBR.onReady(() => {
   initRangeBands();
});
