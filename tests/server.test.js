const {test}=require('node:test'),assert=require('node:assert/strict');const {tmNormalize,sgNormalize,range}=require('../server');
test('ticketmaster minimum is null without provider price',()=>{assert.equal(range({}),null);assert.equal(range({priceRanges:[{min:50},{min:30}]}),30)});
test('ticketmaster normalize does not mislabel min as all-in',()=>{const x=tmNormalize({id:'abc',name:'Show',dates:{start:{localDate:'2026-12-01'}},priceRanges:[{min:42,currency:'USD'}]});assert.equal(x.price,42);assert.match(x.priceLabel,/unverified/);assert.equal(x.id,'tm:abc')});
test('seatgeek normalizes absent price as unavailable',()=>{const x=sgNormalize({id:8,title:'Game',venue:{city:'New York'}});assert.equal(x.price,null);assert.equal(x.id,'sg:8')});
