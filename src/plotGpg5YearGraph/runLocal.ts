import dotEnv from 'dotenv'
dotEnv.config()
import { handler } from './handler'

handler({ input: { data: { medianData: [{ x: 2017, y: 7 }, { x: 2021, y: 12 }], meanData: [{ x: 2017, y: 4 }, { x: 2021, y: 7 }] } } } as any, {} as any).then(console.log)