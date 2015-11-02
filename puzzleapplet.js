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

teka.PuzzleApplet = function()
{
    this.canvas = document.createElement('canvas');
    this.canvas.width = '500';
    this.canvas.height = '350';
    this.canvas.style.width = this.canvas.width+'px';
    this.canvas.style.height = this.canvas.height+'px';
    this.canvas.style.border = '1px solid black';
    document.getElementById('applet').appendChild(this.canvas);
    
    this.image = this.canvas.getContext('2d');
    this.image.fillStyle = '#f00';
    this.image.fillRect(0,0,500,350);
}
