const uuidv4 = require('uuid/v4');
const bidders = require("./bidders.es6")
const storage = require("./storage.es6")

const hasPrebidBidder = bidders.getBidder
const hasPrebidWinner = function(requestUrl) {
    let hb = requestUrl.match(/hb_bidder/g)
    if (hb) {
        return true
    }
    return false
}

class Winner {
    constructor(bidCpm, bidder, size, adid, format, source) {
        this.bidCpm = bidCpm
        this.bidder = bidder
        this.size = size
        this.adid = adid
        this.format = format
        this.source = source
    }
}

 /**
 * Parse request urls and initialize an auction data class.
 */
class Auction {
    constructor(url) {
        this.auctionId = uuidv4()
        this.url = url
        this.bidders = new Map() // Container for bidder objects (bidderName, numCalls)
        this.winner
    }

    push(requestUrl) {
        return this.setIfWinner(requestUrl) || this.setIfBidder(requestUrl)
    }

    setIfWinner(requestUrl) {
        if (hasPrebidWinner(requestUrl)) {
            let params = new URLSearchParams(requestUrl)
            this.winner = new Winner(
                params.get("hb_pb"),
                params.get("hb_bidder"),
                params.get("hb_size"),
                params.get("hb_adid"),
                params.get("hb_format"),
                params.get("hb_source"))

                this.log({ auctionId: this.auctionId, referrer: this.url, winner: this.winner })
            return true
        }
        return false
    }

    setIfBidder(requestUrl) {
        let bidder = hasPrebidBidder(requestUrl)

        if (bidder) {
            this.setBidder(bidder)
            this.log({ auctionId: this.auctionId, referrer: this.url, bidder: bidder })
            return true
        }
        return false
    }

    setBidder(bidder) {
        if (this.bidders.has(bidder)) {
          this.bidders.set(bidder, this.bidders.get(bidder) + 1)
          return
        }
        this.bidders.set(bidder, 1)
    }
  
    getBidder(bidder) {
      return this.bidders.get(bidder)
    }
  
    getWinner() {
        return this.winner
    }
}

Object.assign(Auction.prototype, storage.loggerMixin)

module.exports = {
    Auction: Auction
}