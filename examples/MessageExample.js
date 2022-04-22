const { Client } = require("guilded.js");
const client = new Client({
    token: "",
});

const Prompter = require("../index");
const prompter = new Prompter(client);

client.on("messageCreated", async(message) => {
    // Ask the user if they like cantaloupes.
    // If the message does not start with "!foo", ignore.
    if (!message.content.startsWith("!foo")) return;

    // Returns an array of responses in the form of Message Objects.
    const responses = await prompter.message(message.channelId, {
        question: "Do you like cantaloupes?", // The question to ask.
        userId: message.createdById, // Only get a response from a certain user. Else, accept a response from anyone.
        timeout: 10000, // 10 seconds in milliseconds
        max: 1, // The maximum amount of responses.
        deleteOnResponse: true, // False by default. Deletes the question message after the prompt ends.
    });

    // If there is no response, do this
    if (responses.length === 0)
        return client.messages.send(
            message.channelId,
            "You did not provide a response!",
        );

    // Get the first response.
    const response = responses[0];

    // Send a message.
    client.messages.send(message.channelId, `"${response.content}", really?`);
});

client.login();
