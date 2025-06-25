@echo off
echo ===================================
echo PDF Converter - Dependency Installer
echo ===================================
echo.

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ===================================
echo IMPORTANT: Poppler Installation
echo ===================================
echo.
echo pdf2image requires poppler-utils to work.
echo Please download and install poppler for Windows from:
echo https://github.com/oschwartz10612/poppler-windows/releases/
echo.
echo 1. Download the latest poppler-windows release
echo 2. Extract to a folder (e.g., C:\poppler)
echo 3. Add the 'bin' folder to your PATH environment variable
echo    (e.g., add C:\poppler\Library\bin to PATH)
echo.
echo After installing poppler, you can run the PDF converter.
echo.
pause