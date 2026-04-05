from fastapi import FastAPI, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
import json
import qrcode
import hashlib
import os
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import base64
import datetime
import csv
import io
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define paths first
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CERTIFICATE_DATA_FILE = os.path.join(BASE_DIR, "assets", "data2.json")
TICKET_DATA_FILE = os.path.join(BASE_DIR, "assets", "data-tickets.json")
TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "event.png")
EVENT_TICKET_TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "event-ticket.png")
CERTIFICATE_TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "hackmatrix", "certificate.png")
FONT_PATH = os.path.join(BASE_DIR, "assets", "hackmatrix", "para-regular.ttf")
PUBLIC_SANS_FONT_PATH = os.path.join(BASE_DIR, "assets", "PublicSans-Bold.ttf")
CSV_DATA_PATH = os.path.join(BASE_DIR, "assets", "hackmatrix", "data.csv")

# Google Sheets Configuration from Environment Variables
# Load service account credentials from environment variable
google_credentials_json = os.getenv('GOOGLE_SHEETS_CREDENTIALS')
if not google_credentials_json:
    raise ValueError("GOOGLE_SHEETS_CREDENTIALS environment variable is not set")

try:
    GOOGLE_SHEETS_CREDENTIALS = json.loads(google_credentials_json)
except json.JSONDecodeError as e:
    raise ValueError(f"Invalid JSON in GOOGLE_SHEETS_CREDENTIALS: {e}")

# Get spreadsheet ID from environment variable
SPREADSHEET_ID = os.getenv('GOOGLE_SPREADSHEET_ID')
if not SPREADSHEET_ID:
    raise ValueError("GOOGLE_SPREADSHEET_ID environment variable is not set")

# Configurable positioning for ticket generation (adjust these values as needed)
TICKET_CONFIG = {
    "member1_name": {
        "x": 170,  # Adjust X position
        "y": 500,  # Adjust Y position
        "size": 40,
        "color": "#c1ff72",
        "bold": True
    },
    "member2_name": {
        "x": 170,  # Adjust X position
        "y": 550,  # Adjust Y position
        "size": 40,
        "color": "#c1ff72",
        "bold": True
    },
    "row_id": {
        "x": 1850,  # Adjust X position
        "y": 180,  # Adjust Y position
        "size":60,
        "color": "white",
        "bold": True
    },
    "qr_code": {
        "x": 1640,  # Adjust X position
        "y": 280,  # Adjust Y position
        "size": 280  # QR code size
    }
}

# Configurable positioning for certificate generation (adjust these values as needed)
CERTIFICATE_CONFIG = {
    "name": {
        "x": 1020,  # Adjust X position
        "y": 430,  # Adjust Y position
        "size": 100,  # Font size
        "color": "#03989e",
        "align": "center"  # Text alignment: "left", "center", "right"
    },
    "team_name": {
        "x": 1000,  # Adjust X position
        "y": 670,  # Adjust Y position
        "size": 80,  # Font size
        "color": "#000000",
        "align": "center"  # Text alignment: "left", "center", "right"
    }
}

def load_vitb_csv_data():
    """Load participant data from HackMatrix CSV file"""
    participants = []
    try:
        with open(CSV_DATA_PATH, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                participants.append(row)
    except Exception as e:
        print(f"Error loading CSV: {e}")
    return participants

def normalize_reg_no(reg_no):
    """Normalize registration number: remove spaces and convert to lowercase"""
    return reg_no.strip().lower().replace(" ", "") if reg_no else ""

def search_participant_by_reg_no(reg_no):
    """Search for participant in CSV by registration number (case-insensitive, space-insensitive)"""
    participants = load_vitb_csv_data()
    normalized_search = normalize_reg_no(reg_no)
    
    for participant in participants:
        if normalize_reg_no(participant.get('Reg_No', '')) == normalized_search:
            return participant
    return None

def get_google_sheets_client():
    """Initialize Google Sheets client with service account (Sheets API only, no Drive API)"""
    try:
        # Use Sheets API scope with read/write permissions
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets'
        ]
        credentials = Credentials.from_service_account_info(
            GOOGLE_SHEETS_CREDENTIALS,
            scopes=scopes
        )
        client = gspread.authorize(credentials)
        return client
    except Exception as e:
        print(f"Error initializing Google Sheets client: {e}")
        return None

def fetch_participant_data(reg_number):
    """Fetch participant data from Google Sheets by registration number"""
    try:
        client = get_google_sheets_client()
        if not client:
            return None
        
        # Open spreadsheet by ID (no Drive API needed)
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
        worksheet = spreadsheet.sheet1  # Get first sheet
        
        # Get all values (works even with duplicate column names)
        all_values = worksheet.get_all_values()
        
        if not all_values or len(all_values) < 2:
            print("No data found in spreadsheet")
            return None
        
        # First row is headers
        headers = all_values[0]
        
        # Find column indices
        col_indices = {}
        for i, header in enumerate(headers):
            col_indices[header] = i
        
        # Search for participant by registration number (case-insensitive)
        reg_number_lower = reg_number.lower()
        
        for row in all_values[1:]:  # Skip header row
            if len(row) <= max(col_indices.values()):
                continue
                
            # Check both member registration numbers (case-insensitive)
            reg1 = str(row[col_indices.get('Reg Number (1)', 0)] if 'Reg Number (1)' in col_indices else '').strip()
            reg2 = str(row[col_indices.get('Reg Number (2)', 0)] if 'Reg Number (2)' in col_indices else '').strip()
            
            if reg1.lower() == reg_number_lower or reg2.lower() == reg_number_lower:
                return {
                    'row_id': row[col_indices.get('Row ID', 0)] if 'Row ID' in col_indices else '',
                    'team_name': row[col_indices.get('Team Name', 0)] if 'Team Name' in col_indices else '',
                    'member1_name': row[col_indices.get('Member 1 Name', 0)] if 'Member 1 Name' in col_indices else '',
                    'reg_number_1': reg1,
                    'member2_name': row[col_indices.get('Member 2 Name', 0)] if 'Member 2 Name' in col_indices else '',
                    'reg_number_2': reg2,
                    'games_playing': row[col_indices.get('Games Playing', 0)] if 'Games Playing' in col_indices else ''
                }
        
        return None
    except Exception as e:
        print(f"Error fetching data from Google Sheets: {e}")
        import traceback
        traceback.print_exc()
        return None

# Initialize FastAPI app and middleware
app = FastAPI()
origins = [
    "http://localhost:5000",  # Allow frontend to access API on this URL
    "http://localhost:3000", 
    "http://localhost",  # Replit domain
    "https://linpack.vercel.app",  # For localhost access
    "https://linpack.vercel.app"  # Add your Vercel domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # Allow frontend URL to access API
    allow_credentials=True,
    allow_methods=["*"],     # Allow all HTTP methods
    allow_headers=["*"],     # Allow all headers
)

# Global variables to store data
CERTIFICATE_USERS_DATA = []
TICKET_USERS_DATA = []

# Certificate configurations for different events
CERTIFICATE_CONFIGS = {
    "default": {
        "template": "api/assets/certificates/certificate.png",
        "font": "api/assets/fonts/arial.ttf",
        "font_size": 80,
        "color": "#D41515",
        "name_position": (1000, 600),
        "alignment": "center"
    },
    "draft-to-direction": {
        "template": "api/assets/draft-to-direction/certificate.png",  # Updated path
        "font": "api/assets/draft-to-direction/Fineday.ttf",  # Updated path - check if font file exists
        "font_size": 80,
        "color": "#1897c7",
        "name_position": (1000, 630),  # Adjust x, y as needed
        "alignment": "center"
    }
}

def load_data():
    global CERTIFICATE_USERS_DATA, TICKET_USERS_DATA
    try:
        if os.path.exists(CERTIFICATE_DATA_FILE):
            with open(CERTIFICATE_DATA_FILE, "r") as file:
                CERTIFICATE_USERS_DATA = json.load(file)
        
        if os.path.exists(TICKET_DATA_FILE):
            with open(TICKET_DATA_FILE, "r") as file:
                TICKET_USERS_DATA = json.load(file)
                
        return True
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        return False

# Try to load data on startup
load_data()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request path: {request.url.path}")
    print(f"Request method: {request.method}")
    try:
        response = await call_next(request)
        print(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

@app.get("/api/py/health")
async def health_check():
    """Check API and data file health"""
    health_status = {
        "status": "ok",
        "timestamp": datetime.datetime.now().isoformat(),
        "files": {},
        "data": {
            "certificate_users": len(CERTIFICATE_USERS_DATA),
            "ticket_users": len(TICKET_USERS_DATA)
        }
    }

    try:
        # Check files existence first
        files_to_check = {
            "certificate_data": CERTIFICATE_DATA_FILE,
            "ticket_data": TICKET_DATA_FILE,
            "certificate_template": CERTIFICATE_TEMPLATE_PATH,
            "ticket_template": TEMPLATE_PATH,
            "font": FONT_PATH
        }

        for name, filepath in files_to_check.items():
            exists = os.path.exists(filepath)
            health_status["files"][name] = {
                "exists": exists,
                "path": filepath
            }
            if not exists:
                health_status["status"] = "degraded"

        return health_status

    except Exception as e:
        print(f"Health check error: {str(e)}")
        return {
            "status": "error",
            "timestamp": datetime.datetime.now().isoformat(),
            "message": [f"Health check failed: {str(e)}"],
            "files": health_status["files"]
        }

def normalize_name(name):
    """Helper function to normalize names for comparison"""
    return ''.join(name.lower().split())

@app.get("/api/py/get-valid-names")
async def get_valid_names():
    """Return all valid names from both databases"""
    try:
        certificate_names = [user["name"] for user in CERTIFICATE_USERS_DATA]
        ticket_names = [user["name"] for user in TICKET_USERS_DATA]
        all_names = list(set(certificate_names + ticket_names))  # Remove duplicates
        return {"names": sorted(all_names)}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch names: {str(e)}"
        )

@app.post("/api/py/generate-ticket")
async def generate_ticket(name: str = Form(...), reg_no: str = Form(...)):
    print(f"Received input: name='{name}', reg_no='{reg_no}'")
    
    # Find the user in ticket database
    matching_user = None
    valid_names = []
    
    for user in TICKET_USERS_DATA:
        valid_names.append(user["name"])
        if user["reg_number"].strip() == reg_no.strip():
            normalized_stored_name = normalize_name(user["name"])
            if normalize_name(name) == normalized_stored_name:
                matching_user = user
                break
    
    if not matching_user:
        print("User not found!")
        raise HTTPException(
            status_code=404, 
            detail="No User Found"  # Simplified error message
        )

    # Use stored name from database
    stored_name = matching_user["team_id"]
    stored_reg_no = matching_user["reg_number"]
    print(f"Using stored name: {stored_name}")

    # Use the hash field name that matches the JSON structure
    hashed_data = matching_user["hashed_code"]
    print(f"Using stored hash: {hashed_data}")

    qr = qrcode.make(hashed_data)  # Only store the hash
    qr = qr.resize((300, 300))
    print("QR Code generated with hash!")

    # Load ticket template
    if not os.path.exists(TEMPLATE_PATH):
        raise FileNotFoundError("Error: ticket.png template not found!")
    ticket = Image.open(TEMPLATE_PATH)
    print("Ticket template loaded!")

    # Paste QR Code at specified position
    qr_code_position = (1520, 150)  # (x, y)
    ticket.paste(qr, qr_code_position)
    print("QR Code pasted!")

    # Draw text
    draw = ImageDraw.Draw(ticket)
    try:
        font = ImageFont.truetype(FONT_PATH, 50)  # Adjust font size as needed
    except IOError:
        print("Warning: Font not found! Using default font.")
        font = ImageFont.load_default()
    print("Font loaded!")

    # Name and Reg Number positions
    name_position = (1150, 460)  
    reg_number_position = (1530, 540)  

    draw.text(name_position, f"{stored_name}", font=font, fill="White")
    draw.text(reg_number_position, f"{stored_reg_no}", font=font, fill="black")
    print("Text drawn!")

    # Generate ticket in memory only
    img_byte_arr = BytesIO()
    ticket.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return StreamingResponse(
        img_byte_arr,
        media_type="image/png",
        headers={
            'Content-Disposition': f'attachment; filename="{stored_reg_no}_ticket.png"'
        }
    )

@app.get("/api/py/search-participant")
async def search_participant(reg_number: str):
    """Search for participant by registration number in HackMatrix CSV"""
    print(f"Searching for registration number: {reg_number}")
    
    participant = search_participant_by_reg_no(reg_number)
    
    if not participant:
        raise HTTPException(
            status_code=404,
            detail="Participant not found"
        )
    
    return {
        "name": participant.get('Name', ''),
        "team_name": participant.get('Team_Name', ''),
        "reg_number": participant.get('Reg_No', ''),
        "found": True
    }

@app.post("/api/py/generate-certificate")
async def generate_certificate(
    reg_number: str = Form(...),
    x: int = Form(None),
    y: int = Form(None),
    font_size: int = Form(None),
    team_x: int = Form(None),
    team_y: int = Form(None),
    team_font_size: int = Form(None)
):
    """Generate certificate with name printed on it using configurable position and font size"""
    print(f"Generating certificate for registration number: {reg_number}")
    
    # Search for participant
    participant = search_participant_by_reg_no(reg_number)
    
    if not participant:
        print("Participant not found!")
        raise HTTPException(
            status_code=404, 
            detail="Participant not found"
        )
    
    stored_name = participant.get('Name', '').strip()
    stored_team_name = participant.get('Team_Name', '').strip()
    print(f"Using stored name: {stored_name}")
    print(f"Using stored team name: {stored_team_name}")
    
    if not os.path.exists(CERTIFICATE_TEMPLATE_PATH):
        raise FileNotFoundError("Error: certificate template not found!")
    
    certificate = Image.open(CERTIFICATE_TEMPLATE_PATH)
    print("Certificate template loaded!")
    
    # Use configurable positions and font sizes, allowing overrides
    name_config = CERTIFICATE_CONFIG["name"]
    team_config = CERTIFICATE_CONFIG["team_name"]

    name_x = x if x is not None else name_config["x"]
    name_y = y if y is not None else name_config["y"]
    name_size = font_size if font_size is not None else name_config["size"]
    name_color = name_config["color"]
    name_alignment = name_config.get("align", "left")

    resolved_team_x = team_x if team_x is not None else team_config["x"]
    resolved_team_y = team_y if team_y is not None else team_config["y"]
    resolved_team_size = team_font_size if team_font_size is not None else team_config["size"]
    team_color = team_config["color"]
    team_alignment = team_config.get("align", "left")
    
    draw = ImageDraw.Draw(certificate)
    try:
        name_font = ImageFont.truetype(FONT_PATH, name_size)
        team_font = ImageFont.truetype(FONT_PATH, resolved_team_size)
    except IOError:
        print("Warning: Font not found! Using default font.")
        name_font = ImageFont.load_default()
        team_font = ImageFont.load_default()
    print("Font loaded!")

    def resolve_x(base_x, text_value, font_obj, align):
        if align == "center":
            bbox = draw.textbbox((0, 0), text_value, font=font_obj)
            text_width = bbox[2] - bbox[0]
            return base_x - (text_width // 2)
        if align == "right":
            bbox = draw.textbbox((0, 0), text_value, font=font_obj)
            text_width = bbox[2] - bbox[0]
            return base_x - text_width
        return base_x

    final_name_x = resolve_x(name_x, stored_name, name_font, name_alignment)
    final_team_x = resolve_x(resolved_team_x, stored_team_name, team_font, team_alignment)

    # Draw name and team name
    draw.text((final_name_x, name_y), stored_name, font=name_font, fill=name_color)
    draw.text((final_team_x, resolved_team_y), stored_team_name, font=team_font, fill=team_color)
    print(f"Name drawn at ({final_name_x}, {name_y}) with color {name_color}")
    print(f"Team name drawn at ({final_team_x}, {resolved_team_y}) with color {team_color}")
    
    # Generate certificate in memory only
    img_byte_arr = BytesIO()
    certificate.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return StreamingResponse(
        img_byte_arr,
        media_type="image/png",
        headers={
            'Content-Disposition': f'attachment; filename="{stored_name}_certificate.png"'
        }
    )

def load_csv_data(csv_path):
    """Load participant data from CSV file"""
    participants = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                participants.append(row)
    except Exception as e:
        print(f"Error loading CSV: {e}")
    return participants

def generate_certificate_with_config(name, config, x_offset=0, y_offset=0):
    """Generate certificate with specific configuration"""
    try:
        # Load template
        template_path = config["template"]
        if not os.path.exists(template_path):
            print(f"Template not found at: {template_path}")
            print(f"Current directory: {os.getcwd()}")
            return None
            
        certificate = Image.open(template_path)
        draw = ImageDraw.Draw(certificate)
        
        # Load font
        font_path = config["font"]
        if not os.path.exists(font_path):
            print(f"Font not found at: {font_path}")
            # Fallback to default font
            try:
                font = ImageFont.truetype("arial.ttf", config["font_size"])
            except:
                font = ImageFont.load_default()
        else:
            font = ImageFont.truetype(font_path, config["font_size"])
        
        # Convert hex color to RGB
        color = config["color"]
        if color.startswith("#"):
            color = tuple(int(color[i:i+2], 16) for i in (1, 3, 5))
        
        # Calculate position with offset
        x, y = config["name_position"]
        x += x_offset
        y += y_offset
        
        # Draw text based on alignment
        if config["alignment"] == "center":
            bbox = draw.textbbox((0, 0), name, font=font)
            text_width = bbox[2] - bbox[0]
            x = x - (text_width // 2)
        
        draw.text((x, y), name, font=font, fill=color)
        
        # Save to bytes
        img_byte_arr = io.BytesIO()
        certificate.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return img_byte_arr
    except Exception as e:
        print(f"Error generating certificate: {e}")
        import traceback
        traceback.print_exc()
        return None

@app.post('/api/py/certificate')
async def get_certificate(request: Request):
    try:
        data = await request.json()
        reg_number = data.get('reg_number')
        name = data.get('name')  # Get name from request
        
        if not reg_number:
            return JSONResponse({"error": "Registration number is required"}, status_code=400)
        
        if not name:
            return JSONResponse({"error": "Name is required"}, status_code=400)
        
        print(f"Searching for reg_number: {reg_number}")
        print(f"Name provided: {name}")
        
        # Try to find participant in all configured events (CSV-based)
        for event_name, config in CERTIFICATE_CONFIGS.items():
            if event_name == "default":
                continue
                
            csv_path = f"api/assets/{event_name}/data.csv"
            if not os.path.exists(csv_path):
                print(f"CSV not found: {csv_path}")
                continue
                
            participants = load_csv_data(csv_path)
            print(f"Loaded {len(participants)} participants from {event_name}")
            
            # Check if registration number exists in CSV
            participant = next(
                (p for p in participants if p.get('reg_number', '').strip().upper() == reg_number.strip().upper()),
                None
            )
            
            if participant:
                print(f"Found reg_number in {event_name}")
                # Use the name provided by user, not from CSV
                
                # Generate certificate with the matched event config
                certificate_image = generate_certificate_with_config(
                    name, config, 0, 0
                )
                
                if certificate_image:
                    return StreamingResponse(
                        certificate_image,
                        media_type='image/png',
                        headers={
                            'Content-Disposition': f'attachment; filename=certificate_{reg_number}.png'
                        }
                    )
        
        # Fallback to old JSON-based system for legacy events
        print("Checking old system...")
        try:
            data2_path = "api/assets/data2.json"
            if os.path.exists(data2_path):
                with open(data2_path, "r") as file:
                    users_data = json.load(file)
                
                user_entry = next(
                    (user for user in users_data if user.get("reg_number", "").strip().upper() == reg_number.strip().upper()),
                    None
                )
                
                if user_entry:
                    print(f"Found in old system")
                    # For old system, use the name from user input as well
                    
                    # Use default config for old system
                    config = CERTIFICATE_CONFIGS["default"]
                    certificate_image = generate_certificate_with_config(name, config, 0, 0)
                    
                    if certificate_image:
                        return StreamingResponse(
                            certificate_image,
                            media_type='image/png',
                            headers={
                                'Content-Disposition': f'attachment; filename=certificate_{reg_number}.png'
                            }
                        )
        except Exception as e:
            print(f"Error checking old system: {e}")
        
        print("Participant not found in any system")
        return JSONResponse(
            {"error": f"Registration number '{reg_number}' not found. Please check your registration number."},
            status_code=404
        )
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {"error": f"Internal server error: {str(e)}"},
            status_code=500
        )

@app.get('/api/events')
async def get_events():
    """Get list of available events"""
    events = list(CERTIFICATE_CONFIGS.keys())
    return JSONResponse({"events": events})

@app.post('/api/verify-participant')
async def verify_participant(request: Request):
    """Verify if participant exists for an event"""
    try:
        data = await request.json()
        reg_number = data.get('reg_number')
        event = data.get('event', 'default')
        
        if event in CERTIFICATE_CONFIGS and event != "default":
            csv_path = f"api/assets/{event}/data.csv"
            participants = load_csv_data(csv_path)
            
            participant = next(
                (p for p in participants if p.get('reg_number') == reg_number),
                None
            )
            
            if participant:
                return JSONResponse({
                    "exists": True,
                    "name": participant.get('name'),
                    "event": event
                })
        
        # Check old system
        # ...existing verification code...
        
        return JSONResponse({"exists": False}, status_code=404)
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/api/py/lookup-team")
async def lookup_team(reg_number: str):
    """Lookup team information by registration number"""
    try:
        client = get_google_sheets_client()
        if not client:
            raise HTTPException(status_code=500, detail="Failed to connect to Google Sheets")
        
        # Open spreadsheet by ID
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
        worksheet = spreadsheet.sheet1
        
        # Get all values
        all_values = worksheet.get_all_values()
        
        if not all_values or len(all_values) < 2:
            raise HTTPException(status_code=500, detail="No data found in spreadsheet")
        
        # First row is headers
        headers = all_values[0]
        
        # Find column indices
        col_indices = {}
        for i, header in enumerate(headers):
            col_indices[header] = i
        
        # Find Status columns
        status1_col = col_indices.get('Status1', col_indices.get('Status', -1))
        status2_col = col_indices.get('Status2', -1)
        
        # Search for participant (case-insensitive)
        reg_number_lower = reg_number.strip().lower()
        
        for idx, row in enumerate(all_values[1:], start=2):
            if len(row) <= max(col_indices.values()):
                continue
            
            reg1 = str(row[col_indices.get('Reg Number (1)', 0)] if 'Reg Number (1)' in col_indices else '').strip()
            reg2 = str(row[col_indices.get('Reg Number (2)', 0)] if 'Reg Number (2)' in col_indices else '').strip()
            
            if reg1.lower() == reg_number_lower or reg2.lower() == reg_number_lower:
                # Get current status
                status1 = row[status1_col] if status1_col >= 0 and status1_col < len(row) else ''
                status2 = row[status2_col] if status2_col >= 0 and status2_col < len(row) else ''
                
                return {
                    "success": True,
                    "team_id": row[col_indices.get('Row ID', 0)] if 'Row ID' in col_indices else 'N/A',
                    "team_name": row[col_indices.get('Team Name', 0)] if 'Team Name' in col_indices else 'N/A',
                    "row_number": idx,
                    "member1": {
                        "name": row[col_indices.get('Member 1 Name', 0)] if 'Member 1 Name' in col_indices else 'N/A',
                        "reg_number": reg1,
                        "status": status1,
                        "is_present": status1.lower() == 'present'
                    },
                    "member2": {
                        "name": row[col_indices.get('Member 2 Name', 0)] if 'Member 2 Name' in col_indices else 'N/A',
                        "reg_number": reg2,
                        "status": status2,
                        "is_present": status2.lower() == 'present'
                    }
                }
        
        raise HTTPException(status_code=404, detail="Registration number not found")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in lookup_team: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/py/mark-entry")
async def mark_entry(row_number: int = Form(...), member_number: int = Form(...)):
    """Mark attendance/entry for a specific team member - OPTIMIZED"""
    try:
        if member_number not in [1, 2]:
            raise HTTPException(status_code=400, detail="Member number must be 1 or 2")
        
        client = get_google_sheets_client()
        if not client:
            raise HTTPException(status_code=500, detail="Failed to connect to Google Sheets")
        
        # Open spreadsheet by ID
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
        worksheet = spreadsheet.sheet1
        
        # Get headers only for column mapping
        headers = worksheet.row_values(1)
        
        # Find column indices
        col_indices = {header: i for i, header in enumerate(headers)}
        
        # Find Status columns
        status1_col = col_indices.get('Status1', col_indices.get('Status', -1))
        status2_col = col_indices.get('Status2', -1)
        
        # Determine which status column to update
        status_col = status1_col if member_number == 1 else status2_col
        
        if status_col < 0:
            raise HTTPException(status_code=500, detail=f"Status{member_number} column not found")
        
        # Convert to A1 notation
        col_letter = chr(65 + status_col)
        cell_address = f"{col_letter}{row_number}"
        
        # Build Google Sheets API service (reuse credentials)
        from googleapiclient.discovery import build
        from google.oauth2.service_account import Credentials
        
        creds = Credentials.from_service_account_info(
            GOOGLE_SHEETS_CREDENTIALS,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        service = build('sheets', 'v4', credentials=creds)
        
        # Batch update: value + formatting in ONE API call
        batch_update_request = {
            'requests': [
                # Update value
                {
                    'updateCells': {
                        'range': {
                            'sheetId': 0,
                            'startRowIndex': row_number - 1,
                            'endRowIndex': row_number,
                            'startColumnIndex': status_col,
                            'endColumnIndex': status_col + 1
                        },
                        'rows': [
                            {
                                'values': [
                                    {
                                        'userEnteredValue': {'stringValue': 'Present'},
                                        'userEnteredFormat': {
                                            'backgroundColor': {
                                                'red': 0.0,
                                                'green': 0.8,
                                                'blue': 0.0
                                            },
                                            'textFormat': {
                                                'foregroundColor': {
                                                    'red': 1.0,
                                                    'green': 1.0,
                                                    'blue': 1.0
                                                },
                                                'bold': True
                                            }
                                        }
                                    }
                                ]
                            }
                        ],
                        'fields': 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat)'
                    }
                }
            ]
        }
        
        # Execute in one batch request
        service.spreadsheets().batchUpdate(
            spreadsheetId=SPREADSHEET_ID,
            body=batch_update_request
        ).execute()
        
        return {
            "success": True,
            "message": f"Member {member_number} marked as present",
            "row_number": row_number,
            "member_number": member_number
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in mark_entry: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/py/generate-event-ticket")
async def generate_event_ticket(reg_number: str = Form(...)):
    """Generate event ticket from Google Sheets data"""
    print(f"Generating ticket for registration number: {reg_number}")
    
    try:
        # Fetch participant data from Google Sheets
        participant = fetch_participant_data(reg_number.strip())
        
        if not participant:
            raise HTTPException(
                status_code=404,
                detail="Registration number not found in the system"
            )
        
        print(f"Found participant: {participant}")
        
        # Load ticket template
        if not os.path.exists(EVENT_TICKET_TEMPLATE_PATH):
            raise HTTPException(
                status_code=500,
                detail=f"Ticket template not found at: {EVENT_TICKET_TEMPLATE_PATH}"
            )
        
        ticket = Image.open(EVENT_TICKET_TEMPLATE_PATH)
        draw = ImageDraw.Draw(ticket)
        
        # Load PublicSans-Bold font
        try:
            # Font for member names (size 12)
            font_member = ImageFont.truetype(PUBLIC_SANS_FONT_PATH, TICKET_CONFIG["member1_name"]["size"])
            # Font for row ID (size 15)
            font_row_id = ImageFont.truetype(PUBLIC_SANS_FONT_PATH, TICKET_CONFIG["row_id"]["size"])
        except IOError:
            print("Warning: PublicSans-Bold font not found! Using default font.")
            font_member = ImageFont.load_default()
            font_row_id = ImageFont.load_default()
        
        # Convert hex color to RGB
        def hex_to_rgb(hex_color):
            hex_color = hex_color.lstrip('#')
            return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        
        # Draw Row ID
        row_id_color = TICKET_CONFIG["row_id"]["color"]
        if row_id_color != "white":
            row_id_color = hex_to_rgb(row_id_color)
        else:
            row_id_color = (255, 255, 255)
        
        draw.text(
            (TICKET_CONFIG["row_id"]["x"], TICKET_CONFIG["row_id"]["y"]),
            f"{participant['row_id']}",
            font=font_row_id,
            fill=row_id_color
        )
        
        # Draw Member 1 Name
        member1_color = hex_to_rgb(TICKET_CONFIG["member1_name"]["color"])
        draw.text(
            (TICKET_CONFIG["member1_name"]["x"], TICKET_CONFIG["member1_name"]["y"]),
            participant['member1_name'],
            font=font_member,
            fill=member1_color
        )
        
        # Draw Member 2 Name
        member2_color = hex_to_rgb(TICKET_CONFIG["member2_name"]["color"])
        draw.text(
            (TICKET_CONFIG["member2_name"]["x"], TICKET_CONFIG["member2_name"]["y"]),
            participant['member2_name'],
            font=font_member,
            fill=member2_color
        )
        
        # Generate QR Code with registration number
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=2,
        )
        qr.add_data(reg_number)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Resize QR code to fit
        qr_size = TICKET_CONFIG["qr_code"]["size"]
        qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
        
        # Paste QR code on ticket
        ticket.paste(
            qr_img,
            (TICKET_CONFIG["qr_code"]["x"], TICKET_CONFIG["qr_code"]["y"])
        )
        
        # Save ticket to bytes
        img_byte_arr = BytesIO()
        ticket.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        print(f"Ticket generated successfully for {reg_number}")
        
        return StreamingResponse(
            img_byte_arr,
            media_type="image/png",
            headers={
                'Content-Disposition': f'attachment; filename="ticket_{reg_number}.png"'
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating ticket: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ticket: {str(e)}"
        )

@app.get("/api/py/ticket-config")
async def get_ticket_config():
    """Get current ticket configuration for debugging"""
    return JSONResponse(TICKET_CONFIG)

@app.post("/api/py/update-ticket-config")
async def update_ticket_config(request: Request):
    """Update ticket configuration for positioning adjustments"""
    try:
        data = await request.json()
        global TICKET_CONFIG
        
        # Update only the provided fields
        for section, values in data.items():
            if section in TICKET_CONFIG:
                for key, value in values.items():
                    if key in TICKET_CONFIG[section]:
                        TICKET_CONFIG[section][key] = value
        
        return JSONResponse({
            "message": "Configuration updated successfully",
            "config": TICKET_CONFIG
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
