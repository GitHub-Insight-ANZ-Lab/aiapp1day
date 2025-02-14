import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';


const Page = () => {

    const { promiseInProgress } = usePromiseTracker();
    const [speechText, setSpeechText] = useState<string>();
    const synthesizer = React.useRef<sdk.SpeechSynthesizer | null>(null);
    const speechConfig = React.useRef<sdk.SpeechConfig | null>(null);

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
                
            }
            )
        }
    }

    async function speechApi(text: string): Promise<string> {
        // todo
        return "";
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