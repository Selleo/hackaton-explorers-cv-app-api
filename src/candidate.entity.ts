import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cityOfLiving: string;

  @Column()
  age: string;

  @Column("text", { array: true, nullable: true })
  studies: string[];

  @Column()
  englishLevel: string;

  @Column()
  githubProfile: string;

  @Column("text", { array: true, nullable: true })
  skills: string[];

  @Column()
  personalWebsite: string;
}
