// Original instrumental composition. The theme is an artistic choice.
export class ReflectionAmbience {
 constructor(){this.enabled=true;this.audio=null;this.fade=null;this.token=0;this.status='idle';}
 prepare(){
  this.stop();if(!this.enabled)return;
  const audio=new Audio(new URL('../assets/audio/reflection-piano-original.wav',import.meta.url).href);
  audio.loop=true;audio.volume=0;audio.preload='auto';this.audio=audio;
  const token=this.token;
  // Prime playback only inside the user's Listen gesture, initially silent.
  audio.play().then(()=>{if(token!==this.token||this.audio!==audio){audio.pause();return;}if(this.status!=='speaking')audio.pause();}).catch(()=>{});
 }
 sync(status){
  this.status=status;
  if(['ended','idle','unavailable'].includes(status)){this.stop();return;}
  if(!this.audio)return;
  if(status==='speaking'&&this.enabled){this.audio.play().catch(()=>{});this.fadeTo(.16);}
  else this.fadeTo(0,true);
 }
 fadeTo(target,pause=false){
  clearInterval(this.fade);const audio=this.audio;if(!audio)return;
  const initial=audio.volume,start=performance.now();
  this.fade=setInterval(()=>{if(this.audio!==audio){clearInterval(this.fade);return;}const progress=Math.min(1,(performance.now()-start)/450);audio.volume=initial+(target-initial)*progress;if(progress===1){clearInterval(this.fade);this.fade=null;if(pause)audio.pause();}},30);
 }
 stop(){
  this.token++;clearInterval(this.fade);this.fade=null;
  if(this.audio){this.audio.pause();this.audio.removeAttribute('src');this.audio.load();}
  this.audio=null;
 }
}
