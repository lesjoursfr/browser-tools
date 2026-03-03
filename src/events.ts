export type BrowserToolsEvent = {
  type: string;
  ns: string | null;
  handler: EventListenerOrEventListenerObject;
  originalHandler?: EventListenerOrEventListenerObject;
};

type BrowserToolsEvents = {
  [key: string]: BrowserToolsEvent;
};

declare global {
  interface Window {
    ljbtEvents: BrowserToolsEvents;
  }
  interface Document {
    ljbtEvents: BrowserToolsEvents;
  }
  interface HTMLElement {
    ljbtEvents: BrowserToolsEvents;
  }
}

let eventsGuid = 0;

/**
 * Parse an event type to separate the type & the namespace
 * The type & namespace are separated by a ":". For example, "click:namespace" will be parsed to { type: "click", ns: "namespace" }
 * Namespace is optional. For example, "click" will be parsed to { type: "click", ns: null }
 * Namespace can't contain a ":". For example, "click:namespace1:namespace2" will be parsed to { type: "click", ns: "namespace1" }
 * @param {string} string
 */
function parseEventType(string: string): Omit<BrowserToolsEvent, "handler"> {
  const [type, ...nsArray] = string.split(":");
  return {
    type,
    ns: nsArray.length > 0 ? nsArray[0] : null,
  };
}

/**
 * Set an event listener on the node.
 * @param {Window|Document|HTMLElement} node The node to set the event listener on.
 * @param {string} events The event(s) to listen for.
 * @param {Function} handler The event handler function to be called when the event is triggered.
 * @param {Function|undefined} originalHandler The original handler passed to the `one` function. This is used to store the original handler in the event object, so that it can be removed later when the `off` function is called with the original handler.
 */
function addEventListener(
  node: Window | Document | HTMLElement,
  events: string,
  handler: EventListenerOrEventListenerObject,
  originalHandler?: EventListenerOrEventListenerObject
): void {
  if (node.ljbtEvents === undefined) {
    node.ljbtEvents = {};
  }

  for (const event of events.split(" ")) {
    const { type, ns } = parseEventType(event);
    const handlerGuid = (++eventsGuid).toString(10);
    node.addEventListener(type, handler);
    node.ljbtEvents[handlerGuid] = { type, ns, handler, originalHandler };
  }
}

/**
 * Remove event listeners from the node.
 * @param {Window|Document|HTMLElement} node
 * @param {string} events
 * @param {Function|undefined} handler
 */
function removeEventListener(
  node: Window | Document | HTMLElement,
  events: string,
  handler?: EventListenerOrEventListenerObject
): void {
  if (node.ljbtEvents === undefined) {
    node.ljbtEvents = {};
  }

  for (const event of events.split(" ")) {
    const { type, ns } = parseEventType(event);

    for (const [guid, handlerObj] of Object.entries(node.ljbtEvents)) {
      if (handlerObj.type !== type && type !== "*") {
        continue;
      }

      if (
        (ns === null || ns === handlerObj.ns) &&
        (handler === undefined || handler === (handlerObj.originalHandler ?? handlerObj.handler))
      ) {
        delete node.ljbtEvents[guid];
        node.removeEventListener(handlerObj.type, handlerObj.handler);
      }
    }
  }
}

/**
 * Set an event listener on every node.
 * Events can be separated by a space. For example, "click mouseover" will set the event listener on both "click" and "mouseover" events.
 * Events can also have a namespace. For example, "click:namespace" will set the event listener on the "click" event with the namespace "namespace".
 * The namespace can be used to remove the event listener later.
 * Namespace can't contain a ":". For example, "click:namespace1:namespace2" set the event listener on the "click" event with the namespace "namespace1".
 * @param {Window|Document|HTMLElement|NodeList} nodes
 * @param {string} events
 * @param {Function} handler
 */
export function on(
  nodes: Window | Document | HTMLElement | NodeListOf<HTMLElement>,
  events: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (nodes instanceof NodeList) {
    for (const node of nodes) {
      addEventListener(node, events, handler);
    }
  } else {
    addEventListener(nodes, events, handler);
  }
}

/**
 * Set a one-time event listener on a single node.
 * This is similar to the `on` function, but the event listener will be removed after it is triggered for the first time.
 * @param {Window|Document|HTMLElement} node
 * @param {string} events
 * @param {Function} handler
 */
export function one(
  node: Window | Document | HTMLElement,
  events: string,
  handler: EventListenerOrEventListenerObject
): void {
  addEventListener(
    node,
    events,
    function (event) {
      removeEventListener(node, events, handler);
      if (typeof handler === "function") {
        handler(event);
      } else {
        handler.handleEvent(event);
      }
    },
    handler
  );
}

/**
 * Remove event listeners from the node.
 * Events can be separated by a space. For example, "click mouseover" will remove the event listener from both "click" and "mouseover" events.
 * If the handler is not specified, all event listeners of the given type will be removed. If the type is "*", all event listeners will be removed.
 * To remove event listeners with a specific namespace, you can specify the namespace in the events parameter.
 * For example, "click:namespace" will remove all event listeners of the "click" event with the namespace "namespace"
 * and "*:namespace" will remove all event listeners with the namespace "namespace".
 * @param {Window|Document|HTMLElement|NodeList} nodes
 * @param {string} events
 * @param {Function|undefined} handler
 */
export function off(
  nodes: Window | Document | HTMLElement | NodeListOf<HTMLElement>,
  events: string,
  handler?: EventListenerOrEventListenerObject
): void {
  if (nodes instanceof NodeList) {
    for (const node of nodes) {
      removeEventListener(node, events, handler);
    }
  } else {
    removeEventListener(nodes, events, handler);
  }
}

/**
 * Trigger the Event on the node.
 * @param {Window|Document|HTMLElement} node
 * @param {string|Event} event
 * @param {Object|undefined} payload
 */
export function trigger(node: Window | Document | HTMLElement, event: string | Event, payload?: object): void {
  node.dispatchEvent(
    typeof event === "string" ? new CustomEvent(event, { detail: payload, bubbles: true, cancelable: true }) : event
  );
}

/**
 * Check if the event is a TouchEvent
 * @param {Event} e
 * @returns {boolean} true if the event is a TouchEvent
 */
export function isTouchEvent(e: Event): e is TouchEvent {
  return window.TouchEvent && e instanceof TouchEvent;
}
