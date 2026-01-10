# app-utils
General utilities that I use for building SPAs 

Release 5.0 adds a lot of new functions and some major changes to existing ones. It also has been packaged into an export from a single file.

## api and ApiError

The key function is **api** which handles a post request to a `/api/<url>` server, managing the response. ApiError are
how problems with this are reported. The api call takes two essential parameters and one optional.

1. url - the url appended to `/api/` to the endpoint of the server.
2. params - an object containing the parameters to be passed to the endpoint
3. optional flag to indicate the response is a blob (normally a pdf) to be opened in a new window rather than as a direct response.

The response is aysnchronousally returned as an object.  Errors are throw using the **ApiError** object.

## ApiKeys

  **ApiKeys** is a class where the new 

    ApiKeys is a class that provides keyboard support by normalising key
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

```javascript
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

```javascript
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

## calcTextColour

This is a utility function to determine the correct foreground colour (black or white) to use with a background colour
passed as the parameter (as a hex strings with an optional proceeding `#` symbol.). The colour is returned as either `#000000` or `#ffffff`

## config and related 

By importing the **config** constant you are infact resolving from promise (this `import` statement does the resolving) to make an api call to the server `/api/config` to return config data as an object.  What is returned is obviously server dependant. It has two independant functions.  From an application point of view `import {config} from '@akc42/app-utils` produces a config constant with the config data set.

Additional support is provided with
  
1. **setConfig** which can optionally be given a promise which resolves to a new config (useful in testing scenarios), or causes a re-read of the config from the server, although it does not return this reread..
2. **reReadConfig** actualy causes a re-read from the server and returns the promise for its eventual resolution (i.e
   `const config = await reReadConfig()`).

## csv

  the modules default export is a function which can be called with a name and optionally a parameters object.  The name is formed into url to `/api/csv/<name>`  to make a download request and if they exist the parameters object is turned into a query string.  The response from that uri is downloaded (expected to be a csv file).

## debug

The purpose of this module is to provide a debugable capability which can be
dynamically switched on and off browser by setting a key in the config
returned by the server. It will post request to `/api/debuglog/:immediate` url with an
`application/json` body part containing debug data.  Its purpose is to emulate what it's 
server counterpart does locally.

It consists of two functions **Debug** and **Logger**.

**Debug** creates an instance of a debug function and its called with parameters:

- **topic** - a value that can be searched for. Useful for dividing into different sections
- **colourspec** - One of name of standard colors [app,db,api,client,log,mail,auth,error], 
  a hex color string, an rgb, comma seperated, string of three values 0-255 
- **shortdate** - if true, then dates will be output as YYYY-MM-DD hh:mm else 
  YYYY-MM-DD hh:mm:ss.ms
- **immediate** - if true, the message is output (formatted) to the console, both in the 
  browser and in the server.
  
Calling this function returns a function that will send a row to the server (for writing into the log there), using the
parameters above and some optional extra values these extra parameters (just skip if not provided, the function
dynamically checks them) are:-

- **crash** - the literal word "crash".  if set, then this will be highlighted in the output. Don't provide this as
  the first parameter if a normal call
- **logtime**- a unix millisecond timestamp.  If provided if must be for today, otherwise it will be as
  though it were not provided. If provided it will be the `logtime`, otherwise `Date.now()` will be used.
- **ipaddress** - an optional parameter container a string representation of an ip address. Ignored if not
  a valid adddress. If provided its value will be highlighted and surrounded in "[]"
- **...messages** - As many parameters containing parts of the message.  The message will be joined together
  with a space separation and displayed with the colourspec parameter.



**Logger** is like Debug (indeed its a wrapper for it) except it doesn't need short date, or immediate parameters as 
that is what is assumed.

## dom-host

The **domHost** function is called with a single parameter (normally `this` inside a custom element)
and it finds the parent.  Its useful for custom elements to sit at the top level of the custom element above and listen for
events bubbling up from below.  It uses this function to find the element to add an event listener to.

## Client Side Routing.

A Distributed Client Side Router for use with a hierarchy of custom components in an Single Page Application. The
functions of this subsystem links the browsers URL bar into a chained list of `Route` objects that process a part of the
segmented url.  It takes in a `route` object and passes out a `subRoute` object.  These are chained together, the
subRoute at one level being fed into route of the next level down the hierarchy.  

At the top level is a pair of functions **connectUrl** and **disconnectUrl**.  Which ever element will be your master
controller (generally a `<main-app>` element which has a `<session-manager>` and `<page-manager>`, both of which are
controlling pages).  A `<session-manager>` page doesn't reflect in the url bar at all as the user navigates the log in
process.  But once authorised, the `<page-manager>` takes over and controls which page is displayed based on the url. So
it is the `<page-manager>` custom element that calls **connectUrl** in its `connectedCallback` function, and
**disconnectUrl** in its `disconnectedCallback` function.  **connectUrl** uses a callback function as its only parameter and
this callback function gets called on url change, passing the top level `route` object.

The next piece in this arrangement is a router.  This is a class called **Route** and is instanciated with one required
parameter and one optional parameter. The required parameter is a string containing "/" separated segments, which must
either literally match the part of the url, or can start with a ":" character followed by a name, in which case we
assume that that part of the url should be interpreted as a parameter.  We process a new `route` (however we receive it
- either via the `connectUrl` callback, or being passed into a custom element via a property/attribute) by calling the
`routeChange` method, this returns a `route` object which the part of the url segment checked against the specification
provdied in the `new Route()` call. `route` has an `active` property to determine if it matched and a `params` property
the value of any of the ":" segments. Any queryString is also decoded and placed in the `query` property of objects.

If the `active` propery of a route is false, the subRoute will also have an `active` value of false.  A `query` property
is always passed straight through and it is up to the application to decided how and when to use it.

The optional second parameter to the `new Route()` call is a matching string for the previous route up the chain.  It
consists of a string which contains a single ":" character.  The left of the ":" character is a parameter name, and to
the right a parameter value.  The incoming route's `params` property must contain the "name" and it must have the value
"value" for the subRoute to be active (as well as matching the url).

This is usually used with something like this

```javascript
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
(I have simplified what happens - subRoute would probably be passed in as the `route` property to a custom element which
might at some point want read a database record based on id).

In this example we only want to read the (lets say) the appointment record from the database if the
`<appointment-manager>` element had been activated with a url of the form "/appointements/53" and not (say) when the url
was "/user/53", when the `<user-manager>` element is in the dom and the `<appointment-manager>` is still in the dom, but
not doing anything.  The other obvious question is why not do this:-

```javascript
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

```javascript
    ${
      {
        home: html`<app-home></app-home>`,
        user: html`<app-user managed-page .route=${this.subRoute}></app-user>`,
        appointments: html`<app-appointments managed-page .route=${this.subRoute}></app-appointments`
      }[this.page]
    }
```

The route manager users `new Route('/:page')` to translate the incoming `route` to the `page` property.

Internally the `Route` class uses a `route-changed` event which this overall module listens to on the window and this
can be used to change the url. the `Route` class has three properties that can be set and which can change the url.

- `connection` which if set `true` join the input and output of the route managed by this instance provided only that
   the route doesn't have any ":" segment, and change the url accordingly.  If set to `false` it will always make the
   output disconnected.
- `params` which when set with an object which maps the properties of an active `params` in the `subRoute` will change
   the url - so for instance in the example above calling `firstlevel.params = {id: 20}` will change the url to
   `/appointments/20`.
-  `query` we can set a query set of parameters and these will then change the url to have those query parameters.

Other modules that wish to change the url can do so, but they need to dispatch a `location-altered` event in the window.
A helper function **switchPath** can do this for you.  It takes two parameters, `path` and a `params` object, the latter
of which is formed into a query string and appended (with the appropriate "?") into a string.  A helper function
**generateUri** takes the same two parameters and creates the final url, it just doesn't apply the result.

**navigate** is a function to be used as an event handler on an element (normally for `@click`). It calls `switchPath` with the
`path` set to the  `path` attribute of the element which fired the event.

## master-tab-promise

The **getMasterTabPromise** function returns a promise, which when resolves will tell you if you are the first (and therefore master) tab in a particular application.

if the master tab closes an custom Event 'master-close' is dispatched on the window.  You can use that to recheck the promise to see if you (or perhaps some other tab also still open is now master);

## partMap

**partMap** is a `lit` "directive", exactly analogous to the provided `classMap`, but for the `part` attribute. Use it in the same way to dynamically assign parts to an element.

## pdf

the modules default export is a function which can be called with a name and optionally a parameters object.  The name is added to `/api/pdf/` to post a message to the server, expecting it to stream a precreated, or created on the fly pdf document (as Blob).  This is opened in a new window.


## submit-function

Acts as the on-submit handler for a form.  But instead of allowing the form to send itself it creates an ajax request
with all the correct parameters. In doing this it can traverse inside custom elements looking for input elements. It
will also check for custom elements and if they have both a name and value property if can pretend to be in input.  Also
slots are also traversed for all assigned nodes.

