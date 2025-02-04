const MatildaTeamAssistant = require('./agent');

async function main() {
    const assistant = new MatildaTeamAssistant();
    const question = "Can you help me find aisle 6 in the store?";
    const response = await assistant.executeAgent(question);
    console.log('Response:', response);
}

main().catch(console.error);