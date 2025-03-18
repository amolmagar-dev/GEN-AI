export const browserAdapterFunctionDeclarations = [
    {
        name: "navigate",
        parameters: {
            type: "OBJECT",
            description: "Navigates the browser to a specified URL.",
            properties: {
                url: {
                    type: "STRING",
                    description: "The URL to navigate to."
                }
            },
            required: ["url"]
        },
        description: "Navigates to the provided URL and waits for DOM content to load."
    },
    {
        name: "takeScreenshot",
        parameters: {
            type: "OBJECT",
            description: "Captures a screenshot of the current page.",
            properties: {
                filepath: {
                    type: "STRING",
                    description: "The file path to save the screenshot."
                }
            },
        },
        description: "Saves a screenshot of the current page to the specified file path."
    },
    {
        name: "getText",
        parameters: {
            type: "OBJECT",
            description: "Retrieves text content from a specified selector.",
            properties: {
                selector: {
                    type: "STRING",
                    description: "CSS selector to extract text from."
                }
            },
            required: ["selector"]
        },
        description: "Extracts and returns the inner text of the given element."
    },
    {
        name: "getAttribute",
        parameters: {
            type: "OBJECT",
            description: "Retrieves the value of a specified attribute from an element.",
            properties: {
                selector: {
                    type: "STRING",
                    description: "CSS selector to locate the element."
                },
                attribute: {
                    type: "STRING",
                    description: "The attribute to retrieve."
                }
            },
            required: ["selector", "attribute"]
        },
        description: "Returns the value of the specified attribute from the selected element."
    },
    {
        name: "click",
        parameters: {
            type: "OBJECT",
            description: "Clicks an element on the page.",
            properties: {
                selector: {
                    type: "STRING",
                    description: "CSS selector for the element to click."
                }
            },
            required: ["selector"]
        },
        description: "Performs a click action on the specified element."
    },
    {
        name: "type",
        parameters: {
            type: "OBJECT",
            description: "Types text into an input field.",
            properties: {
                selector: {
                    type: "STRING",
                    description: "CSS selector of the input field."
                },
                text: {
                    type: "STRING",
                    description: "The text to type."
                },
                delay: {
                    type: "NUMBER",
                    description: "Typing delay in milliseconds."
                }
            },
            required: ["selector", "text"]
        },
        description: "Types the provided text into the specified input field with an optional delay."
    },
    {
        name: "waitForSelector",
        parameters: {
            type: "OBJECT",
            description: "Waits for a specific element to appear on the page.",
            properties: {
                selector: {
                    type: "STRING",
                    description: "CSS selector of the element to wait for."
                },
                timeout: {
                    type: "NUMBER",
                    description: "Maximum wait time in milliseconds."
                }
            },
            required: ["selector"]
        },
        description: "Waits for the specified selector to be available on the page."
    },
    {
        name: "evaluate",
        parameters: {
            type: "OBJECT",
            description: "Executes JavaScript code on the page.",
            properties: {
                javascriptCode: {
                    type: "STRING",
                    description: "JavaScript code to be executed in the page context."
                },
                args: {
                    type: "ARRAY",
                    description: "Arguments to pass to the JavaScript code.",
                    items: {
                        type: "STRING"
                    }
                }
            },
            required: ["javascriptCode"]
        },
        description: "Executes the given JavaScript code inside the page context and returns the result."
    },
    {
        name: "getAllText",
        parameters: {
            type: "OBJECT",
            description: "Retrieves all text content from a given selector.",
            properties: {
                selector: {
                    type: "STRING",
                    description: "CSS selector to retrieve text from."
                }
            },
            required: ["selector"]
        },
        description: "Extracts all text from elements matching the selector."
    },
    {
        name: "extractInteractiveElements",
        parameters: {
            type: "OBJECT",
            description: "Extracts interactive elements (buttons, links, inputs, etc.) that match a given filter text.",
            properties: {
                filterText: {
                    type: "STRING",
                    description: "Text to filter interactive elements by their visible text, aria-label, or placeholder. Case-insensitive."
                }
            },
            required: ["filterText"]
        },
        description: "Retrieves a list of interactive elements (buttons, links, inputs, select, textarea) matching the given filter text."
    },
    {
        name: "findURL",
        parameters: {
            type: "OBJECT",
            description: "Searches for a query on Google and returns the first result URL.",
            properties: {
                query: {
                    type: "STRING",
                    description: "The search term to look up on Google."
                }
            },
            required: ["query"]
        },
        description: "Performs a Google search with the provided query and returns the first organic result URL."
    },
    {
        name: "getHtmlSnap",
        parameters: {
            type: "OBJECT",
            description: "Captures an HTML snapshot of the current page.",
            properties: {
                type: {
                    type: "STRING",
                    description: "Defines the scope of the snapshot. Use 'full' for the entire page HTML or 'screen' for only the visible content.",
                    enum: ["full", "screen"]
                }
            },
            required: ["type"]
        },
        description: "Returns either the full HTML of the page or only the visible content based on the provided type."
    }
];