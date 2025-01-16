import React, { useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import {
    imageApi,
    visionApi,
    dalleApi
} from "../../api";

const Page = () => {
    
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageText, setImageText] = useState<string>("");

    const [imageBase64, setimageBase64] = useState<string>("");
    const [imageDesc, setImageDesc] = useState<string>("");

    const [imageDalleText, setImageDalleText] = useState<string>();
    const [imageDalleUrl, setImageDalleUrl] = useState<string>("");
    const { promiseInProgress } = usePromiseTracker();

    async function execImageMatchApi() {
        if (selectedImage != null) {
            const response = await imageApi(selectedImage);
            const json = await response.json()
            console.log(bloburl);
            setImageUrl(bloburl + json.message[0].image_file);
            setImageText(json.message[0].description);
        }
    }

    function getBase64(event) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setimageBase64(reader.result);
            // console.log(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    async function execImageDescApi() {
        var messages =
            [
                { "role": "system", "content": "You are a helpful assistant." },
                {
                    "role": "user", "content": [
                        {
                            "type": "text",
                            "text": "Describe this picture:"
                        },
                        {
                            "type": "image_url",
                            "imageUrl": {
                                "url": `${imageBase64}`
                            }
                        }
                    ]
                }
            ];

        // console.log(messages);
        if (selectedImage != null) {
            const response = await visionApi(messages);
            // console.log(response);
            setImageDesc(response);
        }
    }

    return (
        <div className="pageContainer">
            <h2>Vision</h2>
            
        <div>
            <input
                type="file"
                name="myImage"
                onChange={(event) => {
                    setSelectedImage(event.target.files[0]);
                    getBase64(event);
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

                    <h4>Describe </h4>
                    <p>
                        <button onClick={() => execImageDescApi()}>Describe This Brick</button><br />
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