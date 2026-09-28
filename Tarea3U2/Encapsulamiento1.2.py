import random
class SensorTemperatura:
  def __init__(self, ubicacion):
    self.ubicacion = ubicacion
    self._temperatura = 20.0 # Atributo protegido
  def leer_temperatura(self):
    # Simular variación de temperatura ambiental
    variacion = random.uniform(-1.5, 2.5)
    self._temperatura = round(self._temperatura + variacion, 1)
    return self._temperatura
class TermostatoInteligente:
  def __init__(self, umbral=25.0):
    self.umbral = umbral
  def evaluar_clima(self, temp_actual):
    print(f"Temperatura recibida: {temp_actual}°C")
    if temp_actual > self.umbral:
      print(" [ACTUADOR] ¡Atención! Temperatura alta. Encendiendo aire acondicionado.")
    else:
      print(" [ACTUADOR] Temperatura óptima. Apagando aire acondicionado.")
#---Código Principal de Prueba-
sensor = SensorTemperatura("Laboratorio de IA")
termostato = TermostatoInteligente(umbral=22.0)
for lectura in range(1, 4):
  print(f"\n--- Lectura #{lectura}---")
  temp = sensor.leer_temperatura()
  termostato.evaluar_clima(temp)