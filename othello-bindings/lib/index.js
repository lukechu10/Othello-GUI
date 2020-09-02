// @ts-nocheck
var addon = require('../native');

module.exports.Game = class {
    internal;

    constructor() {
        this.internal = new addon.Game();
    }

    get blackPieces() {
        return this.internal.getBlackPieces();
    }

    get whitePieces() {
        return this.internal.getWhitePieces();
    }

    get availablePlays() {
        return this.internal.generatePlays();
    }

    get state() {
        return this.internal.state();
    }

    resolvePlay(play) {
        this.internal.resolvePlay(play);
    }

    isValidPlay(play) {
        return this.internal.isValidPlay(play);
    }

    runSearch(timeout) {
        return this.internal.runSearch(timeout);
    }

    toString() {
        return this.internal.toString();
    }
}