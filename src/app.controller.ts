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
import { Configuration, OpenAIApi } from "openai";
import * as pdfjsLib from "pdfjs-dist";

@Controller("candidates")
export class AppController {
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor() {
    // private readonly candidateReporsitory: Repository<Candidate> // @InjectRepository(Candidate)
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY || "",
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  @Get()
  candidates() {
    // return this.candidateReporsitory.find();
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const text = await this.extractTextfrompdf(file.buffer);

    return this.promptGpt(text);
  }

  async promptGpt(text: string) {
    const chatCompletion = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `extract data from the cv text enclosed in <review> tag to JSON object with keys 'englishLevel' (string), 'cityOfLiving' (string), 'age' (number), 'studies' (array of strings), 'githubProfile' (string), 'skills' (array of strings), 'personalWebsite' (string). When null Don't add // comments.
          <review>${text}</review>`,
        },
      ],
    });

    return chatCompletion?.data.choices[0].message?.content;
  }

  async extractTextfrompdf(buffer: Buffer) {
    try {
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(buffer));
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      let text = "";

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        text += pageText + "\n";
      }

      return text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw error;
    }
  }
}
