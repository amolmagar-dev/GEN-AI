import { setLightValues } from "./functions/controlLight.js";

export const functions = {
    controlLight: ({ brightness, colorTemperature }) => {
        return setLightValues(brightness, colorTemperature);
    }
};