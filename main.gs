
var SS = SpreadsheetApp.getActiveSpreadsheet();
var MERGED_DATA_SHEET = SS.getSheetByName("Merged Data");
var IF_SHEET = SS.getSheetByName("Fifo IF Transactions (This month)");
var RD_SHEET = SS.getSheetByName("Fifo RD Transactions (This Month)");
var LOAN_SHEET = SS.getSheetByName("Fifo LOAN Transactions");


/**
 * Get output column from input column
 * @param inputSheetCode The input sheet code. Should either be 'IF', 'RD' OR 'LOAN'
 * @param inputRow The input row containing data
 * @return {Array} The output row
 */
function processRow(inputRow, inputSheetCode) {
    var retVal = [];
    for (var i = 0; i <= ColumnNames.letterToColumnStart0('P'); i++) {
        var inputColumn = ColumnNames.columnToLetterStart0(i);
        switch (inputColumn) {
            case 'A': retVal[ColumnNames.letterToColumnStart0('A')] = getColumnA(inputRow, inputSheetCode); break;
            case 'B': retVal[ColumnNames.letterToColumnStart0('B')] = getColumnB(inputRow, inputSheetCode); break;
            case 'C': retVal[ColumnNames.letterToColumnStart0('C')] = getColumnC(inputRow, inputSheetCode); break;
            case 'D': retVal[ColumnNames.letterToColumnStart0('D')] = getColumnD(inputRow, inputSheetCode); break;
            case 'E': retVal[ColumnNames.letterToColumnStart0('E')] = getColumnE(inputRow, inputSheetCode); break;
            case 'F': retVal[ColumnNames.letterToColumnStart0('F')] = getColumnF(inputRow, inputSheetCode); break;
            case 'G': retVal[ColumnNames.letterToColumnStart0('G')] = getColumnG(inputRow, inputSheetCode); break;
            case 'H': retVal[ColumnNames.letterToColumnStart0('H')] = getColumnH(inputRow, inputSheetCode); break;
            case 'I': retVal[ColumnNames.letterToColumnStart0('I')] = getColumnI(inputRow, inputSheetCode); break;
            case 'J': retVal[ColumnNames.letterToColumnStart0('J')] = getColumnJ(inputRow, inputSheetCode); break;
            case 'K': retVal[ColumnNames.letterToColumnStart0('K')] = getColumnK(inputRow, inputSheetCode); break;
            case 'L': retVal[ColumnNames.letterToColumnStart0('L')] = getColumnL(inputRow, inputSheetCode); break;
            case 'M': retVal[ColumnNames.letterToColumnStart0('M')] = getColumnM(inputRow, inputSheetCode); break;
            case 'N': retVal[ColumnNames.letterToColumnStart0('N')] = getColumnN(inputRow, inputSheetCode); break;
            case 'O': retVal[ColumnNames.letterToColumnStart0('O')] = getColumnO(inputRow, inputSheetCode); break;
            case 'P': retVal[ColumnNames.letterToColumnStart0('P')] = getColumnP(inputRow, inputSheetCode); break;
        }
    }
    return retVal;
}

function mergeInputData(ifValues, rdValues, loanValues){
    var retVal = [];
    var i;
    for(i=0; i < ifValues.length; i++)
        retVal.push(processRow(ifValues[i], 'IF'));
    for(i=0; i < rdValues.length; i++)
        retVal.push(processRow(rdValues[i], 'RD'));
    for(i=0; i < loanValues.length; i++)
        retVal.push(processRow(loanValues[i], 'LOAN'));
    return retVal;
}

function sortOutputOnAgreementDate(values){
    return values.sort(function(a, b){
        return compareDates(a[ColumnNames.letterToColumnStart0('D')], b[ColumnNames.letterToColumnStart0('D')]);
    })
}


function cleanMergedData(){
    var nbRows = MERGED_DATA_SHEET.getLastRow();
    if(nbRows > 1){
        var nbColumns = MERGED_DATA_SHEET.getLastColumn();
        var range = MERGED_DATA_SHEET.getRange(2, ColumnNames.letterToColumn('A'), nbRows-1, nbColumns);
        range.clear(({contentsOnly: true}));
    }
}

function mergeData() {
    cleanMergedData();

    var ifNbRows = IF_SHEET.getLastRow();
    var rdNbRows = RD_SHEET.getLastRow();
    var loanNbRows = LOAN_SHEET.getLastRow();
    var ifNbColumns = IF_SHEET.getLastColumn();
    var rdNbColumns = RD_SHEET.getLastColumn();
    var loanNbColumns = LOAN_SHEET.getLastColumn();
    var ifValues = IF_SHEET.getRange(2, ColumnNames.letterToColumn('A'), ifNbRows-1, ifNbColumns).getValues();
    var rdValues = RD_SHEET.getRange(2, ColumnNames.letterToColumn('A'), rdNbRows-1, rdNbColumns).getValues();
    var loanValues = LOAN_SHEET.getRange(2, ColumnNames.letterToColumn('A'), loanNbRows-1, loanNbColumns).getValues();

    var outputValues = mergeInputData(ifValues, rdValues, loanValues);
    outputValues = sortOutputOnAgreementDate(outputValues);

    var outputRange = MERGED_DATA_SHEET.getRange(2, ColumnNames.letterToColumn('A'), outputValues.length, outputValues[0].length);
    outputRange.setValues(outputValues);
}