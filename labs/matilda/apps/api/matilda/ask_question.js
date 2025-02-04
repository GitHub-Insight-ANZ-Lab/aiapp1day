const MatildaTeamAssistant = require('./agent');

async function main() {
    const assistant = new MatildaTeamAssistant();
    const question = "what all training topics does a new joiner has to complete ?";
    const response = await assistant.executeAgent(question);
    console.log('Response:', response);
}

main().catch(console.error);