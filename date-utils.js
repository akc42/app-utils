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

function ymdToDate(d, m, y) {
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  if (month < 1 || month > 12) {return false;}
  if (day < 1 || day > daysInMonth(month,year)) {return false;}
  return new Date(year, month - 1, day, 3, 0, 0);
};

function daysInFebruary(year) {
  /* February has 29 days in any year evenly divisible by four,
     EXCEPT for centurial years which are not also divisible by 400. */
  return (((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : 28);
};

export function daysInMonth(month, year) {
  let m = 31;
  if (month === 4 || month === 6 || month === 9 || month === 11) {m = 30;}
  if (month  === 2) {m = daysInFebruary(year);}
  return m;
};

export function minToTime(m) {
  if (m === 0) return '00:00';
  if (isNaN(m) || m < 0 || m > 1439) return '';

  var hr = Math.floor(m/60);
  var mn = Math.floor(m % 60);
  return hr.toString().padStart(2,'0') + ':' + mn.toString().padStart(2,'0');
};

export function timeToMin(time) {
  if (typeof time !== 'string') return 0; //protective against crashes
  if (time.length === 0) return 0;
  const matches = timeRegex.exec(time);
  if (matches) {
    let mins = 0;
    if (matches[2] !== undefined) mins = Number(matches[2]);
    let hours = Number(matches[1]);
    if (Number.isInteger(hours) && Number.isInteger(mins)) return  (hours * 60) + mins;
  }
  return 0;
};

const urlRegex = /^((?:19|2[01])(?:(?:(?:0[48]|[2468][048]|[13579][26])(?=-02-29))|\d{2}(?!-02-(?:29|3[01]))))-((?:02(?!-3[01])|0[469](?!-31)|11(?!-31)|(?:0[13578]|1[02])))-([0][1-9]|[12][0-9]|3[01])$/;



export function urlDateToStr(urlDay, locale = 'en-GB') {
  let matches;
  //eslint-disable-next-line no-cond-assign
  if (matches = urlRegex.exec(urlDay.toString())) {
    const aDate = ymdToDate(matches[1], matches[2], matches[3]);
    return aDate.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day:'2-digit'});
  }
  return '';
};

const strRegex = /^(\d+)[^\d]+(\d+)[^\d]+(\d+)$)/;

export function strToUrlDate(str, format = 'DMY') {
  const dpos = format.indexOf('D') + 1;
  const mpos = format.indexOf('M') + 1;
  const ypos = format.indexOf('Y') + 1;
  if (dpos > 0 && mpos > 0 && ypos > 0) {
    let matches;
    if (matches = strRegex.exec(str.toString())) {
      const day = Number(matches[dpos])
      const month = Number(matches[mpos]);
      const year = Number(matches[ypos]);
      if (year >= 1900 & year < 2300) { //just put some limit to prevent ridiculous numbers
        if (month > 0 && month < 13) {
          if (day > 0 && day <= daysInMonth(month, year)) {
            const urlDate = matches[ypos] + '-' + matches[mpos].padStart(2,'0') + '-' + matches[dpos].padStart(2,'0');
            if (urlRegex.test(urlDate)) return urlDate; 
          }
        }
      } 
    
    }
  }
  return '';
}

export function dateToUrlDate(adate) {
  return  `${adate.getFullYear()}-${(adate.getMonth() + 1).toString().padStart(2,'0')}-${adate.getDate().toString().padStart(2,'0')}`;
}
export function dateToUrlDatetime(adate) {
  const displaydate = `${adate.getFullYear()}-${(adate.getMonth() + 1).toString().padStart(2,'0')}-${adate.getDate().toString().padStart(2,'0')}`;
  const displaytime = `${adate.getHours().toString().padStart(2,'0')}:${adate.getMinutes().toString().padStart(2,'0')}:${adate.getSeconds().toString().padStart(2,'0')}`;
  return `${displaydate} ${displaytime}`;
}