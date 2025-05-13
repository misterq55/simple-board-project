// server/src/entities/Entity.ts
import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity as TypeORMBaseEntity,
  } from "typeorm";
  import { instanceToPlain } from "class-transformer";
  
  export default abstract class BaseEntity extends TypeORMBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  
    toJSON() {
      return instanceToPlain(this);
    }
  }
  