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

teka.ColorTool = function()
{
    teka.Tool.call(this);
    
    this.colorname = ['schwarz','blau','rot','grün'];
    this.colors = ['#000','#00f','#f00','#0f0'];
    
    this.color = 0;
    this.buttonHeight = 20;
    this.buttonWidth = 100;
};
teka.extend(teka.ColorTool,teka.Tool);

teka.ColorTool.prototype.getMinDim = function(g)
{
    g.font = this.getButtonFont();
    var w = g.measureText("färben").width;
    w = Math.max(w,g.measureText("löschen").width)+6;
    w = 14+Math.max(g.measureText("Stiftfarbe: schwarz").width,3*w);
    var h = 5*(this.textHeight+5)+26;
    return { width:w, height:h };
};

teka.ColorTool.prototype.paint = function(g)
{
    g.fillStyle = '#000';
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.font = this.getButtonFont();
    g.fillText('Stiftfarbe: '+this.colorname[this.color],this.width/2,2);
    
    this.buttonHeight = (this.height-26)/5;
    this.buttonWidth = (this.width-14)/3;
    
    for (var i=1;i<5;i++) {
        this.paintButton(g,1,1+i*(this.buttonHeight+6),
                         this.buttonWidth,this.buttonHeight,
                         false,false);
        if (i-1!=this.color) {
            this.paintButton(g,7+this.buttonWidth,1+i*(this.buttonHeight+6),
                             this.buttonWidth,this.buttonHeight,
                             false,'färben');
        }
        this.paintButton(g,13+2*this.buttonWidth,1+i*(this.buttonHeight+6),
                         this.buttonWidth,this.buttonHeight,
                         false,'löschen');
        
        g.fillStyle = this.colors[i-1];
        g.fillRect(5,5+i*(this.buttonHeight+6),
                   this.buttonWidth-8,this.buttonHeight-8);
    }
};
