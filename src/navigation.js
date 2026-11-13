// Category entry URLs are aliases, not separate content pages.
// Keep this shared by the public menu, redirects, sitemap and admin editor.
export const SECTION_ALIASES = Object.freeze({
  '/Home': '/ceo',
  '/business': '/mainbusiness',
  '/cooperate': '/local',
  '/community': '/notice',
  '/memberndonation': '/membership',
});
export const isSectionAlias = path => Object.prototype.hasOwnProperty.call(SECTION_ALIASES, path);
export const canonicalPath = path => SECTION_ALIASES[path] || path;
export const activePageWhere = "path NOT IN ('/Home','/business','/cooperate','/community','/memberndonation')";
