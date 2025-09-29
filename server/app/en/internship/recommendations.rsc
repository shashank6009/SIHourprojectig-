1:"$Sreact.fragment"
2:I[152368,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"LocaleProvider"]
3:I[390464,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"AuthProvider"]
4:I[533032,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"OfflineStatus"]
5:I[374436,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"AppWrapper"]
6:I[339756,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"default"]
7:I[837457,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"default"]
10:I[168027,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"default"]
:HL["/_next/static/chunks/3a2c2dd945b6c581.css","style"]
:HL["/_next/static/media/05ce0245cbf07d46-s.p.bde6fdef.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/dc6d2a64e9dbf3bc-s.p.4b9eb7a1.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/fb34704f4f4f68ab-s.p.ce643c06.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
8:T85e,
            document.addEventListener('DOMContentLoaded', function() {
              // Nuclear download prevention
              const preventDownloads = (e) => {
                const target = e.target;
                if (target.tagName === 'A') {
                  const anchor = target;
                  if (anchor.download || anchor.href.includes('blob:') || anchor.href.includes('data:') || anchor.href.includes('download')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('🚫 DOWNLOAD BLOCKED:', anchor.href);
                    alert('Download functionality has been disabled on this site.');
                    return false;
                  }
                }
                // Block any programmatic blob/data URL navigation
                if (target.click && (target.href?.includes('blob:') || target.href?.includes('data:'))) {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🚫 PROGRAMMATIC DOWNLOAD BLOCKED');
                  return false;
                }
              };
              
              // Add multiple levels of download prevention
              document.addEventListener('click', preventDownloads, true);
              document.addEventListener('mousedown', preventDownloads, true);
              document.addEventListener('auxclick', preventDownloads, true);
              
              // Override window.open for blob/data URLs
              const originalOpen = window.open;
              window.open = function(url, ...args) {
                if (typeof url === 'string' && (url.includes('blob:') || url.includes('data:'))) {
                  console.log('🚫 WINDOW.OPEN DOWNLOAD BLOCKED:', url);
                  alert('Download functionality has been disabled.');
                  return null;
                }
                return originalOpen.call(this, url, ...args);
              };
              
              console.log('✅ Global download prevention activated');
            });
          0:{"P":null,"b":"z9QK1SqCKjs-wy4-zx3nD","p":"","c":["","en","internship","recommendations",""],"i":false,"f":[[["",{"children":[["locale","en","d"],{"children":["internship",{"children":["recommendations",{"children":["__PAGE__",{}]}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/3a2c2dd945b6c581.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/6daff8ef2b433817.js","async":true,"nonce":"$undefined"}],["$","script","script-1",{"src":"/_next/static/chunks/7fd15c62267ce198.js","async":true,"nonce":"$undefined"}],["$","script","script-2",{"src":"/_next/static/chunks/67a85a818ab17ad4.js","async":true,"nonce":"$undefined"}],["$","script","script-3",{"src":"/_next/static/chunks/c4897d6ba845b6ad.js","async":true,"nonce":"$undefined"}],["$","script","script-4",{"src":"/_next/static/chunks/821584a770935f13.js","async":true,"nonce":"$undefined"}],["$","script","script-5",{"src":"/_next/static/chunks/199d53cf900830e4.js","async":true,"nonce":"$undefined"}],["$","script","script-6",{"src":"/_next/static/chunks/780d3f03641ff48f.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","className":"noto_sans_2cfd0bc4-module__s5HSmG__variable noto_sans_cad03a3-module__fjJJ1q__variable noto_sans_5639277-module__Kdogyq__variable","children":[["$","head",null,{"children":["$","meta",null,{"name":"viewport","content":"width=device-width, initial-scale=1"}]}],["$","body",null,{"className":"noto_sans_2cfd0bc4-module__s5HSmG__className","children":[["$","a",null,{"href":"#main-content","className":"sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gov-navy text-white px-4 py-2 rounded z-50","children":"Skip to content"}],["$","$L2",null,{"children":["$","$L3",null,{"children":[["$","$L4",null,{}],["$","$L5",null,{"children":["$","$L6",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]]}]}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$8"}}],"$L9","$La"]}]]}]]}],{"children":[["locale","en","d"],"$Lb",{"children":["internship","$Lc",{"children":["recommendations","$Ld",{"children":["__PAGE__","$Le",{},null,false]},null,false]},null,false]},null,false]},null,false],"$Lf",false]],"m":"$undefined","G":["$10",["$L11"]],"s":false,"S":true}
13:I[92825,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"ClientSegmentRoot"]
14:I[377206,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js","/_next/static/chunks/fa4f91eb3ef7e073.js"],"default"]
16:I[347257,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"ClientPageRoot"]
17:I[566523,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js","/_next/static/chunks/fa4f91eb3ef7e073.js","/_next/static/chunks/2d800b30a5b1d7ae.js","/_next/static/chunks/0459324a727c24b3.js","/_next/static/chunks/22fdba5f5e752542.js","/_next/static/chunks/1994204eff88f512.js"],"default"]
1a:I[897367,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"OutletBoundary"]
1c:I[711533,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"AsyncMetadataOutlet"]
1e:I[897367,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"ViewportBoundary"]
20:I[897367,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"MetadataBoundary"]
21:"$Sreact.suspense"
9:["$","elevenlabs-convai",null,{"agent-id":"agent_9201k5sry698e14sf58cpbyfrdkx"}]
a:["$","script",null,{"src":"https://unpkg.com/@elevenlabs/convai-widget-embed","async":true,"type":"text/javascript"}]
b:["$","$1","c",{"children":[null,"$L12"]}]
c:["$","$1","c",{"children":[[["$","script","script-0",{"src":"/_next/static/chunks/fa4f91eb3ef7e073.js","async":true,"nonce":"$undefined"}]],["$","$L13",null,{"Component":"$14","slots":{"children":["$","$L6",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]},"params":{"locale":"en"},"promise":"$@15"}]]}]
d:["$","$1","c",{"children":[null,["$","$L6",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
e:["$","$1","c",{"children":[["$","$L16",null,{"Component":"$17","searchParams":{},"params":"$c:props:children:1:props:params","promises":["$@18","$@19"]}],[["$","script","script-0",{"src":"/_next/static/chunks/2d800b30a5b1d7ae.js","async":true,"nonce":"$undefined"}],["$","script","script-1",{"src":"/_next/static/chunks/0459324a727c24b3.js","async":true,"nonce":"$undefined"}],["$","script","script-2",{"src":"/_next/static/chunks/22fdba5f5e752542.js","async":true,"nonce":"$undefined"}],["$","script","script-3",{"src":"/_next/static/chunks/1994204eff88f512.js","async":true,"nonce":"$undefined"}]],["$","$L1a",null,{"children":["$L1b",["$","$L1c",null,{"promise":"$@1d"}]]}]]}]
f:["$","$1","h",{"children":[null,[["$","$L1e",null,{"children":"$L1f"}],["$","meta",null,{"name":"next-size-adjust","content":""}]],["$","$L20",null,{"children":["$","div",null,{"hidden":true,"children":["$","$21",null,{"fallback":null,"children":"$L22"}]}]}]]}]
11:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/3a2c2dd945b6c581.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]
23:I[492370,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js","/_next/static/chunks/1e64206f26b2a81c.js","/_next/static/chunks/86676879ef2fce89.js"],"default"]
15:"$c:props:children:1:props:params"
18:{}
19:"$c:props:children:1:props:params"
12:["$","$L6",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","$L23",null,{}],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]
1f:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","2",{"name":"theme-color","content":"#0B3D91"}]]
1b:null
24:I[27201,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"IconMark"]
1d:{"metadata":[["$","title","0",{"children":"PM Internship Scheme Portal"}],["$","meta","1",{"name":"description","content":"Official portal for the Prime Minister's Internship Scheme"}],["$","meta","2",{"name":"author","content":"Government of India"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"PM Internship,Government Internship,India,Career,Jobs,Students"}],["$","meta","5",{"name":"creator","content":"Ministry of Corporate Affairs"}],["$","meta","6",{"name":"publisher","content":"Government of India"}],["$","link","7",{"rel":"canonical","href":"/en"}],["$","link","8",{"rel":"alternate","hrefLang":"en","href":"/en"}],["$","link","9",{"rel":"alternate","hrefLang":"ta","href":"/ta"}],["$","link","10",{"rel":"alternate","hrefLang":"hi","href":"/hi"}],["$","meta","11",{"name":"format-detection","content":"telephone=no, address=no, email=no"}],["$","meta","12",{"name":"mobile-web-app-capable","content":"yes"}],["$","meta","13",{"name":"apple-mobile-web-app-title","content":"PMIS Portal"}],["$","meta","14",{"name":"apple-mobile-web-app-status-bar-style","content":"default"}],["$","meta","15",{"property":"og:title","content":"PM Internship Scheme Portal"}],["$","meta","16",{"property":"og:description","content":"Official portal for applying to government internship opportunities"}],["$","meta","17",{"property":"og:url","content":"https://pminternship.mca.gov.in/"}],["$","meta","18",{"property":"og:site_name","content":"PM Internship Scheme"}],["$","meta","19",{"property":"og:locale","content":"en_IN"}],["$","meta","20",{"property":"og:image","content":"http://localhost:3000/pwa-screenshots/desktop-home.png"}],["$","meta","21",{"property":"og:image:width","content":"1280"}],["$","meta","22",{"property":"og:image:height","content":"720"}],["$","meta","23",{"property":"og:image:alt","content":"PM Internship Scheme Portal"}],["$","meta","24",{"property":"og:type","content":"website"}],["$","meta","25",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","26",{"name":"twitter:title","content":"PM Internship Scheme Portal"}],["$","meta","27",{"name":"twitter:description","content":"Apply for government internships - Available offline"}],["$","meta","28",{"name":"twitter:image","content":"http://localhost:3000/pwa-screenshots/desktop-home.png"}],["$","link","29",{"rel":"icon","href":"/favicon.ico?favicon.0b3bf435.ico","sizes":"256x256","type":"image/x-icon"}],["$","link","30",{"rel":"icon","href":"/pwa-icons/icon-192x192.png","sizes":"192x192","type":"image/png"}],["$","link","31",{"rel":"icon","href":"/pwa-icons/icon-512x512.png","sizes":"512x512","type":"image/png"}],["$","link","32",{"rel":"apple-touch-icon","href":"/pwa-icons/icon-152x152.png","sizes":"152x152","type":"image/png"}],["$","link","33",{"rel":"apple-touch-icon","href":"/pwa-icons/icon-192x192.png","sizes":"192x192","type":"image/png"}],["$","$L24","34",{}]],"error":null,"digest":"$undefined"}
22:"$1d:metadata"
