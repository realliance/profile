import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPronounsToUser1704491030749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "pronouns" VARCHAR;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pronouns";`);
  }
}
