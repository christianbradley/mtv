if(typeof define !== "function") var define = require("amdefine")(module);
define(["lodash", "subscription"], function(_, Subscription) {
	"use strict";

	function Channel(name) {
		this.name = name;
		this.subscriptions = [];
	}

	Channel.prototype.subscribe = function(receiveMessageFn, priority) {
		var subscription = new Subscription(receiveMessageFn, priority);
		this.subscriptions.push(subscription);
		return subscription;
	};

	Channel.prototype.publish = function(message) {
		var sorted = Subscription.sortByPriority(this.subscriptions),
			channel = this;

		function sendMessage(subscription) {
			subscription.receiveMessage(message, channel);
		}

		_.each(sorted, sendMessage);
	};

	return Channel;
});