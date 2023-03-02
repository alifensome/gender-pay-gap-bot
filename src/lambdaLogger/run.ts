import { LambdaLogger } from './index';
const logger = new LambdaLogger('test')

logger.logEvent({
    eventType: 'abc',
    message: 'some message'
})