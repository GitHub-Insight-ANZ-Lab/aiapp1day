// import { Sparkle28Filled } from "@fluentui/react-icons";

// export const AnswerIcon = () => {
//     return <Sparkle28Filled primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Answer logo" />;
// };

import React from 'react';
import myLogo from '/workspaces/aiapp1day/labs/aialchemists/apps/chatbot/src/pages/chat/assets/metilda.webp';


export const AnswerIcon = () => {
    return <img src={myLogo} alt="Answer logo" style={{ width: '28px', height: '28px',borderRadius: '50%' }} />;
};