import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({ providedIn: 'root'})
export class ExcelService {
  constructor() {}

  public async exportAsExcelFile(workbookData: any[], excelFileName: string) {
    const workbook = new ExcelJS.Workbook();

    workbookData.forEach(({ workSheet, rows }) => {
      const sheet = workbook.addWorksheet(workSheet);
      const uniqueHeaders = [
        ...new Set(
          rows.reduce((prev, next) => [...prev, ...Object.keys(next)], [])
        )
      ];
      sheet.columns = uniqueHeaders.map(x => ({ header: x, key: x }));

      rows.forEach((jsonRow, i) => {
        let cellValues = { ...jsonRow };

        uniqueHeaders.forEach((header, j) => {
          if (Array.isArray(jsonRow[header as any])) {
            cellValues[header as any] = "";
          }
        });
        sheet.addRow(cellValues);
        uniqueHeaders.forEach((header, j) => {
          if (Array.isArray(jsonRow[header as any])) {
            const jsonDropdown = jsonRow[header as any];
            sheet.getCell(
              this.getSpreadSheetCellNumber(i + 1, j)
            ).dataValidation = {
              type: "list",
              formulae: [`"${jsonDropdown.join(",")}"`]
            };
          }
        });

        //Ensures that the fourth and sixth columns are formated as text
        sheet.getColumn(4).numFmt = '@';
        sheet.getColumn(6).numFmt = '@';
      });
    });

    
    const buffer = await workbook.xlsx.writeBuffer();
    this.saveAsExcelFile(buffer, excelFileName);
  }

  private getSpreadSheetCellNumber(row, column) {
    let result = "";

    // Get spreadsheet column letter
    let n = column;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }

    // Get spreadsheet row number
    result += `${row + 1}`;

    return result;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
