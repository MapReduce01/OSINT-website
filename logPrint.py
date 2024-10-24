def logprint(*args, **kwargs):
    with open("logfile.txt", "a") as f:
        print(*args, file=f, **kwargs)
    print(*args, **kwargs)