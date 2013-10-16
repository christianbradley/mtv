if(typeof define !== "function") var define = require("amdefine")(module);

define(["subscription", "sinon", "chai"], function(Subscription, sinon, chai) {
	"use strict";

	var expect = chai.expect;
	function noop() {}

	describe("Subscription", function() {
		var subscription, sandbox, receiveMessage, priority;

		beforeEach(function() {
			sandbox = sinon.sandbox.create();
			receiveMessage = sandbox.spy();
			priority = void 0;
			subscription = new Subscription(receiveMessage, priority);
		});

		it("Defaults to the lowest priority", function() {
			expect(subscription.priority).to.eql(Subscription.Priority.MIN);
		});

		it("Throws when no function provided", function() {
			var error;
			try { subscription = new Subscription("notAFunction"); } catch(e) { error = e; }
			expect(error.name).to.eql("TypeError");
		});

		it("Throws when priority is too low", function() {
			var error;
			try { subscription = new Subscription(noop, Subscription.Priority.MIN-1); } catch(e) { error = e; }
			expect(error.name).to.eql("RangeError");
		});

		it("Throws when priority is too high", function() {
			var error;
			try { subscription = new Subscription(noop, Subscription.Priority.MAX+1); } catch(e) { error = e; }
			expect(error.name).to.eql("RangeError");
		});

		it("receives messages", function(){
			subscription.receiveMessage("foo", "bar");
			sinon.assert.calledWith(receiveMessage, "foo", "bar");
		});

		it("is active", function() {
			expect(Subscription.isActive(subscription)).to.eql(true);
		});

		describe("Cancelled", function() {
			beforeEach(function() {
				subscription.cancel();
			});

			it("does not receive messages", function() {
				subscription.receiveMessage("foo", "bar");
				expect(receiveMessage.callCount).to.eql(0);
			});

			it("is not active", function() {
				expect(Subscription.isActive(subscription)).to.eql(false);
			});

		});

		describe("Resumed", function() {
			beforeEach(function() {
				subscription.cancel();
				subscription.resume();
			});

			it("receives messages", function() {
				subscription.receiveMessage("foo", "bar");
				sinon.assert.calledWith(receiveMessage, "foo", "bar");
			});

			it("is active", function() {
				expect(Subscription.isActive(subscription)).to.eql(true);
			});
		});

		afterEach(function() {
			sandbox.restore();
		});
	});
});
