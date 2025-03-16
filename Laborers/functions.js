import { setLightValues } from "./functions/controlLight.js";
import { performGoogleSearch } from "./functions/searchEngine.js";

export const functions = {
    controlLight: ({ brightness, colorTemperature }) => {
        return setLightValues(brightness, colorTemperature);
    },
    googleSearch: ({ query, maxResults }) => {
        return performGoogleSearch(query, maxResults);
    }
};