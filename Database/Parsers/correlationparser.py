import xml.etree.ElementTree as ET
from urllib.request import urlopen
import os

tree = ET.parse(urlopen("http://www.orphadata.org/data/xml/en_product4.xml"))
root = tree.getroot()
insert = "INSERT INTO Correlation VALUES"

if __name__ == "__main__":
    insert_file = "USE RareDiagnostics;\n\n"
    correlations = []

    for disorder in root[1]:

        orpha = disorder[0][0].text
        disease = disorder[0][2].text

        for symptom in disorder[0][5]:
            hp = symptom[0][0].text
            if hp ==  "HP:0008220":
                continue
            name = symptom[0][1].text
            frequencytext = symptom[1][0].text

            if frequencytext == "Obligate (100%)":
                frequency = 1

            elif frequencytext == "Very frequent (99-80%)":
                frequency = (99+80)/200

            elif frequencytext == "Frequent (79-30%)":
                frequency = (79+30)/200

            elif frequencytext == "Occasional (29-5%)":
                frequency = (29+5)/200

            elif frequencytext == "Very rare (<4-1%)":
                frequency = (4+1)/200

            elif frequencytext == "Excluded (0%)":
                continue

            else:
                print(frequencytext)


            insert_row = "('{}','{}','{}'),".format(orpha, hp, frequency)
            insert += insert_row + "\n"
    insert_file += insert + ";"

    with open("Database/insertCorrelations.sql", "w+") as file:
        file.write(insert_file)
