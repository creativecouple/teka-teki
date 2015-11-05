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

teka.viewer.kropki = {};

teka.viewer.kropki.Defaults = {
    NONE: 0,
    EMPTY: 1,
    FULL: 2
};

teka.viewer.kropki.KropkiViewer = function(data)
{
    this.x = 0;
    this.y = 0;
    
    this.initData(data);
};
teka.viewer.kropki.KropkiViewer.prototype = teka.viewer.PuzzleViewer.prototype;

teka.viewer.kropki.KropkiViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'));
    this.asciiToData(data.get('puzzle'));
    
    this.f = [];
    for (var i=0;i<this.X;i++) {
        this.f[i] = [];
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = 0;
        }
    }
};

teka.viewer.kropki.KropkiViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===undefined) return;

    var c = this.asciiToArray(ascii);

    this.puzzle = [];
    for (var i=0;i<this.X;i++) {
        this.puzzle[i] = [];
    }
    
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            var ch = c[2*i+1][2*j+1];
            if (ch.charCodeAt(0)>='0'.charCodeAt(0) && ch.charCodeAt(0)<='9'.charCodeAt(0)) {
                this.puzzle[i][j] = ch.charCodeAt(0)-'0'.charCodeAt(0);
            } else if (ch.charCodeAt(0)>='A'.charCodeAt(0) && ch.charCodeAt(0)<='Z'.charCodeAt(0)) {
                this.puzzle[i][j] = ch.charCodeAt(0)-'A'.charCodeAt(0)+10;
            } else {
                this.puzzle[i][j] = 0;
            }
        }
    }
    
    this.lrdots = [];
    for (var i=0;i<this.X-1;i++) {
        this.lrdots[i] = [];
    }

    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.X;j++) {
            if (c[2*i+2][2*j+1].charCodeAt(0)=='O'.charCodeAt(0)) {
                this.lrdots[i][j] = teka.viewer.kropki.Defaults.EMPTY;
            } else if (c[2*i+2][2*j+1].charCodeAt(0)=='*'.charCodeAt(0)) {
                this.lrdots[i][j] = teka.viewer.kropki.Defaults.FULL;
            } else {
                this.lrdots[i][j] = teka.viewer.kropki.Defaults.NONE;
            }
        }
    }
    
    this.uddots = [];
    for (var i=0;i<this.X;i++) {
        this.uddots[i] = [];
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X-1;j++) {
            if (c[2*i+1][2*j+2].charCodeAt(0)=='O'.charCodeAt(0)) {
                this.uddots[i][j] = teka.viewer.kropki.Defaults.EMPTY;
            } else if (c[2*i+1][2*j+2].charCodeAt(0)=='*'.charCodeAt(0)) {
                this.uddots[i][j] = teka.viewer.kropki.Defaults.FULL;
            } else {
                this.uddots[i][j] = teka.viewer.kropki.Defaults.NONE;
            }
        }
    }
};

teka.viewer.kropki.KropkiViewer.prototype.getName = function()
{
    return 'Kropki';
};

teka.viewer.kropki.KropkiViewer.prototype.setMetrics = function(width, height)
{
    this.scale = Math.round(Math.min((width-3)/this.X,(height-3)/this.X));
    this.width = this.X * this.scale + 3;
    this.height = this.X * this.scale + 3;
    
    this.left = Math.round((width-this.width)/2)+0.5;
    this.top = Math.round((height-this.height)/2)+0.5;
};

teka.viewer.kropki.KropkiViewer.prototype.paintImage = function(g) 
{
    var X = this.X;
    var S = this.scale;
    
    g.save();
    g.translate(this.left,this.top);

    g.fillStyle = '#ffffff';
    g.fillRect(1,1,X*S,X*S);
    
    g.strokeStyle = '#000000';
    for (var i=0;i<=X;i++) {
        g.beginPath();
        g.moveTo(1,i*S+1);
        g.lineTo(X*S+1,i*S+1);
        g.stroke();
        
        g.beginPath();
        g.moveTo(i*S+1,1);
        g.lineTo(i*S+1,X*S+1);
        g.stroke();
    }
    g.strokeRect(2,2,X*S-2,X*S-2);
    g.strokeRect(0,0,X*S+2,X*S+2);
    
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            if (this.lrdots[i][j]==teka.viewer.kropki.Defaults.EMPTY) {
                g.fillStyle='#ffffff';
                g.beginPath();
                g.arc((i+1)*S+1,j*S+S/2+1,S/8,S/8,0,2*Math.PI);
                g.fill();
                g.strokeStyle='#000000';
                g.beginPath();
                g.arc((i+1)*S+1,j*S+S/2+1,S/8,S/8,0,2*Math.PI);
                g.stroke();
            } else if (this.lrdots[i][j]==teka.viewer.kropki.Defaults.FULL) {
                g.fillStyle='#000000';
                g.beginPath();
                g.arc((i+1)*S+1,j*S+S/2+1,S/8,S/8,0,2*Math.PI);
                g.fill();
            }
        }
    }
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            if (this.uddots[i][j]==teka.viewer.kropki.Defaults.EMPTY) {
                g.fillStyle='#ffffff';
                g.beginPath();
                g.arc(i*S+S/2+1,(j+1)*S+1,S/8,S/8,0,2*Math.PI);
                g.fill();
                g.strokeStyle='#000000';
                g.beginPath();
                g.arc(i*S+S/2+1,(j+1)*S+1,S/8,S/8,0,2*Math.PI);
                g.stroke();
            } else if (this.uddots[i][j]==teka.viewer.kropki.Defaults.FULL) {
                g.fillStyle='#000000';
                g.beginPath();
                g.arc(i*S+S/2+1,(j+1)*S+1,S/8,S/8,0,2*Math.PI);
                g.fill();
            }
        }
    }
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=0) {
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillStyle = '#000000';
                g.font = 'bold '+Math.round(S/2)+'px sans-serif';
                g.fillText(this.puzzle[i][j],1+i*S+S/2,1+j*S+S/2);
                continue;
            }
            if (this.f[i][j]>0) {
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillStyle = '#000000';
                g.font = Math.round(S/2)+'px sans-serif';
                g.fillText(this.f[i][j],1+i*S+S/2,1+j*S+S/2);
                continue;
            }
        }
    }

    g.strokeStyle='#ff0000';
    g.strokeRect(S*this.x+4,S*this.y+4,S-6,S-6);
    g.strokeRect(S*this.x+5,S*this.y+5,S-8,S-8);
    
    g.restore();
};

teka.viewer.kropki.KropkiViewer.prototype.processMouseMovedEvent = function(xc,yc)
{
    xc = xc-this.left-1;
    yc = yc-this.top-1;

    var oldx = this.x;
    var oldy = this.y;
    
    this.x = Math.floor(xc/this.scale);
    this.y = Math.floor(yc/this.scale);
    
    if (this.x<0) { this.x=0; }
    if (this.y<0) { this.y=0; }
    if (this.x>this.X-1) { this.x=this.X-1; }
    if (this.y>this.X-1) { this.y=this.X-1; }
    
    return this.x!=oldx || this.y!=oldy;
};

teka.viewer.kropki.KropkiViewer.prototype.processMousePressedEvent = function(xc,yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);
    
    xc-=this.left;
    yc-=this.top;
    
    if (xc<0 || yc<0 || xc>=this.X*this.scale || yc>=this.X*this.scale) { return erg; }
    
    this.f[this.x][this.y] = (this.f[this.x][this.y]+1) % (this.X+1);
    
    return true;
};

teka.viewer.kropki.KropkiViewer.prototype.processKeyEvent = function(key,c)
{
    if (key==40 && this.y<this.X-1) {
        this.y++;
        return true;
    }
    if (key==38 && this.y>0) {
        this.y--;
        return true;
    }
    if (key==39 && this.x<this.X-1) {
        this.x++;
        return true;
    }
    if (key==37 && this.x>0) {
        this.x--;
        return true;
    }
    
    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.X) { return false; }
    
    if (c>=49 && c<=48+this.X) {
        this.f[this.x][this.y] = c-48;
        return true;
    }
    if (c==32) {
        this.f[this.x][this.y] = 0;
        return true;
    }

    return false;
};
