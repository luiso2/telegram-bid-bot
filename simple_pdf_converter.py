#!/usr/bin/env python3
"""
Simple PDF to Images Converter (Command Line)
Versión simplificada sin interfaz gráfica
"""

import os
import sys
from pathlib import Path
from datetime import datetime

try:
    from pdf2image import convert_from_path
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False

def log_message(message):
    """Imprimir mensaje con timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def convert_pdf_to_images(pdf_path, output_dir=None, dpi=200, format_type="PNG", prefix="page"):
    """
    Convertir PDF a imágenes
    
    Args:
        pdf_path (str): Ruta del archivo PDF
        output_dir (str): Carpeta de salida (opcional)
        dpi (int): Calidad en DPI (default: 200)
        format_type (str): Formato de imagen (PNG, JPEG, TIFF)
        prefix (str): Prefijo para nombres de archivo
    """
    
    if not PDF2IMAGE_AVAILABLE:
        log_message("❌ Error: pdf2image no está instalado")
        log_message("   Instalar con: pip install pdf2image")
        log_message("   También necesitas poppler-utils instalado")
        return False
    
    # Verificar que el PDF existe
    pdf_file = Path(pdf_path)
    if not pdf_file.exists():
        log_message(f"❌ Error: PDF no encontrado: {pdf_path}")
        return False
    
    # Configurar carpeta de salida
    if output_dir is None:
        output_dir = pdf_file.parent / "auction_images"
    else:
        output_dir = Path(output_dir)
    
    # Crear carpeta si no existe
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        log_message("🚀 Iniciando conversión...")
        log_message(f"📄 PDF: {pdf_file.name}")
        log_message(f"📁 Salida: {output_dir}")
        log_message(f"🎨 Configuración: {dpi} DPI, formato {format_type}")
        
        # Convertir PDF
        log_message("🔄 Convirtiendo páginas...")
        images = convert_from_path(str(pdf_file), dpi=dpi)
        
        total_pages = len(images)
        log_message(f"📑 Encontradas {total_pages} páginas")
        
        # Guardar imágenes
        for i, image in enumerate(images, 1):
            filename = f"{prefix}_{i:03d}.{format_type.lower()}"
            image_path = output_dir / filename
            
            # Optimizar según formato
            if format_type.lower() == 'jpeg':
                image.save(image_path, format_type.upper(), quality=95, optimize=True)
            else:
                image.save(image_path, format_type.upper())
            
            log_message(f"💾 Guardado: {filename}")
        
        log_message(f"✅ ¡Conversión completada exitosamente!")
        log_message(f"📁 Imágenes guardadas en: {output_dir}")
        log_message(f"📊 Total de imágenes: {total_pages}")
        
        return True
        
    except Exception as e:
        log_message(f"❌ Error durante la conversión: {str(e)}")
        return False

def main():
    """Función principal"""
    print("=" * 50)
    print("📄 PDF to Images Converter (Simple)")
    print("=" * 50)
    print()
    
    # Buscar PDF por defecto
    current_dir = Path(__file__).parent
    default_pdf = current_dir / "TUESDAY SAJAA AUCTION 24-JUNE-2025.pdf"
    
    if default_pdf.exists():
        log_message(f"📄 PDF encontrado: {default_pdf.name}")
        pdf_path = str(default_pdf)
    else:
        # Solicitar ruta del PDF
        print("PDF por defecto no encontrado.")
        pdf_path = input("Ingresa la ruta del archivo PDF: ").strip()
        
        if not pdf_path:
            log_message("❌ No se proporcionó ruta del PDF")
            return
    
    # Configuración por defecto
    output_dir = current_dir / "auction_images"
    dpi = 200
    format_type = "PNG"
    prefix = "page"
    
    # Preguntar si quiere cambiar configuración
    print("\nConfiguración actual:")
    print(f"  📁 Carpeta de salida: {output_dir}")
    print(f"  🎨 DPI: {dpi}")
    print(f"  📄 Formato: {format_type}")
    print(f"  🏷️ Prefijo: {prefix}")
    print()
    
    change_config = input("¿Cambiar configuración? (y/n): ").lower().strip()
    
    if change_config == 'y':
        # Cambiar configuración
        new_output = input(f"Carpeta de salida [{output_dir}]: ").strip()
        if new_output:
            output_dir = Path(new_output)
        
        new_dpi = input(f"DPI [{dpi}]: ").strip()
        if new_dpi and new_dpi.isdigit():
            dpi = int(new_dpi)
        
        new_format = input(f"Formato (PNG/JPEG/TIFF) [{format_type}]: ").strip().upper()
        if new_format in ["PNG", "JPEG", "TIFF"]:
            format_type = new_format
        
        new_prefix = input(f"Prefijo [{prefix}]: ").strip()
        if new_prefix:
            prefix = new_prefix
    
    print()
    log_message("Iniciando conversión con la configuración seleccionada...")
    
    # Ejecutar conversión
    success = convert_pdf_to_images(
        pdf_path=pdf_path,
        output_dir=output_dir,
        dpi=dpi,
        format_type=format_type,
        prefix=prefix
    )
    
    if success:
        print()
        print("🎉 ¡Conversión completada exitosamente!")
        print(f"📁 Las imágenes están en: {output_dir}")
    else:
        print()
        print("❌ La conversión falló. Revisa los errores arriba.")
    
    input("\nPresiona Enter para salir...")

if __name__ == "__main__":
    main()