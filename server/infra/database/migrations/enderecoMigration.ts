import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class enderecoMigration implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "endereco",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "rua",
            type: "varchar",
          },
          {
            name: "vila",
            type: "varchar",
          },
          {
            name: "numero",
            type: "number",
          },
          {
            name: "cidade",
            type: "varchar",
          },
          {
            name: "estado",
            type: "varchar",
          },
          {
            name: "cep",
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
    await queryRunner.dropTable("endereco");
  }
}