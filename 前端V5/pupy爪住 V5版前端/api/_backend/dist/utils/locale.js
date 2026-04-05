export function resolveRequestLocale(req) {
    const acceptLanguage = req.headers['accept-language'];
    if (typeof acceptLanguage === 'string' && acceptLanguage.toLowerCase().startsWith('en')) {
        return 'en-US';
    }
    return 'zh-CN';
}
export function pickLocaleText(locale, zhCN, enUS) {
    return locale === 'en-US' ? enUS : zhCN;
}
//# sourceMappingURL=locale.js.map