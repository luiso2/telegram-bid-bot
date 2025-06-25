#!/usr/bin/env python3
"""
Instalador automático de Poppler para Windows
"""

import os
import sys
import urllib.request
import zipfile
import shutil
from pathlib import Path

def download_file(url, dest_path, chunk_size=8192):
    """Descargar archivo con barra de progreso"""
    try:
        with urllib.request.urlopen(url) as response:
            total_size = int(response.headers.get('content-length', 0))
            
            with open(dest_path, 'wb') as file:
                downloaded = 0
                
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    
                    file.write(chunk)
                    downloaded += len(chunk)
                    
                    if total_size > 0:
                        progress = (downloaded / total_size) * 100
                        print(f"\r📥 Descargando: {progress:.1f}%", end='', flush=True)
                
                print(f"\r📥 Descarga completada: {dest_path.name}")
                return True
                
    except Exception as e:
        print(f"\n❌ Error al descargar: {e}")
        return False

def install_poppler():
    """Instalar Poppler en Windows"""
    
    print("=" * 60)
    print("🛠️  INSTALADOR AUTOMÁTICO DE POPPLER")
    print("=" * 60)
    print()
    
    # Rutas
    project_dir = Path(__file__).parent
    poppler_dir = project_dir / "poppler"
    temp_dir = project_dir / "temp"
    
    # URL de descarga (versión estable)
    poppler_url = "https://github.com/oschwartz10612/poppler-windows/releases/download/v23.08.0-0/Release-23.08.0-0.zip"
    zip_file = temp_dir / "poppler.zip"
    
    try:
        # Crear directorio temporal
        temp_dir.mkdir(exist_ok=True)
        
        # Verificar si ya está instalado
        if poppler_dir.exists() and (poppler_dir / "bin" / "pdftoppm.exe").exists():
            print("✅ Poppler ya está instalado en el proyecto")
            return str(poppler_dir / "bin")
        
        print("📥 Descargando Poppler...")
        print(f"   URL: {poppler_url}")
        
        # Descargar Poppler
        if not download_file(poppler_url, zip_file):
            return None
        
        print("📦 Extrayendo archivos...")
        
        # Extraer ZIP
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        
        # Encontrar carpeta extraída
        extracted_dirs = [d for d in temp_dir.iterdir() if d.is_dir() and d.name.startswith("poppler")]
        
        if not extracted_dirs:
            print("❌ No se encontró la carpeta de Poppler extraída")
            return None
        
        extracted_dir = extracted_dirs[0]
        
        # Mover a la ubicación final
        if poppler_dir.exists():
            shutil.rmtree(poppler_dir)
        
        shutil.move(str(extracted_dir), str(poppler_dir))
        
        # Limpiar archivos temporales
        shutil.rmtree(temp_dir)
        
        # Verificar instalación
        bin_dir = poppler_dir / "bin"
        if not (bin_dir / "pdftoppm.exe").exists():
            print("❌ Error: pdftoppm.exe no encontrado después de la instalación")
            return None
        
        print("✅ Poppler instalado exitosamente")
        print(f"📁 Ubicación: {poppler_dir}")
        print(f"📁 Binarios: {bin_dir}")
        
        return str(bin_dir)
        
    except Exception as e:
        print(f"❌ Error durante la instalación: {e}")
        
        # Limpiar en caso de error
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
        
        return None

def main():
    """Función principal"""
    
    print("🚀 Iniciando instalación de Poppler...")
    print()
    
    bin_path = install_poppler()
    
    if bin_path:
        print()
        print("🎉 ¡POPPLER INSTALADO EXITOSAMENTE!")
        print()
        print("📋 SIGUIENTES PASOS:")
        print("1. La próxima vez que ejecutes el convertidor de PDF,")
        print("   automáticamente usará esta instalación local de Poppler")
        print("2. No necesitas agregar nada al PATH del sistema")
        print("3. Ejecuta: python convert_auction_pdf.py")
        print()
        print(f"📁 Poppler instalado en: {bin_path}")
        
        return 0
    else:
        print()
        print("❌ La instalación falló")
        print("📋 ALTERNATIVAS:")
        print("1. Instala manualmente desde: https://github.com/oschwartz10612/poppler-windows/releases")
        print("2. O usa conda: conda install -c conda-forge poppler")
        print("3. O usa chocolatey: choco install poppler")
        
        return 1

if __name__ == "__main__":
    sys.exit(main()) 