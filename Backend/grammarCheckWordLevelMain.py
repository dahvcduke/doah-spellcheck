import json, language_tool_python
from nltk.tokenize import PunktSentenceTokenizer
from langdetect import detect, LangDetectException
import re

class errorCheckWordLevel:
    def __init__(self, jsonFilePath, nameDictionary, errorMessageStorageJson, doAHContentSentSegmentedJsonFile):
        self.jsonFilePath = jsonFilePath
        self.nameDict = nameDictionary
        self.errorMessageStorageJson = errorMessageStorageJson
        self.doAHContentSentSegmentedJsonFile = doAHContentSentSegmentedJsonFile
        self.DoAHJsonContentDict = None
        self.DoAHSentSegDict = {}
        self.foreignLanguage = "en" #default language is English.

    def processJson(self):
        with open(self.jsonFilePath, "r", encoding="utf-8") as jsonContent:
            self.DoAHJsonContentDict = json.load(jsonContent)
    
    def sentenceSegmentation(self):
        sentSegmentator = PunktSentenceTokenizer()
        for historianString, IdOverviewList in self.DoAHJsonContentDict.items():
            historianIdInt = IdOverviewList[0]
            historianOverviewString = IdOverviewList[1]
            segmentationResult = sentSegmentator.tokenize(historianOverviewString)
            singleHistorianSentSegList = [singleSentence for singleSentence in segmentationResult]
            self.DoAHSentSegDict[historianString] = [historianIdInt, singleHistorianSentSegList]

    def isForeign(self, word): #method to tell if a language is english or not, used as a helper for checkForeignSpelling
        try:
            detectedlanguage = detect(word) #check lang
            return detectedlanguage != self.foreignLanguage #is it not english?
        except:
            return False #the language is english.
        
    def checkForeignSpelling(self):
        spellCheckerFxn = language_tool_python.LanguageTool(self.foreignLanguage) 
        # tokenizes words in sentence to find foreign language words
        words = re.findall(r'\b\w+\b')
        foreignWords = [word for word in words if self.isForeign(word)] #list of words that are foreign
        
        foreignErrors = {} #dictionary of foreign spelling errors and possible replacements.
        for word in foreignWords:
            matches = spellCheckerFxn.check(word)
            if matches:
                foreignErrors[word] = matches[0].replacements
        return foreignErrors
    
    ## need to verify foreignspelling works.

    #write a method to check if names are spelled correctly. Looking thru names of people already in dict,
    # but also needs to look at artists, etc.
    def nameCheck(self, maneDictionary):
        for (id, name) in nameDictionary:
            


    def operations(self):
        self.processJson()
        self.sentenceSegmentation()

if __name__ == "__main__":
    doAHContentJsonFile = "/Users/petershum/Coding/doahGrammar/doahContentJSON.json"
    nameDictionary = "/Users/petershum/Coding/doahGrammar/historianNames.json"

    doAHContentSentSegJsonFile = "/Users/petershum/Coding/doahGrammar/doahContentSentSegmentedJSON.json"
