import dotEnv from 'dotenv'
dotEnv.config()
import { handler } from './handler'

handler({} as any, {} as any)