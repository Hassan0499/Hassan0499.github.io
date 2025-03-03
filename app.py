from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from pymongo import MongoClient

app = Flask(__name__)
app.secret_key = "testing"

# MongoDB Connection
def MongoDB():
    client = MongoClient("mongodb://hassan:admin@webapp-shard-00-00.qk9uz.mongodb.net:27017,webapp-shard-00-01.qk9uz.mongodb.net:27017,webapp-shard-00-02.qk9uz.mongodb.net:27017/?ssl=true&replicaSet=atlas-c05ov6-shard-0&authSource=admin&retryWrites=true&w=majority&appName=webapp") 
    db = client.get_database('student_records')
    return db

db = MongoDB()
records = db.login_details
registration_form = db.registration  # New Collection

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    if 'email' in session:
        return render_template('dashboard.html')
    return redirect('/login')

@app.route('/register_student', methods=['POST'])
def register_student():
    if 'email' not in session:
        return jsonify({"status": "error", "message": "Unauthorized access. Please log in."})

    degree = request.form['degree']
    student_name = request.form['student_name']
    department = request.form['department']
    program = request.form['program']

    if not all([degree, student_name, department, program]):
        return jsonify({"status": "error", "message": "All fields are required."})

    registration_form.insert_one({
        "degree": degree,
        "student_name": student_name,
        "department": department,
        "program": program,
        "email": session['email']  # Link student to their account
    })

    return jsonify({"status": "success", "message": "Student registered successfully!"})

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = records.find_one({"email": email, "password": password})

        if user:
            session['email'] = email
            return jsonify({"status": "success", "message": "Login successful!", "redirect": "/dashboard"})
        else:
            return jsonify({"status": "error", "message": "Invalid email or password. Try again."})

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
