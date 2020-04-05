QUnit.module("Auction");

const browser = require('sinon-chrome')
const auction = require("../js/auction.es6")

global.browser = browser;

function mapIsEqual(map1, map2) {
    if (map1.size != map2.size) {
      return false
    }

    for (let [k, v] of map1) {
      if (map2.get(k) != v) {
        return false
      }
    }

    return true
}

QUnit.test("Test bidder", function (assert) {
    let bidder = "AppNexus"
    let bidderUrl =  "https://ib.adnxs.com/ut/v3/prebid"
    let otherUrl = "https://anta.ni"

    let pb = new auction.Auction()
    pb.push(bidderUrl)
    pb.push(otherUrl)

    assert.ok(pb.bidders.size == 1)
    assert.ok(pb.getBidder(bidder) == 1)

    pb.setBidder(bidder)
    assert.ok(pb.getBidder(bidder) == 2)
})


QUnit.test("Test that we can identify the winning bid in a prebid auction", function (assert) {
    // Example from prebidjs.org documentation. See https://jsfiddle.net/Prebid_Examples/5crq9cse/388/
    let url = "https://securepubads.g.doubleclick.net/gampad/ads?gdfp_req=1&pvsid=3254739121596310&correlator=823638722220171&output=ldjh&impl=fifs&adsid=NT&eid=21064170%2C21065306&vrg=2020011301&guci=1.2.0.0.2.2.0.0&sc=0&sfv=1-0-37&ecs=20200120&iu_parts=19968336%2Cheader-bid-tag-0%2Cheader-bid-tag-1&enc_prev_ius=%2F0%2F1%2C%2F0%2F2&prev_iu_szs=300x250%7C300x600%2C728x90%7C970x250&prev_scp=hb_format_appnexus%3Dbanner%26hb_source_appnexus%3Dclient%26hb_size_appnexus%3D300x250%26hb_pb_appnexus%3D0.50%26hb_adid_appnexus%3D4788abacab61178%26hb_bidder_appnexus%3Dappnexus%26hb_format%3Dbanner%26hb_source%3Dclient%26hb_size%3D300x250%26hb_pb%3D0.50%26hb_adid%3D4788abacab61178%26hb_bidder%3Dappnexus%7Chb_format_appnexus%3Dbanner%26hb_source_appnexus%3Dclient%26hb_size_appnexus%3D970x250%26hb_pb_appnexus%3D0.50%26hb_adid_appnexus%3D5c7ff68bcd3a098%26hb_bidder_appnexus%3Dappnexus%26hb_format%3Dbanner%26hb_source%3Dclient%26hb_size%3D970x250%26hb_pb%3D0.50%26hb_adid%3D5c7ff68bcd3a098%26hb_bidder%3Dappnexus&eri=1&cookie_enabled=1&cdm=fiddle.jshell.net&bc=29&abxe=1&lmt=1579558256&dt=1579558256699&dlt=1579558255172&idt=1495&ea=0&frm=24&biw=-12245933&bih=-12245933&isw=535&ish=310&oid=3&adxs=8%2C8&adys=107%2C434&adks=1212337369%2C4019058758&ucis=fj4qmtlqb9z%7C5m6n0vgw0rg4&ifi=1&ifk=3063905832&u_tz=60&u_his=2&u_h=900&u_w=1440&u_ah=814&u_aw=1440&u_cd=24&u_sd=2&flash=0&nhd=1&url=http%3A%2F%2Ffiddle.jshell.net%2FPrebid_Examples%2F5crq9cse%2F388%2Fshow%2F&ref=http%3A%2F%2Fjsfiddle.net%2F&top=http%3A%2F%2Fjsfiddle.net%2F&dssz=11&icsg=681&mso=32&std=26&vis=2&scr_x=-12245933&scr_y=-12245933&psz=518x503%7C518x503&msz=518x250%7C518x90&ga_vid=1466565166.1579558257&ga_sid=1579558257&ga_hid=2060451648&fws=256%2C256&ohw=0%2C0"
    
    let expected = new Map([
                       ['hb_pb', '0.50'],
                       ['hb_bidder', 'appnexus|hb_format_appnexus=banner'],
                       ['hb_size', '300x250'],
                       ['hb_adid', '4788abacab61178'],
                       ['hb_format', 'banner'],
                       ['hb_source', 'client']
                     ])

    let pb = new auction.Auction()
    pb.push(decodeURIComponent(url))
    let winner = pb.getWinner()
    

    assert.ok(winner != null)
    assert.ok(winner.bidCpm === expected.get("hb_pb")) 
    assert.ok(winner.bidder === expected.get("hb_bidder")) 
    assert.ok(winner.size === expected.get("hb_size"))
    assert.ok(winner.adid === expected.get("hb_adid")) 
    assert.ok(winner.format === expected.get("hb_format")) 
    assert.ok(winner.source === expected.get("hb_source")) 
})