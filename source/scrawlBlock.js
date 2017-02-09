//---------------------------------------------------------------------------------
// The MIT License (MIT)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//---------------------------------------------------------------------------------

/**
# scrawlBlock

## Purpose and features

The Block extension adds Block entitys - squares and rectangles - to the core module

* Defines 'rect' objects for displaying on a Cell's canvas
* Performs 'rect' based drawing operations on canvases

@module scrawlBlock
**/

if (window.scrawl && window.scrawl.work.extensions && !window.scrawl.contains(window.scrawl.work.extensions, 'block')) {
	var scrawl = (function(my) {
		'use strict';
		/**
# window.scrawl

scrawlBlock extension adaptions to the scrawl-canvas library object

@class window.scrawl_Block
**/

		/**
A __factory__ function to generate new Block entitys
@method makeBlock
@param {Object} items Key:value Object argument for setting attributes
@return Block object
@example
	scrawl.makeBlock({
		width: 100,
		height: 50,
		startX: 150,
		startY: 60,
		fillStyle: 'blue',
		strokeStyle: 'red',
		roll: 30,
		method: 'sinkInto',
		});
**/
		my.makeBlock = function(items) {
			return new my.Block(items);
		};

		/**
# Block

## Instantiation

* scrawl.makeBlock()

## Purpose

* Defines 'rect' objects for displaying on a Cell's canvas
* Performs 'rect' based drawing operations on canvases

## Access

* scrawl.entity.BLOCKNAME - for the Block entity object

@class Block
@constructor
@extends Entity
@param {Object} [items] Key:value Object argument for setting attributes
**/
		my.Block = function Block(items) {
			this.init(items);
			// this.setLocalDimensions();
			this.setLocalDimensionsFlag = true;
			return this;
		};
		my.Block.prototype = Object.create(my.Entity.prototype);
		/**
@property type
@type String
@default 'Block'
@final
**/
		my.Block.prototype.type = 'Block';
		my.Block.prototype.classname = 'entitynames';
		my.Block.prototype.defs = {
			/**
Block display - width, in pixels
@property localWidth
@type Number
@default 0
@private
**/
			/**
Block display - height, in pixels
@property localHeight
@type Number
@default 0
@private
**/
		};
		my.mergeInto(my.Block.prototype.defs, my.Entity.prototype.defs);
		my.Block.prototype.getters = {};
		my.mergeInto(my.Block.prototype.getters, my.Entity.prototype.getters);
		my.Block.prototype.setters = {
			width: function(item){
				my.Entity.prototype.setters.width.call(this, item);
				this.setLocalDimensionsFlag = true;
			},
			height: function(item){
				my.Entity.prototype.setters.height.call(this, item);
				this.setLocalDimensionsFlag = true;
			},
			scale: function(item){
				my.Entity.prototype.setters.scale.call(this, item);
				this.setLocalDimensionsFlag = true;
			},
		};
		my.mergeInto(my.Block.prototype.setters, my.Entity.prototype.setters);
		my.Block.prototype.deltaSetters = {};
		my.mergeInto(my.Block.prototype.deltaSetters, my.Entity.prototype.deltaSetters);
		/**
Augments Entity.set() - sets the local dimensions
@method setLocalDimensions
@return This
@chainable
**/
		my.Block.prototype.setLocalDimensions = function() {
			var cell = my.cell[my.group[this.group].cell];
			this.setLocalDimensionsFlag = false;
			if (this.width.substring) {
				this.localWidth = (parseFloat(this.width) / 100) * cell.actualWidth * this.scale;
			}
			else {
				this.localWidth = this.width * this.scale || 0;
			}
			if (this.height.substring) {
				this.localHeight = (parseFloat(this.height) / 100) * cell.actualHeight * this.scale;
			}
			else {
				this.localHeight = this.height * this.scale || 0;
			}
			return this;
		};
		/**
Stamp helper function - perform a 'clip' method draw
@method clip
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@return This
@chainable
@private
**/
		my.Block.prototype.clip = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			this.rotateCell(ctx, cell);
			ctx.beginPath();
			ctx.rect(here.x, here.y, this.localWidth, this.localHeight);
			ctx.clip();
			return this;
		};
		/**
Stamp helper function - perform a 'clear' method draw
@method clear
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.clear = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			cell.setToClearShape();
			this.rotateCell(ctx, cell);
			ctx.clearRect(here.x, here.y, this.localWidth, this.localHeight);
			return this;
		};
		/**
Stamp helper function - perform a 'clearWithBackground' method draw
@method clearWithBackground
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.clearWithBackground = function(ctx, cellname, cell) {
			var bg = cell.get('backgroundColor'),
				myCellCtx = my.ctx[cellname],
				fillStyle = myCellCtx.get('fillStyle'),
				strokeStyle = myCellCtx.get('strokeStyle'),
				globalAlpha = myCellCtx.get('globalAlpha'),
				here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			this.rotateCell(ctx, cell);
			ctx.fillStyle = bg;
			ctx.strokeStyle = bg;
			ctx.globalAlpha = 1;
			ctx.strokeRect(here.x, here.y, this.localWidth, this.localHeight);
			ctx.fillRect(here.x, here.y, this.localWidth, this.localHeight);
			ctx.fillStyle = fillStyle;
			ctx.strokeStyle = strokeStyle;
			ctx.globalAlpha = globalAlpha;
			return this;
		};
		/**
Stamp helper function - perform a 'draw' method draw
@method draw
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.draw = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			cell.setEngine(this);
			this.rotateCell(ctx, cell);
			ctx.strokeRect(here.x, here.y, this.localWidth, this.localHeight);
			return this;
		};
		/**
Stamp helper function - perform a 'fill' method draw
@method fill
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.fill = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			cell.setEngine(this);
			this.rotateCell(ctx, cell);
			ctx.fillRect(here.x, here.y, this.localWidth, this.localHeight);
			return this;
		};
		/**
Stamp helper function - perform a 'drawFill' method draw
@method drawFill
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.drawFill = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			cell.setEngine(this);
			this.rotateCell(ctx, cell);
			ctx.strokeRect(here.x, here.y, this.localWidth, this.localHeight);
			this.clearShadow(ctx, cell);
			ctx.fillRect(here.x, here.y, this.localWidth, this.localHeight);
			return this;
		};
		/**
Stamp helper function - perform a 'fillDraw' method draw
@method fillDraw
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.fillDraw = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			cell.setEngine(this);
			this.rotateCell(ctx, cell);
			ctx.fillRect(here.x, here.y, this.localWidth, this.localHeight);
			this.clearShadow(ctx, cell);
			ctx.strokeRect(here.x, here.y, this.localWidth, this.localHeight);
			return this;
		};
		/**
Stamp helper function - perform a 'sinkInto' method draw
@method sinkInto
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.sinkInto = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			cell.setEngine(this);
			this.rotateCell(ctx, cell);
			ctx.fillRect(here.x, here.y, this.localWidth, this.localHeight);
			ctx.strokeRect(here.x, here.y, this.localWidth, this.localHeight);
			return this;
		};
		/**
Stamp helper function - perform a 'floatOver' method draw
@method floatOver
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.floatOver = function(ctx, cellname, cell) {
			var here = this.currentHandle;
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			cell.setEngine(this);
			this.rotateCell(ctx, cell);
			ctx.strokeRect(here.x, here.y, this.localWidth, this.localHeight);
			ctx.fillRect(here.x, here.y, this.localWidth, this.localHeight);
			return this;
		};
		/**
Stamp helper function - perform a 'none' method draw
@method floatOver
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Block.prototype.none = function(ctx, cellname, cell) {
			if(this.setLocalDimensionsFlag){
				this.setLocalDimensions();
			}
			return this;
		};

		return my;
	}(scrawl));
}
