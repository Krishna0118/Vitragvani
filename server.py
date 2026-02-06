import os
import json
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
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

# --- server.py updates ---

def parse_intent_smart(user_query):
    system_prompt = """
    You are an AI Librarian. Extract search parameters.
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
    intent = parse_intent_smart(query_text)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    results = []

    search_val = f"%{intent.get('shastra') or query_text}%"
    gatha_val = f"%{intent.get('gatha')}%" if intent.get('gatha') else None

    # 1. VIDEOS (Watch) - Using exact column names from your SQL dump
    if intent['category'] in ['WATCH', 'BOTH']:
        sql = "SELECT *, 'video' as res_type FROM video_pravachan_with_pdf WHERE shastra_name LIKE %s"
        params = [search_val]
        if gatha_val:
            sql += " AND `Gatha No/Bol No` LIKE %s"
            params.append(gatha_val)
        cursor.execute(sql, params)
        results.extend(cursor.fetchall())

    # 2. AUDIOS (Listen)
    if intent['category'] in ['LISTEN', 'BOTH']:
        sql = "SELECT *, 'audio' as res_type FROM gurudevshree_pravachan WHERE shastra_name LIKE %s"
        params = [search_val]
        if gatha_val:
            sql += " AND gatha_no_bol_no LIKE %s"
            params.append(gatha_val)
        cursor.execute(sql, params)
        results.extend(cursor.fetchall())

    # 3. BOOKS (Read)
    if intent['category'] in ['READ', 'BOTH']:
        sql = "SELECT *, 'book' as res_type FROM shastra_bhandar WHERE shastraname LIKE %s"
        cursor.execute(sql, (search_val,))
        results.extend(cursor.fetchall())

    cursor.close()
    conn.close()
    return jsonify({"results": results, "ai_logic": intent})
# ... keep your login/register routes as they are ...

if __name__ == '__main__':
    app.run(debug=True, port=5000)