import React, { useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";

const Page = () => {

    const { promiseInProgress } = usePromiseTracker();
    const [orginalText, setOriginalText] = useState<string>();
    const [translatedText, setTranslatedText] = useState<string>("");

    async function process() {
        if (orginalText != null) {
            trackPromise(
                translationApi(orginalText)
            ).then((res) => {
                setTranslatedText(res);
            }
            )
        }
    }

    async function translationApi(text: string): Promise<string> {
        // todo
        return "";
    }

    const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOriginalText(e.target.value);
    };

    return (
        <div className="pageContainer">
            <h2>Translation</h2>
            <p></p>
            <p>
                <input type="text" placeholder="(enter review in original language)" onChange={updateText} />
                <button onClick={() => process()}>Translate</button><br />
                {
                    (promiseInProgress === true) ?
                        <span>Loading...</span>
                        :
                        null
                }
            </p>
            <p>
                {translatedText}
            </p>
        </div>
    );
};

export default Page;