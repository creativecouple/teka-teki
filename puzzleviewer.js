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

/**
 * The viewers are stored in a subobject to avoid conflicts
 * when several viewers are loaded by one application.
 */
teka.viewer = {};

/**
 * Some default values.
 *
 * NORMAL, WAIT, BLINK_START and BLINK_END are used to control
 * the 'mode' of the viewer. WAIT waits for a mouseclick, while
 * the values between BLINK_START and BLINK_END make the puzzle
 * blink. In NORMAL mode, the cursor is shown.
 *
 * The SOLVED_COLOR define the colors used while blinking. They
 * will be overwritten by the defaults defined in puzzleapplet.js
 * or by the application.
 */
teka.viewer.Defaults = {
    NORMAL: -1,
    WAIT: -2,
    BLINK_START: 0,
    BLINK_END: 14,
    SOLVED_COLOR: [
        '#101010','#303030','#505050','#707070',
        '#909090','#A0A0A0','#B0B0B0','#C0C0C0'
    ]
};

/**
 * Constructor.
 *
 * Defines a new PuzzleViewer. This constructor should be
 * considered to be abstract, as it is of no use without a
 * child.
 */
teka.viewer.PuzzleViewer = function(data)
{
    teka.Display.call(this);

    this.mode = teka.viewer.Defaults.NORMAL;
    this.solved_color = teka.viewer.Defaults.SOLVED_COLOR;

    this.initData(data);
    this.reset();
    this.reset(); // Twice to reset undo too.
    this.saved = this.saveState();
    this.clearError();

    this.setExtent(0,0,300,300);

    this.color = 0;
    this.colortool = false;
};
teka.extend(teka.viewer.PuzzleViewer,teka.Display);

/** Sets the number of the color used. */
teka.viewer.PuzzleViewer.prototype.setColor = function(color)
{
    this.color = color;
};

/** Returns the number of the color used. */
teka.viewer.PuzzleViewer.prototype.getColor = function()
{
    return this.color;
};

/** Sets the mode. */
teka.viewer.PuzzleViewer.prototype.setMode = function(mode)
{
    this.mode = mode;
};

/** Returns the mode. */
teka.viewer.PuzzleViewer.prototype.getMode = function()
{
    return this.mode;
};

/** Sets the colors used while blinking. */
teka.viewer.PuzzleViewer.prototype.setSolvedColor = function(sc)
{
    this.solved_color = sc;
};

/** Sets the colortool for this viewer. */
teka.viewer.PuzzleViewer.prototype.setColorTool = function(colortool)
{
    this.colortool = colortool;
};

/** Returns the string defining the color from the colortool. */
teka.viewer.PuzzleViewer.prototype.getColorString = function(color)
{
    if (this.colortool===false) {
        return '#000';
    }
    return this.colortool.getColorString(color);
};

/** Are we blinking, due to correctly solved puzzle? */
teka.viewer.PuzzleViewer.prototype.isBlinking = function()
{
    return this.mode>=teka.viewer.Defaults.BLINK_START
        && this.mode<=teka.viewer.Defaults.BLINK_END;
};

/**
 * Returns one of the colors, that appear, when the puzzle blinks.
 * The function, to calculated, is based on four values taken from
 * the puzzle: x and y position, size of the puzzle and the value
 * at the position. The result ist not random, but may look like to
 * the user.
 */
teka.viewer.PuzzleViewer.prototype.getBlinkColor = function(x, y, size, val)
{
    var tmp = this.mode
        +(x+3)*this.mode%(y+1)
        +(y+1)*(y+4)*(9-this.mode)%(x+1)
        +val+x+y*(size+1);

    tmp = Math.floor(Math.abs(tmp)%8);

    return this.solved_color[tmp];
};

/**
 * Returns the properties of the puzzle. To be overridden by the
 * concret puzzles.
 */
teka.viewer.PuzzleViewer.prototype.getProperties = function()
{
    return [];
};

//////////////////////////////////////////////////////////////////

/** Abstract function. Init the viewer with a PSData object. */
teka.viewer.PuzzleViewer.prototype.initData = function(data) {};

/** Abstract function. Resets the puzzle. */
teka.viewer.PuzzleViewer.prototype.reset = function() {};

/** Abstract function. Deletes all error marks. */
teka.viewer.PuzzleViewer.prototype.clearError = function() {};

/** Abstract function. Changes the color of all items with the given color. */
teka.viewer.PuzzleViewer.prototype.copyColor = function(color) {};

/** Abstract function. Deletes all items with color. */
teka.viewer.PuzzleViewer.prototype.clearColor = function(color) {};

/** Abstract function. Return the current state of the viewer. */
teka.viewer.PuzzleViewer.prototype.saveState = function() { return {}; };

/** Abstract function. Set the state of the viewer. */
teka.viewer.PuzzleViewer.prototype.loadState = function(state) {};

/** Saves the current state for use in undo. */
teka.viewer.PuzzleViewer.prototype.save = function()
{
    this.saved = this.saveState();
};

/** Undos all changes since the last call to save. */
teka.viewer.PuzzleViewer.prototype.undo = function()
{
    if (this.saved!==false) {
        var tmp = this.saveState();
        this.loadState(this.saved);
        this.saved = tmp;
    }
};

//////////////////////////////////////////////////////////////////

/** Converts a puzzle in postscript ascii art to an array. */
teka.viewer.PuzzleViewer.prototype.asciiToArray = function(ascii)
{
    var instring = false;
    var s = '';
    var ascii_length = ascii.length;
    for (var i=0;i<ascii_length;i++) {
        var c = ascii.charAt(i);
        if (instring) {
            if (c==')') {
                instring = false;
            } else {
                s+=c;
            }
        } else {
            if (c=='(') {
                instring = true;
            }
        }
    }

    var breite = 1;
    var pos1 = ascii.indexOf("(");
    var pos2 = ascii.indexOf(")");
    if (pos1!=-1 && pos2!=-1) {
        breite = pos2-pos1-1;
    }
    var hoehe = s.length/breite;

    var c = [];
    for (var i=0;i<breite;i++) {
        c[i] = [];
    }

    for (var j=0;j<hoehe;j++) {
        for (var i=0;i<breite;i++) {
            c[i][j] = s.charAt(i+breite*j);
        }
    }

    return c;
};

/**
 * Reads a number of d digits from ascii art array c at
 * positon x,y. Returns false, if no number is found.
 */
teka.viewer.PuzzleViewer.prototype.getNr = function(c,x,y,d)
{
    var val = false;
    for (var i=0;i<d;i++)
        {
            var ch = c[x+i][y].charCodeAt(0);
            if (ch==' '.charCodeAt(0)) {
                continue;
            }
            if (val===false) {
                val=0;
            }
            val = val*10;
            if (ch>='0'.charCodeAt(0) && ch<='9'.charCodeAt(0)) {
                val += (ch-'0'.charCodeAt(0));
            }
        }
    return val;
};

/**
 * Reads a number of d digits from ascii art array c at
 * positon x,y vertically. Returns false, if no number is found.
 */
teka.viewer.PuzzleViewer.prototype.getVNr = function(c,x,y,d)
{
    var val = false;
    for (var i=0;i<d;i++)
        {
            var ch = c[x][y+i].charCodeAt(0);
            if (ch==' '.charCodeAt(0)) {
                continue;
            }
            if (val===false) {
                val=0;
            }
            val = val*10;
            if (ch>='0'.charCodeAt(0) && ch<='9'.charCodeAt(0)) {
                val += (ch-'0'.charCodeAt(0));
            }
        }
    return val;
};

/**
 * Draw a star at position x,y.
 */
teka.viewer.PuzzleViewer.prototype.drawStar = function(g, x, y)
{
    g.save();
    g.translate(x,y);
    g.beginPath();
    var first = true;

    for (var i=0;i<10;i+=2) {
        var w1 = Math.PI/5*i;
        var w2 = Math.PI/5*(i+1);
        var x1 = Math.sin(w1)*0.45*this.scale;
        var y1 = -Math.cos(w1)*0.45*this.scale;
        var x2 = Math.sin(w2)*0.18*this.scale;
        var y2 = -Math.cos(w2)*0.18*this.scale;

        if (first) {
            g.moveTo(x1,y1);
            first = false;
        } else {
            g.lineTo(x1,y1);
        }
        g.lineTo(x2,y2);
    }

    g.closePath();
    g.fill();
    g.restore();
};
