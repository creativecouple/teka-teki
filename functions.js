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

/** Converts duration d, given in seconds, into a human readable format. */
teka.niceTime = function(d,brief)
{
    if (brief!==true) {
        brief = false;
    }

    var sec = d%60;
    d = Math.floor(d/60);
    var min = d%60;
    d = Math.floor(d/60);

    if (brief) {
        return (d<10?'0':'')+d+":"+(min<10?'0':'')+min+":"+(sec<10?'0':'')+sec;
    }

    var hrs = d%24;
    d = Math.floor(d/24);

    if (d===0 && hrs===0 && min===0) {
        return teka.translate('duration_seconds',[sec]);
    }
    if (d===0 && hrs===0) {
        return teka.translate('duration_minutes',[min,sec]);
    }
    if (d===0) {
        return teka.translate('duration_hours',[hrs,min,sec]);
    }
    return teka.translate('duration_days',[d,hrs,min,sec]);
};

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
 * Calculates the value of the key of an keypress event.
 * Should work in all supported browsers.
 */
teka.normalizeKeyPressEvent = function(e)
{
    var ret = {
        key: e.charCode,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
    };

    if (ret.key===0) {
        return false;
    }

    // map lowercase letters to uppercase letters
    if (ret.key>=97 && ret.key<=122) {
        ret.key-=32;
    }

    return ret;
};

/**
 * Calculates the value of the key.
 * Should work in all supported browsers.
 */
teka.normalizeKeyDownEvent = function(e)
{
    var ret = {
        key: e.keyCode+256,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
    };

    if (ret.key==teka.KEY_BACKSPACE ||
        ret.key==teka.KEY_ENTER ||
        ret.key==teka.KEY_ESCAPE ||
        ret.key==teka.KEY_PAGE_UP ||
        ret.key==teka.KEY_PAGE_DOWN ||
        ret.key==teka.KEY_LEFT ||
        ret.key==teka.KEY_RIGHT ||
        ret.key==teka.KEY_UP ||
        ret.key==teka.KEY_DOWN ||
        (ret.key>=teka.KEY_F1 && ret.key<=teka.KEY_F12)) {
        return ret;
    }

    return false;
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
 * Calculates the value of the key of an keypress event.
 * Should work in all supported browsers.
 */
teka.normalizeKeyPressEvent = function(e)
{
    var ret = {
        key: e.charCode,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
    };

    if (ret.key===0) {
        return false;
    }

    // map lowercase letters to uppercase letters
    if (ret.key>=97 && ret.key<=122) {
        ret.key-=32;
    }

    return ret;
};

/**
 * Calculates the value of the key.
 * Should work in all supported browsers.
 */
teka.normalizeKeyDownEvent = function(e)
{
    var ret = {
        key: e.keyCode+256,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
    };

    if (ret.key==teka.KEY_BACKSPACE ||
        ret.key==teka.KEY_ENTER ||
        ret.key==teka.KEY_ESCAPE ||
        ret.key==teka.KEY_PAGE_UP ||
        ret.key==teka.KEY_PAGE_DOWN ||
        ret.key==teka.KEY_LEFT ||
        ret.key==teka.KEY_RIGHT ||
        ret.key==teka.KEY_UP ||
        ret.key==teka.KEY_DOWN ||
        (ret.key>=teka.KEY_F1 && ret.key<=teka.KEY_F12)) {
        return ret;
    }

    return false;
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
 * Draws a filled arc with center in x,y, radius r,
 * starting at angle start and ending at angle end.
 */
teka.fillEllipse = function(g,x,y,r1,r2,start,end)
{
    if (start===undefined) {
        start = 0;
    }
    if (end===undefined) {
        end = 2*Math.PI;
    }
    g.save();
    g.translate(x,y);
    g.scale(r1,r2);
    g.beginPath();
    g.arc(0,0,1,start,end);
    g.fill();
    g.restore();
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
 * Draws a filled arc with center in x,y, radius r,
 * starting at angle start and ending at angle end.
 */
teka.strokeEllipse = function(g,x,y,r1,r2,start,end)
{
    if (start===undefined) {
        start = 0;
    }
    if (end===undefined) {
        end = 2*Math.PI;
    }
    g.save();
    g.translate(x,y);
    g.scale(r1,r2);
    g.lineWidth = g.lineWidth/((r1+r2)/2);
    g.beginPath();
    g.arc(0,0,1,start,end);
    g.stroke();
    g.restore();
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
teka.KEY_SPACE = 32;
teka.KEY_EXCLAMATION_MARK = 33;
teka.KEY_HASH = 35;
teka.KEY_PERCENT = 37;
teka.KEY_AMP = 38;
teka.KEY_STAR = 42;
teka.KEY_PLUS = 43;
teka.KEY_COMMA = 44;
teka.KEY_MINUS = 45;
teka.KEY_DOT = 46;
teka.KEY_SLASH = 47;
teka.KEY_0 = 48;
teka.KEY_1 = 49;
teka.KEY_2 = 50;
teka.KEY_3 = 51;
teka.KEY_4 = 52;
teka.KEY_5 = 53;
teka.KEY_6 = 54;
teka.KEY_7 = 55;
teka.KEY_8 = 56;
teka.KEY_9 = 57;
teka.KEY_COLON = 58;
teka.KEY_LESS = 60;
teka.KEY_GREATER = 62;
teka.KEY_QUESTION_MARK = 63;
teka.KEY_A = 65;
teka.KEY_B = 66;
teka.KEY_C = 67;
teka.KEY_D = 68;
teka.KEY_E = 69;
teka.KEY_F = 70;
teka.KEY_G = 71;
teka.KEY_H = 72;
teka.KEY_I = 73;
teka.KEY_J = 74;
teka.KEY_K = 75;
teka.KEY_L = 76;
teka.KEY_M = 77;
teka.KEY_N = 78;
teka.KEY_O = 79;
teka.KEY_P = 80;
teka.KEY_Q = 81;
teka.KEY_R = 82;
teka.KEY_S = 83;
teka.KEY_T = 84;
teka.KEY_U = 85;
teka.KEY_V = 86;
teka.KEY_W = 87;
teka.KEY_X = 88;
teka.KEY_Y = 89;
teka.KEY_Z = 90;
teka.KEY_CARET = 94;
teka.KEY_UNDERSCORE = 95;

teka.KEY_BACKSPACE = 8+256;
teka.KEY_ENTER = 13+256;
teka.KEY_ESCAPE = 27+256;
teka.KEY_PAGE_UP = 33+256;
teka.KEY_PAGE_DOWN = 34+256;
teka.KEY_LEFT = 37+256;
teka.KEY_RIGHT = 39+256;
teka.KEY_UP = 38+256;
teka.KEY_DOWN = 40+256;
teka.KEY_F1 = 112+256;
teka.KEY_F2 = 113+256;
teka.KEY_F3 = 114+256;
teka.KEY_F4 = 115+256;
teka.KEY_F5 = 116+256;
teka.KEY_F6 = 117+256;
teka.KEY_F7 = 118+256;
teka.KEY_F8 = 119+256;
teka.KEY_F9 = 120+256;
teka.KEY_F10 = 121+256;
teka.KEY_F11 = 122+256;
teka.KEY_F12 = 123+256;
