const Events = require("../js/events.es6").Events
const storage = require('../js/storage.es6')
const numberOfBidders = 5 

function compare( a, b ) {
    if ( a.value > b.value ){
      return -1;
    }
    if ( a.value < b.value ){
      return 1;
    }
    return 0;
}

let Popup = function (options) {
	this.elem = document.querySelector(options.selector);
	this.data = options.data;
	this.template = options.template;
};

Popup.prototype.render = async function () {
    this.elem.innerHTML = await this.template(this.data);
};

let Bidders = async function() {
    let bidders = await storage.stats.getBiddersCount(numberOfBidders)
    return bidders['rows'].sort(compare).slice(0, numberOfBidders)
};

let Winners = async function() {
    let winners = await storage.stats.getWinnersCount(numberOfBidders)
    return winners['rows'].sort(compare).slice(0, numberOfBidders)
};

browser.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => {
    browser.runtime.sendMessage({
        type: Events.BID_REQUEST,
        tabId: tabs[0].id,
        url: tabs[0].url
    }).then(response => {
        var bidders = []
        if (response) {
            bidders = response.bidders
        }
        new Popup({
            selector: '#app',
            data: {
                heading: 'Prebid partners',
                bidders: bidders
            },
            template: function (props) {
                return `
                    <h3>${props.heading}</h3>
                    <ul>
                        ${props.bidders.map(function (bidder) {
                            return `<li>${bidder}</li>`;
                        }).join('')}
                    </ul>`;
            }
        }).render()

        document.getElementById('prebid-stats-button').addEventListener('click', function(){
            new Popup({
                selector: '#app',
                data: {
                    bidders: {
                        heading: 'Bidder stats',
                        data: Bidders
                    
                    },
                    winners: {
                        heading: 'Winner stats',
                        data: Winners
                    }
                },
                template: async function (props) {
                    let bidders = await props.bidders.data()
                    let winners = await props.winners.data()
                    return `
                        <h3>${props.bidders.heading}</h3>
                        <ul>
                            ${bidders.map(function(bidder) {
                                return `<li>${bidder.key} ${bidder.value}</li>`;
                                }).join('')}
                        </ul>
                        <h3>${props.winners.heading}</h3>
                        <ul>
                            ${winners.map(function(winner) {
                                return `<li>${winner.key} ${winner.value}</li>`;
                                }).join('')}
                        </ul>
                        `;
                }
            }).render() 
        });
    })
}).catch(error => `Something went wrong while communicating with background script ${error.message}`)