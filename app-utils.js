import {api, ApiError} from './api.js';
import AppKeys from './app-keys.js';
import calcTextColor from './colour.js';
import config, {setConfig, reReadConfig}from './config.js'
import csv from './csv.js';
import {Debug,Logger} from './debug.js';
import domHost from './dom-host.js';
import { connectUrl, disconnectUrl} from './location.js';
import getMasterTabPromise from './master-tab-promise.js';
import {partMap} from './partMap.js';
import pdf from './pdf.js';
import Route from './route.js';
import submit from './submit-function.js';
import {switchPath, generateUri, navigate} from './switch-path.js';
import { minToTime,timeToMin,strToUrlDate,urlDateToStr } from './date-utils.js';

function capitalise(name) {
  if (name.length > 0 ) {
    let words = name.split(' ');
    for(let i = 0; i < words.length; i++) {
      if (i > 0 && ( words[i].toLowerCase() === 'de' || words[i].toLowerCase() === 'la')) {
        words[i] = words[i].toLowerCase();
      } else if (words[i].length > 2 && words[i].toUpperCase().substring(0,2) === `O'` ) {
        const newword = capitalise(words[i].substring(2))
        words[i] = words[i].substring(0,2).toUpperCase() + newword;
      } else {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1).toLowerCase();
      }
    }
    return words.join(' ');
  }
  return '';
};

export {api,ApiError,AppKeys,calcTextColor,capitalise, config, connectUrl, csv, Debug, disconnectUrl, domHost, generateUri,
  getMasterTabPromise, Logger, minToTime, navigate, partMap, pdf, reReadConfig, Route,setConfig, strToUrlDate, submit, 
  switchPath, timeToMin, urlDateToStr };