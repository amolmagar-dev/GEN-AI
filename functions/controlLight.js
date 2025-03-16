export const controlLightFunctionDeclaration = {
    name: "controlLight",
    parameters: {
        type: "OBJECT",
        description: "Set the brightness and color temperature of a room light.",
        properties: {
            brightness: {
                type: "NUMBER",
                description: "Light level from 0 to 100. Zero is off and 100 is full brightness.",
            },
            colorTemperature: {
                type: "STRING",
                description: "Color temperature of the light fixture which can be `daylight`, `cool`, or `warm`.",
            },
        },
        required: ["brightness", "colorTemperature"],
    },
};

// Function to control the light
export async function setLightValues(brightness, colorTemp) {
    return {
        brightness: brightness,
        colorTemperature: colorTemp
    };
}

// Function mapping
export const functions = {
    controlLight: ({ brightness, colorTemperature }) => {
        return setLightValues(brightness, colorTemperature);
    }
};