'use strict';

var _ = require('underscore'),
    la = require('sylvester'),
    Matrix = la.Matrix,
    Vector = la.Vector;

var cord = require('../utils/cord.js'),
    ImageCell = require('./ImageCell.js'),
    settings = require('./settings.js');

//===========================================================

module.exports = ImageCellGrid;

//===========================================================


/**
 * Image cell grid class
 *
 * @param img
 * @param {Feature[]} features
 * @param {int} mu
 *
 * @property {Camera} cam
 * @property {int} rows
 * @property {int} cols
 * @property {number} bound       - radius bound for feature matching
 * @property {int} mu             - cell size
 * @property {ImageCell[][]} grid - cell grid
 * @property img                  - image ndarray
 * @constructor
 */
function ImageCellGrid(img, features, mu){

    var _self = this,
        width = img.shape[0],
        height = img.shape[1],
        cam = { width: width, height: height },
        rows = Math.ceil(height/mu),
        cols = Math.ceil(width/mu),
        grid = _.range(rows).map(function(row){
            return _.range(cols).map(function(col){
                return new ImageCell(_self, row, col);
            });
        }),
        bound = settings.EPIPOLAR_LINE_RADIUS + Math.sqrt(2)*mu/2;

    _.extend(this, {
        mu: mu,
        img: img,
        cam: cam,
        rows: rows,
        cols: cols,
        grid: grid,
        bound: bound
    });

    features.forEach(function(f){

        var r = Math.floor(f.row/mu),
            c = Math.floor(f.col/mu),
            cell = grid[r][c],
            point = Vector.create(cord.featureToImg(f, cam));

        if (cell.features) {
            cell.features.push(point);
        }
        else {
            cell.features = [point];
        }

    });

}