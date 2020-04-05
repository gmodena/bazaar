QUnit.module("Bidder");

const bidders = require("../js/bidders.es6");

QUnit.test("Extract prebid provider from url", function (assert) {
  const requests = new Map([["https://ib.adnxs.com/ut/v3/prebid", "AppNexus"],
                ["https://thor.rtk.io/bla/bla/bla/aardvark", "Aardvark"]])
    for (const [url, bidder] of requests)  {
      assert.ok(bidders.getBidder(url) === bidder)
    }
})

QUnit.test("Url is not a prebid request", function (assert) {
  const url =  "https://blabla.bla";
  const bidder = undefined
  
  assert.ok(bidders.getBidder(url) === bidder)
})

QUnit.test("Url undefined", function (assert) {
  const url =  undefined;
  const bidder = undefined
  
  assert.ok(bidders.getBidder(url) === bidder)
})

QUnit.test("Url null", function (assert) {
  const url =  null;
  const bidder = undefined
  
  assert.ok(bidders.getBidder(url) === bidder)
})
