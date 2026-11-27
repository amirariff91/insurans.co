// Reader-facing names for source documents and dates on the /tools/ pages.
const DOC_NAMES: Record<string, string> = {
  'https://www.jpj.gov.my/wp-content/uploads/2026/07/Lampiran-A-Garis_Panduan_Pengiraan_LKM_Bajet_20092-2.pdf': 'JPJ: Garis Panduan Pengiraan LKM (PDF)',
  'https://www.jpj.gov.my/panduan-pengiraan-kadar-lkm': 'JPJ: Panduan Kadar Lesen Kenderaan Motor (LKM)',
  'https://www.jpj.gov.my/pusat-media-3/informasi-perkhidmatan-jpj/kenderaan/panduan-pembaharuan-lesen-kenderaan-motor-lkm/': 'JPJ: Panduan Pembaharuan LKM',
  'https://www.jpj.gov.my/wp-content/uploads/2024/12/FAQ-Pembaharuan-eLKM-eLMM-Melalui-MyJPJ_kemaskini-02.01.2024.pdf': 'JPJ: Soalan lazim pembaharuan e-LKM di MyJPJ (PDF)',
  'https://www.berjayasompo.com.my/product/houseowner-householder': 'Berjaya Sompo: Houseowner/Householder',
  'https://www.takaful-malaysia.com.my/wp-content/uploads/2023/02/STMAB-PDSE-HOHH-V01-03-2023.pdf': 'Takaful Malaysia: PDS Houseowner/Householder (PDF)',
  'https://www.pacificinsurance.com.my/wp-content/uploads/2024/02/Houseowner-Householder_P-Form_CFH_V1.1_1-MAR-2024.pdf': 'Pacific Insurance: borang Houseowner/Householder (PDF)',
};

export function docName(url: string): string {
  if (DOC_NAMES[url]) return DOC_NAMES[url];
  const u = new URL(url);
  return u.hostname.replace(/^www\./, '') + (u.pathname.toLowerCase().endsWith('.pdf') ? ' (PDF)' : '');
}

// "2026-09-12" -> "12 Sep 2026", the same format as the byline.
export function readerDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}
