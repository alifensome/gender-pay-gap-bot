export function getEnvVar(envVarKeyName: string): string {
  const variableValue = process.env[envVarKeyName];
  if (!variableValue) {
    throw new Error(`could not find env var ${envVarKeyName}.`);
  }
  return variableValue;
}

export function getEnvVarNumber(
  envVarKeyName: string,
  defaultValue?: number
): number {
  try {
    const variableValue = getEnvVar(envVarKeyName);
    return Number.parseFloat(variableValue);
  } catch (error) {
    return defaultValue ?? 0;
  }
}
