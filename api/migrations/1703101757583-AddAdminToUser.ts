import { MigrationInterface, QueryRunner } from "typeorm"

export class AddAdminToUser1703101757583 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "admin" BOOLEAN;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "admin";`);
  }

}
