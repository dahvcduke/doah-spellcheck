# This file contains many auxiliary functions that might be helpful throughout the development of the project. Each function contains a brief comment describing its usage. Call each function at the end of this file in the "main" function block.

import pandas as pd, json, csv, os

# This function turns CSV to JSON
def csvJson(csvFile, JsonFile):
    dictionaryDoAHContent = {} #format: {"name": [ID, "overview"]
    with open(csvFile, "r", encoding="utf-8") as csvContent:
        doahCSVContent = csv.reader(csvContent)
        for oneRowHistorian in doahCSVContent:
            try:
                historianID = int(oneRowHistorian[0])
                historianName = oneRowHistorian[1]
                historianOverview = oneRowHistorian[2]
                dictionaryDoAHContent[historianName] = [historianID, historianOverview]
            except ValueError: continue
    with open(JsonFile, "w", encoding="utf-8") as jsonFileDump:
        json.dump(dictionaryDoAHContent, jsonFileDump, ensure_ascii=False, indent=4)
    print("Converted to JSON.")

# This function stores all historian names with their ID numbers in another JSON.
# DO NOT cross-reference variable names among functions.
def historianIDJSON(csvFile, JsonFile):
    nameIdDict = {}
    with open(csvFile, "r", encoding="utf-8") as csvContent:
        doahCSVContent = csv.reader(csvContent)
        for oneRowHistorian in doahCSVContent:
            try:
                historianID = int(oneRowHistorian[0])
                historianName = oneRowHistorian[1]
                # historianOverview = oneRowHistorian[2]
                nameIdDict[historianID] = historianName
            except ValueError: continue
    with open(JsonFile, "w", encoding="utf-8") as jsonContent:
        json.dump(nameIdDict, jsonContent, ensure_ascii=False, indent = 4)

#This function creates a dictionary of different variations of a historian's name in preparation for spelling check reference. Example data format: 'Pillsbury, Edmund': ['Pillsbury', ' Edmund Pillsbury']
def nameVariations(historianNameJsonFile, historianNamesUpdatedStorageJson):
    with open (historianNameJsonFile, "r", encoding="utf-8") as historianNames:
        historianNamesDict = json.load(historianNames)
    updatedHistoriansNamesDict = {}
    for historianID, name in historianNamesDict.items():
        updatedHistoriansNamesDict[name] = []
        nameSplitByComma = name.split(",")
        updatedHistoriansNamesDict[name].append(name)
        if len(nameSplitByComma) > 1 and len(nameSplitByComma) <= 3:
            updatedHistoriansNamesDict[name].append(nameSplitByComma[0])
            firstLastNames = nameSplitByComma[1] + " " + nameSplitByComma[0]
            firstLastNames.strip()
            # print(firstLastNames)
            updatedHistoriansNamesDict[name].append(firstLastNames[1:])
        elif len(nameSplitByComma) > 3:
            firstLastNames = nameSplitByComma[1] + " " + nameSplitByComma[0]
            firstLastNames.strip()
            updatedHistoriansNamesDict[name].append(firstLastNames)
        elif len(nameSplitByComma) > 1: #This is to check for names with more than 2 words long.
            firstNameSplitSpace = nameSplitByComma[1].split()
            if len(firstNameSplitSpace) > 1:
                firstLastNames = firstNameSplitSpace[0] + " " + nameSplitByComma[0]
                firstLastNames.strip()
                updatedHistoriansNamesDict[name].append(firstLastNames)

    with open(historianNamesUpdatedStorageJson, "w", encoding="utf-8") as jsonContent:
        json.dump(updatedHistoriansNamesDict, jsonContent, ensure_ascii=False, indent = 4)
    print("All dictionary exported to JSON.")

#This function is used to combine different specific error storage JSONs into one
def combineErrorStorageJSONs(individualJsonPathList, destinationJson):
    individualJsonDataList = []
    for individualJsonPath in individualJsonPathList:
        with open(individualJsonPath, "r", encoding="utf-8") as individualJsonContent:
            content = json.load(individualJsonContent)
            individualJsonDataList.append(content)
    mergedFinalJson = individualJsonDataList[0]
    for individualJsonContentIteration in individualJsonDataList[1:]:
        for key in individualJsonContentIteration:
            if key in mergedFinalJson:
                for sentence in individualJsonContentIteration[key]:
                    if sentence in mergedFinalJson[key]:
                        mergedFinalJson[key][sentence].extend(individualJsonContentIteration[key][sentence])
                    else:
                        mergedFinalJson[key][sentence] = individualJsonContentIteration[key][sentence]
            else:
                mergedFinalJson[key] = individualJsonContentIteration[key]
    with open(destinationJson, "w", encoding="utf-8") as storage:
        json.dump(mergedFinalJson, storage, indent=4)

# This function counts the total number of errors in a dictionar. Takes in one parameter: a JSON file that stores errors:
def numOfErrors(jsonStorage):
    with open(jsonStorage, "r",  encoding="utf-8") as jsonStorageDict:
        errorDict = json.load(jsonStorageDict)

    errorCounter = 0
    for historian, paragraph in errorDict.items():
        for sentence, errorList in paragraph.items():
            errorPerListCount = len(errorList)
            for oneError in errorList:
                if oneError[-1] == []:
                    errorPerListCount -= 1
            errorCounter += errorPerListCount

    return errorCounter

# This function removes empty errors (shown as emmpty lists) in error storage JSONs and return a new dictionary for JSON export:
def removeEmptyErrors(jsonStorageUncorrected, jsonStorageCorrected):
    with open(jsonStorageUncorrected, "r", encoding="utf-8") as jsonOldStorage:
        uncorrectedDict = json.load(jsonOldStorage)

    correctedDict = {historian:
        {sentence: [oneError for oneError in errorList if oneError[-1]] if errorList else errorList
        for sentence, errorList in paragraph.items()
        }
        for historian, paragraph in uncorrectedDict.items()
    }
    with open(jsonStorageCorrected, "w", encoding="utf-8") as correctedJson:
        json.dump(correctedDict, correctedJson, indent=4)
    print("Successfully stored new error dictionary with empty error lists filtered out.")

# This function turns one large JSON that stores the information for multiple historians into having one JSON file for each historian.
def splitJsonStorage(mainLargeJson, splittedJsonStorageFolder):
    with open(mainLargeJson, "r", encoding="utf-8") as largeJson:
        largeCombinedDict = json.load(largeJson)
    
    for historian, errorDict in largeCombinedDict.items():
        individualJsonFileName = historian.replace(" ", "") + ".json"
        individualJsonFilePath = os.path.join(splittedJsonStorageFolder, individualJsonFileName)
        with open (individualJsonFilePath, "w", encoding="utf-8") as singleHistorianStorage:
            json.dump(errorDict, singleHistorianStorage, indent=4)
        print(f"Finished creating individual file for {individualJsonFileName}.")


if __name__=="__main__":

    #-------Specify auxiliary function parameters/arguments below-----#

    csvFilePath = "/Users/Jerry/Desktop/DictionaryOfArtHistorians/doahGrammar/DoAHCSVContent.csv"
    JsonFilePathDestination = "/Users/Jerry/Desktop/DictionaryOfArtHistorians/doahGrammar/doahContentJSON.json"
    historianNamesJson = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/historianNames/historianNames.json"
    historianNamesUpdatedStorageJson = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/historianNames/historianNamesForComparison.json"

    individualJsonErrorStorageList = [
        "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/doahGrammarErrorStorage.json",
        "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/historianNamesSpellingErrorStorage.json"
    ]
    destinationCombinedJsonErrorStorage = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/allCombinedErrorStorage.json"

    countNumOfErrorsJson = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/emptyErrorsRemovedErrorStorage.json"

    
    storingEmptyErrorsNotRemovedErrorJson = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/fullErrorStorageMarch7.json"
    storingEmptyErrorsRemovedErrorJson = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/emptyErrorsRemovedErrorStorage.json"

    # For splitJsonStorage function:
    mainLargeJson = "/Users/Jerry/Desktop/DHproj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/filteredFullStorageMarch7.json"
    splittedJsonStorageFolder = "/Users/Jerry/Desktop/DHproj-reading/DictionaryOfArtHistorians/doahGrammar/Backend/allErrorStorageJson/singleHistorianErrorStorage"

    #-------Run function calls below-----#
    # csvJson(csvFilePath, JsonFilePathDestination)
    # historianIDJSON(csvFilePath, historianNamesJson)
    # nameVariations(historianNamesJson, historianNamesUpdatedStorageJson)

    # print(numOfErrors(countNumOfErrorsJson))
    # removeEmptyErrors(storingEmptyErrorsNotRemovedErrorJson, storingEmptyErrorsRemovedErrorJson)
    splitJsonStorage(mainLargeJson, splittedJsonStorageFolder)