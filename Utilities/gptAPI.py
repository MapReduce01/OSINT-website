from openai_utilities import openai_query
import json
from logPrint import logprint
from pathlib import Path

def save_string_to_json(category,gpt_result):
    data = {category: gpt_result}
    #with open(filename, 'w') as json_file:
        #json.dump(data, json_file, indent=4)
    #logprint(f'Saved to {filename}')
    return data

def save_string_to_txt(file_path, string_to_save):
    try:
        with open(file_path, "w") as file:
            file.write(string_to_save)
        logprint(f"String successfully saved to {file_path}")
    except Exception as e:
        logprint(f"An error occurred: {e}")

def gptAPI(query,category):
    gpt_result = openai_query(query)

    script_directory = Path(__file__).parent  
    #target_folder = script_directory.parent / "json_temp"  
    #json_name = category+".json"
    #file_path = target_folder / json_name
    #target_folder.mkdir(parents=True, exist_ok=True)

    result_json = save_string_to_json(category, gpt_result)

    #target_folder2 = script_directory.parent / "txt_temp"
    #txt_name = category+".txt"
    #file_path2 = target_folder2 / txt_name
    #target_folder2.mkdir(parents=True, exist_ok=True)

    #save_string_to_txt(file_path2,gpt_result)
    return result_json

# des_query = "give me an overview of " + "Simon Fraser University"
# print(gptAPI(des_query,"Description"))

