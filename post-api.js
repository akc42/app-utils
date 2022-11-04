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


export default async function api(url, params, blob, signal) {
  const address = '/api/' + url;
  const options = {
    credentials: 'same-origin',
    method: 'post',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify(params ?? {})
  };
  performance.mark('fetchapi', { detail: `${address} params: ${options.body}` })
  if (signal) options.signal = signal;
  let text;
  try {
    const response = await window.fetch(address, options);
    if (!response.ok) throw new CustomEvent('api-error', {composed: true, bubbles: true , detail:response.status});
    performance.mark('fetchdone', {detail: address});
    performance.measure('apicalltime',{start: 'fetchapi', end:'fetchdone', detail: address});
    if (blob) {
      text = '---502---';  //Simulate a 502 (bad gateway) incase there is an error in following.
      const b = await response.blob();
      window.open(
        URL.createObjectURL(b),
        '_blank',
        'chrome=yes,centerscreen,resizable,scrollbars,status,height=800,width=800');
      return {};
    } else {
      text = await response.text();
      if (text.length > 0) return JSON.parse(text);
      return {};
    }
  } catch (err) {
    if (!options.signal || !options.signal.aborted) {
      if (err.type === 'api-error') throw err; //just throw whatever error we had
      //we failed to parse the json - the actual code should be in the text near the end;
      throw new CustomEvent('api-error', { composed: true, bubbles: true, detail: parseInt((text?? '---502---').slice(-6, -3), 10) });
    }
  }
}
