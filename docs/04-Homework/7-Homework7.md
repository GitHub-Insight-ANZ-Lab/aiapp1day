---
title: "Homework"
slug: /homework1
---

## Challenge #4 Speech

Goal: (session 2, high value)
Increase operational efficiency and reduce manual workload through targeted automation solutions.

Challenge: 
Streamline repetitive tasks in-store using AI-driven function-calling mechanisms to automate operations.

Note: function call. Participant to write a new tool/function call to carry out a task. Like sending an email, or fetch weather info. It will be integration in chatbot, user should be able to trigger by chatting.




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
