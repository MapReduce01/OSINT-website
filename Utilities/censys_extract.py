from pathlib import Path
import json

# def dict_to_string(d, indent=0):
#     result = ""
#     for key, value in d.items():
#         result += ' ' * indent + str(key) + ': '
#         if isinstance(value, dict):
#             result += '\n' + dict_to_string(value, indent + 4)
#         elif isinstance(value, list):
#             result += '[\n'
#             for item in value:
#                 result += ' ' * (indent + 4) + str(item) + '\n'
#             result += ' ' * indent + ']\n'
#         else:
#             result += str(value) + '\n'
#     return result
def dict_to_string(d, indent=0, top_level=True):
    result = ""
    indent_str = " " * indent  
    for key, value in d.items():
        if isinstance(value, dict):
            result += f"{indent_str}{key}:\n"
            result += dict_to_string(value, indent + 4, top_level=False)  
            result += "\n" 
        elif isinstance(value, list):
            result += f"{indent_str}{key}: [\n"
            for item in value:
                if isinstance(item, dict):
                    result += dict_to_string(item, indent + 4, top_level=False)
                    result += f"\n{indent_str}----\n" 
                else:
                    result += f"{indent_str}    {item}\n"
            result += f"{indent_str}]\n"
            result += "\n"  
        else:
            result += f"{indent_str}{key}: {value}\n"
    
    if top_level:
        result += "\n" + "="*40 + "\n"
    
    return result

def clean_dict(d):
    keys_to_delete = []
    
    for key, value in d.items():
        if isinstance(value, dict):
            clean_dict(value)
            if not value:
                keys_to_delete.append(key)
        elif isinstance(value, list):
            if not value:
                keys_to_delete.append(key)
        elif value is None:
            keys_to_delete.append(key)

    for key in keys_to_delete:
        del d[key]

def censys_extract (file_name):
    script_directory = Path(__file__).parent  
    target_folder = script_directory.parent / "txt_temp"  
    file_path = target_folder / "censys_clear.txt"

    target_folder.mkdir(parents=True, exist_ok=True)
    
    with open(str(file_path), 'w') as file:
        pass

    with open(file_name, 'r') as file:
        data = file.read()


    data = eval(data)
    for item in data:
        clean_dict(item)

        with open(str(file_path), 'a') as file:
            file.write(dict_to_string(item))

#test pls comment out when use
# censys_extract("censys.txt")