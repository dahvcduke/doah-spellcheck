'''
Jan 17, 2025
'''
import json, nltk, re
from rapidfuzz import fuzz, process

class nameSpellingCheck:
    def __init__(self, nameJsonPath, analysisTextJsonPath, wordComparisonScoreThreshold):
        self.nameJsonPath = nameJsonPath
        self.analysisTextJsonPath = analysisTextJsonPath
        self.wordComparisonScoreThreshold = wordComparisonScoreThreshold
        self.nameDictionary = {
        "Abbott, Jere": [
            "Abbott, Jere",
            "Abbott",
            "Jere Abbott"
        ],
        "Abell, Walter": [
            "Abell, Walter",
            "Abell",
            "Walter Abell"
        ],
        "Abraham, Karl": [
            "Abraham, Karl",
            "Abraham",
            "Karl Abraham"
        ]}#None #This stores all historian names and their name variations


    def processNamesDictionaryJson(self, nameJsonFilePath):
        with open(nameJsonFilePath, "r", encoding = "utf-8") as jsonContent:
            nameContent = json.load(jsonContent)
        return nameContent
    
    def loadDictionaryContentToAnalayze(self, textToAnalyzeFilePath):
        with open(textToAnalyzeFilePath, "r", encoding = "utf-8") as jsonContent:
            textContent = json.load(jsonContent)
        return textContent

    def fuzzyLogicMatch(self):
        # self.nameDictionary = self.processNamesDictionaryJson(self.nameJsonPath)
        textToAnalayzeDict = self.loadDictionaryContentToAnalayze(self.analysisTextJsonPath)
        jointKeys = self.nameDictionary.keys() | textToAnalayzeDict.keys()
        errorStorageJson = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/historianNames/historianNamesSpellingErrorStorage.json"

        errorStorageBySentenceDict = {} 
        for historian in jointKeys:
            errorStorageBySentenceDict[historian] = {}
            nameListName = self.nameDictionary[historian]
            contentListName = textToAnalayzeDict[historian]
            for sentence in contentListName:
                splittedSentence = self.splitSentence(sentence)
                sentenceIssueStorage = []
                for wordPositionList in splittedSentence:
                    word = wordPositionList[2]
                    if len(word) > 1:
                        matchList = self.wordMatch(word, historian, nameListName) #matchWord: list, score: integer
                        if matchList:
                            wordPositionList[2] = []
                            sentenceIssueStorage.append(wordPositionList)
                errorStorageBySentenceDict[historian][sentence] = sentenceIssueStorage
            print(errorStorageBySentenceDict[historian])
        with open(errorStorageJson, "w", encoding="utf-8") as jsonStorage:
            json.dump(errorStorageBySentenceDict, jsonStorage, indent=4)

    def splitSentence(self, sentence):
        result = []
        for match in re.finditer(r'\S+', sentence):
            start = match.start()
            end = match.end()
            word = match.group()
            result.append([start, end, word])
        return result
    
    def wordMatch(self, wordToCheck, historianName, nameListName):
        topMatches = []
        for subName in nameListName:
            score = fuzz.partial_ratio(wordToCheck, subName)
            if score > self.wordComparisonScoreThreshold and score < 100:
                # print(f"This is subName: {subName}")
                # print(f"This is the word we are checking: {wordToCheck}")
                topMatches = [subName, wordToCheck, score]
        return topMatches

    def operations(self):
        self.fuzzyLogicMatch()

if __name__ == "__main__":
    nameJsonDict = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/historianNames/historianNamesForComparison.json"
    analysisTextJsonPath = "/Users/Jerry/Desktop/DH proj-reading/DictionaryOfArtHistorians/doahGrammar/unfinishedRevisedDictionaryErrors2024-11-22.json"
    nameCheckSimilarityThreshold = 75
    nameSpellingCheckMachine = nameSpellingCheck(nameJsonDict, analysisTextJsonPath, nameCheckSimilarityThreshold)
    nameSpellingCheckMachine.operations()