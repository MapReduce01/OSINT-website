
import json

def dict_to_string(d, indent=0):
    result = ""
    for key, value in d.items():
        result += ' ' * indent + str(key) + ': '
        if isinstance(value, dict):
            result += '\n' + dict_to_string(value, indent + 4)
        elif isinstance(value, list):
            result += '[\n'
            for item in value:
                result += ' ' * (indent + 4) + str(item) + '\n'
            result += ' ' * indent + ']\n'
        else:
            result += str(value) + '\n'
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

def gleif_extract (file, mode = 0):
    #if want to get the list of data from json, mode = 0

    with open(file, 'r') as file:
        data = file.read()

    print(type(data))
    data = eval(data)
    data_dict = json.loads(data)

    clean_dict(data_dict)

    with open('gleif.txt', 'w') as file:
        file.write(dict_to_string(data_dict))


gleif_extract("gleif.json")