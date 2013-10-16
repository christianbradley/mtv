if(typeof define !== "function") var define = require("amdefine")(module);

define(function(){
	"use strict";

	/**
	 * Subscription class
	 * @param {function} receiveMessageFn - The method responsible for receiving messages
	 * @param {number} [priority] - The priority of this subscription, lower numbers receive messages later
	 */
	function Subscription(receiveMessageFn, priority) {
		this.receiveMessageFn = receiveMessageFn;
		this.priority = isNaN(priority) ? 0 : priority;
		Subscription.validate(this);
	}

	Subscription.validate = function(subscription) {
		Subscription.Error.TypeError.assert(subscription.receiveMessageFn, "receiveMessageFn", "function");
		Subscription.Error.TypeError.assert(subscription.priority, "priority", "number", "undefined");
		Subscription.Error.PriorityRangeError.assert(subscription.priority);
	};

	/**
	 * Manages Errors raised by Subscriptions
	 * @namespace
	 */
	Subscription.Error = {

		PriorityRangeError: {
			assert: function(value) {
				if(typeof value === "undefined") return;

				var min = Subscription.Priority.MIN,
					max = Subscription.Priority.MAX,
					message = ["Subscription priority must be a number, between", min, "and", max, "."].join(" "),
					valid = (value >= min && value <= max);

				if(!valid) throw new RangeError(message);
			}
		},

		TypeError: {
			assert: function(value, name) {
				var types = Array.prototype.slice.call(arguments, 2),
					i = types.length;

				while(i--) { if(typeof value === types[i]) return; }

				throw new TypeError([
					"Expected type of", name,
					"to be", types.join(" or "),
					"but was", typeof value
				].join(" "));
			}
		}
	};

	Subscription.State = {
		ACTIVE: "active",
		CANCELED: "canceled"
	};

	Subscription.Priority = {
		MIN: 0,
		MAX: 100
	};

	Subscription.sortByPriority = function(subscriptions) {
		function sortMethod(s1, s2) {
			return s2.priority - s1.priority;
		}
		return subscriptions.sort(sortMethod);
	};

	Subscription.isActive = function(subscription) {
		return subscription.state === Subscription.State.ACTIVE;
	};

	Subscription.prototype.state = Subscription.State.ACTIVE;

	Subscription.prototype.cancel = function() {
		this.state = Subscription.State.CANCELED;
	};

	Subscription.prototype.resume = function() {
		this.state = Subscription.State.ACTIVE;
	};

	Subscription.prototype.receiveMessage = function(message, channel) {
		if(Subscription.isActive(this)) this.receiveMessageFn(message, channel);
		return Subscription.isActive(this);
	};

	return Subscription;
});