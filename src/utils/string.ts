export function extractDomainFromUrl(url: string): string {
  return (
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?(?<domain>[^:/\n?]+)/gim.exec(url)
      ?.groups?.domain ?? ''
  );
}
