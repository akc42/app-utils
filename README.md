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

  **Note**: the debug function checks with the sessionStorage.getItem('debug) (via an await for the Config Promise)
  to see if the topic is enabled (assumes the result is a ':' separated string of topics).  This allows the server to
  change what topics are available via the config api call.

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

# distributed-router
Distributed Client Side Router for use with a hierarchy of custom components in an Single Page Application

This is a series of javascript modules that you can link together to form a distributed client router system.  It links 
the browsers URL bar into a chained list of `Routee` objects that process a part of the segmented url.  It takes in a `route` object
and passes out a `subRoute` object.  These are chained together, the subRoute at one level being fed into route of the next level down
the hierarchy.  

At the top level is a pair of functions `connectUrl` and `disconnectUrl`.  Which ever element will be your master controller (I generally 
have a `<main-app>` element which has a `<session-manager>` and `<page-manager>`, both of which are controlling pages.  A `<session-manager>` 
page doesn't reflect in the url bar at all as the user navigates the sign in process.  But once authorised, the `<page-manager>` takes over
and controls which page is displayed based on the url.  So it is the `<page-manager>` custom element that calls `connectUrl` in its `connectedCallback`
function, and `disconnectUrl` in its `disconnectedCallback` function.  `connectUrl` uses a callback function as its only parameter and this callback
function gets called on url change, passing the top level `route` object.

The next piece in this arrangement is a router.  This is a class called `Route` and is instanciated with one required parameter and one 
optional parameter. The required parameter is a string containing "/" separated segments, which must either literally match the part of 
the url, or can start with a ":" character followed by a name, in which case we assume that that part of the url should be interpreted 
as a parameter.  We process a new `route` (however we receive it - either via the `connectUrl` callback, or being passed into a custom 
element via a property/attribute) by calling the `routeChange` method, this returns a `route` object which the part of the url segment 
checked against the specification provdied in the `new Route()` call. `route` has an `active` property to determine if it matched and 
a `params` property the value of any of the ":" segments. Any queryString is also decoded and placed in the `query` property of objects.

If the `active` propery of a route is false, the subRoute will also have an `active` value of false.  A `query` property is always passed 
straight through and it is up to the application to decided how and when to use it.

The optional second parameter to the `new Route()` call is a matching string for the previous route up the chain.  It consists of a string
which contains a single ":" character.  The left of the ":" character is a parameter name, and to the right a parameter value.  The incoming
route's `params` property must contain the "name" and it must have the value "value" for the subRoute to be active (as well as matching the url).

This is usually used with something like this
```
 const topLevel = new Route('/:page');
 const firstLevel = new Route('/:id', 'page:appointments');
 connectUrl(route => {
    const subRoute = topLevel.routeChange(route);
    if (subRoute.active) {
      ...

      const subSubRoute = firstLevel.routeChange(subRoute);
      if (subSubRoute.active) {
        readDatabaseRecord(subSubRoute.params.id)
      }
      ...
    }
 });
 
```
(I have simplified what happens - subRoute would probably be passed in as the `route` property to a custom element which might at some point want
read a database record based on id).

In this example we only want to read the (lets say) the appointment record from the database if the `<appointment-manager>` element had been activated
with a url of the form "/appointements/53" and not (say) when the url was "/user/53", when the `<user-manager>` element is in the dom and the `<appointment-manager>` is still in the dom, but not doing anything.  The other obvious question is why not do this:-

```
 const firstLevel = new Route('/appointments/:id');
 connectUrl(route => {
    const subRoute = topLevel.routeChange(route);
    if (subRoute.active) {
      ...

      const subSubRoute = firstLevel.routeChange(subRoute);
      if (subSubRoute.active) {
        readDatabaseRecord(subSubRoute.params.id)
      }
      ...
    }
 });

```
and the answer to that is that I have an element `<route-manager>` which in fact something like `<page-manager>` extends
which then allows me to do (in `lit-element`s `render` function)
```
    ${ {
      home: html`<app-home></app-home>`,
      user: html`<app-user managed-page .route=${this.subRoute}></app-user>
      appointments: html`<app-appointments managed-page .route=${this.subRoute}></app-appointments`
        }[this.page]
     }
```

The route manager users `new Route('/:page')` to translate the incoming `route` to the `page` property.

Internally the `Route` class uses a `route-changed` event which this overall module listens to on the window and this can be used to change the url.
the `Route` class has three properties that can be set and which can change the url.

- `connection` which if set `true` join the input and output of the route managed by this instance provided only that the route doesn't have any ":" segment,
   and change the url accordingly.  If set to `false` it will always make the output disconnected.
- `params` which when set with an object which maps the properties of an active `params` in the `subRoute` will change the url - so for instance in the example
   above calling `firstlevel.params = {id: 20}` will change the url to `/appointments/20`.
-  `query` we can set a query set of parameters and these will then change the url to have those query parameters.

Other modules that wish to change the url can do so, but they need to dispatch a `location-altered` event in the window. A helper 
class `LocationAltered` can generate it for you, so to change the location do:-
```
  history.pushState({}, null, '/user/23');
  window.dispatchEvent(new LocationAltered());
```
