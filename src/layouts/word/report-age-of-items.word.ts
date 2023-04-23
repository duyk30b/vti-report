import { formatMoney, readDecimal } from '@constant/common';
import { TableAgeOfItems } from '@models/age-of-items.model';
import { plusBigNumber } from '@utils/common';
import {
  AGE_OF_ITEM_STOCK_COLUMNS,
  FONT_NAME,
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
export async function generateReportAgeOfItemStock(
  dataWord: TableAgeOfItems[],
  companyName,
  companyAddress,
  title,
  reportTime,
  i18n: I18nRequestScopeService,
): Promise<any> {
  let itemData = [];
  let recordData = [];
  let warehouseTotalPrice = 0;
  let sixMonth = 0;
  let oneYearAgo = 0;
  let twoYearAgo = 0;
  let threeYearAgo = 0;
  let fourYearAgo = 0;
  let fiveYearAgo = 0;
  let greaterfiveYear = 0;

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
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_14,
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
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_11,
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
                children: AGE_OF_ITEM_STOCK_COLUMNS.map((item) => {
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
                            ...wordFileStyle.table_header_style,
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
                children: AGE_OF_ITEM_STOCK_COLUMNS.filter(
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
                  warehouseTotalPrice = plusBigNumber(
                    warehouseTotalPrice,
                    warehouse.totalPrice,
                  );
                  sixMonth = plusBigNumber(sixMonth, warehouse.sixMonth);
                  oneYearAgo = plusBigNumber(oneYearAgo, warehouse.oneYearAgo);
                  twoYearAgo = plusBigNumber(twoYearAgo, warehouse.twoYearAgo);
                  threeYearAgo = plusBigNumber(
                    threeYearAgo,
                    warehouse.threeYearAgo,
                  );
                  fourYearAgo = plusBigNumber(
                    fourYearAgo,
                    warehouse.fourYearAgo,
                  );
                  fiveYearAgo = plusBigNumber(
                    fiveYearAgo,
                    warehouse.fiveYearAgo,
                  );
                  greaterfiveYear = plusBigNumber(
                    greaterfiveYear,
                    warehouse.greaterfiveYear,
                  );
                  itemData = warehouse.items
                    .map((item) => {
                      recordData = item.groupByStorageDate
                        .filter((itemReport) => itemReport.stockQuantity)
                        .map((record) => {
                          return new TableRow({
                            height: setHeight(
                              WORD_FILE_CONFIG.TABLE_ROW_HEIGHT,
                            ),
                            children: [
                              new TableCell({
                                children: [],
                              }),
                              new TableCell({
                                children: [],
                              }),
                              new TableCell({
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                  new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                      new TextRun({
                                        text: record.storageDate || '',
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
                                        text: record.origin,
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
                                        text: record.account,
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
                                        text: record.lotNumber,
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
                                        text: record.locatorCode,
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
                                        text: record.unit,
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
                                        text: readDecimal(record.stockQuantity),
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
                                          record.storageCost,
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
                                        text: formatMoney(record.totalPrice),
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
                                        text: formatMoney(record.sixMonthAgo),
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
                                        text: formatMoney(record.oneYearAgo),
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
                                        text: formatMoney(record.twoYearAgo),
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
                                        text: formatMoney(record.threeYearAgo),
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
                                        text: formatMoney(record.fourYearAgo),
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
                                        text: formatMoney(record.fiveYearAgo),
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
                                          record.greaterfiveYear,
                                        ),
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
                              verticalAlign: VerticalAlign.CENTER,
                              margins: wordFileStyle.margin_left,
                              children: [
                                new Paragraph({
                                  alignment: AlignmentType.LEFT,
                                  children: [
                                    new TextRun({
                                      text: item.itemCode,
                                      bold: WORD_FILE_CONFIG.WORD_BOLD,
                                      font: FONT_NAME,
                                      size: WORD_FILE_CONFIG.WORD_FONT_SIZE_9,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            new TableCell({
                              columnSpan: 7,
                              verticalAlign: VerticalAlign.CENTER,
                              margins: wordFileStyle.margin_left,
                              children: [
                                new Paragraph({
                                  alignment: AlignmentType.LEFT,
                                  children: [
                                    new TextRun({
                                      text: item.itemName,
                                      bold: WORD_FILE_CONFIG.WORD_BOLD,
                                      font: FONT_NAME,
                                      size: WORD_FILE_CONFIG.WORD_FONT_SIZE_9,
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
                                      text: readDecimal(item.totalQuantity),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: '',
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.totalPrice),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.sixMonthAgo),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.oneYearAgo),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.twoYearAgo),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.threeYearAgo),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.fourYearAgo),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.fiveYearAgo),
                                      ...wordFileStyle.text_style_bold,
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
                                      text: formatMoney(item.greaterfiveYear),
                                      ...wordFileStyle.text_style_bold,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        ...recordData,
                      ];
                    })
                    .flat();
                  return [
                    new TableRow({
                      height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                      children: [
                        new TableCell({
                          columnSpan: 10,
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_left,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: warehouse.warehouseCode,
                                  bold: WORD_FILE_CONFIG.WORD_BOLD,
                                  font: FONT_NAME,
                                  size: WORD_FILE_CONFIG.WORD_FONT_SIZE_9,
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
                                  text: formatMoney(warehouse.totalPrice),
                                  ...wordFileStyle.text_style_bold,
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
                                  text: formatMoney(warehouse.sixMonth),
                                  ...wordFileStyle.text_style_bold,
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
                                  text: formatMoney(warehouse.oneYearAgo),
                                  ...wordFileStyle.text_style_bold,
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
                                  text: formatMoney(warehouse.twoYearAgo),
                                  ...wordFileStyle.text_style_bold,
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
                                  text: formatMoney(warehouse.threeYearAgo),
                                  ...wordFileStyle.text_style_bold,
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
                                  text: formatMoney(warehouse.fourYearAgo),
                                  ...wordFileStyle.text_style_bold,
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
                                  text: formatMoney(warehouse.fiveYearAgo),
                                  ...wordFileStyle.text_style_bold,
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
                                  text: formatMoney(warehouse.greaterfiveYear),
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
              new TableRow({
                height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                children: [
                  new TableCell({
                    columnSpan: 10,
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
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
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(warehouseTotalPrice),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(sixMonth),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(oneYearAgo),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(twoYearAgo),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(threeYearAgo),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(fourYearAgo),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(fiveYearAgo),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: formatMoney(greaterfiveYear),
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
