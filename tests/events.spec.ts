import assert from "assert";
import { createFromTemplate } from "../src/dom.js";
import { isTouchEvent, off, on, trigger } from "../src/events.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let eventsGuid = 0;

it("events.on", async () => {
  const template = "<div><p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  let eventReceived = false;
  const eventHandler = function (event: Event): void {
    assert.strictEqual(event.type, "click");
    eventReceived = true;
  };
  on(node, "click", eventHandler);
  const evuid = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid].type, "click");
  assert.strictEqual(node.ljbtEvents[evuid].ns, null);
  assert.strictEqual(node.ljbtEvents[evuid].handler, eventHandler);
  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, true);
});

it("events.on (with namespace)", async () => {
  const template = "<div><p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  let eventReceived = false;
  const eventHandler = function (event: Event): void {
    assert.strictEqual(event.type, "click");
    eventReceived = true;
  };
  on(node, "click:namespace", eventHandler);
  const evuid = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid].type, "click");
  assert.strictEqual(node.ljbtEvents[evuid].ns, "namespace");
  assert.strictEqual(node.ljbtEvents[evuid].handler, eventHandler);
  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, true);
});

it("events.off", async () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  let eventReceived = false;
  const eventHandler = function (event: Event): void {
    assert.strictEqual(event.type, "click");
    eventReceived = true;
  };
  on(node, "click", eventHandler);
  const evuid1 = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid1] !== undefined, true);
  off(node, "click", eventHandler);
  assert.strictEqual(node.ljbtEvents[evuid1], undefined);

  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, false);

  on(node, "click", eventHandler);
  const evuid2 = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid2] !== undefined, true);
  off(node, "click");
  assert.strictEqual(node.ljbtEvents[evuid2], undefined);

  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, false);
});

it("events.off (with namespace)", async () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  let eventReceived = false;
  const eventHandler = function (event: Event): void {
    assert.strictEqual(event.type, "click");
    eventReceived = true;
  };
  on(node, "click:namespace", eventHandler);
  const evuid1 = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid1] !== undefined, true);
  off(node, "click:namespace", eventHandler);
  assert.strictEqual(node.ljbtEvents[evuid1], undefined);

  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, false);

  on(node, "click:namespace", eventHandler);
  const evuid2 = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid2] !== undefined, true);
  off(node, "click:namespace");
  assert.strictEqual(node.ljbtEvents[evuid2], undefined);

  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, false);

  on(node, "click:namespace", eventHandler);
  const evuid3 = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid3] !== undefined, true);
  off(node, "*:namespace");
  assert.strictEqual(node.ljbtEvents[evuid3], undefined);

  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, false);

  on(node, "click:namespace", eventHandler);
  const evuid4 = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid4] !== undefined, true);
  off(node, "click");
  assert.strictEqual(node.ljbtEvents[evuid4], undefined);

  node.querySelector("p")?.dispatchEvent(new PointerEvent("click", { bubbles: true }));
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, false);
});

it("events.trigger", async () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  let eventReceived = false;
  const eventHandler = function (event: Event): void {
    assert.strictEqual(event.type, "custom.event");
    assert.strictEqual((event as CustomEvent).detail.key, "value");
    eventReceived = true;
  };
  on(node, "custom.event", eventHandler);
  const evuid = ++eventsGuid;
  assert.strictEqual(node.ljbtEvents[evuid].type, "custom.event");
  assert.strictEqual(node.ljbtEvents[evuid].ns, null);
  assert.strictEqual(node.ljbtEvents[evuid].handler, eventHandler);
  trigger(node.querySelector("p")!, "custom.event", { key: "value" });
  await sleep(10); // Wait for the event to be processed
  assert.strictEqual(eventReceived, true);
});

it("events.isTouchEvent", () => {
  assert.strictEqual(isTouchEvent(new PointerEvent("click")), false);
  assert.strictEqual(isTouchEvent(new KeyboardEvent("keydown")), false);
  assert.strictEqual(isTouchEvent(new TouchEvent("touchstart")), true);
});
