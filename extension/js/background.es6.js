"use strict";

const prebid = require('./auction.es6');
const events = require('./events.es6')
const storage = require('./storage.es6')

const auctions = window.auctions = new Map()

function captureRequestToAdserver(requestInfo) {
    if (!requestInfo) return
    let tabId = requestInfo.tabId
    var pb = window.auctions.get(tabId)

    if (!pb) {
        let documentUrl = ""
        if (requestInfo.hasOwnProperty("frameAncestors") && requestInfo.frameAncestors.length > 0) 
            documentUrl = requestInfo.frameAncestors.slice(-1)[0].url
        else 
            documentUrl = requestInfo.url
        
        pb = new prebid.Auction(documentUrl)
    }
    try {
        let url = decodeURIComponent(requestInfo.url)
        if (pb.push(url))
          window.auctions.set(tabId, pb)
      } catch (error) {
          console.log(error)
      }
}


/** Listeners */
browser.webRequest.onBeforeRequest.addListener(
    captureRequestToAdserver, { urls: ["*://*/*"] })

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "loading") {
        window.auctions.delete(tabId)
    }
})

browser.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    window.auctions.delete(tabId)
})

browser.runtime.onMessage.addListener(events.dispatch)

browser.runtime.onInstalled.addListener(function(details) {
     storage.init()
 });