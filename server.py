import os
import json
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()
app = Flask(__name__)

# Ensure this matches your Vite port
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Database Configuration - Ensure DB_NAME is "vitragvani_db"
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
    You are an AI Librarian for VitragVani. Extract entities from the user query.
    Categories: READ (Books/PDFs), LISTEN (Audio), WATCH (Videos), BOTH (Everything).
    Return JSON only:
    {
      "shastra": "string or null",
      "gatha": "string or null",
      "month": "string or null",
      "category": "READ | LISTEN | WATCH | BOTH",
      "title": "Cleaned search title"
    }
    """
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": system_prompt},
                  {"role": "user", "content": user_query}],
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)



@app.route('/search', methods=['GET'])
def search():
    query_text = request.args.get('q', '')
    intent = parse_intent_smart(query_text)
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    results = []

    search_term = f"%{intent['shastra'] or intent['title']}%"
    gatha_term = f"%{intent['gatha']}%" if intent['gatha'] else None
    month_term = f"%{intent['month']}%" if intent['month'] else None

    # 1. SEARCH GURUDEVSHREE (Audio + Metadata)
# --- Updated Search Section in server.py ---

# 1. GURUDEVSHREE PRAVACHAN
    if intent['category'] in ['LISTEN', 'BOTH']:
        # The dump column name is 'shastra_name' (lowercase/underscores)
        sql = "SELECT *, 'pravachan_audio' as type FROM gurudevshree_pravachan WHERE (shastra_name LIKE %s OR full_name LIKE %s)"
        params = [search_term, search_term]
        if gatha_term:
            # The dump column name is 'gatha_no_bol_no'
            sql += " AND `gatha_no_bol_no` LIKE %s" 
            params.append(gatha_term)
        if month_term:
            sql += " AND month LIKE %s"
            params.append(month_term)
        cursor.execute(sql, params)
        results.extend([{"type": "pravachan", "data": r} for r in cursor.fetchall()])

    # 2. VIDEO PRAVACHAN WITH PDF
    if intent['category'] in ['WATCH', 'BOTH']:
        # The dump column name is 'shastra_name'
        sql = "SELECT *, 'video_pdf' as type FROM video_pravachan_with_pdf WHERE shastra_name LIKE %s"
        params = [search_term]
        if gatha_term:
            sql += " AND `Gatha No/Bol No` LIKE %s"
            params.append(gatha_term)
        cursor.execute(sql, params)
        results.extend([{"type": "video", "data": r} for r in cursor.fetchall()])

    # 3. SHASTRA BHANDAR
    if intent['category'] in ['READ', 'BOTH']:
        # CRITICAL: In the 'shastra bhandar' table, the column name is 'shastraname' 
        # (no underscore based on common CSV to SQL conversion)
        cursor.execute("SELECT *, 'book' as type FROM shastra_bhandar WHERE shastraname LIKE %s", (search_term,))
        results.extend([{"type": "book", "data": r} for r in cursor.fetchall()])    

    cursor.close()
    conn.close()
    
    return jsonify({
        "status": "success", 
        "results": results, 
        "ai_logic": intent
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)