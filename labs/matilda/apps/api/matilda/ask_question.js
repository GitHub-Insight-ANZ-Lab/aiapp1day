const MatildaTeamAssistant = require('./agent');

async function main() {
    const assistant = new MatildaTeamAssistant();
    const question = "what is the total count of transactions occurred in all of the sales data available?";
    const response = await assistant.executeAgent(question);
    console.log('Response:', response);
}

main().catch(console.error);