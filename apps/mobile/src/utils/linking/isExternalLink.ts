export function isExternalLink(link: string) {
  return (
    !link.includes('https://connect.mysuni.com') &&
    !link.includes('https://stg.connect.mysuni.com')
  );
}
