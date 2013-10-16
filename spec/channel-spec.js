if(typeof define !== "function") var define = require("amdefine")(module);

define(["channel", "sinon", "chai"], function(Channel, sinon, chai) {
	"use strict";

	var expect = chai.expect;

	describe("Channel", function(){
		var sandbox, channel, name, s1, s2, s10, s0;

		beforeEach(function() {
			sandbox = sinon.sandbox.create();
			name = "My Channel";
			channel = new Channel(name);

			s0 = sandbox.spy();
			s1 = sandbox.spy();
			s2 = sandbox.spy();
			s10 = sandbox.spy();

			channel.subscribe(s0);
			channel.subscribe(s10, 10);
			channel.subscribe(s1, 1);
			channel.subscribe(s2, 2);
		});

		it("publishes to all subscribers", function() {
			channel.publish("Some message");
			sinon.assert.calledWith(s1, "Some message", channel);
			sinon.assert.calledWith(s2, "Some message", channel);
			sinon.assert.calledWith(s10, "Some message", channel);
			sinon.assert.calledWith(s0, "Some message", channel);
		});

		it("publishes to subscribers according to priority", function() {
			channel.publish("Some message");
			sinon.assert.callOrder(s10, s2, s1, s0);
		});

		it("knows its name", function() {
			expect(channel.name).to.eql(name);
		});

		afterEach(function() {
			sandbox.restore();
		});
	});
});