const bidders = require("../../js/bidders.es6")
const Events = require("../../js/events.es6").Events

browser.devtools.network.onRequestFinished.addListener(entry => {
        const isJsonResponse = entry.response.content.mimeType.match(/application\/json/g)
        const bidder = bidders.getBidder(entry.request.url)
        if (bidder && isJsonResponse) {
            const bidsTable = document.getElementById("responses")
            entry.getContent(response => {
                browser.runtime.sendMessage({"type": Events.BID_RESPONSE, 
                    "bidder": bidder,
                    "request": entry.request,
                    "response": response 
                })
                const html = `<tr><td>${bidder}</td><td>${response}</td><td>${response}</td></tr>`
                bidsTable.innerHTML += html
        })
      }
   });
