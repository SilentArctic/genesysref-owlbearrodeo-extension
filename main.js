import OBR from '@owlbear-rodeo/sdk';
import initRangeBands from './range-bands';
import './style.css'

/* GenesysRef Rodeo */
const app = document.querySelector('#app');
app.innerHTML = `
   <iframe src="http://localhost:8080/rodeo" style="height: calc(100vh - 5px); width: 100%; border: none" />
`;

OBR.onReady(() => {
   initRangeBands();
});
