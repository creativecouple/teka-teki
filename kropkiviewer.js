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
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.kropki.KropkiViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

teka.viewer.kropki.KropkiViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    this.asciiToData(data.get('puzzle'));
    this.solution = this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
};

teka.viewer.kropki.KropkiViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var c = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            var ch = c[2*i+1][2*j+1];
            if (ch.charCodeAt(0)>='0'.charCodeAt(0) && ch.charCodeAt(0)<='9'.charCodeAt(0)) {
                this.puzzle[i][j] = ch.charCodeAt(0)-'0'.charCodeAt(0);
            } else if (ch.charCodeAt(0)>='A'.charCodeAt(0) && ch.charCodeAt(0)<='Z'.charCodeAt(0)) {
                this.puzzle[i][j] = ch.charCodeAt(0)-'A'.charCodeAt(0)+10;
            }
        }
    }

    this.lrdots = teka.new_array([this.X-1,this.X],teka.viewer.kropki.Defaults.NONE);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.X;j++) {
            if (c[2*i+2][2*j+1].charCodeAt(0)=='O'.charCodeAt(0)) {
                this.lrdots[i][j] = teka.viewer.kropki.Defaults.EMPTY;
            } else if (c[2*i+2][2*j+1].charCodeAt(0)=='*'.charCodeAt(0)) {
                this.lrdots[i][j] = teka.viewer.kropki.Defaults.FULL;
            }
        }
    }

    this.uddots = teka.new_array([this.X,this.X-1],teka.viewer.kropki.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X-1;j++) {
            if (c[2*i+1][2*j+2].charCodeAt(0)=='O'.charCodeAt(0)) {
                this.uddots[i][j] = teka.viewer.kropki.Defaults.EMPTY;
            } else if (c[2*i+1][2*j+2].charCodeAt(0)=='*'.charCodeAt(0)) {
                this.uddots[i][j] = teka.viewer.kropki.Defaults.FULL;
            }
        }
    }
};

teka.viewer.kropki.KropkiViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return null;
    }

    var c = this.asciiToArray(ascii);

    var erg = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            erg[i][j] = c[i][j].charCodeAt(0)-'0'.charCodeAt(0);
        }
    }

    return erg;
};

teka.viewer.kropki.KropkiViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

teka.viewer.kropki.KropkiViewer.prototype.getName = function()
{
    return teka.translate('kropki');
};

teka.viewer.kropki.KropkiViewer.prototype.getInstructions = function()
{
    return teka.translate('kropki_instructions');        
};

teka.viewer.kropki.KropkiViewer.prototype.getExample = function()
{
    return '/format 1 /type (kropki) /sol false /size 4'
        +' /puzzle [ (+-+-+-+-+) (| * * O |) (+ +*+*+O+) (|   * * |) (+O+ +O+*+)'
        +' (| O   * |) (+*+O+ +*+) (| * O   |) (+-+-+-+-+) ]'
        +' /solution [ (1243) (3124) (4312)(2431) ]';
};

teka.viewer.kropki.KropkiViewer.prototype.getUsage = function()
{
    return teka.translate('kropki_usage');
};

//////////////////////////////////////////////////////////////////

teka.viewer.kropki.KropkiViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = 0;
        }
    }
};

teka.viewer.kropki.KropkiViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
};

teka.viewer.kropki.KropkiViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
};

teka.viewer.kropki.KropkiViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = 0;
            }
        }
    }
};

teka.viewer.kropki.KropkiViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.X],0);
    var c = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }

    return { f:f, c:c };
};

teka.viewer.kropki.KropkiViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

teka.viewer.kropki.KropkiViewer.prototype.check = function()
{
    var X = this.X;

    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=0) {
                this.f[i][j] = this.puzzle[i][j];
            }
        }
    }

    var check = teka.new_array([this.X,this.X],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]===teka.viewer.kropki.Defaults.NONE) {
                    this.error[i][j] = true;
                    return teka.translate('kropki_unique_symbol');
                }
            } else {
                check[i][j] = this.f[i][j];
            }

            if (check[i][j]===teka.viewer.kropki.Defaults.NONE) {
                this.error[i][j] = true;
                return teka.translate('kropki_empty');
            }
        }
    }

    for (var j=0;j<X;j++) {
        var da = teka.new_array([X],false);
        for (var i=0;i<X;i++) {
            if (da[check[i][j]-1]===true) {
                for (var ii=0;ii<X;ii++) {
                    if (check[ii][j]==check[i][j]) {
                        this.error[ii][j] = true;
                    }
                }
                return teka.translate('kropki_row_duplicate');
            } else {
                da[check[i][j]-1] = true;
            }
        }
    }

    for (var i=0;i<X;i++) {
        var da = teka.new_array([X],false);
        for (var j=0;j<X;j++) {
            if (da[check[i][j]-1]===true) {
                for (var jj=0;jj<X;jj++) {
                    if (check[i][jj]==check[i][j]) {
                        this.error[i][jj] = true;
                    }
                }
                return teka.translate('kropki_column_duplicate');
            } else {
                da[check[i][j]-1] = true;
            }
        }
    }

    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            switch (this.lrdots[i][j]) {
              case teka.viewer.kropki.Defaults.NONE:
                if (check[i][j]==2*check[i+1][j] || check[i+1][j]==2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return teka.translate('kropki_twice');
                }
                if (check[i][j]==check[i+1][j]+1 || check[i+1][j]==check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return teka.translate('kropki_neighbours');
                }
                break;
              case teka.viewer.kropki.Defaults.EMPTY:
                if (check[i][j]!=check[i+1][j]+1 && check[i+1][j]!=check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return teka.translate('kropki_no_neighbours');
                }
                break;
              case teka.viewer.kropki.Defaults.FULL:
                if (check[i][j]!=2*check[i+1][j] && check[i+1][j]!=2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return teka.translate('kropki_not_twice');
                }
                break;
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            switch (this.uddots[i][j]) {
              case teka.viewer.kropki.Defaults.NONE:
                if (check[i][j]==2*check[i][j+1] || check[i][j+1]==2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return teka.translate('kropki_twice');
                }
                if (check[i][j]==check[i][j+1]+1 || check[i][j+1]==check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return teka.translate('kropki_neighbours');
                }
                break;
              case teka.viewer.kropki.Defaults.EMPTY:
                if (check[i][j]!=check[i][j+1]+1 && check[i][j+1]!=check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return teka.translate('kropki_no_neightbours');
                }
                break;
              case teka.viewer.kropki.Defaults.FULL:
                if (check[i][j]!=2*check[i][j+1] && check[i][j+1]!=2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return teka.translate('kropki_not_twice');
                }
                break;
            }
        }
    }

    return true;
};

//////////////////////////////////////////////////////////////////

teka.viewer.kropki.KropkiViewer.prototype.setMetrics = function()
{
    this.scale = Math.round(Math.min((this.width-3)/this.X,(this.height-3-this.textheight-2)/this.X));
    var realwidth = this.X * this.scale + 3;
    var realheight = this.X * this.scale + 3 + this.textheight+2;

    this.deltaX = Math.round((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.round((this.height-realheight)/2)+0.5;

    return {width:realwidth,height:realheight,scale:this.scale};
};

teka.viewer.kropki.KropkiViewer.prototype.paint = function(g)
{
    var X = this.X;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#ffffff';
    g.fillRect(1,1,X*S,X*S);

    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.mode>=teka.viewer.Defaults.BLINK_START
                && this.mode<=teka.viewer.Defaults.BLINK_END) {
                g.fillStyle = this.solved_color[
                                  Math.round(Math.abs(this.mode+(i+3)*this.mode%(j+1)
                                  +(j+1)*(j+4)*(9-this.mode)%(i+1)
                                  +this.f[i][j]+i+(X+1)*j))%8
                              ];
            } else if (this.error[i][j]===true) {
                g.fillStyle = '#f00';
            } else {
                g.fillStyle = '#fff';
            }
            g.fillRect(i*S+1,j*S+1,S,S);
        }
    }

    g.strokeStyle = '#000000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,1,i*S+1,X*S+1,i*S+1);
        teka.drawLine(g,i*S+1,1,i*S+1,X*S+1);
    }
    g.strokeRect(2,2,X*S-2,X*S-2);
    g.strokeRect(0,0,X*S+2,X*S+2);

    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            if (this.lrdots[i][j]==teka.viewer.kropki.Defaults.EMPTY) {
                g.fillStyle='#ffffff';
                teka.fillOval(g,(i+1)*S+1,j*S+S/2+1,S/8,S/8,0,2*Math.PI);
                g.strokeStyle='#000000';
                teka.strokeOval(g,(i+1)*S+1,j*S+S/2+1,S/8,S/8,0,2*Math.PI);
            } else if (this.lrdots[i][j]==teka.viewer.kropki.Defaults.FULL) {
                g.fillStyle='#000000';
                teka.fillOval(g,(i+1)*S+1,j*S+S/2+1,S/8,S/8,0,2*Math.PI);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            if (this.uddots[i][j]==teka.viewer.kropki.Defaults.EMPTY) {
                g.fillStyle='#ffffff';
                teka.fillOval(g,i*S+S/2+1,(j+1)*S+1,S/8,S/8,0,2*Math.PI);
                g.strokeStyle='#000000';
                teka.strokeOval(g,i*S+S/2+1,(j+1)*S+1,S/8,S/8,0,2*Math.PI);
            } else if (this.uddots[i][j]==teka.viewer.kropki.Defaults.FULL) {
                g.fillStyle='#000000';
                teka.fillOval(g,i*S+S/2+1,(j+1)*S+1,S/8,S/8,0,2*Math.PI);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!==0) {
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillStyle = '#000';
                g.font = 'bold '+Math.round(S/2)+'px sans-serif';
                g.fillText(this.puzzle[i][j],1+i*S+S/2,1+j*S+S/2);
                continue;
            }
            if (this.f[i][j]==teka.viewer.kropki.Defaults.NONE) {
                continue;
            }
            if (this.f[i][j]<1000) {
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = Math.round(S/2)+'px sans-serif';
                g.fillText(this.f[i][j],1+i*S+S/2,1+j*S+S/2);
                continue;
            }

            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillStyle = this.getColorString(this.c[i][j]);
            g.font = Math.round((S-6)/4)+'px sans-serif';
            for (var k=1;k<=9;k++) {
                if (((this.f[i][j]-1000)&(1<<k))!=0) {
                    g.fillText(''+k,1+S*i+((k-1)%3+1)*S/4,1+S*j+Math.floor((k-1)/3+1)*S/4);
                }
            }

            teka.drawLine(g,1+S*i+3*S/8,1+S*j+S/8,1+S*i+3*S/8,1+S*(j+1)-S/8);
            teka.drawLine(g,1+S*(i+1)-3*S/8,1+S*j+S/8,1+S*(i+1)-3*S/8,1+S*(j+1)-S/8);
            teka.drawLine(g,1+S*i+S/8,1+S*j+3*S/8,1+S*(i+1)-S/8,1+S*j+3*S/8);
            teka.drawLine(g,1+S*i+S/8,1+S*(j+1)-3*S/8,1+S*(i+1)-S/8,1+S*(j+1)-3*S/8);
            teka.drawLine(g,(i+1)*S+3-S/8,(j+1)*S+3-S/8,(i+1)*S-2,(j+1)*S-2);
            teka.drawLine(g,(i+1)*S+3-S/8,(j+1)*S-2,(i+1)*S-2,(j+1)*S+3-S/8);
        }
    }

    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textheight+'px sans-serif';
    g.fillText(teka.translate('kropki_digits',[this.X]),1,X*S+5);
    
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle='#ff0000';
        if (this.exp) {
            teka.drawLine(g,(this.x+1)*S+3-S/8,(this.y+1)*S+3-S/8,(this.x+1)*S-2,(this.y+1)*S-2);
            teka.drawLine(g,(this.x+1)*S+3-S/8,(this.y+1)*S-2,(this.x+1)*S-2,(this.y+1)*S+3-S/8);
        } else {
            g.strokeRect(S*this.x+4,S*this.y+4,S-6,S-6);
            g.strokeRect(S*this.x+5,S*this.y+5,S-8,S-8);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

teka.viewer.kropki.KropkiViewer.prototype.processMouseMovedEvent = function(xc,yc)
{
    xc = xc-this.deltaX-1;
    yc = yc-this.deltaY-1;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale);
    this.y = Math.floor(yc/this.scale);

    this.xm = xc-this.scale*this.x;
    this.ym = yc-this.scale*this.y;

    if (this.x<0) { this.x=0; }
    if (this.y<0) { this.y=0; }
    if (this.x>this.X-1) { this.x=this.X-1; }
    if (this.y>this.X-1) { this.y=this.X-1; }

    var oldexp = this.exp;
    this.exp = this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

teka.viewer.kropki.KropkiViewer.prototype.processMousePressedEvent = function(xc,yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);

    xc = xc-this.deltaX-1;
    yc = yc-this.deltaY-1;

    if (xc<0 || yc<0 || xc>=this.X*this.scale || yc>=this.X*this.scale) {
        return erg;
    }

    if (this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
        return true;
    }

    if (this.f[this.x][this.y]>=1000) {
        var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1)+1;
        if (nr<1 || nr>this.X) {
            return erg;
        }

        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
    }
    else {
        this.set(this.x,this.y,(this.f[this.x][this.y]+1) % (this.X+1));
    }

    return true;
};

teka.viewer.kropki.KropkiViewer.prototype.processKeyEvent = function(key,c)
{
    this.exp = false;
    
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

    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.X) { 
        return false; 
    }

    if (c>=49 && c<=48+this.X) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,c-48);
        } else {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<(c-48)))+1000);
        }
        return true;
    }

    if (c>=65 && c<=90) {
        this.set(this.x,this.y,c-65+10);
        return true;
    }

    if (c>=97 && c<=122) {
        this.set(this.x,this.y,c-97+10);
        return true;
    }

    if (c==32) {
        this.set(this.x,this.y,0);
        return true;
    }

    if (c==35 || c==44) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

teka.viewer.kropki.KropkiViewer.prototype.set = function(x,y,val)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = val;
    this.c[x][y] = this.color;
};

teka.viewer.kropki.KropkiViewer.prototype.setExpert = function(h)
{
    return 1000+(h===0?0:(1<<h));
};

teka.viewer.kropki.KropkiViewer.prototype.getExpert = function(h)
{
    if (h<1000) {
        return h;
    }

    var min = 10;
    var max = 0;
    h -= 1000;

    for (var i=1;i<=9;i++) {
        if ((h&(1<<i))!=0) {
            if (i<min) {
                min = i;
            }
            if (i>max) {
                max = i;
            }
        }
    }

    if (min==max) {
        return min;
    }

    return 0;
};
