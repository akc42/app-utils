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

let configPromise;

export function mockConfig(promise) {
  configPromise = promise;
}

export default async function config() {
  if (configPromise === undefined) {
    let resolved = false;
    let resolver;
    configPromise = new Promise(accept => resolver = accept);
    let text;
    let config;
    while (!resolved) {
      try {
        const response = await window.fetch('/api/config', { method: 'get' })
        if (!response.ok) throw new CustomEvent('api-error', { composed: true, bubbles: true, detail: response.status });
        text = await response.text();
        config = JSON.parse(text); 
        /* 
          some uses of this put the config in sessionStorage, but that only works if every config value is a string
          so we check if they are a string, otherwise we stringify them
        */
        for (const p in config) {
          const v = config[p];
          if (typeof v === 'string') {
            sessionStorage.setItem(p, v);
          } else {
            sessionStorage.setItem(p,JSON.stringify(v));
          }
        }
        resolver(config);
        resolved = true;
      } catch (err) {
        if (err.detail === 502) {
          //server down so wait a minute and try again;
          await new Promise(accept => {
            setTimeout(accept, 60000);
          });
        } else {
          if (err.type === 'api-error') throw err; //just throw whatever error we had
          //we failed to parse the json - the actual code should be in the text near the end;
          throw new CustomEvent('api-error', { composed: true, bubbles: true, detail: parseInt(text.substr(-6, 3), 10) });
        }
      }
    }
  }
  return configPromise;
}