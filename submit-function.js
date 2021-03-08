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

function checkNode(node, params) {
  if (node.localName === 'input' || node.localName === 'select') {
    if (node.type === 'radio' || node.type === 'checkbox') {
      if (node.name !== undefined && node.value !== undefined && node.checked) params[node.name] = node.value;
      return true;
    }
    if (node.name !== undefined && node.value !== undefined) params[node.name] = node.value;
    return node.checkValidity() && node.dispatchEvent(new CustomEvent('validity-check', { bubbles: true, cancelable: true, composed: true, detail: node.value }));
  }
  if (node.localName === 'slot') {
    const assignedNodes = node.assignedNodes();
    if (assignedNodes.length > 0) {
      //we have assigned nodes, so ignore the slots children
      return assignedNodes.filter(n => n.nodeType === Node.ELEMENT_NODE).every(n => checkNode(n, params));
    }
  }
  //even if node validator fails we want to carry on because the checkValidity calls will trigger the error messages.
  if (customElements.get(node.localName)) {
    /*
      ignore the children of custom element, they will get picked up as a slot, or we don't care because it is pretending
      itself to be an input element and so (if it needs it) it will have a checkValidity Function - and if it does that will
      dispatch the 'validity check' event
    */
    if (node.name !== undefined && node.value !== undefined) {
      params[node.name] = node.value;
      if (typeof node.checkValidity === 'function') {
        return node.checkValidity();
      }
      return node.dispatchEvent(new CustomEvent('validity-check', { bubbles: true, cancelable: true, composed: true, detail: node.value }));
    }
    return checkLevel(node.shadowRoot, params);
  }

  if (node.children.length > 0) return checkLevel(node, params);
  return true
}

function checkLevel(target, params) {
  return Array.prototype.filter.call(target.children, n => n.nodeType === Node.ELEMENT_NODE).every(node => checkNode(node, params));
}

export default function submit(e) {
  let target;
  if (e.currentTarget) {
    e.stopPropagation();
    e.preventDefault();
    target = e.currentTarget;
  } else {
    target = e;
  }
  const params = {};
  if (checkLevel(target, params)) {
    target.dispatchEvent(new CustomEvent('wait-request', { composed: true, bubbles: true, detail: true }));
    api(target.getAttribute('action'), params).then(response => {
      target.dispatchEvent(new CustomEvent('wait-request', { composed: true, bubbles: true, detail: false }));
      target.dispatchEvent(new CustomEvent('form-response', { composed: true, bubbles: true, detail: response }));
    });
    return true;
  } else {
    target.dispatchEvent(new CustomEvent('form-response', { composed: true, bubbles: true, detail: null }));
    return false;
  }
}