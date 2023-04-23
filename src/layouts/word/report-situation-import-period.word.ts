import { formatMoney } from '@constant/common';
import { TableDataSituationImportPeriod } from '@models/situation_import.model';
import { plus } from '@utils/common';
import {
  FONT_NAME,
  SITUATION_IMPORT_PERIOD_COLUMNS,
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
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { setHeight, setWidth, wordFileStyle } from './word-common.styles';
export async function generateReportSituationImportPeriod(
  dataWord: TableDataSituationImportPeriod[],
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

  //create docx file
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
            style: 'formatSpacing',
            alignment: AlignmentType.CENTER,
            spacing: {
              before: WORD_FILE_CONFIG.SPACING_BEFORE,
            },
            children: [
              new TextRun({
                text: title.slice(0, title.indexOf('\n')),
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_14,
                bold: WORD_FILE_CONFIG.WORD_BOLD,
                font: FONT_NAME,
                allCaps: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: 'formatSpacing',
            children: [
              new TextRun({
                text: title.slice(title.indexOf('\n')),
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_12,
                font: FONT_NAME,
                bold: WORD_FILE_CONFIG.WORD_BOLD,
                allCaps: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: 'formatSpacing',
            children: [
              new TextRun({
                text: reportTime,
                size: WORD_FILE_CONFIG.WORD_FONT_SIZE_10,
                font: FONT_NAME,
                bold: WORD_FILE_CONFIG.WORD_BOLD,
              }),
            ],
          }),
          new Table({
            rows: [
              new TableRow({
                tableHeader: true,
                height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                children: SITUATION_IMPORT_PERIOD_COLUMNS.map((item) => {
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
                children: SITUATION_IMPORT_PERIOD_COLUMNS.filter(
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
                  totalWarehouse = plus(totalWarehouse, warehouse.totalPrice);
                  reasonData = warehouse.reasons
                    .map((reason) => {
                      orderData = reason.orders
                        .map((order, index) => {
                          itemData = order.items.map((item) => {
                            return new TableRow({
                              height: setHeight(
                                WORD_FILE_CONFIG.TABLE_ROW_HEIGHT,
                              ),
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
                                          text: '',
                                          ...wordFileStyle.text_style,
                                        }),
                                      ],
                                    }),
                                  ],
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
                                          text: item.accountDebt || '',
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
                                          text: item.accountHave || '',
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
                                          text: formatMoney(
                                            item.storageCost,
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
                                          text: '',
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
                                            Math.round(item?.totalPrice),
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
                                  margins: wordFileStyle.margin_left,
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.CENTER,
                                      children: [
                                        new TextRun({
                                          text: order.ebsNumber || '',
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
                                          text:
                                            moment(order.orderCreatedAt).format(
                                              'DD/MM/YYYY',
                                            ) || '',
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
                                          text: order.contract,
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
                                          text: order.providerName,
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
                                  columnSpan: 10,
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
                                  verticalAlign: VerticalAlign.CENTER,
                                  margins: wordFileStyle.margin_right,
                                  children: [
                                    new Paragraph({
                                      alignment: AlignmentType.RIGHT,
                                      children: [
                                        new TextRun({
                                          text: '',
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
                                            Math.round(order?.totalPrice),
                                          ),
                                          ...wordFileStyle.text_style,
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
                              columnSpan: 17,
                              verticalAlign: VerticalAlign.CENTER,
                              margins: wordFileStyle.margin_left,
                              children: [
                                new Paragraph({
                                  alignment: AlignmentType.LEFT,
                                  children: [
                                    new TextRun({
                                      text:
                                        i18n.translate('report.REASON') +
                                        reason.value,
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
                                      text: '',
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
                                        '' +
                                        formatMoney(
                                          Math.round(reason?.totalPrice || 0),
                                        ),
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
                          columnSpan: 17,
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_left,
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
                          verticalAlign: VerticalAlign.CENTER,
                          margins: wordFileStyle.margin_right,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: '',
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
                                  text: '',
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
                                    Math.round(warehouse?.totalPrice),
                                  ),
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
                    columnSpan: 17,
                    verticalAlign: VerticalAlign.CENTER,
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
                    verticalAlign: VerticalAlign.CENTER,
                    margins: wordFileStyle.margin_right,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: '',
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
                            text: '',
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
                            text: formatMoney(Math.round(totalWarehouse)),
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