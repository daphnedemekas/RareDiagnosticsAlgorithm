import json
import pronto
from urllib.request import urlopen
from pronto import Ontology

onto = Ontology("https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo").json
data = dict(json.loads(onto))
keys = list(data)

insertsymptoms = "INSERT INTO Symptom VALUES"
insertsuperclasses = "INSERT INTO SymptomInheritance VALUES"

if __name__ == "__main__":

    insert_file1 = "USE RareDiagnosticsDB\n\n"
    insert_file2 = "USE RareDiagnosticsDB\n\n"

    for key in keys:
        entry = data.get(key)

        hp = entry.get("id")
        symptom = entry.get("name")
        definition = entry.get("desc")

        inheritance = entry.get("other")
        superclass = inheritance.get("is_a")
        subclass = inheritance.get("can_be")

        insert_row1 = "('{}', '{}', '{}'),".format(hp, symptom.replace("'", "`"), definition.replace("'", "`"))
        insertsymptoms += insert_row1 + "\n"

        if superclass:
            for s in superclass:
                insert_row2 = "('{}', '{}'),".format(s, hp)
                insertsuperclasses += insert_row2 + "\n"
        if subclass:
            for sb in subclass:
                insert_row2 = "('{}', '{}'),".format(hp, sb)
                insertsuperclasses += insert_row2 + "\n"

    insert_file1 += insertsymptoms + ";"
    insert_file2 += insertsuperclasses + ";"

    with open("Database/insertSymptoms.sql", "w+") as file:
        file.write(insert_file1)
    with open("Database/insertSymptomInheritance.sql", "w+") as file:
        file.write(insert_file2)
