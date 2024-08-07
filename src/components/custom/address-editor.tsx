import {
  defaultLocale,
  IntlText,
  SupportedLocale,
} from '@/components/custom/intl-input-filed.tsx'
import { HierarchicalComboBoxes } from '@/components/custom/hierarchical-combo-boxes.tsx'
import { useMemo } from 'react'

interface Address {
  country: string
  province: string
  county: string
  municipality: string
  borough?: string
  district?: string
  village?: string
  street?: string
  block?: string
  houseNumber?: string
}

const defaultAddress = {
  country: 'ethiopia',
  province: 'addis_ababa',
  county: 'addis_ababa',
  municipality: 'addis_ababa',
  borough: 'addis_ketema',
  district: 'woreda_1',
}

const addressLevel: Record<number, keyof Address> = {
  0: 'country',
  1: 'province',
  2: 'county',
  3: 'municipality',
  4: 'borough',
  5: 'district',
  6: 'village',
  7: 'street',
  8: 'block',
  9: 'houseNumber',
}

const addressLevelPlural: Record<number, string> = {
  0: 'countries',
  1: 'provinces',
  2: 'counties',
  3: 'municipalities',
  4: 'boroughs',
  5: 'districts',
  6: 'villages',
  7: 'streets',
  8: 'blocks',
  9: 'houseNumbers',
}

const addressLevelRev: Record<keyof Address, number> = {
  country: 0,
  province: 1,
  county: 2,
  municipality: 3,
  borough: 4,
  district: 5,
  village: 6,
  street: 7,
  block: 8,
  houseNumber: 9,
}

const addressLevelPluralRev: Record<string, number> = {
  countries: 0,
  provinces: 1,
  counties: 2,
  municipalities: 3,
  boroughs: 4,
  districts: 5,
  villages: 6,
  streets: 7,
  blocks: 8,
  houseNumbers: 9,
}

const addressLevelRevList = Object.values(addressLevelRev)

const addressList = {
  countries: {
    terra_prime: {
      ethiopia: {
        id: 'ethiopia',
        label: {
          [SupportedLocale.EN_US]: 'Ethiopia',
          [SupportedLocale.AM]: 'ኢትዮጵያ',
        },
      },
    },
  },
  provinces: {
    'terra_prime:ethiopia': {
      addis_ababa: {
        id: 'addis_ababa',
        label: {
          [SupportedLocale.EN_US]: 'Addis Ababa',
          [SupportedLocale.AM]: 'አዲስ አበባ',
        },
      },
      oromia: {
        id: 'oromia',
        label: {
          [SupportedLocale.EN_US]: 'Oromia',
          [SupportedLocale.AM]: 'ኦሮሚያ',
        },
      },
    },
  },
  counties: {
    'terra_prime:ethiopia:addis_ababa': {
      addis_ababa: {
        id: 'addis_ababa',
        label: {
          [SupportedLocale.EN_US]: 'Addis Ababa',
          [SupportedLocale.AM]: 'አዲስ አበባ',
        },
      },
    },
    'terra_prime:ethiopia:oromia': {
      oromia_special: {
        id: 'oromia_special',
        label: {
          [SupportedLocale.EN_US]: 'Oromia Special',
          [SupportedLocale.AM]: 'ኦሮሚያ ልዩ',
        },
      },
    },
  },
  municipalities: {
    'terra_prime:ethiopia:addis_ababa:addis_ababa': {
      addis_ababa: {
        id: 'addis_ababa',
        label: {
          [SupportedLocale.EN_US]: 'Addis Ababa',
          [SupportedLocale.AM]: 'አዲስ አበባ',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special': {
      sheger: {
        id: 'sheger',
        label: {
          [SupportedLocale.EN_US]: 'Sheger',
          [SupportedLocale.AM]: 'ሸገር',
        },
      },
    },
  },
  boroughs: {
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa': {
      addis_ketema: {
        id: 'addis_ketema',
        label: {
          [SupportedLocale.EN_US]: 'Addis Ketema',
          [SupportedLocale.AM]: 'አዲስ ከተማ',
        },
      },
      akaki_kaliti: {
        id: 'akaki_kaliti',
        label: {
          [SupportedLocale.EN_US]: 'Akaki Kaliti',
          [SupportedLocale.AM]: 'አቃቂ ቃሊቲ',
        },
      },
      arada: {
        id: 'arada',
        label: {
          [SupportedLocale.EN_US]: 'Arada',
          [SupportedLocale.AM]: 'አራዳ',
        },
      },
      bole: {
        id: 'bole',
        label: { [SupportedLocale.EN_US]: 'Bole', [SupportedLocale.AM]: 'ቦሌ' },
      },
      gulele: {
        id: 'gulele',
        label: {
          [SupportedLocale.EN_US]: 'Gulele',
          [SupportedLocale.AM]: 'ጉለሌ',
        },
      },
      kirkos: {
        id: 'kirkos',
        label: {
          [SupportedLocale.EN_US]: 'Kirkos',
          [SupportedLocale.AM]: 'ቂርቆስ',
        },
      },
      kolfe: {
        id: 'kolfe',
        label: {
          [SupportedLocale.EN_US]: 'Kolfe',
          [SupportedLocale.AM]: 'ኮልፌ',
        },
      },
      lemi_kura: {
        id: 'lemi_kura',
        label: {
          [SupportedLocale.EN_US]: 'Lemi Kura',
          [SupportedLocale.AM]: 'ለሚ ኩራ',
        },
      },
      lideta: {
        id: 'lideta',
        label: {
          [SupportedLocale.EN_US]: 'Lideta',
          [SupportedLocale.AM]: 'ልደታ',
        },
      },
      nefas_silk_lafto: {
        id: 'nefas_silk_lafto',
        label: {
          [SupportedLocale.EN_US]: 'Nefas Silk Lafto',
          [SupportedLocale.AM]: 'ነፋስ ስልክ ላፍቶ',
        },
      },
      yeka: {
        id: 'yeka',
        label: { [SupportedLocale.EN_US]: 'Yeka', [SupportedLocale.AM]: 'የካ' },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger': {
      sub_city_1: {
        id: 'sub_city_1',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 1',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 1',
        },
      },
      sub_city_2: {
        id: 'sub_city_2',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 2',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 2',
        },
      },
      sub_city_3: {
        id: 'sub_city_3',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 3',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 3',
        },
      },
      sub_city_4: {
        id: 'sub_city_4',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 4',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 4',
        },
      },
      sub_city_5: {
        id: 'sub_city_5',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 5',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 5',
        },
      },
      sub_city_6: {
        id: 'sub_city_6',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 6',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 6',
        },
      },
      sub_city_7: {
        id: 'sub_city_7',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 7',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 7',
        },
      },
      sub_city_8: {
        id: 'sub_city_8',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 8',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 8',
        },
      },
      sub_city_9: {
        id: 'sub_city_9',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 9',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 9',
        },
      },
      sub_city_10: {
        id: 'sub_city_10',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 10',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 10',
        },
      },
      sub_city_11: {
        id: 'sub_city_11',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 11',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 11',
        },
      },
      sub_city_12: {
        id: 'sub_city_12',
        label: {
          [SupportedLocale.EN_US]: 'Sub City 12',
          [SupportedLocale.AM]: 'ክፍለ ከተማ 12',
        },
      },
    },
  },
  districts: {
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:addis_ketema': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:akaki_kaliti': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:arada': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:bole': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:gulele': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:kirkos': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:kolfe': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:lemi_kura': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:lideta': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
    },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:nefas_silk_lafto':
      {
        woreda_1: {
          id: 'woreda_1',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 1',
            [SupportedLocale.AM]: 'ወረዳ 1',
          },
        },
        woreda_2: {
          id: 'woreda_2',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 2',
            [SupportedLocale.AM]: 'ወረዳ 2',
          },
        },
        woreda_3: {
          id: 'woreda_3',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 3',
            [SupportedLocale.AM]: 'ወረዳ 3',
          },
        },
        woreda_4: {
          id: 'woreda_4',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 4',
            [SupportedLocale.AM]: 'ወረዳ 4',
          },
        },
        woreda_5: {
          id: 'woreda_5',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 5',
            [SupportedLocale.AM]: 'ወረዳ 5',
          },
        },
        woreda_6: {
          id: 'woreda_6',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 6',
            [SupportedLocale.AM]: 'ወረዳ 6',
          },
        },
        woreda_7: {
          id: 'woreda_7',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 7',
            [SupportedLocale.AM]: 'ወረዳ 7',
          },
        },
        woreda_8: {
          id: 'woreda_8',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 8',
            [SupportedLocale.AM]: 'ወረዳ 8',
          },
        },
        woreda_9: {
          id: 'woreda_9',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 9',
            [SupportedLocale.AM]: 'ወረዳ 9',
          },
        },
        woreda_10: {
          id: 'woreda_10',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 10',
            [SupportedLocale.AM]: 'ወረዳ 10',
          },
        },
        woreda_11: {
          id: 'woreda_11',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 11',
            [SupportedLocale.AM]: 'ወረዳ 11',
          },
        },
        woreda_12: {
          id: 'woreda_12',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 12',
            [SupportedLocale.AM]: 'ወረዳ 12',
          },
        },
        woreda_13: {
          id: 'woreda_13',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 13',
            [SupportedLocale.AM]: 'ወረዳ 13',
          },
        },
        woreda_14: {
          id: 'woreda_14',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 14',
            [SupportedLocale.AM]: 'ወረዳ 14',
          },
        },
        woreda_15: {
          id: 'woreda_15',
          label: {
            [SupportedLocale.EN_US]: 'Woreda 15',
            [SupportedLocale.AM]: 'ወረዳ 15',
          },
        },
      },
    'terra_prime:ethiopia:addis_ababa:addis_ababa:addis_ababa:yeka': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_1': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_2': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_3': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_4': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_5': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_6': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_7': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_8': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_9': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_10': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_11': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
    'terra_prime:ethiopia:oromia:oromia_special:sheger:sub_city_12': {
      woreda_1: {
        id: 'woreda_1',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 1',
          [SupportedLocale.AM]: 'ወረዳ 1',
        },
      },
      woreda_2: {
        id: 'woreda_2',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 2',
          [SupportedLocale.AM]: 'ወረዳ 2',
        },
      },
      woreda_3: {
        id: 'woreda_3',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 3',
          [SupportedLocale.AM]: 'ወረዳ 3',
        },
      },
      woreda_4: {
        id: 'woreda_4',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 4',
          [SupportedLocale.AM]: 'ወረዳ 4',
        },
      },
      woreda_5: {
        id: 'woreda_5',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 5',
          [SupportedLocale.AM]: 'ወረዳ 5',
        },
      },
      woreda_6: {
        id: 'woreda_6',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 6',
          [SupportedLocale.AM]: 'ወረዳ 6',
        },
      },
      woreda_7: {
        id: 'woreda_7',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 7',
          [SupportedLocale.AM]: 'ወረዳ 7',
        },
      },
      woreda_8: {
        id: 'woreda_8',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 8',
          [SupportedLocale.AM]: 'ወረዳ 8',
        },
      },
      woreda_9: {
        id: 'woreda_9',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 9',
          [SupportedLocale.AM]: 'ወረዳ 9',
        },
      },
      woreda_10: {
        id: 'woreda_10',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 10',
          [SupportedLocale.AM]: 'ወረዳ 10',
        },
      },
      woreda_11: {
        id: 'woreda_11',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 11',
          [SupportedLocale.AM]: 'ወረዳ 11',
        },
      },
      woreda_12: {
        id: 'woreda_12',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 12',
          [SupportedLocale.AM]: 'ወረዳ 12',
        },
      },
      woreda_13: {
        id: 'woreda_13',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 13',
          [SupportedLocale.AM]: 'ወረዳ 13',
        },
      },
      woreda_14: {
        id: 'woreda_14',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 14',
          [SupportedLocale.AM]: 'ወረዳ 14',
        },
      },
      woreda_15: {
        id: 'woreda_15',
        label: {
          [SupportedLocale.EN_US]: 'Woreda 15',
          [SupportedLocale.AM]: 'ወረዳ 15',
        },
      },
    },
  },
}

function getAddressEnclosureId(address: Address, level: number) {
  let returnable = 'terra_prime'

  for (const _level in addressLevel) {
    const l = Number(_level)

    if (level <= l) break

    returnable = `${returnable}${level > l + 2 || address[addressLevel[l]] ? ':' : ''}${address[addressLevel[l]] ?? ''}`
  }

  return returnable
}

function revertToDefaultBelowAddressLevel(
  address: Address,
  level: number
): Address {
  let returnable = { ...address }

  for (let i = level + 1; i <= 5; i++) {
    returnable[addressLevel[i]] =
      Object.values(
        addressList[addressLevelPlural[i]][
          getAddressEnclosureId(returnable, i)
        ] ?? {}
      )[0]?.id ?? undefined
  }

  return returnable
}

function getHierarchicalAddress(address: Address) {
  return addressLevelRevList
    .map((v) => ({
      level: v,
      value: address[addressLevel[v]],
    }))
    .filter((v) => v.value)
}

const defaultHierarchicalAddress = getHierarchicalAddress(defaultAddress)

function getHierarchicalAddressList(address: Address) {
  return addressLevelRevList
    .map((v) => ({
      level: v,
      list: Object.values(
        addressList?.[addressLevelPlural[v]]?.[
          getAddressEnclosureId(address, v)
        ] ?? {}
      ).map((v) => ({ value: v.id, label: v.label })),
    }))
    .filter((v) => v.list?.length)
}

const defaultHierarchicalAddressList =
  getHierarchicalAddressList(defaultAddress)

const hierarchicalAddressList = addressLevelRevList
  .map((v) => ({
    level: v,
    enclosure: Object.fromEntries(
      Object.entries(addressList[addressLevelPlural[v]] ?? {}).map((entry) => [
        entry[0],
        Object.fromEntries(
          Object.entries(
            entry[1] as Record<string, { id: string; label: IntlText }>
          ).map((v) => [v[0], { value: v[1].id, label: v[1].label }])
        ),
      ])
    ),
  }))
  .filter((v) => Object.keys(v.enclosure).length)

interface AddressEditorProps {
  locale: SupportedLocale
  value: Address
  onChange: (value: Address) => void
  containerClasses?: string
}

const AddressEditor = function AddressEditor({
  locale = defaultLocale,
  value = defaultAddress,
  onChange,
  containerClasses = '',
}: AddressEditorProps) {
  const hierarchicalAddress = useMemo(
    () => getHierarchicalAddress(value),
    [value]
  )

  return (
    <HierarchicalComboBoxes
      locale={locale}
      optionsHierarchy={hierarchicalAddressList}
      messages={hierarchicalAddress.map((v) => ({
        level: v.level,
        value: {
          emptyMessage: `No ${addressLevelPlural[v.level]} found.`,
          defaultMessage: `Select ${addressLevel[v.level]}...`,
          placeholder: `Search ${addressLevelPlural[v.level]}...`,
        },
      }))}
      values={hierarchicalAddress}
      onChange={(change) => {
        onChange(
          revertToDefaultBelowAddressLevel(
            { ...value, [addressLevel[change.level]]: change.value },
            change.level
          )
        )
      }}
      enclosureIdExtractor={(level) => getAddressEnclosureId(value, level)}
      containerClasses={`flex flex-col gap-2 ${containerClasses}`}
    />
  )
}

AddressEditor.displayName = 'AddressEditor'

export {
  Address,
  defaultAddress,
  addressLevel,
  addressLevelRev,
  addressLevelPlural,
  addressLevelPluralRev,
  addressLevelRevList,
  addressList,
  getAddressEnclosureId,
  revertToDefaultBelowAddressLevel,
  getHierarchicalAddress,
  defaultHierarchicalAddress,
  getHierarchicalAddressList,
  defaultHierarchicalAddressList,
  AddressEditorProps,
  AddressEditor,
}
