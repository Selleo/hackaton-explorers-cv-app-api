import { Todo } from '@app/todo.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  todos() {
    return Todo.find();
  }

  @Post()
  createTodo(@Body() body: { content: string; isCompleted?: boolean }) {
    console.log(body);
    return Todo.create({ content: body.content }).save();
  }

  @Patch(':todoId')
  async updateTodo(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() body: { content?: string; isCompleted?: boolean },
  ) {
    const todo = await Todo.findOneOrFail({ where: { id: todoId } });
    todo.content = body.content || todo.content;
    todo.isCompleted = body.isCompleted || todo.isCompleted;
    return todo.save();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const { filename, size, mimetype, originalname } = file;
    return { filename, size, mimetype, originalname };
  }
}
