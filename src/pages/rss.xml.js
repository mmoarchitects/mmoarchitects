import projectsData from '../data/projects.json';

const SITE_URL = 'https://mmoarchitects.com';

// Helper to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to build full asset URL with proper encoding
function getFullImageUrl(projId, fileName) {
  if (!fileName) return `${SITE_URL}/assets/og-default.png`;
  const normalized = fileName.normalize('NFC');
  if (normalized.startsWith('http')) return normalized;
  
  const cleanName = normalized.startsWith('/') ? normalized : `/assets/projects/${projId}/${normalized}`;
  // Split path components and encode each segment to maintain valid URI syntax in RSS
  const encodedPath = cleanName
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
  
  return `${SITE_URL}${encodedPath}?v=2`;
}

// Helper to get image MIME type
function getImageMime(fileName) {
  if (!fileName) return 'image/jpeg';
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

export async function GET() {
  const itemsXml = projectsData.map((project, idx) => {
    const projId = project.id;
    const projectUrl = `${SITE_URL}/projects/${projId}`;
    
    // 1. Photo Credit
    const photoCredit = project.spec?.['사진'] || project.사진 || project.photo || '';
    const hasPhotoCredit = Boolean(photoCredit && photoCredit.trim() !== '' && photoCredit.trim() !== '-');
    const photoCreditText = hasPhotoCredit ? `사진: ${photoCredit}` : '';

    // 2. ADO attribution notice (p-001 ~ p-010)
    const isAdoProject = /^p-0(0[1-9]|10)$/.test(projId);
    const adoNotice = isAdoProject
      ? 'ADO 재직 시 수행한 작업을 바탕으로, MMO Architects 포트폴리오에 맞게 재구성했습니다.'
      : '';

    // 3. Representative Image for Pinterest Pin
    const firstPhoto = (project.gallery || []).find(img => !img.toLowerCase().includes('drawing') && !img.toLowerCase().includes('blueprint')) || project.gallery?.[0] || '';
    const imageUrl = getFullImageUrl(projId, firstPhoto);
    const imageMime = getImageMime(firstPhoto);

    // 4. Construct Pinterest Pin Description
    const specLines = [];
    if (project.spec?.['용도']) specLines.push(`• 용도: ${project.spec['용도']}`);
    if (project.spec?.['위치']) specLines.push(`• 위치: ${project.spec['위치']}`);
    if (project.spec?.['구분']) specLines.push(`• 구분: ${project.spec['구분']}`);
    if (project.spec?.['규모']) specLines.push(`• 규모: ${project.spec['규모']}`);
    if (photoCreditText) specLines.push(`• ${photoCreditText}`);

    const descParts = [];
    if (project.maintext) {
      // First 2-3 sentences of project story
      const summaryText = project.maintext.split('\n\n')[0].replace(/\n/g, ' ').trim();
      descParts.push(summaryText);
    }
    
    if (specLines.length > 0) {
      descParts.push(`\n[건축 개요]\n${specLines.join('\n')}`);
    }

    if (adoNotice) {
      descParts.push(`\n* ${adoNotice}`);
    }

    const fullDescription = descParts.join('\n\n');

    // 5. PubDate (Format to standard RFC 822)
    // Projects have years (e.g. 2021). We assign deterministic dates based on year and index.
    const year = parseInt(project.year, 10) || 2024;
    const month = ((idx % 12) + 1).toString().padStart(2, '0');
    const dateObj = new Date(`${year}-${month}-01T09:00:00+09:00`);
    const pubDate = dateObj.toUTCString();

    const title = `${project.title} — MMO ARCHITECTS`;

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(projectUrl)}</link>
      <guid isPermaLink="true">${escapeXml(projectUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${fullDescription}]]></description>
      <enclosure url="${escapeXml(imageUrl)}" length="0" type="${imageMime}" />
      <media:content url="${escapeXml(imageUrl)}" medium="image" type="${imageMime}">
        <media:title>${escapeXml(project.title)}</media:title>
        <media:description>${escapeXml(fullDescription)}</media:description>
        ${hasPhotoCredit ? `<media:credit role="photographer">${escapeXml(photoCredit)}</media:credit>` : ''}
        ${hasPhotoCredit ? `<media:copyright>© ${escapeXml(photoCredit)} / MMO ARCHITECTS</media:copyright>` : `<media:copyright>© MMO ARCHITECTS</media:copyright>`}
      </media:content>
    </item>`;
  }).join('\n');

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MMO ARCHITECTS</title>
    <link>${SITE_URL}</link>
    <description>MMO ARCHITECTS — 건축 설계, 대수선, 리모델링, 공간 기획 및 부동산 밸류업 솔루션 아카이브</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/assets/logo.png</url>
      <title>MMO ARCHITECTS</title>
      <link>${SITE_URL}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
