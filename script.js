document.querySelectorAll('img[src="assets/logo-horizontal.png"]').forEach(i=>i.src='assets/logo-oficial-clara.svg');
const ico=document.querySelector('link[rel="icon"]');if(ico)ico.href='assets/favicon-oficial.svg';
const menu=document.querySelector('.menu');const nav=document.querySelector('.header nav');
if(menu)menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.header nav a').forEach(a=>a.addEventListener('click',()=>nav&&nav.classList.remove('open')));

const diag=document.getElementById('diag');
if(diag){
  const gate=document.getElementById('esgGate'),result=document.getElementById('esgResult');
  const dimensions=[
    {name:'Estratégia e Governança',questions:['q1','q2'],priority:'Formalizar responsabilidades ESG e integrar os temas prioritários ao planejamento e às decisões da liderança.'},
    {name:'Ambiental e Clima',questions:['q3','q4'],priority:'Definir uma linha de base ambiental, selecionar indicadores relevantes e estabelecer metas acompanháveis.'},
    {name:'Social e Impacto',questions:['q5','q6'],priority:'Mapear públicos afetados, indicadores sociais e mecanismos formais de escuta e resposta.'},
    {name:'Integridade e Compliance',questions:['q7','q8'],priority:'Fortalecer regras de integridade, canal seguro, tratamento de relatos e evidências de supervisão.'},
    {name:'Riscos, Indicadores e Transparência',questions:['q9','q10'],priority:'Integrar riscos ESG à gestão e estruturar indicadores com fonte, responsável, meta e periodicidade.'}
  ];
  const $=id=>document.getElementById(id);
  const maturity=score=>score<=20?{name:'Inicial',summary:'A agenda ESG ainda depende de fundamentos mínimos de governança, responsabilidades e dados.'}:score<=40?{name:'Emergente',summary:'Existem iniciativas isoladas, mas faltam integração, padrão e acompanhamento sistemático.'}:score<=60?{name:'Em estruturação',summary:'A organização já possui práticas relevantes e deve conectá-las a metas, riscos, controles e decisões.'}:score<=80?{name:'Integrada',summary:'ESG está incorporado a partes relevantes da gestão, com espaço para aprofundar evidências, metas e supervisão.'}:{name:'Avançada',summary:'A organização demonstra práticas consistentes e deve concentrar-se em desempenho, qualidade das evidências e melhoria contínua.'};
  const calculate=()=>{
    const data=new FormData(diag);const scores={};
    dimensions.forEach(d=>{scores[d.name]=Math.round(d.questions.reduce((sum,q)=>sum+Number(data.get(q)),0)/d.questions.length*100)});
    return{scores,total:Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/dimensions.length)};
  };
  const renderResult=()=>{
    const data=calculate(),profile=maturity(data.total),entries=Object.entries(data.scores).sort((a,b)=>b[1]-a[1]);
    $('esgScore').textContent=data.total;$('esgDonut').style.setProperty('--score',data.total);
    $('esgHello').textContent=`${$('esgName').value}, este é o resultado da ${$('esgCompany').value}.`;
    $('esgLevel').textContent=`Maturidade ${profile.name}`;$('esgSummary').textContent=profile.summary;
    $('esgBars').innerHTML=Object.entries(data.scores).map(([name,value])=>`<div><div><span>${name}</span><b>${value}/100 · ${maturity(value).name}</b></div><i><span style="width:${value}%"></span></i></div>`).join('');
    $('esgStrong').textContent=`${entries[0][0]} (${entries[0][1]}/100). Preserve as práticas existentes e fortaleça a qualidade das evidências.`;
    $('esgWeak').textContent=`${entries.at(-1)[0]} (${entries.at(-1)[1]}/100). Esta dimensão deve receber atenção prioritária no próximo ciclo.`;
    $('esgPriorities').innerHTML=entries.slice(-3).reverse().map(([name,value],index)=>{const item=dimensions.find(d=>d.name===name);return`<li><b>${index+1}</b><div><strong>${name} · ${value}/100</strong><span>${item.priority}</span></div></li>`}).join('');
    try{localStorage.setItem('esg-brasil-diagnostico-v1',JSON.stringify({createdAt:new Date().toISOString(),name:$('esgName').value,company:$('esgCompany').value,email:$('esgEmail').value,score:data.total,level:profile.name,scores:data.scores}))}catch(error){}
  };
  diag.addEventListener('submit',event=>{event.preventDefault();if(!diag.checkValidity()){diag.reportValidity();$('diagError').textContent='Responda todas as questões para continuar.';return}$('diagError').textContent='';diag.classList.add('diag-hidden');gate.classList.remove('diag-hidden');gate.scrollIntoView({behavior:'smooth',block:'start'})});
  gate.addEventListener('submit',event=>{event.preventDefault();if(!gate.checkValidity()){gate.reportValidity();$('gateError').textContent='Preencha os campos obrigatórios e confirme a autorização para prosseguir.';return}$('gateError').textContent='';renderResult();gate.classList.add('diag-hidden');result.classList.remove('diag-hidden');result.scrollIntoView({behavior:'smooth',block:'start'})});
  $('esgRestart').addEventListener('click',()=>{diag.reset();gate.reset();try{localStorage.removeItem('esg-brasil-diagnostico-v1')}catch(error){}result.classList.add('diag-hidden');gate.classList.add('diag-hidden');diag.classList.remove('diag-hidden');$('diagError').textContent='';$('gateError').textContent='';window.scrollTo({top:0,behavior:'smooth'})});
}
