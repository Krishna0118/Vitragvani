import os
import json
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Krishna@1108",
    "database": "vitragvani"
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def generate_ai_response(user_query):
    # The STRICT "Source of Truth" for the AI
    schema_info = """
    Available Tables & Columns:
    1. gurudevshreepravachan: [ShastraName, FullName, GathaNoBolNo, FilePath]
    2. behenshreepravachan: [ShastraName, FullName, GathaNoBolNo, FilePath]
    3. shastrabhandar: [ShastraName, Rachayita, GujFile, Hindi]
    4. vidropravachans: [shastra, gatha, hindi, gujarati]
    5. video_pravachan_with_pdf: [shastra_name, `Gatha No/Bol No`, hindi, gujarati]
    """

    system_instruction = f"""
    You are the Vitragvani Librarian. 
    1. For 'Bahenshree', search specifically in 'behenshreepravachan'.
    2. For videos, use 'vidropravachans' (NOT video_pravachans).
    3. Use LIKE '%term%' for flexible searching.
    4. Return ONLY JSON: {{"intent": "search", "message": "...", "sql": "..."}}
    Schema: {schema_info}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user_query,
        config={
            "system_instruction": system_instruction,
            "response_mime_type": "application/json"
        }
    )
    return json.loads(response.text)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get("message", "")
    
    try:
        ai_plan = generate_ai_response(user_msg)
        db_result = None
        res_type = "text"

        if ai_plan.get("intent") == "search" and ai_plan.get("sql"):
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(ai_plan['sql'])
            db_result = cursor.fetchone()
            
            if db_result:
                # Detect type based on columns present in the result
                if 'FilePath' in db_result: res_type = "audio"
                elif 'Hindi' in db_result or 'GujFile' in db_result: res_type = "book"
                elif 'hindi' in db_result or 'gujarati' in db_result: res_type = "video"
            conn.close()

        return jsonify({
            "response": ai_plan['message'],
            "data": db_result,
            "res_type": res_type
        })
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}", "res_type": "text"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)