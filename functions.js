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
 * The first error, that occured. If false, no error has occured yet.
 */
teka.error = false;

/**
 * Calculates the position of the mouse relative to the canvas.
 * pageX/Y works in most browsers although it's still in the draft status.
 * In IE8 pageX/Y is not set at all. There the mouseposition is calculated
 * using clientX/Y and scroll information.
 */
teka.normalizeMouseEvent = function(e)
{
    return {
        x: e.pageX!==undefined?
            e.pageX:
            e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,
        y: e.pageY!==undefined?
            e.pageY:
            e.clientY+document.body.scrollTop+document.documentElement.scrollTop
    };
};

teka.buttonPressed = function(e)
{
    if (e.buttons!==undefined) {
        return e.buttons>0;
    }
    if (e.which!==undefined) {
        return e.which>0;
    }
    return false;
};

/**
 * Calculates the value of the key.
 * Should work in all supported browsers.
 */
teka.normalizeKeyEvent = function(e)
{
    var ret = {
        key: e.keyCode,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
    };

    // correct nonstandard of firefox:
    if (ret.key==181) {
        ret.key = 173;
    }
    if (ret.key==182) {
        ret.key = 174;
    }
    if (ret.key==183) {
        ret.key = 175;
    }
    if (ret.key==59) {
        ret.key = 186;
    }
    if (ret.key==61 || ret.key==171) {
        ret.key = 187;
    }
    if (ret.key==173) {
        ret.key = 189;
    }

    // keypad numbers should behave like normal numbers:
    if (ret.key>=96 && ret.key<=105) {
        ret.key-=48;
    }

    // keypad del is normal del:
    if (ret.key==110) {
        ret.key = 46;
    }

    // simulate hash key on some key boards, where it is shift-3:
    if (ret.key==51 && ret.shift) {
        ret.shift = false;
        ret.key = 163;
    }

    // Komma on key pad
    if (ret.key==108) {
        ret.key = 188;
    }

    return ret;
};

/** Stops propagation of an event. */
teka.stopPropagation = function(e)
{
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }
};

/** A simple way to use bind on anonymous functions. */
teka.myBind = function(ptr,fn)
{
    return fn.bind(ptr);
};

/** Converts some HTML entities to their normal counterpart. */
teka.convertEntities = function(s)
{
    s = s.replace('&auml;','ä');
    s = s.replace('&ouml;','ö');
    s = s.replace('&uuml;','ü');
    s = s.replace('&Auml;','Ä');
    s = s.replace('&Ouml;','Ö');
    s = s.replace('&Uuml;','Ü');
    s = s.replace('&szlig;','ß');
    return s;
};

/** Sets the error, if none has been set yet. */
teka.setError = function(val)
{
    if (teka.error===false) {
        teka.error = val;
    }
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

/** Return ascii-index of a character (= string of length 1) */
teka.ord = function(c)
{
    return c.charCodeAt(0);
};

/** Return character of an ascii-index */
teka.chr = function(c)
{
    return String.fromCharCode(c);
};

/** Returns the square of x */
teka.sqr = function(x)
{
    return x*x;
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
    if (start===undefined) {
        start = 0;
    }
    if (end===undefined) {
        end = 2*Math.PI;
    }
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
    if (start===undefined) {
        start = 0;
    }
    if (end===undefined) {
        end = 2*Math.PI;
    }
    g.beginPath();
    g.arc(x,y,scale,start,end);
    g.stroke();
};

/**
 * Calculates the height of a digit in the specified font.
 * As javascript doesn't provide this information, it has to be
 * calculated using the image data.
 */
teka.getFontData = function(font,size)
{
    if (size<=5) {
        return { font:font, delta:0 };
    }

    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    var image = canvas.getContext("2d");

    image.fillStyle = '#000';
    image.fillRect(0,0,size,size);
    image.fillStyle = '#f00';
    image.textAlign = 'center';
    image.textBaseline = 'middle';
    image.font = font;
    image.fillText('0',size/2,size/2);

    var data = image.getImageData(0,0,size,size).data;

    var top = 0;
    top: for (var j=0;j<size;j++) {
        for (var i=0;i<size;i++) {
            if (data[4*(i+size*j)]!==0) {
                top = j;
                break top;
            }
        }
    }

    var bottom = 0;
    bottom: for (var j=size-1;j>=0;j--) {
        for (var i=0;i<size;i++) {
            if (data[4*(i+size*j)]!==0) {
                bottom = j;
                break bottom;
            }
        }
    }

    var delta = 0;
    if (top<bottom) {
        delta = size/2-(bottom+top)/2;
    }

    return { font:font, delta:delta };
};

//////////////////////////////////////////////////////////////////

/** Constants to be used in keyboard events */
teka.KEY_LEFT = 37;
teka.KEY_RIGHT = 39;
teka.KEY_UP = 38;
teka.KEY_DOWN = 40;
teka.KEY_0 = 48;
teka.KEY_1 = 49;
teka.KEY_9 = 57;
teka.KEY_SPACE = 32;
teka.KEY_HASH = 163; // Maybe not browser or keyboard compatible...
teka.KEY_COMMA = 188;
teka.KEY_DOT = 190;
teka.KEY_SLASH = 191;
teka.KEY_F1 = 112;
teka.KEY_F2 = 113;
teka.KEY_F3 = 114;
teka.KEY_F4 = 115;
teka.KEY_F5 = 116;
teka.KEY_F6 = 117;
teka.KEY_F7 = 118;
teka.KEY_F8 = 119;
teka.KEY_F9 = 120;
teka.KEY_F10 = 121;
teka.KEY_F11 = 122;
teka.KEY_F12 = 123;
teka.KEY_ENTER = 13;
teka.KEY_PAGE_UP = 33;
teka.KEY_PAGE_DOWN = 34;
teka.KEY_PLUS = 187;
teka.KEY_MINUS = 189;
teka.KEY_A = 65;
teka.KEY_B = 66;
teka.KEY_D = 68;
teka.KEY_E = 69;
teka.KEY_N = 78;
teka.KEY_O = 79;
teka.KEY_Q = 81;
teka.KEY_S = 83;
teka.KEY_W = 87;
teka.KEY_X = 88;
teka.KEY_Z = 90;
teka.KEY_SHIFT = 16;
teka.KEY_ESCAPE = 27;
