import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  cityOfLiving: string;

  @Column({ nullable: true })
  age: string;

  @Column("text", { array: true, nullable: true })
  studies: string[];

  @Column({ nullable: true })
  englishLevel: string;

  @Column({ nullable: true })
  githubProfile: string;

  @Column("text", { array: true, nullable: true })
  skills: string[];

  @Column({ nullable: true })
  personalWebsite: string;
}
