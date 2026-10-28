import assert from 'node:assert/strict';
import { getStore, setEnvironmentContext } from '@netlify/blobs';
import adapt from '../netlify/shared/web-adapter.mjs';

setEnvironmentContext({siteID:'test-site', token:'test-token', edgeURL:'https://cached.example', uncachedEdgeURL:'https://origin.example'});
let readURL;
const store = getStore({name:'test',consistency:'strong',fetch:async url=>{
  readURL=String(url); return Response.json({blobs:[],directories:[]});
}});
const handler=adapt(async(req,res)=>{
  assert.equal(req.query.key,'folder/image.png');
  assert.equal(req.body.action,'overview');
  await store.list();
  res.setHeader('content-type','application/octet-stream');
  res.end(Buffer.from([0,128,255]));
});
const result=await handler(new Request('https://example.com/api/media?key=folder%2Fimage.png',{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'overview'})
}),{ip:'192.0.2.1'});
assert.equal(result.status,200);
assert.deepEqual(Buffer.from(await result.arrayBuffer()),Buffer.from([0,128,255]));
assert.ok(readURL.startsWith('https://origin.example/'));
const empty=await adapt(async(req,res)=>{res.statusCode=204;res.end();})(new Request('https://example.com'),{});
assert.equal(empty.status,204);
assert.equal(await empty.text(),'');
console.log('PASS modern adapter: strong consistency, JSON/query mapping, binary bytes and empty responses');
