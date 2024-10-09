from typing import Optional
from fastapi import FastAPI, File, UploadFile
from joblib import load
import pandas as pd
from preprocesamiento import prep 

from DataModel import DataModel

app = FastAPI()


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
    return {"prediction": result.tolist()[0]}

@app.post("/predictCSV")
def make_predictions_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    df = prep(df)
    model = load("modelo_Proyecto1.joblib")
    result = model.predict(df)
    return {"prediction": result.tolist()}
