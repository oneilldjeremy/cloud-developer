import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Caller event', event)
    
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const results =  await deleteTodo(todoId, userId)

    console.log('Deleted item: ', todoId)

    if (results) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: 'todoId'
      }
    }
   
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
