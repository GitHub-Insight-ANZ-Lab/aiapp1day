import React, { useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import { OpenAIClient, AzureKeyCredential, Completions } from '@azure/openai';

const Page = () => {

    const { promiseInProgress } = usePromiseTracker();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageBase64, setimageBase64] = useState<string>("");
    const [imageText, setImageText] = useState<string>();
    const [imageDesc, setImageDesc] = useState<string>("");

    async function prcess() {
        if (imageText != null) {
            trackPromise(
                visionApi(imageText, imageBase64)
            ).then((res) => {
                setImageDesc(res);
            }
            )
        }
    }

    async function visionApi(text : string, image : string): Promise<string> {
        // todo
        return "";
    }

    function getBase64(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                if (typeof reader.result === "string") {
                    setimageBase64(reader.result);
                }
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    }

    const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageText(e.target.value);
    };

    return (
        <div className="pageContainer">
            <h2>Vision</h2>

            <div>
                <input
                    type="file"
                    name="myImage"
                    onChange={(event) => {
                        if (event.target.files) {
                            setSelectedImage(event.target.files[0]);
                            getBase64(event);
                        }
                    }}
                />
                <br />

                {selectedImage && (
                    <div>
                        <h4>Your Photo</h4>
                        <p>
                            <img
                                width={"400px"}
                                src={URL.createObjectURL(selectedImage)}
                            />
                        </p>

                        <h4>Question</h4>
                        <input type="text" placeholder="(your question about the image)" onChange={updateText} />
                        <p>
                            <button onClick={() => prcess()}>Describe</button><br />
                            {
                                (promiseInProgress === true) ?
                                    <span>Loading...</span>
                                    :
                                    null
                            }
                        </p>
                        <p>
                            {imageDesc}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;