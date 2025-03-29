import language_tool_python, json, re
from nltk.tokenize import PunktSentenceTokenizer

# from langdetect import detect as languageDetection
# from langdetect import detect_langs as languageDetectionProbabilities
# from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# json format: dictionary - {"lastName, firstName": [id, "description"]}
# language_tool_python error output example:
    # output = [Match({'ruleId': 'PERS_PRONOUN_AGREEMENT', 'message': 'Did you mean “am” or “will be”?', 'replacements': ['am', 'will be'], 'offsetInContext': 2, 'context': 'I is eating lunch.', 'offset': 2, 'errorLength': 2, 'category': 'GRAMMAR', 'ruleIssueType': 'grammar', 'sentence': 'I is eating lunch.'})]
    # access specific information through: output.message

class grammarCheckSentenceLevelPreparationForErrorMessageStorage:
    def __init__(self, jsonFilePathUnsegmented, nameDictionary, errorMessageStorageJson, doAHContentSentSegmentedJsonFile):
        self.jsonFilePathUnsegmented = jsonFilePathUnsegmented
        self.nameDict = nameDictionary
        self.errorMessageStorageJson = errorMessageStorageJson
        self.doAHContentSentSegmentedJsonFile = doAHContentSentSegmentedJsonFile
        self.DoAHJsonContentDict = None
        self.DoAHSentSegDict = {} # This dictionary stores the DoAH content that has been sentence-segmented. Format: {"lastName, firstName": [id, "sentence-segmented description"]}
        self.errorMessageStorageWithSentenceDict = {} #This dictionary holds the corrected list of sentences to be dumped into a new JSON. Format: {"historian name": {"sentence": [startSlicingIndex, endSlicingIndex, [suggested changes]}}. If a sentence has no error: {"historian name": {"sentence": []}}

    def processJsonUnsegmented(self):
        with open(self.jsonFilePathUnsegmented, "r", encoding = "utf-8") as jsonContent:
            self.DoAHJsonContentDict = json.load(jsonContent)

    def processJsonSegmented(self):
        with open(self.doAHContentSentSegmentedJsonFile, "r", encoding = "utf-8") as jsonContent:
            self.DoAHSentSegDict = json.load(jsonContent)
    
    def sentenceSegmentation(self):
        sentSegmentator = PunktSentenceTokenizer()
        for historianString, IdOverviewList in self.DoAHJsonContentDict.items():
            historianIdInt = IdOverviewList[0]
            historianOverviewString = IdOverviewList[1]
            segmentationResult = sentSegmentator.tokenize(historianOverviewString)
            singleHistorianSentSegList = [singleSentence for singleSentence in segmentationResult]
            # print(singleHistorianSentSeg)
            # self.DoAHSentSegDict[historianString] = [historianIdInt, singleHistorianSentSegList]
            self.DoAHSentSegDict[historianString] = singleHistorianSentSegList

        with open(self.doAHContentSentSegmentedJsonFile, "w", encoding="utf-8") as jsonSegContent:
            json.dump(self.DoAHSentSegDict, jsonSegContent, ensure_ascii=False, indent = 4)

    # This function and interface check grammar and errors at the sentence-level, using historian overviews that have been sentence-segmented from the "sentenceSegmentation" function.
    def sentenceGrammarCheck(self):
        grammarCheckerFunction = language_tool_python.LanguageTool("en-US")
        # print(self.DoAHSentSegDict)
        for historian, IdOverviewSegmentedList in self.DoAHSentSegDict.items():
            sentenceCheckedForEachHistorianDict = {}
            for sentenceToCheck in IdOverviewSegmentedList:
                # print(sentenceToCheck)
                # Checking for XML locations:
                xmlRegexPattern = r"<em>(.*?)</em>|<a.*?>(.*?)</a>"
                appearances = re.findall(xmlRegexPattern, sentenceToCheck)
                # print(f"Appearance of XML: {appearances}")
                xmlTagIndexRangeListOfTuples = [] #type: [[[indexEMStart, indexEMEnd], [indexAStart, indexAEnd]], [indexEMStart, indexEMEnd], [indexAStart, indexAEnd]]

                for xmlAppearance in appearances:
                    appearanceRangeTuple = []
                    typeEMxml, typeAxml = xmlAppearance
                    if typeEMxml:
                        appearanceRangeTuple.append([sentenceToCheck.find(typeEMxml),sentenceToCheck.find(typeEMxml) + len(typeEMxml)])
                    if  typeAxml:
                        appearanceRangeTuple.append([sentenceToCheck.find(typeAxml),sentenceToCheck.find(typeAxml) + len(typeAxml)])
                    xmlTagIndexRangeListOfTuples.append(appearanceRangeTuple)
                # print(f"xmlTagRange: {xmlTagIndexRangeListOfTuples} ")

                grammarCheckResults = grammarCheckerFunction.check(sentenceToCheck)
                sentenceCheckedForEachHistorianDict[sentenceToCheck] = []
                if grammarCheckResults:
                    errorMessageAndOffsetHolderList = []

                    for errors in grammarCheckResults:
                        startSlice = errors.offset
                        endSlice = errors.offset+errors.errorLength
                        skipError = False #Initiate a skipError variable so that when an error appears in XML, we escape the grammar check process.
                        errorLocationInSentenceToCheck = sentenceToCheck[startSlice:endSlice]
                        
                        '''
                        Attempted at checking language to skip; does not work:

                        errorNER = None
                        if languageDetection(errorLocationInSentenceToCheck) != "en":
                            print(f"language detection result: {languageDetection(errorLocationInSentenceToCheck)}")
                            print(f"probability language: {languageDetectionProbabilities(errorLocationInSentenceToCheck)}")
                            print(f"non-english error: {errorLocationInSentenceToCheck}")
                            break'''
                        
                        # check if error is in < and >:
                        if self.inXMLBracket(errorLocationInSentenceToCheck, sentenceToCheck) == True:
                            break

                        for xmlRange in xmlTagIndexRangeListOfTuples: #iterating through the sliced strings that are encompassed by XML < > tags.
                            # print(f"xmlTagIndexRangeListOfTuples in XML check: {xmlTagIndexRangeListOfTuples}")
                            # print(f"This is xmlRange: {xmlRange}")
                            # print(f"Content of XML range: {sentenceToCheck[xmlRange[0][0]:xmlRange[0][1]]}")
                            # print(f"length of xmlRange: {len(xmlRange)}")
                            if len(xmlRange) > 0:
                                # print(f"Skip error reached here")
                                for xmlDetailedRange in xmlRange:
                                    errorInXMLTag = False

                                    # print(f"Error should be skipped?: {sentenceToCheck[xmlDetailedRange[0]:xmlDetailedRange[1]]}")
                                    if xmlDetailedRange[0] <= startSlice <= xmlDetailedRange[1] and xmlDetailedRange[0] <= endSlice <= xmlDetailedRange[1]:
                                        # print(f"Should be skipped: {sentenceToCheck[xmlDetailedRange[0]:xmlDetailedRange[1]]}\n\n\n\n\n\n skipped. \n\n\n\n\n\n")
                                        errorInXMLTag = True
                                    if errorInXMLTag == True:
                                        skipError = True
                                        break
                                if skipError == True:
                                    break
                        if skipError == True:
                            break

                        checkLocationSentence = "".join([letter if startSlice <= count < endSlice else "." for count, letter in enumerate(sentenceToCheck)])
                        correctionSuggestions = errors.replacements[:6] if len(errors.replacements) > 6 else errors.replacements
                        errorMessageAndOffsetHolderList.append([startSlice, endSlice, correctionSuggestions])

                        # print(f"For the entry for the historian {historian}: ")
                        # print(f"Error sentence: {sentenceToCheck}")
                        # print(f"Error location: {checkLocationSentence}")
                        # print(f"The possible replacements are: {errors.replacements}")
                        # print(f"Error list: {errorMessageAndOffsetHolderList} \n\n\n")
                        
                    sentenceCheckedForEachHistorianDict[sentenceToCheck] = errorMessageAndOffsetHolderList

                else: sentenceCheckedForEachHistorianDict[sentenceToCheck] = []

            self.errorMessageStorageWithSentenceDict[historian] = sentenceCheckedForEachHistorianDict
            print(f"Finished checking entry: {historian}")

        with open(self.errorMessageStorageJson, "w", encoding="utf-8") as file:
            json.dump(self.errorMessageStorageWithSentenceDict, file, ensure_ascii=False, indent=4)

    def inXMLBracket(self, errorLocationInSentenceToCheck, sentenceToCheck):
        # Checks if a spotted error is in an XML < > pair. If the error is in the bracket pair, it would return True. If not, return False.
        appearancesOfXMLBracketList = re.findall(r"<(.*?)>", sentenceToCheck)
        # print(f"content in XML brackets: {appearancesOfXMLBracketList}")
        appearanceOfErrorInXMLBracketInt = 0
        for bracketPairs in appearancesOfXMLBracketList:
            if errorLocationInSentenceToCheck in bracketPairs:
                appearanceOfErrorInXMLBracketInt += 1
        if appearanceOfErrorInXMLBracketInt == 0:
            return False
        else:
            return True
        
    # This helper function is mainly used during code testing to run the entire class object:
    def operations(self):
        # self.processJsonUnsegmented()
        # # self.sentenceSegmentation()

        self.processJsonSegmented()
        self.sentenceGrammarCheck()

if __name__ == "__main__":
    doAHContentJsonFile = "/Users/Jerry/Desktop/DictionaryOfArtHistorians/doahGrammar/doahContentJSON.json"
    nameDictionary = "/Users/Jerry/Desktop/DictionaryOfArtHistorians/doahGrammar/historianNames.json"

    doAHContentSentSegmentedJsonFile = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/doahContentSentSegmentedJSON.json"
    # doAHContentSentSegmentedJsonFile = "/Users/Jerry/Desktop/DictionaryOfArtHistorians/doahGrammar/smalldoahContentSegmentedWithoutIDNumber.json"

    smallScaleTestJson = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/smalldoahContentSegmentedWithoutIDNumber.json"
    errorMessageStorage = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/doahGrammarErrorStorageFullDictJan172025.json"

    grammarCheckSentenceLevelMachine = grammarCheckSentenceLevelPreparationForErrorMessageStorage(doAHContentJsonFile, nameDictionary, errorMessageStorage, doAHContentSentSegmentedJsonFile)

    grammarCheckSentenceLevelMachine.operations()
    # print(grammarCheckSentenceLevelMachine.errorMessageStorageWithSentenceDict)