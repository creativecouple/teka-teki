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
    BACKGROUND: '#eeeeee',
    FILE: false
};

teka.PuzzleApplet = function(options)
{
    this.setDefaults();

    if (options !== undefined) {
        this.setOptions(options);
    }
    
    this.canvas = this.addCanvas();
    this.image = this.canvas.getContext('2d');

    this.paintLogo();
    
    setTimeout(this.init.bind(this),1000);
};

teka.PuzzleApplet.prototype.setDefaults = function()
{
    this.values_ = {};
    for (var k in teka.Defaults) {
        this.values_[k] = teka.Defaults[k];
    }
};

teka.PuzzleApplet.prototype.setOptions = function(options)
{
    for (var k in options) {
        if (this.values_[k] !== undefined) {
            this.values_[k] = options[k];
        }
    }
};

teka.PuzzleApplet.prototype.addCanvas = function()
{
    var canvas = document.createElement('canvas');
    canvas.width = this.values_.WIDTH;
    canvas.height = this.values_.HEIGHT;
    canvas.style.width = canvas.width+'px';
    canvas.style.height = canvas.height+'px';
    canvas.style.border = this.values_.BORDER;
    document.getElementById(this.values_.TARGET).appendChild(canvas);
    return canvas;
};

teka.PuzzleApplet.prototype.paintLogo = function()
{
    this.image.fillStyle = this.values_.BACKGROUND;
    this.image.fillRect(0,0,this.canvas.width,this.canvas.height);
};

teka.PuzzleApplet.prototype.init = function()
{
    if (this.values_.FILE===false) return;
    
    this.loadFile(this.values_.FILE, this.init2.bind(this));
};

teka.PuzzleApplet.prototype.init2 = function()
{
    this.pv = new teka[this.type.substring(0,1).toUpperCase()+this.type.substring(1)+'Viewer'](this.psdata);
    this.pv.setMetrics(this.canvas.width-40,this.canvas.height-40);
    this.paint();
};

teka.PuzzleApplet.prototype.paint = function()
{
    this.image.fillStyle = this.values_.BACKGROUND;
    this.image.fillRect(0,0,this.canvas.width,this.canvas.height);
    this.image.save();
    this.image.translate(20,20);
    this.pv.paintImage(this.image);
    this.image.restore();
};

teka.PuzzleApplet.prototype.loadFile = function(filename, callback, setter)
{
    var me = this;
    
    var res = new XMLHttpRequest();
    res.open('GET',filename);
    res.responseType = 'text';
    res.onreadystatechange = function() {
        if (this.readyState!=4) return;
        
        var psdata = new teka.PSData(this.responseText);
        if (psdata.failed()) return null;
        
        var type = psdata.get('type');
        if (type.length<2) return null;
        type = type.substring(1,type.length-1).toLowerCase();

        me.psdata = psdata;
        me.type = type;
        
        var script = document.createElement('script');
        script.onload = callback;
        script.type = 'text/javascript';
        script.charset = 'UTF-8';
        script.src = type+'viewer.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    };
    res.send();
};
