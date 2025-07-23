# This file helps to manage the JSONs under "singleHistorianErrorStorage"

import os, shutil

def directoryByNameAlphabet(singleHistorianDirectory):
    for filename in os.listdir(singleHistorianDirectory):
        file_path = os.path.join(singleHistorianDirectory, filename)

        if os.path.isfile(file_path) and filename.lower().endswith(".json"):
            first_letter = filename[0].upper()

            subdirectory = os.path.join(singleHistorianDirectory, first_letter)
            os.makedirs(subdirectory, exist_ok=True)

            shutil.move(file_path, os.path.join(subdirectory, filename))



if __name__=="__main__":
    singleHistorianDirectory = "Backend/allErrorStorageJson/singleHistorianErrorStorage"
    directoryByNameAlphabet(singleHistorianDirectory)
