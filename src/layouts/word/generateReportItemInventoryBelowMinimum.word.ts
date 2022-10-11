import {
  FONT_NAME,
  REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG,
  WORD_FILE_CONFIG,
} from '@utils/constant';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  TableCell,
  TableRow,
  Table,
  WidthType,
  AlignmentType,
  PageOrientation,
  HeightRule,
  VerticalAlign,
  convertInchesToTwip,
} from 'docx';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { setHeight, setWidth, wordFileStyle } from './word-common.styles';

export async function generateReportItemInventoryBelowMinimum(
  dataWord,
  companyName,
  companyAddress,
  title,
  reportTime,
): Promise<string> {
  let i18n: I18nRequestScopeService;
  let itemData = [];

  // company info table
  const company_info = new Table({
    columnWidths: [convertInchesToTwip(WORD_FILE_CONFIG.COLUMN_COMPANY_WIDTH)],
    width: setWidth(WORD_FILE_CONFIG.COLUMN_COMPANY_WIDTH),
    borders: wordFileStyle.border_none,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: i18n.translate('report.PARENT_COMPANY'),
                    ...wordFileStyle.company_info_style,
                  }),
                ],
                style: 'formatSpacing',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: companyName,
                    ...wordFileStyle.company_info_style,
                  }),
                ],
                style: 'formatSpacing',
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: companyAddress,
                    ...wordFileStyle.company_info_style,
                  }),
                ],
                style: 'formatSpacing',
              }),
            ],
            borders: wordFileStyle.border_none,
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
    ],
  });

  // create docx file
  const doc = new Document({
    evenAndOddHeaderAndFooters: true,
    styles: {
      paragraphStyles: [
        {
          id: 'formatSpacing',
          name: 'Format Spacing',
          basedOn: 'Normal',
          paragraph: {
            spacing: {
              after: WORD_FILE_CONFIG.WORD_PARAGRAPH_SPACING,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG.TABLE_WIDTH,
              ),
            },
          },
        },
        children: [
          company_info,
          new Paragraph({
            children: [
              new TextRun({
                text: title.slice(0, title.indexOf('\n')),
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_14,
                bold: WORD_FILE_CONFIG.WORD_BOLD,
                font: FONT_NAME,
                allCaps: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            style: 'formatSpacing',
            spacing: {
              before: convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG.SPACING,
              ),
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: title.slice(title.indexOf('\n')),
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_12,
                font: FONT_NAME,
                bold: WORD_FILE_CONFIG.WORD_BOLD,
              }),
            ],
            alignment: AlignmentType.CENTER,
            style: 'formatSpacing',
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: reportTime,
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_10,
                font: FONT_NAME,
                bold: WORD_FILE_CONFIG.WORD_BOLD,
              }),
            ],
            alignment: AlignmentType.CENTER,
            style: 'formatSpacing',
          }),
          new Table({
            width: setWidth(
              REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG.TABLE_WIDTH,
            ),
            columnWidths: [
              convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                  .TABLE_COLUMN_WIDTH[0],
              ),
              convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                  .TABLE_COLUMN_WIDTH[1],
              ),
              convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                  .TABLE_COLUMN_WIDTH[2],
              ),
              convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                  .TABLE_COLUMN_WIDTH[3],
              ),
              convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                  .TABLE_COLUMN_WIDTH[4],
              ),
              convertInchesToTwip(
                REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                  .TABLE_COLUMN_WIDTH[5],
              ),
            ],
            rows: [
              new TableRow({
                height: setHeight(WORD_FILE_CONFIG.TABLE_HEADER_HEIGHT),
                children: [
                  new TableCell({
                    width: setWidth(
                      REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                        .TABLE_COLUMN_WIDTH[0],
                    ),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate('report.INDEX'),
                            ...wordFileStyle.table_header_style,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: setWidth(
                      REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                        .TABLE_COLUMN_WIDTH[1],
                    ),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate('report.ITEM_CODE'),
                            ...wordFileStyle.table_header_style,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: setWidth(
                      REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                        .TABLE_COLUMN_WIDTH[2],
                    ),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate('report.ITEM_NAME'),
                            ...wordFileStyle.table_header_style,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: setWidth(
                      REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                        .TABLE_COLUMN_WIDTH[3],
                    ),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate('report.UNIT'),
                            ...wordFileStyle.table_header_style,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: setWidth(
                      REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                        .TABLE_COLUMN_WIDTH[4],
                    ),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate('report.QUANTITY_MINIMUM'),
                            ...wordFileStyle.table_header_style,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: setWidth(
                      REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG
                        .TABLE_COLUMN_WIDTH[5],
                    ),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate('report.QUANTITY_STOCK'),
                            ...wordFileStyle.table_header_style,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
                tableHeader: true,
              }),
              ...dataWord
                .map((warehouse) => {
                  itemData = warehouse.items.map((item) => {
                    return new TableRow({
                      height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                      children: [
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: item.index,
                                  ...wordFileStyle.text_style,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_left,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: item.itemCode,
                                  ...wordFileStyle.text_style,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_left,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: item.itemName,
                                  ...wordFileStyle.text_style,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: item.unit,
                                  ...wordFileStyle.text_style,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_right,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: item.minInventoryLimit,
                                  ...wordFileStyle.text_style,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_right,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: item.stockQuantity,
                                  ...wordFileStyle.text_style,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    });
                  });
                  return [
                    new TableRow({
                      height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                      children: [
                        new TableCell({
                          columnSpan: 6,
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `${warehouse?.warehouseCode}-${warehouse?.warehouseName}`,
                                  ...wordFileStyle.table_header_style,
                                }),
                              ],
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                      ],
                    }),
                    ...itemData,
                  ];
                })
                .flat(),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBase64String(doc);
}
