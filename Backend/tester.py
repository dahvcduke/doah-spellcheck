'''This file is intended to test functions only. Use this as scratch paper.'''
# list = [[1,2], [3,4], [5,6]]

# for one, two in list:
#     print(f"This is {one}; this is {two}")
import language_tool_python, json
from nltk.tokenize import PunktSentenceTokenizer

grammarChecker = language_tool_python.LanguageTool("en-US")

sentences = "Authority in Byzantine, Medieval, Russian, and primitive decorative arts; curator. Ross was born to William Edwin Ross (1870-1945) and Mary Katherine Rogers (Ross) (1875-1939) in Moriches, New York. He studied at the University of Berlin during the summer of 1927. Ross received an A.B. in 1928 and an M.A. in 1930 from Harvard University. During his M.A., he worked as an instructor in Fine Arts at the University of Pittsburgh (1928-1929). In 1930, he began his Ph.D. under <a href=\"/chaseg\">George H. Chase</a> on Romanesque enamels, presumably left unfinished, as often happened at that time. He also studied at the Centro de Estudios Históricos in Madrid (1930), and New York University (1933-34, 1937). Ross was as an assistant at the Brooklyn Museum in 1934. The same year, he joined the Walters Art Gallery (now the Walters Art Museum) in Baltimore as a research assistant, becoming the Associate Curator of Byzantine and Medieval Art in 1937, later adding Decorative Arts.\n\nDuring World War II, Ross first enlisted in the U.S. Marine Corps in 1942 and then was selected by <a href=\"https://arthistorians.info/webbg/\">Geoffrey Webb</a> to assist with administrative work for the Monuments, Fine Arts, and Archives (MFAA) Section, known as the Monuments Men. In 1944, Ross discovered the panels of the famous Isenheim Altarpiece by Matthias Grünewald in occupied Alsace. Upon returning to the United States, Ross resumed his role as Associate Curator at the Walters. In 1947, he organized the first major exhibition of Early Christian and Byzantine Art in the U.S. at the Baltimore Museum of Art.\n\nHe moved to California in 1952 to head the Art Department at the Los Angeles County Museum of Art (LACMA). Ross collaborated with <a href=\"https://arthistorians.info/kinge/\">Edward S. King</a> on a book, <i>Catalogue of the American Works of Art: including French Medals made for America [in] the Walters Art Gallery</i>, which was published in 1956. In 1958, art collector Marjorie Merriweather Post (1887-1973) appointed him Chief Curator of her collection of eighteenth-century French and Imperial Russian at Post's private art collection and grounds, Hillwood, Washington, D.C.\n\nRoss was a Fulbright Lecturer on Byzantine art at the Kunsthistorisches Institute at the University of Vienna (1960-1961). He authored the first two volumes of the <i>Catalogue of the Byzantine and Early Medieval Antiquities</i> at Dumbarton Oaks, published in 1962 and 1965, covering metalwork, ceramics, glass, jewelry, enamels, and glyptics. <a href=\"https://arthistorians.info/weitzmannk/\">Kurt Weitzmann</a> authored the third volume, focusing on ivories and steatites. In 1965, Ross spent the rest of his life at the Virginia Museum of Fine Arts in Richmond, devoting himself to making the museum’s collection of medieval and Byzantine art one of the best in the United States. That same year, he published <i>The Art of Karl Fabergé and His Contemporaries</i>, a catalog of the Post collection, followed by <i>Russian Porcelains</i> in 1969. Ross died in 1977, leaving two books and a catalog for an upcoming exhibition at the Metropolitan Museum of Art unfinished. Ross's wife, Lotus Bobb (Ross) (1893-1969), was a Broadway actress.\n\nRoss made groundbreaking contributions to Byzantine, Medieval art and Russian art. His work <i>Catalogue of the Byzantine and Early Medieval Antiquities at Dumbarton Oaks</i> was \"a model of its kind\" (Beckwith). In addition, <i>The Art of Karl Fabergé and His Contemporaries </i>further the discourse on lesser-known Russian artists such as Fabergé, despite Sprague's criticism of the book as a \"glorified catalogue of part of the personal collection of Mrs. Marjorie Merriweather Post.\" Ross's summaries \"are admirably succinct, and his authority is marked throughout.\"(Beckwith)\n\nRoss was a Guggenheim fellow four times, a member of the American Association of Museums, the Archaeological Institute of America, and the committee of Hammond-Harwood House."


# sentSegmentator = PunktSentenceTokenizer()
# segmentationResult = sentSegmentator.tokenize(sentences)

# for e in segmentationResult:
#     print(e)


# sentenceTestShort = ["Rocket is lunching.", "She were ging to the market", "They has completed their work."]
sentenceTestShort = ["Rocket is lunching.", "She have going to the market", "They have completed their work."]

for sentenceCount, sentenceToCheck in enumerate(sentenceTestShort, start=1):
    results = grammarChecker.check(sentenceToCheck)
    listtest = []
    if results:

        for errors in results:
            listtest.append(errors.offset)
            startSlice = errors.offset
            endSlice = errors.offset+errors.errorLength+1
            checkLocationSentence = "".join([letter if startSlice <= count < endSlice else "." for count, letter in enumerate(sentenceToCheck)])
            print(errors.replacements)
            print(f"Error sentence: {sentenceToCheck}")
            print(f"Error location: {checkLocationSentence}")
    else:
        print("test")
    print(listtest)



sentencetest2 = "I hs food tonight and it will good."
result = grammarChecker.check(sentencetest2)
listHolder = []
if result:
    print(f"Real result: {result}")
    for errors in result:
        var = errors.replacements
        listHolder.append(var)
print(f"Real test {listHolder}")


with open("/Users/Jerry/Desktop/DictionaryOfArtHistorians/doahGrammar/doahGrammarErrorStorage.json", "r") as file:
    file1 = json.load(file)
    for a, b in file1:
        print(b)

    # print(f"Error for sentence # {sentenceCount} -- {sentenceToCheck}:")
    # for individualError in results:
        # print(f"RuleId: {individualError.replacements[0]}")

