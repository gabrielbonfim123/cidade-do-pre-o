/* ZUZ — Desafio do Preço | jogo educativo offline, sem dependências. */
(() => {
  'use strict';

  const KEY = 'zuz_desafio_preco_v4';
  const MAX_DAYS = 7;
  const INITIAL_CASH = 1500;
  const SALES_FEES = .08;
  const DAILY_FIXED = 158;
  const PRODUCTS = [
    { id: 'brownie', name: 'Brownie artesanal', tagline: 'Chocolate · 100 g', baseCost: 6.10, market: 14.50, defaultPrice: 13.90, defaultQty: 27, baseDemand: 24, tint: '#9b785f' },
    { id: 'cookie', name: 'Cookie de baunilha', tagline: 'Confeitaria · unidade', baseCost: 3.60, market: 9.90, defaultPrice: 9.50, defaultQty: 29, baseDemand: 28, tint: '#c49a72' },
    { id: 'coffee', name: 'Cappuccino', tagline: 'Bebida · 250 ml', baseCost: 4.80, market: 12.50, defaultPrice: 11.90, defaultQty: 34, baseDemand: 31, tint: '#b6a4be' },
    { id: 'bolo_pote', name: 'Bolo de pote', tagline: 'Doce · 200 g', baseCost: 7.20, market: 18.90, defaultPrice: 17.90, defaultQty: 12, baseDemand: 13, tint: '#be86a4', unlockCost: 190, desc:'Uma sobremesa de maior valor agregado. Requer atenção aos custos de embalagem.' },
    { id: 'pao_queijo', name: 'Pão de queijo', tagline: 'Salgado · unidade', baseCost: 2.80, market: 8.90, defaultPrice: 7.90, defaultQty: 19, baseDemand: 21, tint: '#e5ba7c', unlockCost: 260, desc:'Produto acessível, com boa procura e menor ganho por unidade.' },
    { id: 'suco', name: 'Suco natural', tagline: 'Bebida · 300 ml', baseCost: 4.40, market: 12.90, defaultPrice: 11.90, defaultQty: 15, baseDemand: 17, tint: '#e8ac5e', unlockCost: 350, desc:'Uma bebida refrescante para diversificar a oferta no bairro.' },
    { id: 'torta', name: 'Fatia de torta', tagline: 'Sobremesa · fatia', baseCost: 9.40, market: 23.50, defaultPrice: 21.90, defaultQty: 10, baseDemand: 11, tint: '#e7b1bd', unlockCost: 460, desc:'Maior preço médio, mas demanda moderada e custo de produção elevado.' }
  ];
  const BASE_PRODUCTS_COUNT=PRODUCTS.length;
  const MAX_CUSTOM_PRODUCTS=20;
  const PRODUCT_TYPES={
    'Doce':{tint:'#d88aa9',demand:15},
    'Salgado':{tint:'#e2aa6c',demand:16},
    'Bebida':{tint:'#78b4be',demand:18},
    'Outro':{tint:'#a18bd8',demand:14}
  };
  const ORIGINAL_IDS=['brownie','cookie','coffee'];
  const UPGRADES=[
    {id:'vitrine',name:'Vitrine renovada',tag:'Mais visibilidade',cost:250,desc:'Melhora a apresentação da loja.',effect:'+8% de demanda permanente'},
    {id:'equipamento',name:'Equipamentos eficientes',tag:'Redução de custos',cost:420,desc:'Diminui o desperdício de ingredientes na preparação.',effect:'−7% no custo direto de produção'},
    {id:'fidelidade',name:'Programa de fidelidade',tag:'Clientes recorrentes',cost:560,desc:'Incentiva novas visitas por meio de um programa simples.',effect:'+10% de demanda permanente'}
  ];
  const INGREDIENTS=[
    {id:'chocolate',name:'Chocolate e cacau',emoji:'🍫'},
    {id:'farinha',name:'Farinhas e massas',emoji:'🌾'},
    {id:'leite',name:'Leite e bebidas',emoji:'🥛'},
    {id:'embalagem',name:'Embalagens',emoji:'📦'},
    {id:'outros',name:'Outros insumos',emoji:'🧺'}
  ];
  const RECIPES={
    Doce:[.52,.20,.02,.17,.09],Salgado:[.06,.53,.08,.17,.16],
    Bebida:[.10,0,.55,.20,.15],Outro:[.22,.22,.19,.19,.18]
  };
  const STAFF=[
    {id:'atendente',name:'Atendente',salary:34,emoji:'🛎️',desc:'Atendimento ágil: aumenta a procura em 12%.'},
    {id:'cozinheiro',name:'Cozinheiro',salary:42,emoji:'👨‍🍳',desc:'Melhora o aproveitamento: reduz o uso de insumos em 6%.'},
    {id:'gerente',name:'Gerente',salary:48,emoji:'📋',desc:'Melhora a experiência e acrescenta 2 pontos de reputação a cada dia.'}
  ];
  const CUSTOMER_TYPES=[
    {id:'economico',name:'Clientes econômicos',emoji:'🛍️',summary:'Procuram preços acessíveis e comparam com a concorrência.',quote:'Quero economizar sem abrir mão da qualidade.',kind:'Preço sensível'},
    {id:'familias',name:'Famílias do bairro',emoji:'👨‍👩‍👧',summary:'Compram mais doces e preferem ofertas equilibradas.',quote:'Tem algo gostoso para levar para casa?',kind:'Preferem doces'},
    {id:'trabalhadores',name:'Público apressado',emoji:'☕',summary:'Prefere bebidas e atendimento rápido.',quote:'Preciso de algo rápido para o intervalo.',kind:'Bebidas e agilidade'},
    {id:'curiosos',name:'Clientes curiosos',emoji:'⭐',summary:'Gostam de novidades e de descobrir novos produtos.',quote:'Quero experimentar alguma novidade!',kind:'Produtos novos'}
  ];
  const LIVE_EVENTS=[
    {title:'Movimento de inauguração',kind:'Oportunidade',text:'A comunidade está conhecendo a loja. Bons preços ajudam a conquistar confiança.',demand:1.03},
    {title:'Chuva no bairro',kind:'Clima',text:'O movimento cai um pouco; bebidas ganham destaque.',demand:.94},
    {title:'Festival de bairro',kind:'Evento local',text:'A praça fica mais movimentada e mais pessoas visitam os comércios.',demand:1.12},
    {title:'Insumos mais disputados',kind:'Fornecimento',text:'Planeje seu estoque com antecedência para não parar a produção.',demand:1},
    {title:'Ofertas da concorrência',kind:'Concorrência',text:'As pessoas comparam preços e valorizam diferenciais.',demand:.92},
    {title:'Boa avaliação local',kind:'Reputação',text:'A divulgação boca a boca aumenta a circulação.',demand:1.12},
    {title:'Fim de semana agitado',kind:'Demanda',text:'Bom movimento para testar o planejamento de produção.',demand:1.08}
  ];
  const DAYS = [
    { title: 'A inauguração', category: 'INÍCIO DA JORNADA', description: 'Seu ateliê abre as portas. Os moradores estão curiosos, mas precisam confiar nos seus preços.', demand: [1.08,1.08,1.03], costs:[0,0,0], fixed:0, hint:'Comece considerando os custos por unidade, as taxas e a comparação com o mercado.', mission:'Conquistar os primeiros clientes sem vender abaixo do custo.' },
    { title: 'Uma manhã chuvosa', category: 'CENÁRIO DE MERCADO', description: 'A circulação na rua diminuiu. Bebidas quentes têm mais procura que o habitual.', demand:[.75,.83,1.30], costs:[0,0,0], fixed:0, hint:'A procura não depende só do preço. Clima e comportamento dos clientes também influenciam.', mission:'Reajustar a produção para evitar sobras.' },
    { title: 'A feira do bairro', category: 'OPORTUNIDADE LOCAL', description: 'A praça recebe uma feira movimentada. Mais pessoas podem conhecer seus produtos.', demand:[1.29,1.23,1.17], costs:[0,0,0], fixed:0, hint:'Procura alta é oportunidade, mas produzir demais também pode gerar desperdício.', mission:'Aproveitar o movimento com estoque equilibrado.' },
    { title: 'Matéria-prima em alta', category: 'CONTROLE DE CUSTOS', description: 'O custo do cacau e de outros insumos aumentou. Seu lucro pode cair se nada mudar.', demand:[.98,1,1], costs:[1.50,.50,0], fixed:0, hint:'Quando o custo sobe, compare o novo preço técnico com o preço que o público aceita.', mission:'Proteger sua margem apesar dos custos mais altos.' },
    { title: 'Concorrente na esquina', category: 'CONCORRÊNCIA', description: 'Outra loja abriu perto da sua com uma promoção agressiva de doces.', demand:[.74,.78,.94], costs:[0,0,0], fixed:0, hint:'Baixar preços pode atrair pessoas, mas lembre-se de quanto você precisa ganhar por venda.', mission:'Manter a competitividade sem sacrificar o caixa.' },
    { title: 'O negócio ficou conhecido', category: 'REPUTAÇÃO', description: 'Uma avaliação positiva circulou nas redes do bairro. A procura tende a crescer.', demand:[1.38,1.32,1.18], costs:[0,0,0], fixed:0, hint:'Reputação boa aumenta a confiança, mas só atende à demanda quem planeja a produção.', mission:'Atender a procura extra e manter a qualidade.' },
    { title: 'O grande sábado', category: 'DESAFIO FINAL', description: 'Chegou o dia de maior movimento da semana. Sua estratégia definirá o resultado do negócio.', demand:[1.23,1.28,1.25], costs:[0,0,0], fixed:18, hint:'Use tudo o que aprendeu: custos, mercado, produção, taxas e margem de contribuição.', mission:'Terminar a semana com caixa positivo e clientes satisfeitos.' }
  ];
  const POLICIES = [
    { id: 'none', name: 'Operação enxuta', detail: 'Sem investimento adicional. Menos risco para o caixa.', cost: 0, multiplier: 1, fixedDelta: -12, rep: 0 },
    { id: 'marketing', name: 'Divulgar no bairro', detail: 'Investir R$ 48 em divulgação pode aumentar a procura em 18%.', cost: 48, multiplier: 1.18, fixedDelta: 0, rep: 0 },
    { id: 'quality', name: 'Cuidar da experiência', detail: 'Investir R$ 36 no atendimento e ganhar reputação (+3).', cost: 36, multiplier: 1.07, fixedDelta: 0, rep: 3 }
  ];
  const CHALLENGES = [
    { title: 'Primeira encomenda', text: 'Uma vizinha recomenda sua confeitaria para um grupo do bairro. Você pode preparar uma pequena ação de boas-vindas.', options:[
      {label:'Oferecer degustação', detail:'Custa R$ 24, aumenta a procura por brownies e cookies.', cost:24, demand:[1.22,1.14,1], rep:2},
      {label:'Manter a operação', detail:'Nenhum custo adicional, mantendo a projeção original.',cost:0,demand:[1,1,1],rep:0}
    ]},
    { title: 'Entrega na chuva', text: 'Clientes que evitam sair de casa perguntam se é possível receber os pedidos.', options:[
      {label:'Organizar entregas locais', detail:'Custa R$ 32, melhora a procura de todos os produtos.',cost:32,demand:[1.19,1.19,1.12],rep:1},
      {label:'Atender apenas no balcão', detail:'Sem custo extra, mas o movimento da rua continua menor.',cost:0,demand:[1,1,1],rep:0}
    ]},
    { title: 'Espaço na feira', text: 'A organização oferece um pequeno espaço de exposição na praça.', options:[
      {label:'Participar da feira',detail:'Taxa de R$ 55 e chance de alcançar mais clientes.',cost:55,demand:[1.22,1.18,1.14],rep:2},
      {label:'Ficar apenas na loja', detail:'Sem taxa, operando com o fluxo já previsto.',cost:0,demand:[1,1,1],rep:0}
    ]},
    { title: 'Proposta do fornecedor', text: 'O fornecedor oferece uma compra conjunta que pode reduzir parte do aumento dos insumos.', options:[
      {label:'Negociar o lote',detail:'Custa R$ 22 de logística e reduz o custo do brownie em R$ 0,75.',cost:22,demand:[1,1,1],rep:0,costCut:[.75,0,0]},
      {label:'Comprar normalmente',detail:'Sem custo adicional, mantendo os custos aumentados.',cost:0,demand:[1,1,1],rep:0}
    ]},
    { title: 'Cliente comparando preços', text: 'O concorrente atraiu parte dos compradores. Você pode destacar seus diferenciais.', options:[
      {label:'Reforçar apresentação',detail:'Custa R$ 26; melhora a procura e a percepção do negócio.',cost:26,demand:[1.13,1.13,1.08],rep:2},
      {label:'Aguardar sem alterar',detail:'Sem custo adicional e sem recuperação extra de demanda.',cost:0,demand:[1,1,1],rep:0}
    ]},
    { title: 'Aumento inesperado de pedidos', text: 'Alguns clientes chegam ao mesmo tempo. Uma ajuda temporária pode agilizar o atendimento.', options:[
      {label:'Contratar apoio para o dia',detail:'Custa R$ 38 e permite aproveitar mais a procura.',cost:38,demand:[1.17,1.17,1.17],rep:2},
      {label:'Atender com a equipe atual',detail:'Sem custo extra, mas sem ganho de capacidade.',cost:0,demand:[1,1,1],rep:0}
    ]},
    { title: 'A última decisão', text: 'Uma parceria com negócios vizinhos pode tornar o último dia ainda mais movimentado.', options:[
      {label:'Criar uma ação conjunta',detail:'Custa R$ 49 e amplia a procura de todos os itens.',cost:49,demand:[1.20,1.20,1.20],rep:3},
      {label:'Confiar na clientela atual',detail:'Sem custo extra, com os resultados da sua estratégia.',cost:0,demand:[1,1,1],rep:0}
    ]}
  ];

  const root = document.getElementById('pageRoot');
  const overlay = document.getElementById('overlayRoot');
  const toastEl = document.getElementById('toast');
  const zuniEl = document.getElementById('zuniMessage');
  let timer = null;
  let toastTimer = null;
  let currentPage = 'cidade';
  let soundOn = true;
  let audioContext = null;
  let bgMusic = null;
  let state = loadState();

  function defaultState() {
    return { started:false, name:'Ateliê Aurora', day:1, cash:INITIAL_CASH, reputation:62, prices:PRODUCTS.slice(0,BASE_PRODUCTS_COUNT).map(p=>p.defaultPrice), quantities:PRODUCTS.slice(0,BASE_PRODUCTS_COUNT).map(p=>p.unlockCost?0:p.defaultQty), customProducts:[], unlocked:[...ORIGINAL_IDS], upgrades:[], investments:[], policy:'none', history:[], pendingNext:false, finished:false, selectedChallenge:null, tutorialSeen:false, inventory:{chocolate:0,farinha:0,leite:0,embalagem:0,outros:0}, employees:[], secondUnit:false, period:'tarde', missionWins:0, city:{day:1,supplier:null,priceDone:false,priceCorrect:false,deliveryDone:false,deliveryStep:0} };
  }
  function sanitizeCustomProduct(raw){
    if(!raw || typeof raw!=='object')return null;
    const id=String(raw.id||'');
    if(!/^custom_[a-z0-9_-]{4,42}$/.test(id))return null;
    const name=String(raw.name||'').replace(/[<>&"']/g,'').trim().slice(0,40);
    const category=PRODUCT_TYPES[raw.category]?raw.category:'Outro';
    const baseCost=Number(raw.baseCost),defaultPrice=Number(raw.defaultPrice),defaultQty=Number(raw.defaultQty);
    if(!name||!Number.isFinite(baseCost)||baseCost<.1||baseCost>100||!Number.isFinite(defaultPrice)||defaultPrice<1||defaultPrice>100||!Number.isFinite(defaultQty))return null;
    return {id,name,category,tagline:`${category} · produto próprio`,baseCost:Math.round(baseCost*100)/100,defaultPrice:Math.round(defaultPrice*100)/100,
      market:clamp(Number(raw.market)||defaultPrice,1,100),defaultQty:clamp(Math.round(defaultQty),0,120),baseDemand:PRODUCT_TYPES[category].demand,
      tint:PRODUCT_TYPES[category].tint,desc:'Produto cadastrado pelo jogador',custom:true,archived:!!raw.archived};
  }
  function customById(id){return state.customProducts.find(p=>p.id===id)}
  function editableDay(){return state.started&&!state.pendingNext&&!state.finished}
  function resetCatalog(){PRODUCTS.splice(BASE_PRODUCTS_COUNT)}
  function addCustomProduct(form){
    if(!editableDay()){toast('Avance para o próximo dia para alterar o cardápio.');return;}
    const data=new FormData(form);
    const editing=String(data.get('editing')||'');
    const name=String(data.get('name')||'').replace(/[<>&"']/g,'').trim().replace(/\s+/g,' ').slice(0,40);
    const category=String(data.get('category')||'Outro');
    const cost=Number(data.get('cost')),price=Number(data.get('price')),qty=Number(data.get('qty'));
    const message=document.getElementById('customProductFeedback');
    const fail=msg=>{if(message){message.textContent=msg;message.classList.add('is-error')}toast(msg)};
    if(name.length<2)return fail('Escreva um nome com pelo menos 2 caracteres.');
    if(!PRODUCT_TYPES[category])return fail('Escolha uma categoria válida.');
    if(!Number.isFinite(cost)||cost<.1||cost>100)return fail('Informe o custo unitário entre R$ 0,10 e R$ 100.');
    if(!Number.isFinite(price)||price<1||price>100)return fail('Informe um preço entre R$ 1 e R$ 100.');
    if(!Number.isInteger(qty)||qty<0||qty>120)return fail('A produção deve ser de 0 a 120 unidades.');
    const duplicate=PRODUCTS.some(p=>p.name.toLocaleLowerCase('pt-BR')===name.toLocaleLowerCase('pt-BR')&&p.id!==editing);
    if(duplicate)return fail('Já existe um produto com esse nome no catálogo.');
    let product;
    if(editing){
      product=customById(editing);
      if(!product)return fail('Produto não encontrado para edição.');
      const idx=PRODUCTS.findIndex(p=>p.id===editing);
      Object.assign(product,{name,category,tagline:`${category} · produto próprio`,baseCost:Math.round(cost*100)/100,defaultPrice:Math.round(price*100)/100,
        baseDemand:PRODUCT_TYPES[category].demand,tint:PRODUCT_TYPES[category].tint,defaultQty:qty});
      // O preço de mercado permanece como referência inicial simulada; não é cotação real.
      state.prices[idx]=Math.round(price*100)/100;
      state.quantities[idx]=qty;
    } else {
      if(state.customProducts.length>=MAX_CUSTOM_PRODUCTS)return fail(`O limite é de ${MAX_CUSTOM_PRODUCTS} produtos próprios por partida.`);
      const unique='custom_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
      product=sanitizeCustomProduct({id:unique,name,category,baseCost:cost,defaultPrice:price,defaultQty:qty,market:price});
      if(!product)return fail('Confira os valores preenchidos.');
      state.customProducts.push(product);
      PRODUCTS.push(product);
      state.unlocked.push(product.id);
      state.prices.push(product.defaultPrice);
      state.quantities.push(qty);
    }
    save();sound('cash');render();
    toast(editing?`${name} atualizado no cardápio.`:`${name} adicionado ao cardápio!`);
  }
  function editCustomProduct(id){
    const p=customById(id);if(!p)return;
    if(!editableDay()){toast('Altere produtos antes de fechar o dia.');return;}
    currentPage='expansao';render();
    const form=document.getElementById('customProductForm');if(!form)return;
    form.elements.editing.value=id;
    form.elements.name.value=p.name;
    form.elements.category.value=p.category;
    form.elements.cost.value=p.baseCost.toFixed(2);
    form.elements.price.value=state.prices[PRODUCTS.findIndex(x=>x.id===id)].toFixed(2);
    form.elements.qty.value=state.quantities[PRODUCTS.findIndex(x=>x.id===id)];
    document.getElementById('customFormTitle').textContent='Editar produto';
    const submit=document.getElementById('customSubmit');if(submit)submit.textContent='Salvar alterações';
    const cancel=document.getElementById('cancelCustomEdit');if(cancel)cancel.hidden=false;
    form.scrollIntoView({behavior:'smooth',block:'center'});
    form.elements.name.focus({preventScroll:true});
  }
  function archiveCustomProduct(id){
    if(!editableDay()){toast('Espere o fechamento do dia antes de alterar o cardápio.');return;}
    const product=customById(id);if(!product)return;
    product.archived=!product.archived;
    const idx=PRODUCTS.findIndex(p=>p.id===id);
    state.quantities[idx]=product.archived?0:product.defaultQty;
    save();render();sound('tap');toast(product.archived?`${product.name} retirado da loja.`:`${product.name} voltou para o cardápio.`);
  }
  function loadState() {
    try {
      const raw=JSON.parse(localStorage.getItem(KEY));
      if (!raw || !Array.isArray(raw.prices) || !Array.isArray(raw.quantities) || !Array.isArray(raw.history) || !Number.isFinite(raw.cash)) return defaultState();
      const fresh=defaultState();
      const s={...fresh,...raw};
      s.customProducts=Array.isArray(raw.customProducts)?raw.customProducts.slice(0,MAX_CUSTOM_PRODUCTS).map(sanitizeCustomProduct).filter(Boolean):[];
      // Reconstrói o catálogo antes de carregar os preços e a produção salvos.
      PRODUCTS.splice(BASE_PRODUCTS_COUNT);
      PRODUCTS.push(...s.customProducts);
      s.day=Math.max(1, Math.floor(Number(s.day)||1));
      s.unlocked=Array.isArray(raw.unlocked)?[...new Set([...ORIGINAL_IDS,...s.customProducts.map(p=>p.id),...raw.unlocked.filter(id=>PRODUCTS.some(p=>p.id===id))])]:[...ORIGINAL_IDS,...s.customProducts.map(p=>p.id)];
      s.upgrades=Array.isArray(raw.upgrades)?[...new Set(raw.upgrades.filter(id=>UPGRADES.some(x=>x.id===id)))]:[];
      s.investments=Array.isArray(raw.investments)?raw.investments.filter(x=>x&&Number.isFinite(x.cost)&&typeof x.name==='string'):[];
      s.inventory=Object.fromEntries(INGREDIENTS.map(x=>[x.id,Math.max(0,Number(raw.inventory?.[x.id])||0)]));
      s.employees=Array.isArray(raw.employees)?[...new Set(raw.employees.filter(id=>STAFF.some(v=>v.id===id)))]:[];
      s.secondUnit=Boolean(raw.secondUnit);
      s.period=['manha','tarde','noite'].includes(raw.period)?raw.period:'tarde';
      s.missionWins=Math.max(0,Number(raw.missionWins)||0);
      s.prices=PRODUCTS.map((p,i)=>clamp(Number(s.prices[i]) || p.defaultPrice,1,100));
      s.quantities=PRODUCTS.map((p,i)=>s.unlocked.includes(p.id)?clamp(Math.round(Number(s.quantities[i]??p.defaultQty)||0),0,120):0);
      s.name=(String(s.name||'Ateliê Aurora').slice(0,30));
      s.reputation=clamp(Number(s.reputation)||60,0,100);
      s.policy=POLICIES.some(p=>p.id===s.policy)?s.policy:'none';
      return s;
    } catch { return defaultState(); }
  }
  function save() { try {localStorage.setItem(KEY,JSON.stringify(state));} catch {} }
  function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
  function esc(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function money(n){return (n<0?'-':'')+'R$ '+Math.abs(n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function shortMoney(n){return (n<0?'-':'')+'R$ '+Math.abs(n).toLocaleString('pt-BR',{maximumFractionDigits:0});}
  function dec(v){return Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function percent(n){return `${Math.round(n*100)}%`}
  function dayConfig(){return DAYS[(state.day-1)%DAYS.length]}
  function cycleNumber(){return Math.floor((state.day-1)/DAYS.length)+1}
  function currentChallenge(){return CHALLENGES[(state.day-1)%CHALLENGES.length]}
  function policy(){return POLICIES.find(p=>p.id===state.policy)||POLICIES[0]}
  function isUnlocked(id){return state.unlocked.includes(id)&&!PRODUCTS.find(p=>p.id===id)?.archived}
  function ownedUpgrade(id){return state.upgrades.includes(id)}
  function activeIndexes(){return PRODUCTS.map((p,i)=>isUnlocked(p.id)?i:-1).filter(i=>i!==-1)}
  function todayOrder(){const indexes=activeIndexes();return indexes[(PACKING_ORDERS[(state.day*3+cityProgress().deliveryStep)%PACKING_ORDERS.length]+state.day+cityProgress().deliveryStep)%indexes.length]}
  function investmentTotal(){return state.investments.reduce((a,x)=>a+x.cost,0)}
  function customerType(){return CUSTOMER_TYPES[(state.day-1)%CUSTOMER_TYPES.length]}
  function todayEvent(){return LIVE_EVENTS[(state.day-1)%LIVE_EVENTS.length]}
  function periodLabel(){return {manha:'Manhã',tarde:'Tarde',noite:'Noite'}[state.period]}
  function staffOwned(id){return state.employees.includes(id)}
  function salaryCost(){return STAFF.filter(x=>staffOwned(x.id)).reduce((a,b)=>a+b.salary,0)}
  function branchRent(){return state.secondUnit?105:0}
  function recipeFor(i){
    const p=PRODUCTS[i];
    if(p.id==='brownie'||p.id==='bolo_pote'||p.id==='torta')return RECIPES.Doce;
    if(p.id==='cookie'||p.id==='pao_queijo')return RECIPES.Salgado;
    if(p.id==='coffee'||p.id==='suco')return RECIPES.Bebida;
    return RECIPES[p.category]||RECIPES.Outro;
  }
  function ingredientNeed(opt){
    const amounts=Object.fromEntries(INGREDIENTS.map(x=>[x.id,0]));
    for(const i of activeIndexes()){
      const per=productCost(i,opt), qty=state.quantities[i], shares=recipeFor(i);
      INGREDIENTS.forEach((ing,j)=>amounts[ing.id]+=per*qty*shares[j]);
    }
    return amounts;
  }
  function shortages(opt){
    const need=ingredientNeed(opt);
    return INGREDIENTS.map(x=>({...x,need:need[x.id],have:state.inventory[x.id]||0,missing:Math.max(0,need[x.id]-(state.inventory[x.id]||0))}));
  }
  function shortagesValue(opt){return shortages(opt).reduce((sum,x)=>sum+x.missing,0)}
  function inventoryValue(){return INGREDIENTS.reduce((a,x)=>a+(state.inventory[x.id]||0),0)}
  function operationalCost(opt){return fixedCost()+policy().cost+(opt?.cost||0)}
  function restockAll(){
    if(!editableDay()){toast('Reponha os insumos antes de fechar o dia.');return;}
    const items=shortages();
    const total=items.reduce((a,x)=>a+Math.ceil(x.missing*100)/100,0);
    if(total<.01){toast('Seu estoque já cobre a produção planejada.');return;}
    if(total>state.cash+.0001){toast('Caixa insuficiente para repor o estoque. Reduza a produção.');return;}
    items.forEach(x=>state.inventory[x.id]=Math.round(((state.inventory[x.id]||0)+Math.ceil(x.missing*100)/100)*100)/100);
    state.cash=Math.round((state.cash-total)*100)/100;
    save();render();sound('cash');toast(`Insumos repostos: ${money(total)} do caixa.`);
  }
  function buyIngredient(id,amount){
    if(!editableDay())return;
    if(!INGREDIENTS.some(x=>x.id===id)||![25,50,100].includes(amount))return;
    if(state.cash<amount){toast('Caixa insuficiente para esta compra.');return;}
    state.cash=Math.round((state.cash-amount)*100)/100;
    state.inventory[id]=Math.round(((state.inventory[id]||0)+amount)*100)/100;
    save();render();sound('cash');toast(`Insumo comprado: ${money(amount)}.`);
  }
  function missionInfo(){
    const goal=state.day%2===0?45:55;
    return {goal,description:`Venda pelo menos ${goal} unidades hoje e receba +2 de reputação.`,reward:2};
  }
  function periodDemand(i){
    const p=PRODUCTS[i];
    const beverage=p.id==='coffee'||p.id==='suco'||p.category==='Bebida';
    if(state.period==='manha')return beverage?1.16:.96;
    if(state.period==='noite')return beverage?.86:1.13;
    return 1.06;
  }
  function personaDemand(i,price){
    const p=PRODUCTS[i],profile=customerType(),ratio=price/Math.max(1,p.market);
    if(profile.id==='economico')return ratio<=1?1.10:.78;
    if(profile.id==='trabalhadores')return p.id==='coffee'||p.category==='Bebida'?1.18:1;
    if(profile.id==='familias')return p.category==='Doce'||p.id==='brownie'?1.16:1;
    return p.custom?1.3:PRODUCTS[i].unlockCost?1.16:1;
  }
  function storePageLabel(){return state.secondUnit?'2 unidades abertas':'1 unidade aberta'}
  function productCost(i, opt){return Math.max(.1,(PRODUCTS[i].baseCost+(dayConfig().costs[i]||0)-(opt?.costCut?.[i]||0)-(cityModifiers().costCut[i]||0))*(ownedUpgrade('equipamento')?.93:1)*(staffOwned('cozinheiro')?.94:1));}
  function totalMadeCost(opt){return state.quantities.reduce((sum,q,i)=>sum+q*productCost(i,opt),0)}
  function fixedCost(){return DAILY_FIXED+dayConfig().fixed+policy().fixedDelta+salaryCost()+branchRent()}
  function businessCost(opt){return shortagesValue(opt)+operationalCost(opt)}
  function availableBudget(){return state.cash-businessCost(null)}
  function demandFor(i,price,rep=state.reputation,opt=null){
    const p=PRODUCTS[i], day=dayConfig();
    const pricing=clamp(Math.pow(p.market/Math.max(1,price),1.8),.32,2.05);
    const reputation=clamp(.6+(rep/100)*.65,.62,1.27);
    return Math.max(0,p.baseDemand*(day.demand[i]??1)*policy().multiplier*pricing*reputation*(opt?.demand?.[i]||1)*cityModifiers().demand*(ownedUpgrade('vitrine')?1.08:1)*(ownedUpgrade('fidelidade')?1.10:1)*(staffOwned('atendente')?1.12:1)*(state.secondUnit?1.46:1)*todayEvent().demand*periodDemand(i)*personaDemand(i,price));
  }
  function forecast(opt){
    const lines=activeIndexes().map(i=>{
      const p=PRODUCTS[i];
      const sold=Math.min(state.quantities[i],Math.round(demandFor(i,state.prices[i],state.reputation,opt)));
      const revenue=sold*state.prices[i];
      return {productIndex:i,sold, made:state.quantities[i], remaining:state.quantities[i]-sold, revenue, cost:state.quantities[i]*productCost(i,opt), name:p.name};
    });
    const revenue=lines.reduce((s,l)=>s+l.revenue,0);
    const fees=revenue*SALES_FEES;
    const profit=revenue-totalMadeCost(opt)-operationalCost(opt)-fees;
    return {lines,revenue,fees,profit,sold:lines.reduce((s,l)=>s+l.sold,0),made:state.quantities.reduce((s,q)=>s+q,0)};
  }
  function deterministicNoise(i){const n=[.98,1.055,.945,1.02,1.08,.965,.99];return n[(state.day-1)%n.length]*(i===0?1.018:i===1?.974:1.011)}
  function resultDay(opt,optionIndex){
    const lines=activeIndexes().map(i=>{
      const p=PRODUCTS[i];
      const made=state.quantities[i],unit=productCost(i,opt);
      const predicted=demandFor(i,state.prices[i],state.reputation,opt)*deterministicNoise(i);
      const sold=Math.min(made,Math.max(0,Math.round(predicted)));
      const revenue=sold*state.prices[i];
      const directCost=made*unit;
      return {productIndex:i,name:p.name, made,sold,remaining:made-sold,price:state.prices[i],unitCost:unit,revenue,directCost,contribution:revenue*(1-SALES_FEES)-directCost};
    });
    const revenue=lines.reduce((v,p)=>v+p.revenue,0);
    const directCost=lines.reduce((v,p)=>v+p.directCost,0);
    const fees=revenue*SALES_FEES;
    const fixed=fixedCost(), policyCost=policy().cost, challengeCost=opt.cost||0;
    const profit=revenue-directCost-fees-fixed-policyCost-challengeCost;
    const sold=lines.reduce((v,p)=>v+p.sold,0), made=lines.reduce((v,p)=>v+p.made,0);
    const saleRatio=made===0?0:sold/made;
    const compared=lines.reduce((v,p)=>v+(p.price/PRODUCTS[p.productIndex].market)*(p.sold||1),0)/Math.max(1,lines.reduce((v,p)=>v+(p.sold||1),0));
    const baseReputation=(compared<.97?1:compared>1.16?-3:0)+(saleRatio>.78?1:saleRatio<.39?-2:0);
    const missionComplete=sold>=missionInfo().goal;
    const repChange=policy().rep+(opt.rep||0)+baseReputation+(staffOwned('gerente')?2:0)+(missionComplete?2:0);
    const reputationBefore=state.reputation;
    // Ingredients were paid for when stocked. Opening the store consumes those assets,
    // so we only deduct operating expenses at closing: do not pay production twice.
    const required=ingredientNeed(opt);
    INGREDIENTS.forEach(ing=>{state.inventory[ing.id]=Math.max(0,Math.round(((state.inventory[ing.id]||0)-required[ing.id])*100)/100)});
    state.cash=Math.round((state.cash+revenue-fees-fixed-policyCost-challengeCost)*100)/100;
    if(missionComplete)state.missionWins++;
    state.reputation=clamp(state.reputation+repChange,0,100);
    const result={day:state.day, title:dayConfig().title, lines, revenue,directCost,fees,fixed,policyCost,challengeCost,profit,sold,made,remaining:made-sold,repChange,reputationBefore,reputationAfter:state.reputation, cashAfter:state.cash, optionIndex, optionLabel:opt.label, missionComplete, inventoryAfter:inventoryValue(), salaries:salaryCost(), rent:branchRent(), customerProfile:customerType().name, timeSlot:periodLabel(), secondUnit:state.secondUnit, citySummary:{supplier:CITY_SUPPLIERS.find(s=>s.id===cityProgress().supplier)?.name||'Não selecionado',priceDone:cityProgress().priceDone,priceCorrect:cityProgress().priceCorrect,deliveryDone:cityProgress().deliveryDone}};
    state.history.push(result);
    state.pendingNext=true;
    state.period='noite';
    if(state.cash < 0) state.finished=true;
    save();
    return result;
  }
  function markupIcon(name){
    const paths={
      grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
      chart:'<path d="M4 20V11m6 9V4m5 16v-7m5 7v-9"/>',
      help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4"/><path d="M12 17h.01"/>',
      volume:'<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9a5 5 0 0 1 0 6"/><path d="M19 6a9 9 0 0 1 0 12"/>',
      mute:'<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="m17 9 5 6m0-6-5 6"/>',
      rotate:'<path d="M3 12a9 9 0 1 0 3-6"/><path d="M3 4v5h5"/>',
      wallet:'<rect x="2" y="6" width="20" height="15" rx="3"/><path d="M2 9V6a3 3 0 0 1 3-3h13"/><path d="M17 13h5v5h-5a2.5 2.5 0 0 1 0-5"/>',
      cart:'<circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h2l3 13h13l2-9H5"/>',
      star:'<path d="m12 2 3 7 7 1-5.5 5 1.5 7-6-3.5L6 22l1.5-7L2 10l7-1z"/>',
      box:'<path d="m3 7 9-5 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5m-9 5v10"/>',
      play:'<path d="m8 5 12 7-12 7z"/>',
      arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
      info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
      check:'<path d="m4 12 5 5L20 6"/>',
      light:'<path d="M9 18h6m-5 3h4"/><path d="M12 3a7 7 0 0 0-4 12c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 0 0-4-12z"/>',
      close:'<path d="M5 5l14 14M19 5 5 19"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
      coin:'<circle cx="12" cy="12" r="9"/><path d="M12 6v12m3-9c-3-3-8-1-8 2s9 1 9 5-7 4-9 1"/>',
      people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3c0-4 12-4 12 0v3"/><path d="M18 11a3 3 0 0 0 0-6m0 11c2 0 4 1 4 4v1"/>',
      print:'<path d="M6 8V3h12v5M6 18H4a2 2 0 0 1-2-2v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>',
      flag:'<path d="M4 22V3m0 1c5-4 9 4 17 0v11c-8 4-12-4-17 0"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.info}</svg>`;
  }
  function i(name,cls='inline-icon'){return `<span class="${cls}" aria-hidden="true">${markupIcon(name)}</span>`}
  function illustration(index){
    if(PRODUCTS[index]?.custom){
      const cat=PRODUCTS[index].category;
      const color=PRODUCT_TYPES[cat]?.tint||'#a18bd8';
      const art=cat==='Bebida'?'<path d="M57 26h69l-8 70H66Z" fill="#ebd9f0"/><path d="M62 38h58l-6 51H71Z" fill="#85bad0"/><path d="M91 25V7h30" stroke="#f2e4ff" stroke-width="5" fill="none"/>':
       cat==='Salgado'?'<ellipse cx="91" cy="87" rx="64" ry="17" fill="#ebd0b2"/><path d="M50 80Q34 50 63 41Q91 16 120 43Q148 66 129 84Z" fill="#f2c77d" stroke="#b28051" stroke-width="4"/>':
       cat==='Doce'?'<path d="M53 63h78v35H53Z" fill="#eee1e7"/><path d="M53 63q11-29 24-13q15-38 31-9q23-7 23 22Z" fill="#e7a4c0"/><circle cx="87" cy="31" r="10" fill="#a94e75"/>':
       '<rect x="48" y="39" width="85" height="62" rx="11" fill="#dfd1f5"/><path d="M48 55l42 19 43-19" stroke="#a58cd0" stroke-width="5" fill="none"/><path d="M78 38V25q12-14 24 0v13" stroke="#dfd1f5" stroke-width="7" fill="none"/>';
      return `<svg viewBox="0 0 180 116" role="img" aria-label="Ilustração genérica de produto ${esc(cat)}"><ellipse cx="90" cy="105" rx="59" ry="8" fill="#17152c" opacity=".24"/><ellipse cx="90" cy="62" rx="70" ry="47" fill="${color}" opacity=".16"/>${art}</svg>`;
    }
    if(index===0) return `<svg viewBox="0 0 180 116" role="img" aria-label="Brownie de chocolate ilustrado"><ellipse cx="90" cy="100" rx="62" ry="9" fill="#1c1b26" opacity=".43"/><path d="M40 52l50-16 50 17-2 39-50 17-49-20z" fill="#4d2a2a"/><path d="M39 52 90 37l50 16-52 17z" fill="#a36f52"/><path d="m46 56 17 6 14-9 17 6 15-10 21 7" stroke="#4d302c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M88 70v38M139 53l-1 39" stroke="#281924" opacity=".5" stroke-width="3"/><circle cx="63" cy="50" r="5" fill="#4f2d31"/><circle cx="110" cy="54" r="5" fill="#4f2d31"/><circle cx="94" cy="44" r="4" fill="#4f2d31"/><path d="m39 88 49 20 50-16" stroke="#c78b6b" stroke-width="2" fill="none"/></svg>`;
    if(index===1) return `<svg viewBox="0 0 180 116" role="img" aria-label="Cookie ilustrado"><ellipse cx="89" cy="102" rx="63" ry="10" fill="#1a1b2b" opacity=".4"/><ellipse cx="87" cy="63" rx="56" ry="41" transform="rotate(-14 87 63)" fill="#a67b51"/><ellipse cx="86" cy="54" rx="56" ry="40" transform="rotate(-14 86 54)" fill="#e7bc84"/><path d="M37 65c14 30 69 41 102-2" fill="none" stroke="#bd8c59" stroke-width="3"/><g fill="#775039"><circle cx="52" cy="53" r="7"/><circle cx="92" cy="34" r="8"/><circle cx="110" cy="72" r="8"/><circle cx="74" cy="77" r="5"/><circle cx="125" cy="49" r="5"/><circle cx="67" cy="36" r="4"/><circle cx="91" cy="58" r="5"/></g></svg>`;
    if(index===3) return `<svg viewBox="0 0 180 116" role="img" aria-label="Bolo de pote ilustrado"><ellipse cx="89" cy="104" rx="48" ry="8" fill="#16172c" opacity=".25"/><path d="M60 32h60l-7 68H67Z" fill="#e0ccd8"/><path d="M63 46h54l-2 14H65Z" fill="#7f4a54"/><path d="M65 63h50l-2 15H67Z" fill="#eab4bb"/><path d="M67 80h46l-1 13H68Z" fill="#7f4a54"/><rect x="57" y="25" width="66" height="9" rx="4" fill="#bc8298"/><circle cx="88" cy="18" r="10" fill="#d75e73"/><path d="M88 14l5-11" stroke="#85a77f" stroke-width="4"/></svg>`;
    if(index===4) return `<svg viewBox="0 0 180 116" role="img" aria-label="Pão de queijo ilustrado"><ellipse cx="90" cy="104" rx="61" ry="7" fill="#191727" opacity=".3"/><ellipse cx="90" cy="85" rx="59" ry="13" fill="#e7d4b9"/><g fill="#e9b66e" stroke="#ab7847" stroke-width="2"><circle cx="60" cy="73" r="20"/><circle cx="90" cy="66" r="24"/><circle cx="122" cy="76" r="20"/></g><path d="M48 72q10-10 20 0m12-17q12-7 22 5m10 15q12-10 19 0" fill="none" stroke="#f9d896" stroke-width="4" stroke-linecap="round"/></svg>`;
    if(index===5) return `<svg viewBox="0 0 180 116" role="img" aria-label="Suco natural ilustrado"><ellipse cx="90" cy="106" rx="47" ry="7" fill="#171527" opacity=".25"/><path d="M64 30h53l-7 69H72Z" fill="#f5dfba" stroke="#ffead3" stroke-width="3"/><path d="M66 44h49l-6 50H73Z" fill="#f0a451"/><path d="M89 30V8l22-6" fill="none" stroke="#85d8bd" stroke-width="5"/><circle cx="121" cy="83" r="19" fill="#ed9c46" stroke="#ffe6af" stroke-width="6"/><path d="M121 65v35m-18-18h35" stroke="#ffda98" stroke-width="2"/></svg>`;
    if(index===6) return `<svg viewBox="0 0 180 116" role="img" aria-label="Fatia de torta ilustrada"><ellipse cx="91" cy="105" rx="65" ry="8" fill="#151529" opacity=".23"/><path d="M35 82L102 32l44 59-94 11Z" fill="#e4c79b" stroke="#a66e67" stroke-width="2"/><path d="M39 75l63-46 40 49-87 12Z" fill="#b75a72"/><path d="M43 70l59-46 40 48-88 11Z" fill="#f6dce7"/><circle cx="104" cy="38" r="10" fill="#d24765"/><circle cx="124" cy="61" r="8" fill="#d24765"/><circle cx="88" cy="57" r="7" fill="#d24765"/></svg>`;
    return `<svg viewBox="0 0 180 116" role="img" aria-label="Cappuccino ilustrado"><ellipse cx="89" cy="105" rx="63" ry="9" fill="#121724" opacity=".4"/><path d="M52 34h75l-8 59Q90 110 61 93z" fill="#f3e2d6"/><path d="M122 49h18c17 0 12 34-16 29" stroke="#eedad1" stroke-width="12" fill="none"/><ellipse cx="89" cy="35" rx="38" ry="13" fill="#fff3e8"/><ellipse cx="89" cy="35" rx="32" ry="9" fill="#a87c62"/><path d="M67 34c9-10 37-8 44 0-14 12-27 9-44 0z" fill="#ead0aa"/><path d="M74 23c-8-10 10-12 2-22m20 22c-8-10 10-12 2-22" stroke="#d9c9ea" stroke-width="3" stroke-linecap="round" opacity=".8" fill="none"/><path d="M58 92Q90 104 120 92" fill="none" stroke="#d5b9b5" stroke-width="3"/></svg>`;
  }
  function renderSide(){
    document.querySelectorAll('[data-icon]').forEach(node=>node.innerHTML=markupIcon(node.dataset.icon==='volume'&&!soundOn?'mute':node.dataset.icon));
    document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===currentPage));
    document.getElementById('shopBreadcrumb').textContent=state.name;
    document.querySelector('#soundToggle').setAttribute('aria-label',soundOn?'Desativar sons':'Ativar sons');
    zuniEl.textContent = !state.started?'Bem-vindo! Vou explicar o que cada decisão significa para o seu negócio.':
      state.finished?'Você concluiu o desafio! Confira o que aprendeu sobre custo, margem e demanda.':
      state.pendingNext?'Repare em como o lucro, as sobras e a reputação mudaram depois das suas decisões.':
      dayConfig().hint;
  }
  function toast(msg){clearTimeout(toastTimer);toastEl.textContent=msg;toastEl.classList.add('visible');toastTimer=setTimeout(()=>toastEl.classList.remove('visible'),3100)}
  function ensureMusic(){
    if(bgMusic) return bgMusic;
    bgMusic=document.getElementById('bgMusic');
    if(bgMusic){bgMusic.volume=.48;bgMusic.loop=true;}
    return bgMusic;
  }
  function syncMusic(){
    const music=ensureMusic();
    if(!music) return;
    if(!soundOn){music.pause(); return;}
    const attempt=music.play();
    if(attempt && typeof attempt.catch==='function') attempt.catch(()=>{});
  }
  function façadeName(){
    return String(state.name||'Ateliê Aurora').trim().toUpperCase().slice(0,24);
  }
  function facadeMetrics(){
    const txt=façadeName();
    const len=txt.length;
    const size=len<=12?27:len<=16?22:len<=20?18:15;
    const y=len<=16?49:46;
    return {txt,size,y};
  }
  function sound(type='tap'){
    if(!soundOn)return;
    try {
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx)return;
      audioContext=audioContext||new AudioCtx();
      if(audioContext.state==='suspended')audioContext.resume();
      const now=audioContext.currentTime;
      const osc=audioContext.createOscillator(),gain=audioContext.createGain();
      osc.connect(gain);gain.connect(audioContext.destination);
      const cfg={cash:['sine',480,690,.21,.032],win:['sine',480,740,.32,.042],step:['sine',154,208,.065,.009],tap:['triangle',340,420,.16,.023],bell:['sine',660,880,.48,.035],paper:['triangle',740,560,.12,.015],bird:['sine',1470,1900,.18,.013]};
      const [wave,startHz,endHz,duration,peak]=cfg[type]||cfg.tap;
      osc.type=wave;
      osc.frequency.setValueAtTime(startHz,now);
      osc.frequency.exponentialRampToValueAtTime(endHz,now+duration*.7);
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(peak,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
      osc.start(now);osc.stop(now+duration+.02);
    } catch {}
  }
  function heading(eyebrow,title,sub,tag=''){return `<header class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1 class="section-title">${title}</h1><p class="lead">${sub}</p></div>${tag?`<span class="pill">${tag}</span>`:''}</header>`}
  function getUnitTechnical(i){
    const totalUnits=Math.max(1,state.quantities.reduce((a,b)=>a+b,0));
    const allocated=fixedCost()/totalUnits;
    return (productCost(i)+allocated)/(1-SALES_FEES-.20);
  }
  function stats(){
    const f=forecast();
    const accumulated=state.history.reduce((s,h)=>s+h.profit,0);
    const cards=[
      {label:'Capital em caixa',value:shortMoney(state.cash),icon:'wallet',foot:'Disponível para operar'},
      {label:'Lucro acumulado',value:shortMoney(accumulated),icon:'trend',foot:`${state.history.length} dia(s) concluídos`,cls:accumulated>0?'is-positive':accumulated<0?'is-negative':''},
      {label:'Reputação local',value:`${Math.round(state.reputation)} / 100`,icon:'star',foot:'Confiança dos clientes'},
      {label:'Projeção de hoje',value:shortMoney(f.profit),icon:'chart',foot:`Dia ${state.day} · ciclo ${cycleNumber()}`,cls:f.profit>=0?'is-positive':'is-negative'}
    ];
    return `<section class="stat-grid" aria-label="Indicadores do negócio">${cards.map(c=>`<div class="stat-card"><div class="stat-top">${c.label}${i(c.icon,'icon-box')}</div><div class="stat-value ${c.cls||''}">${c.value}</div><div class="stat-foot">${c.foot}</div></div>`).join('')}</section>`;
  }
  function shopScene(){
    const d=dayConfig();
    return `<section class="shop-scene period-${state.period}" aria-label="Cenário interativo da confeitaria"><div class="scene-sky"><span class="scene-cloud cloud-a"></span><span class="scene-cloud cloud-b"></span><span class="scene-building bg-a"></span><span class="scene-building bg-b"></span><span class="scene-building bg-c"></span></div>
    <div class="scene-shop"><span class="shop-roof"></span><span class="shop-awning"></span><span class="shop-board" title="${esc(state.name)}">${esc(state.name.toUpperCase())}</span><span class="shop-window shop-window-left"><span>✦</span></span><span class="shop-window shop-window-right"><span>✦</span></span><span class="shop-entrance"></span><span class="shop-plants plants-a"></span><span class="shop-plants plants-b"></span></div>
    <div class="scene-ground"></div>
    <div class="scene-customer person-a"><span class="scene-head"></span><span class="scene-body"></span></div>
    <div class="scene-customer person-b"><span class="scene-head"></span><span class="scene-body"></span></div>
    <div class="scene-customer person-c"><span class="scene-head"></span><span class="scene-body"></span></div>
    <div class="scene-event"><span class="scene-event-label">DIA ${state.day} · ${d.category}</span><h2>${d.title}</h2><p>${d.description}</p><span class="scene-event-mission">${i('flag')} ${d.mission}</span></div>
    <div class="scene-actions"><button type="button" data-action="scene-market" title="Ver preços de referência">${i('trend')} Ver mercado</button><button type="button" data-action="scene-zuni" title="Ouvir a Zuni">${i('light')} Dica da Zuni</button></div></section>`;
  }
  function productCard(p,index){
    const f=forecast().lines.find(line=>line.productIndex===index), cost=productCost(index), price=state.prices[index], qty=state.quantities[index];
    const technical=getUnitTechnical(index);
    const contribution=price*(1-SALES_FEES)-cost;
    return `<article class="product-card"><div class="product-illustration ${p.id}">${illustration(index)}</div><h3 class="product-name">${p.name}</h3><div class="product-meta">${p.tagline}</div>
      <div class="product-market">${p.custom?'Preço inicial simulado':'Referência fictícia'} <strong>${money(p.market)}</strong></div>
      <label class="field-label" for="price-${index}">Preço de venda <span>por unidade</span></label>
      <div class="price-input-wrap"><span class="currency-prefix">R$</span><input id="price-${index}" aria-label="Preço de venda de ${p.name}" data-price="${index}" inputmode="decimal" type="number" step="0.10" min="1" max="100" value="${price.toFixed(2)}"></div>
      <div class="field-label">Produção do dia <span>unidades</span></div>
      <div class="stepper"><button type="button" data-action="qty" data-index="${index}" data-delta="-5" aria-label="Produzir menos ${p.name}">−</button><span id="qty-${index}">${qty} un.</span><button type="button" data-action="qty" data-index="${index}" data-delta="5" aria-label="Produzir mais ${p.name}">+</button></div>
      <div class="card-foot"><small>Custo: ${money(cost)} / un.<br>Preço técnico*: ${money(technical)}</small><strong class="${contribution<=0?'warn':''}">${money(contribution)} <small>/ margem unit.**</small></strong></div></article>`;
  }
  function policyPanel(){return `<div class="panel decision-panel"><h3>Estratégia do dia</h3><p class="panel-desc">Escolha uma ação para atrair clientes ou controlar gastos.</p>${POLICIES.map(p=>`<button type="button" class="choice ${state.policy===p.id?'selected':''}" data-action="policy" data-policy="${p.id}" aria-pressed="${state.policy===p.id}"><span class="choice-radio"></span><span><span class="choice-title">${p.name}</span><span class="choice-detail">${p.detail}</span></span></button>`).join('')}<p class="decision-note">A estratégia faz parte do seu planejamento financeiro; não existe opção sempre melhor.</p></div>`}
  function projectionPanel(){
    const f=forecast();
    const budget=businessCost(), pool=state.cash, pct=pool===0?100:clamp(budget/pool*100,0,100);
    return `<div class="panel projection-panel" id="projectionPanel"><h3>Planejamento financeiro</h3><p class="panel-desc">Estimativa antes de abrir a loja.</p>
      <div class="mini-projection"><span>Compra que falta + operação</span><strong>${money(budget)}</strong></div>
      <div class="mini-projection"><span>Consumo de insumos já estocados</span><strong>${money(totalMadeCost())}</strong></div><div class="mini-projection"><span>Receita estimada</span><strong>${money(f.revenue)}</strong></div>
      <div class="mini-projection"><span>Taxas sobre vendas (8%)</span><strong>${money(f.fees)}</strong></div>
      <div class="mini-projection"><span>Lucro previsto</span><strong class="${f.profit>=0?'is-positive':'is-negative'}">${money(f.profit)}</strong></div>
      <div class="mini-projection"><span>Estoque previsto para vender</span><strong>${f.sold}/${f.made}</strong></div>
      <div class="projection-meter"><span style="width:${pct.toFixed(1)}%;background:${budget>pool?'#ff8c9a':'linear-gradient(90deg,#7755e9,#b999ff)'}"></span></div>
      <div class="projection-fine">${budget>pool?`<span class="is-negative">Saldo insuficiente: faltam ${money(budget-pool)}.</span>`:`O plano compromete ${Math.round(pct)}% do caixa disponível.`}</div></div>`;
  }
  function pageManagement(){
    const d=dayConfig(), f=forecast(), budget=businessCost();
    root.innerHTML=`<div class="city-management-link"><span><b>BAIRRO ZUZ · ${completedMissions()}/3 atividades feitas hoje.</b> Escolhas no bairro já influenciam custos e procura.</span><button data-action="city-back">← Voltar ao bairro</button></div>`+
      heading(`${i('box')} EMPREENDEDORISMO NA PRÁTICA`,'Seu negócio, suas decisões','Gerencie sua empresa, ajuste preços, controle custos e acompanhe o impacto das suas escolhas.',`DIA ${state.day} · CICLO ${cycleNumber()}`)+stats()+shopScene()+`<div class="new-quickbar"><span>📦 Insumos em estoque: <b>${money(inventoryValue())}</b></span><span>🏪 ${storePageLabel()}</span><span>👥 ${state.employees.length} funcionário(s)</span><button class="btn btn-secondary" data-action="goto-stock">Gerenciar insumos →</button></div>`+
      `<div class="section-heading"><h2>Cardápio e produção</h2><span class="section-sub">${activeIndexes().length} produto(s) disponíveis · <button class="exp-inline-link" data-action="goto-expansion">Cadastrar ou expandir produtos →</button></span></div>
      <div class="content-columns"><div class="product-grid">${PRODUCTS.map((p,i)=>isUnlocked(p.id)?productCard(p,i):'').join('')}</div><div class="aside-panels">${policyPanel()}${projectionPanel()}</div></div>
      <div class="main-actionbar"><div class="action-copy"><strong>${i('clock')} Pronto para abrir?</strong><span>${budget>state.cash?`Seu plano custa ${money(budget-state.cash)} acima do caixa. Reduza a produção.`:`${f.made} unidades planejadas · ${money(budget)} de custos e despesas estimados.`}</span></div><div class="action-buttons"><button type="button" class="btn btn-secondary" data-action="quick-restock">📦 Repor insumos</button><button type="button" class="btn btn-secondary" data-action="scenarios">${i('chart')} Comparar cenários</button><button type="button" class="btn btn-primary" data-action="challenge" ${budget>state.cash?'disabled title="Orçamento insuficiente"':''}>${i('play')} Abrir a loja ${i('arrow')}</button></div></div>
      <p class="game-disclaimer">*Preço técnico ilustrativo: custo direto + rateio fixo, taxas e margem de 20%. **Margem unitária exibida antes do rateio de custos fixos. Custos e preços do mercado são fictícios.</p>`;
  }

  function growthProgress(current,target){const value=Math.min(target,Math.max(0,current));return `<span class="growth-track"><span style="width:${Math.round(value/target*100)}%"></span></span>`}
  function pageExpansion(){
    const owned=activeIndexes().length;
    const earned=state.history.reduce((a,r)=>a+r.revenue,0);
    const positive=state.history.filter(r=>r.profit>0).length;
    const goals=[
      {name:'Primeira expansão',desc:'Tenha 4 produtos no cardápio',cur:owned,target:4},
      {name:'Gestão consistente',desc:'Conclua 3 dias com lucro positivo',cur:positive,target:3},
      {name:'Marca reconhecida',desc:'Alcance reputação 75',cur:state.reputation,target:75},
      {name:'Vendas em evolução',desc:'Fature R$ 3.000 ao longo da jornada',cur:earned,target:3000}
    ];
    root.innerHTML=heading(`${i('box')} CRESCIMENTO DA EMPRESA`,'Expansão do negócio','Cadastre os produtos que quiser vender, ajuste preços e custos ou invista em melhorias para a loja.','INVESTIMENTOS')+
      `<section class="exp-overview"><div class="exp-overview-icon">${i('trend')}</div><div class="exp-overview-info"><span>SEU PRÓXIMO PASSO</span><h2>Faça o negócio crescer com planejamento.</h2><p>Investimentos são descontados do caixa imediatamente. Reserve capital para produzir e pagar as despesas da loja.</p></div><div class="exp-capital"><span>Caixa disponível</span><strong>${shortMoney(state.cash)}</strong><small>${owned} produtos ativos · ${state.customProducts.length} cadastrados</small></div></section>
      <section class="exp-metrics"><div><span>Produtos ativos</span><b>${owned}</b></div><div><span>Melhorias instaladas</span><b>${state.upgrades.length}<small> / ${UPGRADES.length}</small></b></div><div><span>Capital investido</span><b>${shortMoney(investmentTotal())}</b></div><div><span>Lucro acumulado</span><b>${shortMoney(state.history.reduce((sum,h)=>sum+h.profit,0))}</b></div></section>
      <section class="custom-create-section" id="customCreateSection"><div class="custom-create-head"><div><span class="custom-kicker">CRIE SEUS PRÓPRIOS PRODUTOS</span><h2 id="customFormTitle">Cadastrar novo produto</h2><p>Você escolhe o que vender. O item aparece na loja, nas vendas, na precificação e nos resultados.</p></div><span class="custom-counter">${state.customProducts.length} / ${MAX_CUSTOM_PRODUCTS} cadastrados</span></div>
      <form id="customProductForm" class="custom-product-form"><input type="hidden" name="editing" value=""><label>Nome do produto<input name="name" type="text" maxlength="40" minlength="2" required placeholder="Ex.: Brigadeiro gourmet" ${!editableDay()?'disabled':''}></label><label>Categoria<select name="category" required ${!editableDay()?'disabled':''}><option value="Doce">Doce</option><option value="Salgado">Salgado</option><option value="Bebida">Bebida</option><option value="Outro">Outro</option></select></label><label>Custo por unidade (R$)<input name="cost" type="number" min="0.10" max="100" step="0.01" placeholder="Ex.: 3,50" required ${!editableDay()?'disabled':''}></label><label>Preço de venda (R$)<input name="price" type="number" min="1" max="100" step="0.01" placeholder="Ex.: 8,90" required ${!editableDay()?'disabled':''}></label><label>Produção por dia<input name="qty" type="number" min="0" max="120" step="1" value="10" required ${!editableDay()?'disabled':''}></label><div class="custom-form-actions"><button class="btn btn-primary" id="customSubmit" type="submit" ${!editableDay()?'disabled':''}>+ Adicionar à loja</button><button class="btn btn-secondary" id="cancelCustomEdit" data-action="cancel-custom-edit" type="button" hidden>Cancelar edição</button></div></form><p id="customProductFeedback" class="custom-feedback">${editableDay()?'O cadastro não tem taxa de desbloqueio. O custo de produção será cobrado ao abrir a loja.':'O dia está encerrado. Avance para o próximo dia para editar o cardápio.'}</p></section>
      <div class="exp-heading"><div><span>SEUS PRODUTOS</span><h2>Produtos que você criou</h2><p>Edite os dados ou retire um produto da loja sem perder as vendas antigas.</p></div><button type="button" class="btn btn-secondary" data-action="goto-game">Ver cardápio ${i('arrow')}</button></div>
      <section class="custom-product-list">${state.customProducts.length?state.customProducts.map(p=>{const idx=PRODUCTS.findIndex(t=>t.id===p.id);return `<article class="custom-product-entry ${p.archived?'is-archived':''}"><div class="custom-product-thumbnail">${illustration(idx)}</div><div class="custom-product-detail"><span>${esc(p.category)} · ${p.archived?'FORA DO CARDÁPIO':'NA LOJA'}</span><h3>${esc(p.name)}</h3><p>Custo ${money(p.baseCost)} · Preço ${money(state.prices[idx])} · Produção ${state.quantities[idx]} un.</p></div><div class="custom-product-buttons"><button class="btn btn-secondary" data-action="edit-custom-product" data-id="${p.id}" ${!editableDay()?'disabled':''}>Editar</button><button class="btn btn-secondary" data-action="archive-custom-product" data-id="${p.id}" ${!editableDay()?'disabled':''}>${p.archived?'Colocar na loja':'Retirar da loja'}</button></div></article>`}).join(''):`<div class="custom-empty">Ainda não há produtos personalizados. Cadastre o primeiro acima para vê-lo na sua loja.</div>`}</section>
      <div class="exp-heading"><div><span>OUTRAS OPÇÕES</span><h2>Produtos prontos para desbloquear</h2><p>Esses quatro produtos continuam opcionais e custam parte do caixa.</p></div></div>
      <section class="exp-catalog">${PRODUCTS.map((p,idx)=>p.unlockCost?`<article class="exp-product ${isUnlocked(p.id)?'exp-owned':''}"><div class="exp-product-art" style="--tint:${p.tint}">${illustration(idx)}</div><div class="exp-product-head"><span class="exp-type">${p.tagline}</span><span class="exp-status">${isUnlocked(p.id)?'DISPONÍVEL':'BLOQUEADO'}</span></div><h3>${p.name}</h3><p>${p.desc}</p><div class="exp-product-numbers"><div><span>Custo de produção</span><b>${money(p.baseCost)} / un.</b></div><div><span>Preço inicial</span><b>${money(p.defaultPrice)}</b></div></div><button type="button" class="btn ${isUnlocked(p.id)?'btn-secondary':'btn-primary'} exp-buy" data-action="${isUnlocked(p.id)?'goto-game':'expand-product'}" data-id="${p.id}" ${state.finished?'disabled':''}>${isUnlocked(p.id)?`${i('check')} Ver no cardápio`:`${i('box')} Desbloquear por ${money(p.unlockCost)}`}</button></article>`:'').join('')}</section>
      <div class="exp-heading"><div><span>INVESTIR NA ESTRUTURA</span><h2>Melhorias permanentes</h2><p>Benefícios válidos para os próximos dias da simulação.</p></div></div>
      <section class="exp-upgrades">${UPGRADES.map((u,idx)=>`<article class="exp-upgrade ${ownedUpgrade(u.id)?'exp-owned':''}"><div class="exp-upgrade-icon">${i(['star','box','people'][idx])}</div><div class="exp-upgrade-desc"><span>${u.tag}</span><h3>${u.name}</h3><p>${u.desc}</p><b>${u.effect}</b></div><button type="button" class="btn ${ownedUpgrade(u.id)?'btn-secondary':'btn-primary'}" data-action="expand-upgrade" data-id="${u.id}" ${ownedUpgrade(u.id)||state.finished?'disabled':''}>${ownedUpgrade(u.id)?'✓ Adquirida':money(u.cost)}</button></article>`).join('')}</section>
      <div class="exp-heading"><div><span>OBJETIVOS DO EMPREENDEDOR</span><h2>Metas de crescimento</h2><p>Indicadores para acompanhar a evolução da sua empresa.</p></div></div>
      <section class="exp-goals">${goals.map(g=>`<article class="exp-goal"><div class="exp-goal-top"><strong>${g.name}</strong><span>${g.cur>=g.target?'CONCLUÍDA':`${Math.floor(Math.min(g.cur,g.target))} / ${g.target}`}</span></div><p>${g.desc}</p>${growthProgress(g.cur,g.target)}</article>`).join('')}</section><p class="exp-disclaimer">Os preços, investimentos e efeitos são parâmetros fictícios para ensinar gestão e precificação no TCC. As melhorias não garantem vendas ou lucro.</p>`;
  }
  function confirmInvestment(type,id){
    const item=type==='product'?PRODUCTS.find(p=>p.id===id&&p.unlockCost):UPGRADES.find(u=>u.id===id);
    if(!item || (type==='product'?isUnlocked(id):ownedUpgrade(id)))return;
    const price=type==='product'?item.unlockCost:item.cost;
    showOverlay(`<div class="exp-confirm"><button type="button" class="dialog-close" data-action="close" aria-label="Fechar">${i('close')}</button><div class="eyebrow">PLANEJAMENTO DE EXPANSÃO</div><h2>Confirmar investimento?</h2><p>${type==='product'?`O produto <strong>${item.name}</strong> entrará no cardápio, na projeção de vendas e nos resultados financeiros.`:`A melhoria <strong>${item.name}</strong> terá efeito permanente nos próximos dias.`}</p><div class="exp-confirm-lines"><div><span>Investimento</span><strong>${money(price)}</strong></div><div><span>Caixa atual</span><strong>${money(state.cash)}</strong></div><div><span>Saldo após compra</span><strong class="${state.cash-price<0?'is-negative':''}">${money(state.cash-price)}</strong></div></div><p class="exp-confirm-tip">Este valor sai do caixa, mas não será registrado como despesa de produção no lucro diário. Garanta recursos para operar!</p><div class="exp-confirm-actions"><button class="btn btn-secondary" data-action="close">Cancelar</button><button class="btn btn-primary" data-action="confirm-investment" data-type="${type}" data-id="${id}" ${state.cash<price?'disabled':''}>${state.cash<price?'Caixa insuficiente':'Confirmar compra'}</button></div></div>`);
  }
  function purchaseInvestment(type,id){
    if(!state.started || state.finished)return;
    const item=type==='product'?PRODUCTS.find(p=>p.id===id&&p.unlockCost):UPGRADES.find(u=>u.id===id);
    if(!item || (type==='product'?isUnlocked(id):ownedUpgrade(id)))return;
    const cost=type==='product'?item.unlockCost:item.cost;
    if(!Number.isFinite(cost)||state.cash+0.00001<cost){toast('Saldo insuficiente para este investimento.');return;}
    state.cash=Math.round((state.cash-cost)*100)/100;
    if(type==='product'){
      state.unlocked.push(id);
      const idx=PRODUCTS.findIndex(p=>p.id===id);
      state.prices[idx]=item.defaultPrice;
      state.quantities[idx]=state.pendingNext?0:item.defaultQty;
    }else state.upgrades.push(id);
    state.investments.push({day:state.day,type,id,name:item.name,cost});
    save();hideOverlay();render();sound('cash');toast(`${item.name} adquirido! Veja o efeito no planejamento.`);
  }
  function pageStock(){
    const items=shortages(),need=items.reduce((a,x)=>a+x.missing,0),balance=inventoryValue();
    root.innerHTML=heading(`${i('box')} RECURSOS DA PRODUÇÃO`,'Estoque de ingredientes','Compre insumos, acompanhe as necessidades do cardápio e evite ficar sem materiais para abrir a loja.',`DIA ${state.day}`)+
      `<div class="feature-kpis"><article><small>Valor estocado</small><strong>${money(balance)}</strong><p>Insumos já pagos; capital em estoque</p></article><article><small>Falta para o plano</small><strong class="${need>0?'is-negative':'is-positive'}">${money(need)}</strong><p>Repor antes de produzir</p></article><article><small>Caixa disponível</small><strong>${money(state.cash)}</strong><p>Para reposição e despesas operacionais</p></article></div>
      <div class="stock-info"><b>Como funciona:</b> cada insumo é medido em <strong>porções de custo (R$ 1,00 por porção)</strong>. As receitas usam combinações diferentes conforme o produto. A compra sai do caixa agora; o consumo entra no custo de produção ao vender, sem cobrar o mesmo insumo duas vezes.</div>
      <div class="feature-grid stock-grid">${items.map(x=>`<article class="feature-card"><div class="feature-icon">${x.emoji}</div><h3>${x.name}</h3><div class="stock-big">${dec(x.have)} <small>porções em estoque</small></div><div class="stock-line"><span>Exigido pelo plano</span><b>${dec(x.need)}</b></div><div class="stock-line"><span>Faltante</span><b class="${x.missing>.02?'is-negative':'is-positive'}">${dec(x.missing)}</b></div><div class="stock-buttons">${[25,50].map(q=>`<button class="btn btn-secondary" data-action="buy-ingredient" data-id="${x.id}" data-amount="${q}" ${!editableDay()||state.cash<q?'disabled':''}>+${q} · ${money(q)}</button>`).join('')}</div></article>`).join('')}</div>
      <div class="feature-bottom"><div><h3>Repor somente o necessário</h3><p>Compra exatamente o que falta no plano de hoje. Se alterar a produção, calcule novamente.</p></div><button class="btn btn-primary" data-action="quick-restock" ${!editableDay()||need<.01||need>state.cash?'disabled':''}>Repor plano · ${money(need)} ${i('arrow')}</button></div>`;
  }

  function pageStaff(){
    root.innerHTML=heading(`${i('people')} EQUIPE DO NEGÓCIO`,'Funcionários','Contrate ou dispense colaboradores. Os salários são descontados ao final de cada dia trabalhado.',`DIA ${state.day}`)+
      `<div class="feature-kpis"><article><small>Equipe contratada</small><strong>${state.employees.length}</strong><p>Colaboradores ativos</p></article><article><small>Folha salarial diária</small><strong>${money(salaryCost())}</strong><p>Incluída nas despesas fixas</p></article><article><small>Despesas fixas totais</small><strong>${money(fixedCost())}</strong><p>Incluem salários e unidades</p></article></div>
      <div class="feature-grid">${STAFF.map(person=>`<article class="feature-card staff-card"><div class="feature-icon">${person.emoji}</div><span class="small-label">${staffOwned(person.id)?'NA EQUIPE':'DISPONÍVEL'}</span><h3>${person.name}</h3><p>${person.desc}</p><div class="stock-line"><span>Salário por dia</span><b>${money(person.salary)}</b></div><button class="btn ${staffOwned(person.id)?'btn-secondary':'btn-primary'}" data-action="toggle-staff" data-id="${person.id}" ${!editableDay()?'disabled':''}>${staffOwned(person.id)?'Dispensar':'Contratar'} ${i('arrow')}</button></article>`).join('')}</div><div class="stock-info">Funcionários alteram a demanda, o aproveitamento de ingredientes e a reputação. Mais funcionários nem sempre significam maior lucro: compare o ganho com os salários.</div>`;
  }

  function pageBranches(){
    const branchCost=1650;
    const f=forecast();
    root.innerHTML=heading(`${i('box')} REDE DE LOJAS`,'Unidades do negócio','Expanda o alcance da sua marca para outro bairro e acompanhe o custo de manter duas lojas.',`DIA ${state.day}`)+
      `<div class="feature-kpis"><article><small>Unidades abertas</small><strong>${state.secondUnit?'2':'1'}</strong><p>Operação compartilhada</p></article><article><small>Demanda adicional</small><strong>${state.secondUnit?'+46%':'—'}</strong><p>Projeção do público local</p></article><article><small>Aluguel extra diário</small><strong>${money(branchRent())}</strong><p>Considerado no balanço</p></article></div>
      <div class="feature-grid branches-grid"><article class="feature-card"><div class="branch-picture">🏪</div><span class="small-label">UNIDADE 01 • ATIVA</span><h3>${esc(state.name)}</h3><p>Loja principal do bairro empreendedor, com o cardápio e os fornecedores já cadastrados.</p><div class="stock-line"><span>Receita projetada*</span><strong>${money(f.revenue/(state.secondUnit?1.46:1))}</strong></div><span class="pill">EM OPERAÇÃO</span></article>
      <article class="feature-card"><div class="branch-picture">🏬</div><span class="small-label">UNIDADE 02 • ${state.secondUnit?'ABERTA':'PLANEJADA'}</span><h3>${esc(state.name)} · Centro</h3><p>Nova unidade com maior alcance e aluguel diário de ${money(105)}. Compartilha preços, cardápio, equipe e estoque da rede.</p><div class="stock-line"><span>Receita projetada*</span><strong>${state.secondUnit?money(f.revenue-f.revenue/1.46):'—'}</strong></div><button class="btn ${state.secondUnit?'btn-secondary':'btn-primary'}" data-action="buy-branch" ${state.secondUnit||!editableDay()||state.cash<branchCost?'disabled':''}>${state.secondUnit?'Unidade inaugurada':`Inaugurar · ${money(branchCost)}`} ${i('arrow')}</button></article></div>
      <div class="stock-info">*Receitas estimadas, divididas para ilustrar a contribuição das unidades. A expansão acrescenta demanda e custos fixos, mas não garante vendas. A produção e o estoque são gerenciados em conjunto nesta versão.</div>`;
  }

  function pageInterior(){
    const period=state.period,products=activeIndexes().slice(0,6),f=forecast();
    root.innerHTML=heading(`${i('box')} LOJA INTERATIVA`,'Dentro da loja','Organize a operação, confira sua vitrine e escolha o horário de maior movimento antes de abrir.',`DIA ${state.day} · ${periodLabel().toUpperCase()}`)+
      `<div class="period-select">${[['manha','🌅 Manhã'],['tarde','🌇 Tarde'],['noite','🌙 Noite']].map(([id,t])=>`<button class="${period===id?'active':''}" data-action="set-period" data-period="${id}" ${!editableDay()?'disabled':''}>${t}</button>`).join('')}</div>
      <section class="interior-stage period-${period}"><div class="interior-ceiling"><span>★</span><strong>${esc(state.name.toUpperCase())}</strong><span>★</span></div><div class="interior-window"><span>${period==='noite'?'🌙':period==='manha'?'☀️':'🌇'}</span></div><div class="interior-shelf">${products.map(i=>`<button data-action="inspect-product" data-id="${i}" title="${esc(PRODUCTS[i].name)}"><span class="interior-product-emoji">${PRODUCTS[i].category==='Bebida'||PRODUCTS[i].id==='coffee'?'☕':PRODUCTS[i].category==='Salgado'?'🥐':'🍰'}</span><small>${esc(PRODUCTS[i].name)}</small></button>`).join('')||'<span>Adicione produtos ao cardápio!</span>'}</div><div class="interior-counter"><div class="interior-register">▣</div><span>BALCÃO DE ATENDIMENTO</span></div><div class="interior-worker">${staffOwned('atendente')?'🧑‍💼':'🧾'}</div><div class="interior-floor"></div></section>
      <div class="feature-grid interior-actions"><article class="feature-card"><h3>📦 Conferir estoque</h3><p>O estoque compartilhado precisa cobrir todos os produtos que serão fabricados.</p><button class="btn btn-secondary" data-action="goto-stock">Ver ingredientes →</button></article><article class="feature-card"><h3>👥 Organizar a equipe</h3><p>Atendentes, cozinheiros e gerentes ajudam a melhorar a operação.</p><button class="btn btn-secondary" data-action="goto-staff">Ver funcionários →</button></article><article class="feature-card"><h3>💰 Abrir a loja</h3><p>Lucro estimado para o período ${periodLabel().toLowerCase()}: <b>${money(f.profit)}</b>.</p><button class="btn btn-primary" data-action="goto-game">Planejar vendas →</button></article></div>`;
  }

  function pageEvents(){
    const e=todayEvent(),m=missionInfo(),latest=state.history.at(-1);
    root.innerHTML=heading(`${i('info')} NOTÍCIAS E DESAFIOS`,'Eventos e missões','Cada dia apresenta um contexto de mercado e uma meta de vendas que pode melhorar a reputação.',`CICLO ${cycleNumber()}`)+
      `<section class="event-hero"><span class="small-label">${e.kind.toUpperCase()} · DIA ${state.day}</span><h2>${e.title}</h2><p>${e.text}</p><div class="event-metric">Demanda do evento: <b>${e.demand>1?'+':''}${Math.round((e.demand-1)*100)}%</b></div></section><div class="feature-grid"><article class="feature-card"><span class="small-label">MISSÃO DO DIA</span><h3>🎯 Bater a meta de vendas</h3><p>${m.description}</p><div class="stock-line"><span>Meta</span><b>${m.goal} vendas</b></div><div class="stock-line"><span>Projeção atual</span><b>${forecast().sold} vendas</b></div><button class="btn btn-secondary" data-action="goto-game">Preparar operação →</button></article><article class="feature-card"><span class="small-label">HISTÓRICO DE MISSÕES</span><h3>🏆 Progresso da empresa</h3><p>Metas bem executadas melhoram a reputação com a comunidade.</p><div class="stock-line"><span>Metas concluídas</span><b>${state.missionWins}</b></div><div class="stock-line"><span>Último dia</span><b>${latest?(latest.missionComplete?'Concluída':'Não concluída'):'Sem registro'}</b></div><button class="btn btn-secondary" data-action="report">Ver balanços →</button></article></div>`;
  }

  function pageSales(){
    const cp=cityProgress(), ended=state.pendingNext||state.finished;
    const forecastNow=forecast();
    const history=state.history;
    const latest=history.length?history[history.length-1]:null;
    const soldAll=history.reduce((sum,r)=>sum+r.sold,0);
    const turnover=history.reduce((sum,r)=>sum+r.revenue,0);
    const customerDone=cp.deliveryDone;
    const order=todayOrder();
    const available=state.quantities[order]>0;
    const salesRows=PRODUCTS.map((p,k)=>{
      if(!isUnlocked(p.id))return '';
      const f=forecastNow.lines.find(line=>line.productIndex===k);
      const width=Math.round(100*f.sold/Math.max(1,f.made));
      return `<div class="sales-product-row"><div class="sales-product-icon">${illustration(k)}</div><div class="sales-product-main"><strong>${p.name}</strong><span>${f.sold} venda(s) previstas de ${f.made} produzidas</span><div class="sales-meter"><span style="width:${width}%"></span></div></div><div class="sales-product-amount">${money(f.revenue)}<small>receita estimada</small></div></div>`;
    }).join('');
    const orderPhase=ended?`<div class="sales-finished"><div class="sales-state-symbol">${i('clock')}</div><h3>Atendimento encerrado hoje</h3><p>O movimento deste dia já foi calculado. Confira os resultados ou avance para receber uma nova fila de clientes.</p><button class="btn btn-secondary" data-action="report">Ver resultados ${i('arrow')}</button></div>`:
      customerDone?`<div class="sales-finished is-success"><div class="sales-state-symbol">${i('check')}</div><h3>Fila atendida!</h3><p>Você preparou os 3 pedidos. A procura prevista aumentou em <b>10%</b> para o dia atual, sem descontar dinheiro antes das vendas.</p><button class="btn btn-primary" data-action="goto-game">Planejar abertura ${i('arrow')}</button></div>`:
      `<div class="sales-serving"><div class="sales-order-ticket"><span class="sales-ticket-label">PEDIDO ${cp.deliveryStep+1} / 3 · BALCÃO</span><div class="sales-customer-row"><div class="sales-customer-character">${humanSvg(['#d7a7eb','#a0cabe','#edc38a'][cp.deliveryStep],['#e4aa89','#b87f6b','#e9c2a2'][cp.deliveryStep], '#39304b')}</div><div><span>CLIENTE ${cp.deliveryStep+1}</span><h3>“Quero ${PRODUCTS[order].name.toLowerCase()}, por favor!”</h3><p>Escolha o produto correto e registre o pedido.</p></div></div></div><div class="sales-order-choices">${PRODUCTS.map((p,k)=>!isUnlocked(p.id)?'':`<button type="button" class="sales-item-choice" data-action="serve-customer" data-index="${k}"><span class="sales-item-visual">${illustration(k)}</span><strong>${p.name}</strong><span>${money(state.prices[k])}</span></button>`).join('')}</div><div class="sales-queue-bottom"><div class="sales-queue-progress">${[0,1,2].map(k=>`<span class="${k<cp.deliveryStep?'complete':''}"></span>`).join('')}</div><span>${cp.deliveryStep} de 3 atendidos</span></div><div class="sales-feedback" id="salesFeedback" role="status" aria-live="polite">${!available?'Atenção: ajuste a produção desse item em Meu negócio para incluir estoque no planejamento.':''}</div></div>`;
    root.innerHTML=heading(`${i('people')} COMÉRCIO EM MOVIMENTO`,'Vendas e clientes','Prepare pedidos, conheça sua clientela e acompanhe como preços e produção afetam a demanda.',`DIA ${state.day}`)+
      `<section class="sales-kpis"><div><span>Clientes atendidos hoje</span><b>${cp.deliveryStep}<small> / 3</small></b><p>Atendimento interativo</p></div><div><span>Demanda prevista</span><b>${forecastNow.sold}<small> un.</small></b><p>Limitada ao estoque</p></div><div><span>Receita estimada hoje</span><b>${shortMoney(forecastNow.revenue)}</b><p>Antes das taxas e custos</p></div><div><span>Vendas realizadas</span><b>${soldAll}<small> un.</small></b><p>${history.length} dia(s) fechados</p></div></section>
      <section class="client-profile"><div class="client-face">${customerType().emoji}</div><div><span class="small-label">CLIENTELA DO DIA · ${customerType().kind.toUpperCase()}</span><h3>${customerType().name}</h3><p>${customerType().summary} “${customerType().quote}”</p></div></section><section class="sales-layout"><div class="sales-counter"><div class="sales-section-label"><span>${i('people')} ATENDIMENTO SIMULADO</span><span class="sales-mini-pill">${ended?'DIA ENCERRADO':customerDone?'CONCLUÍDO':'FILA ATIVA'}</span></div><h2>Pedidos no balcão</h2><p class="sales-panel-desc">Acertar os três pedidos melhora a confiança e aumenta a <b>procura estimada em 10%</b> no dia. As vendas de verdade são contabilizadas ao abrir a loja.</p>${orderPhase}</div>
      <aside class="sales-side"><div class="sales-side-box"><div class="sales-section-label">${i('chart')} PROJEÇÃO DE DEMANDA</div><h3>O que os clientes procuram?</h3>${salesRows}<p class="sales-legal">Previsões fictícias, recalculadas conforme preço, produção, reputação e escolhas do dia.</p></div><div class="sales-side-box sales-summary"><div class="sales-section-label">${i('wallet')} VENDAS FECHADAS</div><h3>${latest?'Último balanço: dia '+latest.day:'Aguardando primeira abertura'}</h3><div class="sales-summary-row"><span>Receita total já registrada</span><b>${money(turnover)}</b></div><div class="sales-summary-row"><span>Último dia: unidades vendidas</span><b>${latest?latest.sold:0}</b></div><div class="sales-summary-row"><span>Último dia: lucro</span><b class="${latest&&latest.profit<0?'is-negative':'is-positive'}">${money(latest?.profit||0)}</b></div><button class="btn btn-secondary" data-action="report">Abrir histórico ${i('arrow')}</button></div></aside></section>`;
  }

  function pageMarket(){
    root.innerHTML=heading(`${i('trend')} ESTUDO DE MERCADO`,'Conheça o mercado','Uma boa decisão combina o custo real, o público e referências externas. Os valores abaixo são fictícios e criados para a simulação.','BASE SIMULADA')+
    `<div class="market-grid">${PRODUCTS.map((p,k)=>p.custom&&p.archived?'':`<article class="market-card"><div class="market-card-top"><span class="market-chip">${p.custom?'VALOR INICIAL SIMULADO':isUnlocked(p.id)?'REFERÊNCIA SIMULADA':'PRODUTO A DESBLOQUEAR'}</span>${i('trend')}</div><h3>${p.name}</h3><div class="market-price">${money(p.market)}</div><div class="market-foot"><span>Custo direto hoje</span><b>${money(productCost(k))}</b></div><div class="market-foot"><span>Seu preço atual</span><b>${money(state.prices[k])}</b></div><div class="market-foot"><span>Diferença de mercado</span><b class="${state.prices[k]>p.market?'is-negative':'is-positive'}">${money(state.prices[k]-p.market)}</b></div><button class="btn btn-secondary market-action" data-action="${isUnlocked(p.id)?'use-market':'goto-expansion'}" ${isUnlocked(p.id)?`data-index="${k}"`:''}>${p.custom?'Usar valor inicial':isUnlocked(p.id)?'Usar referência no cardápio':'Desbloquear na expansão'}</button></article>`).join('')}</div>
    <div class="info-note">${i('info')}<div><strong>Transparência dos dados</strong><p>Nesta demonstração, os preços são dados fictícios de treinamento. A plataforma ZUZ real prevê pesquisa com fontes identificadas, mas uma referência sem cotação verificável não deve ser tratada como preço real de varejo.</p></div></div>
    <section class="market-method panel"><h3>Como chegar a um preço justo?</h3><div class="method-grid"><div class="method-step"><div class="method-number">01</div><h4>Encontre o custo total</h4><p>Considere ingredientes, materiais, despesas fixas e quantidade produzida.</p></div><div class="method-step"><div class="method-number">02</div><h4>Calcule a margem</h4><p>Subtraia taxas de venda e custos para entender o resultado de cada unidade.</p></div><div class="method-step"><div class="method-number">03</div><h4>Compare com a demanda</h4><p>Teste cenários de preço sem assumir que vender mais sempre significa lucrar mais.</p></div></div></section>`;
  }
  function pageNews(){
    const newsItems = [
      {tag:'Bairro', title:'Movimento local aquecido', text:`No dia ${state.day}, a circulação no bairro está ${state.day%2===0?'mais cautelosa':'mais aquecida'}. Negócios com boa reputação tendem a converter melhor.`},
      {tag:'Insumos', title:'Mercado de ingredientes', text:`Os custos de hoje favorecem ${productCost(1)<=productCost(0)?'itens de ticket médio menor':'produtos com maior valor agregado'}. Compare custo unitário, taxa e margem.`},
      {tag:'Gestão', title:'Dica da Zuni', text:`Seu lucro acumulado está em ${shortMoney(state.history.reduce((s,h)=>s+h.profit,0))}. Revise produção e preços antes de abrir a loja.`},
      {tag:'Cenário', title:'Ciclo da simulação', text:`Você está no ciclo ${cycleNumber()} da campanha. Após o sétimo cenário, os contextos se repetem com o histórico do seu negócio preservado.`}
    ];
    root.innerHTML=heading(`${i('info')} PAINEL INFORMATIVO`,'Notícias do bairro','Acompanhe notícias simuladas que ajudam a interpretar o momento do mercado e contextualizam suas decisões.','NOTÍCIAS SIMULADAS')+
    `<section class="news-grid">${newsItems.map((n,idx)=>`<article class="news-card"><div class="news-chip">${n.tag}</div><h3>${n.title}</h3><p>${n.text}</p><div class="news-footer"><span>Edição ${idx+1}</span><button class="btn btn-secondary" data-action="go-market">${i('trend')} Ver mercado</button></div></article>`).join('')}</section>
    <section class="panel"><h3>Como usar esta página</h3><p>As notícias são narrativas fictícias para apoiar a apresentação do TCC. Elas ajudam a explicar para a banca por que um dia pode ter maior procura, custos diferentes ou uma mudança de estratégia.</p></section>`;
  }
  function pageHistory(){
    const items=state.history;
    const sum=k=>items.reduce((t,r)=>t+r[k],0);
    const revenue=sum('revenue'),profit=sum('profit'),sold=sum('sold'),waste=sum('remaining');
    const max=Math.max(60,...items.map(r=>Math.abs(r.profit)));
    root.innerHTML=heading(`${i('chart')} INDICADORES DO NEGÓCIO`,'Resultados da jornada','Acompanhe todos os dias concluídos e identifique como suas decisões alteraram lucro, estoque e reputação.',`${items.length} DIAS REGISTRADOS`)+
    `<section class="history-grid"><div class="history-box"><span>Receita total</span><div class="large">${money(revenue)}</div></div><div class="history-box"><span>Lucro líquido acumulado</span><div class="large ${profit>=0?'is-positive':'is-negative'}">${money(profit)}</div></div><div class="history-box"><span>Unidades vendidas</span><div class="large">${sold}</div></div><div class="history-box"><span>Unidades não vendidas</span><div class="large">${waste}</div></div></section>
    <section class="history-chart"><h3>Evolução do lucro por dia (últimos 20)</h3>${items.length?`<div class="chart-area">${items.slice(-20).map(r=>`<div class="chart-column"><span class="bar-value">${shortMoney(r.profit)}</span><div class="chart-bar ${r.profit<0?'negative':''}" style="height:${Math.max(4,Math.round(Math.abs(r.profit)/max*145))}px"></div><span class="chart-label">Dia ${r.day}</span></div>`).join('')}</div>`:`<div class="empty-state">${i('chart')}<h3>Nenhum dia concluído</h3><p>Abra sua loja para preencher o gráfico com resultados reais da simulação.</p><button class="btn btn-secondary" data-action="goto-game">Planejar o primeiro dia</button></div>`}</section>
    <section class="panel"><h3>Investimentos na expansão</h3><p>Capital aplicado: <b>${money(investmentTotal())}</b> em ${state.investments.length} compra(s). O investimento é descontado do caixa no momento da compra, separado do lucro operacional diário.</p></section><section class="panel"><h3>Histórico financeiro</h3><div class="history-table-wrap"><table class="history-table"><thead><tr><th>Dia</th><th>Receita</th><th>Produção</th><th>Taxas</th><th>Despesas*</th><th>Lucro</th><th>Vendas</th></tr></thead><tbody>${items.map(r=>`<tr><td>Dia ${r.day} · ${r.title}</td><td>${money(r.revenue)}</td><td>${money(r.directCost)}</td><td>${money(r.fees)}</td><td>${money(r.fixed+r.policyCost+r.challengeCost)}</td><td class="${r.profit>=0?'is-positive':'is-negative'}">${money(r.profit)}</td><td>${r.sold}/${r.made}</td></tr>`).join('')||'<tr><td colspan="7">Nenhum resultado ainda.</td></tr>'}</tbody></table></div><p class="game-disclaimer">*Inclui despesas fixas, estratégia e decisão de imprevisto. Resultados de simulação, não dados reais.</p></section>`;
  }
  function pageHelp(){
    root.innerHTML=heading(`${i('help')} APRENDIZADO PRÁTICO`,'Como jogar','Explore o bairro, atenda clientes na aba Vendas e clientes, abra a loja e acompanhe uma simulação contínua de precificação, custos e margem de contribuição.','TUTORIAL')+
    `<div class="help-actions"><button class="btn btn-primary" data-action="tutorial">${i('play')} Iniciar tutorial completo (18 etapas)</button></div>
    <div class="help-grid"><div class="help-card"><div class="help-count">01 / EXPLORE</div><h3>Visite as lojas do bairro</h3><p>No mapa, clique nas fachadas para negociar com fornecedores, resolver o desafio de preço e consultar a Zuni.</p></div><div class="help-card"><div class="help-count">02 / PLANEJE</div><h3>Defina preços e produção</h3><p>Cadastre itens seus em Expansão e ajuste quanto cobrar e quantas unidades produzir em Meu negócio. Produtos não vendidos representam desperdício.</p></div><div class="help-card"><div class="help-count">03 / ESCOLHA</div><h3>Planeje sua estratégia</h3><p>Você pode operar com custo menor, investir em divulgação ou melhorar a experiência do cliente. Cada caminho tem vantagens e custos.</p></div><div class="help-card"><div class="help-count">04 / REAJA</div><h3>Resolva imprevistos</h3><p>Ao abrir a loja, surge uma decisão de gestão. Compare o custo da ação e os possíveis efeitos sobre a procura.</p></div><div class="help-card wide"><div class="help-count">05 / CRESÇA</div><h3>Expanda o cardápio e a estrutura</h3><p>Na página Expansão do negócio, cadastre seus próprios produtos com nome, categoria, custo, preço e quantidade. Eles aparecem em Meu negócio, no atendimento de clientes, no Mercado e nos resultados. Também é possível editar ou retirar um item sem apagar o histórico de vendas. As melhorias e os produtos prontos opcionais têm investimentos separados do lucro diário.</p></div><div class="help-card"><div class="help-count">06 / REPONHA</div><h3>Compre ingredientes</h3><p>Depois de definir a produção, abra Estoque e compre as porções necessárias. Essa compra reduz o caixa agora; o custo do material consumido entra no lucro apenas quando a loja fecha.</p></div><div class="help-card"><div class="help-count">07 / GERENCIE</div><h3>Equipe, horário e unidades</h3><p>Escolha manhã, tarde ou noite no Interior, contrate funcionários se couber no orçamento e avalie abrir a unidade Centro. Mais demanda também pode trazer salários e aluguel.</p></div><div class="help-card wide"><div class="help-count">CONCEITO DO TCC ZUZ</div><h3>Como a precificação é calculada?</h3><p>A ZUZ considera custos diretos, rateio de custos fixos, tributos e taxas e margem desejada. Neste jogo, a fórmula de referência (margem de 20%, taxas de 8%) é:</p><div class="formula">Preço técnico = (Custo unitário + Custo fixo rateado) ÷ (1 − 0,08 − 0,20)</div><p>A margem de contribuição por unidade é o preço de venda menos custos variáveis e taxas. O ponto de equilíbrio é a quantidade de vendas necessária para cobrir as despesas fixas, considerando essa margem.</p></div><div class="help-card wide"><div class="help-count">SOBRE A SIMULAÇÃO</div><h3>Regras e limitações</h3><p>Você começa com ${money(INITIAL_CASH)}, reputação 62/100 e administra a loja por tempo indeterminado, em ciclos de cenário. A demanda depende do preço relativo ao mercado simulado, reputação, eventos e estratégia. Cada produto tem custo direto e cada dia possui despesas fixas; as vendas têm 8% de taxas.</p><p>A personagem Zuni apresenta dicas programadas offline neste jogo; não é uma conexão com a IA Gemini do sistema principal.</p></div></div>`;
  }
  /* Bairro ZUZ — camada de missões interativas ligada ao simulador financeiro. */
  const CITY_SUPPLIERS = [
    {id:'economico',name:'Atacado Rápido',tag:'Menor custo',desc:'Ingredientes mais baratos, porém a qualidade percebida pode reduzir a procura.',costCut:[.85,.50,.35],demand:.93,badge:'ECONOMIA'},
    {id:'local',name:'Cooperativa do Bairro',tag:'Equilíbrio',desc:'Preço intermediário, insumos regulares e demanda estável.',costCut:[.35,.20,.20],demand:1,badge:'EQUILÍBRIO'},
    {id:'premium',name:'Seleção Premium',tag:'Qualidade',desc:'Custo unitário maior, mas a qualidade pode atrair mais clientes.',costCut:[-.70,-.45,-.30],demand:1.09,badge:'QUALIDADE'}
  ];
  const PACKING_ORDERS = [0,1,2,2,0,1,1,2,0,0,2,1,2,1,0,1,0,2,0,2,1,2,0,1];
  function cityProgress(){
    if(!state.city || state.city.day!==state.day){state.city={day:state.day,supplier:null,priceDone:false,priceCorrect:false,deliveryDone:false,deliveryStep:0};save();}
    return state.city;
  }
  function cityModifiers(){
    const m=cityProgress();const supplier=CITY_SUPPLIERS.find(s=>s.id===m.supplier);
    return {costCut:supplier?.costCut||[0,0,0], demand:(supplier?.demand||1)*(m.deliveryDone?1.10:1)};
  }
  function completedMissions(){const c=cityProgress();return Number(!!c.supplier)+Number(c.priceDone)+Number(c.deliveryDone);}
  function humanSvg(shirt='#b390e7',skin='#d69a7e',hair='#322343'){
    return `<svg viewBox="0 0 66 104" aria-hidden="true"><ellipse cx="32" cy="98" rx="20" ry="5" fill="#14132d" opacity=".27"/><path d="M19 65L16 93H29L34 69M36 67L38 93H52L47 64" fill="#353552" stroke="#28243e" stroke-width="4" stroke-linejoin="round"/><path d="M15 41Q33 34 50 42L53 68Q34 75 12 68Z" fill="${shirt}" stroke="#493764" stroke-width="3"/><path d="M16 45L6 66L13 69L23 51M48 45L60 65L52 69L41 52" fill="${shirt}" stroke="#493764" stroke-width="3"/><path d="M22 25V40Q33 46 44 40V26" fill="${skin}"/><rect x="13" y="7" width="40" height="37" rx="18" fill="${skin}" stroke="#8f625b" stroke-width="2"/><path d="M14 27Q4 0 30 2Q61 -2 53 28L49 21Q45 13 37 15Q19 20 14 27Z" fill="${hair}"/><circle cx="25" cy="27" r="2.3" fill="#2f2440"/><circle cx="42" cy="27" r="2.3" fill="#2f2440"/><path d="M28 35Q33 39 39 35" stroke="#8a564b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
  }
  function cityArt(){
    const rainy=state.day===2;
    const facade=facadeMetrics();
    const buildings=[{x:0,y:70,w:165,h:195,c:'#48637a'},{x:170,y:35,w:168,h:220,c:'#5f557c'},{x:360,y:78,w:160,h:185,c:'#577c89'},{x:550,y:52,w:177,h:200,c:'#626181'},{x:738,y:27,w:150,h:220,c:'#697c90'},{x:910,y:83,w:135,h:160,c:'#52647c'}];
    const backdrop=buildings.map((b,k)=>`<g opacity=".7"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="9" fill="${b.c}"/>${Array.from({length:3},(_,i)=>Array.from({length:4},(_,j)=>`<rect x="${b.x+18+j*32}" y="${b.y+24+i*47}" width="19" height="28" rx="3" fill="${(i+j+k)%3===0?'#f8d8a7':'#a9cad1'}" opacity=".8"/>`).join('')).join('')}</g>`).join('');
    const trees=[75,960].map(x=>`<g><ellipse cx="${x}" cy="390" rx="66" ry="15" fill="#1a4341" opacity=".17"/><rect x="${x-10}" y="228" width="20" height="164" rx="6" fill="#6b4b55"/><circle cx="${x}" cy="210" r="67" fill="#3e9187"/><circle cx="${x-33}" cy="217" r="44" fill="#5db5a0"/><circle cx="${x+29}" cy="178" r="49" fill="#479e94"/><circle cx="${x-9}" cy="154" r="39" fill="#70c3aa"/></g>`).join('');
    return `<svg class="city-background-svg" viewBox="0 0 1040 565" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bairro ilustrado com confeitaria, fornecedores e central Zuni">
      <defs><linearGradient id="citysky" x2="0" y2="1"><stop stop-color="${rainy?'#566987':'#8c8dc9'}"/><stop offset="1" stop-color="${rainy?'#a3a7ba':'#e9c3ba'}"/></linearGradient><linearGradient id="cityroad" x2="0" y2="1"><stop stop-color="#555e7a"/><stop offset="1" stop-color="#373955"/></linearGradient><pattern id="brick" width="36" height="20" patternUnits="userSpaceOnUse"><path d="M0 0H36M0 20H36M18 0V10M0 10H36M0 10V20" stroke="#7c6897" stroke-opacity=".12" fill="none"/></pattern><pattern id="walktiles" width="66" height="38" patternUnits="userSpaceOnUse"><path d="M0 0H66M0 38H66M33 0V38" fill="none" stroke="#b7a4b6" stroke-opacity=".32" stroke-width="2"/></pattern></defs>
      <rect width="1040" height="565" fill="url(#citysky)"/>
      <circle cx="833" cy="96" r="45" fill="#f6d4bb" opacity=".85"/>
      <g fill="#fff" opacity=".27"><ellipse cx="180" cy="95" rx="120" ry="18"/><ellipse cx="430" cy="65" rx="88" ry="15"/><ellipse cx="755" cy="117" rx="130" ry="18"/></g>
      <path d="M0 245Q105 223 198 245Q335 221 450 240Q610 210 755 249Q907 225 1040 247V338H0Z" fill="#687b98" opacity=".55"/>
      ${backdrop}
      <rect x="0" y="258" width="1040" height="131" fill="#77918c"/><rect x="0" y="258" width="1040" height="131" fill="url(#walktiles)" opacity=".75"/>
      <rect x="0" y="389" width="1040" height="176" fill="url(#cityroad)"/><rect x="0" y="389" width="1040" height="14" fill="#ead4bd"/><rect x="0" y="402" width="1040" height="6" fill="#b5a4a0"/><rect x="0" y="497" width="1040" height="6" fill="#a7a5b9" opacity=".3"/>
      <g opacity=".75">${[30,236,442,648,854].map(x=>`<rect x="${x}" y="474" width="120" height="9" rx="5" fill="#e6dbd3"/>`).join('')}</g>
      ${trees}
      <!-- fornecedor -->
      <g transform="translate(154 192)"><rect x="-10" y="0" width="200" height="199" rx="10" fill="#534563" stroke="#3d375b" stroke-width="6"/><rect x="-10" y="0" width="200" height="199" rx="10" fill="url(#brick)"/><rect x="7" y="19" width="165" height="35" rx="6" fill="#f2cd93"/><text x="89" y="43" fill="#4b3548" font-size="18" font-weight="900" text-anchor="middle">ARMAZÉM</text><rect x="-17" y="66" width="212" height="29" rx="5" fill="#e9b876"/><path d="M-17 95v12q15 18 30 0q15 18 30 0q15 18 30 0q15 18 30 0q15 18 30 0q15 18 30 0q15 18 30 0v-12" fill="#ffe6b6"/><rect x="16" y="113" width="71" height="85" rx="7" fill="#9e7897"/><path d="M24 142h55v49H24Z" fill="#373952"/><rect x="110" y="122" width="62" height="76" rx="4" fill="#ae9ca5"/><rect x="116" y="129" width="50" height="59" fill="#b9d4cc"/><g fill="#e8a660"><circle cx="129" cy="169" r="12"/><circle cx="149" cy="171" r="11"/><circle cx="142" cy="149" r="12"/></g></g>
      <!-- loja -->
      <g transform="translate(384 135)"><rect width="278" height="260" rx="11" fill="#f1d7c5" stroke="#7d617e" stroke-width="8"/><rect width="278" height="260" rx="11" fill="url(#brick)"/><path d="M-17 54H293V102H-17Z" fill="#705394"/><path d="M-17 73H293V114Q273 134 254 114Q234 134 215 114Q195 134 176 114Q156 134 137 114Q117 134 98 114Q78 134 59 114Q39 134 20 114Q0 134-17 114Z" fill="#eac1d7"/><path d="M-13 73h43v42H-13zm85 0h43v42H72zm84 0h43v42h-43zm86 0h43v42h-43z" fill="#7b5999"/><rect x="43" y="15" width="193" height="50" rx="10" fill="#322747" stroke="#b59be1" stroke-width="3"/><text x="139" y="${facade.y}" text-anchor="middle" font-size="${facade.size}" font-weight="900" fill="#fff5fb">${esc(facade.txt)}</text><rect x="12" y="142" width="83" height="117" rx="6" fill="#788fa0" stroke="#634e74" stroke-width="7"/><path d="M23 150H83V244H23Z" fill="#a6bdc5"/><path d="M26 191H80" stroke="#f2c9b0" stroke-width="5"/><rect x="107" y="136" width="69" height="125" rx="6" fill="#4b3b66" stroke="#735a7e" stroke-width="8"/><path d="M145 146v112" stroke="#ae9fbe" stroke-width="3"/><circle cx="155" cy="202" r="4" fill="#e7cfaa"/><rect x="192" y="142" width="74" height="117" rx="6" fill="#92aeb2" stroke="#634e74" stroke-width="7"/><path d="M199 185H258" stroke="#f2c9b0" stroke-width="5"/><rect x="2" y="257" width="276" height="8" fill="#574760"/></g>
      <!-- central zuni -->
      <g transform="translate(739 194)"><rect width="173" height="199" rx="9" fill="#626a9a" stroke="#404766" stroke-width="7"/><rect x="12" y="-26" width="149" height="47" rx="11" fill="#322a59" stroke="#c6a9ef" stroke-width="3"/><text x="87" y="5" text-anchor="middle" fill="#eee3ff" font-size="17" font-weight="900">ZUNI LAB</text><rect x="15" y="40" width="144" height="111" rx="8" fill="#232640" stroke="#8577a8" stroke-width="6"/><rect x="32" y="56" width="110" height="75" rx="10" fill="#a987ee"/><path d="M57 82v14M116 82v14" stroke="#392c5d" stroke-width="11" stroke-linecap="round"/><path d="M75 105q13 12 25 0" stroke="#392c5d" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="44" y="165" width="86" height="34" rx="7" fill="#40445e"/><path d="M66 181h42" stroke="#ceb7ff" stroke-width="5" stroke-linecap="round"/></g>
      <!-- bancos canteiros e luzes -->
      <g transform="translate(340 342)"><rect width="50" height="11" rx="4" fill="#a87075"/><rect x="6" y="11" width="7" height="38" fill="#684752"/><rect x="37" y="11" width="7" height="38" fill="#684752"/></g>
      <g transform="translate(679 333)"><rect width="51" height="16" rx="5" fill="#d6a37d"/><rect x="4" y="15" width="43" height="31" fill="#86637b"/><path d="M13 0q-13-16 0-28q12 10 12 26M32-3q-8-22 9-28q5 14-2 28" fill="#6db9a0"/></g>
      ${rainy?Array.from({length:38},(_,k)=>`<path d="M${(k*83)%1060} ${(k*63)%350}l-10 26" stroke="#d9e4ef" stroke-width="2" opacity=".38"/>`).join(''):''}
    </svg>`;
  }
  function pageCity(){
    const cp=cityProgress();const finished=state.pendingNext||state.finished;
    const quests=[{action:'supplier',label:'Escolher fornecedor',sub:'Compare custo × qualidade',done:!!cp.supplier},{action:'price',label:'Desafio de preço',sub:'Resolva uma conta de margem',done:cp.priceDone}];
    root.innerHTML=heading(`${i('grid')} BAIRRO EMPREENDEDOR`,'Explorar bairro','Visite as lojas do mapa e complete as missões que influenciam o desempenho do negócio.',`DIA ${state.day} · CICLO ${cycleNumber()}`)+
    `<section class="city-clean-stats"><div><span>Caixa disponível</span><strong>${shortMoney(state.cash)}</strong></div><div><span>Reputação</span><strong>${Math.round(state.reputation)}/100</strong></div><div><span>Missões no bairro</span><strong>${Number(!!cp.supplier)+Number(cp.priceDone)} / 2 ${finished?'· encerrado':''}</strong></div></section>
    <section class="city-stage city-stage-clean ${state.day===2?'is-rainy':''}" id="cityStage" aria-label="Mapa do bairro com lojas e personagens">
      ${cityArt()}
      <button class="city-hotspot hotspot-supplier" data-action="city-visit" data-spot="supplier"><span>📦</span> Fornecedores</button>
      <button class="city-hotspot hotspot-shop" data-action="city-visit" data-spot="shop"><span>🏪</span> ${esc(state.name)}</button>
      <button class="city-hotspot hotspot-zuni" data-action="city-visit" data-spot="zuni"><span>✦</span> Zuni Lab</button>
    </section>
    <div class="city-action-row city-action-row-clean"><div class="city-map-tip-inline">${i('info')} Clique nas fachadas para visitar os estabelecimentos. Para pedidos e atendimento, use a aba Vendas e clientes.</div></div>
    <section class="city-missions city-missions-compact">${quests.map((q,k)=>`<article class="city-mission ${q.done?'done':''}"><div class="city-mission-badge">${q.done?'✓':`0${k+1}`}</div><div class="city-mission-info"><h3>${q.label}</h3><p>${q.sub}</p></div><button type="button" class="city-mission-play" data-action="city-visit" data-spot="${q.action}" ${finished?'disabled':''}>${q.done?'Revisar':'Abrir'} ${i('arrow')}</button></article>`).join('')}</section>
    <div class="city-next"><div><strong>${completedMissions()===3?'Tudo pronto para abrir!':'Você decide quando abrir a loja.'}</strong><span>No bairro ficam os fornecedores e a Zuni. Os pedidos agora estão em Vendas e clientes.</span></div><div class="city-next-actions"><button class="btn btn-secondary" data-action="tutorial">${i('help')} Tutorial</button><button class="btn btn-primary" data-action="city-plan">${finished?'Ver resultados':'Ir para Meu negócio'} ${i('arrow')}</button></div></div>`;
  }
  function cityDialogue(spot){
    const cp=cityProgress();const ended=state.pendingNext||state.finished;
    if(spot==='shop'){currentPage=ended?'historico':'gestao';hideOverlay();render();window.scrollTo(0,0);return;}
    if(spot==='zuni'){
      showOverlay(`<div class="city-dialog"><button class="dialog-close" data-action="close" aria-label="Fechar">${i('close')}</button><div class="city-dialog-eyebrow">ASSISTENTE ZUNI / DEMONSTRAÇÃO OFFLINE</div><div class="city-zuni-portrait"><div class="city-zuni-head"><span class="city-zuni-eyes">••</span><span class="city-zuni-smile">⌣</span></div><div><strong>Olá, empreendedor!</strong><p>${esc(dayConfig().hint)}</p></div></div><div class="city-insight"><b>Sua projeção neste momento</b><div>Receita estimada <strong>${money(forecast().revenue)}</strong></div><div>Lucro estimado <strong class="${forecast().profit<0?'is-negative':'is-positive'}">${money(forecast().profit)}</strong></div><div>Preço técnico do brownie <strong>${money(getUnitTechnical(0))}</strong></div></div><p class="city-dialog-note">Esses números são ilustrativos e podem mudar conforme preços, produção e escolhas. O preço final continua sendo decisão do empreendedor.</p><button class="btn btn-primary city-dialog-full" data-action="city-plan">Ir para os cálculos ${i('arrow')}</button></div>`);
      return;
    }
    if(spot==='supplier'){
      const current=CITY_SUPPLIERS.find(x=>x.id===cp.supplier);
      showOverlay(`<div class="city-dialog"><button class="dialog-close" data-action="close" aria-label="Fechar">${i('close')}</button><div class="city-dialog-eyebrow">MISSÃO 01 / NEGOCIAÇÃO</div><h2>Escolha seu fornecedor</h2><p class="city-dialog-copy">A cada dia, a compra de ingredientes define seus custos e pode afetar a procura. Compare a economia com a qualidade percebida.</p>${current?`<div class="city-already">✓ Fornecedor escolhido: <strong>${current.name}</strong>. Esta decisão vale para o dia atual.</div>`:`<div class="city-supplier-list">${CITY_SUPPLIERS.map(s=>`<button class="city-supplier" data-action="city-supplier" data-supplier="${s.id}" ${ended?'disabled':''}><span class="city-supplier-tag">${s.badge}</span><strong>${s.name}</strong><p>${s.desc}</p><div>Brownie: ${money(Math.max(.1,PRODUCTS[0].baseCost+dayConfig().costs[0]-s.costCut[0]))} / un. <span>${s.demand>=1?'↑':'↓'} demanda ${Math.round((s.demand-1)*100)}%</span></div></button>`).join('')}</div>`}<p class="city-dialog-note">A oferta é fictícia. O custo final entra automaticamente na sua planilha após a escolha.</p></div>`);
      return;
    }
    if(spot==='price'){
      const units=Math.max(1,state.quantities.reduce((a,b)=>a+b,0)),cost=productCost(0),fixed=fixedCost()/units,correct=(cost+fixed)/(1-SALES_FEES-.20);
      const vals=[correct*.78,correct,correct*1.28];
      showOverlay(`<div class="city-dialog"><button class="dialog-close" data-action="close" aria-label="Fechar">${i('close')}</button><div class="city-dialog-eyebrow">MISSÃO 02 / PRECIFICAÇÃO</div><h2>Qual é o preço técnico?</h2><p class="city-dialog-copy">Uma confeiteira quer vender brownie considerando os custos abaixo. Qual preço de venda cobre os gastos e incorpora margem desejada de <b>20%</b> sobre a venda?</p><div class="city-question-data"><div><span>Custo direto</span><b>${money(cost)}</b></div><div><span>Fixo rateado/un.</span><b>${money(fixed)}</b></div><div><span>Taxas da venda</span><b>8%</b></div></div>${cp.priceDone?`<div class="city-already">✓ Desafio realizado: <strong>${cp.priceCorrect?'resposta correta, +3 de reputação':'revise a resposta e tente em outro dia'}</strong></div>`:`<div class="city-answer-list">${vals.map((val,k)=>`<button data-action="city-price-answer" data-answer="${k}" ${ended?'disabled':''}><span>${String.fromCharCode(65+k)}</span><strong>${money(Math.round(val*100)/100)}</strong>${i('arrow')}</button>`).join('')}</div>`}<div class="city-formula-tip">Preço técnico = (custo direto + custo fixo rateado) ÷ (1 − taxas − margem)</div></div>`);
      return;
    }

  }
  function cityVisit(spot){if(!state.started)return;cityDialogue(spot);sound(spot==='shop'||spot==='supplier'?'bell':'tap');}

  function render(){
    renderSide();
    if(currentPage==='cidade') pageCity();
    else if(currentPage==='vendas') pageSales();
    else if(currentPage==='expansao') pageExpansion();
    else if(currentPage==='estoque') pageStock();
    else if(currentPage==='funcionarios') pageStaff();
    else if(currentPage==='unidades') pageBranches();
    else if(currentPage==='interior') pageInterior();
    else if(currentPage==='eventos') pageEvents();
    else if(currentPage==='mercado') pageMarket();
    else if(currentPage==='noticias') pageNews();
    else if(currentPage==='historico') pageHistory();
    else if(currentPage==='ajuda') pageHelp();
    else pageManagement();
    document.querySelector('#soundToggle').innerHTML=markupIcon(soundOn?'volume':'mute');
    document.querySelectorAll('.mobile-dock [data-page], #mobileMenu [data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===currentPage));
    document.querySelector('#mobileAudio')?.setAttribute('aria-label',soundOn?'Silenciar música e efeitos':'Ativar música e efeitos');
  }
  function showOverlay(html){overlay.innerHTML=`<div class="overlay" role="presentation"><div class="dialog ${html.includes('class="city-dialog')?'city-overlay-dialog':''} " role="dialog" aria-modal="true">${html}</div></div>`; const first=overlay.querySelector('input,button'); first?.focus({preventScroll:true});}
  function hideOverlay(){overlay.innerHTML='';}
  function showIntro(){
    showOverlay(`<div class="intro-dialog"><div class="intro-left"><div class="intro-kicker">ZUZ / LABORATÓRIO DE NEGÓCIOS</div><div class="intro-title">Decisões que<br><span>valem dinheiro.</span></div><p>Conheça o bairro, atenda pedidos e resolva missões práticas enquanto administra um pequeno negócio com decisões que afetam seu caixa.</p><div class="intro-visual"><div class="visual-header"><span class="visual-dot"></span>PROJEÇÃO DE VENDAS</div><div class="visual-bars"><span style="height:50%"></span><span style="height:66%"></span><span style="height:38%"></span><span style="height:76%"></span><span style="height:59%"></span><span style="height:90%"></span><span style="height:71%"></span></div><div class="intro-visual-foot">ANALISE · PLANEJE · CRESÇA</div></div></div><div class="intro-right"><div class="eyebrow">MISSÃO EMPREENDEDORA</div><h2>Abra seu negócio</h2><p class="muted">Explore o bairro, negocie insumos, atenda clientes e aprenda a precificar sem limite fixo de dias.</p><label class="form-label" for="shopName">Nome do seu negócio</label><input class="shop-name-input" id="shopName" maxlength="30" placeholder="Ex.: Ateliê Aurora" value="${esc(state.name)}"><div class="intro-rules"><h3>Seu ponto de partida</h3><div class="intro-rule"><b>${money(INITIAL_CASH)}</b><span>Capital inicial</span></div><div class="intro-rule"><b>∞</b><span>Dias de simulação em ciclos</span></div><div class="intro-rule"><b>3 produtos</b><span>Custos e precificação</span></div></div><button class="btn btn-primary intro-btn" data-action="start">Começar desafio ${i('arrow')}</button><button class="btn btn-secondary intro-btn" data-action="tutorial">${i('help')} Ver tutorial</button><div class="intro-small">Jogo autoral offline · com trilha adaptada · valores simulados</div></div></div>`);
  }
  
const TOUR_STEPS = [
    {page:'cidade', title:'Conheça o bairro', instruction:'Aqui ficam os estabelecimentos do seu bairro. Clique nas placas do armazém, da sua loja ou da Zuni para interagir.', why:'As escolhas feitas aqui afetam os custos, a reputação e a procura. Você não precisa andar com um personagem.'},
    {page:'cidade', title:'Escolha um fornecedor', instruction:'No bairro, clique em Fornecedores. Compare a opção econômica, local e premium; escolha a que combina com a estratégia do dia.', why:'Ingredientes mais baratos reduzem custos, mas podem mudar a percepção de qualidade e a demanda.'},
    {page:'cidade', title:'Aprenda o preço técnico', instruction:'Clique no desafio de precificação e analise o custo direto, as despesas fixas rateadas, a margem e as taxas. Escolha a resposta.', why:'O cálculo está diretamente ligado ao TCC: preço = (custo direto + custo fixo rateado) / (1 - taxas - margem).'},
    {page:'cidade', title:'Peça ajuda à Zuni', instruction:'Clique no Zuni Lab para receber uma dica e conferir a projeção financeira. Ela explica o resultado antes de você vender.', why:'As respostas da Zuni neste jogo são programadas e fictícias; o site principal da ZUZ possui uma integração de IA separada.'},
    {page:'expansao', title:'Cadastre seus próprios produtos', instruction:'Abra Expansão do negócio e procure “Criar meu produto”. Informe nome, categoria, custo de fabricação, preço e quantidade; depois salve.', why:'O produto passa a aparecer no cardápio, nas vendas e nos relatórios. Você também pode editá-lo ou retirá-lo do cardápio.'},
    {page:'gestao', title:'Planeje os preços e a produção', instruction:'Em Meu negócio, mude o preço de venda e os botões de quantidade de cada produto. Compare o preço técnico com o valor do mercado.', why:'O caixa, os custos fixos, a margem de contribuição, as taxas e a projeção mudam conforme suas escolhas.'},
    {page:'gestao', title:'Compare cenários de preços', instruction:'Toque em “Comparar cenários”. Teste um preço acessível, um preço intermediário e um preço maior antes de tomar sua decisão.', why:'Não existe preço perfeito para todos os casos: o volume vendido também reage ao preço e à reputação.'},
    {page:'interior', title:'Entre na loja e escolha o turno', instruction:'Em Interior da loja, veja a vitrine, toque nos produtos e escolha Manhã, Tarde ou Noite.', why:'A iluminação do cenário e o interesse dos clientes mudam de acordo com o período escolhido.'},
    {page:'estoque', title:'Compre os ingredientes', instruction:'Depois de escolher o volume de produção, entre em Estoque de insumos e toque em “Repor plano” para comprar o necessário.', why:'Chocolate, farinha, leite e embalagens são consumidos na produção. A compra reduz o caixa, mas não é cobrada duas vezes no fechamento.'},
    {page:'funcionarios', title:'Monte sua equipe', instruction:'Confira as funções disponíveis e contrate somente se o caixa comportar o custo. Você também pode dispensar um funcionário.', why:'Atendentes, cozinheiros e gerentes ajudam na operação, mas aumentam a folha de salários todos os dias.'},
    {page:'vendas', title:'Atenda os clientes', instruction:'Em Vendas e clientes, leia o pedido mostrado no balcão e escolha o produto correspondente. Atenda os três pedidos.', why:'A conclusão do atendimento aumenta a procura prevista. As vendas definitivas só acontecem ao abrir a loja.'},
    {page:'eventos', title:'Aceite os desafios diários', instruction:'Abra Eventos e missões para descobrir a meta de hoje, os acontecimentos do mercado e os possíveis bônus.', why:'Chuvas, datas movimentadas e metas alteram a estratégia; ganhar reputação ajuda a fidelizar clientes.'},
    {page:'mercado', title:'Pesquise os preços de referência', instruction:'Compare o preço de cada produto com as referências simuladas, custos diretos e diferenças em relação ao mercado.', why:'Os valores desta versão são fictícios e servem para aprendizado, não para cotar preços reais.'},
    {page:'noticias', title:'Leia as notícias do bairro', instruction:'Acompanhe o noticiário simulado e use os acontecimentos como pistas para suas próximas decisões de produção.', why:'As notícias ajudam a contextualizar eventos e mudanças na demanda.'},
    {page:'expansao', title:'Melhore e expanda a empresa', instruction:'Em Expansão do negócio, compre melhorias e desbloqueie produtos prontos quando tiver dinheiro suficiente. Criar produtos próprios também é possível.', why:'Diferencie gasto de investimento e monitore se a expansão está compensando.'},
    {page:'unidades', title:'Abra a segunda unidade', instruction:'Confira o investimento necessário para abrir a loja do Centro. Avalie também o aluguel adicional antes de confirmar.', why:'A segunda unidade aumenta a procura potencial, mas compartilha a produção e o estoque com a matriz nesta versão.'},
    {page:'gestao', title:'Abra a loja e feche o caixa', instruction:'Volte a Meu negócio, confirme que há insumos e dinheiro suficientes, toque em “Abrir a loja” e escolha como reagir ao imprevisto.', why:'O balanço mostra receita, custos da produção, taxas, salários, aluguel, lucro e sobras. Depois você avança para outro dia, sem limite.'},
    {page:'historico', title:'Interprete o resultado e continue', instruction:'Acompanhe o gráfico de lucro, vendas, investimentos e histórico financeiro. Use os dados para melhorar a estratégia no próximo dia.', why:'O jogo salva automaticamente no dispositivo. Para reabrir este guia, toque em Como jogar ou Ajuda no menu mobile.'}
  ];
  let tourStep=0;
  let tourActive=false;
  let tourPaused=false;
  const tourRoot=document.getElementById('tourRoot');
  function renderTour(){
    if(!tourActive){tourRoot.innerHTML='';document.body.classList.remove('tour-is-active');document.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('tour-focus'));return;}
    const step=TOUR_STEPS[tourStep];
    tourRoot.innerHTML = tourPaused?
      `<button class="tour-resume" data-action="tour-resume" aria-label="Retomar tutorial">${i('help')} Retomar tutorial (${tourStep+1}/${TOUR_STEPS.length})</button>`:
      `<aside class="tour-panel" role="region" aria-live="polite" aria-label="Tutorial guiado: etapa ${tourStep+1} de ${TOUR_STEPS.length}">
         <div class="tour-top"><span class="tour-eyebrow">GUIA ZUZ · ETAPA ${tourStep+1} / ${TOUR_STEPS.length}</span><button class="tour-dismiss" data-action="tour-exit" aria-label="Encerrar tutorial">✕</button></div>
         <div class="tour-meter"><span style="width:${(tourStep+1)/TOUR_STEPS.length*100}%"></span></div>
         <h2>${step.title}</h2><p class="tour-instruction">${step.instruction}</p><p class="tour-insight"><strong>Por que importa?</strong> ${step.why}</p>
         <div class="tour-buttons"><button class="tour-btn tour-back" data-action="tour-prev" ${tourStep===0?'disabled':''}>← Voltar</button><button class="tour-btn tour-try" data-action="tour-pause">Testar tela</button><button class="tour-btn tour-forward" data-action="tour-next">${tourStep===TOUR_STEPS.length-1?'Concluir ✓':'Próximo →'}</button></div>
       </aside>`;
    document.body.classList.toggle('tour-is-active',!tourPaused);
    document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('tour-focus',!tourPaused&&x.dataset.page===step.page));
  }
  function gotoTourStep(index){
    tourStep=clamp(index,0,TOUR_STEPS.length-1); tourActive=true; tourPaused=false;
    currentPage=TOUR_STEPS[tourStep].page;hideOverlay();render();renderTour();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function closeTour(finished=false){
    tourActive=false;tourPaused=false;renderTour();
    if(finished){state.tutorialSeen=true;save();toast('Tutorial concluído! Agora você pode administrar sua loja.');}
    if(!state.started)showIntro();
  }
  function showTutorial(){ gotoTourStep(0); }
  function showScenarios(){
    const original=[...state.prices];
    const cases=[
      {name:'Mais acessível',desc:'Reduzir preços em 8%. Pode aumentar a procura, mas diminui a receita por venda.',mult:.92},
      {name:'Meu plano atual',desc:'Manter preços e comparar o retorno estimado da decisão atual.',mult:1},
      {name:'Maior valorização',desc:'Aumentar os preços em 10%. Maior valor por venda, com risco de menor procura.',mult:1.1}
    ];
    const cards=cases.map((s,j)=>{
      state.prices=original.map(x=>clamp(Math.round(x*s.mult*100)/100,1,100));
      const f=forecast();
      return {...s,id:j,f,prices:[...state.prices]};
    });
    state.prices=original;
    const best=Math.max(...cards.map(c=>c.f.profit));
    showOverlay(`<div class="scenario-dialog"><button class="dialog-close" data-action="close" aria-label="Fechar">${i('close')}</button><div class="dialog-header"><div class="eyebrow">ZUZ / SIMULAÇÕES</div><h2>Compare três possibilidades</h2><p>O que muda no lucro se você reduzir ou aumentar seus preços? As estimativas usam a mesma produção e estratégia.</p></div><div class="scenario-grid">${cards.map(c=>`<button type="button" class="scenario-tile ${c.f.profit===best?'best':''}" data-action="apply-scenario" data-mult="${c.mult}"><div class="scenario-name">${c.name}</div><div class="scenario-desc">${c.desc}</div><div class="scenario-big ${c.f.profit>=0?'is-positive':'is-negative'}">${shortMoney(c.f.profit)}</div><div class="scenario-details"><span>Unidades previstas</span><b>${c.f.sold}</b></div><div class="scenario-details"><span>Receita prevista</span><b>${shortMoney(c.f.revenue)}</b></div><div class="scenario-details"><span>Aplicar ao cardápio</span><b>→</b></div></button>`).join('')}</div><div class="scenario-foot"><span>O cenário com maior lucro estimado está destacado; o resultado real do dia pode variar.</span><button type="button" class="btn btn-secondary" data-action="close">Voltar ao planejamento</button></div></div>`);
  }
  function showChallenge(){
    if(state.pendingNext||state.finished)return;
    if(shortagesValue()>.02){toast('Faltam ingredientes. Clique em Repor insumos antes de abrir.');return}
    if(operationalCost()>state.cash){toast('Caixa insuficiente para os custos operacionais.');return}
    const challenge=currentChallenge();
    const buttons=challenge.options.map((o,j)=>`<button class="challenge-choice" data-action="choose-challenge" data-choice="${j}"><div class="challenge-choice-icon">${i(j===0?'star':'check')}</div><div><strong>${o.label}</strong><p>${o.detail}</p></div>${i('arrow')}</button>`).join('');
    showOverlay(`<div class="challenge-dialog"><button class="dialog-close" data-action="close" aria-label="Voltar">${i('close')}</button><div class="eyebrow">DIA ${state.day} · DECISÃO DE GESTÃO</div><div class="challenge-big-icon">${i('light')}</div><h2>${challenge.title}</h2><p class="challenge-narrative">${challenge.text}</p><div class="challenge-options">${buttons}</div><p class="game-disclaimer">Sua escolha terá consequências no caixa e/ou na demanda do dia. A nova despesa precisa caber no orçamento.</p></div>`);
  }
  function simulate(opt,idx){
    if(shortagesValue(opt)>.02){toast('Faltam ingredientes para esta decisão. Reponha o estoque no planejamento.');return}
    if(operationalCost(opt)>state.cash){toast('A decisão excede o caixa disponível.');return}
    sound('cash');
    showOverlay(`<div class="simulation-dialog"><div class="sim-headline">DIA ${state.day} · LOJA ABERTA</div><h2>Um dia de negócios</h2><p>Os clientes estão chegando. Sua estratégia foi colocada em prática...</p><div class="store-stage"><div class="stage-stars"></div><div class="store-building"><div class="store-awn"></div><div class="store-sign">${esc(state.name.toUpperCase())}</div><div class="store-window"></div><div class="store-window second"></div><div class="store-door"></div></div><div class="customer c1"></div><div class="customer c2"></div><div class="customer c3"></div></div><div class="sim-progress"><span id="progressFill"></span></div><p class="sim-status" id="simStatus">Preparando pedidos e atendendo clientes...</p><button class="btn btn-secondary" data-action="skip" style="margin-top:16px">Ver resultado agora</button></div>`);
    let tick=0;
    const complete=()=>{clearInterval(timer);timer=null;const last=resultDay(opt,idx);sound(last.profit>=0?'win':'tap');showResult(last)};
    window.activeSimulationFinish=complete;
    timer=setInterval(()=>{
      tick+=1;
      const pct=Math.min(100,tick*5);
      const bar=document.getElementById('progressFill');if(bar)bar.style.width=`${pct}%`;
      const txt=document.getElementById('simStatus');if(txt)txt.textContent=pct<38?'Produzindo e organizando a vitrine...':pct<72?'Recebendo pedidos e vendendo produtos...':'Fechando caixa e calculando os resultados...';
      if(tick>=20)complete();
    },115);
  }
  function showResult(r){
    const positive=r.profit>=0;
    const profitText=positive?'Lucro do dia':'Resultado negativo do dia';
    const percentSold=Math.round((r.sold/Math.max(1,r.made))*100);
    const nextText=state.finished?'Ver balanço final':'Avançar para o próximo dia';
    showOverlay(`<div class="result-dialog"><div class="result-top"><div class="result-icon">${i(positive?'check':'info')}</div><div class="eyebrow" style="justify-content:center">BALANÇO · DIA ${r.day}</div><h2>${positive?'Sua loja fechou no positivo!':'Hora de rever a estratégia.'}</h2><p>O dinheiro no caixa é consequência das suas decisões de preço, produção e atendimento.</p><div class="result-profit ${positive?'is-positive':'is-negative'}">${money(r.profit)}</div><span class="pill ${positive?'pill--green':'pill--amber'}">${profitText}</span></div><div class="result-stats"><div class="result-stat"><small>Receita de vendas</small><b>${money(r.revenue)}</b></div><div class="result-stat"><small>Produtos vendidos</small><b>${r.sold} de ${r.made} (${percentSold}%)</b></div><div class="result-stat"><small>Caixa disponível</small><b>${money(r.cashAfter)}</b></div></div><table class="result-table"><thead><tr><th>Produto</th><th>Vendidos</th><th>Sobras</th><th>Receita</th></tr></thead><tbody>${r.lines.map(l=>`<tr><td>${l.name}</td><td>${l.sold}/${l.made}</td><td>${l.remaining}</td><td>${money(l.revenue)}</td></tr>`).join('')}</tbody></table><div class="result-breakdown"><div><span>Produção (consumo do estoque)</span><strong>− ${money(r.directCost)}</strong></div><div><span>Despesas fixas, salários e aluguéis</span><strong>− ${money(r.fixed)}</strong></div><div><span>Taxas de venda</span><strong>− ${money(r.fees)}</strong></div><div><span>Estratégia e imprevisto</span><strong>− ${money(r.policyCost+r.challengeCost)}</strong></div><div><span>Meta do dia</span><strong>${r.missionComplete?'Concluída (+2 rep.)':'Não atingida'}</strong></div><div><span>Reputação</span><strong class="${r.repChange>=0?'is-positive':'is-negative'}">${r.repChange>0?'+':''}${r.repChange} pontos</strong></div></div>${r.citySummary?`<div class="city-mission-tip"><b>Decisões tomadas no bairro:</b> Fornecedor: ${esc(r.citySummary.supplier)} · Desafio de preço: ${r.citySummary.priceCorrect?'correto (+3 reputação)':r.citySummary.priceDone?'realizado':'não realizado'} · Atendimento: ${r.citySummary.deliveryDone?'concluído (+10% de procura)':'não realizado'}.</div>`:''}<p class="game-disclaimer">Estoque restante após a produção: ${money(r.inventoryAfter||0)} em insumos. Compras de estoque já pagas não são descontadas do caixa outra vez no fechamento.</p><div class="result-foot"><span>${r.remaining>0?`Você teve ${r.remaining} unidade(s) sem vender. Produza com atenção à demanda.`:'Sua produção foi totalmente vendida! Confira se perdeu demanda por falta de estoque.'}</span><button type="button" class="btn btn-primary" data-action="next">${nextText} ${i('arrow')}</button></div></div>`);
  }
  function finale(){
    state.finished=true;state.pendingNext=false;save();
    const h=state.history, accumulated=h.reduce((a,r)=>a+r.profit,0), sold=h.reduce((a,r)=>a+r.sold,0),made=h.reduce((a,r)=>a+r.made,0), waste=made-sold, rate=made?sold/made:0;
    const rank=state.cash<0?'D':accumulated>=1650&&state.reputation>=77&&rate>=.83?'S':accumulated>=750&&state.reputation>=65?'A':accumulated>=200?'B':'C';
    const labels={S:'Gestão excelente',A:'Gestão consistente',B:'Negócio promissor',C:'Gestão em aprendizado',D:'Negócio sem capital'};
    const takeaway=rank==='S'?'Você equilibrou custos, preços e procura com excelente resultado.':rank==='A'?'Boas decisões trouxeram estabilidade e lucro para seu negócio.':rank==='B'?'Seu negócio avançou. Revise a produção para diminuir sobras e melhorar margens.':rank==='C'?'A experiência revelou pontos importantes para corrigir em preço e planejamento.':'A operação esgotou seu capital. Faça um novo plano considerando despesas, estoque e taxas.';
    showOverlay(`<div class="ending-dialog"><div class="eyebrow" style="justify-content:center">ZUZ · RELATÓRIO FINAL</div><div class="ending-rank">${rank}</div><h2>${labels[rank]}</h2><p class="ending-summary">${takeaway}<br>Você acompanhou ${h.length} dia(s) de gestão e praticou decisões baseadas em custos, mercado e margem de contribuição.</p><div class="ending-stats"><div class="ending-stat"><b class="${accumulated>=0?'is-positive':'is-negative'}">${shortMoney(accumulated)}</b><span>Lucro da jornada</span></div><div class="ending-stat"><b>${shortMoney(state.cash)}</b><span>Caixa final</span></div><div class="ending-stat"><b>${Math.round(state.reputation)}/100</b><span>Reputação</span></div><div class="ending-stat"><b>${Math.round(rate*100)}%</b><span>Estoque vendido</span></div></div><div class="certificate">${i('flag')} Certificado de conclusão da simulação · <strong>${esc(state.name)}</strong> · ${h.length} dia(s) concluídos · ${sold} unidades vendidas · ${waste} não vendidas</div><div class="ending-actions"><button class="btn btn-secondary" data-action="report">${i('chart')} Ver indicadores</button><button class="btn btn-secondary" data-action="print">${i('print')} Imprimir resultado</button><button class="btn btn-primary" data-action="restart">${i('rotate')} Jogar novamente</button></div><p class="game-disclaimer">O nível é uma avaliação educacional criada para este jogo. Não representa diagnóstico de viabilidade econômica real.</p></div>`);
  }
  function nextDay(){
    if(!state.pendingNext)return;
    if(state.finished){finale();return;}
    state.pendingNext=false;state.day++;state.policy='none';state.period='tarde';state.city={day:state.day,supplier:null,priceDone:false,priceCorrect:false,deliveryDone:false,deliveryStep:0};
    state.quantities=PRODUCTS.map(p=>isUnlocked(p.id)?p.defaultQty:0);
    state.prices=PRODUCTS.map((p,i)=>clamp(Math.round((state.prices[i]*.65+p.defaultPrice*.35)*100)/100,1,100));
    save();currentPage='cidade';hideOverlay();render();window.scrollTo({top:0,behavior:'smooth'});
    sound('bird');toast(`Dia ${state.day} liberado. Novo cenário carregado!`);
  }
  function askRestart(){showOverlay(`<div class="confirm-dialog"><button class="dialog-close" data-action="close" aria-label="Cancelar">${i('close')}</button><div class="eyebrow">REINICIAR SIMULAÇÃO</div><h2>Começar uma nova jornada?</h2><p>Todos os resultados locais desta partida serão apagados e você voltará ao dia 1.</p><div class="confirm-actions"><button class="btn btn-secondary" data-action="close">Cancelar</button><button class="btn btn-primary" data-action="confirm-restart">Sim, reiniciar</button></div></div>`)}
  function start(){const name=(document.getElementById('shopName')?.value||'Ateliê Aurora').trim().slice(0,30);state.name=name||'Ateliê Aurora';state.started=true;save();hideOverlay();render();syncMusic();sound('win');toast('Bem-vindo! Explore as lojas ou abra Vendas e clientes.');if(!state.tutorialSeen){setTimeout(()=>showTutorial(),160);}}
  function onClick(e){
    const b=e.target.closest('button');if(!b)return;
    const action=b.dataset.action;
    if(action==='tour-next'){ if(tourStep===TOUR_STEPS.length-1){closeTour(true);}else gotoTourStep(tourStep+1);sound();return; }
    if(action==='tour-prev'){gotoTourStep(tourStep-1);sound();return;}
    if(action==='tour-pause'){tourPaused=true;renderTour();sound();return;}
    if(action==='tour-resume'){tourPaused=false;gotoTourStep(tourStep);sound();return;}
    if(action==='tour-exit'){closeTour(false);sound();return;}
    if(action==='mobile-more'){document.getElementById('mobileMenu').hidden=false;return;}
    if(action==='mobile-close'){document.getElementById('mobileMenu').hidden=true;return;}
    if(action==='mobile-audio'){soundOn=!soundOn;syncMusic();render();sound();toast(soundOn?'Sons ativados':'Sons desativados');return;}
    if(action==='open-page'){
      document.getElementById('mobileMenu').hidden=true;
      if(b.dataset.page){currentPage=b.dataset.page;hideOverlay();render();window.scrollTo(0,0);sound();}
      if(tourActive&&!tourPaused){tourPaused=true;renderTour();}
      return;
    }
    if(action==='goto-stock'){currentPage='estoque';render();window.scrollTo(0,0);return}
    if(action==='goto-staff'){currentPage='funcionarios';render();window.scrollTo(0,0);return}
    if(action==='quick-restock'){restockAll();return}
    if(action==='buy-ingredient'){buyIngredient(b.dataset.id,Number(b.dataset.amount));return}
    if(action==='toggle-staff'){
      if(!editableDay())return;
      const id=b.dataset.id;if(!STAFF.some(x=>x.id===id))return;
      state.employees=staffOwned(id)?state.employees.filter(x=>x!==id):[...state.employees,id];
      save();render();sound('cash');toast(staffOwned(id)?'Funcionário contratado. Salário incluído.':'Funcionário dispensado.');return;
    }
    if(action==='set-period'){
      if(!editableDay())return;
      if(['manha','tarde','noite'].includes(b.dataset.period)){state.period=b.dataset.period;save();render();sound('tap');}
      return;
    }
    if(action==='inspect-product'){const index=Number(b.dataset.id);if(PRODUCTS[index])toast(`${PRODUCTS[index].name}: ${money(state.prices[index])} · ${state.quantities[index]} un. planejadas.`);return}
    if(action==='buy-branch'){
      if(!editableDay()||state.secondUnit)return;
      if(state.cash<1650){toast('Precisa de R$ 1.650 para a segunda unidade.');return;}
      state.cash=Math.round((state.cash-1650)*100)/100;state.secondUnit=true;
      state.investments.push({day:state.day,id:'segunda_unidade',type:'branch',name:'Unidade Centro',cost:1650});
      save();render();sound('win');toast('Segunda unidade inaugurada! Nova procura e aluguel incluídos.');return;
    }
    if(b.classList.contains('nav-link')){currentPage=b.dataset.page;hideOverlay();render();window.scrollTo(0,0);if(tourActive&&!tourPaused){tourPaused=true;renderTour();}sound(currentPage==='noticias'?'paper':'tap');return}
    if(b.id==='soundToggle'){soundOn=!soundOn;render();syncMusic();sound();toast(soundOn?'Sons ativados':'Sons desativados');return}
    if(b.id==='restartBtn'){askRestart();sound();return}
    if(action==='start'){start();syncMusic();return}
    if(action==='tutorial'){showTutorial();syncMusic();sound();return}
    if(action==='tutorial-done'){closeTour(true);hideOverlay();syncMusic();sound('win');return}
    if(action==='city-plan'){hideOverlay();currentPage=state.pendingNext||state.finished?'historico':'gestao';render();window.scrollTo(0,0);sound();return;}
    if(action==='city-back'){currentPage='cidade';render();window.scrollTo(0,0);return;}
    if(action==='city-visit'){cityVisit(b.dataset.spot);return;}
    if(action==='city-supplier'){
      const cp=cityProgress();if(cp.supplier||state.pendingNext||state.finished)return;
      const selected=CITY_SUPPLIERS.find(v=>v.id===b.dataset.supplier);if(!selected)return;
      cp.supplier=selected.id;save();hideOverlay();render();sound('cash');toast(`${selected.name}: novos custos e demanda atualizados.`);return;
    }
    if(action==='city-price-answer'){
      const cp=cityProgress();if(cp.priceDone||state.pendingNext||state.finished)return;
      const good=Number(b.dataset.answer)===1;
      cp.priceDone=true;cp.priceCorrect=good;if(good)state.reputation=clamp(state.reputation+3,0,100);
      save();hideOverlay();render();sound(good?'win':'tap');
      const fixed=fixedCost()/Math.max(1,state.quantities.reduce((a,z)=>a+z,0));
      const tech=(productCost(0)+fixed)/(.72);
      showOverlay(`<div class="city-dialog"><div class="city-dialog-eyebrow">MISSÃO 02 / RESULTADO</div><h2>${good?'Cálculo correto!':'Vamos revisar o cálculo'}</h2><p class="city-dialog-copy">O preço técnico é <strong>${money(tech)}</strong>. Primeiro somamos o custo direto de produção ao rateio fixo; depois dividimos por <b>0,72</b>, que corresponde a 100% menos 8% de taxas e 20% de margem desejada.</p><div class="city-already">${good?'✓ Boa decisão: +3 de reputação.':'Resposta registrada. Amanhã você poderá tentar outro cálculo.'}</div><button class="btn btn-primary city-dialog-full" data-action="close">Voltar ao bairro ${i('arrow')}</button></div>`);return;
    }
    if(action==='serve-customer'){
      const cp=cityProgress();
      if(state.pendingNext||state.finished||cp.deliveryDone)return;
      const expected=todayOrder();
      if(Number(b.dataset.index)!==expected){const note=document.getElementById('salesFeedback');if(note)note.textContent='Pedido diferente! Confira o produto que o cliente pediu e tente novamente.';sound('tap');return;}
      if(state.quantities[expected]<=0){const note=document.getElementById('salesFeedback');if(note)note.textContent='Não há produção planejada desse produto. Aumente a quantidade em Meu negócio antes de preparar o pedido.';sound('tap');return;}
      cp.deliveryStep++;
      if(cp.deliveryStep>=3)cp.deliveryDone=true;
      save();render();sound(cp.deliveryDone?'win':'cash');
      toast(cp.deliveryDone?'Pedidos atendidos! Procura prevista +10%':'Pedido registrado. Próximo cliente!');
      return;
    }
    if(action==='close'){hideOverlay();sound();return}
    if(action==='goto-game'){currentPage='gestao';render();window.scrollTo(0,0);return}
    if(action==='goto-expansion'){currentPage='expansao';render();window.scrollTo(0,0);sound();return}
    if(action==='edit-custom-product'){editCustomProduct(b.dataset.id);sound();return}
    if(action==='archive-custom-product'){archiveCustomProduct(b.dataset.id);return}
    if(action==='cancel-custom-edit'){render();sound();return}
    if(action==='expand-product'){confirmInvestment('product',b.dataset.id);sound();return}
    if(action==='expand-upgrade'){confirmInvestment('upgrade',b.dataset.id);sound();return}
    if(action==='confirm-investment'){purchaseInvestment(b.dataset.type,b.dataset.id);return}
    if(action==='go-market'){currentPage='mercado';render();window.scrollTo(0,0);return}
    if(action==='qty'){
      if(state.pendingNext||state.finished)return;
      const k=Number(b.dataset.index),delta=Number(b.dataset.delta);state.quantities[k]=clamp(state.quantities[k]+delta,0,120);save();render();sound();return;
    }
    if(action==='policy'){if(state.pendingNext||state.finished)return;state.policy=b.dataset.policy;save();render();sound();return}
    if(action==='scenarios'){showScenarios();sound();return}
    if(action==='apply-scenario'){
      const m=Number(b.dataset.mult);state.prices=state.prices.map(p=>clamp(Math.round(p*m*100)/100,1,100));save();hideOverlay();render();sound('cash');toast('Novo cenário aplicado ao cardápio.');return;
    }
    if(action==='scene-market'){currentPage='mercado';render();sound('paper');window.scrollTo({top:0,behavior:'smooth'});return}
    if(action==='scene-zuni'){toast(dayConfig().hint);sound();return}
    if(action==='use-market'){const idx=Number(b.dataset.index);state.prices[idx]=PRODUCTS[idx].market;save();currentPage='gestao';render();window.scrollTo(0,0);toast(PRODUCTS[idx].custom?'Preço inicial do produto aplicado.':'Preço da referência fictícia aplicado.');return}
    if(action==='challenge'){showChallenge();sound();return}
    if(action==='choose-challenge'){
      const id=Number(b.dataset.choice),choice=currentChallenge().options[id];
      if(businessCost(choice)>state.cash){toast('Essa decisão custa mais que o caixa. Escolha a outra opção ou reduza a produção.');return}
      simulate(choice,id);return;
    }
    if(action==='skip'){b.disabled=true;window.activeSimulationFinish?.();return}
    if(action==='next'){nextDay();sound();return}
    if(action==='report'){hideOverlay();currentPage='historico';render();window.scrollTo(0,0);return}
    if(action==='print'){window.print();return}
    if(action==='restart'){askRestart();return}
    if(action==='confirm-restart'){closeTour(false);resetCatalog();state=defaultState();save();currentPage='cidade';render();showIntro();sound();return}
  }
  document.addEventListener('submit',e=>{
    if(e.target.id==='customProductForm'){e.preventDefault();addCustomProduct(e.target);}
  });
  document.addEventListener('click',onClick);
  document.addEventListener('input',e=>{
    if(!e.target.matches('[data-price]'))return;
    if(state.pendingNext||state.finished)return;
    const k=Number(e.target.dataset.price),v=Number(e.target.value);
    if(Number.isFinite(v)&&v>=1&&v<=100){state.prices[k]=v;save();
      const proj=document.getElementById('projectionPanel');if(proj)proj.outerHTML=projectionPanel();
      const stat=forecast();const nums=document.querySelectorAll('.stat-value');if(nums.length>3){nums[3].textContent=shortMoney(stat.profit);nums[3].className='stat-value '+(stat.profit>=0?'is-positive':'is-negative')}
      const card=e.target.closest('.product-card');if(card){const foot=card.querySelector('.card-foot strong');const contribution=v*(1-SALES_FEES)-productCost(k);if(foot){foot.className=contribution<=0?'warn':'';foot.innerHTML=`${money(contribution)} <small>/ margem unit.**</small>`}}
      const budget=businessCost();const bar=document.querySelector('.main-actionbar');if(bar){bar.querySelector('.action-copy span').textContent=budget>state.cash?`Seu plano custa ${money(budget-state.cash)} acima do caixa. Reduza a produção.`:`${stat.made} unidades planejadas · ${money(budget)} de custos e despesas estimados.`;bar.querySelector('[data-action="challenge"]').disabled=budget>state.cash;}
    }
  });
  document.addEventListener('change',e=>{
    if(!e.target.matches('[data-price]'))return;
    const k=Number(e.target.dataset.price),v=Number(e.target.value);
    state.prices[k]=clamp(Number.isFinite(v)?v:PRODUCTS[k].defaultPrice,1,100);
    state.prices[k]=Math.round(state.prices[k]*100)/100;save();render();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if(!document.getElementById('mobileMenu').hidden){document.getElementById('mobileMenu').hidden=true;return;}if(tourActive&&!tourPaused){tourPaused=true;renderTour();return;}if(overlay.firstChild&&!overlay.querySelector('.intro-dialog,.result-dialog,.simulation-dialog,.ending-dialog'))hideOverlay();}
    if(e.key==='Enter'&&document.activeElement?.id==='shopName')start();
  });
  render();
  if(!state.started){showIntro();}
  else if(state.finished){finale();}
  else if(state.pendingNext&&state.history.length){showResult(state.history[state.history.length-1]);}
})();
