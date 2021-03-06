const { v4: uuidv4 } = require('uuid');
const PouchDB = require('pouchdb').default;

const PrebidLogDb = 'prebidlog'
const PrebidStatsView = 'stats'
const db = new PouchDB(PrebidLogDb)
var replication = null

let loggerMixin = {
    log(doc) {
        if (doc.hasOwnProperty("_id")) {
            console.log(`Overwriting document _id for ${doc}`)
        }

        doc["_id"] = uuidv4()
        doc["timestamp"] = Date.now() 
        db.put(doc,  function(err, response) {
            if (err)
                console.log(err)
            })
        }
}

let init = function() {
    const index = {
        _id: `_design/${PrebidStatsView}`,
        views: {
            bidder: {
                map: function (doc) {
                    emit(doc.bidder)
                    }.toString(),
                reduce: '_count'
            },
            winner: {
                map: function (doc) { 
                    if (doc.hasOwnProperty("winner")) {
                         emit(doc.winner.bidder)
                    }
                 }.toString(),
                 reduce: '_count'
             }
        }
    }

    db.put(index).then(function () {
        console.log(`${PrebidStatsView} created`)
    }).catch(function (err) {
        console.log(err)
    });
}

let replicate = function(uri, live=false) {
    console.log(uri, live)
    let remote = PouchDB(uri)

    if (replication) {
        replication.cancel()
    }

    let retry = live // if live replication, than retry connecting on failure
    replication = db.replicate.to(remote, {
        live: live,
        retry: retry
    }).on('complete', function() {
        console.log(`${PrebidLogDb}: replicating.`)
    }).on('error', function(err) {
        console.log(`${PrebidLogDb}: replication failed.`, err)
    });
}

let stats = {
    getBiddersCount() {
        // TODO(gmodena): fix CSP error when calling the view from the extenstion popup
        // return db.query(`${PrebidStatsView}/bidder`, { reduce: true, group: true })
        const groupByCount = {
            map: function (doc, emit) {
            emit(doc.bidder)
            },
            reduce: '_count'
        }
        return db.query(groupByCount, { reduce: true, group: true }) 
    },

    getWinnersCount() {
        // TODO(gmodena): fix CSP error when calling the view from the extenstion popup
        // return db.query(`${PrebidStatsView}/winner`, { reduce: true, group: true })
        const groupByCount = {
            map: function (doc, emit) {
                if (doc.hasOwnProperty("winner")) {
                    emit(doc.winner.bidder)
                }
            },
            reduce: '_count'
        }
        return db.query(groupByCount, { reduce: true, group: true })
    }
}

module.exports = {
    init: init,
    loggerMixin: loggerMixin,
    stats: stats,
    replicate: replicate
}
