import xml.etree.ElementTree as ET
from urllib.request import urlopen
import json
import pronto
from urllib.request import urlopen
from pronto import Ontology

tree = ET.parse(urlopen("http://www.orphadata.org/data/xml/en_product4.xml"))
root = tree.getroot()

onto = Ontology("https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo").json
data = dict(json.loads(onto))
keys = list(data)

if __name__ == "__main__":


#check if there are symptoms in correlations that are not in symptoms
    insert_file = "USE RareDiagnostics;\n\n"

    symptoms = []

    for key in keys:
        entry = data.get(key)
        symptoms.append(entry.get("id"))

    extras = []
    for disorder in root[1]:
        for symptom in disorder[0][5]:
            hp = symptom[0][0].text
            if hp not in symptoms:
                if hp not in extras:
                    print(hp)
                    extras.append(hp)
