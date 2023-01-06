import { TableColumn } from '@models/report.model';
import { FONT_NAME, WORD_FILE_CONFIG } from '@utils/constant';
import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  HeightRule,
  Paragraph,
  TableCell,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { I18nRequestScopeService } from 'nestjs-i18n';

export const wordFileStyle = {
  border_none: {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  },
  border_left_right_none: {
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
    size: WORD_FILE_CONFIG.WORD_FONT_SIZE_12,
  },
  table_header_style_w002: {
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
    // allCaps: true,
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

// function for situation_inventory_period report
export function renderChildrenRows(
  cols: TableColumn[],
  i18n?: I18nRequestScopeService,
): TableCell[] {
  let newArr = [];
  cols.forEach((child) => {
    if (
      child.hasOwnProperty('child') &&
      child.child instanceof Array &&
      child.child.length > 0
    ) {
      const arrGrandsonCells = renderChildrenRows(child.child, i18n);
      for (const iterator of arrGrandsonCells) {
        newArr.push(iterator);
      }
    } else if (child.hasOwnProperty('name')) {
      newArr.push(
        new TableCell({
          verticalAlign: VerticalAlign.BOTTOM,
          shading: wordFileStyle.table_header_bg_color,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: i18n.translate(`report.${child.name ?? ''}`),
                  ...wordFileStyle.table_header_style,
                }),
              ],
            }),
          ],
        }),
      );
    }
  });
  return newArr.flat();
}
