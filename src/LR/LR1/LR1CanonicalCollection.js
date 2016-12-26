'use strict';

let GO = require('./go');
let CLOSURE = require('./closure');
let {
    reduce, union, contain
} = require('bolzano');
let jsoneq = require('cl-jsoneq');

let {
    END_SYMBOL, EXPAND_START_SYMBOL
} = require('../../base/constant');

/**
 * input: grammer G
 *
 * output: LR(0) canonical collection
 *
 * item = [head, body, dotPosition];
 *
 * item set = [viable prefix, items]
 */
module.exports = ({
    start,
    T, N,
    productions
}) => {
    let symbols = union(T, N);
    let C = [
        CLOSURE([ // items
            [EXPAND_START_SYMBOL, [start], 0, [END_SYMBOL]]
        ], T, N, productions)
    ];

    while (true) { // eslint-disable-line
        // for every item
        let newC = reduce(C, (prev, I) => {
            // for every symbol
            return reduce(symbols, (pre, X) => {
                let ret = GO(I, X, T, N, productions);
                if (ret && ret.length && !contain(C, ret, {
                    eq: jsoneq
                })) {
                    pre.push(ret);
                }
                return pre;
            }, prev);
        }, C.slice(0));

        if (newC.length === C.length) break; // no more items
        C = newC;
    }

    return C;
};