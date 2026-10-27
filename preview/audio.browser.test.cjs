const {chromium}=require('playwright');const assert=require('node:assert/strict');const path=require('node:path');
async function enter(page){
 await page.goto('http://127.0.0.1:8765/preview/');await page.getByRole('button',{name:/Criar cadastro/}).click();await page.getByRole('button',{name:/Continuar/}).click();await page.getByRole('button',{name:/Revisar tela de bloqueio/}).click();
}
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Read-only instrumentation of media elements created by the actual player.
 await page.addInitScript(()=>{const Native=window.Audio;window.__audio=[];window.Audio=class extends Native{constructor(...args){super(...args);window.__audio.push(this);}};});
 const requested=[];page.on('request',r=>{if(r.url().endsWith('.wav'))requested.push(r.url());});
 await enter(page);assert.equal(requested.length,0);
 await page.locator('[data-tab=audio]').click();await page.locator('#audio-track').waitFor();assert.equal(requested.length,0);
 assert.match(await page.locator('main').textContent(),/ACESSO FREE \/ PREMIUM A DEFINIR/);
 assert.equal(await page.locator('#audio-volume').inputValue(),'15');
 assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);
 await page.locator('#audio-play').click();await page.waitForFunction(()=>window.__audio[0].currentTime>0.2&&!window.__audio[0].paused);
 assert.equal(await page.evaluate(()=>window.__audio[0].loop),true);assert.equal(await page.evaluate(()=>window.__audio[0].volume),0.15);
 const duration=await page.evaluate(()=>window.__audio[0].duration);assert.equal(duration,12);
 await page.locator('#audio-volume').fill('7');assert.equal(await page.evaluate(()=>window.__audio[0].volume),0.07);
 await page.locator('#audio-play').click();assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);
 await page.locator('#audio-play').click();await page.waitForFunction(()=>!window.__audio[0].paused);
 await page.locator('[data-audio-theme=wealth]').click();assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);assert.equal(await page.locator('#audio-track').inputValue(),'tone-888');
 await page.locator('#audio-play').click();await page.waitForFunction(()=>!window.__audio[0].paused&&window.__audio[0].currentTime>0);
 await page.locator('[data-tab=home]').click();assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);
 await page.locator('[data-moment=wake]').click();assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);
 await page.locator('[data-tab=audio]').click();await page.locator('[data-audio-theme=gratitude]').click();assert.equal(await page.locator('#audio-track').inputValue(),'tone-432');
 await page.screenshot({path:path.join(__dirname,'../preview-audios.png'),fullPage:true});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 await page.setViewportSize({width:390,height:844});
 // Test real media failure and retry without substituting a success state.
 await page.route('**/tone-174.wav',route=>route.fulfill({status:404,body:'missing'}));await page.locator('#audio-track').selectOption('tone-174');await page.locator('#audio-play').click();await page.waitForFunction(()=>document.querySelector('#audio-status').textContent.includes('Não foi possível'));
 assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);await page.unroute('**/tone-174.wav');await page.locator('#audio-track').selectOption('tone-432');await page.locator('#audio-track').selectOption('tone-174');await page.locator('#audio-play').click();await page.waitForFunction(()=>!window.__audio[0].paused&&window.__audio[0].currentTime>0);
 // Simulate the page's visibility event; this does not validate iOS background behavior.
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
 assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);
 assert.match(await page.locator('#audio-status').textContent(),/ocultar/);
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'));});
 await page.locator('#audio-stop').click();assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);
 // Timed stop, using a virtual JS clock while decoding real WAV media.
 await page.clock.install();await page.locator('#audio-timer').selectOption('1');await page.locator('#audio-play').click();await page.waitForFunction(()=>document.querySelector('#audio-status').textContent.includes('Reproduzindo'));
 await page.clock.fastForward(61000);await page.waitForFunction(()=>document.querySelector('#audio-status').textContent.includes('Temporizador concluído'));assert.equal(await page.evaluate(()=>window.__audio[0].paused),true);
 // All catalog WAV files can be decoded by the browser; validate duration and channels.
 const decoded=await page.evaluate(async()=>{const c=await(await fetch('../assets/audio_catalog.json')).json(),ctx=new AudioContext(),out=[];for(const t of c.tracks){const data=await(await fetch('../assets/'+t.asset)).arrayBuffer();const b=await ctx.decodeAudioData(data);out.push({id:t.id,duration:b.duration,channels:b.numberOfChannels});}await ctx.close();return out;});
 assert.equal(decoded.length,11);for(const t of decoded){assert.ok(Math.abs(t.duration-12)<0.001);assert.equal(t.channels,1);}assert.deepEqual(errors,[]);
 console.log('PASS áudio Edge: sem autoplay, play/pause real, 12s em loop, volume, temas 528/888/432, pausa ao navegar, widget silencioso, erro/retry, temporizador, 4 larguras e 11 arquivos decodificados.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
