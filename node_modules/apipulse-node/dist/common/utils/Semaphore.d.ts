declare class Semaphore {
    private _count;
    private _queue;
    constructor(count: number);
    tryAcquire(): boolean;
    acquire(): Promise<void>;
    release(): void;
}
export default Semaphore;
