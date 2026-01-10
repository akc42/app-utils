/**
@licence
    Copyright (c) 2020 Alan Chandler, all rights reserved

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

export function generateUri(path, params) {
  var str = [];
  if (params) {
    for (const param in params) {
      //eslint-disable-next-line no-prototype-builtins
      if (params.hasOwnProperty(param)) {
        str.push(encodeURIComponent(param) + '=' + encodeURIComponent(params[param]));
      }
    }
    if (str.length > 0) {
      return path + '?' + str.join('&');
    }
  }
  return path;
}

export function switchPath(path, params) {
  history.pushState({}, null, generateUri(path, params));
  window.dispatchEvent(new CustomEvent('location-altered', { composed: true, bubbles: true }));
}

export function navigate (e) {
  const link = e.currentTarget.getAttribute('path');
  if (typeof link !== 'undefined') {
    switchPath(link);
  }
}
