const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const c=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/content.json'),'utf8'));
async function finishOnboarding(page){await page.getByRole('button',{name:/Criar cadastro/}).click();await page.getByRole('button',{name:/Continuar/}).click();await page.getByRole('button',{name:/Revisar tela de bloqueio/}).click();}
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const id='wake-prosperidade-01';await page.goto('http://127.0.0.1:8765/preview/#reflection/'+id);
 await page.getByRole('heading',{name:'Cadastro de demonstração'}).waitFor();assert.equal(await page.locator('.reflection-text').count(),0);
 await finishOnboarding(page);await page.locator('.reflection-text').waitFor();assert.equal(await page.locator('.reflection-text').getAttribute('data-message-id'),id);assert.equal(await page.locator('#reflection-pause').isDisabled(),true);assert.equal(await page.locator('#reflection-stop').isDisabled(),true);
 // Actual browser speech service: accept only a real start event or an honest unavailable fallback.
 const voices=await page.evaluate(()=>speechSynthesis.getVoices().filter(v=>v.localService&&v.lang.toLowerCase().startsWith('pt')).map(v=>({name:v.name,lang:v.lang})));
 await page.locator('#reflection-listen').click();await page.waitForFunction(()=>{const s=document.querySelector('#narration-status').textContent;return /indisponível|não iniciou|não conseguiu|Leitura automática ·/.test(s);},{},{timeout:10000});
 const observed=await page.locator('#narration-status').textContent();
 if(!voices.length)assert.match(observed,/indisponível|não iniciou/);
 if(await page.locator('#reflection-stop').isEnabled())await page.locator('#reflection-stop').click();
 await page.getByRole('button',{name:'← Voltar à afirmação'}).click();await page.locator('[data-reflection]').waitFor();
 const selected=await page.locator('[data-reflection]').getAttribute('data-reflection');await page.getByRole('button',{name:'Aprofundar',exact:true}).click();assert.equal(await page.locator('.reflection-text').getAttribute('data-message-id'),selected);
 // Every visible reflection resolves to its own catalog content, not a generic essay.
 for(const m of c.messages){await page.evaluate(id=>{location.hash='reflection/'+id;},m.id);await page.waitForFunction(id=>document.querySelector('.reflection-text')?.dataset.messageId===id,m.id);const text=await page.locator('.reflection-text').textContent();for(const paragraph of m.translations['pt-BR'].reflection.paragraphs)assert.ok(text.includes(paragraph));}
 await page.screenshot({path:path.join(__dirname,'../preview-aprofundar.png'),fullPage:true});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 await page.evaluate(()=>{location.hash='reflection/nao-existe';});await page.getByRole('alert').waitFor();assert.equal(await page.locator('.reflection-text').count(),0);
 // No speech engine is a deterministic browser fallback; no fake voice output.
 const noVoice=await browser.newPage();await noVoice.addInitScript(()=>Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined}));await noVoice.goto('http://127.0.0.1:8765/preview/#reflection/'+id);await finishOnboarding(noVoice);await noVoice.locator('#reflection-listen').click();await noVoice.getByRole('status').filter({hasText:/indisponível/}).waitFor();assert.equal(await noVoice.locator('#reflection-pause').isDisabled(),true);await noVoice.close();
 // Spy only on cancellation; it does not simulate successful speech or audible output.
 await page.evaluate(id=>{location.hash='reflection/'+id;},id);await page.locator('#reflection-listen').waitFor();await page.evaluate(()=>{window.__cancels=0;const original=speechSynthesis.cancel.bind(speechSynthesis);speechSynthesis.cancel=()=>{window.__cancels++;original();};});
 await page.locator('[data-tab=audio]').click();assert.ok(await page.evaluate(()=>window.__cancels)>0);await page.locator('#audio-track').waitFor();
 assert.deepEqual(errors,[]);console.log('PASS reflexões Edge: cadastro/retomada de link, 24 textos específicos, Aprofundar/voltar, sem autoplay, voz real observada:',JSON.stringify({voices,observed}),'; fallback sem engine, cancelamento ao sair, links desconhecidos, 4 larguras. Nenhuma audição humana validada.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
