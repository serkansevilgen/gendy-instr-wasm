import { Csound } from '@csound/browser';
import './style.css'
import './custom_style.css'
import csd from './gendy.csd?raw'


window.sendData = async function (channel, value) {
    console.log(channel, value)
  if(csound) await csound.setControlChannel(channel, value);
  // update display
  // document.getElementById(channel+"val").innerHTML = value;
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
<label for="kpanpos">Pan Position</label>  
<input type="range" id="kpanpos" class="slider-input" min="0" max="1" value="0.5" step="0.01">
   <span id="kpanposval"> 0.5 </span> </input> 
</p>
<p>
<label for="kRvbSendAmt">Reverb wet amount</label>  
<input type="range" id="kRvbSendAmt" class="slider-input" min="0" max="1" value="0" step="0.01">
   <span id="kRvbSendAmtval"> 0 </span> </input> 
</p>
<hr />
<!-- <p>
<label for="knotedur">Note Duration</label>  
<input type="range" id="knotedur" class="slider-input" min="0.01" max="10" value="1" step="0.01">
   <span id="knotedurval"> 1 </span> </input> 
</p>
<p>
<label for="krestdur">Rest Duration</label>  
<input type="range" id="krestdur" class="slider-input" min="0" max="10" value="1" step="0.01">
   <span id="krestdurval"> 1 </span> </input> 
</p> 
<hr />-->
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
<input type="range" id="gendy_kampdist" class="slider-input" min="1" max="6" value="1" step="1">
   <span id="gendy_kampdistval"> 1 </span> </input> 
</p>    
<label for="gendy_kdurdist">gendy_kdurdist</label>  
<input type="range" id="gendy_kdurdist" class="slider-input" min="1" max="6" value="1" step="1">
   <span id="gendy_kdurdistval"> 0 </span> </input> 
</p>    
<label for="gendy_kadpar">gendy_kadpar</label>  
<input type="range" id="gendy_kadpar" class="slider-input" min="0.001" max="1" value="0.001" step="0.001">
   <span id="gendy_kadparval"> 0 </span> </input> 
</p>
<label for="gendy_kddpar">gendy_kddpar</label>  
<input type="range" id="gendy_kddpar" class="slider-input" min="0.001" max="1" value="0.001" step="0.001">
   <span id="gendy_kddparval"> 0 </span> </input> 
</p>    
<label for="gendy_kminfreq">gendy_kminfreq</label>  
<input type="range" id="gendy_kminfreq" class="slider-input" min="20" max="4000" value="20" step="1">
   <span id="gendy_kminfreqval"> 20 </span> </input> 
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
`

let csound = null;

const startCsound = async () => {
  if(csound) {
    return;
  }

  console.log("Starting Csound...");

  csound = await Csound();
  console.log(csound);
  await csound.compileCsdText(csd);
  await csound.start();
}

document.querySelector('#startButton').addEventListener('click', startCsound);

document.querySelector('#playButton').addEventListener('mousedown', ()=> {
    sendData("kgate", 1)
    console.log("mousedown")
});
document.querySelector('#playButton').addEventListener('mouseup', ()=> {
    sendData("kgate", 0)
    console.log("mouseup")
});
document.querySelector('#playButton').addEventListener('touchstart', (event)=> {
    event.preventDefault();
    sendData("kgate", 1)
    console.log("touchstart")
});
document.querySelector('#playButton').addEventListener('touchend', (event)=> {
    event.preventDefault();
    sendData("kgate", 0)
    console.log("touchend")
});

const envelopeInputs = document.querySelectorAll('.envelope');
// Loop through each input element and add an 'input' event listener
envelopeInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        console.log(`${event.target.id} ${event.target.value}`);
	sendData(event.target.id, event.target.value)
    });
});

function updateSliderValue(slider) {
    const display = document.getElementById(slider.id + 'val');
    display.textContent = slider.value;
}

document.querySelectorAll('.slider-input').forEach(slider => {
    slider.addEventListener('input', (event) => {
        sendData(event.target.id, event.target.value);
	updateSliderValue(event.target);
    });
});

function randomizeGendyParams() {
  const gendyInputs = document.querySelectorAll('input[id^="gendy_"]');
  
  gendyInputs.forEach(input => {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const randomValue = Math.random() * (max - min) + min;
    
    // Update the input value, span, and call sendData
    input.value = randomValue;
    sendData(input.id, randomValue);
  });
}

document.querySelector('#randomizeButton').addEventListener('click', randomizeGendyParams);
