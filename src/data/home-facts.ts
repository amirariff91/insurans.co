/**
 * Facts that a hub page's answer box and the homepage "jenis insurans" tile both show. Each fact keeps its value,
 * unit and qualification together, so the hub and the tile build their wording from the same parts and cannot
 * disagree. Edit a fact here, never in the hub or the tile alone.
 */
import homeInsurance from './home-insurance.json';

export const homeFacts = {
  /** /motorcycle-insurance/ answer-box finding. */
  motorcycle: { roadtax: 'Roadtax JPJ ikut cc dan wilayah' },
  /** /life-insurance/ answer-box row "Pelepasan cukai". */
  lifeTaxRelief: {
    value: 'RM3,000',
    assessmentYear: 'tahun taksiran 2025',
    shared: 'dikongsi dengan caruman sukarela tambahan KWSP',
  },
  /** /takaful/ comparison table and prose. */
  takaful: { price: 'Harga boleh lebih rendah, sama atau lebih tinggi' },
  /** /home-insurance/ answer-box lead. */
  home: {
    value: `${homeInsurance.tariff.ho_landed_1A.toFixed(3)}%`,
    cover: 'houseowner',
    tileCover: 'Houseowner bangunan',
    construction: '1A landed',
    basis: 'setahun daripada jumlah diinsuranskan',
  },
  /** /bantuan-insurans/perkeso/ answer-box lead. */
  perkeso: { value: 'RM13.10', plan: 'SPS Pelan 1', unit: 'sebulan', annual: 'RM157.20 setahun' },
  /** /i-lindung/ answer-box lead. */
  iLindung: { value: 'RM12', unit: 'setahun', qualification: 'untuk produk tertentu' },
  /** /bantuan-insurans/mysalam/ answer-box row "Kos". */
  mysalam: { cost: 'Percuma untuk penerima yang layak' },
} as const;
