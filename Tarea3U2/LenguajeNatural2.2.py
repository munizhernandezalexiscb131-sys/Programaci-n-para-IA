class DocumentoTexto:
    def __init__(self, contenido):
        self.contenido_original = contenido
        self.texto_limpio = ""
        self.frecuencias = {}

    def limpiar_texto(self):
        # Convertir a minúsculas y quitar comas y puntos
        texto = self.contenido_original.lower()
        for caracter in [",", ".", "!", "?"]:
            texto = texto.replace(caracter, "")
        self.texto_limpio = texto

    def generar_bolsa_palabras(self):
        self.limpiar_texto()
        palabras = self.texto_limpio.split()
        for p in palabras:
            self.frecuencias[p] = self.frecuencias.get(p, 0) + 1
        return self.frecuencias

#---Código Principal de Prueba--
opinion = DocumentoTexto("¡El servicio de IA fue muy rápido, muy eficiente y rápido!")
resultado = opinion.generar_bolsa_palabras()

print(f"Texto original: '{opinion.contenido_original}'")
print(f"Texto limpio: '{opinion.texto_limpio}'")
print("\nFrecuencia de palabras (Vector BoW):")
for palabra, conteo in resultado.items():
    print(f"-'{palabra}': {conteo} vez/veces")