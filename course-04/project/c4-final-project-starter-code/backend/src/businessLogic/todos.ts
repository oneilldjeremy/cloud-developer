import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const todosAccess = new TodosAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
    return todosAccess.getAllTodos()
  }

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodosForUser(userId)
  }
  
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

    const itemId = uuid.v4()

    return await todosAccess.createTodo({
      todoId: itemId,
      userId: userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      createdAt: new Date().toISOString(),
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    })
  }

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<string> {

    return await todosAccess.deleteTodo(todoId, userId)
  }

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  itemId: string,
  userId: string
): Promise<TodoUpdate> {
  
    return await todosAccess.updateTodo({
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    },
      itemId, 
      userId)
}
