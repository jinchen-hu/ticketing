"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000;
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        // the subscriber/consumer will not acknowledge the event
        // until we set the ask() method on the message
        // the nats-streaming-server will redelivery the event after 5s
        // if the event is not acknowledged
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDeliverAllAvailable() // get all available events at the very first time
            .setDurableName(this.queueGroupName);
        // queue group will make sure that all instances of the same service
        // will receive the message/event exactly once
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on("message", function (msg) {
            console.log("Message received: " + _this.subject + " / " + _this.queueGroupName);
            var parsedData = _this.parseMessage(msg);
            _this.onMessage(parsedData, msg);
        });
    };
    Listener.prototype.parseMessage = function (msg) {
        var data = msg.getData();
        return typeof data === "string"
            ? JSON.parse(data)
            : JSON.parse(data.toString("utf-8"));
    };
    return Listener;
}());
exports.default = Listener;
