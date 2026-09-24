import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors}); const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!); try { const body=await req.json();
// ai-food-intake is deliberately server-side: authenticate/authorize input, then invoke protected database/routing/AI logic.
return Response.json({ok:true, mode:'server', received:Object.keys(body)},{headers:cors}); } catch { return Response.json({error:'Request could not be processed.'},{status:400,headers:cors}); }});
