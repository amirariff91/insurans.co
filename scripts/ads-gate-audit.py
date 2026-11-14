import os,re,sys,json,html
from collections import Counter
S=sys.argv[1]
FAM=["car-insurance","negeri","perbandingan","companies","medical-cards","critical-illness","travel-insurance","home-insurance","personal-accident","motorcycle-insurance","insurans-online"]
def text_of(h):
    m=re.search(r'<main\b.*?</main>',h,re.S)
    b=m.group(0) if m else h
    for t in ['script','style','nav','header','footer','noscript','svg']:
        b=re.sub(r'<%s\b.*?</%s>'%(t,t),' ',b,flags=re.S|re.I)
    b=re.sub(r'<[^>]+>',' ',b); b=html.unescape(b)
    return re.findall(r"[a-z0-9À-ɏ]+(?:[-'][a-z0-9]+)*",b.lower())
def grams(w,n=5): return set(tuple(w[i:i+n]) for i in range(len(w)-n+1))
out={}
for f in FAM:
    d=os.path.join(S,f); pages={}
    for s in sorted(os.listdir(d)):
        p=os.path.join(d,s,'index.html')
        if not os.path.isfile(p): continue
        h=open(p,encoding='utf-8').read()
        w=text_of(h)
        m=re.search(r'<main\b.*?</main>',h,re.S); mh=m.group(0) if m else h
        links=set(re.findall(r'href="(https?://[^"]+)"',mh))
        ext=[l for l in links if 'insurans.co' not in l]
        ads=('googlesyndication.com/pagead/js/adsbygoogle.js' in h)
        ins=len(re.findall(r'<ins[^>]*adsbygoogle',h))
        noidx=bool(re.search(r'<meta[^>]+robots[^>]+noindex',h))
        pages[s]=dict(words=len(w),g=grams(w),ext=len(ext),ads=ads,ins=ins,noindex=noidx)
    # boilerplate: gram present in >=50% of siblings
    cnt=Counter(); 
    for v in pages.values(): cnt.update(v['g'])
    N=len(pages); thr=max(2,N//2)
    res=[]
    for s,v in pages.items():
        js=[len(v['g']&o['g'])/max(1,len(v['g']|o['g'])) for t,o in pages.items() if t!=s]
        bp=sum(1 for g in v['g'] if cnt[g]>=thr)/max(1,len(v['g']))
        mx=max(js) if js else 0; mn=sum(js)/len(js) if js else 0
        best=[t for t,o in pages.items() if t!=s and len(v['g']&o['g'])/max(1,len(v['g']|o['g']))==mx]
        res.append(dict(slug=s,words=v['words'],boiler=round(bp,2),jmax=round(mx,3),jmean=round(mn,3),nearest=best[0] if best else '',ext=v['ext'],ads=v['ads'],ins=v['ins'],noindex=v['noindex'],gatefail=(v['words']<700 or mx>=0.35)))
    out[f]=res
json.dump(out,open(sys.argv[2],'w'),indent=1)
for f,res in out.items():
    n=len(res); import statistics as st
    print(f"\n## {f} n={n} words med={st.median(r['words'] for r in res)} min={min(r['words'] for r in res)} boiler med={st.median(r['boiler'] for r in res)} jmax med={st.median(r['jmax'] for r in res)} max={max(r['jmax'] for r in res)} ext med={st.median(r['ext'] for r in res)} ads={sum(r['ads'] for r in res)} noindex={sum(r['noindex'] for r in res)} adsOnGateFail={sum(r['ads'] and r['gatefail'] for r in res)}")
    for r in sorted(res,key=lambda r:-r['jmax']):
        print(f"  {r['slug'][:42]:42} w={r['words']:5} bp={r['boiler']:.2f} jmax={r['jmax']:.3f} jmean={r['jmean']:.3f} ext={r['ext']:2} ads={int(r['ads'])} ni={int(r['noindex'])} near={r['nearest'][:30]}")
