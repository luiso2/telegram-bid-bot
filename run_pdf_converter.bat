@echo off
echo ===================================
echo PDF to Images Converter
echo ===================================
echo.

echo Starting PDF Converter...
python pdf_converter.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error running the converter.
    echo Make sure you have:
    echo 1. Python installed
    echo 2. Required dependencies installed (run install_dependencies.bat)
    echo 3. Poppler installed and added to PATH
    echo.
    pause
)