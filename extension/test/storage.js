QUnit.module("Storage");

const browser = require('sinon-chrome');
const storage = require("../js/storage.es6")

global.browser = browser;

QUnit.test("Test bidder", function (assert) {
    assert.ok(1 === 1)
})
