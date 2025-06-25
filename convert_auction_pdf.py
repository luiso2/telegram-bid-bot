#!/usr/bin/env python3
"""
Convertidor automático del PDF de subasta a imágenes
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

def convert_auction_pdf():
    """
    Convertir automáticamente el PDF de subasta a imágenes
    """
    
    if not PDF2IMAGE_AVAILABLE:
        log_message("❌ Error: pdf2image no está instalado")
        log_message("   Asegúrate de que el entorno virtual esté activo")
        return False
    
    # Configuración fija
    current_dir = Path(__file__).parent
    pdf_path = current_dir / "TUESDAY SAJAA AUCTION 24-JUNE-2025.pdf"
    output_dir = current_dir / "auction_images"
    dpi = 200
    format_type = "PNG"
    prefix = "auction_page"
    
    # Verificar que el PDF existe
    if not pdf_path.exists():
        log_message(f"❌ Error: PDF no encontrado: {pdf_path}")
        return False
    
    # Crear carpeta si no existe
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        print("=" * 60)
        print("🏁 CONVERTIDOR AUTOMÁTICO DE PDF DE SUBASTA")
        print("=" * 60)
        print()
        
        log_message("🚀 Iniciando conversión automática...")
        log_message(f"📄 PDF: {pdf_path.name}")
        log_message(f"📁 Carpeta de salida: {output_dir}")
        log_message(f"🎨 Configuración: {dpi} DPI, formato {format_type}")
        
        # Limpiar carpeta de salida si existe
        if output_dir.exists():
            for file in output_dir.glob("*"):
                if file.is_file():
                    file.unlink()
            log_message("🧹 Carpeta de salida limpiada")
        
        # Verificar instalación local de Poppler
        poppler_path = None
        local_poppler_paths = [
            current_dir / "poppler" / "bin",
            current_dir / "poppler" / "Library" / "bin"
        ]
        
        for path in local_poppler_paths:
            if path.exists() and (path / "pdftoppm.exe").exists():
                poppler_path = str(path)
                log_message(f"🔧 Usando Poppler local: {poppler_path}")
                break
        
        # Convertir PDF
        log_message("🔄 Convirtiendo páginas del PDF...")
        if poppler_path:
            images = convert_from_path(str(pdf_path), dpi=dpi, poppler_path=poppler_path)
        else:
            images = convert_from_path(str(pdf_path), dpi=dpi)
        
        total_pages = len(images)
        log_message(f"📑 Encontradas {total_pages} páginas")
        
        if total_pages == 0:
            log_message("❌ No se encontraron páginas en el PDF")
            return False
        
        # Guardar imágenes
        print()
        log_message("💾 Guardando imágenes...")
        for i, image in enumerate(images, 1):
            filename = f"{prefix}_{i:03d}.{format_type.lower()}"
            image_path = output_dir / filename
            
            # Optimizar imagen
            if format_type.lower() == 'jpeg':
                image.save(image_path, format_type.upper(), quality=95, optimize=True)
            else:
                image.save(image_path, format_type.upper())
            
            # Mostrar progreso
            progress = (i / total_pages) * 100
            log_message(f"💾 [{progress:5.1f}%] Guardado: {filename}")
        
        print()
        log_message("✅ ¡Conversión completada exitosamente!")
        log_message(f"📁 Imágenes guardadas en: {output_dir}")
        log_message(f"📊 Total de imágenes: {total_pages}")
        
        # Mostrar resumen de archivos
        print("\n" + "=" * 60)
        print("📋 RESUMEN DE ARCHIVOS CREADOS:")
        print("=" * 60)
        
        image_files = sorted(output_dir.glob(f"{prefix}_*.{format_type.lower()}"))
        for img_file in image_files:
            size_mb = img_file.stat().st_size / (1024 * 1024)
            print(f"📄 {img_file.name} ({size_mb:.2f} MB)")
        
        total_size = sum(f.stat().st_size for f in image_files) / (1024 * 1024)
        print(f"\n📦 Tamaño total: {total_size:.2f} MB")
        print(f"📁 Ubicación: {output_dir}")
        
        return True
        
    except Exception as e:
        log_message(f"❌ Error durante la conversión: {str(e)}")
        log_message(f"   Tipo de error: {type(e).__name__}")
        
        # Sugerencias de solución
        if "poppler" in str(e).lower():
            print("\n" + "=" * 60)
            print("🛠️  SOLUCIÓN REQUERIDA:")
            print("=" * 60)
            print("El error indica que Poppler no está instalado.")
            print("Para solucionarlo:")
            print("1. Descarga Poppler desde: https://poppler.freedesktop.org/")
            print("2. O instala con conda: conda install -c conda-forge poppler")
            print("3. O en Windows, descarga desde: https://github.com/oschwartz10612/poppler-windows/releases")
            print("4. Agrega la carpeta 'bin' de Poppler al PATH del sistema")
        
        return False

def main():
    """Función principal"""
    
    # Verificar entorno virtual
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Advertencia: No se detectó entorno virtual activo")
        print("   Se recomienda activar el entorno virtual con: venv\\Scripts\\activate")
        print()
    
    success = convert_auction_pdf()
    
    if success:
        print("\n🎉 ¡CONVERSIÓN COMPLETADA EXITOSAMENTE!")
        print("Las imágenes están listas para usar en la aplicación.")
    else:
        print("\n❌ La conversión falló. Revisa los errores mostrados arriba.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 