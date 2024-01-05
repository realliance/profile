import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGroup1703100640956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'group',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            default: 'uuid_generate_v4()',
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_groups_group',
        columns: [
          {
            name: 'userId',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'groupId',
            type: 'varchar',
            isPrimary: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('group');
    await queryRunner.dropTable('user_groups_group');
  }
}
