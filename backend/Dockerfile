FROM gcr.io/google_appengine/python

# Create a virtualenv for dependencies. This isolates these packages from
# system-level packages.
RUN virtualenv -p python3.7 /env

# Setting these environment variables are the same as running
# source /env/bin/activate.
ENV VIRTUAL_ENV /env
ENV PATH /env/bin:$PATH

WORKDIR /app

RUN apt-get update && apt-get install build-essential python3-dev libsm6 libxext6 ffmpeg libfontconfig1 libxrender1 libgl1-mesa-glx -y
ADD requirements.txt requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
RUN apt-get purge -y --auto-remove && apt-get purge -y --auto-remove && rm -rf /var/lib/apt/lists/*

ADD . .

ENTRYPOINT ["python", "/app/app.py"]