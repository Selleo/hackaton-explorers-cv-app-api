import { Candidate } from "@app/candidate.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateReporsitory: Repository<Candidate>
  ) {}

  async create() {
    await this.candidateReporsitory
      .create({
        cityOfLiving: "test",
        age: "20",
        englishLevel: "C1",
        personalWebsite: "https://www.google.com",
        githubProfile: "https://github.com/Selleo",
        skills: ["skill1"],
        studies: ["study1"],
      })
      .save();
  }
}
