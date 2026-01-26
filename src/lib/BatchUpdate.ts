class BatchUpdate {
    
    private static instance: BatchUpdate;
    private messages: string[] = [];
    private batching: boolean = false;

    private constructor() {}

    public static getInstance(): BatchUpdate {
        if (!BatchUpdate.instance) {
            BatchUpdate.instance = new BatchUpdate();
        }
        return BatchUpdate.instance;
    }

    public log(message: string): void {
        this.messages.push(message);

        if (!this.batching) {
			setTimeout(() => this.print_logs(), 5000);
			this.batching = true;
		}
    }

    private print_logs() {
        for (const message of this.messages) {
            console.log(message);
        }
        this.messages = [];
        this.batching = false;        
    }
}