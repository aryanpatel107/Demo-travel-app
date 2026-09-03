using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ============================================================
            // USERS
            // ============================================================

            // Remove old TEXT defaults before changing column types.
            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "UpdatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "UpdatedAt"
                TYPE timestamp with time zone
                USING "UpdatedAt"::timestamp with time zone;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "CreatedAt"
                TYPE timestamp with time zone
                USING "CreatedAt"::timestamp with time zone;
                """);

            // Restore PostgreSQL defaults.
            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "UpdatedAt"
                SET DEFAULT CURRENT_TIMESTAMP;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "CreatedAt"
                SET DEFAULT CURRENT_TIMESTAMP;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "BrandId",
                table: "Users",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");


            // ============================================================
            // TRIPS
            // ============================================================

            // Remove old TEXT defaults first.
            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "UpdatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "StartDate" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "EndDate" DROP DEFAULT;
                """);

            // Convert TEXT dates to PostgreSQL timestamps.
            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "UpdatedAt"
                TYPE timestamp with time zone
                USING "UpdatedAt"::timestamp with time zone;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "CreatedAt"
                TYPE timestamp with time zone
                USING "CreatedAt"::timestamp with time zone;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "StartDate"
                TYPE timestamp with time zone
                USING "StartDate"::timestamp with time zone;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "EndDate"
                TYPE timestamp with time zone
                USING "EndDate"::timestamp with time zone;
                """);

            // Restore sensible PostgreSQL defaults.
            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "UpdatedAt"
                SET DEFAULT CURRENT_TIMESTAMP;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "CreatedAt"
                SET DEFAULT CURRENT_TIMESTAMP;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Trips",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<int>(
                name: "Travelers",
                table: "Trips",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Trips",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Trips",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DestinationName",
                table: "Trips",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "DestinationId",
                table: "Trips",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "BrandId",
                table: "Trips",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Trips",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");


            // ============================================================
            // PAYMENTS
            // ============================================================

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "UpdatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "UpdatedAt"
                TYPE timestamp with time zone
                USING "UpdatedAt"::timestamp with time zone;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "CreatedAt"
                TYPE timestamp with time zone
                USING "CreatedAt"::timestamp with time zone;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "UpdatedAt"
                SET DEFAULT CURRENT_TIMESTAMP;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "CreatedAt"
                SET DEFAULT CURRENT_TIMESTAMP;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Payments",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "TripId",
                table: "Payments",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Payments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Provider",
                table: "Payments",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "Currency",
                table: "Payments",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "BrandId",
                table: "Payments",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<int>(
                name: "Amount",
                table: "Payments",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Payments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");


            // ============================================================
            // CONTACT MESSAGES
            // ============================================================

            migrationBuilder.Sql("""
                ALTER TABLE "ContactMessages"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "ContactMessages"
                ALTER COLUMN "CreatedAt"
                TYPE timestamp with time zone
                USING "CreatedAt"::timestamp with time zone;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "ContactMessages"
                ALTER COLUMN "CreatedAt"
                SET DEFAULT CURRENT_TIMESTAMP;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ContactMessages",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "ContactMessages",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "ContactMessages",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "ContactMessages",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");


            // ============================================================
            // BRANDS
            // ============================================================

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Brands",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Brands",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Brands",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 32);


            // ============================================================
            // BRAND SEED DATA
            // ============================================================

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "mytravel",
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[]
                {
                    new DateTime(
                        2026,
                        9,
                        1,
                        10,
                        48,
                        23,
                        433,
                        DateTimeKind.Utc
                    ).AddTicks(7456),
                    true
                });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "travelpro",
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[]
                {
                    new DateTime(
                        2026,
                        9,
                        1,
                        10,
                        48,
                        23,
                        433,
                        DateTimeKind.Utc
                    ).AddTicks(7450),
                    true
                });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "wanderly",
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[]
                {
                    new DateTime(
                        2026,
                        9,
                        1,
                        10,
                        48,
                        23,
                        433,
                        DateTimeKind.Utc
                    ).AddTicks(5572),
                    true
                });
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ============================================================
            // USERS
            // ============================================================

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "UpdatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "UpdatedAt"
                TYPE TEXT
                USING "UpdatedAt"::text;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ALTER COLUMN "CreatedAt"
                TYPE TEXT
                USING "CreatedAt"::text;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                type: "TEXT",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "TEXT",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "BrandId",
                table: "Users",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Users",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");


            // ============================================================
            // TRIPS
            // ============================================================

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "UpdatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "UpdatedAt"
                TYPE TEXT
                USING "UpdatedAt"::text;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "CreatedAt"
                TYPE TEXT
                USING "CreatedAt"::text;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "StartDate"
                TYPE TEXT
                USING "StartDate"::text;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Trips"
                ALTER COLUMN "EndDate"
                TYPE TEXT
                USING "EndDate"::text;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Trips",
                type: "TEXT",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<int>(
                name: "Travelers",
                table: "Trips",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Trips",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Trips",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DestinationName",
                table: "Trips",
                type: "TEXT",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "DestinationId",
                table: "Trips",
                type: "TEXT",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "BrandId",
                table: "Trips",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Trips",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");


            // ============================================================
            // PAYMENTS
            // ============================================================

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "UpdatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "UpdatedAt"
                TYPE TEXT
                USING "UpdatedAt"::text;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Payments"
                ALTER COLUMN "CreatedAt"
                TYPE TEXT
                USING "CreatedAt"::text;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Payments",
                type: "TEXT",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "TripId",
                table: "Payments",
                type: "TEXT",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Payments",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Provider",
                table: "Payments",
                type: "TEXT",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "Currency",
                table: "Payments",
                type: "TEXT",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(16)",
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "BrandId",
                table: "Payments",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<int>(
                name: "Amount",
                table: "Payments",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Payments",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");


            // ============================================================
            // CONTACT MESSAGES
            // ============================================================

            migrationBuilder.Sql("""
                ALTER TABLE "ContactMessages"
                ALTER COLUMN "CreatedAt" DROP DEFAULT;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "ContactMessages"
                ALTER COLUMN "CreatedAt"
                TYPE TEXT
                USING "CreatedAt"::text;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ContactMessages",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "ContactMessages",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "ContactMessages",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "ContactMessages",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");


            // ============================================================
            // BRANDS
            // ============================================================

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Brands",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Brands",
                type: "TEXT",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedAt",
                table: "Brands",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Brands",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "mytravel",
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[]
                {
                    "2026-09-01 10:48:23.4337456",
                    true
                });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "travelpro",
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[]
                {
                    "2026-09-01 10:48:23.433745",
                    true
                });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "wanderly",
                columns: new[] { "CreatedAt", "IsActive" },
                values: new object[]
                {
                    "2026-09-01 10:48:23.4335572",
                    true
                });
        }
    }
}