import { browserAction } from "./functions/browserHelper.js";
import { setLightValues } from "./functions/controlLight.js";
import { performGoogleSearch } from "./functions/searchEngine.js";

export const functions = {
    controlLight: ({ brightness, colorTemperature }) => {
        return setLightValues(brightness, colorTemperature);
    },
    googleSearch: ({ query, maxResults }) => {
        return performGoogleSearch(query, maxResults);
    },
    browserAction: (call) => {
        return browserAction(call);
    }
};