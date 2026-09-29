using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExpandBrandConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrencyCode",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrencyName",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FontFamily",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FooterCopyright",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LanguageCode",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LanguageName",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrimaryColor",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SecondaryColor",
                table: "Brands",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "mytravel",
                columns: new[] { "ContactEmail", "ContactPhone", "CurrencyCode", "CurrencyName", "FontFamily", "FooterCopyright", "LanguageCode", "LanguageName", "LogoUrl", "PrimaryColor", "SecondaryColor" },
                values: new object[] { "hello@mytravel.com", "+1 555 010 0003", "USD", "US Dollar", "Inter", "© 2026 MyTravel. All Rights Reserved", "en", "English", "/logos/mytravel.svg", "#7c3aed", "#1f2937" });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "travelpro",
                columns: new[] { "ContactEmail", "ContactPhone", "CurrencyCode", "CurrencyName", "FontFamily", "FooterCopyright", "LanguageCode", "LanguageName", "LogoUrl", "PrimaryColor", "SecondaryColor" },
                values: new object[] { "support@travelpro.com", "+1 555 010 0002", "USD", "US Dollar", "Inter", "© 2026 TravelPro. All Rights Reserved", "en", "English", "/logos/travelpro.svg", "#0369a1", "#0f172a" });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "wanderly",
                columns: new[] { "ContactEmail", "ContactPhone", "CurrencyCode", "CurrencyName", "FontFamily", "FooterCopyright", "LanguageCode", "LanguageName", "LogoUrl", "PrimaryColor", "SecondaryColor" },
                values: new object[] { "hello@wanderly.com", "+1 555 010 0001", "USD", "US Dollar", "Fraunces", "© 2026 Wanderly. All Rights Reserved", "en", "English", "/logos/wanderly.svg", "#d96a3a", "#17221d" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "CurrencyCode",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "CurrencyName",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "FontFamily",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "FooterCopyright",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "LanguageCode",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "LanguageName",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "PrimaryColor",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "SecondaryColor",
                table: "Brands");
        }
    }
}
