import { Csound } from '@csound/browser';
import './style.css'
import csd from './gendy.csd?raw'

// oninput function
window.sendData = async function (channel, value) {
    console.log(channel, value)
  if(csound) await csound.setControlChannel(channel, value);
  // update display
  document.getElementById(channel+"val").innerHTML = value;
}

document.querySelector('#app').innerHTML = `
  <div>
    <button id='startButton'>Start Sound Engine</button>
  </div>
<hr />
<div id="sliders">
<p>
<label for="kgate">On / Off (mute)</label> 
<input type="checkbox" id="kgate"  onchange="sendData(this.id, this.checked ? 1 : 0.1)">
	      <span id="kgateval"> 0 </span> </input> 
<p>
<hr />
<p>
<label for="kamp">amp</label>  
<input type="range" id="kamp" min="0" max="1" value="0" step="0.01"
  oninput="sendData(id, value)"> <span id="kampval"> 0 </span> </input> 
  </p>
<p>
<label for="kpanpos">Pan Position</label>  
<input type="range" id="kpanpos" min="0" max="1" value="0.5" step="0.01"
  oninput="sendData(id, value)"> <span id="kpanposval"> 0.5 </span> </input> 
</p>
<p>
<label for="kRvbSendAmt">Reverb wet amount</label>  
<input type="range" id="kRvbSendAmt" min="0" max="1" value="0" step="0.01"
  oninput="sendData(id, value)"> <span id="kRvbSendAmtval"> 0 </span> </input> 
</p>
<hr />
<p>
<label for="knotedur">Note Duration</label>  
<input type="range" id="knotedur" min="0.01" max="10" value="1" step="0.01"
  oninput="sendData(id, value)"> <span id="knotedurval"> 1 </span> </input> 
</p>
<p>
<label for="krestdur">Rest Duration</label>  
<input type="range" id="krestdur" min="0" max="10" value="1" step="0.01"
  oninput="sendData(id, value)"> <span id="krestdurval"> 1 </span> </input> 
</p> 
<hr />-->
<p>
<label for="gendy_kampdist">gendy_kampdist</label>  
<input type="range" id="gendy_kampdist" min="1" max="6" value="1" step="1"
  oninput="sendData(id, value)"> <span id="gendy_kampdistval"> 1 </span> </input> 
</p>    
<label for="gendy_kdurdist">gendy_kdurdist</label>  
<input type="range" id="gendy_kdurdist" min="1" max="6" value="1" step="1"
  oninput="sendData(id, value)"> <span id="gendy_kdurdistval"> 0 </span> </input> 
</p>    
<label for="gendy_kadpar">gendy_kadpar</label>  
<input type="range" id="gendy_kadpar" min="0.001" max="1" value="0.001" step="0.001"
  oninput="sendData(id, value)"> <span id="gendy_kadparval"> 0 </span> </input> 
</p>
<label for="gendy_kddpar">gendy_kddpar</label>  
<input type="range" id="gendy_kddpar" min="0.001" max="1" value="0.001" step="0.001"
  oninput="sendData(id, value)"> <span id="gendy_kddparval"> 0 </span> </input> 
</p>    
<label for="gendy_kminfreq">gendy_kminfreq</label>  
<input type="range" id="gendy_kminfreq" min="20" max="20000" value="20" step="1"
  oninput="sendData(id, value)"> <span id="gendy_kminfreqval"> 20 </span> </input> 
</p>    
<label for="gendy_kmaxfreq">gendy_kmaxfreq</label>  
<input type="range" id="gendy_kmaxfreq" min="21" max="20000" value="21" step="p11"
  oninput="sendData(id, value)"> <span id="gendy_kmaxfreqval"> 21 </span> </input> 
</p>    
<label for="gendy_kampscl">gendy_kampscl</label>  
<input type="range" id="gendy_kampscl" min="0.1" max="1" value="0.1" step="0.01"
  oninput="sendData(id, value)"> <span id="gendy_kampsclval"> 0 </span> </input> 
</p>    
<label for="gendy_kdurscl">gendy_kdurscl</label>  
<input type="range" id="gendy_kdurscl" min="0.1" max="1" value="0.1" step="0.01"
  oninput="sendData(id, value)"> <span id="gendy_kdursclval"> 0.1 </span> </input> 
</p>    
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

