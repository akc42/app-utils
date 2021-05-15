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

let master = false;
let masterResolver;
let masterPromise = new Promise(resolve => masterResolver = resolve);


let otherTabs = new Set();
let timer = 0.
const tabId = Date.now().toString();
const storageHandler = (e) => {
  if (e.key === 'pageOpen') {
    otherTabs.add(localStorage.getItem('pageOpen'))
    localStorage.setItem('pageAvailable', tabId); //respond - so the ender knows he is not master.
  }
  if (e.key === 'pageAvailable') {
    if (timer > 0) {
      clearTimeout(timer);
      master = false;
      masterResolver(false);
    }
  }
  if (e.key === 'pageClose') {
    const closer = JSON.parse(localStorage.getItem('pageClose'));
    if (master) {
      otherTabs.delete(closer.id);
    } else {
      if (closer.master) {
        otherTabs = new Set(closer.list); //Make a set from the list the closing master had
        otherTabs.delete(tabId); //remove self  
        masterPromise = new Promise(resolve => masterResolver = resolve);

        if (closer.size === 1) {
          //must be just me left, so I become master
          master = true;
          masterResolver(true);
        } else {
          //We need to wait a random time before trying to become master, but
          timer = setTimeout(() => {
            timer = setTimeout(() => {
              master = true;
              masterResolver(true);
            }, 70); //wait 70 ms to see if our claim was refuted
            localStorage.setItem('pageClaim', tabId); //try and claim storage
          }, 70 * Math.floor((Math.random() * 40))); //wait random time between 70ms and about 3 seconds before trying to claim master
        }
        window.dispatchEvent(new CustomEvent('master-close', { composed: true, bubbles: true }));
      }
    }
  }
  if (e.key === 'pageClaim') {
    if (timer > 0) {
      clearTimeout(timer); //someone else has claimed master ship, kill of our attempt;
      master = false;
      masterResolver(false);
    }
  }
}

window.addEventListener('storage', storageHandler);
const unloadHandler = () => {
  localStorage.setItem('pageClose', JSON.stringify({
    master: master,
    id: tabId,
    size: otherTabs.size,
    list: Array.from(otherTabs)
  }));
  window.removeEventListener('storage', storageHandler);
  window.removeEventListener('beforeunload', unloadHandler);
};
window.addEventListener('unload', unloadHandler);
timer = setTimeout(() => {
  timer = 0;  //prevent our assertion being overridden by a later try
  master = true;
  masterResolver(true);
}, 70);
localStorage.setItem('pageOpen', tabId);
function getPromise() {
  return masterPromise;
};
export default getPromise;