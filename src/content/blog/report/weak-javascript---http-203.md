---
title: Weak JavaScript - HTTP 203
date: 2020-09-07T01:45:26.075Z
description: weakMap, weakSet, weakRefs
category: report
creator: Google Chrome Developers
created_at: 2020-09-01
link: https://www.youtube.com/watch?v=uygxJ8Wxotc
---

## use case for weakMap, weakSet

Let's say you need to save some data related to a dom node, you stored the data in the node object

```javascript
const profile = document.querySelector(".user-profile");
const id = profile._internal.id; // BAD!
```

But this is a bad practice Because

- it's bad etiquette to transform objects that you don't own
- it can cause javascript runtime to deoptimize because changing the shape of an object will make generated binary code invalid
- it can cause name clash

```javascript
const auxilliaryData = new WeakMap();

const profile = document.querySelector(".user-profile");
const id = auxilliaryData.get(profile)?.id; // Better!
```

If dom is gone, the value in weakMap will be gone too.

You can use WeakSet in the same concept but to store boolean as value

## WeakRef

### GC

In most of browsers, when to do GC or how to do GC is not specified on the spec. but It does it. when and how depends on the memory of machine. which means, if the machine has huge memory, GC would not happen for a long time. cause it happens when the machine lacks of memory.

- GC is non-obvious.
- One engine will GC differently from another engine.
- GC != Unreachable (reference to vars or objects)
- GC will happen late, or not at all(!)

### how to use WeakRef

```javascript
const value = createAValue();
const weakRef = new WeakRef(value); // typeof value === 'object'
// -> Won't be GC'd until next task
// ... later ...
const maybeValue = weakRef.deref();
if (maybeValue === undefined) {
  // value was GC'd
} else {
  // value is still available
  // and won't be GC'd until next task
}
```

### FinalizationRegistry (I don't understand about this thing at all)

```javascript
const registry = new FinalizationRegistry(heldValue => {
  // .. cleanup work ...
});
registry.register(someValue, "this is the held value");

// Finalizer callback:
// - someValue is already unavailable
// - No guarantee it will run
// - Especially unlikely to run if the tab is closed
// - Or if the registry itself becomes unreachable

const unregisterToken = {/*...*/};
registry.register(
  someValue,
  "this is the held value",
  unregisterToken
);
```
