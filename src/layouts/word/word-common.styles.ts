import { FONT_NAME, WORD_FILE_CONFIG } from '@utils/constant';
import {
  BorderStyle,
  convertInchesToTwip,
  HeightRule,
  Paragraph,
  WidthType,
} from 'docx';

export const wordFileStyle = {
  border_none: {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  },
  border_left_none: {
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  },
  border_right_none: {
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  },
  table_header_style: {
    bold: WORD_FILE_CONFIG.WORD_BOLD,
    font: FONT_NAME,
    size: WORD_FILE_CONFIG.WORD_FONT_SIZE_9,
  },
  table_header_bg_color: {
    fill: 'd6d6d6',
  },
  text_style: {
    font: FONT_NAME,
    size: WORD_FILE_CONFIG.WORD_FONT_SIZE_9,
  },
  text_style_bold: {
    font: FONT_NAME,
    size: WORD_FILE_CONFIG.WORD_FONT_SIZE_9,
    bold: WORD_FILE_CONFIG.WORD_BOLD,
  },
  company_info_style: {
    bold: WORD_FILE_CONFIG.WORD_BOLD,
    size: WORD_FILE_CONFIG.WORD_FONT_SIZE_10,
    font: FONT_NAME,
    allCaps: true,
  },
  margin_left: {
    left: convertInchesToTwip(WORD_FILE_CONFIG.MARGIN_LEFT),
  },
  margin_right: {
    right: convertInchesToTwip(WORD_FILE_CONFIG.MARGIN_RIGHT),
  },
  //common paragraph
  paragraph: {
    children: [
      new Paragraph({
        children: [],
      }),
    ],
  },
  // set layout page landscape
  pagesize_a4: {
    width: convertInchesToTwip(WORD_FILE_CONFIG.PAGE_SIZE_A4_WIDTH),
    height: convertInchesToTwip(WORD_FILE_CONFIG.PAGE_SIZE_A4_HEIGHT),
  },
  pagesize_a3: {
    width: convertInchesToTwip(WORD_FILE_CONFIG.PAGE_SIZE_A3_WIDTH),
    height: convertInchesToTwip(WORD_FILE_CONFIG.PAGE_SIZE_A3_HEIGHT),
  },
};

export function setWidth(inch: number) {
  return {
    size: convertInchesToTwip(inch),
    type: WidthType.DXA,
  };
}

export function setHeight(twip: number) {
  return {
    value: twip,
    rule: HeightRule.ATLEAST,
  };
}
