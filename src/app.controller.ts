import {
  BadRequestException,
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

import { CandidateService } from "./app.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Candidate } from "@app/candidate.entity";
import { Repository } from "typeorm";
import { Configuration, OpenAIApi } from "openai";
import { PDFExtract } from "pdf.js-extract";

const dupa = `{
  "englishLevel": "Advanced, C1",
  "cityOfLiving": "Poland",
  "age": null,
  "studies": [
  "Bachelor of Engineering in Computer Science",
  "Specialization: Software Engineering",
  "June 2019 - Present",
  "Enchanted Meadows High School",
  "Specialty: Computer Technician, IT",
  "2016 - 2019 — 3 years"
  ],
  "githubProfile": "https://github.com/TheMultii",
  "skills": [
  "C# (.NET)",
  "ASP.NET",
  "Entity Framework Core",
  "Python",
  "React",
  "Angular",
  "Vue.js",
  "HTML",
  "CSS/SCSS",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Laravel",
  "React Native (Expo, Bare)",
  "C++",
  "Ruby",
  "Ruby on Rails",
  "Flutter",
  "Dart",
  "Java",
  "MySQL",
  "SQLite",
  "MS SQL",
  "MongoDB",
  "GIT"
  ],
  "personalWebsite": null
  }`;

@Controller("candidates")
export class AppController {
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor(
    @InjectRepository(Candidate)
    private readonly candidateReporsitory: Repository<Candidate>
  ) {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY || "",
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  @Get()
  candidates() {
    return this.candidateReporsitory.find();
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

    if (!chatCompletion?.data.choices[0].message?.content)
      throw new BadRequestException("coś się stało");

    return JSON.parse(chatCompletion?.data.choices[0].message?.content);
  }

  async extractTextfrompdf(buffer: Buffer) {
    try {
      const pdfExtract = new PDFExtract();

      const data = await pdfExtract.extractBuffer(buffer);

      let text = "";

      for (const page of data.pages) {
        const pageText = page.content.map((item) => item.str).join(" ");

        text += pageText + "\n";
      }
      return text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw error;
    }
  }
}
