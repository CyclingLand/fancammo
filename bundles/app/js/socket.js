function Socket(socketURL, topicId)
{
    this.topicId = topicId;

    this._socketURL = socketURL;
    this._topicPrefix = 'subscribe-topic-';
    this._socket = false;
    this._eventListeners = {};
}

Socket.prototype.connect = function()
{
    this.disconnect();

    this._socket = new WebSocket(this._socketURL, this._topicPrefix + this.topicId);
    this._socket.onopen = this.socketOpen.bind(this);
    this._socket.onclose = this.socketClose.bind(this);
    this._socket.onmessage = this.socketMessage.bind(this);
    this._socket.onerror = this.socketError.bind(this);
};

Socket.prototype.disconnect = function()
{
    if (this._socket) {
        this._socket.close();
    }
};

Socket.prototype.send = function(message) {
    if (this._socket)
    {
        this._socket.send(message);
        return true;
    }

    return false;
};

Socket.prototype.socketOpen = function(event) {
    this._fireEvent('connect');
};

Socket.prototype.socketClose = function(event) {
    this._fireEvent('disconnect');
};

Socket.prototype.socketMessage = function(event) {
    this._fireEvent('message', event.data);
};

Socket.prototype.socketError = function(event) {
    this._fireEvent('error');
};

Socket.prototype.on = function(eventName, callback) {
    this._eventListeners[eventName] = callback;
};

Socket.prototype._fireEvent = function(eventName, data)
{
    if (this._eventListeners[eventName]) {
        this._eventListeners[eventName](data);
    }
}