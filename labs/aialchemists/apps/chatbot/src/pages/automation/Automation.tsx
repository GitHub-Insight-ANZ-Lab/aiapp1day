import React, { useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";

const Page = () => {

    const { promiseInProgress } = usePromiseTracker();
    const [imageDalleText, setImageDalleText] = useState<string>();
    const [imageDalleUrl, setImageDalleUrl] = useState<string>("");

    async function execImageCreateApi() {
        if (imageDalleText != null) {
            trackPromise(
                // dalleApi(imageDalleText);
            ).then((response) => {

                // console.log(response);
                setImageDalleUrl(response);
                // setImageDesc(response);   
            }

            )
        }
    }

    const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageDalleText(e.target.value);
        // console.log('edit->' + task)
    };


    return (
        <div className="pageContainer">
            <h2>Automation</h2>
            <p></p>
            <p>
                <input type="text" placeholder="describe an image ()" onChange={updateText} />
                <button onClick={() => execImageCreateApi()}>Translate</button><br />
                {
                    (promiseInProgress === true) ?
                        <span>Loading...</span>
                        :
                        null
                }
            </p>
            <p>
                <img height={"550px"} src={imageDalleUrl} />
            </p>
        </div>
    );
};

export default Page;