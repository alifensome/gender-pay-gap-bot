import { createInterface } from 'readline';


export async function promptUser(msg: string): Promise<string> {
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const readLineAsync = (): Promise<string> => {
        return new Promise(resolve => {
            readline.question(msg, userRes => {
                return resolve(userRes);
            });
        });
    };
    return await readLineAsync();
}
