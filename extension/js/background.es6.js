"use strict";

const prebid = require('./auction.es6')
const events = require('./events.es6')
const storage = require('./storage.es6')
const auctions = window.auctions = new Map()

function captureRequestToAdserver(requestInfo) {
    if (!requestInfo) return
    let tabId = requestInfo.tabId
    var pb = window.auctions.get(tabId)

    if (!pb) {
        pb = new prebid.Auction(requestInfo.originUrl)
    }
    try {
        let documentUrl = ""
        if (requestInfo.hasOwnProperty("frameAncestors") && requestInfo.frameAncestors.length > 0) 
            documentUrl = requestInfo.frameAncestors.slice(-1)[0].url
        else 
            documentUrl = requestInfo.url
        
        let url = decodeURIComponent(requestInfo.url)
        if (pb.push(url)) {
            window.auctions.set(tabId, pb)
        }
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

browser.storage.onChanged.addListener(function(change) {
    if ('couchdbConf' in change) {
         let couch = change["couchdbConf"]["newValue"]
        let uri = couch["db_uri"]
        let db_live_replication = couch["db_live_replication"]
        if (uri != "") {
            storage.replicate(uri, db_live_replication)
        }
    }
 })
