import { formatNumber } from '@constant/common';
import { TableDataSituationInventoryPeriod } from '@models/statistic-inventory.model';
import { minus, plus } from '@utils/common';
import {
  FONT_NAME,
  SITUATION_INVENTORY_PERIOD_COLUMNS,
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
import {
  renderChildrenRows,
  setHeight,
  setWidth,
  wordFileStyle,
} from './word-common.styles';
export async function generateReportSituationInventoryPeriod(
  dataWord: TableDataSituationInventoryPeriod[],
  companyName,
  companyAddress,
  title,
  reportTime,
  i18n: I18nRequestScopeService,
): Promise<any> {
  let warehouseTotalPlanQuantity = 0;
  let warehouseTotalActualQuantity = 0;
  let itemData = [];

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
            verticalAlign: VerticalAlign.BOTTOM,
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
                children: SITUATION_INVENTORY_PERIOD_COLUMNS.map((item) => {
                  return new TableCell({
                    rowSpan: item.rowSpan || null,
                    columnSpan: item.columnSpan || null,
                    width: setWidth(item.width),
                    verticalAlign: VerticalAlign.BOTTOM,
                    shading: wordFileStyle.table_header_bg_color,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate(
                              item.name ? `report.${item.name}` : '',
                            ),
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
                children: SITUATION_INVENTORY_PERIOD_COLUMNS.filter(
                  (item) =>
                    item.child &&
                    item.child.length > 0 &&
                    item.child.find(
                      (itemChild) =>
                        itemChild.child && itemChild.child.length > 0,
                    ),
                )
                  .map((item) => {
                    return item.child.map((child) => {
                      return new TableCell({
                        columnSpan: child.columnSpan || null,
                        width: setWidth(child.width),
                        verticalAlign: VerticalAlign.BOTTOM,
                        shading: wordFileStyle.table_header_bg_color,
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: i18n.translate(`report.${child.name}`),
                                ...wordFileStyle.table_header_style_w002,
                              }),
                            ],
                          }),
                        ],
                      });
                    });
                  })
                  .flat(),
              }),
              new TableRow({
                tableHeader: true,
                height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                children: renderChildrenRows(
                  SITUATION_INVENTORY_PERIOD_COLUMNS.filter(
                    (item) => item.child && item.child.length > 0,
                  ),
                  i18n,
                ),
              }),
              ...dataWord
                .map((warehouse) => {
                  itemData = warehouse.items.map((item, index) => {
                    warehouseTotalPlanQuantity = plus(
                      warehouseTotalPlanQuantity,
                      warehouse.totalPlanQuantity,
                    );
                    warehouseTotalActualQuantity = plus(
                      warehouseTotalActualQuantity,
                      warehouse.totalActualQuantity,
                    );
                    return new TableRow({
                      height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                      children: [
                        new TableCell({
                          verticalAlign: VerticalAlign.BOTTOM,
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
                          verticalAlign: VerticalAlign.BOTTOM,
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
                          verticalAlign: VerticalAlign.BOTTOM,
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
                          verticalAlign: VerticalAlign.BOTTOM,
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
                          verticalAlign: VerticalAlign.BOTTOM,
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
                          verticalAlign: VerticalAlign.BOTTOM,
                          margins: wordFileStyle.margin_right,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: formatNumber(item.totalPlanQuantity),
                                  ...wordFileStyle.text_style,
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
                                  text: formatNumber(item.storageCost),
                                  ...wordFileStyle.text_style,
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
                                  text: formatNumber(item.totalPricePlan),
                                  ...wordFileStyle.text_style,
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
                                  text: formatNumber(item.totalActualQuantity),
                                  ...wordFileStyle.text_style,
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
                                  text: formatNumber(item.storageCost),
                                  ...wordFileStyle.text_style,
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
                                  text: formatNumber(item.totalPriceActual),
                                  ...wordFileStyle.text_style,
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
                                  text: formatNumber(
                                    minus(
                                      item.totalActualQuantity,
                                      item.totalPlanQuantity,
                                    ),
                                  ),
                                  ...wordFileStyle.text_style,
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
                                  text: minus(
                                    item.totalPriceActual,
                                    item.totalPricePlan,
                                  ).toString(),
                                  ...wordFileStyle.text_style,
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
                                  text: minus(
                                    item.totalPlanQuantity,
                                    item.totalActualQuantity,
                                  ).toString(),
                                  ...wordFileStyle.text_style,
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
                                  text: minus(
                                    item.totalPricePlan,
                                    item.totalPriceActual,
                                  ).toString(),
                                  ...wordFileStyle.text_style,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.BOTTOM,
                          margins: wordFileStyle.margin_left,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: item.note,
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
                          columnSpan: 16,
                          verticalAlign: VerticalAlign.BOTTOM,
                          margins: wordFileStyle.margin_left,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: '',
                                  ...wordFileStyle.text_style_bold,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    ...itemData,
                    new TableRow({
                      height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                      children: [
                        new TableCell({
                          columnSpan: 5,
                          verticalAlign: VerticalAlign.BOTTOM,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: i18n.translate(
                                    `report.TOTAL_PRICE_WAREHOUSE`,
                                  ),
                                  ...wordFileStyle.text_style_bold,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.BOTTOM,
                          margins: wordFileStyle.margin_right,
                          borders: wordFileStyle.border_right_none,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: warehouse.totalPlanQuantity + '',
                                  ...wordFileStyle.text_style_bold,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          columnSpan: 2,
                          borders: wordFileStyle.border_left_none,
                          children: [],
                        }),
                        new TableCell({
                          verticalAlign: VerticalAlign.BOTTOM,
                          margins: wordFileStyle.margin_right,
                          borders: wordFileStyle.border_right_none,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: warehouse.totalActualQuantity + '',
                                  ...wordFileStyle.text_style_bold,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          columnSpan: 2,
                          borders: wordFileStyle.border_left_none,
                          children: [],
                        }),
                        new TableCell({
                          columnSpan: 2,
                          verticalAlign: VerticalAlign.BOTTOM,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
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
                          verticalAlign: VerticalAlign.BOTTOM,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
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
                          verticalAlign: VerticalAlign.BOTTOM,
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
                      ],
                    }),
                  ];
                })
                .flat(),
              new TableRow({
                height: setHeight(WORD_FILE_CONFIG.TABLE_ROW_HEIGHT),
                children: [
                  new TableCell({
                    columnSpan: 5,
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: i18n.translate(`report.TOTAL`),
                            allCaps: true,
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    borders: wordFileStyle.border_right_none,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: warehouseTotalPlanQuantity.toString(),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    columnSpan: 2,
                    borders: wordFileStyle.border_left_none,
                    children: [],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.BOTTOM,
                    margins: wordFileStyle.margin_right,
                    borders: wordFileStyle.border_right_none,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: warehouseTotalActualQuantity.toString(),
                            ...wordFileStyle.text_style_bold,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    columnSpan: 2,
                    borders: wordFileStyle.border_left_none,
                    children: [],
                  }),
                  new TableCell({
                    columnSpan: 2,
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
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
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
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
                    verticalAlign: VerticalAlign.BOTTOM,
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
