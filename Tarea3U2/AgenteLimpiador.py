class AgenteLimpiador:
  def __init__(self, nombre):
    self.nombre = nombre
    self.nivel_bateria = 100
    self.habitacion_actual = "Entrada"
  def percibir_y_actuar(self, habitacion, esta_sucia):
    self.habitacion_actual = habitacion
    print(f"[{self.nombre}] Inspeccionando habitación: {habitacion}")
    if self.nivel_bateria <= 10:
      print(f"--> Batería muy baja ({self.nivel_bateria}%). ¡Regresando a recargar!")
      return
    if esta_sucia:
      print(f"--> Se detectó suciedad. Limpiando {habitacion}...")
      self.nivel_bateria-= 10
      print(f"--> ¡Habitación limpia! Batería restante: {self.nivel_bateria}%")
    else:
      print(f"--> La habitación {habitacion} ya está limpia. Sin acción.")
#--- Código Principal de Prueba--
robot = AgenteLimpiador("Robot-IA-1")
# Entorno de prueba: lista de (Habitacion, EstaSucia)
habitaciones = [("Sala", True), ("Cocina", False), ("Dormitorio", True)]
for habitacion, sucia in habitaciones:
  robot.percibir_y_actuar(habitacion, sucia)