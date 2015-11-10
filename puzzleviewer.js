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

teka.viewer = {};

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

teka.viewer.PuzzleViewer = function() 
{
    this.mode = teka.viewer.Defaults.NORMAL;
    this.solved_color = teka.viewer.Defaults.SOLVED_COLOR;
    this.setExtent(0,0,300,300);
};
teka.viewer.PuzzleViewer.prototype = new teka.Display;

teka.viewer.PuzzleViewer.prototype.setMode = function(mode) 
{
    this.mode = mode;
};

teka.viewer.PuzzleViewer.prototype.getMode = function()
{
    return this.mode;
};

teka.viewer.PuzzleViewer.prototype.setSolvedColor = function(sc)
{
    this.solved_color = sc;
};

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

