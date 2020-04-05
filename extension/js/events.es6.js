const logger = require("./storage.es6").loggerMixin

const Events = {
    BID_REQUEST: 0,
    BID_RESPONSE: 1,
  };

function dispatch(message, sender, senderResponse) {
    if (!message.hasOwnProperty("type")) return

    if (message.type === Events.BID_REQUEST) {
        let tabId = message.tabId

        if (window.auctions.has(tabId)) {
            senderResponse({
                "tabId": tabId,
                "bidders": Array.from(window.auctions.get(tabId).bidders)
            })
        }
    } else if (message.type === Events.BID_RESPONSE) {
        logger.log({ response: message })
    } 
}

module.exports = {
    Events: Events,
    dispatch: dispatch 
}