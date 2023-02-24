import { formatDate, formatMoney } from '@constant/common';
import { TableDataSituationExportPeriod } from '@models/situation_export.model';
import { plus, plusBigNumber } from '@utils/common';
import {
  FONT_NAME,
  SITUATION_EXPORT_PERIOD_COLUMNS,
  WORD_FILE_CONFIG,
} from '@utils/constant';
import {
  AlignmentType,
  convertInchesToTwip,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
} from 'docx';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { setHeight, setWidth, wordFileStyle } from './word-common.styles';
export async function generateReportSituationExportPeriod(
  dataWord: TableDataSituationExportPeriod[],
  companyName,
  companyAddress,
  title,
  reportTime,
  i18n: I18nRequestScopeService,
): Promise<any> {
  let reasonData = [];
  let orderData = [];
  let itemData = [];
  let totalWarehouse = 0;

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
              before: WORD_FILE_CONFIG.SPACING_BEFORE,
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
            rows: [
              new TableRow({
                tableHeader: true,
                height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                children: SITUATION_EXPORT_PERIOD_COLUMNS.map((item) => {
                  return new TableCell({
                    rowSpan: item.rowSpan || null,
                    columnSpan: item.columnSpan || null,
                    width: setWidth(item.width),
                    verticalAlign: VerticalAlign.CENTER,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate(`report.${item.name}`),
                            ...wordFileStyle.table_header_style_w002,
                          }),
                        ],
                      }),
                    ],
                  });
                }),
              }),
              new TableRow({
                tableHeader: true,
                height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                children: SITUATION_EXPORT_PERIOD_COLUMNS.filter(
                  (item) => item.child && item.child.length > 0,
                )
                  .map((item) => {
                    return item.child.map((child) => {
                      return new TableCell({
                        width: setWidth(child.width),
                        verticalAlign: VerticalAlign.CENTER,
                        shading: wordFileStyle.table_header_bg_color,
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: i18n.translate(`report.${child.name}`),
                                ...wordFileStyle.table_header_style,
                              }),
                            ],
                          }),
                        ],
                      });
                    });
                  })
                  .flat(),
              }),
              ...dataWord
                .map((warehouse) => {
                  totalWarehouse = plusBigNumber(
                    totalWarehouse,
                    warehouse.totalPrice || 0,
                  );
                  reasonData = warehouse.reasons
                    .map((reason) => {
                      orderData = reason.orders
                        .map((order, index) => {
                          itemData = order.items
                            .filter((item) => {
                              if (item.actualQuantity) return item;
                            })
                            .map((item) => {
                              return new TableRow({
                                height: setHeight(
                                  WORD_FILE_CONFIG.TABLE_ROW_HEIGHT,
                                ),
                                children: [
                                  new TableCell({
                                    columnSpan: 5,
                                    children: [],
                                  }),
                                  new TableCell({
                                    columnSpan: 2,
                                    verticalAlign: VerticalAlign.CENTER,
                                    margins: wordFileStyle.margin_left,
                                    children: [
                                      new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        children: [
                                          new TextRun({
                                            text: item.itemCode,
                                            ...wordFileStyle.text_style_bold,
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
                                            text: item.lotNumber,
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
                                            text: item.accountDebt + '.',
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
                                            text: item.accountHave,
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
                                            text: formatMoney(
                                              item.planQuantity,
                                              2,
                                            ),
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
                                            text: formatMoney(
                                              item.actualQuantity,
                                              2,
                                            ),
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
                                            text: item.locatorCode,
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
                                            text:
                                              formatMoney(
                                                item.storageCost,
                                                2,
                                              ) || '0,00',
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
                                            text:
                                              formatMoney(item.totalPrice) ||
                                              '0,00',
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
                              height: setHeight(
                                WORD_FILE_CONFIG.TABLE_ROW_HEIGHT,
                              ),
                              children: [
                                new TableCell({
                                  verticalAlign: VerticalAlign.CENTER,
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.CENTER,
                                      children: [
                                        new TextRun({
                                          text: plus(index, 1).toString(),
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
                                          text: order.orderCode,
                                          ...wordFileStyle.text_style_bold,
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
                                          text:
                                            formatDate(order.orderCreatedAt) ||
                                            '',
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
                                          text: order.constructionName,
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
                                          text: order.departmentReceiptName,
                                          ...wordFileStyle.text_style,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  columnSpan: 6,
                                  verticalAlign: VerticalAlign.CENTER,
                                  margins: wordFileStyle.margin_left,
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.LEFT,
                                      children: [
                                        new TextRun({
                                          text: order.explain,
                                          ...wordFileStyle.text_style,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  columnSpan: 4,
                                  borders: wordFileStyle.border_right_none,
                                  children: [],
                                }),
                                new TableCell({
                                  borders: wordFileStyle.border_left_right_none,
                                  children: [],
                                }),
                                new TableCell({
                                  verticalAlign: VerticalAlign.CENTER,
                                  margins: wordFileStyle.margin_right,
                                  borders: wordFileStyle.border_left_none,
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.RIGHT,
                                      children: [
                                        new TextRun({
                                          text: formatMoney(order.totalPrice),
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
                        .flat();
                      return [
                        new TableRow({
                          height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                          children: [
                            new TableCell({
                              columnSpan: 15,
                              verticalAlign: VerticalAlign.CENTER,
                              margins: wordFileStyle.margin_left,
                              borders: wordFileStyle.border_right_none,
                              children: [
                                new Paragraph({
                                  alignment: AlignmentType.LEFT,
                                  children: [
                                    new TextRun({
                                      text: `${i18n.translate(
                                        `report.REASON`,
                                      )} ${reason?.value}`,
                                      ...wordFileStyle.text_style_bold,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            new TableCell({
                              borders: wordFileStyle.border_left_right_none,
                              children: [],
                            }),
                            new TableCell({
                              verticalAlign: VerticalAlign.CENTER,
                              margins: wordFileStyle.margin_right,
                              borders: wordFileStyle.border_left_none,
                              children: [
                                new Paragraph({
                                  alignment: AlignmentType.RIGHT,
                                  children: [
                                    new TextRun({
                                      text: formatMoney(reason.totalPrice),
                                      ...wordFileStyle.text_style_bold,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        ...orderData,
                      ];
                    })
                    .flat();
                  return [
                    new TableRow({
                      height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                      children: [
                        new TableCell({
                          columnSpan: 15,
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_left,
                          borders: wordFileStyle.border_right_none,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: warehouse.warehouseCode,
                                  ...wordFileStyle.text_style_bold,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          borders: wordFileStyle.border_left_right_none,
                          children: [],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_right,
                          borders: wordFileStyle.border_left_none,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: formatMoney(warehouse.totalPrice),
                                  ...wordFileStyle.text_style_bold,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    ...reasonData,
                  ];
                })
                .flat(),
              new TableRow({
                height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                children: [
                  new TableCell({
                    columnSpan: 11,
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate(`report.TOTAL`),
                            ...wordFileStyle.text_style_bold,
                            allCaps: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    columnSpan: 4,
                    borders: wordFileStyle.border_right_none,
                    children: [],
                  }),
                  new TableCell({
                    borders: wordFileStyle.border_left_right_none,
                    children: [],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    borders: wordFileStyle.border_left_none,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(totalWarehouse),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
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
