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

/*
  import {Debug} from '@akc42/app-utils'

  Debug creates an instance of a debug function 

  parameters:
    topic       - a value that can be searched for. Useful for dividing into different sections
    colourspec  - One of name of standard colors [app,db,api,client,log,mail,auth,error], a hex color string, an rgb, 
                  comma seperated, string of three values 0-255 
    shortdate   - if true, then dates will be output as YYYY-MM-DD hh:mm else YYYY-MM-DD hh:mm:ss.ms

    immediate   - if set, the message is output (formatted) to the console.
  
  Returns a function that will send a row to the server (for writing into the log there), using the parameters above and
  some optional extra values these extra parameters are

    crash       - the literal word "crash".  if set, then this will be highlighted in the output. Don't provide this as
                  the first parameter if a normal call
    logtime     - a unix millisecond timestamp.  If provided if must be for today, otherwise it will be as
                  though it were not provided. If provided it will be the logtime, otherwise "Now" will be used.
    ipaddress   - an optional parameter container a string representation of an ip address. Ignored if not
                  a valid adddress. If provided its value will be highlighted and surrounded in "[]"
    ...messages - As many parameters containing parts of the message.  The message will be joined together
                  with a space separation and displayed with the colourspec parameter.
*/

/*
  Logger is like Debug (indeed its a wrapper for it) except

  It doesn't need short date, or immediate parameters as thats whats assumed

*/
import {DebugHelper, messageFormatter} from '@akc42/server-utils';

export function Logger(topic, colourspec) {
  const debug = Debug(topic, colourspec, 1,1);
  return function(c, ip, ...args) {
    const output = debug(c,ip,args);
    console.log(output.message);
  }
}

export function Debug(topic, colourspec, shortdate, immediate = false) {
  return DebugHelper(topic, colourspec, shortdate, immediate , writer)

}

function writer (logtime, crash, shortdate,ip, topic, message, colourspec,gap, i) {
  const blob = new Blob([JSON.stringify({logtime,crash, shortdate, topic,message,colourspec,gap})], { type: 'application/json' });
  navigator.sendBeacon(`/api/debuglog/${i ? 1: 0}`, blob);
  return messageFormatter('no id', logtime,crash,shortdate,ip,topic,message,colourspec,gap)
}