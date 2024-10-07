from joblib import load

class Model:
    def __init__(self, columns) -> None:
        self.model = load('modelo_Proyecto1.pkl')
    
    def make_preditions(self, data):
        result = self.model.predict(data)
        return result