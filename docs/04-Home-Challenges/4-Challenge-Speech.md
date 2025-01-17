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

There is a `Speech` page (`apps\chatbot\pages\speech\Speech.tsx`) on chatbot, the page have an input textbox for description, and a button to invoke AI Service and get back voice output.

Complete the `speechApi` function to send a text and receive a voice.

- Invoke Speech service using Speech SDK
- Connect voice output to browser
- Play the voice in the browser

### Answer

```

import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';


const Page = () => {

    const { promiseInProgress } = usePromiseTracker();
    const [speechText, setSpeechText] = useState<string>();
    const synthesizer = React.useRef(null);
    const speechConfig = React.useRef(null);

    useEffect(() => {
        const speech_key = '44044fcc5f2d44b19c9b97be6161883c';
        speechConfig.current = sdk.SpeechConfig.fromSubscription(
            speech_key,
            'eastus'
        );
        speechConfig.current.speechRecognitionLanguage = 'en-US';
        // speechConfig.current.speechSynthesisOutputFormat = 5;
        synthesizer.current = new sdk.SpeechSynthesizer(
            speechConfig.current
        );

    }, []);

    async function process() {
        if (speechText != null) {
            trackPromise(
                speechApi(speechText)
            ).then((res) => {
                setTranslatedText(res);
            }
            )
        }
    }

    async function speechApi(text: string): Promise<string> {
        await synthesizer.current.speakTextAsync(
            text,
            result => {
                synthesizer.close();
                const { audioData } = result;
                // return stream from memory
                const bufferStream = new PassThrough();
                bufferStream.end(Buffer.from(audioData));
                resolve(bufferStream);
            },
            error => {
                synthesizer.close();
                reject(error);
            });
    }

    const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpeechText(e.target.value);
    };

    return (
        <div className="pageContainer">
            <h2>Speech</h2>
            <p></p>
            <p>
                <input type="text" placeholder="(enter some text to be read aloud)" onChange={updateText} />
                <button onClick={() => process()}>Read</button><br />
                {
                    (promiseInProgress === true) ?
                        <span>Loading...</span>
                        :
                        null
                }
            </p>
        </div>
    );
};

export default Page;

```
