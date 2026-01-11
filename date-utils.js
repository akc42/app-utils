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
const timeRegex = /^((?:0?[0-9]|1[0-9]|2[0-3]))(?::((?:0?[0-9]|[1-5][0-9])))?$/;
export function minToTime(m) {
  if (m === 0) return '00:00';
  if (isNaN(m) || m < 0 || m > 1439) return '';

  var hr = Math.floor(m/60);
  var mn = Math.floor(m % 60);
  return hr.toString().padStart(2,'0') + ':' + mn.toString().padStart(2,'0');
};

export function timeToMin(time) {
  if (typeof time !== 'string') return -1; //protective against crashes
  if (time.length === 0) return -1;
  const matches = timeRegex.exec(time);
  if (matches) {
    let mins = 0;
    if (typeof matches[2] !== 'undefined') mins = parseInt(matches[2],10);
    let hours = parseInt(matches[1], 10);
    if (Number.isInteger(hours) && Number.isInteger(mins)) return  (hours * 60) + mins;
  }
  return -1;
};

const urlRegex = /^((?:19|2[01])(?:(?:(?:0[48]|[2468][048]|[13579][26])(?=-02-29))|\d{2}(?!-02-(?:29|3[01]))))-((?:02(?!-3[01])|0[469](?!-31)|11(?!-31)|(?:0[13578]|1[02])))-([0][1-9]|[12][0-9]|3[01])$/;
const strRegex = /^((?:0?|[1-9])\d)\/((?:0?|[1-9])\d)\/((?:19|2[01])\d{2})$/;

export function urlDateToStr(urlDay) {
  let matches;
  //eslint-disable-next-line no-cond-assign
  if (matches = urlRegex.exec(urlDay.toString())) {
    return matches[3] + '/' + matches[2] + '/' + matches[1];
  }
  return '';
};

export function strToUrlDate(str) {
  let matches;
  if (matches = strRegex.exec(str.toString())) {
    const urlDate = matches[3] + '-' + matches[2].padStart(2,'0') + '-' + matches[1].padStart(2,'0');
    if (urlRegex.test(urlDate)) return urlDate; 
  }
  return '';
}

