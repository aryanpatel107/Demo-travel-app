namespace TravelApp.Api.DTOs;

public record ColorPaletteDto(string Primary, string Secondary, string Neutral);

public record FontDto(string Family);

public record WebsiteInfoDto(
    string Id,
    string Name,
    string FullName,
    string Hostname,
    string LogoUrl,
    string FooterCopyright,
    string SiteType
);

public record ContactItemDto(int Type, string Name, string Value);

public record WebsiteContactDto(
    IEnumerable<ContactItemDto> Contact,
    IEnumerable<ContactItemDto> Email
);

public record CurrencyInfoDto(string Code, string Name, int DisplayOrder);

public record LanguageInfoDto(string Code, string Name, int DisplayOrder);

public record WebsiteConfigurationDto(
    int DecimalPlaces,
    CurrencyInfoDto Currency,
    LanguageInfoDto Language
);

public record WebsiteModuleDto(string ServiceCode, string ServiceName, int DisplayOrder);

// Note: Country/City are left null unless a geo-IP lookup service is
// added later — this app doesn't currently have one, so only the real
// request IP is populated.
public record GeoDto(string? Country, string? City, string Ip);

public record BrandConfigResultDto(
    WebsiteInfoDto Website,
    ColorPaletteDto Theme,
    FontDto Font,
    WebsiteContactDto WebsiteContact,
    WebsiteConfigurationDto WebsiteConfiguration,
    IEnumerable<LanguageInfoDto> WebsiteLanguage,
    IEnumerable<CurrencyInfoDto> WebsiteCurrency,
    IEnumerable<WebsiteModuleDto> WebsiteModules,
    GeoDto Geo
);

public record BrandConfigResponseDto(
    BrandConfigResultDto? Result,
    string? Error,
    bool IsSuccess
);