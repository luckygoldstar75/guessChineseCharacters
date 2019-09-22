"use strict";

import isLink from 'routes_signup.js';
const assert = require('chai').assert;

function testIsLink() {
    assert(isLink(null) === null);    
}
