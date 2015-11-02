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

teka = {};

teka.Defaults = {
    WIDTH: 500,
    HEIGHT: 350,
    BORDER: '1px solid black',
    TARGET: 'applet',
    BACKGROUND: '#eeeeee'
};

teka.PuzzleApplet = function(options)
{
    this.values_ = {};
    for (var k in teka.Defaults) {
        this.values_[k] = teka.Defaults[k];
    }

    if (options !== undefined) {
        for (var k in options) {
            if (this.values_[k] !== undefined) {
                this.values_[k] = options[k];
            }
        }
    }

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.values_.WIDTH;
    this.canvas.height = this.values_.HEIGHT;
    this.canvas.style.width = this.canvas.width+'px';
    this.canvas.style.height = this.canvas.height+'px';
    this.canvas.style.border = this.values_.BORDER;
    document.getElementById(this.values_.TARGET).appendChild(this.canvas);
    
    this.image = this.canvas.getContext('2d');
    
    this.image.fillStyle = this.values_.BACKGROUND;
    this.image.fillRect(0,0,this.canvas.width,this.canvas.height);
};
