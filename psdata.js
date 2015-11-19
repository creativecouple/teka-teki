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
 * Constructor.
 *
 * The string psdata should contain a puzzle in sgf format. The
 * format is parsed and stored as key->value pairs.
 */
teka.PSData = function(psdata)
{
    this.failed_ = true;
    this.values_ = {};

    var p1 = psdata.indexOf("<<");
    var p2 = psdata.indexOf(">>");

    if (p1==-1 || p2==-1 || p2<p1) { return; }

    var d = psdata.substring(p1+2,p2).trim().split("/");

    var d_length = d.length;
    for (var i=0;i<d_length;i++) {
        var p = d[i].indexOf(" ");
        if (p==-1) { continue; }
        this.values_[d[i].substring(0,p).trim()] = d[i].substring(p+1).trim();
    }

    this.failed_ = false;
};

/**
 * Returns true, if the parsing done in the constructor did not succeed.
 */
teka.PSData.prototype.failed = function()
{
    return this.failed_===false?false:true;
};

/**
 * Returns the value, that belongs to a given key or false if the
 * key does not exist.
 */
teka.PSData.prototype.get = function(key)
{
    if (this.values_[key]===undefined) { return false; }
    return this.values_[key];
};
