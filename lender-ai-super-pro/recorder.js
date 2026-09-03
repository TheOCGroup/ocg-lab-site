(function(){
  let stream=null,recorder=null,chunks=[],blobUrl=null,mediaBlob=null;
  const $=id=>document.getElementById(id);
  const status=message=>{if($('recordingStatus'))$('recordingStatus').textContent=message};
  const cameraState=message=>{if($('cameraState'))$('cameraState').textContent=message};
  function stopTracks(){if(stream){stream.getTracks().forEach(track=>track.stop());stream=null}}
  function resetArtifact(){if(blobUrl)URL.revokeObjectURL(blobUrl);blobUrl=null;mediaBlob=null;window.LenderRecordingArtifact=null;const playback=$('recordingPlayback');if(playback){playback.pause();playback.removeAttribute('src');playback.hidden=true}if($('downloadRecordBtn'))$('downloadRecordBtn').disabled=true;if($('discardRecordBtn'))$('discardRecordBtn').disabled=true}
  async function enableCamera(){
    resetArtifact();
    if(!navigator.mediaDevices?.getUserMedia){cameraState('CAMERA UNAVAILABLE — this browser does not expose getUserMedia.');status('Use a current secure-context browser with camera and microphone support.');return}
    cameraState('REQUESTING CAMERA + MICROPHONE PERMISSION…');
    try{
      stopTracks();stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:720},height:{ideal:1280},aspectRatio:{ideal:9/16}},audio:{echoCancellation:true,noiseSuppression:true}});
      const preview=$('cameraPreview');preview.srcObject=stream;preview.hidden=false;await preview.play();cameraState('LIVE PREVIEW — vertical 9:16 capture requested.');status('Camera and microphone connected. Review framing, then press Record.');$('recordBtn').disabled=false;$('stopRecordBtn').disabled=true;
    }catch(error){
      stopTracks();const denied=error?.name==='NotAllowedError'||error?.name==='PermissionDeniedError';cameraState(denied?'PERMISSION DENIED — camera or microphone access was not granted.':'CAMERA START FAILED — no recording was created.');status(denied?'Allow camera and microphone for this site, then choose Enable Camera + Microphone to retry.':`${error?.message||'Camera or microphone is unavailable.'} Retry after checking the device.`);$('recordBtn').disabled=true;
    }
  }
  function preferredMime(){return ['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(type=>window.MediaRecorder?.isTypeSupported(type))||''}
  function startRecording(){
    if(!stream?.active){status('Enable camera and microphone before recording.');return}if(!window.MediaRecorder){status('MediaRecorder is unavailable in this browser. No recording was created.');return}
    resetArtifact();chunks=[];const mimeType=preferredMime();try{recorder=new MediaRecorder(stream,mimeType?{mimeType}:undefined)}catch(error){status(`Recorder could not start: ${error.message}`);return}
    recorder.ondataavailable=event=>{if(event.data?.size)chunks.push(event.data)};recorder.onerror=event=>status(`Recording failed: ${event.error?.message||'unknown recorder error'}`);
    recorder.onstop=()=>{if(!chunks.length){status('Recording stopped without media data. Retry the recording.');return}const approved=window.LenderApprovedScript;if(!approved?.spoken_script){resetArtifact();status('Approved-script state was lost. No recording artifact was accepted; approve the script and retry.');return}mediaBlob=new Blob(chunks,{type:recorder.mimeType||'video/webm'});blobUrl=URL.createObjectURL(mediaBlob);const playback=$('recordingPlayback');playback.src=blobUrl;playback.hidden=false;$('cameraPreview').hidden=true;window.LenderRecordingArtifact={blob:mediaBlob,mimeType:mediaBlob.type,size:mediaBlob.size,createdAt:new Date().toISOString(),approvedScript:approved.spoken_script,approvedAt:approved.approvedAt,requestedAspectRatio:'9:16'};$('downloadRecordBtn').disabled=false;$('discardRecordBtn').disabled=false;$('recordBtn').disabled=false;$('stopRecordBtn').disabled=true;cameraState('REAL RECORDING CREATED — review playback, discard, retry or download.');status(`Recorded source media exists (${Math.max(1,Math.round(mediaBlob.size/1024))} KB, ${mediaBlob.type}). Approved-script context and the 9:16 requirement remain associated with this artifact. Captions/branding still require processing and QA.`);if($('publishOutput'))$('publishOutput').textContent='RECORDED SOURCE MEDIA EXISTS — processing and independent QA required. This is not a published or completed video.'};
    recorder.start(1000);$('recordBtn').disabled=true;$('stopRecordBtn').disabled=false;cameraState('RECORDING — real camera and microphone media is being captured.');status('Recording in progress. Press Stop to create the reviewable media blob.');
  }
  function stopRecording(){if(recorder?.state==='recording')recorder.stop()}
  function discard(){resetArtifact();$('cameraPreview').hidden=false;cameraState(stream?.active?'LIVE PREVIEW — previous recording discarded.':'RECORDING DISCARDED — enable camera to retry.');status('Recording discarded. No production completion was recorded.')}
  function download(){if(!mediaBlob||!blobUrl){status('No real recording is available to download.');return}const a=document.createElement('a');a.href=blobUrl;a.download=`lender-video-${new Date().toISOString().replace(/[:.]/g,'-')}.webm`;a.click();status('Recorded source media download started. Captions, branding and independent QA remain required.')}
  function init(){
    if(!$('recordBtn')||$('recordBtn').dataset.realRecorder)return Boolean($('recordBtn'));$('recordBtn').dataset.realRecorder='true';
    $('selfModeBtn').addEventListener('click',event=>{event.stopImmediatePropagation();const approved=window.LenderApprovedScript;if(!approved?.spoken_script){status('Exact script approval is required before self-recording.');return}$('teleprompter').textContent=approved.spoken_script;$('enableCameraBtn').disabled=false;$('flipBtn').disabled=false;status('Self-record selected. Enable camera and microphone to begin a real capture.')},true);
    $('avatarModeBtn').addEventListener('click',()=>status('Avatar mode is blocked until purchaser-owned provider authorization, billing and identity consent are complete.'),true);
    $('enableCameraBtn').addEventListener('click',enableCamera);$('recordBtn').addEventListener('click',event=>{event.stopImmediatePropagation();startRecording()},true);$('stopRecordBtn').addEventListener('click',stopRecording);$('discardRecordBtn').addEventListener('click',discard);$('downloadRecordBtn').addEventListener('click',download);
    $('avatarRenderBtn').addEventListener('click',event=>{event.stopImmediatePropagation();$('avatarStatus').textContent='PROVIDER CONNECTION REQUIRED — render is blocked until purchaser authorization, billing, private identity reference and explicit consent are verified.'},true);
    window.addEventListener('beforeunload',stopTracks);return true;
  }
  if(!init()){const observer=new MutationObserver(()=>{if(init())observer.disconnect()});observer.observe(document.documentElement,{childList:true,subtree:true})}
})();
