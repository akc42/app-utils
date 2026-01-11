/**
@licence
    Copyright (c) 2021 Alan Chandler, all rights reserved

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
/**
 * Much of this code is copied (as a model of what to do) from the classMap directive in Googles lit package.  
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {noChange} from 'lit'
import {directive,Directive,PartType} from 'lit/directives.js';

class PartMapDirective extends Directive {
  
  constructor(partInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== 'part' || partInfo.strings?.length > 2) {
      throw new Error(
        '`partMap()` can only be used in the `part` attribute ' +
          'and must be the only part in the attribute.'
      );
    }
  }

  render(partInfo) {
    // Add spaces to ensure separation from static parts
    return (
      ' ' +
      Object.keys(partInfo)
        .filter((key) => partInfo[key])
        .join(' ') +
      ' '
    );
  }

  update(part, [partInfo]) {
    // Remember dynamic parts on the first render
    if (this._previousParts === undefined) {
      this._previousParts = new Set();
      if (part.strings !== undefined) {
        this._staticParts = new Set(
          part.strings
            .join(' ')
            .split(/\s/)
            .filter((s) => s !== '')
        );
      }
      for (const name in partInfo) {
        if (partInfo[name] && !this._staticParts?.has(name)) {
          this._previousParts.add(name);
        }
      }
      return this.render(partInfo);
    }
    let changed = false;
    // Remove old classes that no longer apply
    for (const name of this._previousParts) {
      if (!(name in partInfo)) {
        this._previousParts.delete(name);
        changed = true;
      }
    }

    // Add or remove classes based on their classMap value
    for (const name in partInfo) {
      // We explicitly want a loose truthy check of `value` because it seems
      // more convenient that '' and 0 are skipped.
      const value = !!partInfo[name];
      if (
        value !== this._previousParts.has(name) &&
        !this._staticParts?.has(name)
      ) {
        changed = true;
        if (value) {
          this._previousParts.add(name);
        } else {
          this._previousParts.delete(name);
        }
      }
    }
    if (changed) return this.render(partInfo);
    return noChange;
  }
}

/**
 * A directive that applies dynamic parts
 *
 * This must be used in the `part` attribute and must be the only part used in
 * the attribute. It takes each property in the `partInfo` argument and adds
 * the property name to the element's `part` if the property value is
 * truthy; if the property value is falsy, the property name is removed from
 * the element's `part`.
 *
 * For example `{foo: bar}` applies the part name `foo` if the value of `bar` is
 * truthy.
 *
 * @param partInfo
 */
export const partMap = directive(PartMapDirective);
