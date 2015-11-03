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
 
normalizeMouseEvent = function(e)
{
    e.x = 0;
    e.y = 0;
    
    if (e.pageX != undefined && e.pageY != undefined) {
        e.x = e.pageX;
        e.y = e.pageY;
    } else {
        e.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        e.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return e;
};
