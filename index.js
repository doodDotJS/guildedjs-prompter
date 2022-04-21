class Prompter {
    constructor(client) {
        this.client = client;
    }

    message(channelId, options = {}) {
        if (options.question == null) options.question = "Yes or No?";
        if (options.timeout == null) options.timeout = 5000;
        if (options.max == null) options.max = 1;
        if (options.deleteOnResponse == null) options.deleteOnResponse = false;

        return new Promise(async(resolve, reject) => {
            let toReturn = [];
            const questionMessage = await this.client.messages.send(
                channelId,
                options.question,
            );

            let MSG_COUNT = 0;
            const handleOnMessage = async(msg) => {
                if (msg.createdById === this.client.user.id) return;
                MSG_COUNT++;
                if (MSG_COUNT === options.max) {
                    toReturn.push(msg);
                    resolve(toReturn);
                    await this.client.messages.delete(
                        questionMessage.channelId,
                        questionMessage.id,
                    );
                    return this.client.removeListener("messageCreated", handleOnMessage);
                }
            };
            setTimeout(() => {
                if (toReturn.length == 0) {
                    resolve(toReturn);
                    return this.client.removeListener("messageCreated", handleOnMessage);
                }
            }, options.timeout);
            this.client.on("messageCreated", handleOnMessage);
        });
    }
}

module.exports = Prompter;