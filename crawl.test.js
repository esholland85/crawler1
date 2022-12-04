const {test, expect } = require('@jest/globals');
const {normalizeURL} = require('./crawl.js');

//npm run test

test('checks that all caps have been removed from URL', () => {
    expect(normalizeURL('wagsLane.Dev/path')).toBe('wagslane.dev/path');
})

test('checks that method has been removed from URL', () => {
    expect(normalizeURL('https://wagsLane.dev/path')).toBe('wagslane.dev/path');
})

test('checks that trailing slashes have been removed from URL', () => {
    expect(normalizeURL('wagsLane.dev/path/')).toBe('wagslane.dev/path');
})