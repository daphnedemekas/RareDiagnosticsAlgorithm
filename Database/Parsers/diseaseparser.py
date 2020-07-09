import xml.etree.ElementTree as ET
from urllib.request import urlopen
import os
os.chdir("/Users/daphnedemekas/Desktop/Rare Diagnostics/RareDiagnosticsAlgorithm")

generaltree = ET.parse(urlopen("http://www.orphadata.org/data/xml/en_product1.xml"))
generalroot = generaltree.getroot()

#geography_tree = ET.parse(urlopen("http://www.orphadata.org/data/xml/en_product9_prev.xml"))
#geo_root = geography_tree.getroot()

#info_tree = ET.parse(urlopen("http://www.orphadata.org/data/xml/en_product9_ages.xml"))
#info_root = info_tree.getroot()

#functionalconsequences_tree = ET.parse(urlopen("http://www.orphadata.org/data/xml/en_funct_consequences.xml"))
#fc_root = functionalconsequences_tree.getroot()

#insert = "INSERT INTO Diseases VALUES"
insert_synonym = "INSERT INTO DiseaseSynonyms VALUES"

if __name__ == "__main__":
    #insert_file = "USE RareDiagnostics;\n\n"
    insert_synonym_file = "USE RareDiagnostics;\n\n"
    for disorder in generalroot[1]:
        synonyms = []
        for synonym in disorder[4]:
            synonyms.append(synonym.text)
        orpha = disorder[0].text
        name = disorder[2].text
        type = disorder[5][0].text
        if disorder[9] and disorder[9][0] and disorder[9][0][0] and disorder[9][0][0][0]:
            definition =  disorder[9][0][0][0][1].text
        else:
            definition = "no definition available"

        insert_row = "('{}', '{}', '{}', '{}'),".format(orpha, name.replace("'", "`"), type.replace("'", "`"), definition.replace("'", "`"))
        for synonym in synonyms:
            insert_synonym_row = "('{}','{}'),".format(orpha, synonym.replace("'", "`"))
            insert_synonym  += insert_synonym_row + "\n"

    insert_synonym_file += insert_synonym + ";"
        #insert += insert_row + "\n"

    #insert_file += insert + ";"

    #with open("Database/insertDiseases.sql", "w+") as file:
    #     file.write(insert_file)
    with open("Database/insertDiseaseSynonyms.sql", "w+") as file:
        file.write(insert_synonym_file)
