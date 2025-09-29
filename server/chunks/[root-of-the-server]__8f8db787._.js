module.exports=[254799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},688947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},792509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},921517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},524836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},406461,(e,t,r)=>{t.exports=e.x("zlib",()=>require("zlib"))},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},120635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},961724,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-route-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-route-turbo.runtime.prod.js"))},126432,e=>{"use strict";e.s(["enforceRegion",()=>a,"redactForModel",()=>n,"requireConsent",()=>s]);var t=e.i(595088),r=e.i(921991);async function s(r,s){let n=await (0,t.hasConsentForScopes)(r,s);if(n.granted){let{data:t}=await e.A(890278).then(e=>e.getConsentHistory(r)),s=t?.[0];return{ok:!0,version:s?.policy_version||process.env.POLICY_VERSION||"2025-09-28",region:s?.region||process.env.PRIVACY_DEFAULT_REGION||"IN"}}return{ok:!1,missing:n.missing}}function n(e){return(0,r.redactSensitive)(e)}function a(e,t){return"true"!==process.env.PRIVACY_BLOCK_EXTERNAL_LLM&&("EU"!==t||"openai"!==e||process.env.OPENAI_EU_COMPLIANT)&&("US"!==t||"anthropic"!==e||process.env.ANTHROPIC_US_COMPLIANT)?"allow":"route_local"}},572783,921991,e=>{"use strict";e.s(["getProcessingLogsByAction",()=>u,"getProcessingStats",()=>d,"getUserProcessingLogs",()=>c,"logProcessing",()=>l],572783);var t=e.i(362693);e.s(["decryptJSON",()=>o,"encryptJSON",()=>a,"redactSensitive",()=>i],921991);var r=e.i(254799);function s(){let e=process.env.MASTER_KEY_HEX;if(!e)throw Error("MASTER_KEY_HEX environment variable is required");if(64!==e.length)throw Error("MASTER_KEY_HEX must be 64 hex characters (32 bytes)");try{return Buffer.from(e,"hex")}catch(e){throw Error("Invalid MASTER_KEY_HEX format")}}function n(e){return(0,r.createHash)("sha256").update(e).digest().subarray(0,12)}function a(e){let t=s(),a=(0,r.randomBytes)(32),o=(0,r.randomBytes)(16),i=n(o),l=JSON.stringify(e),c=(0,r.createCipher)("aes-256-gcm",a);c.setAAD(o);let u=c.update(l,"utf8");u=Buffer.concat([u,c.final()]);let d=c.getAuthTag(),p=(0,r.createCipher)("aes-256-gcm",t);p.setAAD(i);let m=p.update(a);m=Buffer.concat([m,p.final()]);let g=p.getAuthTag();return{dataKeyEnc:m=Buffer.concat([m,g]),iv:o,tag:d,ciphertext:u}}function o(e){let t=s(),{dataKeyEnc:a,iv:o,tag:i,ciphertext:l}=e,c=n(o),u=a.subarray(-16),d=a.subarray(0,-16),p=(0,r.createDecipher)("aes-256-gcm",t);p.setAAD(c),p.setAuthTag(u);let m=p.update(d);m=Buffer.concat([m,p.final()]);let g=(0,r.createDecipher)("aes-256-gcm",m);g.setAAD(o),g.setAuthTag(i);let h=g.update(l,void 0,"utf8");return JSON.parse(h+=g.final("utf8"))}function i(e){return e.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,"[EMAIL_REDACTED]").replace(/\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,"[PHONE_REDACTED]").replace(/\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g,"[CARD_REDACTED]").replace(/\b\d{3}-\d{2}-\d{4}\b/g,"[SSN_REDACTED]")}async function l(e){let{userId:r,action:s,lawfulBasis:n="consent",consentVersion:a=process.env.POLICY_VERSION||"2025-09-28",scopesUsed:o=[],subjectId:l,metadata:c={}}=e,u=function e(t){let r={...t},s=["email","phone","address","name","text","content","body"];for(let[t,n]of Object.entries(r))s.some(e=>t.toLowerCase().includes(e))&&("string"==typeof n?r[t]=i(n):"object"==typeof n&&null!==n&&(r[t]=e(n)));return r}(c),{error:d}=await t.supabaseServer.from("processing_logs").insert({user_id:r,action:s,lawful_basis:n,consent_version:a,scopes_used:o,subject_id:l,metadata:u});d&&console.error("Failed to log processing activity:",d)}async function c(e,r=100){let{data:s,error:n}=await t.supabaseServer.from("processing_logs").select("*").eq("user_id",e).order("created_at",{ascending:!1}).limit(r);if(n)throw Error(`Failed to fetch processing logs: ${n.message}`);return s||[]}async function u(e,r=100){let{data:s,error:n}=await t.supabaseServer.from("processing_logs").select("*").eq("action",e).order("created_at",{ascending:!1}).limit(r);if(n)throw Error(`Failed to fetch processing logs: ${n.message}`);return s||[]}async function d(e,r=30){let s=new Date;s.setDate(s.getDate()-r);let n=t.supabaseServer.from("processing_logs").select("action").gte("created_at",s.toISOString());e&&(n=n.eq("user_id",e));let{data:a,error:o}=await n;if(o)throw Error(`Failed to fetch processing stats: ${o.message}`);let i={};return a?.forEach(e=>{i[e.action]=(i[e.action]||0)+1}),i}},595088,e=>{"use strict";e.s(["getConsentHistory",()=>a,"getCurrentConsents",()=>o,"hasConsent",()=>r,"hasConsentForScopes",()=>s,"recordConsent",()=>n,"revokeConsent",()=>i]);var t=e.i(362693);async function r(e,r){let{data:s,error:n}=await t.supabaseServer.from("consents").select("policy_version, region, granted").eq("user_id",e).eq("granted",!0).contains("scopes",[r]).order("created_at",{ascending:!1}).limit(1).single();return n||!s?{granted:!1}:{granted:s.granted,version:s.policy_version,region:s.region}}async function s(e,t){let s=await Promise.all(t.map(t=>r(e,t))),n=[],a=!0;return t.forEach((e,t)=>{s[t].granted||(n.push(e),a=!1)}),{granted:a,missing:n}}async function n(e){let{userId:r,scopes:s,granted:n,region:a=process.env.PRIVACY_DEFAULT_REGION||"IN",policyVersion:o=process.env.POLICY_VERSION||"2025-09-28",ipHash:i,userAgent:l}=e,{error:c}=await t.supabaseServer.from("consents").insert({user_id:r,policy_version:o,scopes:s,region:a,granted:n,ip_hash:i,user_agent:l});if(c)throw Error(`Failed to record consent: ${c.message}`)}async function a(e){let{data:r,error:s}=await t.supabaseServer.from("consents").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(s)throw Error(`Failed to fetch consent history: ${s.message}`);return r||[]}async function o(e){let t=await Promise.all(["LLM_PROCESSING","OUTREACH_EMAIL","CALENDAR_EVENTS","OFFSHORE_STORAGE","ANALYTICS"].map(async t=>({scope:t,result:await r(e,t)}))),s={};return t.forEach(({scope:e,result:t})=>{s[e]=t}),s}async function i(e,t,r,s){await n({userId:e,scopes:t,granted:!1,ipHash:r,userAgent:s})}},843567,(e,t,r)=>{},898677,e=>{"use strict";e.s(["handler",()=>O,"patchFetch",()=>k,"routeModule",()=>C,"serverHooks",()=>P,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>I],898677);var t=e.i(747909),r=e.i(174017),s=e.i(996250),n=e.i(759756),a=e.i(561916),o=e.i(869741),i=e.i(316795),l=e.i(487718),c=e.i(995169),u=e.i(47587),d=e.i(666012),p=e.i(570101),m=e.i(626937),g=e.i(10372),h=e.i(193695);e.i(52474);var f=e.i(600220);e.s(["POST",()=>A],971522);var v=e.i(89171),y=e.i(322632),x=e.i(126432),E=e.i(572783);let w="00000000-0000-0000-0000-000000000000",b=y.z.object({message:y.z.string().min(1),currentStep:y.z.string(),resumeData:y.z.any(),conversationHistory:y.z.array(y.z.object({id:y.z.string(),type:y.z.enum(["user","assistant"]),content:y.z.string(),timestamp:y.z.any()})).optional()});async function A(e){try{let t=await e.json(),{message:r,currentStep:s,resumeData:n,conversationHistory:a=[]}=b.parse(t),o=await (0,x.requireConsent)(w,["LLM_PROCESSING"]);if(!o.ok)return v.NextResponse.json({error:"Consent required for AI processing",missingConsents:o.missing},{status:403});await (0,E.logProcessing)({userId:w,action:"AI_ASSISTANT_CHAT",lawfulBasis:"consent",consentVersion:o.version,scopesUsed:["LLM_PROCESSING"],metadata:{currentStep:s,messageLength:r.length,conversationLength:a.length,region:o.region}});let i=await R(r,s,n,a);return v.NextResponse.json({success:!0,response:i})}catch(e){if(console.error("AI Assistant error:",e),e instanceof y.z.ZodError)return v.NextResponse.json({error:"Invalid request data",details:e.errors},{status:400});return v.NextResponse.json({error:"Failed to process AI request",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function R(e,t,r,s){if(process.env.OPENROUTER_API_KEY)try{return await S(e,t,r,s)}catch(e){console.error("OpenRouter API error:",e)}var n=e,a=t;let o=n.toLowerCase();if("personal"===a){if(o.includes("email")||o.includes("contact"))return`**Professional Email Tips:**

• Use a professional email address (firstname.lastname@email.com)
• Avoid numbers, nicknames, or unprofessional words
• Consider creating a dedicated email for job applications
• Make sure it's easy to read and remember

**Example:** john.smith@email.com ✅
**Avoid:** johnny123@email.com ❌`;if(o.includes("linkedin")||o.includes("social"))return`**LinkedIn Profile Tips:**

• Use a professional headshot
• Write a compelling headline
• Include a detailed summary
• List all relevant experience
• Get recommendations from colleagues
• Keep it updated and active

Your LinkedIn URL should be: linkedin.com/in/yourname`}return"summary"===a&&(o.includes("summary")||o.includes("about"))?`**Professional Summary Structure:**

1. **Your role/position** (e.g., "Experienced Software Engineer")
2. **Years of experience** (e.g., "with 5+ years of experience")
3. **Key skills/expertise** (e.g., "in full-stack development")
4. **What you're seeking** (e.g., "Seeking opportunities in...")

**Example:**
"Experienced Software Engineer with 5+ years of expertise in full-stack development. Passionate about building scalable web applications and leading cross-functional teams. Seeking opportunities in senior development roles."

**Tips:**
• Keep it 2-3 sentences
• Use action words
• Be specific about your skills
• Tailor to your target role`:"experience"===a&&(o.includes("experience")||o.includes("work"))?`**Experience Section Best Practices:**

**For each role, include:**
• Job title and company name
• Employment dates
• 2-3 key achievements with numbers
• Technologies and tools used

**Action Verbs to Use:**
• Led, Developed, Implemented, Optimized
• Managed, Coordinated, Collaborated
• Designed, Built, Created, Launched

**Example Achievement:**
"Led development of a React application that increased user engagement by 30% and reduced page load time by 50%"

**Tips:**
• Quantify your impact with numbers
• Focus on results, not just duties
• Use present tense for current role, past tense for previous roles`:"skills"===a&&(o.includes("skill")||o.includes("technical"))?`**Skills Organization:**

**Technical Skills:**
• Programming languages (JavaScript, Python, Java)
• Frameworks (React, Angular, Django)
• Tools (Git, Docker, AWS)
• Databases (PostgreSQL, MongoDB)

**Soft Skills:**
• Leadership, Communication, Problem-solving
• Teamwork, Time management, Adaptability

**Tips:**
• Be specific: "React.js" not just "JavaScript"
• Include proficiency levels if relevant
• Focus on skills relevant to your target role
• Group related skills together`:"projects"===a&&(o.includes("project")||o.includes("portfolio"))?`**Project Showcase Tips:**

**Choose 2-3 projects that:**
• Demonstrate your key skills
• Are relevant to your target role
• Show problem-solving ability
• Have measurable outcomes

**For each project:**
• Clear, descriptive name
• Brief description of what you built
• Technologies and tools used
• Link to live demo or GitHub

**Example:**
"E-commerce Platform - Built a full-stack e-commerce solution using React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard. Increased conversion rate by 25%."

**Tips:**
• Include screenshots or demos if possible
• Highlight your specific contributions
• Show the impact or results achieved`:o.includes("ats")||o.includes("optimize")?`**ATS Optimization Tips:**

• Use standard section headings (Experience, Education, Skills)
• Include relevant keywords from job descriptions
• Use common fonts (Arial, Times New Roman, Calibri)
• Avoid graphics, tables, or complex formatting
• Save as PDF for best compatibility
• Use bullet points for easy scanning
• Include quantifiable achievements

**Keywords to Include:**
• Job-specific technical skills
• Industry terminology
• Action verbs
• Certifications and degrees`:o.includes("example")||o.includes("template")?`**I can provide examples for:**

• Professional summaries
• Experience descriptions
• Project descriptions
• Skills formatting
• Achievement statements

**Just ask me for specific examples like:**
• "Give me an example of a software engineer summary"
• "Show me how to describe a project"
• "Help me write an achievement statement"

I'll provide tailored examples based on your current step and data!`:o.includes("help")||o.includes("stuck")?`**I'm here to help with:**

• Writing compelling content
• Formatting and structure
• ATS optimization
• Industry-specific advice
• Examples and templates
• Answering specific questions

**What would you like help with?** I can provide guidance on any part of your resume building process.`:`I understand you're asking about "${n}". 

I'm here to help you create an outstanding resume! I can assist with:

• Writing and improving content
• Formatting and structure
• ATS optimization
• Industry best practices
• Examples and templates

**What specific aspect would you like help with?** Feel free to ask me anything about resume writing, and I'll provide detailed guidance.`}async function S(e,t,r,s){let n=[{role:"system",content:`You are a helpful resume writing assistant. You help users create outstanding resumes by providing:

1. Specific, actionable advice
2. Industry best practices
3. Examples and templates
4. ATS optimization tips
5. Content enhancement suggestions

Current step: ${t}
Resume data: ${JSON.stringify(r,null,2)}

Be concise, helpful, and professional. Provide specific examples when possible.`},...s.slice(-5).map(e=>({role:"user"===e.type?"user":"assistant",content:e.content})),{role:"user",content:e}],a=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,"Content-Type":"application/json","HTTP-Referer":process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000","X-Title":"Resume Builder AI Assistant"},body:JSON.stringify({model:"anthropic/claude-3.5-sonnet",messages:n,max_tokens:500,temperature:.7})});if(!a.ok)throw Error(`OpenRouter API error: ${a.status}`);let o=await a.json();return o.choices[0]?.message?.content||"Sorry, I could not generate a response."}var _=e.i(971522);let C=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/ai/assistant/route",pathname:"/api/ai/assistant",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/ai/assistant/route.ts",nextConfigOutput:"",userland:_}),{workAsyncStorage:T,workUnitAsyncStorage:I,serverHooks:P}=C;function k(){return(0,s.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:I})}async function O(e,t,s){var v;let y="/api/ai/assistant/route";y=y.replace(/\/index$/,"")||"/";let x=await C.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!x)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:E,params:w,nextConfig:b,isDraftMode:A,prerenderManifest:R,routerServerContext:S,isOnDemandRevalidate:_,revalidateOnlyGenerated:T,resolvedPathname:I}=x,P=(0,o.normalizeAppPath)(y),k=!!(R.dynamicRoutes[P]||R.routes[I]);if(k&&!A){let e=!!R.routes[I],t=R.dynamicRoutes[P];if(t&&!1===t.fallback&&!e)throw new h.NoFallbackError}let O=null;!k||C.isDev||A||(O="/index"===(O=I)?"/":O);let N=!0===C.isDev||!k,j=k&&!N,L=e.method||"GET",D=(0,a.getTracer)(),q=D.getActiveScopeSpan(),U={params:w,prerenderManifest:R,renderOpts:{experimental:{cacheComponents:!!b.experimental.cacheComponents,authInterrupts:!!b.experimental.authInterrupts},supportsDynamicResponse:N,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(v=b.experimental)?void 0:v.cacheLife,isRevalidate:j,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s)=>C.onRequestError(e,t,s,S)},sharedContext:{buildId:E}},H=new i.NodeNextRequest(e),F=new i.NodeNextResponse(t),M=l.NextRequestAdapter.fromNodeNextRequest(H,(0,l.signalFromNodeResponse)(t));try{let o=async r=>C.handle(M,U).finally(()=>{if(!r)return;r.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let s=D.getRootSpanAttributes();if(!s)return;if(s.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${s.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=s.get("next.route");if(n){let e=`${L} ${n}`;r.setAttributes({"next.route":n,"http.route":n,"next.span_name":e}),r.updateName(e)}else r.updateName(`${L} ${e.url}`)}),i=async a=>{var i,l;let c=async({previousCacheEntry:r})=>{try{if(!(0,n.getRequestMeta)(e,"minimalMode")&&_&&T&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(a);e.fetchMetrics=U.renderOpts.fetchMetrics;let l=U.renderOpts.pendingWaitUntil;l&&s.waitUntil&&(s.waitUntil(l),l=void 0);let c=U.renderOpts.collectedTags;if(!k)return await (0,d.sendResponse)(H,F,i,U.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);c&&(t[g.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==U.renderOpts.collectedRevalidate&&!(U.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&U.renderOpts.collectedRevalidate,s=void 0===U.renderOpts.collectedExpire||U.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:U.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==r?void 0:r.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isRevalidate:j,isOnDemandRevalidate:_})},S),t}},h=await C.handleResponse({req:e,nextConfig:b,cacheKey:O,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:R,isRoutePPREnabled:!1,isOnDemandRevalidate:_,revalidateOnlyGenerated:T,responseGenerator:c,waitUntil:s.waitUntil});if(!k)return null;if((null==h||null==(i=h.value)?void 0:i.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==h||null==(l=h.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,n.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",_?"REVALIDATED":h.isMiss?"MISS":h.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let v=(0,p.fromNodeOutgoingHttpHeaders)(h.value.headers);return(0,n.getRequestMeta)(e,"minimalMode")&&k||v.delete(g.NEXT_CACHE_TAGS_HEADER),!h.cacheControl||t.getHeader("Cache-Control")||v.get("Cache-Control")||v.set("Cache-Control",(0,m.getCacheControlHeader)(h.cacheControl)),await (0,d.sendResponse)(H,F,new Response(h.value.body,{headers:v,status:h.value.status||200})),null};q?await i(q):await D.withPropagatedContext(e.headers,()=>D.trace(c.BaseServerSpan.handleRequest,{spanName:`${L} ${e.url}`,kind:a.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},i))}catch(t){if(q||t instanceof h.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isRevalidate:j,isOnDemandRevalidate:_})}),k)throw t;return await (0,d.sendResponse)(H,F,new Response(null,{status:500})),null}}},236145,e=>{e.v(e=>Promise.resolve().then(()=>e(902808)))},890278,e=>{e.v(e=>Promise.resolve().then(()=>e(595088)))},178157,e=>{e.v(e=>Promise.resolve().then(()=>e(572783)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__8f8db787._.js.map