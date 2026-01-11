/**
@licence
    Copyright (c) 2026 Alan Chandler, all rights reserved

    This file is part of @akc42/app-utils.

    @akc42/app-utils is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    @akc42/app-utils is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with @akc42/app-utils.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
  Given a background colour, this function calculates what the color string from
  the text should be. Backgroundcolour should be a hex string, optionally
  proceeded by #
*/

function calcTextColor(backgroundColor) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(backgroundColor);
  if (result) {
    const luminance = (0.2126 * parseInt(result[1], 16) + 0.7152 * parseInt(result[2], 16) + 0.0722 * parseInt(result[3], 16));
    return (luminance < 140) ? "#ffffff" : "#000000";
  }
  return "#000000"
}
export default calcTextColor;