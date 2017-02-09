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
# scrawlWheel

## Purpose and features

The Wheel extension adds Wheel entitys - circles, segments and filled arcs - to the core module

* Defines 'arc' objects for displaying on a Cell's canvas
* Performs 'arc' based drawing operations on canvases

@module scrawlWheel
**/
if (window.scrawl && window.scrawl.work.extensions && !window.scrawl.contains(window.scrawl.work.extensions, 'wheel')) {
	var scrawl = (function(my) {
		'use strict';

		/**
# window.scrawl

scrawlWheel extension adaptions to the scrawl-canvas library object

@class window.scrawl_Wheel
**/

		/**
A __factory__ function to generate new Wheel entitys
@method makeWheel
@param {Object} items Key:value Object argument for setting attributes
@return Wheel object
@example
	scrawl.makeWheel({
		radius: 50,
		startX: 150,
		startY: 60,
		fillStyle: 'blue',
		strokeStyle: 'red',
		method: 'drawFill',
		});
**/
		my.makeWheel = function(items) {
			return new my.Wheel(items);
		};
		/**
Work vector, for wheel-specific calculations
@property scrawl.work.workwheel
@type {Vector}
@private
**/
		my.work.workwheel = {
			v1: my.makeVector(),
		};
		/**
# Wheel

## Instantiation

* scrawl.makeWheel()

## Purpose

* Defines 'arc' objects for displaying on a Cell's canvas
* Performs 'arc' based drawing operations on canvases

## Access

* scrawl.entity.WHEELNAME - for the Wheel entity object

@class Wheel
@constructor
@extends Entity
@param {Object} [items] Key:value Object argument for setting attributes
**/
		my.Wheel = function Wheel(items) {
			this.init(items);
			return this;
		};
		my.Wheel.prototype = Object.create(my.Entity.prototype);
		/**
@property type
@type String
@default 'Wheel'
@final
**/
		my.Wheel.prototype.type = 'Wheel';
		my.Wheel.prototype.classname = 'entitynames';
		my.Wheel.prototype.defs = {
			/**
Circle radius - can be an absolute Numbewr value, or a percentage String value (relative to the Cell's width)
@property radius
@type Number (or String)
@default 0
**/
			radius: 0,
			/**
Angle of the path's start point, from due east, in degrees
@property startAngle
@type Number
@default 0
**/
			startAngle: 0,
			/**
Angle of the path's end point, from due east, in degrees
@property endAngle
@type Number
@default 360
**/
			endAngle: 360,
			/**
Drawing flag - true to draw the arc in a clockwise direction; false for anti-clockwise
@property clockwise
@type Boolean
@default false
**/
			clockwise: false,
			/**
Drawing flag - true to close the path; false to keep the path open
@property closed
@type Boolean
@default true
**/
			closed: true,
			/**
Drawing flag - true to include the center in the path (for wedge shapes); false for circles
@property includeCenter
@type Boolean
@default false
**/
			includeCenter: false,
			/**
Collision calculation flag - true to use a simple radius check; false to use the JavaScript isPointInPath() function
@property checkHitUsingRadius
@type Boolean
@default true
**/
			checkHitUsingRadius: true,
			/**
Collision calculation value - collision radius, from start vector

May be an absolute number value, or a percentage String (relative to the Cell's width)
@property checkHitRadius
@type Number (or String)
@default 0
**/
			checkHitRadius: 0,
			/**
Calculated radius value
@property localRadius
@type Number
@default 0
@private
**/
			/**
Collision calculation value - collision radius, from start vector
@property localCheckHitRadius
@type Number
@default 0
@private
**/
		};
		my.mergeInto(my.Wheel.prototype.defs, my.Entity.prototype.defs);
		my.Wheel.prototype.keyAttributeList = my.mergeArraysUnique(my.Entity.prototype.keyAttributeList, ['radius', 'startAngle', 'endAngle', 'clockwise', 'closed', 'includeCenter', 'checkHitUsingRadius', 'checkHitRadius']);
		my.Wheel.prototype.getters = {};
		my.mergeInto(my.Wheel.prototype.getters, my.Entity.prototype.getters);
		my.Wheel.prototype.setters = {
			radius: function(item){
				this.radius = item;
				this.localRadiusFlag = true;
			},
			checkHitRadius: function(item){
				this.checkHitRadius = item;
				this.localRadiusFlag = true;
			},
		};
		my.mergeInto(my.Wheel.prototype.setters, my.Entity.prototype.setters);
		my.Wheel.prototype.deltaSetters = {
			radius: function(item){
				var n = this.radius;
				if(item.substring || n.substring){
					this.radius = parseFloat(n) + parseFloat(item) + '%';
				}
				else{
					this.radius += item;
				}
				this.localRadiusFlag = true;
			},
			checkHitRadius: function(item){
				var n = this.checkHitRadius;
				if(item.substring || n.substring){
					this.checkHitRadius = parseFloat(n) + parseFloat(item) + '%';
				}
				else{
					this.checkHitRadius += item;
				}
				this.localRadiusFlag = true;
			}
		};
		my.mergeInto(my.Wheel.prototype.deltaSetters, my.Entity.prototype.deltaSetters);
		/**
set helper function
@method setRadius
@return Number - local radius value
@private
**/
		my.Wheel.prototype.setRadius = function(item) {
			var cell;
			if (item.toFixed) {
				return item;
			}
			cell = my.cell[my.group[this.group].cell];
			if (my.xt(cell, cell.actualWidth)) {
				return (parseFloat(item) / 100) * cell.actualWidth;
			}
			return 0;
		};
		/**
get the current radius value, in pixels
@method getRadius
@return Number - local radius value
@private
**/
		my.Wheel.prototype.getRadius = function(item) {
			return this.localRadius;
		};
		/**
Check a set of coordinates to see if any of them fall within this entity's path - uses JavaScript's _isPointInPath_ function

Argument object contains the following attributes:

* __tests__ - an array of Vector coordinates to be checked; alternatively can be a single Vector
* __x__ - X coordinate
* __y__ - Y coordinate
* __pad__ - PADNAME String

Either the 'tests' attribute should contain a Vector, or an array of vectors, or the x and y attributes should be set to Number values

If the __checkHitUsingRadius__ attribute is true, collisions will be detected using a simple distance comparison; otherwise the JavaScript isPointInPath() function will be invoked
@method checkHit
@param {Object} items Argument object
@return The first coordinate to fall within the entity's path; false if none fall within the path
**/
		my.Wheel.prototype.checkHit = function(items) {
			var i,
				iz,
				tests,
				result,
				testRadius,
				cvx = my.work.cvx,
				v1 = my.work.workwheel.v1,
				handle,
				start,
				scale,
				roll,
				reverse,
				upend;
			items = my.safeObject(items);
			tests = (my.xt(items.tests)) ? items.tests : [(items.x || false), (items.y || false)];
			result = false;
			if (this.checkHitUsingRadius) {
				testRadius = (this.localCheckHitRadius) ? this.localCheckHitRadius : this.localRadius * this.scale;
				handle = this.currentHandle;
				if (!handle.flag) {
					this.updateCurrentHandle();
				}
				start = this.currentStart;
				roll = this.roll;
				scale = this.scale;
				reverse = this.flipReverse;
				upend = this.flipUpend;
				for (i = 0, iz = tests.length; i < iz; i += 2) {
					v1.x = tests[i];
					v1.y = tests[i + 1];
					v1.vectorSubtract(start).scalarDivide(scale).rotate(-roll);
					v1.x = (reverse) ? -v1.x : v1.x;
					v1.y = (upend) ? -v1.y : v1.y;
					v1.vectorSubtract(handle);
					result = (v1.getMagnitude() <= testRadius) ? true : false;
					if (result) {
						items.x = tests[i];
						items.y = tests[i + 1];
						break;
					}
				}
			}
			else {
				this.buildPath(cvx);
				for (i = 0, iz = tests.length; i < iz; i += 2) {
					result = cvx.isPointInPath(tests[i], tests[i + 1]);
					if (result) {
						items.x = tests[i];
						items.y = tests[i + 1];
						break;
					}
				}
			}
			return (result) ? items : false;
		};
		/**
Stamp helper function - define the entity's path on the &lt;canvas&gt; element's context engine
@method buildPath
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Wheel.prototype.buildPath = function(ctx, cell) {
			var here = this.currentHandle,
				rad = 0.0174533;
			if(this.localRadiusFlag){
				this.localRadiusFlag = false;
				this.localRadius = this.setRadius(this.radius);
				this.localCheckHitRadius = this.setRadius(this.checkHitRadius);
			}
			this.rotateCell(ctx, cell);
			ctx.beginPath();
			ctx.arc(here.x, here.y, (this.localRadius * this.scale), (this.startAngle * rad), (this.endAngle * rad), this.clockwise);
			if (this.includeCenter) {
				ctx.lineTo(here.x, here.y);
			}
			if (this.closed) {
				ctx.closePath();
			}
			return this;
		};
		/**
Stamp helper function - perform a 'clip' method draw
@method clip
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Wheel.prototype.clip = function(ctx, cellname, cell) {
			this.buildPath(ctx, cell);
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
		my.Wheel.prototype.clear = function(ctx, cellname, cell) {
			ctx.globalCompositeOperation = 'destination-out';
			this.buildPath(ctx, cell);
			ctx.stroke();
			ctx.fill();
			ctx.globalCompositeOperation = my.ctx[cellname].get('globalCompositeOperation');
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
		my.Wheel.prototype.clearWithBackground = function(ctx, cellname, cell) {
			var myCell,
				bc,
				myCellCtx,
				fillStyle,
				strokeStyle,
				globalAlpha;
			myCell = cell;
			bc = myCell.get('backgroundColor');
			myCellCtx = my.ctx[cellname];
			fillStyle = myCellCtx.get('fillStyle');
			strokeStyle = myCellCtx.get('strokeStyle');
			globalAlpha = myCellCtx.get('globalAlpha');
			ctx.fillStyle = bc;
			ctx.strokeStyle = bc;
			ctx.globalAlpha = 1;
			this.buildPath(ctx, cell);
			ctx.stroke();
			ctx.fill();
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
		my.Wheel.prototype.draw = function(ctx, cellname, cell) {
			cell.setEngine(this);
			this.buildPath(ctx, cell);
			ctx.stroke();
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
		my.Wheel.prototype.fill = function(ctx, cellname, cell) {
			cell.setEngine(this);
			this.buildPath(ctx, cell);
			ctx.fill();
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
		my.Wheel.prototype.drawFill = function(ctx, cellname, cell) {
			cell.setEngine(this);
			this.buildPath(ctx, cell);
			ctx.stroke();
			this.clearShadow(ctx, cell);
			ctx.fill();
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
		my.Wheel.prototype.fillDraw = function(ctx, cellname, cell) {
			cell.setEngine(this);
			this.buildPath(ctx, cell);
			ctx.fill();
			this.clearShadow(ctx, cell);
			ctx.stroke();
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
		my.Wheel.prototype.sinkInto = function(ctx, cellname, cell) {
			cell.setEngine(this);
			this.buildPath(ctx, cell);
			ctx.fill();
			ctx.stroke();
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
		my.Wheel.prototype.floatOver = function(ctx, cellname, cell) {
			cell.setEngine(this);
			this.buildPath(ctx, cell);
			ctx.stroke();
			ctx.fill();
			return this;
		};
		/**
Stamp helper function - perform a 'none' method draw
@method none
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this entity's Group object
@return This
@chainable
@private
**/
		my.Wheel.prototype.none = function(ctx, cellname, cell) {
			this.buildPath(ctx, cell);
			return this;
		};
		/**
Collision detection helper function

Parses the collisionPoints array to generate coordinate Vectors representing the entity's collision points
@method buildCollisionVectors
@param {Array} [items] Array of collision point data
@return This
@chainable
@private
**/
		my.Wheel.prototype.buildCollisionVectors = function(items) {
			var p,
				r,
				i,
				iz,
				j,
				v1, v2;
			if (my.xt(my.workcols)) {
				v1 = my.workcols.v1;
				v2 = my.workcols.v2;
				this.collisionVectors.length = 0;
				v1.x = this.localRadius;
				v1.y = 0;
				p = (my.xt(items)) ? this.parseCollisionPoints(items) : this.collisionPoints;
				for (i = 0, iz = p.length; i < iz; i++) {
					if (p[i].toFixed && p[i] > 1) {
						v2.set(v1);
						r = 360 / Math.floor(p[i]);
						for (j = 0; j < p[i]; j++) {
							v2.rotate(r);
							this.collisionVectors.push(v2.x);
							this.collisionVectors.push(v2.y);
						}
					}
					else if (p[i].substring) {
						v2.set(v1);
						switch (p[i]) {
							case 'start':
								this.collisionVectors.push(0);
								this.collisionVectors.push(0);
								break;
							case 'N':
								v2.rotate(-90);
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'NE':
								v2.rotate(-45);
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'E':
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'SE':
								v2.rotate(45);
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'S':
								v2.rotate(90);
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'SW':
								v2.rotate(135);
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'W':
								v2.rotate(180);
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'NW':
								v2.rotate(-135);
								this.collisionVectors.push(v2.x);
								this.collisionVectors.push(v2.y);
								break;
							case 'center':
								this.collisionVectors.push(0);
								this.collisionVectors.push(0);
								break;
						}
					}
					else if (my.isa_vector(p[i])) {
						this.collisionVectors.push(p[i].x);
						this.collisionVectors.push(p[i].y);
					}
				}
			}
			return this;
		};

		return my;
	}(scrawl));
}
