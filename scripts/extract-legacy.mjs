// Converts the old site's html/*.php pages (windows-1252) into plain-text dumps in text/, used by import-legacy.mjs.
import fs from 'fs'; import path from 'path'
const decodeCf = hex => { const k = parseInt(hex.slice(0,2),16); let s=''; for (let i=2;i<hex.length;i+=2) s+=String.fromCharCode(parseInt(hex.slice(i,i+2),16)^k); return s }
const ent = {nbsp:' ',amp:'&',lt:'<',gt:'>',quot:'"',rsquo:'’',lsquo:'‘',ldquo:'“',rdquo:'”',hellip:'…',ndash:'–',mdash:'—',laquo:'«',raquo:'»',deg:'°',eacute:'é',egrave:'è',ecirc:'ê',euml:'ë',agrave:'à',acirc:'â',ccedil:'ç',ocirc:'ô',ucirc:'û',ugrave:'ù',icirc:'î',iuml:'ï',Eacute:'É',Egrave:'È',Agrave:'À',Ccedil:'Ç',Ecirc:'Ê',oelig:'œ',copy:'©',reg:'®',frac12:'½',ordm:'º',sup2:'²',uuml:'ü',ouml:'ö',auml:'ä',aacute:'á',oacute:'ó',iacute:'í',uacute:'ú',ntilde:'ñ',Ouml:'Ö',times:'×',middot:'·',bull:'•',euro:'€',Acirc:'Â',Ocirc:'Ô',Icirc:'Î',Ucirc:'Û',Euml:'Ë',Iuml:'Ï',Aacute:'Á',Oacute:'Ó',Uacute:'Ú',Iacute:'Í',Ntilde:'Ñ',Uuml:'Ü',Auml:'Ä',sbquo:'‚',bdquo:'„',dagger:'†',trade:'™',shy:''}
const dec = s => s.replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&([a-zA-Z0-9]+);/g,(m,n)=>ent[n]??m)
function toText(h){
  h = h.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,'')
  h = h.replace(/<a[^>]*href="\/cdn-cgi\/l\/email-protection#([0-9a-f]+)"[^>]*>([\s\S]*?)<\/a>/gi,(m,x,inner)=>' '+inner.replace(/<span[^>]*data-cfemail="[0-9a-f]+"[^>]*>[\s\S]*?<\/span>/gi,'')+' ['+decodeCf(x)+'] ')
  h = h.replace(/<span[^>]*data-cfemail="([0-9a-f]+)"[^>]*>[\s\S]*?<\/span>/gi,(_,x)=>decodeCf(x))
  h = h.replace(/<a[^>]*class="__cf_email__"[^>]*data-cfemail="([0-9a-f]+)"[^>]*>[\s\S]*?<\/a>/gi,(_,x)=>decodeCf(x))
  h = h.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi,(_,s)=>` [IMG ${s}] `)
  h = h.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,(_,u,t)=>`${t} {{${u}}}`)
  h = h.replace(/<\/t[dh]>/gi,' | ').replace(/<tr[^>]*>/gi,'\n').replace(/<br\s*\/?>/gi,'\n').replace(/<\/(p|div|h\d|li|table|ul)>/gi,'\n').replace(/<li[^>]*>/gi,'\n- ').replace(/<h(\d)[^>]*>/gi,(_,n)=>'\n'+'#'.repeat(+n)+' ')
  h = h.replace(/<[^>]+>/g,'')
  h = dec(h)
  return h.split('\n').map(l=>l.replace(/[ \t ]+/g,' ').trim()).filter((l,i,a)=>l || (a[i-1])).join('\n').replace(/\n{3,}/g,'\n\n').trim()
}
fs.mkdirSync('text',{recursive:true})
const files = fs.readdirSync('html').map(f=>'html/'+f).concat(['challenge.html','index.html'])
for (const f of files){
  let h = new TextDecoder('windows-1252').decode(fs.readFileSync(f))
  if (/charset=utf-8/i.test(h.slice(0,3000))) h = fs.readFileSync(f,'utf8')
  let start = h.indexOf('Contenu principale'); if (start<0){ const m = h.search(/<div id="menu"/i); start = m }
  let body = h.slice(Math.max(0,start))
  // drop menu block if still present
  if (/id="menu"/.test(body.slice(0,500))){ const end = body.indexOf('<div style="clear: both"></div>'); if(end>0) body = body.slice(end) }
  const foot = body.search(/<div id="footer"/i); if (foot>0) body = body.slice(0,foot)
  fs.writeFileSync('text/'+path.basename(f).replace(/\.(php|html)$/,'.txt'), toText(body))
}
console.log('done', files.length)
