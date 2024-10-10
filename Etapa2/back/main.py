from typing import Optional
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from joblib import load
import pandas as pd
from preprocesamiento import prep 
from fastapi.middleware.cors import CORSMiddleware
from DataModel import DataModel
import train_model

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
   return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
   return {"item_id": item_id, "q": q}

@app.post("/predictText")
def make_predictions(dataModel: DataModel):
    df = pd.DataFrame(dataModel.dict(), columns=dataModel.dict().keys(), index=[0])
    df.columns = dataModel.columns()
    model = load("modelo_Proyecto1.joblib")
    result = model.predict(df["texto"])
    probabilidad= model.predict_proba(df["texto"])
    classes = model.classes_
    prob_predicted_class = [
        prob[list(classes).index(pred)] for prob, pred in zip(probabilidad, result)
    ]
    return [{"Textos_espanol":df["texto"].iloc[0], 'ods':result.tolist()[0], 'probabilidad':prob_predicted_class[0]}]

@app.post("/predictCSV")
async def make_predictions_csv(file: UploadFile = File(...), variable_objetivo: Optional[str] = 'sdg'):
    # Cargar el archivo y leer el DataFrame
    df = pd.read_excel(file.file, engine='openpyxl')
    df_text = df['Textos_espanol']

    # Generar el classification_report
    classification_report = train_model.crearPipe(df, variable_objetivo)

    # Cargar el modelo previamente entrenado
    model = load("modelo_Proyecto1.joblib")

    # Hacer predicciones
    predictions = model.predict(df_text)
    probabilities = model.predict_proba(df_text)

    classes = model.classes_

    prob_predicted_class = [
        prob[list(classes).index(pred)] for prob, pred in zip(probabilities, predictions)
    ]

    df['ods'] = predictions
    df['probabilidad'] = prob_predicted_class

    elegidos = ['Textos_espanol', 'ods', 'probabilidad']
    df = df[elegidos]

    return {
        "predictions": df.to_dict(orient="records"),
        "classification_report": classification_report
    }


