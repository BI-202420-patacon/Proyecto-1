import inflect
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')
import pandas as pd
import numpy as np
import sys
import re, string, unicodedata
from nltk import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
from sklearn.model_selection import train_test_split,GridSearchCV
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer, TfidfTransformer
from sklearn.metrics import ConfusionMatrixDisplay
import spacy
from joblib import dump, load

from preprocesamiento import prep 

from sklearn.pipeline import Pipeline, FunctionTransformer

def crearPipe(archivo, variable_objetivo):
    entrevistasODS = archivo
    X_data, y_data = entrevistasODS['Textos_espanol'], entrevistasODS[variable_objetivo]
    X_train, X_test, y_train, y_test = train_test_split(X_data, y_data, test_size=0.3, random_state=42)
    # Crear el pipeline
    pipe = Pipeline([
        ('limpieza', FunctionTransformer(prep, validate=False)),
        ('Agrupacion', CountVectorizer()),
        ('Regresion', SVC(kernel="linear", probability=True))
    ])
    pipe.fit(X_train, y_train).score(X_test, y_test)

    y_pred = pipe.predict(X_test)
    
    dump(pipe, 'modelo_Proyecto1.joblib', compress=3)
    print("Modelo guarddo exitosamente.")
    return classification_report(y_test, y_pred)