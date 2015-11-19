/*
 *  Copyright (C) 2015 Bernhard Seckinger
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of version 3 of the GNU General Public License as
 *  published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * This file contains some functions, that are helpful at several places.
 * Some of them try to fix browser incompatibilities.
 */


/**
 * Calculates the position of the mouse relative to the canvas.
 * Should work in all supported browsers.
 */
teka.normalizeMouseEvent = function(e)
{
    e.x = 0;
    e.y = 0;

    if (e.pageX != undefined && e.pageY != undefined) {
        e.x = e.pageX;
        e.y = e.pageY;
    } else {
        e.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        e.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return e;
};

/** A simple way to use bind on anonymous functions. */
teka.myBind = function(ptr,fn)
{
    return fn.bind(ptr);
};

/**
 * Dynamically loads a new javascript file by adding it to the end of
 * the HEAD element of the webpage.
 */
teka.addScript = function(src,callback)
{
    var script = document.createElement('script');
    script.onload = callback;
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    // added random number due to cached files while testing...
    script.src = src+'?r='+Math.random();
    document.getElementsByTagName('head')[0].appendChild(script);
};

/**
 * Implements object inheritance. Besides the constructor has to call
 * the constructor of its parent somehow.
 */
teka.extend = function(child,parent)
{
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};

/**
 * Creates a new array with dimensions given in dims, filled with the
 * value val.
 */
teka.new_array = function(dims,val)
{
    var param = dims[0];
    var newdims = [];
    for (var i=1;i<dims.length;i++) {
        newdims[i-1] = dims[i];
    }

    var tmp = [];
    for (var i=0;i<param;i++) {
        tmp[i] = (newdims.length===0)?val:teka.new_array(newdims,val);
    }

    return tmp;
};

/** Draws a line from x1,y1 to x2,y2 in image g. */
teka.drawLine = function(g,x1,y1,x2,y2)
{
    g.beginPath();
    g.moveTo(x1,y1);
    g.lineTo(x2,y2);
    g.stroke();
};

/**
 * Draws a filled arc with center in x,y, radius r,
 * starting at angle start and ending at angle end.
 */
teka.fillOval = function(g,x,y,r,start,end)
{
    g.beginPath();
    g.arc(x,y,r,start,end);
    g.fill();
};

/**
 * Draws a stroked arc with center in x,y, radius r,
 * starting at angle start and ending at angle end.
 */
teka.strokeOval = function(g,x,y,scale,start,end)
{
    g.beginPath();
    g.arc(x,y,scale,start,end);
    g.stroke();
};
