import React, { useState, useEffect } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

const SpeechRecognitionComponent = ({
  onResult,
  makeApiRequest,
}: {
  onResult: (text: string) => void;
  makeApiRequest: (text: string) => void;
}) => {
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');

  useEffect(() => {
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setFinalTranscript(transcript); // Update final transcript
          onResult(transcript); // Call onResult with final transcript
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
    };
  }, [onResult]);

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
    if (finalTranscript) {
      makeApiRequest(finalTranscript); // Call the API request with the final transcript
    }
  };

  return (
    <div>
      <button onClick={listening ? stopListening : startListening}>
        {listening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default SpeechRecognitionComponent;