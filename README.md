Barcode Generation and PDF Creation System

📋 Project Overview

This project is a comprehensive system developed for Attal Plastics, Hyderabad, to automate the process of generating barcodes and creating formatted PDF documents for large-scale product inventory management. The system takes a CSV file as input and produces barcodes, PDF documents with formatted information, and an updated CSV file with barcode data.

🔑 Key Features

CSV data processing
EAN13 barcode generation
PDF creation with formatted product information and barcodes
Automated workflow from data input to final output
Support for different product categories (Medium and Large)
🛠️ Installation

Clone this repository:
git clone https://github.com/yourusername/barcode-pdf-generator.git
cd barcode-pdf-generator
Install the required Python libraries:
pip install pandas numpy python-barcode Pillow reportlab pyzba
📁 File Structure

main.py: The main script that orchestrates the entire process.
Barcode_generator.py: Generates EAN13 barcodes for each product.
PDF_Format_maker.py: Creates formatted PDF documents with product information and barcodes.
CSV_Gen_for_barcode_numbers.py: Updates the CSV file with decoded barcode data.
🚀 Usage

Run the main script:

python main.py
When prompted, select the input CSV file using the file dialog.

The script will create the following outputs in the project directory:

A folder named after the input CSV file
Subfolders for 'medium' and 'large' categories
Individual barcode images
PDF files with formatted product information and barcodes
An updated CSV file with barcode data
📄 Input CSV Format

The input CSV should have the following columns:

S.No
Barcode No.
Delivery Challan No.
District
Delivery Point
Item
Category
Sub Category
Qty
🔍 Detailed Component Descriptions

main.py

This script is the entry point of the application. It:

Uses tkinter to open a file dialog for CSV selection
Reads the CSV file using pandas
Creates necessary directories for output
Calls functions from other modules to generate barcodes, create PDFs, and update the CSV
Barcode_generator.py

This module is responsible for generating EAN13 barcodes. It:

Processes the input data row by row
Generates an EAN13 barcode for each item
Saves the barcode as a PNG image
Keeps track of the number of barcodes generated for each delivery point and category
PDF_Format_maker.py

This module creates formatted PDF documents. It:

Defines functions (form1, form2, form3, form4) for different layouts on the PDF page
Creates PDF files for both 'medium' and 'large' categories
Adds product information and barcode images to the PDF
CSV_Gen_for_barcode_numbers.py

This module updates the original CSV file with barcode data. It:

Reads the generated barcode images
Decodes the barcodes using pyzbar
Updates the CSV file with the decoded barcode numbers
🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check https://github.com/lalithreddy1/Barcode_generator/issues) if you want to contribute.
