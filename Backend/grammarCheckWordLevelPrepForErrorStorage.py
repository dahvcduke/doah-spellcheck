import json, language_tool_python
from nltk.tokenize import word_tokenize
import re

class GrammarCheckWordLevel:
    def __init__(self, jsonFilePath, nameDictionary, wordErrorStorageJson):
        self.jsonFilePath = jsonFilePath
        self.nameDict = nameDictionary
        self.errorMessageStorageJson = errorMessageStorageJson
        self.doAHContentSentSegmentedJsonFile = doAHContentSentSegmentedJsonFile
        self.segmentedContectDict = None
        self.DoAHSentSegDict = {}

    def processSegmentedJson(self):
        with open(self.segmentedJsonFile, "r", encoding = "utf-8") as jsonFile:
            self.segmentedContectDict = json.load(jsonFile)

    def wordLevelGramSpellCheck(self):
        grammarChecker = language_tool_python.LanguageTool("en-US")
            



