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


nlp = spacy.load("es_core_news_sm")

stemmer = SnowballStemmer('spanish')
def remove_non_ascii(words):
    """Remove non-ASCII characters from list of tokenized words"""
    new_words = []
    for word in words:
        if word is not None:
          new_word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore')
          new_words.append(new_word)
    return new_words

def to_lowercase(words):
    new_words=[]
    for word in words:
        w= word.lower()
        new_words.append(w)
    return new_words

def remove_punctuation(words):
    """Remove punctuation from list of tokenized words"""
    new_words = []
    for word in words:
        if word is not None:
            new_word = re.sub(r'[^\w\s]', '', word)
            if new_word != '':
                new_words.append(new_word)
    return new_words

def replace_numbers(words):
    """Replace all interger occurrences in list of tokenized words with textual representation"""
    p = inflect.engine()    
    new_words = []
    for word in words:
        if word.isdigit():
            new_word = p.number_to_words(word)
            new_words.append(new_word)
        else:
            new_words.append(word)
    return new_words

def remove_stopwords(words):
    spanish_sw = set(stopwords.words('spanish'))
    new_words = []
    for word in words:
        if word not in spanish_sw:
            new_words.append(word)
    return new_words


def preprocessing(words):
    words = to_lowercase(words)
    words = replace_numbers(words)
    words = remove_punctuation(words)
    words = remove_non_ascii(words)
    words = remove_stopwords(words)
    return words
def stem_words(words):
    """Stem words in list of tokenized words"""
    stemmed_words = [stemmer.stem(word) for word in words]
    return stemmed_words

def stem_and_lemmatize(words):
    stems = stem_words(words)
    return stems

def prep(X):
    # Asegúrate de que X sea una Serie de texto y filtra los valores nulos
    X = X.dropna()
    
    # Aplicar word_tokenize solo si es texto (cadena)
    X = X.apply(lambda x: word_tokenize(x) if isinstance(x, str) else [])
    
    # Verifica que no existan listas vacías antes de aplicar procesamiento
    X = X.apply(lambda x: x if len(x) > 0 else [''])

    # Aplicar el preprocesamiento a cada texto
    X = X.apply(preprocessing)
    
    # Aplicar stemming/lematización
    X = X.apply(stem_and_lemmatize)
    
    # Verifica que el resultado no sea vacío antes de volver a convertirlo en cadena
    X = X.apply(lambda x: ' '.join(map(str, x)) if len(x) > 0 else '')
    
    return X

