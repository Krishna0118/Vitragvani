import os
import json
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt # Added for security
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
bcrypt = Bcrypt(app) # Initialize Bcrypt

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD"),
    "database": "vitragvani_db" 
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def parse_intent_smart(user_query):
    system_prompt = """
    You are an AI Librarian for VitragVani. Extract search parameters.
    - If user says 'watch', 'video', or 'youtube', category is WATCH.
    - If user says 'pravachan', 'audio', or 'listen', category is LISTEN.
    - If user says 'book', 'pdf', or 'read', category is READ.
    Return JSON only: {"shastra": "string", "gatha": "string", "category": "READ|LISTEN|WATCH|BOTH"}
    """
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_query}],
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)

@app.route('/search', methods=['GET'])
def search():
    query_text = request.args.get('q', '')
    if not query_text:
        return jsonify({"results": []})

    intent = parse_intent_smart(query_text)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    results = []

    try:
        search_val = f"%{intent.get('shastra') or query_text}%"
        gatha_val = f"%{intent.get('gatha')}%" if intent.get('gatha') else None

        # 1. AUDIO SEARCH
        if intent['category'] in ['LISTEN', 'BOTH']:
            sql = "SELECT *, 'audio' as res_type FROM gurudevshree_pravachan WHERE (shastra_name LIKE %s OR full_name LIKE %s)"
            params = [search_val, search_val]
            if gatha_val:
                sql += " AND gatha_no_bol_no LIKE %s"
                params.append(gatha_val)
            cursor.execute(sql, params)
            results.extend(cursor.fetchall())

        # 2. VIDEO SEARCH
        if intent['category'] in ['WATCH', 'BOTH']:
            sql = "SELECT *, 'video' as res_type FROM video_pravachan_with_pdf WHERE shastra_name LIKE %s"
            params = [search_val]
            if gatha_val:
                sql += " AND `Gatha No/Bol No` LIKE %s"
                params.append(gatha_val)
            cursor.execute(sql, params)
            results.extend(cursor.fetchall())

        # 3. BOOK SEARCH
        if intent['category'] in ['READ', 'BOTH']:
            sql = "SELECT *, 'book' as res_type FROM shastra_bhandar WHERE shastraname LIKE %s OR rachayita LIKE %s"
            cursor.execute(sql, (search_val, search_val))
            results.extend(cursor.fetchall())

        # FIX: Added return statement
        return jsonify({"results": results, "ai_logic": intent})

    except Exception as e:
        print(f"Search Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')

    if not all([first_name, last_name, email, password]):
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    # SECURITY: Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"status": "error", "message": "Email already exists"}), 409

        query = "INSERT INTO users (first_name, last_name, email, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (first_name, last_name, email, hashed_password))
        conn.commit()
        return jsonify({"status": "success", "message": "User registered"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT first_name, last_name, email, password FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        # SECURITY: Compare hashed passwords
        if user and bcrypt.check_password_hash(user['password'], password):
            user.pop('password') # Don't send the password back
            return jsonify({"status": "success", "user": user}), 200
        else:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)