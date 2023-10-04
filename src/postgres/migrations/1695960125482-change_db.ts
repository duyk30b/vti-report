import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeDb1695960125482 implements MigrationInterface {
    name = 'ChangeDb1695960125482'

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`
            CREATE TABLE "warehouse_import" (
                "id" SERIAL NOT NULL,
                "warehouse_id" integer NOT NULL,
                "warehouse_name" character varying NOT NULL,
                "template_code" character varying NOT NULL,
                "template_name" character varying NOT NULL,
                "ticket_id" character varying NOT NULL,
                "ticket_code" character varying NOT NULL,
                "document_date" character varying NOT NULL,
                "description" character varying NOT NULL,
                "item_code" character varying NOT NULL,
                "item_name" character varying NOT NULL,
                "unit" character varying NOT NULL,
                "import_date" character varying NOT NULL,
                "lot" character varying,
                "manufacturing_date" character varying NOT NULL,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "amount" integer NOT NULL,
                CONSTRAINT "PK_2146ffe69ee6883a8a19859eb6e" PRIMARY KEY ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`
            DROP TABLE "warehouse_import"
        `)
    }
}
