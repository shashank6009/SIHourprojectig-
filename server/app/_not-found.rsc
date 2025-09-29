1:"$Sreact.fragment"
2:I[152368,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"LocaleProvider"]
3:I[390464,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"AuthProvider"]
4:I[533032,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"OfflineStatus"]
5:I[374436,["/_next/static/chunks/6daff8ef2b433817.js","/_next/static/chunks/7fd15c62267ce198.js","/_next/static/chunks/67a85a818ab17ad4.js","/_next/static/chunks/c4897d6ba845b6ad.js","/_next/static/chunks/821584a770935f13.js","/_next/static/chunks/199d53cf900830e4.js","/_next/static/chunks/780d3f03641ff48f.js"],"AppWrapper"]
6:I[339756,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"default"]
7:I[837457,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"default"]
e:I[168027,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"default"]
:HL["/_next/static/chunks/3a2c2dd945b6c581.css","style"]
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
          0:{"P":null,"b":"rpi-Dl6KAbdVlUzVI1XLM","p":"","c":["","_not-found",""],"i":false,"f":[[["",{"children":["/_not-found",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/3a2c2dd945b6c581.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/6daff8ef2b433817.js","async":true,"nonce":"$undefined"}],["$","script","script-1",{"src":"/_next/static/chunks/7fd15c62267ce198.js","async":true,"nonce":"$undefined"}],["$","script","script-2",{"src":"/_next/static/chunks/67a85a818ab17ad4.js","async":true,"nonce":"$undefined"}],["$","script","script-3",{"src":"/_next/static/chunks/c4897d6ba845b6ad.js","async":true,"nonce":"$undefined"}],["$","script","script-4",{"src":"/_next/static/chunks/821584a770935f13.js","async":true,"nonce":"$undefined"}],["$","script","script-5",{"src":"/_next/static/chunks/199d53cf900830e4.js","async":true,"nonce":"$undefined"}],["$","script","script-6",{"src":"/_next/static/chunks/780d3f03641ff48f.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","className":"noto_sans_2cfd0bc4-module__s5HSmG__variable noto_sans_cad03a3-module__fjJJ1q__variable noto_sans_5639277-module__Kdogyq__variable","children":[["$","head",null,{"children":["$","meta",null,{"name":"viewport","content":"width=device-width, initial-scale=1"}]}],["$","body",null,{"className":"noto_sans_2cfd0bc4-module__s5HSmG__className","children":[["$","a",null,{"href":"#main-content","className":"sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gov-navy text-white px-4 py-2 rounded z-50","children":"Skip to content"}],["$","$L2",null,{"children":["$","$L3",null,{"children":[["$","$L4",null,{}],["$","$L5",null,{"children":["$","$L6",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]]}]}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$8"}}],"$L9","$La"]}]]}]]}],{"children":["/_not-found","$Lb",{"children":["__PAGE__","$Lc",{},null,false]},null,false]},null,false],"$Ld",false]],"m":"$undefined","G":["$e","$undefined"],"s":false,"S":true}
f:I[897367,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"OutletBoundary"]
11:I[711533,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"AsyncMetadataOutlet"]
13:I[897367,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"ViewportBoundary"]
15:I[897367,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"MetadataBoundary"]
16:"$Sreact.suspense"
9:["$","elevenlabs-convai",null,{"agent-id":"agent_9201k5sry698e14sf58cpbyfrdkx"}]
a:["$","script",null,{"src":"https://unpkg.com/@elevenlabs/convai-widget-embed","async":true,"type":"text/javascript"}]
b:["$","$1","c",{"children":[null,["$","$L6",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L7",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
c:["$","$1","c",{"children":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":"$0:f:0:1:1:props:children:1:props:children:1:props:children:1:props:children:props:children:1:props:children:props:notFound:0:1:props:style","children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":"$0:f:0:1:1:props:children:1:props:children:1:props:children:1:props:children:props:children:1:props:children:props:notFound:0:1:props:children:props:children:1:props:style","children":404}],["$","div",null,{"style":"$0:f:0:1:1:props:children:1:props:children:1:props:children:1:props:children:props:children:1:props:children:props:notFound:0:1:props:children:props:children:2:props:style","children":["$","h2",null,{"style":"$0:f:0:1:1:props:children:1:props:children:1:props:children:1:props:children:props:children:1:props:children:props:notFound:0:1:props:children:props:children:2:props:children:props:style","children":"This page could not be found."}]}]]}]}]],null,["$","$Lf",null,{"children":["$L10",["$","$L11",null,{"promise":"$@12"}]]}]]}]
d:["$","$1","h",{"children":[["$","meta",null,{"name":"robots","content":"noindex"}],[["$","$L13",null,{"children":"$L14"}],["$","meta",null,{"name":"next-size-adjust","content":""}]],["$","$L15",null,{"children":["$","div",null,{"hidden":true,"children":["$","$16",null,{"fallback":null,"children":"$L17"}]}]}]]}]
14:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","2",{"name":"theme-color","content":"#0B3D91"}]]
10:null
18:I[27201,["/_next/static/chunks/d96012bcfc98706a.js","/_next/static/chunks/2532f69a4166d704.js"],"IconMark"]
12:{"metadata":[["$","title","0",{"children":"Prime Minister's Internship Scheme (PMIS)"}],["$","meta","1",{"name":"description","content":"Official portal for the Prime Minister's Internship Scheme - Apply for internships, manage your profile, and access government opportunities offline"}],["$","meta","2",{"name":"author","content":"Government of India"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"PM Internship,Government Internship,India,Career,Jobs,Students"}],["$","meta","5",{"name":"creator","content":"Ministry of Corporate Affairs"}],["$","meta","6",{"name":"publisher","content":"Government of India"}],["$","meta","7",{"name":"format-detection","content":"telephone=no, address=no, email=no"}],["$","meta","8",{"name":"mobile-web-app-capable","content":"yes"}],["$","meta","9",{"name":"apple-mobile-web-app-title","content":"PMIS Portal"}],["$","meta","10",{"name":"apple-mobile-web-app-status-bar-style","content":"default"}],["$","meta","11",{"property":"og:title","content":"PM Internship Scheme Portal"}],["$","meta","12",{"property":"og:description","content":"Official portal for applying to government internship opportunities"}],["$","meta","13",{"property":"og:url","content":"https://pminternship.mca.gov.in/"}],["$","meta","14",{"property":"og:site_name","content":"PM Internship Scheme"}],["$","meta","15",{"property":"og:locale","content":"en_IN"}],["$","meta","16",{"property":"og:image","content":"http://localhost:3000/pwa-screenshots/desktop-home.png"}],["$","meta","17",{"property":"og:image:width","content":"1280"}],["$","meta","18",{"property":"og:image:height","content":"720"}],["$","meta","19",{"property":"og:image:alt","content":"PM Internship Scheme Portal"}],["$","meta","20",{"property":"og:type","content":"website"}],["$","meta","21",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","22",{"name":"twitter:title","content":"PM Internship Scheme Portal"}],["$","meta","23",{"name":"twitter:description","content":"Apply for government internships - Available offline"}],["$","meta","24",{"name":"twitter:image","content":"http://localhost:3000/pwa-screenshots/desktop-home.png"}],["$","link","25",{"rel":"icon","href":"/favicon.ico?favicon.0b3bf435.ico","sizes":"256x256","type":"image/x-icon"}],["$","link","26",{"rel":"icon","href":"/pwa-icons/icon-192x192.png","sizes":"192x192","type":"image/png"}],["$","link","27",{"rel":"icon","href":"/pwa-icons/icon-512x512.png","sizes":"512x512","type":"image/png"}],["$","link","28",{"rel":"apple-touch-icon","href":"/pwa-icons/icon-152x152.png","sizes":"152x152","type":"image/png"}],["$","link","29",{"rel":"apple-touch-icon","href":"/pwa-icons/icon-192x192.png","sizes":"192x192","type":"image/png"}],["$","$L18","30",{}]],"error":null,"digest":"$undefined"}
17:"$12:metadata"
