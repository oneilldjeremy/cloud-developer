import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async getAllTodos(): Promise<TodoItem[]> {
      console.log('Getting all todos')

  
      const result = await this.docClient.scan({
        TableName: this.todosTable
      }).promise()
  
      const items = result.Items

      console.log('Returned items: ', items)
      
      return items as TodoItem[]
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
      console.log('Getting all todos for user ', userId)
  
      const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()

      console.log('Returned item: ', result)
  
      const items = result.Items
      return items as TodoItem[]
    }
  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
      console.log('Creating a new todo')

      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()

      console.log('Created item: ', todo)
  
      return todo
    }

    async deleteTodo(todoId: string, userId: string): Promise<string> {
      console.log('Deleting todo item ', todoId)

      const key = {
        userId: userId,
        todoId: todoId
      }

      await this.docClient.delete({
        TableName: this.todosTable,
        Key: key,
      }).promise()

      console.log('Deleted todo item ', todoId)
  
      return todoId
    }

    async updateTodo(todo: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        console.log(`Updating a todo with id ${todoId} and userid ${userId}`);

        await this.docClient.update({
          TableName: this.todosTable,
          Key: {
            userId: userId,
            todoId: todoId
          },
          ExpressionAttributeNames: { "#N": "name" },
          UpdateExpression: 'SET #N=:todoName, dueDate = :dueDate, done = :done',
          ExpressionAttributeValues: {
            ':todoName': todo.name,
            ':dueDate': todo.dueDate,
            ':done': todo.done,
          },
          ReturnValues:"UPDATED_NEW" 
        }).promise()

        console.log(`Updated a todo with id ${todoId} and userid ${userId}`);
    
        return todo
      }
}
  
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}