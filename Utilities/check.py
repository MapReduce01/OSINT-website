from transformers import GPT2Tokenizer, GPT2LMHeadModel
from tqdm.auto import tqdm
import os
from dataset import read_jsonl
import sys 
from collections import Counter

zero_shot = 0
few_shot = 0
baseline = 0
zero_shot_my = 0
fine_tuning = 1
self_consistency = 1
few_shot_example = ""

def find_last_non_empty_letter_index(s):
    for i in range(len(s) - 1, -1, -1):
        if s[i].isalpha() and not s[i].isspace():
            return i
    return -1

model = GPT2LMHeadModel.from_pretrained('model_ckpts_medium_5k/')
tokenizer = GPT2Tokenizer.from_pretrained('gpt2-medium')

question = "In a mixture, the ratio of spirit and water is 3:2. If the amount of spirit is 3 litre more than amount of water, calculate the amount of spirit in mixture? A)80 B)100 C)84 D)87.5 E)None of these"

if baseline == 1:
  model_base = GPT2LMHeadModel.from_pretrained('gpt2')
  input_ids = tokenizer.encode(question, return_tensors='pt')

  output = model_base.generate(input_ids, max_length=300, num_return_sequences=1,no_repeat_ngram_size =1,temperature=0.8,top_k = 10,do_sample = True)

  generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

  print(generated_text)
  sys.exit()

# fine tuning
if fine_tuning == 1:
  sum = 0
  account = 0
  path = os.path.join("data/", f"dev.jsonl")
  examples = read_jsonl(path)
  prompt = "Let's think step by step"
  # prompt = ""
  file_path = 'output/output_finetuning_medium_CoT.txt'
  file_path1 = 'output/output_finetuning_self_medium_CoT.txt'
  #cover the old file
  text_to_write = ""
  with open(file_path, 'w') as file:
    file.write(text_to_write)
  
  text_to_write = ""
  with open(file_path1, 'w') as file:
    file.write(text_to_write)

  for index, ex in enumerate(tqdm(examples)):
    if index == 23:
      break
    ex.update(question=ex["question"]+"\n" + "".join(ex["options"])+"\n"+prompt)
    # ex.update(answer=ex["rationale"] + "<|endoftext|>")
    input_ids = tokenizer.encode(ex["question"], return_tensors='pt')

    output = model.generate(input_ids, max_length=300, num_return_sequences=3,no_repeat_ngram_size =2,temperature=1.5,top_k = 10,do_sample = True)
    if(self_consistency == 1):
      list_letter = []
      generated_text1 = tokenizer.decode(output[0], skip_special_tokens=True)
      index1 = find_last_non_empty_letter_index(generated_text1)
      list_letter.append( generated_text1[index1])
      generated_text2 = tokenizer.decode(output[1], skip_special_tokens=True)
      index2 = find_last_non_empty_letter_index(generated_text2)
      list_letter.append( generated_text2[index2])
      generated_text3 = tokenizer.decode(output[2], skip_special_tokens=True)
      index3 = find_last_non_empty_letter_index(generated_text3)
      list_letter.append( generated_text3[index3])
      counter = Counter(list_letter)
      most_common_elements = counter.most_common()
      answer = [element for element, count in most_common_elements]
      answer = answer[0]
      with open(file_path1, 'a') as file:
        file.write("=====================================================\n")
        file.write(answer+"\n")
      if (ex["correct"] == answer):
        account = account +1
      sum = sum+1
      with open('acc_self_medium_CoT.txt', 'w') as file:
        file.write(str(account/sum))
    else:
      generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
      # print("=====================================================")
      with open(file_path, 'a') as file:
        file.write("=====================================================\n")
        file.write(generated_text+"\n")
      # print(generated_text)
      index = find_last_non_empty_letter_index(generated_text)
      answer = generated_text[index]
      # print(generated_text[index])
      if (ex["correct"] == answer):
        account = account +1
      sum = sum+1
      with open('acc_CoT.txt', 'w') as file:
        file.write(str(account/sum))
  sys.exit()

#few shot CoT if we want to do self consistancy we just need to reqeat this with different prompts we used there
if few_shot == 1:
  path_sample = os.path.join("data/", f"train_small.jsonl")
  examples_sample = read_jsonl(path_sample)
  for index, ex in enumerate(tqdm(examples_sample)):
    if index < 2:
      few_shot_example += ex["question"] + "\n" +"".join(ex["options"]) +"\n" +ex["correct"]+"\n"
      
  sum = 0
  account = 0
  path = os.path.join("data/", f"dev.jsonl")
  examples = read_jsonl(path)
  prompt = "Let's think step by step"
  prompt = ""
  file_path = 'output/output_finetuning_few_medium.txt'
  file_path1 = 'output/output_finetuning_self_CoT_medium.txt'
  #cover the old file
  text_to_write = ""
  with open(file_path, 'w') as file:
    file.write(text_to_write)
  
  text_to_write = ""
  with open(file_path1, 'w') as file:
    file.write(text_to_write)

  for index, ex in enumerate(tqdm(examples)):
    if index == 23:
      break
    ex.update(question=few_shot_example+ex["question"]+"\n" + "".join(ex["options"])+"\n"+prompt)
    # ex.update(answer=ex["rationale"] + "<|endoftext|>")
    input_ids = tokenizer.encode(ex["question"], return_tensors='pt')

    output = model.generate(input_ids, max_length=500, num_return_sequences=3,no_repeat_ngram_size =2,temperature=1.5,top_k = 10,do_sample = True)
    if(self_consistency == 1):
      list_letter = []
      generated_text1 = tokenizer.decode(output[0], skip_special_tokens=True)
      index1 = find_last_non_empty_letter_index(generated_text1)
      list_letter.append( generated_text1[index1])
      generated_text2 = tokenizer.decode(output[1], skip_special_tokens=True)
      index2 = find_last_non_empty_letter_index(generated_text2)
      list_letter.append( generated_text2[index2])
      generated_text3 = tokenizer.decode(output[2], skip_special_tokens=True)
      index3 = find_last_non_empty_letter_index(generated_text3)
      list_letter.append( generated_text3[index3])
      counter = Counter(list_letter)
      most_common_elements = counter.most_common()
      answer = [element for element, count in most_common_elements]
      answer = answer[0]
      with open(file_path1, 'a') as file:
        file.write("=====================================================\n")
        file.write(answer+"\n")
      if (ex["correct"] == answer):
        account = account +1
      sum = sum+1
      with open('acc_self_few_medium.txt', 'w') as file:
        file.write(str(account/sum))
    else:
      generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
      # print("=====================================================")
      with open(file_path, 'a') as file:
        file.write("=====================================================\n")
        file.write(generated_text+"\n")
      # print(generated_text)
      index = find_last_non_empty_letter_index(generated_text)
      answer = generated_text[index]
      # print(generated_text[index])
      if (ex["correct"] == answer):
        account = account +1
      sum = sum+1
      with open('acc_few_medium.txt', 'w') as file:
        file.write(str(account/sum))
  sys.exit()

#zero shot CoT
if zero_shot == 1:
  #step 1
  prompt_text1 = " Let's think step by step."

  input_ids = tokenizer.encode(question + prompt_text1, return_tensors='pt')

  output = model.generate(input_ids, max_length=100, num_return_sequences=1)

  generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
  #step 2
  prompt_text2 = "So the anwser is: "

  input_ids = tokenizer.encode(generated_text + prompt_text2, return_tensors='pt')

  output = model.generate(input_ids, max_length=200, num_return_sequences=1)

  generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

  print(generated_text)
  sys.exit()

#zero shot CoT with my idea use "!python train_CoT.py" first to get the 2 models we used here
if zero_shot_my == 1:
  file_path = 'output/output_finetuning_CoT_My.txt'
  #cover the old file
  text_to_write = ""
  with open(file_path, 'w') as file:
    file.write(text_to_write)
  sum = 0
  account = 0
  path = os.path.join("data/", f"dev.jsonl")
  examples = read_jsonl(path)
  for index, ex in enumerate(tqdm(examples)):
    if index == 23:
      break
    ex.update(question=ex["question"]+"\n")
    # ex.update(answer=ex["rationale"] + "<|endoftext|>")
    input_ids = tokenizer.encode(ex["question"], return_tensors='pt')
    model = GPT2LMHeadModel.from_pretrained('model_CoT_step/')
    output = model.generate(input_ids, max_length=300, num_return_sequences=1,no_repeat_ngram_size =2,temperature=1.5,top_k = 10,do_sample = True)

    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
    input_ids = tokenizer.encode(generated_text+"\n".join(ex["options"])+"Please choose a letter from the option list to match the answer.\n", return_tensors='pt')
    model = GPT2LMHeadModel.from_pretrained('model_CoT_answer/')
    output = model.generate(input_ids, max_length=400, num_return_sequences=3,no_repeat_ngram_size =2,temperature=1.5,top_k = 10,do_sample = True)

    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
    with open(file_path, 'a') as file:
      file.write(generated_text)
    index = find_last_non_empty_letter_index(generated_text)
    answer = generated_text[index]
    if (ex["correct"] == answer):
      account = account +1
    sum = sum+1
    with open('acc_CoT_My.txt', 'w') as file:
      file.write(str(account/sum))
  sys.exit()