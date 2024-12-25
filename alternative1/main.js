import { Csound } from 'https://cdn.jsdelivr.net/npm/@csound/browser@6.18.7/+esm';
import '../style.css'
import '../custom_style.css'
import csd from '../gendy.csd?raw'

window.sendData = async function (channel, value) {
    console.log(channel, value);
    if (csound) await csound.setControlChannel(channel, value);
}

document.querySelector('#app').innerHTML = `
  <div>
    <button id='startButton'>Start Sound Engine</button>
  </div>
  <hr />
  <div id="sliders">
    <p>
      <button id='playButton'>PLAY</button>
    </p>
    <p>
      <label for="kgate"> PLAY On / Off</label> 
      <input type="checkbox" id="kgate"  class="slider-input"  onchange="sendData(this.id, this.checked ? 1 : 0)">
      <span id="kgateval"> 0 </span> </input>
    </p>
    <hr />
    <p>
      <label for="kamp">Volume</label>  
      <input type="range" id="kampmain" class="slider-input" min="0" max="1" value="0.5" step="0.01">
      <span id="kampmainval"> 0 </span> </input> 
    </p>
   
    <p>
      <label for="kRvbSendAmt">Reverb wet amount</label>  
      <input type="range" id="kRvbSendAmt" class="slider-input" min="0" max="1" value="0" step="0.01">
      <span id="kRvbSendAmtval"> 0 </span> </input> 
    </p>
    <hr />
    <p>
      att_dur <input type="text" id="iatt_dur" class="envelope" value="0.1" size="2"></input>  
      dec_dur <input type="text" id="idec_dur" class="envelope" value="0.1" size="2"></input>
      sus_dur <input type="text" id="isus_dur" class="envelope" value="99999" size="2"></input>
      rel_dur<input type="text" id="irel_dur" class="envelope" value="0.1" size="2"></input>
    </p>
    <p>
      val1 <input type="text" id="ienv_val1" class="envelope" value="1" size="2"></input>  
      val2 <input type="text" id="ienv_val2" class="envelope" value="0.8" size="2"></input>
      val3 <input type="text" id="ienv_val3" class="envelope" value="0.8" size="2"></input>
    </p> 
    <hr />
    <p>
      <label for="gendy_kampdist">gendy_kampdist</label>  
      <input type="range" id="gendy_kampdist" class="slider-input" min="1" max="5" value="1" step="1">
      <span id="gendy_kampdistval"> 1 </span> </input> 
    </p>    
    <label for="gendy_kdurdist">gendy_kdurdist</label>  
    <input type="range" id="gendy_kdurdist" class="slider-input" min="1" max="5" value="1" step="1">
      <span id="gendy_kdurdistval"> 0 </span> </input> 
    <p>
    <label for="gendy_kminfreq">gendy_kminfreq</label>  
    <input type="range" id="gendy_kminfreq" class="slider-input" min="20" max="4000" value="20" step="1">
      <span id="gendy_kminfreqval"> 20 </span> </input> 
    <p>
    
    </p>
      <label for="linkFreq">Link kminfreq and kmaxfreq</label>
      <input type="checkbox" id="linkFreq" class="slider-input">
    </p>
    </p>    
    <label for="gendy_kmaxfreq">gendy_kmaxfreq</label>  
    <input type="range" id="gendy_kmaxfreq" class="slider-input" min="21" max="4000" value="21" step="1">
      <span id="gendy_kmaxfreqval"> 21 </span> </input> 
    </p>    
    <label for="gendy_kampscl">gendy_kampscl</label>  
    <input type="range" id="gendy_kampscl" class="slider-input" min="0.1" max="1" value="0.1" step="0.01">
      <span id="gendy_kampsclval"> 0 </span> </input> 
    </p>    
    <label for="gendy_kdurscl">gendy_kdurscl</label>  
    <input type="range" id="gendy_kdurscl" class="slider-input" min="0.1" max="1" value="0.1" step="0.01">
      <span id="gendy_kdursclval"> 0.1 </span> </input> 
    </p>
    <button id='randomizeButton'>Randomize Gendy Parameters</button>    
  </div>
`;

let csound = null;

const startCsound = async () => {
  if (csound) {
    return;
  }

  console.log("Starting Csound...");

  csound = await Csound();
  console.log(csound);
  await csound.compileCsdText(csd);
  await csound.start();
}

document.querySelector('#startButton').addEventListener('click', startCsound);

document.querySelector('#playButton').addEventListener('mousedown', () => {
    sendData("kgate", 1);
    console.log("mousedown");
});
document.querySelector('#playButton').addEventListener('mouseup', () => {
    sendData("kgate", 0);
    console.log("mouseup");
});
document.querySelector('#playButton').addEventListener('touchstart', (event) => {
    event.preventDefault();
    sendData("kgate", 1);
    console.log("touchstart");
});
document.querySelector('#playButton').addEventListener('touchend', (event) => {
    event.preventDefault();
    sendData("kgate", 0);
    console.log("touchend");
});

const envelopeInputs = document.querySelectorAll('.envelope');
// Loop through each input element and add an 'input' event listener
envelopeInputs.forEach((input) => {
    input.addEventListener('input', (event) => {
        const excludedSliders = ['gendy_kminfreq', 'gendy_kmaxfreq' , 'gendy_kddpar', 'gendy_kadpar', 'kpanpos'];
        if (excludedSliders.includes(event.target.id)) return;

        sendData(event.target.id, event.target.value);
    });
});

const linkFreqCheckbox = document.querySelector('#linkFreq');
const kminfreq = document.querySelector('#gendy_kminfreq');
const kmaxfreq = document.querySelector('#gendy_kmaxfreq');
let offset = kmaxfreq.value - kminfreq.value;


linkFreqCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
        offset = kmaxfreq.value - kminfreq.value;
    }
});

kminfreq.addEventListener('input', (event) => {
    const value = parseFloat(event.target.value);

    if (linkFreqCheckbox.checked) {
        const newMax = value + offset;
        kmaxfreq.value = Math.min(newMax, kmaxfreq.max);
        document.querySelector('#gendy_kmaxfreqval').innerText = kmaxfreq.value;
        sendData('gendy_kmaxfreq', kmaxfreq.value);
    }

    document.querySelector('#gendy_kminfreqval').innerText = value;
    sendData('gendy_kminfreq', value);
});

kmaxfreq.addEventListener('input', (event) => {
    const value = parseFloat(event.target.value);

    if (linkFreqCheckbox.checked) {
        const newMin = value - offset;
        kminfreq.value = Math.max(newMin, kminfreq.min);
        document.querySelector('#gendy_kminfreqval').innerText = kminfreq.value;
        sendData('gendy_kminfreq', kminfreq.value);
    }

    document.querySelector('#gendy_kmaxfreqval').innerText = value;
    sendData('gendy_kmaxfreq', value);
});

// Randomize Gendy Parameters
document.querySelector('#randomizeButton').addEventListener('click', () => {
  const randomizeParameter = (id, min, max, step = 1) => {
      const value = (Math.random() * (max - min) + min).toFixed(step === 1 ? 0 : Math.log10(1 / step));
      document.querySelector(`#${id}`).value = value;
      document.querySelector(`#${id}val`).innerText = value;
      sendData(id, parseFloat(value));
  };

  // Randomize individual Gendy parameters
  randomizeParameter('gendy_kampdist', 1, 5, 1); // Integer values
  randomizeParameter('gendy_kdurdist', 1, 5, 1); // Integer values
  randomizeParameter('gendy_kminfreq', 20, 4000, 1); // Frequency range
  randomizeParameter('gendy_kmaxfreq', 21, 4000, 1); // Frequency range
  randomizeParameter('gendy_kampscl', 0.1, 1, 0.01); // Scale range
  randomizeParameter('gendy_kdurscl', 0.1, 1, 0.01); // Scale range
});


// Slider event listeners
document.querySelectorAll('.slider-input').forEach((slider) => {
    slider.addEventListener('input', (event) => {
        if (event.target.id !== 'gendy_kminfreq' && event.target.id !== 'gendy_kmaxfreq') {
            sendData(event.target.id, event.target.value);
            const sliderValue = event.target.value;
            const span = document.querySelector(`#${event.target.id}val`);
            if (span) {
                span.innerText = sliderValue;
            }
        }
    });
}); 


