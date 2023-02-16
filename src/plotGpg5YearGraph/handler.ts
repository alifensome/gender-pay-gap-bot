import GraphPlotter from "../plotGraph/plot";

const isTest = process.env.IS_TEST === "true"
const graphPlotter = new GraphPlotter(isTest)

export async function handler(event: any, context: any) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    const image = await graphPlotter.generateGraphAsBase64(event.input.data)
    return { imageBase64: image };
}
