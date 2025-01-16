---
title: "Challenge 4: Speech"
---

## Text-to-Speech for Self-service

### Goal

Increase operational efficiency and reduce manual workload through targeted automation solutions.

### Challenge

POTENTIAL TO ASK, THROUGH TEXT OR VOICE, QUESTIONS ON METRICS OR PERFORMANCE
RELEVANT TO A ROLE

### Tips

Invoke Azure Speech service to read out text content (text to speech).

There is a `Voice` page on chatbot, the page have an input textbox for description, and a button to invoke AI Service and get back voice output.

Complete the `voiceApi` function to send a text and receive a voice.

- Invoke Speech service using Speech SDK
- Connect voice output to browser
- Play the voice in the browser

### Answer

```
const synthesizer = React.useRef(null);
const speechConfig = React.useRef(null);

useEffect(() => {
    speechConfig.current = sdk.SpeechConfig.fromSubscription(
        SPEECH_KEY,
        SPEECH_REGION
    );
    speechConfig.current.speechRecognitionLanguage = 'en-US';
    // speechConfig.current.speechSynthesisOutputFormat = 5;

    synthesizer.current = new sdk.SpeechSynthesizer(
        speechConfig.current
    );

}, []);

const startReading = () => {
    synthesizer.current.speakTextAsync(
        messageContent,
        result => {

            const { audioData } = result;

            synthesizer.close();

            if (filename) {

                // return stream from file
                const audioFile = fs.createReadStream(filename);
                resolve(audioFile);

            } else {

                // return stream from memory
                const bufferStream = new PassThrough();
                bufferStream.end(Buffer.from(audioData));
                resolve(bufferStream);
            }
        },
        error => {
            synthesizer.close();
            reject(error);
        });
}
```
