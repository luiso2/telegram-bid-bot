#!/usr/bin/env python3
"""
PDF to Images Converter
Aplicación de escritorio para convertir páginas de PDF a imágenes
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import os
import sys
from pathlib import Path
import threading
import time
from datetime import datetime

# Importaciones condicionales para manejo de errores
try:
    from pdf2image import convert_from_path
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

class PDFConverterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("PDF to Images Converter")
        self.root.geometry("600x500")
        self.root.resizable(True, True)
        
        # Variables
        self.pdf_path = tk.StringVar()
        self.output_folder = tk.StringVar()
        self.dpi_var = tk.IntVar(value=200)
        self.format_var = tk.StringVar(value="PNG")
        self.prefix_var = tk.StringVar(value="page")
        self.is_converting = False
        
        # Configurar la interfaz
        self.setup_ui()
        
        # Verificar dependencias
        self.check_dependencies()
        
        # Configurar PDF por defecto
        self.set_default_pdf()
    
    def setup_ui(self):
        """Configurar la interfaz de usuario"""
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configurar grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        
        # Título
        title_label = ttk.Label(main_frame, text="📄 PDF to Images Converter", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # Selección de PDF
        ttk.Label(main_frame, text="PDF File:").grid(row=1, column=0, sticky=tk.W, pady=5)
        ttk.Entry(main_frame, textvariable=self.pdf_path, width=50).grid(row=1, column=1, sticky=(tk.W, tk.E), pady=5, padx=(5, 5))
        ttk.Button(main_frame, text="Browse", command=self.browse_pdf).grid(row=1, column=2, pady=5)
        
        # Carpeta de salida
        ttk.Label(main_frame, text="Output Folder:").grid(row=2, column=0, sticky=tk.W, pady=5)
        ttk.Entry(main_frame, textvariable=self.output_folder, width=50).grid(row=2, column=1, sticky=(tk.W, tk.E), pady=5, padx=(5, 5))
        ttk.Button(main_frame, text="Browse", command=self.browse_output).grid(row=2, column=2, pady=5)
        
        # Configuraciones
        config_frame = ttk.LabelFrame(main_frame, text="Configuration", padding="10")
        config_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=10)
        config_frame.columnconfigure(1, weight=1)
        
        # DPI
        ttk.Label(config_frame, text="DPI (Quality):").grid(row=0, column=0, sticky=tk.W, pady=2)
        dpi_frame = ttk.Frame(config_frame)
        dpi_frame.grid(row=0, column=1, sticky=(tk.W, tk.E), pady=2)
        ttk.Scale(dpi_frame, from_=72, to=300, variable=self.dpi_var, orient=tk.HORIZONTAL).grid(row=0, column=0, sticky=(tk.W, tk.E), padx=(5, 10))
        ttk.Label(dpi_frame, textvariable=self.dpi_var).grid(row=0, column=1)
        dpi_frame.columnconfigure(0, weight=1)
        
        # Formato
        ttk.Label(config_frame, text="Format:").grid(row=1, column=0, sticky=tk.W, pady=2)
        format_combo = ttk.Combobox(config_frame, textvariable=self.format_var, values=["PNG", "JPEG", "TIFF"], state="readonly")
        format_combo.grid(row=1, column=1, sticky=tk.W, pady=2, padx=(5, 0))
        
        # Prefijo
        ttk.Label(config_frame, text="Filename Prefix:").grid(row=2, column=0, sticky=tk.W, pady=2)
        ttk.Entry(config_frame, textvariable=self.prefix_var, width=20).grid(row=2, column=1, sticky=tk.W, pady=2, padx=(5, 0))
        
        # Botón de conversión
        self.convert_btn = ttk.Button(main_frame, text="🔄 Convert PDF to Images", 
                                     command=self.start_conversion, style="Accent.TButton")
        self.convert_btn.grid(row=4, column=0, columnspan=3, pady=20)
        
        # Barra de progreso
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate')
        self.progress.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Log de salida
        log_frame = ttk.LabelFrame(main_frame, text="Log", padding="5")
        log_frame.grid(row=6, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
        log_frame.columnconfigure(0, weight=1)
        log_frame.rowconfigure(0, weight=1)
        main_frame.rowconfigure(6, weight=1)
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=10, width=70)
        self.log_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Frame de estado
        status_frame = ttk.Frame(main_frame)
        status_frame.grid(row=7, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        status_frame.columnconfigure(1, weight=1)
        
        self.status_label = ttk.Label(status_frame, text="Ready")
        self.status_label.grid(row=0, column=0, sticky=tk.W)
        
    def check_dependencies(self):
        """Verificar si las dependencias están instaladas"""
        missing_deps = []
        
        if not PDF2IMAGE_AVAILABLE:
            missing_deps.append("pdf2image")
        
        if not PIL_AVAILABLE:
            missing_deps.append("Pillow")
        
        if missing_deps:
            self.log("⚠️ Missing dependencies detected!")
            self.log("Please install the following packages:")
            for dep in missing_deps:
                self.log(f"  pip install {dep}")
            
            if "pdf2image" in missing_deps:
                self.log("\nNote: pdf2image also requires poppler-utils:")
                self.log("  Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases/")
                self.log("  macOS: brew install poppler")
                self.log("  Linux: sudo apt-get install poppler-utils")
            
            self.convert_btn.configure(state="disabled")
            return False
        
        self.log("✅ All dependencies are available!")
        return True
    
    def set_default_pdf(self):
        """Configurar el PDF por defecto si existe"""
        current_dir = Path(__file__).parent
        default_pdf = current_dir / "TUESDAY SAJAA AUCTION 24-JUNE-2025.pdf"
        
        if default_pdf.exists():
            self.pdf_path.set(str(default_pdf))
            self.log(f"📄 Found default PDF: {default_pdf.name}")
            
            # Configurar carpeta de salida por defecto
            default_output = current_dir / "auction_images"
            self.output_folder.set(str(default_output))
            self.log(f"📁 Default output folder: {default_output}")
        
    def browse_pdf(self):
        """Seleccionar archivo PDF"""
        filename = filedialog.askopenfilename(
            title="Select PDF file",
            filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")]
        )
        if filename:
            self.pdf_path.set(filename)
            self.log(f"📄 Selected PDF: {os.path.basename(filename)}")
    
    def browse_output(self):
        """Seleccionar carpeta de salida"""
        folder = filedialog.askdirectory(title="Select output folder")
        if folder:
            self.output_folder.set(folder)
            self.log(f"📁 Output folder: {folder}")
    
    def log(self, message):
        """Agregar mensaje al log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
    
    def update_status(self, message):
        """Actualizar barra de estado"""
        self.status_label.configure(text=message)
    
    def start_conversion(self):
        """Iniciar conversión en un hilo separado"""
        if self.is_converting:
            return
        
        # Validar inputs
        if not self.pdf_path.get():
            messagebox.showerror("Error", "Please select a PDF file")
            return
        
        if not self.output_folder.get():
            messagebox.showerror("Error", "Please select an output folder")
            return
        
        if not os.path.exists(self.pdf_path.get()):
            messagebox.showerror("Error", "PDF file does not exist")
            return
        
        # Deshabilitar botón y mostrar progreso
        self.convert_btn.configure(state="disabled", text="Converting...")
        self.progress.start()
        self.is_converting = True
        
        # Ejecutar conversión en hilo separado
        thread = threading.Thread(target=self.convert_pdf)
        thread.daemon = True
        thread.start()
    
    def convert_pdf(self):
        """Convertir PDF a imágenes"""
        try:
            pdf_file = self.pdf_path.get()
            output_dir = Path(self.output_folder.get())
            dpi = self.dpi_var.get()
            format_type = self.format_var.get().lower()
            prefix = self.prefix_var.get()
            
            self.log(f"🚀 Starting conversion...")
            self.log(f"📄 PDF: {os.path.basename(pdf_file)}")
            self.log(f"📁 Output: {output_dir}")
            self.log(f"🎨 Settings: {dpi} DPI, {format_type.upper()} format")
            
            # Crear carpeta de salida si no existe
            output_dir.mkdir(parents=True, exist_ok=True)
            
            self.update_status("Converting PDF...")
            
            # Convertir PDF a imágenes
            self.log("🔄 Converting pages...")
            images = convert_from_path(pdf_file, dpi=dpi)
            
            total_pages = len(images)
            self.log(f"📑 Found {total_pages} pages")
            
            # Guardar cada imagen
            for i, image in enumerate(images, 1):
                filename = f"{prefix}_{i:03d}.{format_type}"
                image_path = output_dir / filename
                
                # Optimizar calidad para JPEG
                if format_type == 'jpeg':
                    image.save(image_path, format_type.upper(), quality=95, optimize=True)
                else:
                    image.save(image_path, format_type.upper())
                
                self.log(f"💾 Saved: {filename}")
                self.update_status(f"Saved page {i}/{total_pages}")
            
            self.log(f"✅ Conversion completed successfully!")
            self.log(f"📁 Images saved to: {output_dir}")
            
            # Mostrar mensaje de éxito
            self.root.after(0, lambda: messagebox.showinfo(
                "Success", 
                f"PDF converted successfully!\n{total_pages} images saved to:\n{output_dir}"
            ))
            
        except ImportError as e:
            error_msg = "Missing required dependencies. Please install pdf2image and Pillow."
            self.log(f"❌ Error: {error_msg}")
            self.root.after(0, lambda: messagebox.showerror("Error", error_msg))
            
        except Exception as e:
            error_msg = f"Error during conversion: {str(e)}"
            self.log(f"❌ Error: {error_msg}")
            self.root.after(0, lambda: messagebox.showerror("Error", error_msg))
            
        finally:
            # Restaurar UI
            self.root.after(0, self.conversion_finished)
    
    def conversion_finished(self):
        """Restaurar UI después de la conversión"""
        self.progress.stop()
        self.convert_btn.configure(state="normal", text="🔄 Convert PDF to Images")
        self.update_status("Ready")
        self.is_converting = False

def main():
    # Crear la ventana principal
    root = tk.Tk()
    
    # Configurar estilo
    style = ttk.Style()
    style.theme_use('clam')  # o 'vista' en Windows, 'aqua' en macOS
    
    # Crear la aplicación
    app = PDFConverterApp(root)
    
    # Centrar ventana
    root.update_idletasks()
    x = (root.winfo_screenwidth() - root.winfo_width()) // 2
    y = (root.winfo_screenheight() - root.winfo_height()) // 2
    root.geometry(f"+{x}+{y}")
    
    # Ejecutar la aplicación
    root.mainloop()

if __name__ == "__main__":
    main()