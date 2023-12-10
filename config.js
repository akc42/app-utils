/**
@licence
    Copyright (c) 2023 Alan Chandler, all rights reserved

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

let config = fetch('/api/config').then(response => response.json());


export function setConfig(configPromise) {
  //set config of (configPromise Undefined, re-read from server)
  if (typeof configPromise === 'undefined') {
    config = fetch('/api/config').then(response => response.json());
  } else {
    config = configPromise;
  }
}
export async function reReadConfig() {
  setConfig();//cause the reread to start
  return await config;
}

export default await config;