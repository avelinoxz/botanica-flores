'use strict';
// Dados exclusivamente fictícios. Tudo fica na memória desta página.
const products = [
  {id:1,name:'Rosa',category:'Flores',price:200,stock:200,unit:'50 unidades - Arranjo de rosas',image:'rosa'},
  {id:2,name:'Gérberas',category:'Flores',price:130,stock:200,unit:'50 unidades - Maço de gérberas',image:'gerbera'},
  {id:3,name:'Gypsophila (mosquitinho)',category:'Flores',price:230,stock:250,unit:'50 unidades - Maço de flores delicadas',image:'gypsophila'},
  {id:4,name:'Girassol',category:'Flores',price:180,stock:180,unit:'50 unidades - Haste de girassol',image:'girassol'},
  {id:5,name:'Tulipas',category:'Flores',price:350,stock:80,unit:'50 unidades - Maço de tulipas',image:'tulipa'},
  {id:6,name:'Sementes de flores',category:'Sementes e bulbos',price:8.90,stock:190,unit:'Envelope de sementes',image:'sementes'},
  {id:7,name:'Terra vegetal',category:'Cultivo',price:22.90,stock:164,unit:'Embalagem de 5 kg',image:'terra'},
  {id:8,name:'Substratos para cultivo',category:'Cultivo',price:29.90,stock:40,unit:'Embalagem de 5 kg',image:'substrato'},
  {id:9,name:'Adubos e fertilizantes',category:'Cultivo',price:34.90,stock:12,unit:'Embalagem de 1 kg',image:'adubo'},
  {id:10,name:'Bulbos de flores',category:'Sementes e bulbos',price:32.90,stock:35,unit:'Kit com 5 bulbos',image:'bulbos'}
];
const orders = [
  {id:'BF-1003',date:'23/11/2026',items:2,total:49.80,method:'Nacional',status:'Em transporte'},
  {id:'BF-1002',date:'20/11/2026',items:3,total:89.70,method:'Exportação',status:'Em análise'},
  {id:'BF-1001',date:'17/11/2026',items:1,total:39.90,method:'Nacional',status:'Entregue'}
];
const cart = new Map();
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const money = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const img = p => `assets/${p.image}.svg`;
const findProduct = id => products.find(p => p.id === Number(id));
let activeFilter = 'Todos', toastTimer, nextOrder = 1004;
function notify(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2500);}
function navigate(){
  const target=location.hash.slice(1)||'home';
  const name=target==='catalogo'?'home':target;
  const page=$$('.page').find(el=>el.id===name)||$('#home');
  $$('.page').forEach(el=>el.hidden=el!==page);
  $$('nav [data-page]').forEach(el=>{const active=el.dataset.page===page.id;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  $('#navigation').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');
  if(page.id==='estoque')renderStock();if(page.id==='pedidos')renderOrders();
  if(target==='catalogo')requestAnimationFrame(()=>$('#catalogo').scrollIntoView());else window.scrollTo(0,0);
}
window.addEventListener('hashchange',navigate);
$('#menu-toggle').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open));});
function renderProducts(){
  const term=normalize($('#search').value.trim());
  const filtered=products.filter(p=>(activeFilter==='Todos'||p.category===activeFilter)&&normalize(p.name+' '+p.unit).includes(term));
  $('#result-count').textContent=`${filtered.length} ${filtered.length===1?'produto':'produtos'}`;
  $('#product-list').innerHTML=filtered.map(p=>`<article class="product"><div class="product-image"><img src="${img(p)}" alt="Ilustração de ${p.name}" loading="lazy"><span class="product-tag">${p.category}</span></div><div class="product-content"><h3>${p.name}</h3><p>${p.unit}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho" ${p.stock===0?'disabled':''}>+</button></div></div></article>`).join('')||'<p class="empty">Nenhum produto encontrado.</p>';
}
$('#search').addEventListener('input',renderProducts);
$$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter;$$('[data-filter]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});renderProducts();}));
$('#product-list').addEventListener('click',e=>{const btn=e.target.closest('[data-add]');if(btn)addToCart(Number(btn.dataset.add));});
function addToCart(id){const p=findProduct(id),qty=cart.get(id)||0;if(qty>=p.stock){notify('Quantidade máxima disponível na simulação.');return;}cart.set(id,qty+1);renderCart();notify(`${p.name} adicionado ao carrinho.`);}
function cartTotals(){let count=0,total=0;for(const [id,qty] of cart){count+=qty;total+=findProduct(id).price*qty;}return {count,total};}
function renderCart(){const {count,total}=cartTotals();$('#cart-count').textContent=count;$('#cart-total').textContent=money(total);$('#checkout').disabled=!count;$('#cart-items').innerHTML=[...cart].map(([id,qty])=>{const p=findProduct(id);return `<div class="cart-row"><img src="${img(p)}" alt=""><div class="cart-description"><b>${p.name}</b><small>${money(p.price*qty)}</small><div class="quantity"><button data-action="minus" data-id="${id}" aria-label="Diminuir quantidade de ${p.name}">−</button><span>${qty}</span><button data-action="plus" data-id="${id}" aria-label="Aumentar quantidade de ${p.name}">+</button></div></div><button class="remove" data-action="remove" data-id="${id}" aria-label="Remover ${p.name}">×</button></div>`;}).join('')||'<p class="empty">Seu carrinho está vazio. Explore nossa coleção!</p>';}
const dialog=$('#cart-dialog');
$('#open-cart').addEventListener('click',()=>{renderCart();dialog.showModal();});
$('#close-cart').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$('#cart-items').addEventListener('click',e=>{const btn=e.target.closest('[data-action]');if(!btn)return;const id=Number(btn.dataset.id),qty=cart.get(id)||0;if(btn.dataset.action==='plus'){addToCart(id);return;}if(btn.dataset.action==='remove'||qty<=1)cart.delete(id);else cart.set(id,qty-1);renderCart();});
$('#checkout').addEventListener('click',()=>{const {count,total}=cartTotals();if(!count)return;for(const [id,qty] of cart)findProduct(id).stock-=qty;orders.unshift({id:`BF-${nextOrder++}`,date:new Date().toLocaleDateString('pt-BR'),items:count,total,method:$('#cart-method').value,status:'Em análise'});cart.clear();renderCart();renderProducts();renderOrders();dialog.close();location.hash='pedidos';notify('Pedido fictício criado com sucesso!');});
function stats(el,items){el.innerHTML=items.map(([label,value])=>`<div class="stat"><small>${label}</small><strong>${value}</strong></div>`).join('');}
function renderStock(){stats($('#stock-stats'),[['Produtos cadastrados',products.length],['Unidades em estoque',products.reduce((sum,p)=>sum+p.stock,0)],['Estoque baixo (até 10)',products.filter(p=>p.stock<=10).length]]);const term=normalize($('#stock-search').value.trim());$('#stock-list').innerHTML=products.filter(p=>normalize(p.name+' '+p.category).includes(term)).map(p=>`<tr><td><div class="table-product"><img src="${img(p)}" alt="">${p.name}</div></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.stock} un.</td><td><span class="status ${p.stock<=10?'warn':''}">${p.stock===0?'Esgotado':p.stock<=10?'Estoque baixo':'Disponível'}</span></td></tr>`).join('')||'<tr><td colspan="5">Nenhum produto encontrado.</td></tr>';}
$('#stock-search').addEventListener('input',renderStock);
function renderOrders(){stats($('#order-stats'),[['Total de pedidos',orders.length],['Em andamento',orders.filter(o=>o.status!=='Entregue').length],['Entregues',orders.filter(o=>o.status==='Entregue').length]]);$('#order-list').innerHTML=orders.map(o=>`<tr><td><strong>#${o.id}</strong></td><td>${o.date}</td><td>${o.items} un.</td><td>${money(o.total)}</td><td>${o.method}</td><td><span class="status ${o.status==='Em análise'?'warn':o.status==='Em transporte'?'neutral':''}">${o.status}</span></td></tr>`).join('');}
$$('[data-account]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-account]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});$('#login-form').hidden=btn.dataset.account!=='login';$('#cadastro-form').hidden=btn.dataset.account!=='cadastro';}));
function demoSubmit(form,message){form.addEventListener('submit',e=>{e.preventDefault();form.querySelector('.form-message').textContent=typeof message==='function'?message():message;form.reset();});}
demoSubmit($('#login-form'),'Login simulado com sucesso! Nenhuma conta real foi acessada.');
demoSubmit($('#cadastro-form'),'Cadastro simulado com sucesso! Nenhum dado foi armazenado.');
const states=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
for(const state of states)$('#state').add(new Option(state,state));
for(const p of products)$('#export-product').add(new Option(p.name,p.id));
demoSubmit($('#national-form'),()=>{const express=$('#national-method').value==='express';return `Simulação concluída! Frete ilustrativo: ${money(express?39.90:19.90)} · Prazo estimado: ${express?'2 a 4':'5 a 8'} dias úteis. Nenhum envio foi contratado.`;});
demoSubmit($('#export-form'),'Cotação internacional simulada! Nenhuma solicitação foi enviada e não há compromisso comercial.');
renderProducts();renderCart();renderStock();renderOrders();navigate();
