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
  The purpose of this module is to provide a debugable capability which can be dynamically switched on and off browser
  by setting sessionStorage value 'debug' to the config returned by the server. It will post request to '/api/debuglog'
  url with application/json body part containing message, topic and gap, where message is the concatenation of the debug
  parameters separated by space, topic is the topic of this debug message and gap is the number of milliseconds since
  the last debug message with the same topic.

  Topic data is held in a map, so this module can be used in multiple modules in
  the client and if its the same topic then the gap will be since the last call
  from ANY module.

  To use the debug function in your code, import this module then set the topic
  as shown.

  import Debug from 'debug.js';

  const debug = Debug('topic') topic should only contain the characters a-z or
  A-Z as is converted to lowercase.

  debug(..messages) //messages will be concatenated by space

  the debug function will only log the message on the server if sessionStorage "debug"  is set to a string which is a colon separated list of topics
  and that list has the topic for this debug call in it.

  NOTE: It is normally expected for the server to provide a mechanism to update
  the confgi before it is returned,  The main app then overwrites sessionStorage 'debug' item with a new list of topics when you want
  debug to switch on and off dynamically.

  regardless of whether the message is logged on the server, it is also added to the performance.mark buffer
  so that it can be sent to the server on a crash.

  Although Debug is the default export this module also provides the following named exports
  
  initialiseDebug - this function is used to manage tracing of debug messages regardless of whether the topic is set
    It also adds an event handler to handle resource buffer full events.  NOTE if the buffer fills up priority is given
  
  unloadDebug - this function tidies up and reverses the initialiseDebug

  debugDump - perform a dump to the server (and and a clearing out of the buffered info) of the debug calls made to date

*/

const BUFFER_SIZE = 50;
const KEY_TOPIC = 'key'; //topic name which will get kept from a full resource buffer when we empty it.
let buffer = []; //buffer of up to 50 topic/message pairs to allow us to hold some if resource buffer becomes full;

const topicMap = new Map();

let initialised = false;


function bufferFull() {
  const entries = performance.getEntriesByType('mark');
  performance.clearMarks();
  const startPoint = entries.length - BUFFER_SIZE;
  buffer.splice(0, buffer.length + startPoint);
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].name === KEY_TOPIC || i >= startPoint) {
      buffer.push({ topic: entries[i].name, message: entries[i].detail, time: Math.round(entries[i].startTime) });
    }
  }
}

function initialiseDebug() {
  initialised = true;
  buffer = [];
  performance.setResourceTimingBufferSize(150)
  window.addEventListener('resourcetimingbufferfull', bufferFull)
}

function unloadDebug() {
  window.removeEventListener('resourcetimingbufferfull', bufferFull);
}
function debugDump() {
  bufferFull();  //this clears out the marks and gives us a buffer to now send to
  buffer.reverse();
  let message = '';
  for (let i = 0; i < buffer.length; i++) {
    message += `(${buffer[i].topic}) ${buffer[i].message} :gap ${i < buffer.length - 1 ? buffer[i].time - buffer[i + 1].time : 0}ms\n`;
  }
  const blob = new Blob([JSON.stringify({
    message: message
  })], { type: 'application/json' });
  navigator.sendBeacon(`/api/debuglog/clientpath`, blob);

  buffer = []; //we will start our buffer from scratch again

}


function Debug(t) {
  if (typeof t !== 'string' || t.length === 0 || !/^[a-zA-Z]+$/.test(t)) {
    console.error('Debug requires topic which is a non zero length string of only letters', t, 'Received');
    throw new Error('Invalid Debug Topic');
  }
  const tl = t.toLowerCase();
  if (topicMap.has(tl)) {
    const topic = topicMap.get(tl);
    return topic.debug;
  }

  const topicHandler = {
    topic: tl,
    timestamp: new Date().getTime(),
    defined: false, //has the config been defined yet
    debug: function (...args) {
      //do time calc before potential delay to see if we are enabled
      const now = new Date().getTime();
      const gap = now - this.timestamp;
      this.timestamp = now;
      const message = args.reduce((cum, arg) => {
        return `${cum} ${arg}`.trim();
      }, '');
      if (initialised) performance.mark(this.topic, { detail: message });  //save our message locally regardless of if enabled
      let enabled = false;
      const debugConf = sessionStorage.getItem('debug');
      if (debugConf) {
        const topics = debugConf.split(':');
        if (topics.includes(this.topic)) enabled = true;
      }
      if (enabled) {
        const blob = new Blob([JSON.stringify({
          message: message,
          gap: gap
        })], { type: 'application/json' });

        navigator.sendBeacon(`/api/debuglog/${this.topic}`, blob);
      }
    }
  }
  topicHandler.debug = topicHandler.debug.bind(topicHandler);
  topicMap.set(topicHandler.topic, topicHandler);
  return topicHandler.debug
}

export { Debug as default, initialiseDebug, unloadDebug, debugDump };
