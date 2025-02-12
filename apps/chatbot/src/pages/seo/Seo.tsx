import React, { useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import { OpenAIClient, AzureKeyCredential, Completions } from '@azure/openai';


const Page = () => {
    const { promiseInProgress } = usePromiseTracker();
    const [seoUrl, setSeoUrl] = useState<string>();
    const [seoText, setSeoText] = useState<string>("");

    async function process() {
        if (seoUrl != null) {
            trackPromise(
                seoApi(seoUrl)
            ).then((res) => {
                setSeoText(res);
            }
            )
        }
    }

    async function seoApi(url: string): Promise<string> {
        // todo
        return "";
    }

    const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeoUrl(e.target.value);
    };

    return (
        <div className="pageContainer">
            <h2>SEO</h2>
            <p>Sample product page is here: http://localhost:4000/product.html
            </p>
            <p>
                <input type="text" placeholder="(enter url)" onChange={updateText} />
                <button onClick={() => process()}>Generate</button><br />
                {
                    (promiseInProgress === true) ?
                        <span>Loading...</span>
                        :
                        null
                }
            </p>
            <p>
                {seoText}
            </p>
        </div>
    );
};

export default Page;