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
    <button id='startButton'>Enstrümanı Çalıştır</button>
  </div>
  <hr />
  <div id="sliders">
    <p>
    <h2> Ses Çıkarmaya Başla </h2>
      <button id='playButton'>Bastıkça Ses Çıkar</button>
    </p>
    <p>
      <label for="kgate"> Ses Çıkar Aç/Kapa</label> 
      <input type="checkbox" id="kgate"  class="slider-input"  onchange="sendData(this.id, this.checked ? 1 : 0)">
      <span id="kgateval"> 0 </span> </input>
    </p>
    <hr />
    <p>
      <label for="kamp">Ses Seviyesi</label>  
      <input type="range" id="kampmain" class="slider-input" min="0" max="1" value="0.5" step="0.01">
      <span id="kampmainval"> 0 </span> </input> 
    </p>
   
    <p>
      <label for="kRvbSendAmt">Reverb Miktarı</label>  
      <input type="range" id="kRvbSendAmt" class="slider-input" min="0" max="1" value="0" step="0.01">
      <span id="kRvbSendAmtval"> 0 </span> </input> 
    </p>
    <hr />
    <p>
  
    <br> 
      Atak Süresi <input type="range" id="att_durslider" class="slider-input" min="0.005" max="0.5" value="0.1" step="0.01">
      <span id="att_dursliderval"> 0.1 </span> </input>

    <br>
      Düşme Süresi <input type="range" id="dec_durslider" class="slider-input" min="0.005" max="1" value="0.1" step="0.01">
      <span id="dec_dursliderval"> 0.1 </span> </input>
    <br>
      Sürme Süresi<input type="range" id="sus_durslider" class="slider-input" min="0.005" max="9999" value="9999" step="0.01">
      <span id="sus_dursliderval"> 9999 </span> </input>
      <input type="checkbox" id=sustainmax class="slider-input">Sürekli</input>


    <br>
      Susma Süresi <input type="range" id="rel_durslider" class="slider-input" min="0.005" max="1" value="0.1" step="0.01">
      <span id="rel_dursliderval"> 0.1 </span> </input>

    <br> 
    <br>
    <button id="darbelibutton">Darbeli</button>
    <button id="surenbutton">Süren</button>


    

    </p>
    <p>
      val1 <input type="text" id="ienv_val1" class="envelope" value="1" size="2"></input>  
      val2 <input type="text" id="ienv_val2" class="envelope" value="0.8" size="2"></input>
      val3 <input type="text" id="ienv_val3" class="envelope" value="0.8" size="2"></input>
    </p> 
    <hr />
    <p>
      <label for="gendy_kampdist">Genlik dağılım davranışı</label>  
      <input type="range" id="gendy_kampdist" class="slider-input" min="0" max="5" value="0" step="1">
      <span id="gendy_kampdistval"> 0 </span> </input> 
    </p>    
    <label for="gendy_kdurdist">Süre dağılım davranışı</label>  
    <input type="range" id="gendy_kdurdist" class="slider-input" min="0" max="5" value="0" step="1">
      <span id="gendy_kdurdistval"> 0 </span> </input> 
    <p>
    <h3>Kaynak Frekans Aralığı</h3>
    <label for="gendy_kminfreq">Frekans1</label>  
    <input type="range" id="gendy_kminfreq" class="slider-input" min="20" max="4000" value="20" step="1">
      <span id="gendy_kminfreqval"> 20 </span> </input> 
    <p>
    
    </p>
      <label for="linkFreq">Değişimi bağla</label>
      <input type="checkbox" id="linkFreq" class="slider-input">
    </p>
    </p>    
    <label for="gendy_kmaxfreq">Frekans2</label>  
    <input type="range" id="gendy_kmaxfreq" class="slider-input" min="21" max="4000" value="21" step="1">
      <span id="gendy_kmaxfreqval"> 21 </span> </input> 
    </p>    
    <label for="gendy_kampscl">Frekans Salınımının Rastlantısallığı</label>  
    <input type="range" id="gendy_kampscl" class="slider-input" min="0.1" max="1" value="0" step="0.01">
      <span id="gendy_kampsclval"> 0 </span> </input> 
    </p>    
    <label for="gendy_kdurscl">Frekans Salınımının Hızı</label>  
    <input type="range" id="gendy_kdurscl" class="slider-input" min="0.1" max="1" value="0" step="0.01">
      <span id="gendy_kdursclval"> 0 </span> </input> 
    </p>
    <button id='randomizeButton'>Parametreleri Rastgele Belirle</button>    
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

// Slider event listeners
att_durslider.addEventListener('input', (event) => {
    sendData('iatt_dur', event.target.value);
    document.querySelector('#att_dursliderval').innerText = event.target.value;
}
);
dec_durslider.addEventListener('input', (event) => {
    sendData('idec_dur', event.target.value);
    document.querySelector('#dec_dursliderval').innerText = event.target.value;
}
);
sus_durslider.addEventListener('input', (event) => {
    sendData('isus_dur', event.target.value);
    document.querySelector('#sus_dursliderval').innerText = event.target.value;
}
);


rel_durslider.addEventListener('input', (event) => {
  sendData('irel_dur', event.target.value);
  document.querySelector('#rel_dursliderval').innerText = event.target.value;
}
);

sustainmax.addEventListener('change', (event) => {
  switch (event.target.checked) {
    case true:
      sendData("isus_dur", 99999);
      sus_durslider.value = 99999;
      document.querySelector('#sus_dursliderval').innerText = 99999;
      break;
      
    case false:
      sendData("isus_dur", 0.005);
      sus_durslider.value = 0.005;
      document.querySelector('#sus_dursliderval').innerText = 0.005;
      break;
    }

      

   
}
);
darbelibutton.addEventListener('click', (event) => {
    sendData("iatt_dur", 0.005);
    sendData("idec_dur", 0.005);
    sendData("isus_dur", 0.005);
    sendData("irel_dur", 0.005);
    att_durslider.value = 0.005;
    dec_durslider.value = 0.005;
    sus_durslider.value = 0.005;
    rel_durslider.value = 0.005;
    document.querySelector('#att_dursliderval').innerText = 0.005;
    document.querySelector('#dec_dursliderval').innerText = 0.005;
    document.querySelector('#sus_dursliderval').innerText = 0.005;
    document.querySelector('#rel_dursliderval').innerText = 0.005;
}
);
surenbutton.addEventListener('click', (event) => {
    sendData("iatt_dur", 0.005);
    sendData("idec_dur", 0.005);
    sendData("isus_dur", 99999);
    sendData("irel_dur", 0.005);
    att_durslider.value = 0.005;
    dec_durslider.value = 0.005;
    sus_durslider.value = 99999;
    rel_durslider.value = 0.005;
    document.querySelector('#att_dursliderval').innerText = 0.005;
    document.querySelector('#dec_dursliderval').innerText = 0.005;
    document.querySelector('#sus_dursliderval').innerText = 99999;
    document.querySelector('#rel_dursliderval').innerText = 0.005;

}
);


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



