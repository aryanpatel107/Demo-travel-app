using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBrandHostname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Hostname",
                table: "Brands",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "mytravel",
                column: "Hostname",
                value: "mytravel.yourdomain.com");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "travelpro",
                column: "Hostname",
                value: "travelpro.yourdomain.com");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: "wanderly",
                column: "Hostname",
                value: "wanderly.yourdomain.com");

            migrationBuilder.CreateIndex(
                name: "IX_Brands_Hostname",
                table: "Brands",
                column: "Hostname",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Brands_Hostname",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "Hostname",
                table: "Brands");
        }
    }
}
