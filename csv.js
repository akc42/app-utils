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

import {generateUri} from './switch-path.js';
const link = document.createElement('a');
link.setAttribute('download', null);

export const csv = (url, params) => {
  let href;
  if (typeof url == 'string') {
    href = generateUri(`/api/csv/${url}`, params ?? {});
  } else {
    //we assume it is a URL object
    href = url.href;
  }
  link.setAttribute('href', href);
  link.click();
};

