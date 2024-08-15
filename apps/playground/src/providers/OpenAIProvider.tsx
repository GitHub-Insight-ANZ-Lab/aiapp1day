import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { useEventDataContext } from "./EventDataProvider";
import { API_URL } from "../constants";

export type OpenAIProviderValue = {
  client?: OpenAIClient;
};

const OpenAIClientContext = createContext<OpenAIProviderValue>({
  client: undefined,
});

const OpenAIClientProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { eventCode } = useEventDataContext();
  const [client, setClient] = useState<OpenAIClient | undefined>(undefined);

  useEffect(() => {
    if (eventCode) {
      setClient(
        new OpenAIClient(
          `${API_URL}`,
          new AzureKeyCredential(`${eventCode}`),
          {
            allowInsecureConnection: process.env.ENVIRONMENT === "development",
          }
        )
      );
    } else {
      setClient(undefined);
    }
  }, [eventCode]);

  return (
    <OpenAIClientContext.Provider value={{ client }}>
      {children}
    </OpenAIClientContext.Provider>
  );
};

const useOpenAIClientContext = () => useContext(OpenAIClientContext);

// eslint-disable-next-line react-refresh/only-export-components
export { OpenAIClientProvider, useOpenAIClientContext };
