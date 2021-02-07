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

export default configPromise = new Promise(resolve => {
  window.fetch('/api/config', { method: 'get' }).then(response => {
    if (!response.ok) throw new CustomEvent('api-error', {bubbles: true, composed: true, detail:response.status});
    return response.json()
  }).then(conf => { //most like just update values.
    for(const p in conf ) {
      sessionStorage.setItem(p, conf[p]);
    }
    resolve();
  });
});
