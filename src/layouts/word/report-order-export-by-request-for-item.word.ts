import {
  ORDER_EXPORT_BY_REQUEST_FOR_ITEM_COLUMNS,
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
export async function generateReportOrderExportByRequestForItem(
  dataWord,
  i18n: I18nRequestScopeService,
): Promise<string> {
  let itemData = [];

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
            size: wordFileStyle.pagesize_a4,
          },
        },
        children: [
          new Table({
            width: setWidth(WORD_FILE_CONFIG.TABLE_WIDTH_PAGE_A4),
            rows: [
              new TableRow({
                tableHeader: true,
                height: setHeight(WORD_FILE_CONFIG.TABLE_HEADER_HEIGHT),
                children: ORDER_EXPORT_BY_REQUEST_FOR_ITEM_COLUMNS.map(
                  (item) => {
                    return new TableCell({
                      width: setWidth(item.width),
                      verticalAlign: VerticalAlign.CENTER,
                      shading: wordFileStyle.table_header_bg_color,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: i18n.translate(`report.${item.name}`),
                              ...wordFileStyle.table_header_style,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    });
                  },
                ),
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
                          margins: wordFileStyle.margin_left,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.LEFT,
                              children: [
                                new TextRun({
                                  text: item.warehouseExportProposals,
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
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: item.orderCreatedAt,
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
                                  text: item.planQuantity,
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
                                  text: item.exportedQuantity,
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
                                  text: `Mã kho: ${warehouse.warehouseName}-${warehouse.warehouseCode}`,
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
        ],
      },
    ],
  });

  return Packer.toBase64String(doc);
}
