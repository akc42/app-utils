# app-utils
General utilities that I use for building SPAs 

New from release 3.0

config-promise is a function which returns both a promise for the config AND adds the config items to sessionStorage.

debug has been replaced with a version that works differently and is incompatible with our previous usage (hence the bump to version 3)

# app-keys

    `keys` is a module that provides keyboard support by normalising key
    handling amongst browsers and providing a simple interface that can be used
    by the application.  Each keyboard usage request the user create a new
    instance of the AppKeys class passing the key target in to the constructor.
    This module will add and event handler for itself to that key target for the
    keydown event.  On that event it will parse the key combinations pressed and
    fire a "key-pressed" event on the target.

    The key grammer is of the form `[<modifier>+]<key>[:<event>]` and each of these is
    space separated.  optional `<modifiers>` (default none) are shift ctrl alt meta, and the optional 
    `<events>` are keydown and keyup (keydown is used as default) 

    To allow a using module the freedom to connect and disconnect to the dom, we
    provide two methods to be called during the disconnectCallback and
    connectCallback to disconnect and reconnect to this event

    There are two models of using this, the first, shown below allows an element to add
    the keys event to document body.  This is good for pages that are swapped in and
    out by a paging mechanism so that only one page is in the dom at a given time This is
    good if only one handler is needed for the entire page.

    NOTE: If you take this approach limit the keys to non function keys as the main app, with its main 
    menu may add a handler for the function keys and both menus, and any actions you choose would run at the same time.

```
    constructor() {
      super();
      ...
      this._keyPressed = this._keyPressed.bind(this);
    }
    connectedCallback() {
      super.connectedCallback();
      document.body.addEventListener('key-pressed', this._keyPressed);
      if (this.keys === undefined) {
        this.keys = new AppKeys(document.body, 'Enter Esc'); //list the keys you want to identify (see comment above for grammer)
      } else {
        this.keys.connect();
      }
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.keys.disconnect();
      document.body.removeEventListener('key-pressed', this._keyPressed);
    }
    _keyPressed(e) {
      e.detail is an string containing the [<modifier>+]<key> combination from one you requested
    }
```

    The second way of using this, better for when you don't want to react unless a particular area of the page has focus, or
    if there are different areas of the page needing the respond depending which area
    has focus.  This is to create the AppKeys object in the firstUpdated function.  Here is a possible example (just one area)

```
  connectedCallback() {
    super.connectedCallback();
    if (this.keys !== undefined) this.keys.connect();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.keys.disconnect();
  }
  firstUpdated() {
    this.target = this.shadowRoot.querySelector('#keyreceive');
    this.keys = new AppKeys(this.target, 'Enter');  //replace 'Enter' with space separated string of keys
  }
```  
  Then on the dom element in the Render function

  `<div id="keyreceive" @keys-pressed=${this._keyPressed}>Contents</div>`

  NOTE: There is no need to bind this._keyPressed to this (as shown in the first example).  Lit manages it.

  If for any reason you want more info about the keyPress, access
  `this.keys.lastPressed`, and it will return the complete binding object


# config-promise

  This module provides two functions:-

  1. This first is the default function which when called returns a promise. 
  2. a `mockConfig` function which can be used by a test harness to provide the promise returned by the default function
  
  If a request is made for the promise and it hasn't yet been created a new promise is made with a fetch get request to `/api/config`
  to retrieve the configuration data.  If the server is down, this request will continue attempting to get the value once a minute ad
  infinitum.

  The configuration data is returned to resolve the promise, but local session
  storage also has one item added to it for each of the first level properties
  of this data.  If the property is a String, this is stored in the session
  storage as is, otherwise the value is passed through `JSON.stringify` and that is stored. 

# csv

  the modules default export is a function which can be called with a name and optionally a parameters object.  The name is added to `/api/csv/` to make a download request and if they exist the parameters object is turned into a query string.  The response from that uri is downloaded (expected to be a csv file).

# debug

The purpose of this module is to provide a debugable capability which can be
  dynamically switched on and off browser by setting a key in the config
  returned by the server. It will post request to `/api/log` url with an
  `application/json` body part containing message, topic and gap, where message is
  the concatenation of the debug parameters separated by space, topic is the
  topic of this debug message and gap is the number of milliseconds since the
  last debug message with the same topic.

  Topic data is held in a map, so this module can be used in multiple modules in
  the client and if its the same topic then the gap will be since the last call
  from **any** module.

  To use the debug function in your code, import this module then set the topic
  as shown.

  import Debug from 'debug.js';

  const debug = Debug('topic') topic should only contain the characters a-z or
  A-Z as is converted to lowercase.

  debug(..messages) //messages will be concatenated by space

  the debug function will only log the message if config.debug (see
  config-promise) is set to a string which is a comma separated list of topics
  and that list has the topic for this debug call in it.

  **Note**: the debug function checks with the server (via a debugconf api call)
  to see if the topic is enabled.  This is then cached for a minute, so any
  calls around the same time will use the reply.  This allows the server to
  change what topics are available and for the client side to quickly find if it
  should now start sending message

# dom-host

  the default function of this module is called with a single parameter (normally `this` inside a custom element)
  and it finds the parent.  Its useful for custom elements to sit at the top level of the custom element above and listen for
  events bubbling up from below.  It uses this function to find the element to add an event listener to.

# master-tab-promise

the default function returns a promise, which when resolves will tell you if you are the first (and therefore master) tab in a particular application.

if the master tab closes an custom Event 'master-close' is dispatched on the window.  You can use that to recheck the promise to see if you (or perhaps some other tab also still open is now master);


# pdf

the modules default export is a function which can be called with a name and optionally a parameters object.  The name is added to `/api/pdf/` to post a message to the server, expecting it to stream a precreated, or created on the fly pdf document.  This is opened in a new window.

# post-api

Provides a wrapper found the `fetch` api with error handling and built it post message support to a url prefixed with `/api/`.  

# submit-function

Acts as the on-submit handler for a form.  But instead of allowing the form to send itself it creates an ajax request with all the correct parameters.  
In doing this it can traverse inside custom elements looking for input elements. It will also check for custom elements and if they have both a name and value property if can pretend to be in input.  Also slots are also traversed for all assigned nodes.


# switch-path

Changed window location based on parameters provided
