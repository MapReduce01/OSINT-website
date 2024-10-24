from openai_utilities import openai_query
import json

def save_string_to_json(category,gpt_result, filename):
    data = {category: gpt_result}
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    print(f'Saved to {filename}')

def save_string_to_txt(file_path, string_to_save):
    try:
        with open(file_path, "w") as file:
            file.write(string_to_save)
        print(f"String successfully saved to {file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

def gptAPI(query,category):
    gpt_result = openai_query(query)
    save_string_to_json(category, gpt_result, category+".json")
    save_string_to_txt(category+".txt",gpt_result)
    return gpt_result

