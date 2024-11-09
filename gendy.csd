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

instr 1 ;; Xenakis gendy
  ;; kamp init 0.0 ;; 0.1 - 1.0
  ;; kampdist init 1 ;; 1 - 6
  ;; kdurdist init 0.001 ;; 0.0001 - 1
  ;; kadpar init 0.0001 ;;  0.0001 - 1
  ;; kddpar init 0.0001 ;;  0.0001 - 1
  ;; kminfreq init 20 ;; 20 - 20000 
  ;; kmaxfreq init 20 ;; 20 - 20000 
  ;; kampscl init 0.1 ;; 0.1 - 1
  ;; kdurscl init 0.1 ;; 0.1 - 1
  ;; kgate init 0 ;; 0 / 1
  ;; kpanpos init 0.0 ;; 0.0 - 1.0
  ;; kRvbSendAmt init 0.0 ;; 0.0 - 1.0


  kampdist random 1, 6
  kamp init 0.3
  kdurdist random 1, 6
  kadpar random 0.0001, 1
  kddpar random 0.0001, 1
  kminfreq random 20, 2000
  kfreqdiff random 10, 100     
  kmaxfreq = kminfreq + kfreqdiff
  kampscl random 0.1, 1
  kdurscl random 0.1, 1      
  kgate init 1
  kpanpos init 0.5
  kRvbSendAmt init 0.2

  kamp_channel chnget "kamp"
  if kamp_channel != 0 then
    kamp = kamp_channel
  endif
  kampdist_channel chnget "gendy_kampdist"
  if kampdist_channel != 0 then
    kampdist = kampdist_channel
  endif
  kdurdist_channel chnget "gendy_kdurdist"
  if kdurdist_channel != 0 then
    kdurdist = kdurdist_channel
  endif
  kadpar_channel chnget "gendy_kadpar"
  if kadpar_channel != 0 then
    kadpar = kadpar_channel
  endif
  kddpar_channel chnget "gendy_kddpar"
  if kddpar_channel != 0 then
    kddpar = kddpar_channel
  endif
  kminfreq_channel chnget "gendy_kminfreq"
  if kminfreq_channel != 0 then
    kminfreq = kminfreq_channel
  endif
  kmaxfreq_channel chnget "gendy_kmaxfreq"
  if kmaxfreq_channel != 0 then
    kmaxfreq = kmaxfreq_channel
  endif
  kampscl_channel chnget "gendy_kampscl"
  if kampscl_channel != 0 then
    kampscl = kampscl_channel
  endif
  kdurscl_channel chnget "gendy_kdurscl"
  if kdurscl_channel != 0 then
    kdurscl = kdurscl_channel
  endif
  kgate_channel chnget "kgate"
  if kgate_channel != 0 then
    kgate = kgate_channel
  endif
  kpanpos_channel chnget "kpanpos"
  if kpanpos_channel != 0 then
    kpanpos = kpanpos_channel
  endif
  kRvbSendAmt_channel chnget "kRvbSendAmt"
  if kRvbSendAmt_channel != 0 then
    kRvbSendAmt = kRvbSendAmt_channel
  endif
  
  asig gendy kamp, kampdist, kdurdist, kadpar, kddpar, kminfreq, kmaxfreq,kampscl, kdurscl
  kenv_prevent_click linsegr 0, 0.01, 1, p3-0.02, 1, 0.01, 0
  asig = asig * kgate * kenv_prevent_click
  aL, aR pan2 asig, kpanpos
  outs aL, aR
  gaReverb = gaReverb + (asig * kRvbSendAmt)          
endin

instr 10
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

schedule 10, 0, -1


</CsInstruments>
<CsScore>

</CsScore>
</CsoundSynthesizer>