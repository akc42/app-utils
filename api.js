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

class ApiError extends Error {
  constructor(address, code) {
    super('API Error: ' + address)
    this.name = 'API' + code.toString();
  }
}

async function api(url, params, bl) {
  const blob = bl;
  const controller = new AbortController();
  const address = '/api/' + url;
  const options = {
    mode: 'cors',
    credentials: 'include',
    method: 'post',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: new Blob([JSON.stringify(params ?? {})], { type: 'application/json' }),
    signal: controller.signal
  };
  let text;
  const timer = setTimeout(() => controller.abort('timeout'),60000); //just a protection against complete loss of response.
  try {
    const response = await window.fetch(address, options)
    if (response.ok) {
      clearTimeout(timer);
      if (blob) {
        text = '---502---';  //Simulate a 502 (bad gateway) incase there is an error in following.
        const b = await response.blob();
        window.open(
          URL.createObjectURL(b),
          '_blank',
          'chrome=yes,centerscreen,resizable,scrollbars,status,height=800,width=800');

        document.body.dispatchEvent(new CustomEvent('wait-request',{bubbles: true, composed: true, detail: false}));
        return {};
      } else {
        text = await response.text();
        if (text.length > 0) {
          const j = JSON.parse(text);
          document.body.dispatchEvent(new CustomEvent('wait-request',{bubbles: true, composed: true, detail: false}));
          return j;
        }
        document.body.dispatchEvent(new CustomEvent('wait-request',{bubbles: true, composed: true, detail: false}));
        return {};
      }

    } else if (response.status < 500) throw new ApiError(address, response.status);
  } catch (err) {
    clearTimeout(timer);
    if (!(err instanceof TypeError)) {
      //not network failure so no retry
      if (err instanceof SyntaxError) {
        const code = Number((text?? '---502---').slice(-6, -3));
        if (code > 299) throw new ApiError(address,code);    
      } else if (err.name === 'AbortError') throw new ApiError(address, 504);  //simulate gateway timeout
      throw err; //just throw what we have
    }
  }
  clearTimeout(timer);
  return {};
} 

export { api , ApiError };

