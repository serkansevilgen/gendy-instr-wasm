<CsoundSynthesizer>
<CsOptions>
; Select audio/midi flags here according to platform
-odac     ;;;realtime audio out
;-iadc    ;;;uncomment -iadc if real audio input is needed too
; For Non-realtime ouput leave only the line below:
; -o poscil3.wav -W ;;; for file output any platform
</CsOptions>
<CsInstruments>

sr = 44100
ksmps = 32
nchnls = 2
0dbfs  = 1

gaReverb init 0

instr Reverb
  kRoomSize init 0.5
  kHFDamp init 0.35 
  aL, aR  freeverb gaReverb, gaReverb, kRoomSize, kHFDamp, sr, 0
  outs aL, aR
  clear gaReverb
endin  

schedule "Reverb", 0, -1

instr set_init
  chnset 1, "gendy_kampdist"
  chnset 1, "gendy_kdurdist"
  chnset 0.0001, "gendy_kadpar"
  chnset 0.0001, "gendy_kddpar"
  chnset 20, "gendy_kminfreq"
  chnset 20, "gendy_kmaxfreq"
  chnset 0.1, "gendy_kampscl"
  chnset 0.1, "gendy_kdurscl"

  chnset 0, "kgate"
  chnset 0.5, "kampmain"
  chnset 0.5, "kpanpos"
  chnset 0, "kRvbSendAmt"

  chnset 0.1, "iatt_dur"
  chnset 0.1, "idec_dur"
  chnset 60*60*24, "isus_dur"
  chnset 0.1, "irel_dur"
  chnset 1, "ienv_val1"
  chnset 0.8, "ienv_val2"
  chnset 0.8, "ienv_val3"

endin  
schedule "set_init", 0, 1

instr 1 ;; Xenakis gendy
  kampdist chnget "gendy_kampdist"
  kdurdist chnget "gendy_kdurdist"

  kadpar chnget "gendy_kadpar"
  kddpar chnget "gendy_kddpar"
  kminfreq chnget "gendy_kminfreq"
  kmaxfreq chnget "gendy_kmaxfreq"
  kampscl chnget "gendy_kampscl"
  kdurscl chnget "gendy_kdurscl"

  kampmain chnget "kampmain"
  kgate chnget "kgate"
  kpanpos chnget "kpanpos"
  kRvbSendAmt chnget "kRvbSendAmt"

  asig gendy 0.4, kampdist, kdurdist, kadpar, kddpar, kminfreq, kmaxfreq,kampscl, kdurscl

  iatt_dur = p4
  idec_dur = p5
  isus_dur = p6
  irel_dur = p7
  ienv_val1 = p8
  ienv_val2 = p9
  ienv_val3 = p10
  
  aenv expsegr 0.0001, iatt_dur, ienv_val1, idec_dur, ienv_val2, isus_dur, ienv_val3, irel_dur, 0.0001

  asig = asig * kampmain * aenv

  aL, aR pan2 asig, kpanpos
  outs aL, aR
  gaReverb = gaReverb + (asig * kRvbSendAmt)          
endin

instr 100 ;; gater
  kgate chnget "kgate"
  kchange changed kgate

  kiatt_dur chnget "iatt_dur"
  kidec_dur chnget "idec_dur"
  kisus_dur chnget "isus_dur"
  kirel_dur chnget "irel_dur"
  kienv_val1 chnget "ienv_val1"
  kienv_val2 chnget "ienv_val2"
  kienv_val3 chnget "ienv_val3"
  kdur = kiatt_dur + kidec_dur + kisus_dur

  
  if (kchange == 1 && kgate == 1) then
    event "i", 1, 0, kdur, kiatt_dur,kidec_dur, kisus_dur, kirel_dur, kienv_val1, kienv_val2, kienv_val3
  elseif (kchange == 1 && kgate == 0) then
    turnoff2 1, 4, 1
  endif
endin  

schedule 100, 0, -1
  
;;--- UNUSED ---;;
instr pattern_generator
  knotedur init 1
  krestdur init 1

  knotedur_channel chnget "knotedur"
  if knotedur_channel != 0 then
    knotedur = knotedur_channel
  endif
  krestdur_channel chnget "krestdur"
  if krestdur_channel != 0 then
    krestdur = krestdur_channel
  endif

  loop:
    kloopdur = knotedur + krestdur
    iloopdur = i(kloopdur)
    inotedur = i(knotedur)
    timout    0, iloopdur, play
      reinit    loop
  play:
    event_i "i", 1, 0, inotedur
endin

;; schedule "pattern_generator", 0, -1

;;--- UTILITIES ---;;
instr 99991
  kgate init 1
  kgate chnget "kgate"
  printk 1, kgate
endin  
;; schedule 99991, 0, -1

instr send_message
  chnset p4, "kgate"
endin
;; schedule "send_message", 0, 1, 0


</CsInstruments>
<CsScore>
</CsScore>
</CsoundSynthesizer>