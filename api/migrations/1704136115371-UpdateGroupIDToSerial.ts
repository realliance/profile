import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGroupIDToSerial1704136115371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group" ALTER COLUMN "id" TYPE SERIAL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "id" TYPE INT;`);
  }
}
