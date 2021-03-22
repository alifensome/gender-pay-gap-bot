export function response(data: any): HttpResponse {
    if (!data) {
        return {
            statusCode: 404,
            body: JSON.stringify(
                { message: "Not Found" },
                null,
                2
            ),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(
            data,
            null,
            2
        ),
    };
}

export interface HttpResponse {
    statusCode: number
    body: string
}