class EstrategiaPromedio:
  def predecir(self, datos):
    # Predice usando la media aritmética
    return sum(datos) / len(datos)
class EstrategiaMaximo:
  def predecir(self, datos):
    # Predice tomando el valor máximo histórico
    return max(datos)
class PredictorIA:
  def __init__(self, estrategia):
    self.estrategia = estrategia
  def cambiar_estrategia(self, nueva_estrategia):
    self.estrategia = nueva_estrategia
  def realizar_prediccion(self, datos):
    return self.estrategia.predecir(datos)
#--- Código Principal de Prueba--
temperaturas_semana = [22.0, 24.5, 21.0, 25.0, 23.5]
# Usar estrategia de promedio
predictor = PredictorIA(EstrategiaPromedio())
pred_prom = predictor.realizar_prediccion(temperaturas_semana)
print(f"Predicción (Estrategia Promedio): {pred_prom:.2f}°C")
# Cambiar a estrategia conservadora (máximo)
predictor.cambiar_estrategia(EstrategiaMaximo())
pred_max = predictor.realizar_prediccion(temperaturas_semana)
print(f"Predicción (Estrategia Máxima): {pred_max:.2f}°C")