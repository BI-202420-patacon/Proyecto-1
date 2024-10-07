from pydantic import BaseModel

class DataModel(BaseModel):
    texto:str
    
    def columns(self):
        return ["texto"]