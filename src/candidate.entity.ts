import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cityOfLiving: string;

  @Column()
  age: string;

  @Column()
  studies: string;

  @Column()
  englishLevel: string;

  @Column()
  githubProfile: string;

  @Column()
  skills: string;

  @Column()
  personalWebsite: string;
}
