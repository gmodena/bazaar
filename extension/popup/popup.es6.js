const Events = require("../js/events.es6").Events
const storage = require('../js/storage.es6')
const numberOfBidders = 5 

function setPopupData(data) {
    /**
    * 
    * @param {*} data associative array in the form [["Bidder", n_bids]]
    */
    function toHtmlList(data) {
        var html = '<ul>'
        data.forEach(bidder => html += '<li>' + bidder[0] + '</li>' )
        html += '</ul>'

        return html
    }
    if (data) {
        try {
            if  (! data.hasOwnProperty("bidders")) { throw "Received invalid data" } 
            let prebidBidders = document.getElementById('prebid-bidders');
            var message = "No Prebid.js adapter found on page"

            if  (data["bidders"].length > 0) {
                message = `Prebid partners on page: <br/>`
                message += toHtmlList(data["bidders"]);
            }
            
            prebidBidders.innerHTML += message
        } catch(e) {
            console.log(e)
        }
    }
    document.getElementById('prebid-stats-button')
            .addEventListener('click', buildStatsUI);
}


function buildStatsUI() {
    /**
     * List of rows from pouchdb map/reduce query.
     * @param {*} bidders { rows: [Object]}
     */
    function buildTopKUI(bidders, statsType) {
        function toHtmlList(data) { 
            console.log(data)
            var html = '<ul>'
            data.forEach(bidder => {
                html += '<li>' + bidder.key + " " + bidder.value + '</li>'
            })
            return html
        }
        function compare( a, b ) {
            if ( a.value > b.value ){
              return -1;
            }
            if ( a.value < b.value ){
              return 1;
            }
            return 0;
        }

        // 'rows' is part of the schema returned by pouchdb
        if  (! bidders.hasOwnProperty("rows")) { throw "Invalid data" } 
        
        const data = bidders['rows'].sort(compare).slice(0, numberOfBidders)
        let prebidStatsDiv = document.getElementById(statsType)
        prebidStatsDiv.innerHTML += toHtmlList(data)
    } 

    function hideElements() {
        document.getElementById('prebid-bidders').style.display = 'none'
        document.getElementById('prebid-stats-button').style.display = 'none'
    }

    function showStats() {
        const bidderStatsDiv = "prebid-bidder-stats"
        const winnerStatsDiv = "prebid-winner-stats"
    
        document.getElementById(bidderStatsDiv).style.display = 'block'
        document.getElementById(winnerStatsDiv).style.display = 'block'

        storage.stats.getBiddersCount(numberOfBidders).then(function(result) {
            buildTopKUI(result, bidderStatsDiv)
        }).catch(function (err) {
            console.log(err)
        })
    
        storage.stats.getWinnersCount(numberOfBidders).then(function(result) {
            buildTopKUI(result, winnerStatsDiv)
        }).catch(function (err) {
            console.log(err)
        })
    }

    hideElements()
    showStats()
}


browser.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => {
    browser.runtime.sendMessage({
        type: Events.BID_REQUEST,
        tabId: tabs[0].id,
        url: tabs[0].url
    }).then(response => {
        setPopupData(response)
    })
}).catch(error => `Something went wrong while communicating with background script ${error.message}`)