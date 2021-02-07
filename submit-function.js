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

//handle the on submit event from a form and make it an api call 

import api from './post-api.js';

export default function submit(e) {
  e.stopPropagation();
  e.preventDefault();
  const target = e.currentTarget;
  const params = {};
  let isAllValid = true;
  target.querySelectorAll('input, select').forEach(field => {
    if (field.type === 'radio' || field.type === 'checkbox') return;
    if (!(isAllValid && field.checkValidity())) {
      isAllValid = false;
      return;
    }
    if (field.name !== undefined && field.value !== undefined) params[field.name] = field.value;
  });
  if (isAllValid) {
    //we ignored checkboxes and radio boxes above just so we could limit to checked ones here
    target.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked').forEach(field => {
      if (!(isAllValid && field.checkValidity())) {
        isAllValid = false;
        return;
      }
      if (field.name !== undefined && field.value !== undefined) params[field.name] = field.value;
    });
    if (isAllValid && !(target.validator !== undefined && typeof target.validator === 'function' && !target.validator(target))) {
      //if there is a waiting-indicator element it will pick this up, otherwise its a no-op
      target.dispatchEvent(new CustomEvent('wait-request', { composed: true, bubbles: true, detail: true}));
      api(new URL(target.action).pathname, params).then(response => {
        target.dispatchEvent(new CustomEvent('wait-request', { composed: true, bubbles: true, detail: false }));
        target.dispatchEvent(new CustomEvent('form-response', { composed: true, bubbles: true, detail: response }))
      });
      return;
    }
  }
  target.dispatchEvent(new CustomEvent('form-response', { composed: true, bubbles: true, detail: null }))
}
