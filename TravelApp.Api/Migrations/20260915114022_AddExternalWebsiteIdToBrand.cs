using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExternalWebsiteIdToBrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExternalWebsiteId",
                table: "Brands",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "mytravel",
                column: "ExternalWebsiteId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "travelpro",
                column: "ExternalWebsiteId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "wanderly",
                column: "ExternalWebsiteId",
                value: null);

            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "Id", "ContactEmail", "ContactPhone", "CreatedAt", "CurrencyCode", "CurrencyName", "ExternalWebsiteId", "FontFamily", "FooterCopyright", "Hostname", "IsActive", "LanguageCode", "LanguageName", "LogoUrl", "Name", "PrimaryColor", "SecondaryColor", "Slug" },
                values: new object[] { "techno-b2b", "", "", new DateTime(2026, 9, 15, 0, 0, 0, 0, DateTimeKind.Utc), "USD", "American Dollar", 2, "GT Eesti Pro Display", "Copyright 2026.\nAll Rights Reserved.", "stagingb2b.technoheaven.com", true, "en", "English", "", "Techno B2B", "#00aacf", "#00aacf", "techno-b2b" });

            migrationBuilder.CreateIndex(
                name: "IX_Brands_ExternalWebsiteId",
                table: "Brands",
                column: "ExternalWebsiteId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Brands_ExternalWebsiteId",
                table: "Brands");

            migrationBuilder.DeleteData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "techno-b2b");

            migrationBuilder.DropColumn(
                name: "ExternalWebsiteId",
                table: "Brands");
        }
    }
}
