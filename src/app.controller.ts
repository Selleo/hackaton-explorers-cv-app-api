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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { AppService } from "./app.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Candidate } from "@app/candidate.entity";
import { Repository } from "typeorm";

@Controller("candidates")
export class AppController {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateReporsitory: Repository<Candidate>
  ) {}

  @Get()
  candidates() {
    return this.candidateReporsitory.find();
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const text = this.extractTextfrompdf(file.buffer);

    const cvData = this.promptGpt(text);
  }

  promptGpt(text: string) {
    // todo
  }

  extractTextfrompdf(buffer: Buffer): string {
    // todo

    return "";
  }
}
