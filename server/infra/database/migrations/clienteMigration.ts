import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class clienteMigration implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cliente",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "login",
            type: "varchar",
          },
          {
            name: "senha",
            type: "varchar",
          },
          {
            name: "id_pessoa",
            type: "uuid",
          },
        ],
        foreignKeys: [
            {
              name: "FKPessoa",
              referencedTableName: "pessoa",
              referencedColumnNames: ["id"],
              columnNames: ["id_pessoa"],
              onDelete: "CASCADE",
              onUpdate: "CASCADE",
            },
          ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("cliente");
  }
}