from flask import Flask, render_template, request, jsonify
from prompts import SYSTEM_PROMPT, format_prompt
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static')

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/buddy_go', methods=['POST'])
def buddy_go():
    place = request.form['place']
    when = request.form['when']
    days = request.form['days']

    user_prompt = format_prompt(place, when, days)

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ]
        )
        itinerary = completion.choices[0].message.content
        return jsonify({'itinerary': itinerary})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)