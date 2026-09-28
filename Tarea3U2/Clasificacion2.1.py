import math
class Inmueble:
    def __init__(self, m2, cuartos, categoria="Desconocida"):
        self.m2 = m2
        self.cuartos = cuartos
        self.categoria = categoria

    def calcular_distancia(self, otro_inmueble):
        # Formula de distancia euclidiana
        d_m2 = (self.m2 - otro_inmueble.m2) ** 2
        d_cuartos = (self.cuartos - otro_inmueble.cuartos) ** 2
        return math.sqrt(d_m2 + d_cuartos)

# Casas con categoría conocida
casa_economica = Inmueble(m2=50, cuartos=2, categoria="Económica")
casa_lujo = Inmueble(m2=200, cuartos=5, categoria="Lujo")
# Casa nueva sin clasificar
casa_nueva = Inmueble(m2=60, cuartos=2)
dist_eco = casa_nueva.calcular_distancia(casa_economica)
dist_lujo = casa_nueva.calcular_distancia(casa_lujo)
print(f"Distancia a Casa Económica: {dist_eco:.2f}")
print(f"Distancia a Casa de Lujo: {dist_lujo:.2f}")

if dist_eco < dist_lujo:
    casa_nueva.categoria = casa_economica.categoria
else:
    casa_nueva.categoria = casa_lujo.categoria
print(f"--> La casa nueva se clasifica como: {casa_nueva.categoria}")