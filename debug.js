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
  The purpose of this module is to provide a debugable capability which can be
  dynamically switched on and off browser by setting a key in the config
  returned by the server. It will post request to '/api/log' url with
  application/json body part containing message, topic and gap, where message is
  the concatenation of the debug parameters separated by space, topic is the
  topic of this debug message and gap is the number of milliseconds since the
  last debug message with the same topic.

  Topic data is held in a map, so this module can be used in multiple modules in
  the client and if its the same topic then the gap will be since the last call
  from ANY module.

  To use the debug function in your code, import this module then set the topic
  as shown.

  import Debug from 'debug.js';

  const debug = Debug('topic') topic should only contain the characters a-z or
  A-Z as is converted to lowercase.

  debug(..messages) //messages will be concatenated by space

  the debug function will only log the message if config.debug (see
  config-promise) is set to a string which is a comma separated list of topics
  and that list has the topic for this debug call in it.

  NOTE: It is normally expected for the server to provide a mechanism to update
  the config before it is returned and for the client to be restarted to enable
  the appropriate debug topics, an alternative could be for client side function
  to use the `mockConfig` call to replace the promise with one which contained a
  different list of topics. debug checks the list of topics on every call so
  would dynamically pick up the changes

*/

const topicMap = new Map();

import configGetter from './config-promise.js';
function Debug (t) {
  if (typeof t !== 'string' || t.length === 0 || !/^[a-zA-Z]+$/.test(t)) {
    console.error('Debug requires topic which is a non zero length string of only letters', t, 'Received');
    throw new Error('Invalid Debug Topic');
  }
  const tl = t.toLowerCase(); 
  let timestamp = new Date().getTime();
  if (topicMap.has(tl) ) {
    const topic = topicMap.get(tl);
    return topic.debug;
  }

  const topicHandler = {
    topic: tl,
    timestamp: new Date().getTime(),
    debug: function (...args) {
      configGetter().then(config => {
        if (config.debug) {
          let found = false;
          const split = config.debug.split(',')
          for (const subtopic of split) {
            if (subtopic.slice(-1) === '*') {
              const subtopicpart = subtopic.slice(0, -1);
              if (this.topic.slice(0, subtopicpart.length).toLowerCase() === subtopicpart.toLowerCase()) {
                found = true;
                break;
              }
            } else if (this.topic.toLowerCase() === subtopic.toLowerCase()) {
              found = true;
              break;
            }
          }
          if (found) {
            const message = args.reduce((cum, arg) => {
              return `${cum} ${arg}`.trim();
            }, '');
            const now = new Date().getTime();
            const gap = now - this.timestamp;
            this.timestamp = now;
            console.log(`+${gap}ms`, this.topic, message);
            const blob = new Blob([JSON.stringify({
              topic: this.topic,
              message: message,
              gap: gap
            })], { type: 'application/json' })

            navigator.sendBeacon('/api/log', blob);
          }
        }

      });

    }
  }
  topicHandler.debug = topicHandler.debug.bind(topicHandler);
  topicMap.set(topicHandler.topic, topicHandler);
  return topicHandler.debug
}

export default Debug;