# 📄 PDF to Images Converter

Una aplicación de escritorio para convertir páginas de PDF en imágenes individuales.

## 🚀 Características

- **🖼️ Conversión de alta calidad**: Convierte cada página del PDF a imagen
- **⚙️ Configuración personalizable**: DPI, formato de imagen, nombres de archivo
- **📁 Organización automática**: Crea carpetas y nombra archivos secuencialmente
- **🎨 Interfaz gráfica intuitiva**: Aplicación de escritorio fácil de usar
- **📊 Progreso en tiempo real**: Barra de progreso y log detallado
- **🔧 Formatos múltiples**: PNG, JPEG, TIFF

## 📋 Requisitos

### Software necesario:
1. **Python 3.7+** - [Descargar Python](https://python.org)
2. **Poppler** - Requerido para pdf2image
   - Windows: [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases/)
   - macOS: `brew install poppler`
   - Linux: `sudo apt-get install poppler-utils`

### Dependencias Python:
- `pdf2image` - Para conversión de PDF
- `Pillow` - Para procesamiento de imágenes

## 🔧 Instalación

### Opción 1: Instalación automática (Windows)
```bash
# Ejecutar el instalador
install_dependencies.bat
```

### Opción 2: Instalación manual
```bash
# Instalar dependencias Python
pip install -r requirements.txt

# Instalar Poppler (ver requisitos arriba)
```

## 🎮 Uso

### Opción 1: Ejecutar con script (Windows)
```bash
run_pdf_converter.bat
```

### Opción 2: Ejecutar directamente
```bash
python pdf_converter.py
```

### Pasos en la aplicación:
1. **Seleccionar PDF**: Click "Browse" junto a "PDF File"
2. **Elegir carpeta de salida**: Click "Browse" junto a "Output Folder"
3. **Configurar opciones**:
   - **DPI**: Calidad de imagen (72-300)
   - **Formato**: PNG, JPEG, o TIFF
   - **Prefijo**: Nombre base para archivos (ej: "page" → page_001.png)
4. **Convertir**: Click "Convert PDF to Images"

## ⚙️ Configuraciones

### DPI (Calidad)
- **72 DPI**: Baja calidad, archivos pequeños
- **150 DPI**: Calidad media, recomendado para pantalla
- **200 DPI**: Alta calidad, recomendado para impresión
- **300 DPI**: Máxima calidad, archivos grandes

### Formatos de imagen
- **PNG**: Sin pérdida, ideal para texto y gráficos
- **JPEG**: Con compresión, ideal para fotos
- **TIFF**: Sin pérdida, ideal para archivo profesional

## 📁 Estructura de salida

```
auction_images/           # Carpeta de salida
├── page_001.png         # Página 1
├── page_002.png         # Página 2
├── page_003.png         # Página 3
└── ...
```

## 🐛 Solución de problemas

### Error: "pdf2image not found"
```bash
pip install pdf2image
```

### Error: "poppler not found"
1. Descargar [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases/)
2. Extraer a `C:\poppler`
3. Agregar `C:\poppler\Library\bin` al PATH del sistema

### Error: "Permission denied"
- Verificar que la carpeta de salida tenga permisos de escritura
- Cerrar el PDF si está abierto en otro programa

### PDF muy grande / memoria insuficiente
- Reducir el DPI (ej: usar 150 en lugar de 300)
- Procesar el PDF en secciones más pequeñas

## 🔧 Características técnicas

- **Multiproceso**: Conversión en hilo separado para no bloquear UI
- **Manejo de errores**: Validación y mensajes informativos
- **Log detallado**: Registro completo del proceso
- **Auto-detección**: Busca automáticamente el PDF del proyecto
- **Configuración persistente**: Recuerda la última configuración

## 🎯 Caso de uso: TUESDAY SAJAA AUCTION

Esta aplicación fue creada específicamente para convertir el PDF "TUESDAY SAJAA AUCTION 24-JUNE-2025.pdf" en imágenes individuales que pueden ser utilizadas en:

- **Galería web**: Mostrar cada página como imagen en el sitio
- **Aplicación móvil**: Visualizar páginas del catálogo
- **Redes sociales**: Compartir páginas individuales
- **Impresión selectiva**: Imprimir solo páginas específicas

## 📞 Soporte

Si encuentras problemas:
1. Verificar que todas las dependencias están instaladas
2. Revisar el log de la aplicación
3. Verificar permisos de archivos y carpetas
4. Asegurarse de que el PDF no esté dañado

---

Desarrollado para el proyecto Telegram Car Auction Bot 🚗