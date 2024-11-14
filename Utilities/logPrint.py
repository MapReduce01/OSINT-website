from datetime import datetime

def logprint(*args, **kwargs):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  
    with open("logfile.txt", "a") as f:
        print(f"{timestamp}:", *args, file=f, **kwargs)  
    print(f"{timestamp}:", *args, **kwargs)  