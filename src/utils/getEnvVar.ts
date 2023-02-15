export function getEnvVar(envVarKeyName: string): string {
    const variableValue = process.env[envVarKeyName]
    if (!variableValue) {
        throw new Error(`could not find env var ${envVarKeyName}.`)
    }
    return variableValue
}