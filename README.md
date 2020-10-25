![](https://github.com/gmodena/header-snooping/workflows/build/badge.svg)

# Bazaar

Bazaar is a webextension (Firefox, Chrome) that collects [Prebid.js](http://prebidjs.com) bid requests. A devtool panel allows collecting an advertiser raw bid response (by parsing the XHR log). 

# Header bidding

Header Bidding is a client side technology for auctionining online advertising. It allows publishers to offer inventory
to advertisers and exchanges simultaneously, before calling into an adserver. Wait what?
Every time a client visits a webpage (let's say [www.theguardian.com](https://www.theguardian.com/international)), a piece of javascript
is downloaded which executes an auction for properties the site would like to monetize (banners, video).
Under the hood the auction javascript sends out a bid request (`GET`) to a pool of advertisers the publisher partners with, broadcasting
information about the inventory (`size`, `url`) and the client (`useragent`, `ip`). The advertiser responds to the request with
either a valid bid, or with a "pass". Once all bids are collected, an auction is ran on the client and the winning bid (if any passes eligibility criteria) is sent out to the publisher adserver.

This extension is born from an itch I had to scratch after over half a decade spent in a large European supply-side adtech company. From 2012 to 2019 I had a chance to build a decent grasp of bid dynamics and server side machinery, but I never
got much of chance to get my hands dirty on the client.

This extension logs [Prebid.js](https://prebid.org/) traffic (a popular header bidding solution). The goal is to collect a dataset and, over time, be able to answer the following questions:

1. How much are advertiser willing to pay for my attention?
2. Who's bidding for me and where?
3. Can any bidding pattern be identified?

Being online advertisement a high numbers game, I don't expect to extrapolate anything from a single datapoint, but if this gets
any interest and traction it could be interesting to carry out a coordinated effort (following the example of the folks at [https://tracking.exposed/](https://tracking.exposed/)).

# Build and install

Bazaar is currently under development and not yet available on Mozilla and Google repositories. 

Install dependencies with
```
$ npm install
```

Build the extension with:

```
$ npm run webpack
$ npm run webext-build
```

The resulting `estension-dist` can be manually installed on [Firefox]() and [Chrome/Chromium]().

Alternatively, the extension can be tested using the [web-ext](https://github.com/mozilla/web-ext) tool with
```
$ web-ext run --target=firefox-desktop
```

or target Chromium with
```
$ web-ext run --target=chromium
```

# Data collection and analysis
Bazaar uses [pouchdb](https://pouchdb.com/) to locally store Predib requests and responses. The database attempts to sync to a couchdb instance (expected to run at `http://localhost:5984`) for offline data analysis.
