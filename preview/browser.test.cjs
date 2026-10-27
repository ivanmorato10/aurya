const {chromium}=require('playwright');const assert=require('node:assert/strict');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/preview/');await page.getByRole('heading',{name:'Cadastro de demonstração'}).waitFor();
 assert.equal(await page.locator('nav').isVisible(),false);
 await page.locator('#email').fill('invalido');await page.getByRole('button',{name:/Criar cadastro/}).click();assert.equal(await page.locator('#email').evaluate(e=>e.validity.valid),false);
 await page.locator('#name').fill('Ana');await page.locator('#email').fill('teste@example.com');await page.getByRole('button',{name:/Criar cadastro/}).click();
 assert.equal(await page.locator('#locale option').count(),8);await page.locator('#locale').selectOption('ja');assert.match(await page.locator('#fallback').textContent(),/Tradução em preparação/);
 await page.getByRole('button',{name:/Continuar/}).click();assert.match(await page.locator('main').textContent(),/exemplos editáveis/);
 assert.equal(await page.locator('input[type=time]').count(),4);
 await page.locator('#commute').fill('07:00');await page.getByRole('button',{name:/Revisar tela de bloqueio/}).click();assert.match(await page.locator('#scheduleError').textContent(),/quatro horários válidos e diferentes/);
 for(const[id,value]of Object.entries({wake:'06:45',commute:'08:15',midday:'13:00',sleep:'23:00'}))await page.locator('#'+id).fill(value);
 await page.screenshot({path:path.join(__dirname,'../preview-quatro-horarios.png'),fullPage:true});
 await page.getByRole('button',{name:/Revisar tela de bloqueio/}).click();
 assert.match(await page.locator('main').textContent(),/SIMULAÇÃO DE TELA DE BLOQUEIO/);
 const texts=[];for(const id of ['wake','commute','midday','sleep']){await page.locator(`[data-moment="${id}"]`).click();const text=await page.locator('.widget-copy').textContent();assert.match(text,/^Eu /);texts.push(text);}
 assert.ok(new Set(texts).size>=3);
 await page.screenshot({path:path.join(__dirname,'../preview-bloqueio.png'),fullPage:true});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('.accessory').evaluate(e=>e.scrollHeight<=e.clientHeight),true);}
 await page.setViewportSize({width:390,height:844});
 await page.locator('#showContent').uncheck();assert.match(await page.locator('.widget-copy').textContent(),/oculto/);await page.locator('#showContent').check();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:/Baixar configuração/}).click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'aurya-widget-demo.json');
 const stream=await download.createReadStream();let raw='';for await(const chunk of stream)raw+=chunk;const payload=JSON.parse(raw);assert.equal(payload.version,2);assert.equal(payload.moments.length,4);assert.ok(!raw.includes('teste@example.com'));assert.equal(payload.moments[0].minute,405);
 await page.locator('[data-tab="settings"]').click();assert.equal(await page.locator('#sleep').inputValue(),'23:00');await page.locator('#midday').fill('14:10');await page.getByRole('button',{name:'Guardar nesta sessão'}).click();assert.match(await page.locator('#saved').textContent(),/Quatro horários/);
 await page.locator('[data-tab="home"]').click();assert.match(await page.locator('.rhythm').textContent(),/14:10/);await page.getByRole('button',{name:/voltar ao relógio/}).click();assert.equal(await page.locator('[data-action=auto]').count(),0);
 await page.locator('[data-tab="premium"]').click();assert.match(await page.locator('main').textContent(),/Não há cobranças/);
 await page.locator('[data-tab="settings"]').click();page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Apagar dados da demonstração'}).click();await page.getByRole('heading',{name:'Cadastro de demonstração'}).waitFor();assert.equal(await page.locator('#name').inputValue(),'');
 assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
 // A real timer is armed once for the next boundary; jump over midnight, then wake.
 const clockPage=await browser.newPage({viewport:{width:390,height:844}});const base=new Date();base.setHours(23,59,0,0);await clockPage.clock.install({time:base});
 await clockPage.goto('http://127.0.0.1:8765/preview/');await clockPage.getByRole('button',{name:/Criar cadastro/}).click();await clockPage.getByRole('button',{name:/Continuar/}).click();await clockPage.getByRole('button',{name:/Revisar tela de bloqueio/}).click();
 const night=await clockPage.locator('.widget-copy').textContent();await clockPage.clock.fastForward(2*60000);assert.equal(await clockPage.locator('.widget-copy').textContent(),night);
 await clockPage.clock.fastForward(7*60*60000);assert.match(await clockPage.locator('.widget-title').textContent(),/Ao acordar/);
 await clockPage.close();
 // Exercise load failure and retry using an actual failed HTTP request.
 await page.route('**/assets/content.json',route=>route.fulfill({status:500,body:'failed'}));await page.reload();await page.getByRole('button',{name:'Tentar novamente'}).waitFor();await page.unroute('**/assets/content.json');await page.getByRole('button',{name:'Tentar novamente'}).click();await page.getByRole('heading',{name:'Cadastro de demonstração'}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS navegador: cadastro, 8 idiomas/fallback, 4 horários, validação, 4 momentos, frases curtas, privacidade simulada, JSON sem dados pessoais, navegação, virada de dia estável e troca automática, erro/retry, exclusão, 4 larguras, zero erros JS.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
