import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserID1702967173044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user ALTER COLUMN id TYPE VARCHAR;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user ALTER COLUMN id TYPE INT;`);
  }
}
