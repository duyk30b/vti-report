import { OrderExportIncompleteModel } from '@models/order-exported-incomplete.model';
import { TableData } from '@models/report.model';
import {
  FONT_NAME,
  ORDER_EXPORT_INCOMPLETED_COLUMNS,
  WORD_FILE_CONFIG,
} from '@utils/constant';
import {
  AlignmentType,
  convertInchesToTwip,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  Document,
  Packer,
} from 'docx';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { setHeight, setWidth, wordFileStyle } from './word-common.styles';

let itemData = [];

export async function generateReportOrderExportIncompleted(
  dataWord: TableData<OrderExportIncompleteModel>[],
  companyName,
  companyAddress,
  title,
  reportTime,
  i18n: I18nRequestScopeService,
): Promise<any> {
  const companyInfo = new Table({
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
                    text: i18n.translate(`report.PARENT_COMPANY`),
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
            size: wordFileStyle.pagesize_a3,
          },
        },
        children: [
          companyInfo,
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
              before: convertInchesToTwip(WORD_FILE_CONFIG.SPACING_BEFORE),
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: title.slice(title.indexOf('\n')),
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_12,
                font: FONT_NAME,
                bold: WORD_FILE_CONFIG.WORD_BOLD,
                allCaps: true,
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
            width: setWidth(WORD_FILE_CONFIG.TABLE_WIDTH_PAGE_A3),
            rows: [
              new TableRow({
                tableHeader: true,
                height: setHeight(WORD_FILE_CONFIG.TABLE_HEADER_HEIGHT),
                children: ORDER_EXPORT_INCOMPLETED_COLUMNS.map((item) => {
                  return new TableCell({
                    width: setWidth(item.width),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate(`report.${item.name}`),
                            ...wordFileStyle.table_header_style,
                          }),
                        ],
                      }),
                    ],
                  });
                }),
              }),
              ...dataWord
                .map((warehouse) => {
                  itemData = warehouse.data.map((item, index) => {
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
                                  text: index + 1 + '',
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
                                  text: item.orderCode,
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
                                  text: item.actualQuantity + '',
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
                                  text: item.constructionName,
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
                                  text: item.receiver,
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
                          columnSpan: 8,
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_left,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: warehouse?.warehouseCode,
                                  ...wordFileStyle.text_style_bold,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    ...itemData,
                  ];
                })
                .flat(),
            ],
          }),
          new Paragraph({}),
          new Table({
            width: setWidth(14.5),
            columnWidths: [
              convertInchesToTwip(14.5 / 3),
              convertInchesToTwip(14.5 / 3),
              convertInchesToTwip(14.5 / 3),
            ],
            borders: wordFileStyle.border_none,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: wordFileStyle.border_none,
                    children: [],
                    width: setWidth(14.5 / 3),
                  }),
                  new TableCell({
                    borders: wordFileStyle.border_none,
                    children: [],
                    width: setWidth(14.5 / 3),
                  }),
                  new TableCell({
                    borders: wordFileStyle.border_none,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: i18n.translate('report.REPORT_FOOTER_DATE'),
                            ...wordFileStyle.text_style,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: setWidth(14.5 / 3),
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [],
                    columnSpan: 3,
                    borders: wordFileStyle.border_none,
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: wordFileStyle.border_none,
                    children: [],
                    width: {
                      size: convertInchesToTwip(3.229),
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    borders: wordFileStyle.border_none,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: i18n.translate(
                              'report.REPORT_FOOTER_SCHEDULER',
                            ),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: {
                      size: convertInchesToTwip(3.229),
                      type: WidthType.DXA,
                    },
                  }),
                  new TableCell({
                    borders: wordFileStyle.border_none,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: i18n.translate(
                              'report.REPORT_FOOTER_STOCKER',
                            ),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: {
                      size: convertInchesToTwip(3.229),
                      type: WidthType.DXA,
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
