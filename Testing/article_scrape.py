
from csv import reader
import os
import re
import requests
import string
import urllib3
import mysql
from bs4 import BeautifulSoup, Tag
import mysql.connector
from mysql.connector import Error
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


page = requests.get("https://www.cureus.com/articles/31800-adult-onset-stills-disease-typical-presentation-delayed-diagnosis", verify=False)
soup = BeautifulSoup(page.text, 'html.parser')
text = soup.findAll('div',attrs={'class':'article-content-body'})
casereport = text[1].text


def getSymptoms():
    symptoms= []

    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='RareDiagnostics',
                                             user='root',
                                             password='')

        sql_select_Query = "select * from Symptom"
        cursor = connection.cursor()
        cursor.execute(sql_select_Query)
        records = cursor.fetchall()
        for row in records:
            symptoms.append(row[1])
    except Error as e:
        print("Error reading data from MySQL table", e)
    finally:
        if (connection.is_connected()):
            connection.close()
            cursor.close()

    return symptoms

symptomlist = []

symptoms = getSymptoms()
for symptom in symptoms:
    if symptom.lower() in casereport.lower():
        symptomlist.append(symptom)
        print(symptom)

print(symptomlist)
