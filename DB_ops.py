from DB_Util.MongoDB_Util import *
import json
from pathlib import Path

def read_json(file_path):
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
    return data

def read_text(file_path):
    with open(file_path, 'r') as text_file:
        data = text_file.read()
    return data

def write_text(file_path, content):
    with open(file_path, 'w') as text_file:
        text_file.write(content)


def test_mongodb_operations(db_name="test", user_input="Simon Fraser University"):
    user_input = user_input.upper().replace(" ","")
    data_account=read_json(str(Path(__file__).parent / "json_temp" / "account.json"))
    data_Description=read_json(str(Path(__file__).parent / "json_temp" / "Description.json"))
    data_email=read_json(str(Path(__file__).parent / "json_temp" / "email.json"))
    data_github=read_json(str(Path(__file__).parent / "json_temp" / "github.json"))
    data_Insight=read_json(str(Path(__file__).parent / "json_temp" / "Insight.json"))
    data_ip=read_json(str(Path(__file__).parent / "json_temp" / "ip_safe_list.json"))
    data_censys=read_text(str(Path(__file__).parent / "txt_temp" / "censys_clear.txt"))
    data_email_b=read_text(str(Path(__file__).parent / "txt_temp" / "email_breaches.txt"))
    data_gleif=read_text(str(Path(__file__).parent / "txt_temp" / "gleif.txt"))

    data_to_save = {"_id":user_input,"org_name": user_input, "description": data_Description,"insight": data_Insight,"account": data_account,"email": data_email,"email_breaches": data_email_b,"ip_safe_list": data_ip,"github": data_github,"censys": data_censys,"gleif": data_gleif}

    db = MongoDBHandler(db_name="test")

    # data_1 = {"_id":"SIMONFRASERUNIVERSITY","org_name": "SIMONFRASERUNIVERSITY", "description": "des","insight": "ins","account": "acc","email": "em","email_breaches": "eb","ip_safe_list": "ip","github": "gh","censys": "cs","gleif": "gl"}
    # data_2 = {"org_name": "Amazon", "description": "des1","insight": "ins1","account": "acc1","email": "em1","email_breaches": "eb1","ip_safe_list": "ip1","github": "gh1","censys": "cs1","gleif": "gl1"}
    # data_list = [
    #     {"org_name": "Google", "description": "des2","insight": "ins2","account": "acc2","email": "em2","email_breaches": "eb2","ip_safe_list": "ip2","github": "gh2","censys": "cs2","gleif": "gl2"},
    #     {"org_name": "Microsoft", "description": "des3","insight": "ins3","account": "acc3","email": "em3","email_breaches": "eb3","ip_safe_list": "ip3","github": "gh3","censys": "cs3","gleif": "gl3"}
    # ]

    #single data
    print("\nTesting insert_data:")
    inserted_id_1 = db.insert_data(data_to_save)
    print(f"Inserted single document with ID: {inserted_id_1}")

    # multiple data
    # print("\nTesting insert_many:")
    # inserted_ids = db.insert_many(data_list)
    # print(f"Inserted multiple documents with IDs: {inserted_ids}")

    # Find documents
    # print("\nTesting find_data:")
    # query = {"org_name": user_input}
    # found_docs = str(db.find_data(query))
    # write_text("tttttt.txt",found_docs)
    # print(found_docs)
    # print(f"Documents found with query {query}:")
    # pprint.pprint(found_docs)

    # Update documents
    # print("\nTesting update_data:")
    # update_query = {"org_name": "SFU"}
    # update_fields = {"description": "des0"}
    # updated_count = db.update_data(update_query, update_fields)
    # print(f"Number of documents updated: {updated_count}")

    # Find updated document
    # print("\nTesting find_one after update:")
    # updated_doc = db.find_one(update_query)
    # print("Updated document:")
    # pprint.pprint(updated_doc)

    # Delete documents
    # print("\nTesting delete_data:")
    # delete_query = {"org_name": "Google"}
    # deleted_count = db.delete_data(delete_query)
    # print(f"Number of documents deleted: {deleted_count}")

    # Find documents after delete
    # print("\nTesting find_data after delete:")
    # remaining_docs = db.find_data()
    # print("Remaining documents in the collection:")
    # pprint.pprint(remaining_docs)

    # Close connection
    db.close_connection()

if __name__ == "__main__":
    test_mongodb_operations(db_name="test",user_input="Simon Fraser University")

