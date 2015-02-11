/** Copyright 2012 Vuk Djapic Some Rights Reserved 
	Програм је бесплатан за коришћење.
	Контакт  djapic [ет] yandex.ru


	*********** НАЧИН КОРИШЋЕЊА *********** 
	1.корак
	-------
	У html документу унутар <head> ... </head> секције упишите (свеједно где):
	<script type="text/javascript" src="putanja/do/fajla/cirilica.js"></script>

	2.корак
	-------
	Унутар <body> ... </body> секције:
		
		1.случај - Промена језика кликом на линк
		Тамо где желите да буде на страници поставите линк:			
			<a href="javascript:cirilica()"> Ваш текст за промену писма </a>			- мења једнократно садржај на ћирилицу
			<a href="javascript:cirilica_kuki()"> Ваш текст за промену писма </a>		- мења и памти за остале странице
			<a href="javascript:cirilica_kuki(false)"> Ваш текст за промену писма </a>	- враћа на оригинално стање
		
		2.случај - Промена језика по учитавању странице и друге опције
		Било где упишите:
		<script type="text/javascript">
			CIR.enabled =true;	//da se promeni u cirilicu po ucitavanju
			CIR.cookie_enabled =false;	//samo ako hocete da sve stranice uvek budu cirilicom postavite na true!
			CIR.trenutno='cirilica';	//ako postoji i postavljeno na 'cirilica' onda ce menjati u latinicu
		</script>
	
	И то је све!
	
	Напомена: У случају да због проблема или из неког другог разлога део ХТМЛ документа не треба да буде промењен, онда одговарајућем елементу
	додати class="neprev" атрибут.
	Пример: <div id="levimeni">  -->  <div id="levimeni" class="neprev">
	Или ако елемент већ има class атрибут: <div id="levimeni" class="beli">  -->  <div id="levimeni" class="beli neprev">
		
*/

var CIR ={}

CIR.lat ="ABVGDĐEŽZIJKLMNOPRSTĆUFHCČŠabvgdđežzijklmnoprstćufhcčš"
CIR.cir ="АБВГДЂЕЖЗИЈКЛМНОПРСТЋУФХЦЧШабвгдђежзијклмнопрстћуфхцчш"
CIR.dvoznaci ={DJ:'Ђ',Dj:'Ђ',dj:'ђ',LJ:'Љ',Lj:'Љ',lj:'љ',NJ:'Њ',Nj:'Њ',nj:'њ',DZ:'Џ',Dz:'Џ',dz:'џ',DŽ:'Џ',Dž:'Џ',dž:'џ'}
CIR.atrObjs ={IMG:['alt','title'], A:['title']}
CIR.iskljuciEl ={SCRIPT:{}, STYLE:{}}

CIR.tekstovi =[]

CIR.kukistring ="cirilica"
CIR.neprevClass ="neprev"
CIR.urlMatcher =/^((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\w+[-_~]*\.\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;	//moj, ispravljeno za host

function obidji(cvor, dubina){
	switch(cvor.nodeType){
		case 1:                
			if( _obilaziEl(cvor) ){
				obidjiElement(cvor,dubina); 
			} else {
				//console.log('Preskacem element'+cvor.tagName)
			}
			break;
		case 2: obidjiAtr(cvor); break;
		case 3: obidjiTextZamena(cvor);break;//obidjiText(cvor); break;
		//default: console.info('Preskacem '+cvor.nodeName+':'+cvor.nodeValue);
	}
}
function obidjiElement(el, dubina){
	//console.info('Obilazim element '+el+' '+el.nodeName);
	if(dubina<=0) return;
	var i, realatr       
	var deca =el.childNodes
   
	var listaAtr =_dajAtr(el)
	var brAtr =listaAtr.length
	if(brAtr>0){
		var atrs =el.attributes
		var duz =atrs.length
		for(i=0; i<brAtr; i++){
			realatr =atrs.getNamedItem(listaAtr[i])
			if(realatr!=null){
				obidjiAtr(realatr)
			}
		}
	}
	duz =deca.length
	for(i=0; i<duz; i++){
		obidji(deca[i],dubina-1)
	}
}
function obidjiAtr(atr){       
	//console.log('Obilazim atr: '+atr+' '+atr.nodeName+':'+atr.nodeValue);       
	//CIR.tekstovi.push(atr.nodeValue)
	atr.value =prevod(atr.value);
}
/*
function obidjiText(tx){
	//console.log('Obilazim tekst: '+tx+' '+tx.nodeValue);
	var trimed =tx.nodeValue.trim()
	if(trimed!='') CIR.tekstovi.push(trimed)
}
*/

function obidjiTextZamena(tx){
	//console.log('Obilazim tekst: '+tx+' '+tx.nodeValue);
	var ntekst =document.createTextNode( prevod(tx.nodeValue) )
	tx.parentNode.replaceChild(ntekst,tx)
}

function _obilaziEl(el){	
	var klasa =el.attributes.getNamedItem('class') 
	var neprev =klasa? klasa.value.indexOf(CIR.neprevClass)>=0 : false
	if ( (el.tagName in CIR.iskljuciEl) || neprev ){
		return false
	} else if (el.tagName.toLowerCase()=='a') {
		var link =el.innerHTML.trim();
		if (CIR.urlMatcher.test(link) || CIR.urlMatcher.test('http://'+link) ){
			return false;			
		} 
	} 
	return true;
}
/**vraca listu atributa za ovaj cvor*/
function _dajAtr(cvor){   
	var tipInputa =null;
	if(cvor.tagName=='INPUT'){
		tipInputa =cvor.attributes.getNamedItem('type');
		if(tipInputa){
			tipInputa =tipInputa.value;
		}
	}
	
	if (cvor.tagName in CIR.atrObjs){    
		return CIR.atrObjs[cvor.tagName]
	} else if( tipInputa=='button' || tipInputa=='submit' ){	//za dugme da se promeni tekst na njemu	
		return ['value'];
	} else {
		return [];
	}
}

function obilazakZamena(cvor,dubina){
	dubina =dubina || 20
	CIR.tekstovi =[]
	obidji(cvor,dubina)
	//console.info(CIR.tekstovi)
	//debugger
	
/*	var ceotekst =cvor.innerHTML
	var noviTNiz =[]
	var i,ind,duz,tekst, prviind =0 //, indmanje, izlazmanje, pomchar
	for(i=0; i<CIR.tekstovi.length; i++){
		tekst =CIR.tekstovi[i]		
		ind =ceotekst.indexOf(tekst)
		
		if(ind>=0){
			noviTNiz.push( ceotekst.substring(prviind,ind) )
			noviTNiz.push( prevod(tekst) )
			ceotekst =ceotekst.substring(ind+tekst.length)
		}                                   
	}
	noviTNiz.push( ceotekst )
	cvor.innerHTML =noviTNiz.join('')
	return noviTNiz
*/
}

function prevod(tekst){
	var i=0, duz =tekst.length, ch, dvoznak, reztekst =[], indu
	while(i<duz){
		dvoznak =undefined
		ch =tekst.charAt(i)
		if(i<duz-1){
			dvoznak =CIR.dvoznaci[ch+tekst.charAt(i+1)]
		}
		if(dvoznak && !(CIR.trenutno=='cirilica') ){		//u cirilici nema dvoznaka, kad se dobije sa sajta
			reztekst.push(dvoznak)
			i++
		} else {
			if(CIR.trenutno=='cirilica'){
				indu =CIR.cir.indexOf(ch)
				if(indu>0){
					reztekst.push( CIR.lat[indu] )
				} else {
					reztekst.push(ch)
				}
			} else {
				indu =CIR.lat.indexOf(ch)
				if(indu>0){
					reztekst.push( CIR.cir[indu] )
				} else {
					reztekst.push(ch)
				}				
			}
		}
		i++
	}
	return reztekst.join('')
}

//=======javno

function cirilica(){
	obilazakZamena(document.head,5)
	obilazakZamena(document.body)
}

function cirilica_onload(){	
	if(CIR.cookie_enabled && document.cookie.indexOf(CIR.kukistring)>=0){
		cirilica_kuki();
	} else if (CIR.enabled) {
		cirilica();
	}		
}

/**parametar:	
	bez ili true - promeni na cir i stavi kuki
	false - ukloni kuki i vrati na staro	
	
*/
function cirilica_kuki(stavi){
	if(stavi===false){
		datum =new Date()
		datum.setTime(datum.getTime()-1)
		document.cookie =CIR.kukistring+'=true; expires=' +datum.toUTCString()
		location.reload()
	} else {
		cirilica()
		document.cookie =CIR.kukistring+'=true'
	}  
}

CIR.cirilica =cirilica;
CIR.cirilica_onload =cirilica_onload;
CIR.cirilica_kuki =cirilica_kuki;

/*if (window.addEventListener) {
	window.addEventListener('load', cirilica_onload, false);	
} else if (window.attachEvent) {
	window.attachEvent('onload', cirilica_onload );
}*/

/**za Firefox addon*/
//exports.cirilica =CIR;
cirilica();