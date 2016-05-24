type Callback = (...a: any[]) => any;

class EventEmitter {
    _events:Map<string, Set<Callback> > = new Map();

    on(event: string, callback: Callback): void {
        this._getCallbackSet(event).add(callback);
    }

    off(event: string,callback: Callback): void {
        this._getCallbackSet(event).delete(callback);
    }

    emit(event: string,...args: any[]): void {
        this._getCallbackSet(event).forEach(cb => cb(...args))
    }
    
    _getCallbackSet(event: string): Set<Callback> {
        if (this._events.has(event))
            return this._events.get(event);

        const callbacks = new Set();
        this._events.set(event, callbacks);

        return callbacks;
    }
}
export default EventEmitter;