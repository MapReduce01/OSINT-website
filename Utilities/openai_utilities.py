from openai import OpenAI
import json

with open("openai_key.txt", 'r') as file:
    gptkey = file.read()

def openai_query(query):
    client = OpenAI(api_key=gptkey)

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": query}
    ]
    )
    return (completion.choices[0].message.content)

def query_about_file(file_path, question):
    # Set up your OpenAI API key
    client = OpenAI(api_key=gptkey)
    
    # Load and format the JSON file
    with open(file_path, 'r') as file:
        json_data = json.load(file)
    
    # Convert the JSON data to a string format for the prompt
    json_content = json.dumps(json_data, indent=2)
    
    # Formulate the prompt for OpenAI
    prompt = f"The following is the content of a JSON file:\n{json_content}\n\nNow, answer the following question based on this JSON content:\n{question}"

    # Query OpenAI's GPT-3 model (or another model like GPT-4 if available)
    completion = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
        # max_tokens=500,  # Adjust based on expected response length
        # temperature=0.7
    )
    
    return (completion.choices[0].message.content)


