export class SimpleEventEmitter {
  //TODO add a model for args
  private events: { [key: string]: Array<(...args: unknown[]) => void> } = {};

  public on(eventName: string, listener: (...args: unknown[]) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  public emit(eventName: string, ...args: unknown[]) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => listener(...args));
    }
  }

  public off(
    eventName: string,
    listenerToRemove: (...args: unknown[]) => void,
  ) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      (listener) => listener !== listenerToRemove,
    );
  }
}
