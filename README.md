# A Simple, Clean Publish/Subscribe Implementation

## Basic usage

```javascript
// Create a channel
var channel = new Channel("c1");

// Subscribe to the channel
var subscription = channel.subscribe(console.log);

// Publish to the channel
channel.publish("Hello, World"); // logs 'Hello, World'

// Cancel the subscription
subscription.cancel();
channel.publish("Hello again."); // nothing logged

// Resume the subscription
subscription.resume();
channel.publish("Seriously?"); // logs 'Seriously?'
```

## Priority 

```javascript

channel.subscribe(console.log, Subscription.Priority.MIN);
channel.subscribe(function(message, channel) { 
  console.log("This should be first!");
  console.log(message);
  console.log(channel.name);
}, Subscription.Priority.MAX);

channel.publish("Message from channel 1");

// > This should be first!
// > Message from channel 1
// > c1
// > Message from channel 1
```


