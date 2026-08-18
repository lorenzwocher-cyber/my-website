/* Gemeinsame Sprachumschaltung für alle Seiten außer dem Databook.
   Deutsch steht im HTML, Englisch in SITE.dict.en. Beim Start wird der deutsche
   Stand aus dem DOM übernommen, dadurch gibt es nur eine Quelle für Deutsch.
   Die Sprache steht im Hash, damit Links teilbar sind. Kein Browser-Speicher. */
var SITE = (function(){
  var lng='de', dict={de:{},en:{}};

  function snapshotDE(){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      dict.de[el.dataset.i18n]=el.innerHTML;
    });
  }
  function apply(){
    document.documentElement.lang=lng;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.dataset.i18n, v=dict[lng]&&dict[lng][k];
      el.innerHTML=(v!=null)?v:(dict.de[k]!=null?dict.de[k]:el.innerHTML);
    });
    document.querySelectorAll('#lang button').forEach(function(b){
      b.setAttribute('aria-pressed',String(b.dataset.lng===lng));
    });
    /* Databook-Links tragen die Sprache mit, damit der Wechsel nicht verloren geht */
    document.querySelectorAll('[data-db]').forEach(function(a){
      a.setAttribute('href','databook.html#'+lng+'/ov');
    });
    /* interne Seitenlinks behalten die Sprache */
    document.querySelectorAll('a[href$=".html"]:not([data-db])').forEach(function(a){
      var base=a.getAttribute('href').split('#')[0];
      if(base==='databook.html')return;
      a.setAttribute('href',base+(lng==='en'?'#en':''));
    });
  }
  function readHash(){
    var h=location.hash.replace('#','').split('/')[0];
    if(h==='de'||h==='en')lng=h;
  }
  function init(){
    snapshotDE();
    readHash();
    apply();
    document.querySelectorAll('#lang button').forEach(function(b){
      b.onclick=function(){
        if(b.dataset.lng===lng)return;
        lng=b.dataset.lng;
        history.replaceState(null,'','#'+lng);
        apply();
      };
    });
    addEventListener('hashchange',function(){var p=lng;readHash();if(p!==lng)apply();});
  }
  return {dict:dict, init:init, get lng(){return lng;}};
})();
