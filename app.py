from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Load data from the specified JSON files
def load_data():
    with open('email.json', 'r') as email_file:
        email_data = json.load(email_file)

    with open('github.json', 'r') as github_file:
        github_data = json.load(github_file)

    # Combine both datasets into a single list
    combined_data = email_data + github_data
    return combined_data

@app.route('/api/search', methods=[''])
def search():
    query = request.args.get('query', '').lower()
    data = load_data()  # Load data from both files
    if not query:
        return jsonify(data)  # Return all combined data if no query is provided

    # Filter the combined dataset based on the query
    results = [item for item in data if query in str(item).lower()]
    return jsonify(results)

if __name__ == '__main__':
    app.run(port=3000, debug=True)
