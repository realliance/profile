import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiscordToConnection1717475269376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "connection" ADD COLUMN "discordId" VARCHAR;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "discordId";`);
  }
}
